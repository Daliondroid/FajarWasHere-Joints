# Arsitektur — Cocokin!

> Menjawab: **dengan apa dan dalam bentuk apa sistem dibangun.**
> Keputusan di sini mengikat. Perubahan besar butuh persetujuan pengguna (lihat `AGENTS.md` bagian 6).

Status: **draf** — stack dari PRD sumber v2.1 dan keputusan 2026-10-15; belum ada scaffolding.

## 1. Stack

| Lapisan | Pilihan | Versi | Alasan |
| --- | --- | --- | --- |
| Frontend + Backend | Next.js (App Router, TypeScript) | 15.x — verifikasi saat scaffolding | Satu repo untuk UI dan route handler `/api/*` |
| Autentikasi | NextAuth (Google OAuth), sesi JWT tanpa adapter | next-auth 4.24.15 (v5 masih beta) | Login Gmail, sesi HttpOnly cookie 30 hari |
| Basis data | PostgreSQL via Supabase (hosted), akses server lewat `@supabase/supabase-js` (service role) | supabase-js 2.117.3 | Satu DB untuk pengembangan dan demo, tanpa Docker; impor CSV dataset |
| Styling | Tailwind CSS | TBD | Token dari `DESIGN_SYSTEM.md` |
| AI | Google Gemini 2.5 Flash (Google AI Studio) | `gemini-2.5-flash` atau Flash terbaru | Ekstraksi, chatbot dengan function calling, skenario Test Drive. Gemini 1.5 Flash sudah dihentikan. |
| Test | Vitest | TBD — verifikasi saat scaffolding | Dukungan TypeScript/ESM bawaan, konfigurasi minimal |
| Hosting | Vercel | — | Deploy Next.js langsung dari GitHub; free tier cukup untuk demo |

Versi diverifikasi ke registry resmi saat scaffolding, bukan dari ingatan.

**Sengaja tidak dipakai:** Gemini 1.5 Flash (dihentikan); LLM untuk menghitung kecocokan atau peluang (harus deterministik); SIDATA PTN dan Dapodik (tidak aktif / digantikan data snpmb.id).

## 2. Gambaran Sistem

```
[Browser]
   │  halaman 1–13 (Next.js App Router)
   ▼
[Route handler /api/*] ──> [Mesin deterministik: kecocokan, aturan provinsi, eligibilitas, peluang]
   │                               │
   │                               ▼
   │                        [PostgreSQL / Supabase] <── impor dari Data/*.csv, *.json
   │
   └──> [Gemini 2.5 Flash]
          • AI 1 Ekstraktor: teks hobi bebas / foto rapor → data terstruktur (dikonfirmasi siswa)
          • AI 2 Chatbot: function calling ke /api/prodi, /api/peluang (tidak mengarang angka)
          • AI 3 Skenario Test Drive (opsional): grounding ke kompetensi prodi, divalidasi skema JSON
```

Diagram lengkap: PRD sumber bagian 7.

## 3. Struktur Kode

```
Data/                 dataset sumber (hanya dibaca; diimpor ke DB) + kode referensi Python
docs/                 PRD, arsitektur, design system, referensi
public/               aset statis publik (ikon, gambar, svg)
scripts/              skrip CLI (impor data supabase, seed)
supabase/migrations/  migrasi skema database PostgreSQL
src/
  app/                Next.js 15 App Router (halaman 1–13, layout, globals.css)
  app/api/            Route handler API backend (/api/*)
  components/         Komponen UI antarmuka (8-bit arcade, form, kartu, modal, dll.)
  styles/             Styling tambahan atau CSS module jika diperlukan
  types/              Kontrak tipe bersama TypeScript antara frontend & backend
  lib/                Modul server, klien Supabase, NextAuth, Gemini, dan skoring murni
tests/                Unit test Vitest (skoring, aturan seleksi, integrasi)
```

Aturan batas:

- UI hanya bicara ke backend lewat endpoint di bagian 4.
- Logika skoring (kecocokan, keketatan, eligibilitas, peluang, aturan provinsi) adalah **fungsi murni** di modul tersendiri
  dan wajib dites. Implementasi rujukan: `Data/kode/skoring_referensi.py`.
- Parameter aturan dibaca dari `Data/aturan_seleksi_2026.json` dan `Data/form_minat_config.json`, tidak di-hardcode.
- Pemanggilan Gemini hanya dari server; API key lewat `.env`.

