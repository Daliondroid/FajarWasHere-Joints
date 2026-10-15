/** BR-09: estimasi peluang SNBT dari skor TO vs estimasi skor UTBK prodi. */
import { PARAM } from './parameter';
import { labelPeluang, logistik, rentang, rentangDariTitik, type LabelPeluang } from './peluang';

/** Peluang 0..100 (sama dengan skoring_referensi.peluang_snbt sebelum dibulatkan). */
export function peluangSnbtTitik(skorTo: number, estSkorProdi: number): number {
  return logistik(skorTo - estSkorProdi, PARAM.peluang.sebaran_snbt);
}

export interface InputPeluangSnbt {
  /** Rata-rata 7 subtes TO siswa. */
  skor_to: number;
  est_skor_utbk: number | null;
  est_skor_utbk_bawah?: number | null;
  est_skor_utbk_atas?: number | null;
  /** true jika estimasi berasal dari fallback rumpun (BR-08). */
  data_terbatas?: boolean;
}

export interface HasilPeluangSnbt {
  dihitung: boolean;
  peluang: number | null;
  rentang: [number, number] | null;
  label: LabelPeluang | null;
  estimasi: true;
  data_terbatas: boolean;
  /** TO bimbel bukan skala IRT. */
  peringatan_skala: true;
  pesan: string | null;
}

export function peluangSnbt(input: InputPeluangSnbt): HasilPeluangSnbt {
  const dasar = { estimasi: true as const, peringatan_skala: true as const, data_terbatas: !!input.data_terbatas };
  if (input.est_skor_utbk == null) {
    return {
      ...dasar,
      dihitung: false,
      peluang: null,
      rentang: null,
      label: null,
      pesan: 'Estimasi skor UTBK prodi belum tersedia.',
    };
  }
  const p = peluangSnbtTitik(input.skor_to, input.est_skor_utbk);
  const { est_skor_utbk_bawah: bawah, est_skor_utbk_atas: atas } = input;
  // Estimasi prodi lebih tinggi -> peluang lebih rendah, jadi batas atas skor memberi batas bawah peluang.
  const r =
    bawah != null && atas != null && atas >= bawah
      ? rentang(peluangSnbtTitik(input.skor_to, atas), peluangSnbtTitik(input.skor_to, bawah))
      : rentangDariTitik(p);
  return {
    ...dasar,
    dihitung: true,
    peluang: Math.round(p * 10) / 10,
    rentang: r,
    label: labelPeluang(p),
    pesan: 'Skor TO bimbel bukan skala IRT UTBK; anggap hasil ini perkiraan kasar.',
  };
}
