/**
 * Kontrak API Cocokin! (docs/ARSITEKTUR.md bagian 4).
 * Status: disetujui farrelzaki 2026-10-15, menunggu tinjauan daliondroid sebelum dibekukan.
 */
import type {
  HasilJalur,
  HasilPeluangSnbp,
  HasilPeluangSnbt,
  HasilValidasiProvinsi,
  NilaiTka,
  ModeMinat,
  StatusAlumni,
} from '@/lib/skoring';
import type { JenjangProdi, LabelKeketatan, RumpunIlmu } from './index';

export type { HasilJalur, HasilPeluangSnbp, HasilPeluangSnbt, HasilValidasiProvinsi, NilaiTka, ModeMinat, StatusAlumni };

/** Label sumber angka (BR-13). */
export type LabelData = 'resmi' | 'estimasi' | 'sintetis';

/** Semua galat: HTTP 400 / 401 / 404 / 500 dengan badan ini. */
export interface GalatApi {
  error: { kode: 'VALIDASI' | 'TIDAK_LOGIN' | 'TIDAK_DITEMUKAN' | 'SERVER'; pesan: string };
}

// ---------- GET /api/school ----------

export interface SekolahDetail {
  npsn: string;
  nama: string;
  jenis: string;
  /** A / B / C / Tidak Terakreditasi; null = tidak ada data. */
  akreditasi: string | null;
  kab_kota: string;
  provinsi: string;
  kode_bps: string;
  /** 0.40 / 0.25 / 0.05 */
  persen_kuota: number;
  kuota_siswa: number;
  jurusan_kuota: { jurusan: string; kuota: number }[];
  /** false = sekolah belum mengisi PDSS (kuota_siswa 0); kuota diperkirakan dari akreditasi. */
  ada_data_pdss: boolean;
  label_data: 'resmi';
}

/** ?npsn= -> { data: SekolahDetail }; ?q= -> { data: SekolahDetail[] } (maks 20). */
export interface ResponsSekolah {
  data: SekolahDetail | SekolahDetail[];
}

// ---------- GET /api/prodi, GET /api/prodi/[id_prodi] ----------

export interface Keketatan {
  /** SNBP: diterima ÷ peminat; SNBT: daya tampung ÷ peminat. */
  rasio: number;
  label: LabelKeketatan;
  tahun: number;
  /** true jika memakai rata-rata rumpun di PTN yang sama (BR-08). */
  data_terbatas: boolean;
  label_data: 'resmi';
}

export interface EstimasiUtbk {
  nilai: number;
  bawah: number | null;
  atas: number | null;
  metode: string | null;
  label_data: 'estimasi';
}

export interface ProdiRingkas {
  id_prodi: number;
  nama_prodi: string;
  jenjang: JenjangProdi;
  id_ptn: number;
  nama_ptn: string;
  provinsi_ptn: string;
  rumpun_id: string;
  rumpun: string;
  kelompok: RumpunIlmu;
  klaster_id: number;
  kode_holland: string;
  /** Nama portofolio wajib; null = tidak wajib (BR-15). */
  portofolio: string | null;
  is_baru: boolean;
  ada_snbp: boolean;
  ada_snbt: boolean;
  daya_tampung_snbp_2026: number | null;
  daya_tampung_snbt_2026: number | null;
  keketatan_snbp: Keketatan | null;
  keketatan_snbt: Keketatan | null;
  est_skor_utbk: EstimasiUtbk | null;
}

export interface FilterProdi {
  q?: string;
  rumpun_id?: string;
  jenjang?: JenjangProdi;
  kelompok?: RumpunIlmu;
  klaster_id?: number;
  /** Kode BPS provinsi PTN. */
  kode_bps?: string;
  id_ptn?: number;
  /** true = hanya prodi wajib portofolio; false = hanya yang tidak. */
  portofolio?: boolean;
}

/** Query: semua field FilterProdi + halaman (>= 1) + per_halaman (1–50, bawaan 20). */
export interface ResponsDaftarProdi {
  data: ProdiRingkas[];
  total: number;
  halaman: number;
  per_halaman: number;
}

export interface StatistikTahunan {
  jalur: 'snbp' | 'snbt';
  tahun: number;
  daya_tampung: number | null;
  peminat: number | null;
  /** Hanya SNBP. */
  diterima: number | null;
}

export interface ProdiDetail extends ProdiRingkas {
  riasec: { R: number; I: number; A: number; S: number; E: number; C: number };
  mapel_pendukung_snbp: string[];
  rasio_terima_snbp_rata3th: number | null;
  statistik: StatistikTahunan[];
  pddikti: {
    akreditasi: string;
    akreditasi_internasional: string | null;
    jumlah_dosen: number | null;
    jumlah_mahasiswa: number | null;
    rasio_dosen_mhs: string | null;
    rata_masa_studi_th: number | null;
    website: string | null;
    label_data: 'resmi';
  } | null;
  profil: {
    deskripsi: string | null;
    visi: string | null;
    misi: string | null;
    kompetensi: string[];
    capaian_belajar: string[];
    label_data: 'resmi';
  } | null;
}

export interface ResponsDetailProdi {
  data: ProdiDetail;
}

// ---------- POST /api/peluang ----------

