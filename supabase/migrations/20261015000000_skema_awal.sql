-- Skema awal Cocokin! (T-03)
-- A. Data referensi: diimpor dari Data/ lewat scripts/impor_data.py, hanya dibaca aplikasi.
-- B. Data pengguna: dibuat aplikasi; semua FK ke pengguna ON DELETE CASCADE (hapus akun, BR-14).
-- C. RLS aktif di semua tabel tanpa policy: hanya server (service role) yang bisa akses.

create extension if not exists pg_trgm;

-- =====================================================================
-- A. DATA REFERENSI
-- =====================================================================

-- Wilayah. Semua provinsi disimpan sebagai kode_bps agar aturan satu provinsi (BR-01) cukup membandingkan kode.
create table provinsi (
  kode_bps       text primary key,
  nama           text not null unique,
  kode_bps_induk text not null references provinsi (kode_bps) -- provinsi induk sebelum pemekaran Papua 2022
);

create table provinsi_alias (
  sumber_file    text not null,
  nama_di_sumber text not null,
  kode_bps       text not null references provinsi (kode_bps),
  primary key (sumber_file, nama_di_sumber)
);

create table kabupaten_kota (
  kode_kab         text primary key,
  nama             text not null,
  kode_bps         text not null references provinsi (kode_bps),
  lat              double precision,
  lon              double precision,
  sumber_koordinat text
);

create table ptn (
  id_ptn          integer primary key,
  kode_ptn        text not null unique,
  nama            text not null,
  jenis           text not null check (jenis in ('akademik', 'vokasi')),
  is_ptnbh        boolean not null,
  is_ptkin        boolean not null,
  web             text,
  alamat          text,
  kode_bps        text not null references provinsi (kode_bps),
  kode_bps_2      text references provinsi (kode_bps), -- kampus dengan provinsi kedua
  kode_prov_snpmb text not null,
  kota            text,
  ikut_snbp       boolean not null,
  ikut_snbt       boolean not null,
  lat             double precision not null,
  lon             double precision not null,
  presisi_lokasi  text
);

-- Taksonomi minat dan klaster.
create table klaster (
  klaster_id smallint primary key,
  nama       text not null unique
);

create table rumpun (
  rumpun_id           text primary key,
  nama                text not null unique,
  kelompok            text not null check (kelompok in ('saintek', 'soshum')),
  r                   numeric(4, 2) not null,
  i                   numeric(4, 2) not null,
  a                   numeric(4, 2) not null,
  s                   numeric(4, 2) not null,
  e                   numeric(4, 2) not null,
  c                   numeric(4, 2) not null,
  kode_holland        char(3) not null,
  jumlah_okupasi_onet smallint,
  mapel_pendukung     text,
  klaster_id          smallint not null references klaster (klaster_id)
);

create table rumpun_okupasi_onet (
  rumpun_id text not null references rumpun (rumpun_id),
  onet_soc  text not null,
  okupasi   text not null,
  r         numeric(4, 2) not null,
  i         numeric(4, 2) not null,
  a         numeric(4, 2) not null,
  s         numeric(4, 2) not null,
  e         numeric(4, 2) not null,
  c         numeric(4, 2) not null,
  primary key (rumpun_id, onet_soc)
);

