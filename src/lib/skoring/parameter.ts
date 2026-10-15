/**
 * Parameter skoring. Nilai resmi dari Data/aturan_seleksi_2026.json dan
 * Data/form_minat_config.json; nilai asumsi dari parameter_estimasi.json.
 */
import aturanSeleksi from '../../../Data/aturan_seleksi_2026.json';
import formMinat from '../../../Data/form_minat_config.json';
import estimasi from './parameter_estimasi.json';

export const ATURAN = aturanSeleksi;
export const PARAM = estimasi;

/** Persen kuota eligible per akreditasi sekolah (resmi, BR-04). */
export const KUOTA_PER_AKREDITASI: Record<string, number> = {
  A: aturanSeleksi.snbp.kuota_siswa_eligible_per_akreditasi.A,
  B: aturanSeleksi.snbp.kuota_siswa_eligible_per_akreditasi.B,
  C: aturanSeleksi.snbp.kuota_siswa_eligible_per_akreditasi.C,
  lainnya: aturanSeleksi.snbp.kuota_siswa_eligible_per_akreditasi.lainnya,
};

export const W1_MIN = aturanSeleksi.snbp.komponen_penilaian.rapor_semua_mapel_min;
export const KOMPONEN_KEDUA_MAKS = aturanSeleksi.snbp.komponen_penilaian.komponen_kedua_maks;

export const LABEL_KECOCOKAN: { min: number; label: string }[] = formMinat.pencocokan_prodi.label;

export interface OpsiHobi {
  id: string;
  label: string;
  riasec: Partial<Record<'R' | 'I' | 'A' | 'S' | 'E' | 'C', number>>;
}
export const OPSI_HOBI: OpsiHobi[] = formMinat.bagian_pendukung.hobi.opsi;
