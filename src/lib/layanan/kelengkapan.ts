/**
 * Kelengkapan bahan akademik sebelum rekomendasi dihitung (T-30). Murni, dipakai server (/api/rekomendasi)
 * dan klien (wizard preferensi) agar aturannya sama.
 *
 * SNBP wajib: sekolah (NPSN), rata-rata rapor smt 1–5, peringkat paralel. Nilai TKA dan prestasi tetap opsional
 * (TKA belum tentu sudah keluar saat siswa mengisi; mesin peluang menandainya sendiri).
 * SNBT wajib: minimal satu skor subtes try out.
 */
import type { AkademikSnbp, JalurPreferensi, TryOut } from '@/types';

export interface BahanPreferensi {
  jalur: JalurPreferensi;
  akademik: AkademikSnbp | null;
  riwayat_to: TryOut[];
}

export const LABEL_BAHAN = {
  sekolah: 'Sekolah (NPSN)',
  rapor: 'Rata-rata rapor semester 1–5',
  peringkat: 'Peringkat paralel',
  try_out: 'Nilai try out (minimal satu subtes)',
} as const;

const angkaValid = (v: number | null | undefined, min: number, maks: number) =>
  typeof v === 'number' && Number.isFinite(v) && v >= min && v <= maks;

/** Daftar bahan wajib yang belum diisi; kosong = siap dihitung. */
export function kekuranganBahan(p: BahanPreferensi): string[] {
  if (p.jalur === 'snbt') {
    const adaSkor = p.riwayat_to.some((t) => Object.values(t.skor).some((v) => angkaValid(v, 1, 1000)));
    return adaSkor ? [] : [LABEL_BAHAN.try_out];
  }
  const a = p.akademik;
  const kurang: string[] = [];
  if (!a?.npsn) kurang.push(LABEL_BAHAN.sekolah);
  if (!angkaValid(a?.rapor_rata, 1, 100)) kurang.push(LABEL_BAHAN.rapor);
  if (!angkaValid(a?.peringkat_paralel, 1, 10000)) kurang.push(LABEL_BAHAN.peringkat);
  return kurang;
}