-- Prodi (sumber: ak_prodi_master.csv + kode/is_baru dari ak_snbp_prodi/ak_snbt_prodi).
create table prodi (
  id_prodi                  integer primary key,
  id_ptn                    integer not null references ptn (id_ptn),
  kode_prodi                text not null unique,
  nama                      text not null,
  jenjang                   text not null check (jenjang in ('S1', 'D4', 'D3')),
  rumpun_id                 text not null references rumpun (rumpun_id),
  rumpun_pendidikan         text,
  is_keguruan               boolean not null, -- tag filter "Keguruan" (PRD bagian 5)
  kelompok                  text not null check (kelompok in ('saintek', 'soshum')),
  r                         numeric(4, 2) not null,
  i                         numeric(4, 2) not null,
  a                         numeric(4, 2) not null,
  s                         numeric(4, 2) not null,
  e                         numeric(4, 2) not null,
  c                         numeric(4, 2) not null,
  kode_holland              char(3) not null,
  mapel_pendukung_snbp      text,
  kode_portofolio           smallint,
  portofolio                text, -- null = tidak wajib portofolio (BR-15)
  is_baru                   boolean not null,
  ada_snbp                  boolean not null,
  ada_snbt                  boolean not null,
  dt_snbp_2026              integer,
  peminat_snbp_2025         integer,
  diterima_snbp_2025        integer,
  rasio_terima_snbp_2025    numeric(6, 4),
  rasio_terima_snbp_rata3th numeric(6, 4),
  peminat_snbp_rata3th      numeric(10, 2),
  dt_snbt_2026              integer,
  peminat_snbt_2025         integer,
  dt_snbt_2025              integer,
  keketatan_snbt_2025       numeric(8, 2), -- peminat per kursi
  tren_peminat_snbt_3th     numeric(8, 2), -- persen
  est_skor_utbk             smallint,      -- ESTIMASI, wajib berlabel di UI
  est_skor_utbk_bawah       smallint,
  est_skor_utbk_atas        smallint,
  metode_est_utbk           text
);

create index prodi_id_ptn_idx on prodi (id_ptn);
create index prodi_rumpun_id_idx on prodi (rumpun_id);
create index prodi_nama_trgm_idx on prodi using gin (nama gin_trgm_ops);

-- Histori seleksi, satu baris per prodi x jalur x tahun (2021-2026).
create table prodi_statistik_tahunan (
  id_prodi     integer not null references prodi (id_prodi),
  jalur        text not null check (jalur in ('snbp', 'snbt')),
  tahun        smallint not null,
  daya_tampung integer,
  peminat      integer,
  diterima     integer, -- hanya SNBP; SNBT tidak dipublikasikan
  primary key (id_prodi, jalur, tahun)
);

create table snbt_peminat_provinsi (
  id_prodi        integer not null references prodi (id_prodi),
  tahun           smallint not null,
  kode_prov_snpmb text not null,
  kode_bps        text not null references provinsi (kode_bps),
  jml_peminat     integer not null,
  primary key (id_prodi, tahun, kode_prov_snpmb)
);

create index snbt_peminat_provinsi_kode_bps_idx on snbt_peminat_provinsi (kode_bps, tahun);

create table akreditasi_map (
  nilai_di_sumber text primary key, -- '' = tidak ada data
  kanonik         text not null,
  skor            smallint not null check (skor between 0 and 4),
  catatan         text
);

create table prodi_pddikti (
  id_prodi                 integer primary key references prodi (id_prodi),
  cocok_pddikti            boolean not null,
  skor_cocok               numeric(4, 2),
  nama_prodi_pddikti       text,
  kode_prodi_pddikti       text,
  kelompok_bidang          text,
  akreditasi               text,
  akreditasi_kanonik       text not null,
  akreditasi_skor          smallint not null,
  akreditasi_internasional text,
  jumlah_dosen             integer,
  jumlah_mahasiswa         integer,
  rasio_dosen_mhs          text,          -- teks asli, mis. "1:10.05"
  mhs_per_dosen            numeric(8, 2), -- hasil parse rasio_dosen_mhs
  rata_masa_studi_th       numeric(4, 2),
  tgl_berdiri              date,
  kode_bps_prodi           text references provinsi (kode_bps), -- informasi; aturan provinsi pakai ptn
  kab_kota_prodi           text,
  lat                      double precision,
  lon                      double precision,
  website                  text,
  ada_teks_kompetensi      boolean not null
);

create table prodi_profil (
  id_prodi           integer primary key references prodi (id_prodi),
  nama_prodi_pddikti text,
  deskripsi          text,
  visi               text,
  misi               text,
  kompetensi         text[] not null default '{}',
  capaian_belajar    text[] not null default '{}',
  website            text
);

