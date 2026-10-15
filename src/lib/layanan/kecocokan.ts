/** POST /api/kecocokan: skor RIASEC siswa lalu peringkat kecocokan ke prodi. */
import { galatValidasi } from '@/lib/api/galat';
import { validasiKecocokan } from '@/lib/api/validasi';
import {
  cIndex,
  kecocokan,
  kodeHolland,
  kodeHollandSeri,
  OPSI_HOBI,
  profilDatar,
  SKALA,
  skorHobi,
  skorMinat,
  type ProfilRiasec,
} from '@/lib/skoring';
import type { HasilKecocokanProdi, PermintaanKecocokan, ResponsKecocokan } from '@/types';
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

/** Urutkan: skor ↓, mapel favorit cocok ↓, C-index ↓, id_prodi ↑. */
export function bandingkanHasil(a: HasilKecocokanProdi, b: HasilKecocokanProdi): number {
  return b.skor - a.skor || b.mapel_favorit_cocok - a.mapel_favorit_cocok || b.c_index - a.c_index || a.id_prodi - b.id_prodi;
}

export async function layananKecocokan(badan: unknown, repo: Repo): Promise<ResponsKecocokan> {
  const req = validasiKecocokan(badan);
  const items = await repo.itemMinat();

  const idItem = new Set(items.map((it) => it.item_id));
  const asing = Object.keys(req.jawaban_minat).filter((k) => !idItem.has(k));
  if (asing.length) throw galatValidasi(`item_id tidak dikenal: ${asing.slice(0, 5).join(', ')}.`);
  const idHobi = new Set(OPSI_HOBI.map((o) => o.id));
  const hobiAsing = req.chip_hobi!.filter((h) => !idHobi.has(h));
  if (hobiAsing.length) throw galatValidasi(`chip_hobi tidak dikenal: ${hobiAsing.join(', ')}.`);

  const skor = skorMinat(req.jawaban_minat, items, req.mode);
  const kosong = SKALA.filter((s) => skor[s] === null);
  if (kosong.length) throw galatValidasi(`Setiap skala RIASEC butuh minimal 1 jawaban (kosong: ${kosong.join(', ')}).`);
  const profil = skor as ProfilRiasec;
  const kode = kodeHolland(profil);

  const peringatan: string[] = [];
  const nilai = Object.values(req.jawaban_minat);
  if (profilDatar(profil)) peringatan.push('Profil minat belum jelas; coba mode 60 item.');
  if (nilai.length > 1 && nilai.every((v) => v === nilai[0])) peringatan.push('Semua jawaban sama (pola seragam).');
  if (kodeHollandSeri(profil)) peringatan.push('Ada skor seri pada kode Holland; pilih huruf yang paling menggambarkan dirimu.');

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
