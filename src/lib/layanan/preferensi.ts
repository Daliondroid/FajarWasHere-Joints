/**
 * /api/preferensi: banyak preferensi per akun, tepat satu aktif (T-18; PRD 2.2 F-18, F-19, BR-16, BR-17).
 * Semua fungsi wajib login; sesi milik akun yang sudah dihapus dianggap belum login.
 */
import { galatTidakDitemukan, galatTidakLogin, galatValidasi } from '@/lib/api/galat';
import { validasiIsiPreferensi, validasiNamaPreferensi } from '@/lib/api/validasi';
import { ATURAN, validasiJalur } from '@/lib/skoring';
import type {
  IsiPreferensi,
  PreferensiRingkas,
  ResponsDaftarPreferensi,
  ResponsHapusPreferensi,
  ResponsPreferensi,
  TryOut,
} from '@/types';
import { peringkatProdi } from './kecocokan';
import { hitungProfilMinat } from './minat';
import type { Repo } from './repo';
import type { RepoAkun, SimpanPreferensi } from './repo_akun';

const POLA_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Sesi valid hanya jika penggunanya masih ada (token lama bisa tersisa setelah akun dihapus). */
async function wajibPengguna(idSesi: string | null, repo: RepoAkun): Promise<string> {
  if (!idSesi || !(await repo.ambilPengguna(idSesi))) throw galatTidakLogin();
  return idSesi;
}

function validasiIdPreferensi(id: string): string {
  if (!POLA_UUID.test(id)) throw galatValidasi('id preferensi tidak valid.');
  return id;
}

/** Rata-rata subtes yang terisi pada try out terbaru (dipakai /api/peluang SNBT). */
export function skorToTerbaru(riwayat: TryOut[]): number | null {
  const terbaru = [...riwayat].sort((a, b) => b.tanggal.localeCompare(a.tanggal))[0];
  if (!terbaru) return null;
  const nilai = Object.values(terbaru.skor).filter((v): v is number => typeof v === 'number');
  return nilai.length ? Math.round((nilai.reduce((a, b) => a + b, 0) / nilai.length) * 10) / 10 : null;
}

/** BR-11 saat memilih jalur (BR-17). */
export function cekJalurPreferensi(p: IsiPreferensi, tahunAcuan: number = ATURAN.tahun_acuan): void {
  const { tahun_lulus, pernah_lulus_snbp } = p.kelulusan;
  if (p.jalur === 'snbp' && tahun_lulus !== null) {
    const j = validasiJalur({ tahun_lulus }, tahunAcuan);
    if (!j.boleh_snbp) throw galatValidasi(j.alasan[0] ?? 'Tidak memenuhi syarat SNBP.');
  }
  if (p.jalur === 'snbt') {
    const j = validasiJalur({ tahun_lulus: tahun_lulus ?? tahunAcuan, lulus_snbp_tahun: pernah_lulus_snbp ? tahunAcuan : null }, tahunAcuan);
    if (!j.boleh_snbt) throw galatValidasi(j.alasan.find((a) => a.includes('SNBT')) ?? 'Tidak memenuhi syarat SNBT.');
  }
}

/** Validasi isi + hitung RIASEC + cek sekolah & kampus alumni. */
async function siapkanSimpan(badan: unknown, repo: RepoAkun): Promise<SimpanPreferensi> {
  const p = validasiIsiPreferensi(badan);
  cekJalurPreferensi(p);
  const { profil, kode } = hitungProfilMinat(p.minat.jawaban_minat, p.minat.mode, p.minat.chip_hobi, await repo.itemMinat());

  let kodeKab: string | null = null;
  if (p.akademik?.npsn) {
    kodeKab = await repo.kodeKabSekolah(p.akademik.npsn);
    if (kodeKab === null) throw galatTidakDitemukan(`Sekolah dengan NPSN ${p.akademik.npsn} tidak ditemukan.`);
  }
  if (p.akademik?.kampus_alumni.length) {
    const ada = new Set(await repo.idPtnAda(p.akademik.kampus_alumni));
    const asing = p.akademik.kampus_alumni.filter((id) => !ada.has(id));
    if (asing.length) throw galatValidasi(`kampus_alumni tidak dikenal: ${asing.join(', ')}.`);
  }
  return { ...p, skor_riasec: profil, kode_holland: kode, akademik: p.akademik && { ...p.akademik, kode_kab: kodeKab } };
}

async function detail(penggunaId: string, id: string, repo: RepoAkun): Promise<ResponsPreferensi> {
  const d = await repo.ambilPreferensi(penggunaId, id);
  if (!d) throw galatTidakDitemukan('Preferensi tidak ditemukan.');
  return { data: { ...d, skor_to_terbaru: skorToTerbaru(d.riwayat_to) } };
}