-- Sekolah (kuota SNBP 2026).
create table sekolah (
  npsn                       char(8) primary key,
  nama                       text not null,
  jenis                      text not null,
  akreditasi                 text, -- A/B/C/Tidak Terakreditasi; null = tidak ada data
  akreditasi_kadaluarsa      date,
  persen_kuota               numeric(4, 2) not null, -- 0.40 / 0.25 / 0.05
  total_siswa_eligible_basis integer not null,
  kuota_siswa                integer not null,       -- 0 = sekolah belum mengisi PDSS
  kode_kab                   text not null references kabupaten_kota (kode_kab),
  kode_bps                   text not null references provinsi (kode_bps),
  jurusan_kuota              jsonb not null          -- {"nama jurusan": kuota_eligible}
);

create index sekolah_kode_kab_idx on sekolah (kode_kab);
create index sekolah_nama_trgm_idx on sekolah using gin (nama gin_trgm_ops);

-- Bank soal Test Drive, berlapis (PRD bagian 4, Halaman 13).
create table soal (
  id_soal    text primary key,
  lapisan    text not null check (lapisan in ('spesifik', 'umum', 'rumpun', 'utbk')),
  id_prodi   integer references prodi (id_prodi), -- lapisan spesifik/umum
  rumpun_id  text references rumpun (rumpun_id),  -- lapisan rumpun
  kategori   text,                                -- subtes UTBK atau rumpun_id
  tipe       text,
  soal       text not null,
  opsi_a     text not null,
  opsi_b     text not null,
  opsi_c     text not null,
  opsi_d     text not null,
  kunci      char(1) not null check (kunci in ('A', 'B', 'C', 'D')),
  pembahasan text,
  sumber     text,
  status     text
);

create index soal_id_prodi_idx on soal (id_prodi);
create index soal_rumpun_id_idx on soal (rumpun_id);

create table alias_pencarian (
  alias text primary key,
  jenis text not null check (jenis in ('prodi', 'ptn')),
  arti  text not null
);

create table minat_item (
  item_id       text primary key,
  urutan_tampil smallint not null unique,
  skala         char(1) not null check (skala in ('R', 'I', 'A', 'S', 'E', 'C')),
  teks_id       text not null,
  teks_en_asli  text not null,
  mini_ip_30    boolean not null,
  sumber        text not null
);

create table mapel_pendukung (
  rumpun_prodi    text primary key,
  mapel_pendukung text not null,
  dasar_hukum     text,
  sumber_rekap    text
);

create table utbk_anchor_kampus (
  tahun          smallint not null,
  jenjang        text not null,
  kampus         text not null,
  rata_rata_utbk numeric(6, 2) not null,
  sumber         text,
  primary key (tahun, jenjang, kampus)
);

create table utbk_nasional (
  tahun       smallint not null,
  jenjang     text not null,
  skor_min    numeric(6, 2) not null,
  skor_rerata numeric(6, 2) not null,
  skor_max    numeric(6, 2) not null,
  sumber      text,
  primary key (tahun, jenjang)
);

-- SINTETIS, hanya untuk demo (BR-13).
create table alumni_sintetis (
  id               bigint generated always as identity primary key,
  npsn             char(8) not null references sekolah (npsn),
  tahun            smallint not null,
  id_prodi         integer not null references prodi (id_prodi),
  jalur            text not null,
  nilai_rapor_rata numeric(5, 2) not null,
  status           text not null,
  ipk_tahun1       numeric(3, 2),
  label_data       text not null default 'SINTETIS'
);

create index alumni_sintetis_npsn_idx on alumni_sintetis (npsn);

-- =====================================================================
-- B. DATA PENGGUNA (privasi BR-14: tanpa alamat lengkap, tanpa file rapor)
-- =====================================================================

create table pengguna (
  id             uuid primary key default gen_random_uuid(),
  google_sub     text not null unique,
  email          text not null,
  nama           text,
  dibuat_pada    timestamptz not null default now(),
  diperbarui_pada timestamptz not null default now()
);

