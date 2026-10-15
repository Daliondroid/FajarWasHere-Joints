/**
 * Antarmuka akses data untuk layanan API. Implementasi Supabase ada di src/lib/db/;
 * test memakai repo palsu sehingga logika layanan bisa dites tanpa DB.
 */
import type { ItemMinat } from '@/lib/skoring';
import type { JenjangProdi, RumpunIlmu, StatistikTahunan, ProdiDetail } from '@/types';

export interface BarisSekolah {
  npsn: string;
  nama: string;
  jenis: string;
  akreditasi: string | null;
  persen_kuota: number;
  kuota_siswa: number;
  /** {"nama jurusan": kuota} — nilai bisa angka atau teks angka dari sumber. */
  jurusan_kuota: Record<string, number | string>;
  kab_kota: string;
  provinsi: string;
  kode_bps: string;
}

/** Satu baris prodi lengkap (kolom prodi + PTN + rumpun), angka sudah dikonversi ke number. */
export interface BarisProdi {
  id_prodi: number;
  id_ptn: number;
  nama: string;
  jenjang: JenjangProdi;
  rumpun_id: string;
  rumpun: string;
  kelompok: RumpunIlmu;
  klaster_id: number;
  nama_ptn: string;
  provinsi_ptn: string;
  kode_bps_ptn: string;
  kode_bps_ptn_2: string | null;
  r: number;
  i: number;
  a: number;
  s: number;
  e: number;
  c: number;
  kode_holland: string;
  mapel_pendukung_snbp: string | null;
  portofolio: string | null;
  is_baru: boolean;
  ada_snbp: boolean;
  ada_snbt: boolean;
  dt_snbp_2026: number | null;
  peminat_snbp_2025: number | null;
  diterima_snbp_2025: number | null;
  rasio_terima_snbp_2025: number | null;
  rasio_terima_snbp_rata3th: number | null;
  dt_snbt_2026: number | null;
  dt_snbt_2025: number | null;
  peminat_snbt_2025: number | null;
  est_skor_utbk: number | null;
  est_skor_utbk_bawah: number | null;
  est_skor_utbk_atas: number | null;
  metode_est_utbk: string | null;
}

export interface BarisAlias {
  alias: string;
  jenis: 'prodi' | 'ptn';
  arti: string;
}

export interface BarisPtn {
  id_ptn: number;
  nama: string;
}

/** Kueri prodi yang sudah diurai dari teks pencarian + filter. */
export interface KueriProdi {
  rumpun_id?: string;
  jenjang?: JenjangProdi;
  kelompok?: RumpunIlmu;
  klaster_id?: number;
  kode_bps?: string;
  id_ptn?: number;
  portofolio?: boolean;
  /** Cocok jika nama prodi mengandung salah satu teks ATAU id_ptn ada di id_ptn_teks. */
  teks_prodi: string[];
  id_ptn_teks: number[];
  /** Pembatas wajib dari alias PTN (mis. "UI"); kosong = tanpa pembatas. */
  id_ptn_alias: number[];
}

export interface DetailTambahan {
  statistik: StatistikTahunan[];
  pddikti: Omit<NonNullable<ProdiDetail['pddikti']>, 'label_data'> | null;
  profil: Omit<NonNullable<ProdiDetail['profil']>, 'label_data'> | null;
}

export interface Repo {
  sekolahByNpsn(npsn: string): Promise<BarisSekolah | null>;
  cariSekolah(q: string, batas: number): Promise<BarisSekolah[]>;
  daftarProdi(kueri: KueriProdi, offset: number, limit: number): Promise<{ baris: BarisProdi[]; total: number }>;
  prodiByIds(ids: number[]): Promise<BarisProdi[]>;
  /** Prodi di PTN-PTN dan rumpun-rumpun tertentu (untuk fallback BR-08). */
  prodiSerumpun(idPtn: number[], rumpunId: string[]): Promise<BarisProdi[]>;
  semuaProdi(): Promise<BarisProdi[]>;
  detailTambahan(idProdi: number): Promise<DetailTambahan>;
  semuaPtn(): Promise<BarisPtn[]>;
  aliasPencarian(): Promise<BarisAlias[]>;
  itemMinat(): Promise<ItemMinat[]>;
}
