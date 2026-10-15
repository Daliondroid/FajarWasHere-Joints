/** /api/test-drive: soal berlapis, reveal jawaban, refleksi (T-14, F-11, Hal. 13). */
import { galatTidakDitemukan, galatTidakLogin, galatValidasi } from '@/lib/api/galat';
import { validasiIdProdi, validasiJawabTestDrive, validasiRefleksi } from '@/lib/api/validasi';
import type {
  RealityCheck,
  ResponsJawabTestDrive,
  ResponsRefleksiTestDrive,
  ResponsTestDrive,
  SoalTestDrive,
} from '@/types';
import { ambilSerumpun, hitungFallback, keRingkas } from './prodi';
import type { DetailTambahan, Repo } from './repo';
import type { RepoAkun } from './repo_akun';
import type { BarisSoal, RepoTestDrive } from './repo_test_drive';

export const DURASI_DETIK = 60;
const MAKS_SOAL = 3;
const MAKS_KOMPETENSI = 3;

/** Acak Fisher–Yates; `acak` bisa disuntik agar test deterministik. */
export function acakUrutan<T>(daftar: T[], acak: () => number = Math.random): T[] {
  const hasil = [...daftar];
  for (let i = hasil.length - 1; i > 0; i--) {
    const j = Math.floor(acak() * (i + 1));
    [hasil[i], hasil[j]] = [hasil[j], hasil[i]];
  }
  return hasil;
}

/**
 * Soal berlapis (PRD Hal. 13): 1 soal spesifik kampus (atau umum bila tidak ada), 1 soal rumpun,
 * lalu 1 cadangan dari sisa soal prodi atau rumpun. Maks 3.
 */
export function pilihSoal(baris: BarisSoal[], acak: () => number = Math.random): BarisSoal[] {
  const spesifik = acakUrutan(baris.filter((b) => b.lapisan === 'spesifik'), acak);
  const umum = acakUrutan(baris.filter((b) => b.lapisan === 'umum'), acak);
  const rumpun = acakUrutan(baris.filter((b) => b.lapisan === 'rumpun'), acak);
  const prodi = spesifik.length ? spesifik : umum;
  const dipilih = [prodi.shift(), rumpun.shift()].filter((b): b is BarisSoal => !!b);
  // Soal umum sering berteks sama (hanya opsi berbeda); cadangan harus berteks lain agar tidak terasa diulang.
  const teksDipakai = new Set(dipilih.map((b) => b.soal));
  const cadangan = prodi.find((b) => !teksDipakai.has(b.soal)) ?? rumpun.shift();
  if (cadangan) dipilih.push(cadangan);
  return dipilih.slice(0, MAKS_SOAL);
}

export function keSoal(b: BarisSoal): SoalTestDrive {
  return {
    id_soal: b.id_soal,
    lapisan: b.lapisan,
    pertanyaan: b.soal,
    opsi: { A: b.opsi_a, B: b.opsi_b, C: b.opsi_c, D: b.opsi_d },
    sumber: b.sumber,
    status: b.status,
    label_data: 'soal',
  };
}

/** Pilih 2–3 butir kompetensi yang berupa kalimat utuh (data PDDikti kadang terpotong di tengah kalimat). */
export function pilihKompetensi(kompetensi: string[], capaian: string[] = []): string[] {
  const rapi = (s: string) => s.replace(/\s+/g, ' ').trim();
  const utuh = (s: string) => /^[A-Z0-9]/.test(s) && s.length >= 25 && s.length <= 300;
  const kandidat = [...kompetensi, ...capaian].map(rapi);
  const bagus = kandidat.filter(utuh);
  return [...new Set(bagus.length ? bagus : kandidat.filter((s) => s.length >= 25))].slice(0, MAKS_KOMPETENSI);
}