create table preferensi (
  pengguna_id       uuid primary key references pengguna (id) on delete cascade,
  mode_minat        text not null default 'mini_ip_30' check (mode_minat in ('mini_ip_30', 'lengkap_60')),
  jawaban_minat     jsonb not null default '{}', -- {"IP01": 1..5}
  skor_riasec       jsonb,                       -- {"R": .., "I": .., ...}
  kode_holland      char(3),
  chip_hobi         text[] not null default '{}',
  mapel_favorit     text[] not null default '{}' check (cardinality(mapel_favorit) <= 3),
  ikut_snbp         boolean not null default false,
  ikut_snbt         boolean not null default false,
  tahun_lulus       smallint,
  pernah_lulus_snbp boolean not null default false,
  diperbarui_pada   timestamptz not null default now()
);

create table profil_akademik (
  pengguna_id               uuid primary key references pengguna (id) on delete cascade,
  npsn                      char(8) references sekolah (npsn),
  jurusan_sekolah           text,
  kode_kab                  text references kabupaten_kota (kode_kab),
  rapor_rata                numeric(5, 2) check (rapor_rata between 0 and 100),
  nilai_mapel_pendukung     jsonb not null default '{}', -- {"Biologi": 90}
  peringkat_paralel         integer check (peringkat_paralel > 0),
  jumlah_siswa_jurusan      integer check (jumlah_siswa_jurusan > 0),
  nilai_tka                 jsonb not null default '{}', -- {"bahasa_indonesia": .., "matematika": ..}
  prestasi                  jsonb not null default '[]', -- [{"tingkat": .., "bidang": .., "peringkat": ..}]
  reputasi_alumni           text check (reputasi_alumni in ('langganan_ptn_top', 'rutin_lolos', 'satu_lima_per_tahun', 'sekolah_baru')),
  kampus_alumni             integer[] not null default '{}', -- id_ptn
  alumni_tidak_daftar_ulang text check (alumni_tidak_daftar_ulang in ('tidak_tahu', 'pernah')),
  diperbarui_pada           timestamptz not null default now()
);

create table riwayat_to (
  id           bigint generated always as identity primary key,
  pengguna_id  uuid not null references pengguna (id) on delete cascade,
  tanggal      date not null,
  sumber_to    text,
  skala        text not null default 'tidak_tahu' check (skala in ('irt_200_1000', 'bimbel', 'tidak_tahu')),
  skor_pu      numeric(6, 2),
  skor_ppu     numeric(6, 2),
  skor_pbm     numeric(6, 2),
  skor_pk      numeric(6, 2),
  skor_lit_ind numeric(6, 2),
  skor_lit_ing numeric(6, 2),
  skor_pm      numeric(6, 2),
  dibuat_pada  timestamptz not null default now()
);

create index riwayat_to_pengguna_idx on riwayat_to (pengguna_id, tanggal);

create table riwayat_test_drive (
  id          bigint generated always as identity primary key,
  pengguna_id uuid not null references pengguna (id) on delete cascade,
  id_prodi    integer not null references prodi (id_prodi),
  id_soal     text references soal (id_soal), -- null untuk skenario buatan AI (F-14)
  jawaban     char(1) check (jawaban in ('A', 'B', 'C', 'D')),
  benar       boolean,
  refleksi    text check (refleksi in ('seru', 'melelahkan')),
  dibuat_pada timestamptz not null default now()
);

create index riwayat_test_drive_pengguna_idx on riwayat_test_drive (pengguna_id, dibuat_pada);

create table riwayat_chat (
  id          bigint generated always as identity primary key,
  pengguna_id uuid not null references pengguna (id) on delete cascade,
  peran       text not null check (peran in ('pengguna', 'asisten')),
  isi         text not null,
  dibuat_pada timestamptz not null default now()
);

create index riwayat_chat_pengguna_idx on riwayat_chat (pengguna_id, dibuat_pada);

-- =====================================================================
-- C. KEAMANAN: RLS aktif tanpa policy. Anon/authenticated key tidak bisa membaca apa pun;
--    seluruh akses lewat server Next.js dengan service role.
-- =====================================================================

do $$
declare t record;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t.tablename);
  end loop;
end $$;
