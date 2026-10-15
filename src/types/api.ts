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
  ReputasiAlumni,
} from '@/lib/skoring';
import type { JenjangProdi, LabelKeketatan, RumpunIlmu } from './index';

export type { HasilJalur, HasilPeluangSnbp, HasilPeluangSnbt, HasilValidasiProvinsi, NilaiTka, ModeMinat, ReputasiAlumni };

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
  /** 3 mapel wajib + `pilihan` (2 mapel berbeda dari daftar resmi, BR-18). */
  nilai_tka?: NilaiTka;
  /** Reputasi alumni self-report (BR-06). */
  reputasi_alumni?: ReputasiAlumni | null;
  /** id_ptn kampus tempat alumni sekolah diterima; bonus kecil bila PTN prodi tujuan termasuk. */
  kampus_alumni?: number[];
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
// GET /api/auth/lanjut -> 302 ke /cocokin (punya minimal satu preferensi), /preferensi (belum), atau / (belum login).

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

// ---------- Preferensi (T-18, PRD 2.2: F-18, F-19, BR-16, BR-17). Semua wajib login (401) ----------
// GET    /api/preferensi              -> ResponsDaftarPreferensi (kartu Hal. P)
// POST   /api/preferensi              (IsiPreferensi) -> ResponsPreferensi; preferensi baru otomatis aktif
// GET    /api/preferensi/aktif        -> ResponsPreferensi (data null bila belum punya)
// GET    /api/preferensi/[id]         -> ResponsPreferensi (404 bila bukan milik pengguna)
// PUT    /api/preferensi/[id]         (IsiPreferensi) -> ResponsPreferensi; mengganti seluruh isi; jalur tidak bisa diubah (400)
// PATCH  /api/preferensi/[id]         ({ nama }) -> ResponsPreferensi
// POST   /api/preferensi/[id]/aktif   -> ResponsPreferensi; jadikan preferensi aktif (F-19)
// DELETE /api/preferensi/[id]         -> ResponsHapusPreferensi; bila aktif, preferensi lain terbaru jadi aktif

export type JalurPreferensi = 'snbp' | 'snbt';
export type SkalaTo = 'irt_200_1000' | 'bimbel' | 'tidak_tahu';

export interface PrestasiSiswa {
  tingkat: string;
  bidang: string;
  peringkat: string;
}

/** Bahan SNBP (Hal. 5–6). */
export interface AkademikSnbp {
  npsn: string | null;
  jurusan_sekolah: string | null;
  rapor_rata: number | null;
  nilai_mapel_pendukung: Record<string, number>;
  peringkat_paralel: number | null;
  jumlah_siswa_jurusan: number | null;
  /** 3 mapel wajib + `pilihan`: 0 atau 2 mapel berbeda dari daftar resmi (BR-18). */
  nilai_tka: NilaiTka;
  /** Maks 3 prestasi terbaik. */
  prestasi: PrestasiSiswa[];
  reputasi_alumni: ReputasiAlumni | null;
  /** id_ptn, maks 10. */
  kampus_alumni: number[];
}

/** Satu try out (Hal. 7). Skor per subtes 0–1000; null bila tidak diisi. */
export interface TryOut {
  /** YYYY-MM-DD */
  tanggal: string;
  sumber_to: string | null;
  skala: SkalaTo;
  skor: { pu: number | null; ppu: number | null; pbm: number | null; pk: number | null; lit_ind: number | null; lit_ing: number | null; pm: number | null };
}

/** Badan POST /api/preferensi dan PUT /api/preferensi/[id]. */
export interface IsiPreferensi {
  /** 1–40 karakter, unik per akun (tanpa beda huruf besar/kecil). */
  nama: string;
  /** Dipilih saat membuat; tidak bisa diubah (BR-17). BR-11 dicek saat memilih. */
  jalur: JalurPreferensi;
  minat: {
    mode: ModeMinat;
    /** {"IP01": 0..4}; tiap skala RIASEC minimal 1 jawaban. */
    jawaban_minat: Record<string, number>;
    chip_hobi: string[];
    /** Maks 3. */
    mapel_favorit: string[];
  };
  kelulusan: { tahun_lulus: number | null; pernah_lulus_snbp: boolean };
  /** Hanya untuk jalur snbp (null = belum diisi); wajib null untuk snbt. */
  akademik: AkademikSnbp | null;
  /** Hanya untuk jalur snbt, maks 20, urut tanggal; wajib kosong untuk snbp. */
  riwayat_to: TryOut[];
}