export interface ProfilAkademik {
  tahun_lulus: number;
  lulus_snbp_tahun?: number | null;
  /** SNBP */
  npsn?: string;
  /** Nama jurusan persis seperti di SekolahDetail.jurusan_kuota. */
  jurusan_sekolah?: string;
  peringkat_paralel?: number;
  /** Dipakai jika sekolah belum punya kuota PDSS. */
  jumlah_siswa_jurusan?: number;
  /** Rerata rapor semester 1–5, 0–100. */
  rapor_rata?: number;
  /** {"Biologi": 90}; server memilih maks 2 mapel pendukung prodi. */
  nilai_mapel_pendukung?: Record<string, number>;
  /** 0–100. */
  prestasi_skor?: number;
  nilai_tka?: NilaiTka;
  alumni?: StatusAlumni;
  /** SNBT: rata-rata 7 subtes TO. */
  skor_to?: number;
}

export interface PermintaanPeluang {
  /** snbp: maks 2 prodi; snbt / keduanya: maks 4. Validasi provinsi SNBP memakai 2 pilihan pertama. */
  jalur: 'snbp' | 'snbt' | 'keduanya';
  id_prodi: number[];
  profil: ProfilAkademik;
}

export interface HasilPeluangProdi {
  id_prodi: number;
  nama_prodi: string;
  nama_ptn: string;
  snbp: HasilPeluangSnbp | null;
  snbt: HasilPeluangSnbt | null;
}

export interface ResponsPeluang {
  validasi_jalur: HasilJalur;
  validasi_provinsi_snbp: HasilValidasiProvinsi | null;
  sekolah: {
    npsn: string;
    nama: string;
    akreditasi: string | null;
    kuota_jurusan: number | null;
    sumber_kuota: 'resmi' | 'perkiraan_akreditasi' | null;
  } | null;
  hasil: HasilPeluangProdi[];
  label_data: 'estimasi';
}

// ---------- POST /api/kecocokan ----------

export interface PermintaanKecocokan {
  /** {"IP01": 0..4}; setiap skala RIASEC minimal 1 jawaban. */
  jawaban_minat: Record<string, number>;
  mode?: ModeMinat;
  /** id chip hobi dari Data/form_minat_config.json (H01..H18). */
  chip_hobi?: string[];
  /** Maks 3, dipakai sebagai tie-breaker. */
  mapel_favorit?: string[];
  filter?: Omit<FilterProdi, 'q' | 'portofolio'> & { id_prodi?: number[] };
  /** 1–100, bawaan 20. */
  batas?: number;
}

export interface HasilKecocokanProdi {
  id_prodi: number;
  nama_prodi: string;
  id_ptn: number;
  nama_ptn: string;
  jenjang: JenjangProdi;
  rumpun_id: string;
  kode_holland: string;
  skor: number;
  label: string;
  skor_profil: number;
  skor_hobi: number | null;
  c_index: number;
  mapel_favorit_cocok: number;
}

export interface ResponsKecocokan {
  skor_riasec: { R: number; I: number; A: number; S: number; E: number; C: number };
  kode_holland: string;
  kode_holland_seri: boolean;
  profil_datar: boolean;
  peringatan: string[];
  total_dibandingkan: number;
  hasil: HasilKecocokanProdi[];
}

// ---------- Akun & sesi (T-13) ----------
// Login: signIn('google', { callbackUrl: '/api/auth/lanjut' }) dari next-auth/react.
// GET /api/auth/lanjut -> 302 ke /rekomendasi (sudah isi preferensi), /preferensi (belum), atau / (belum login).

/** GET /api/akun (200 juga saat belum login). */
export interface ResponsAkun {
  login: boolean;
  pengguna: { nama: string | null; email: string } | null;
  sudah_isi_preferensi: boolean;
}

/** DELETE /api/akun, badan wajib persis ini. Menghapus akun + seluruh data, lalu menghapus cookie sesi. */
export interface PermintaanHapusAkun {
  konfirmasi: 'HAPUS';
}

export interface ResponsHapusAkun {
  terhapus: true;
}

// ---------- GET/PUT /api/preferensi (wajib login, 401 jika belum) ----------

export type ReputasiAlumni = 'langganan_ptn_top' | 'rutin_lolos' | 'satu_lima_per_tahun' | 'sekolah_baru';

export interface PrestasiSiswa {
  tingkat: string;
  bidang: string;
  peringkat: string;
}

export interface PreferensiPengguna {
  minat: {
    mode: ModeMinat;
    /** {"IP01": 0..4}; tiap skala RIASEC minimal 1 jawaban. */
    jawaban_minat: Record<string, number>;
    chip_hobi: string[];
    /** Maks 3. */
    mapel_favorit: string[];
  };
  jalur: {
    ikut_snbp: boolean;
    ikut_snbt: boolean;
    tahun_lulus: number | null;
    pernah_lulus_snbp: boolean;
  };
  /** null = belum diisi. Alamat tidak disimpan; kab/kota diambil dari data sekolah (BR-14). */
  akademik: {
    npsn: string | null;
    jurusan_sekolah: string | null;
    rapor_rata: number | null;
    nilai_mapel_pendukung: Record<string, number>;
    peringkat_paralel: number | null;
    jumlah_siswa_jurusan: number | null;
    nilai_tka: NilaiTka;
    /** Maks 3 prestasi terbaik. */
    prestasi: PrestasiSiswa[];
    reputasi_alumni: ReputasiAlumni | null;
    /** id_ptn, maks 10. */
    kampus_alumni: number[];
    alumni_tidak_daftar_ulang: 'tidak_tahu' | 'pernah' | null;
  } | null;
}

/** GET -> data null jika belum pernah disimpan. PUT (badan = PreferensiPengguna) -> data tersimpan. */
export interface ResponsPreferensi {
  data:
    | (PreferensiPengguna & {
        /** Dihitung server dari jawaban_minat. */
        skor_riasec: { R: number; I: number; A: number; S: number; E: number; C: number };
        kode_holland: string;
        diperbarui_pada: string;
      })
    | null;
}
