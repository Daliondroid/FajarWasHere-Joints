/** BR-02, BR-03, BR-08: rasio keketatan, label, dan fallback prodi tanpa histori. */
import { PARAM } from './parameter';

export type LabelKeketatan = 'sangat_ketat' | 'ketat' | 'sedang' | 'longgar';

function rasio(pembilang: number | null | undefined, peminat: number | null | undefined): number | null {
  if (pembilang == null || peminat == null || peminat <= 0 || pembilang < 0) return null;
  return pembilang / peminat;
}

/** SNBP: diterima ÷ peminat (bukan daya tampung). */
export const rasioSnbp = (diterima: number | null | undefined, peminat: number | null | undefined) =>
  rasio(diterima, peminat);

/** SNBT: daya tampung ÷ peminat. */
export const rasioSnbt = (dayaTampung: number | null | undefined, peminat: number | null | undefined) =>
  rasio(dayaTampung, peminat);

export function labelKeketatan(r: number): LabelKeketatan {
  const a = PARAM.keketatan.ambang;
  if (r < a.sangat_ketat) return 'sangat_ketat';
  if (r < a.ketat) return 'ketat';
  if (r < a.sedang) return 'sedang';
  return 'longgar';
}

export interface ProdiRumpun {
  id_prodi: string;
  id_ptn: string;
  rumpun_id: string;
}

/**
 * BR-08: rata-rata nilai prodi serumpun di PTN yang sama, untuk prodi tanpa histori.
 * Mengembalikan null jika tidak ada pembanding.
 */
export function rataRumpunPtn<T extends ProdiRumpun>(
  target: ProdiRumpun,
  daftar: T[],
  ambilNilai: (p: T) => number | null | undefined,
): { nilai: number; jumlah_pembanding: number; data_terbatas: true } | null {
  const nilai = daftar
    .filter((p) => p.id_prodi !== target.id_prodi && p.id_ptn === target.id_ptn && p.rumpun_id === target.rumpun_id)
    .map(ambilNilai)
    .filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
  if (nilai.length === 0) return null;
  return {
    nilai: nilai.reduce((a, b) => a + b, 0) / nilai.length,
    jumlah_pembanding: nilai.length,
    data_terbatas: true,
  };
}