export interface PreferensiDetail extends IsiPreferensi {
  id: string;
  aktif: boolean;
  /** Dihitung server dari jawaban_minat. */
  skor_riasec: { R: number; I: number; A: number; S: number; E: number; C: number };
  kode_holland: string;
  /** Rata-rata 7 subtes TO terbaru (untuk /api/peluang SNBT); null bila tidak ada. */
  skor_to_terbaru: number | null;
  dibuat_pada: string;
  diperbarui_pada: string;
}

export interface PreferensiRingkas {
  id: string;
  nama: string;
  jalur: JalurPreferensi;
  aktif: boolean;
  kode_holland: string;
  /** Prodi dengan kecocokan tertinggi menurut preferensi ini. */
  rekomendasi_teratas: { id_prodi: number; nama_prodi: string; nama_ptn: string; skor: number } | null;
  diperbarui_pada: string;
}

export interface ResponsDaftarPreferensi {
  data: PreferensiRingkas[];
}

export interface ResponsPreferensi {
  data: PreferensiDetail | null;
}

export interface ResponsHapusPreferensi {
  terhapus: true;
  /** id preferensi yang kini aktif, null bila tidak ada lagi. */
  id_aktif: string | null;
}

// ---------- Simulasi (nama teknis Test Drive, T-14; PRD 2.2 F-11: tanpa timer & tanpa refleksi). UI: /test-drive/[id_prodi] ----------

export type LapisanSoal = 'spesifik' | 'umum' | 'rumpun';

/** Soal tanpa kunci; kunci & pembahasan baru dikirim lewat POST /api/test-drive/jawab. */
export interface SoalTestDrive {
  id_soal: string;
  /** spesifik = kompetensi kampus ini; umum = prodi sejenis kampus lain; rumpun = konten keilmuan. */
  lapisan: LapisanSoal;
  pertanyaan: string;
  opsi: { A: string; B: string; C: string; D: string };
  sumber: string | null;
  /** mis. otomatis_perlu_review — soal dibuat otomatis, perlu ditinjau (BR-13). */
  status: string | null;
  label_data: 'soal';
}

export interface RealityCheck {
  /** 2–3 butir kompetensi lulusan resmi (PDDikti); kosong jika tidak ada data. */
  kompetensi_lulusan: string[];
  fakta_kampus: {
    akreditasi: string;
    rasio_dosen_mhs: string | null;
    rata_masa_studi_th: number | null;
    label_data: 'resmi';
  } | null;
  fakta_persaingan: {
    daya_tampung_snbp_2026: number | null;
    daya_tampung_snbt_2026: number | null;
    keketatan_snbp: Keketatan | null;
    keketatan_snbt: Keketatan | null;
  };
}

/** GET /api/test-drive?id_prodi= (tidak wajib login). */
export interface ResponsTestDrive {
  prodi: { id_prodi: number; nama_prodi: string; nama_ptn: string; jenjang: JenjangProdi; rumpun_id: string; rumpun: string };
  /** Maks 3, urut: spesifik/umum, rumpun, cadangan. Diacak tiap permintaan. */
  soal: SoalTestDrive[];
  reality_check: RealityCheck;
}

/** POST /api/test-drive/jawab (tidak wajib login; jika login, jawaban dicatat di riwayat). */
export interface PermintaanJawabTestDrive {
  id_prodi: number;
  id_soal: string;
  jawaban: 'A' | 'B' | 'C' | 'D';
}

export interface ResponsJawabTestDrive {
  id_soal: string;
  benar: boolean;
  kunci: 'A' | 'B' | 'C' | 'D';
  pembahasan: string | null;
  tersimpan: boolean;
}
