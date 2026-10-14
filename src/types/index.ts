/**
 * Shared Type Definitions — Cocokin!
 * Kontrak tipe bersama antara Frontend (daliondroid) dan Backend (farrelzaki).
 * Mengikuti konvensi snake_case sesuai docs/ARSITEKTUR.md.
 */

export type RumpunIlmu = 'saintek' | 'soshum';
export type JenjangProdi = 'S1' | 'D4' | 'D3';
export type LabelKeketatan = 'sangat_ketat' | 'ketat' | 'sedang' | 'longgar';
export type StatusPeluang = 'aman' | 'ketat' | 'sangat_ketat';

export interface Sekolah {
  npsn: string;
  nama_sekolah: string;
  kab_kota: string;
  provinsi: string;
  akreditasi: string;
  kuota_eligible_persen?: number;
}

export interface Prodi {
  id_prodi: string;
  nama_prodi: string;
  nama_ptn: string;
  singkatan_ptn?: string;
  provinsi_ptn: string;
  rumpun: RumpunIlmu;
  jenjang: JenjangProdi;
  daya_tampung_2026: number;
  peminat_2025: number;
  label_keketatan: LabelKeketatan;
  akreditasi?: string;
  biaya_ukt_rata?: number;
}

export interface HasilPeluang {
  id_prodi: string;
  status_peluang: StatusPeluang;
  skor_estimasi: number;
  rentang_peluang: string;
  alasan: string[];
  flag_estimasi: boolean;
  validasi_provinsi: boolean;
}

export interface HasilKecocokan {
  skor_riasec: Record<string, number>;
  kode_holland: string;
  persentase_kecocokan: number;
  label_kecocokan: string;
}
