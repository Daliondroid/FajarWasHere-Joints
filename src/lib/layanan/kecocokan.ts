/** POST /api/kecocokan: skor RIASEC siswa lalu peringkat kecocokan ke prodi. */
import { validasiKecocokan } from '@/lib/api/validasi';
import { cIndex, kecocokan, kodeHollandSeri, profilDatar, skorHobi, type ProfilRiasec } from '@/lib/skoring';
import type { HasilKecocokanProdi, PermintaanKecocokan, RefleksiTestDrive, ResponsKecocokan } from '@/types';
import { hitungProfilMinat } from './minat';
import { daftarMapel } from './prodi';
import type { BarisProdi, Repo } from './repo';

function lolosFilter(b: BarisProdi, f: PermintaanKecocokan['filter']): boolean {
  if (!f) return true;
  return (
    (f.rumpun_id === undefined || b.rumpun_id === f.rumpun_id) &&
    (f.jenjang === undefined || b.jenjang === f.jenjang) &&
    (f.kelompok === undefined || b.kelompok === f.kelompok) &&
    (f.klaster_id === undefined || b.klaster_id === f.klaster_id) &&
    (f.kode_bps === undefined || b.kode_bps_ptn === f.kode_bps || b.kode_bps_ptn_2 === f.kode_bps) &&
    (f.id_ptn === undefined || b.id_ptn === f.id_ptn) &&
    (f.id_prodi === undefined || f.id_prodi.includes(b.id_prodi))
  );
}

/** Jumlah mapel favorit yang termasuk mapel pendukung prodi (tie-breaker BR-10). */
export function jumlahMapelCocok(mapelProdi: string | null, favorit: string[]): number {
  const pendukung = new Set(daftarMapel(mapelProdi).map((m) => m.toLowerCase()));
  return favorit.filter((m) => pendukung.has(m.trim().toLowerCase())).length;
}

const NILAI_REFLEKSI: Record<RefleksiTestDrive, number> = { seru: 1, melelahkan: -1 };
const nilaiRefleksi = (r: RefleksiTestDrive | null) => (r ? NILAI_REFLEKSI[r] : 0);

/** Urutkan: skor ↓, mapel favorit cocok ↓, refleksi Test Drive (seru > kosong > melelahkan), C-index ↓, id_prodi ↑. */
export function bandingkanHasil(a: HasilKecocokanProdi, b: HasilKecocokanProdi): number {
  return (
    b.skor - a.skor ||
    b.mapel_favorit_cocok - a.mapel_favorit_cocok ||
    nilaiRefleksi(b.refleksi) - nilaiRefleksi(a.refleksi) ||
    b.c_index - a.c_index ||
    a.id_prodi - b.id_prodi
  );
}

/**
 * @param refleksiSesi refleksi tersimpan milik pengguna login; dipakai bila badan tidak membawa `refleksi`.
 */
export async function layananKecocokan(
  badan: unknown,
  repo: Repo,
  refleksiSesi?: () => Promise<Record<string, RefleksiTestDrive>>,
): Promise<ResponsKecocokan> {
  const req = validasiKecocokan(badan);
  const { profil, kode } = hitungProfilMinat(req.jawaban_minat, req.mode!, req.chip_hobi!, await repo.itemMinat());

  const peringatan: string[] = [];
  const nilai = Object.values(req.jawaban_minat);
  if (profilDatar(profil)) peringatan.push('Profil minat belum jelas; coba mode 60 item.');
  if (nilai.length > 1 && nilai.every((v) => v === nilai[0])) peringatan.push('Semua jawaban sama (pola seragam).');
  if (kodeHollandSeri(profil)) peringatan.push('Ada skor seri pada kode Holland; pilih huruf yang paling menggambarkan dirimu.');

  const refleksi = req.refleksi ?? (refleksiSesi ? await refleksiSesi() : {});
  const prodi = (await repo.semuaProdi()).filter((b) => lolosFilter(b, req.filter));
  const hasil = prodi
    .map((b): HasilKecocokanProdi => {
      const vektor: ProfilRiasec = { R: b.r, I: b.i, A: b.a, S: b.s, E: b.e, C: b.c };
      const k = kecocokan(profil, vektor, skorHobi(req.chip_hobi!, vektor));
      return {
        id_prodi: b.id_prodi,
        nama_prodi: b.nama,
        id_ptn: b.id_ptn,
        nama_ptn: b.nama_ptn,
        jenjang: b.jenjang,
        rumpun_id: b.rumpun_id,
        kode_holland: b.kode_holland,
        skor: k.skor,
        label: k.label,
        skor_profil: Math.round(k.skor_profil * 10) / 10,
        skor_hobi: k.skor_hobi === null ? null : Math.round(k.skor_hobi * 10) / 10,
        c_index: cIndex(kode, b.kode_holland),
        mapel_favorit_cocok: jumlahMapelCocok(b.mapel_pendukung_snbp, req.mapel_favorit!),
        refleksi: refleksi[String(b.id_prodi)] ?? null,
      };
    })
    .sort(bandingkanHasil);

  return {
    skor_riasec: profil,
    kode_holland: kode,
    kode_holland_seri: kodeHollandSeri(profil),
    profil_datar: profilDatar(profil),
    peringatan,
    total_dibandingkan: hasil.length,
    hasil: hasil.slice(0, req.batas),
  };
}