export function realityCheck(ringkas: ReturnType<typeof keRingkas>, tambahan: DetailTambahan): RealityCheck {
  return {
    kompetensi_lulusan: tambahan.profil ? pilihKompetensi(tambahan.profil.kompetensi, tambahan.profil.capaian_belajar) : [],
    fakta_kampus: tambahan.pddikti && {
      akreditasi: tambahan.pddikti.akreditasi,
      rasio_dosen_mhs: tambahan.pddikti.rasio_dosen_mhs,
      rata_masa_studi_th: tambahan.pddikti.rata_masa_studi_th,
      label_data: 'resmi',
    },
    fakta_persaingan: {
      daya_tampung_snbp_2026: ringkas.daya_tampung_snbp_2026,
      daya_tampung_snbt_2026: ringkas.daya_tampung_snbt_2026,
      keketatan_snbp: ringkas.keketatan_snbp,
      keketatan_snbt: ringkas.keketatan_snbt,
    },
  };
}

export async function layananTestDrive(
  sp: URLSearchParams,
  repo: Repo,
  repoTd: RepoTestDrive,
  acak: () => number = Math.random,
): Promise<ResponsTestDrive> {
  const mentah = sp.get('id_prodi');
  if (mentah === null) throw galatValidasi('Isi parameter id_prodi.');
  const id = validasiIdProdi(mentah);
  const [b] = await repo.prodiByIds([id]);
  if (!b) throw galatTidakDitemukan(`Prodi ${id} tidak ditemukan.`);
  const [soal, tambahan, serumpun] = await Promise.all([
    repoTd.soalUntukProdi(id, b.rumpun_id),
    repo.detailTambahan(id),
    ambilSerumpun([b], repo),
  ]);
  const ringkas = keRingkas(b, hitungFallback(b, serumpun));
  return {
    prodi: { id_prodi: b.id_prodi, nama_prodi: b.nama, nama_ptn: b.nama_ptn, jenjang: b.jenjang, rumpun_id: b.rumpun_id, rumpun: b.rumpun },
    soal: pilihSoal(soal, acak).map(keSoal),
    reality_check: realityCheck(ringkas, tambahan),
    durasi_detik: DURASI_DETIK,
  };
}

/** Penilaian jawaban. Soal harus milik prodi itu atau rumpunnya. Dicatat ke riwayat jika login. */
export async function layananJawabTestDrive(
  idSesi: string | null,
  badan: unknown,
  deps: { repo: Repo; repoTd: RepoTestDrive; repoAkun: RepoAkun },
): Promise<ResponsJawabTestDrive> {
  const req = validasiJawabTestDrive(badan);
  const [soal, [prodi]] = await Promise.all([deps.repoTd.soalById(req.id_soal), deps.repo.prodiByIds([req.id_prodi])]);
  if (!prodi) throw galatTidakDitemukan(`Prodi ${req.id_prodi} tidak ditemukan.`);
  if (!soal) throw galatTidakDitemukan(`Soal ${req.id_soal} tidak ditemukan.`);
  const milikProdi = soal.id_prodi === prodi.id_prodi || (soal.lapisan === 'rumpun' && soal.rumpun_id === prodi.rumpun_id);
  if (!milikProdi) throw galatValidasi('Soal ini bukan bagian Test Drive prodi tersebut.');

  const benar = req.jawaban === soal.kunci;
  let tersimpan = false;
  if (idSesi && (await deps.repoAkun.ambilPengguna(idSesi))) {
    await deps.repoTd.simpanJawaban(idSesi, { id_prodi: prodi.id_prodi, id_soal: soal.id_soal, jawaban: req.jawaban, benar });
    tersimpan = true;
  }
  return { id_soal: soal.id_soal, benar, kunci: soal.kunci, pembahasan: soal.pembahasan, tersimpan };
}

export async function layananRefleksiTestDrive(
  idSesi: string | null,
  badan: unknown,
  deps: { repo: Repo; repoTd: RepoTestDrive; repoAkun: RepoAkun },
): Promise<ResponsRefleksiTestDrive> {
  if (!idSesi || !(await deps.repoAkun.ambilPengguna(idSesi))) throw galatTidakLogin();
  const req = validasiRefleksi(badan);
  const [prodi] = await deps.repo.prodiByIds([req.id_prodi]);
  if (!prodi) throw galatTidakDitemukan(`Prodi ${req.id_prodi} tidak ditemukan.`);
  await deps.repoTd.simpanRefleksi(idSesi, prodi.id_prodi, req.refleksi);
  return { tersimpan: true };
}