## 4. Kontrak API

Status: **disetujui farrelzaki 2026-10-15, menunggu tinjauan daliondroid** — dibekukan setelah daliondroid setuju.
Tipe TypeScript lengkap: `src/types/api.ts` (sumber kebenaran bentuk data; tabel di bawah ringkasannya).
Implementasi: route handler tipis di `src/app/api/`, logika di `src/lib/layanan/`, akses DB di `src/lib/db/`.

Aturan perubahan setelah beku:

1. Ubah hanya dengan persetujuan pengguna.
2. Dalam commit tersendiri, tidak dicampur perubahan fitur.
3. Menambah field opsional itu murah; mengganti nama/menghapus field itu mahal.

Aturan umum:

- JSON `snake_case`. Angka membawa label sumber `label_data`: `resmi` / `estimasi` / `sintetis` (BR-13).
- Galat: `{ "error": { "kode": "VALIDASI" | "TIDAK_LOGIN" | "TIDAK_DITEMUKAN" | "SERVER", "pesan": "..." } }` dengan status 400 / 401 / 404 / 500.
  Pesan berbahasa Indonesia dan aman ditampilkan ke pengguna; galat 500 tidak membocorkan detail server.
- Peluang dan kecocokan dihitung deterministik oleh `src/lib/skoring/` (T-04); tidak ada LLM.
- `/api/peluang` dan `/api/kecocokan` tetap menerima profil di badan request (tidak wajib login), sehingga bisa dipakai dari data
  `/api/preferensi` maupun data sementara di klien.
- Login (T-13): NextAuth v4 Google, sesi JWT di cookie HttpOnly 30 hari. Klien memanggil
  `signIn('google', { callbackUrl: '/api/auth/lanjut' })` dan `signOut()` dari `next-auth/react`.
  Halaman `/preferensi`, `/cocokin`, `/rekomendasi`, `/chat`, `/test-drive` dijaga `src/middleware.ts`: tanpa sesi → `/?login=1&kembali=<path>`.