export async function layananDaftarPreferensi(
  idSesi: string | null,
  repo: RepoAkun,
  repoProdi: Repo,
): Promise<ResponsDaftarPreferensi> {
  const id = await wajibPengguna(idSesi, repo);
  const baris = await repo.daftarPreferensi(id);
  const prodi = baris.length ? await repoProdi.semuaProdi() : [];
  return {
    data: baris.map((b): PreferensiRingkas => {
      const [teratas] = peringkatProdi(b.skor_riasec, b.kode_holland, b.chip_hobi, b.mapel_favorit, prodi);
      return {
        id: b.id,
        nama: b.nama,
        jalur: b.jalur,
        aktif: b.aktif,
        kode_holland: b.kode_holland,
        rekomendasi_teratas: teratas
          ? { id_prodi: teratas.id_prodi, nama_prodi: teratas.nama_prodi, nama_ptn: teratas.nama_ptn, skor: teratas.skor }
          : null,
        diperbarui_pada: b.diperbarui_pada,
      };
    }),
  };
}

export async function layananBuatPreferensi(idSesi: string | null, badan: unknown, repo: RepoAkun): Promise<ResponsPreferensi> {
  const penggunaId = await wajibPengguna(idSesi, repo);
  const data = await siapkanSimpan(badan, repo);
  const id = await repo.simpanPreferensi(penggunaId, null, data);
  if (!id) throw new Error('Preferensi gagal dibuat.');
  return detail(penggunaId, id, repo);
}

export async function layananAmbilPreferensi(idSesi: string | null, id: string, repo: RepoAkun): Promise<ResponsPreferensi> {
  return detail(await wajibPengguna(idSesi, repo), validasiIdPreferensi(id), repo);
}

/** Preferensi aktif; data null bila akun belum punya preferensi. */
export async function layananPreferensiAktif(idSesi: string | null, repo: RepoAkun): Promise<ResponsPreferensi> {
  const penggunaId = await wajibPengguna(idSesi, repo);
  const id = await repo.idPreferensiAktif(penggunaId);
  return id ? detail(penggunaId, id, repo) : { data: null };
}

export async function layananUbahPreferensi(
  idSesi: string | null,
  id: string,
  badan: unknown,
  repo: RepoAkun,
): Promise<ResponsPreferensi> {
  const penggunaId = await wajibPengguna(idSesi, repo);
  validasiIdPreferensi(id);
  const lama = await repo.ambilPreferensi(penggunaId, id);
  if (!lama) throw galatTidakDitemukan('Preferensi tidak ditemukan.');
  const data = await siapkanSimpan(badan, repo);
  if (data.jalur !== lama.jalur) {
    throw galatValidasi('Jalur preferensi tidak bisa diubah; buat preferensi baru untuk jalur lain.');
  }
  await repo.simpanPreferensi(penggunaId, id, data);
  return detail(penggunaId, id, repo);
}

export async function layananGantiNamaPreferensi(
  idSesi: string | null,
  id: string,
  badan: unknown,
  repo: RepoAkun,
): Promise<ResponsPreferensi> {
  const penggunaId = await wajibPengguna(idSesi, repo);
  validasiIdPreferensi(id);
  const nama = validasiNamaPreferensi(typeof badan === 'object' && badan !== null ? (badan as { nama?: unknown }).nama : undefined);
  if (!(await repo.gantiNamaPreferensi(penggunaId, id, nama))) throw galatTidakDitemukan('Preferensi tidak ditemukan.');
  return detail(penggunaId, id, repo);
}

export async function layananAktifkanPreferensi(idSesi: string | null, id: string, repo: RepoAkun): Promise<ResponsPreferensi> {
  const penggunaId = await wajibPengguna(idSesi, repo);
  validasiIdPreferensi(id);
  if (!(await repo.aktifkanPreferensi(penggunaId, id))) throw galatTidakDitemukan('Preferensi tidak ditemukan.');
  return detail(penggunaId, id, repo);
}

export async function layananHapusPreferensi(idSesi: string | null, id: string, repo: RepoAkun): Promise<ResponsHapusPreferensi> {
  const penggunaId = await wajibPengguna(idSesi, repo);
  validasiIdPreferensi(id);
  if (!(await repo.hapusPreferensi(penggunaId, id))) throw galatTidakDitemukan('Preferensi tidak ditemukan.');
  return { terhapus: true, id_aktif: await repo.idPreferensiAktif(penggunaId) };
}