| Endpoint | Fitur | Masukan | Keluaran |
| --- | --- | --- | --- |
| `GET /api/school` | F-05, F-06 | `?npsn=` (8 digit) atau `?q=` (nama, 3–100 karakter, maks 20 hasil) | `{ data: SekolahDetail }` / `{ data: SekolahDetail[] }`: npsn, nama, jenis, akreditasi, kab_kota, provinsi, kode_bps, persen_kuota, kuota_siswa, `jurusan_kuota: [{ jurusan, kuota }]`, `ada_data_pdss` |
| `GET /api/prodi` | F-08, F-10 | `q` (mendukung alias, mis. `TI UI`), `rumpun_id`, `jenjang`, `kelompok`, `klaster_id`, `kode_bps`, `id_ptn`, `portofolio` (true/false), `halaman` (≥ 1), `per_halaman` (1–50, bawaan 20) | `{ data: ProdiRingkas[], total, halaman, per_halaman }`; ProdiRingkas memuat keketatan SNBP/SNBT (rasio, label, `data_terbatas`) dan `est_skor_utbk` (label estimasi) |
| `GET /api/prodi/[id_prodi]` | F-08, F-09, F-11 | – | `{ data: ProdiDetail }`: ProdiRingkas + riasec, mapel_pendukung_snbp, rasio 3 tahun, statistik tahunan, PDDikti, profil (kompetensi, capaian). Prodi tanpa histori memakai rata-rata rumpun di PTN sama (BR-08) |
| `POST /api/peluang` | F-08, F-09 | `{ jalur: snbp \| snbt \| keduanya, id_prodi: number[], profil }`; snbp maks 2 prodi, lainnya maks 4. `profil`: tahun_lulus (wajib), lulus_snbp_tahun, npsn, jurusan_sekolah, peringkat_paralel, jumlah_siswa_jurusan, rapor_rata, nilai_mapel_pendukung `{mapel: nilai}`, prestasi_skor (0–100), nilai_tka (3 wajib + `pilihan` 0/2 mapel, BR-18), reputasi_alumni, kampus_alumni (id_ptn; bonus bila PTN tujuan termasuk, BR-06), skor_to | `validasi_jalur` (BR-11), `validasi_provinsi_snbp` (BR-01, 2 pilihan pertama), `sekolah` (kuota + sumbernya), `hasil[]` per prodi: `snbp` / `snbt` = rentang, label, 3 alasan, flag `estimasi` / `data_terbatas` / `peringatan_skala`; data siswa kurang → `dihitung: false` + `pesan`, bukan galat |
| `POST /api/kecocokan` | F-03, F-08 | `{ jawaban_minat: {item_id: 0..4}, mode?: mini_ip_30 \| ipsf_60, chip_hobi?: string[], mapel_favorit?: string[] (≤ 3), filter?, batas? (1–100, bawaan 20) }`; tiap skala RIASEC minimal 1 jawaban | `skor_riasec` (1–7), `kode_holland`, `kode_holland_seri`, `profil_datar`, `peringatan[]`, `total_dibandingkan`, `hasil[]` terurut: skor, label, skor_profil, skor_hobi, c_index, mapel_favorit_cocok; tie-breaker: mapel favorit (BR-10) |
| `GET /api/auth/lanjut` | F-02 | – (callbackUrl setelah login) | 302 ke `/cocokin` (Hal. 8, sudah isi preferensi), `/preferensi` (belum), atau `/` (belum login) |
| `GET /api/akun` | F-02 | – | `{ login, pengguna: { nama, email } \| null, sudah_isi_preferensi }`; 200 juga saat belum login |
| `DELETE /api/akun` | F-16 | `{ "konfirmasi": "HAPUS" }` | `{ terhapus: true }`; akun + preferensi + profil + riwayat terhapus (cascade), cookie sesi dihapus. Klien lalu memanggil `signOut()` |
| `GET /api/preferensi` | F-18 | – (wajib login) | `{ data: PreferensiRingkas[] }` untuk kartu Hal. P: id, nama, jalur, aktif, kode_holland, `rekomendasi_teratas`, diperbarui_pada; aktif di urutan pertama |
| `POST /api/preferensi` | F-04, F-18 | `IsiPreferensi`: `nama` (1–40, unik per akun), `jalur` (`snbp` \| `snbt`), `minat` (mode, jawaban_minat 0..4, chip_hobi, mapel_favorit ≤ 3), `kelulusan` (tahun_lulus, pernah_lulus_snbp), `akademik` (hanya SNBP, atau null: npsn, jurusan_sekolah, rapor_rata, nilai_mapel_pendukung, peringkat_paralel, jumlah_siswa_jurusan, nilai_tka + pilihan, prestasi ≤ 3, reputasi_alumni, kampus_alumni ≤ 10), `riwayat_to` (hanya SNBT, ≤ 20: tanggal, sumber_to, skala, skor 7 subtes) | `{ data: PreferensiDetail }`; preferensi baru **otomatis aktif** (BR-16). BR-11 dicek saat memilih jalur. Nama ganda / bahan salah jalur → 400 |
| `GET /api/preferensi/aktif` | F-08, F-19 | – | `{ data: PreferensiDetail \| null }` (`skor_to_terbaru` = rata-rata subtes TO terbaru) |
| `GET /api/preferensi/[id]` | F-18 | – | `{ data: PreferensiDetail }`; 404 bila bukan milik pengguna |
| `PUT /api/preferensi/[id]` | F-18 | `IsiPreferensi` | Mengganti seluruh isi; `jalur` berbeda → 400 (BR-17) |
| `PATCH /api/preferensi/[id]` | F-18 | `{ nama }` | Ganti nama |
| `POST /api/preferensi/[id]/aktif` | F-19 | – | Jadikan aktif (atomik, tepat satu aktif) |
| `DELETE /api/preferensi/[id]` | F-18 | – | `{ terhapus: true, id_aktif }`; bila yang dihapus aktif, preferensi lain terbaru jadi aktif; tanpa preferensi tersisa → akun "belum punya preferensi" |
| `GET /api/test-drive?id_prodi=` | F-11 (Simulasi) | `id_prodi` (angka). UI Hal. 13: `/test-drive/[id_prodi]` | `prodi`, `soal[]` maks 3 **tanpa kunci** (urutan lapisan: spesifik kampus → bila tidak ada umum; lalu rumpun; lalu cadangan berteks lain), diacak tiap permintaan, label `soal` + `status`; `reality_check` (2–3 kompetensi lulusan PDDikti, fakta kampus, fakta persaingan). Tanpa timer (K-06). Tidak wajib login |
| `POST /api/test-drive/jawab` | F-11 | `{ id_prodi, id_soal, jawaban: A–D }` | `{ id_soal, benar, kunci, pembahasan, tersimpan }`. Soal harus milik prodi atau rumpunnya (400). Login → dicatat di `riwayat_test_drive` |
| `POST /api/chat` | F-09 | Pesan pengguna | Jawaban chatbot (angka hanya dari API internal) — dirinci di T-09 |

Catatan: skala jawaban minat **0..4** dan mode `mini_ip_30` / `ipsf_60` (sesuai `form_minat_config.json`).
Banyak preferensi per akun (T-18): `supabase/migrations/20261015020000_banyak_preferensi.sql` — tabel `preferensi` (id, nama,
jalur, aktif; indeks unik nama per akun dan satu aktif per akun), `profil_akademik` & `riwayat_to` per preferensi, tulis lewat fungsi
SQL `simpan_preferensi` / `aktifkan_preferensi` / `hapus_preferensi` (hanya service role). Simulasi tanpa refleksi (K-08):
endpoint refleksi dan kolom `riwayat_test_drive.refleksi` dihapus. Nama UI "Test Drive" → "Simulasi" (K-11); nama teknis tetap.

## 5. Konvensi

| Hal | Konvensi |
| --- | --- |
| Penamaan field JSON / kolom DB | `snake_case`, sama dengan kolom dataset (tanpa lapisan konversi) |
| ID prodi | `id_prodi` dari snpmb.id (kunci bersama semua file data) |
| Nama provinsi | Selalu dinormalisasi lewat `ak_provinsi_crosswalk.csv` |
| Akreditasi | Dinormalisasi ke skor 0–4 lewat `ak_akreditasi_map.csv` |
| Format galat | `{ "error": { "kode", "pesan" } }`, status 400 / 404 / 500 (bagian 4) |
| Format tanggal/waktu | _TBD_ |
| Bahasa teks antarmuka | Bahasa Indonesia |
| Variabel lingkungan | `.env` (tidak di-commit), contoh di `.env.example` — mis. kunci Gemini, kredensial Google OAuth, URL Supabase. Login butuh `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |

## 6. Strategi Test

- **Wajib dites:** aturan satu provinsi (termasuk kasus beda format nama provinsi dan pemekaran Papua), label keketatan,
  gerbang eligibilitas, skor akademik SNBP, peluang SNBT, kecocokan minat, fallback prodi tanpa histori, bentuk respons endpoint.
- **Skenario uji:** 10 skenario siswa (PRD sumber bagian 8).
- **Tidak wajib:** komponen UI murni tampilan.

## 7. Keputusan Terbuka

Jangan diputuskan agen sendiri; tanyakan pemiliknya.

| Kode | Pertanyaan | Pemilik |
| --- | --- | --- |
| — | Tidak ada keputusan terbuka saat ini. | — |

Sudah diputuskan (2026-10-15): TBD-01 Supabase hosted · TBD-02 Vitest · TBD-03 Vercel · TBD-04 `snake_case` ·
TBD-05 skema di `supabase/migrations/20261015000000_skema_awal.sql`, akses lewat supabase-js di server (tanpa ORM),
impor dengan `scripts/impor_data.py` (Python stdlib + `psql \copy`), config aturan tetap file JSON di `Data/`.

## 8. Risiko Teknis

| Risiko | Mitigasi |
| --- | --- |
| Nama provinsi berbeda antar file → aturan provinsi salah | Join wajib lewat crosswalk; provinsi PTN dari `ak_ptn.csv` |
| SNBP: diterima > daya tampung di 3.134 data | Rasio memakai diterima ÷ peminat |
| 212 prodi tanpa histori, 203 tanpa estimasi UTBK | Fallback rata-rata rumpun di PTN sama, label "data terbatas" |
| Data PDDikti tidak lengkap (kompetensi, deskripsi, masa studi, koordinat) | Tampilkan field yang ada saja; koordinat dari `ak_ptn.csv` |
| Gemini mengarang angka atau output tidak valid | Function calling ke API internal; validasi skema JSON; fallback bank soal |
| Soal versi 1 terimpor ganda | Versi 1 sudah dihapus; impor `ak_soal_spesifik_prodi_ptn_v2.csv` |
| Ukuran data besar (261.558 baris peminat per provinsi) | Impor ke DB dengan indeks; jangan dimuat ke klien |
