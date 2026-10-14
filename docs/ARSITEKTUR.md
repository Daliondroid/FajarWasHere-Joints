# Arsitektur — Cocokin!

> Menjawab: **dengan apa dan dalam bentuk apa sistem dibangun.**
> Keputusan di sini mengikat. Perubahan besar butuh persetujuan pengguna (lihat `AGENTS.md` bagian 6).

Status: **draf** — stack diambil dari PRD sumber v2.1 (`referensi/PRD_Cocokin_v2.1.md` bagian 1, 6, 7); belum ada scaffolding.

## 1. Stack

| Lapisan | Pilihan | Versi | Alasan |
| --- | --- | --- | --- |
| Frontend + Backend | Next.js (App Router, TypeScript) | 15.x — verifikasi saat scaffolding | Satu repo untuk UI dan route handler `/api/*` |
| Autentikasi | NextAuth (Google OAuth) | TBD | Login Gmail, sesi HttpOnly cookie 30 hari |
| Basis data | PostgreSQL via Supabase | TBD | Impor CSV dataset; query katalog dan peluang |
| Styling | Tailwind CSS | TBD | Token dari `DESIGN_SYSTEM.md` |
| AI | Google Gemini 2.5 Flash (Google AI Studio) | `gemini-2.5-flash` atau Flash terbaru | Ekstraksi, chatbot dengan function calling, skenario Test Drive. Gemini 1.5 Flash sudah dihentikan. |
| Test | _TBD (TBD-02)_ | — | Wajib untuk logika skoring |
| Hosting | _TBD (TBD-03)_ | — | — |

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

<!-- Isi setelah scaffolding. Jelaskan tanggung jawab tiap folder. -->

```
Data/          dataset sumber (hanya dibaca; diimpor ke DB) + kode referensi Python
docs/          PRD, arsitektur, design system, referensi
src/           TBD saat scaffolding
tests/         TBD
```

Aturan batas:

- UI hanya bicara ke backend lewat endpoint di bagian 4.
- Logika skoring (kecocokan, keketatan, eligibilitas, peluang, aturan provinsi) adalah **fungsi murni** di modul tersendiri
  dan wajib dites. Implementasi rujukan: `Data/kode/skoring_referensi.py`.
- Parameter aturan dibaca dari `Data/aturan_seleksi_2026.json` dan `Data/form_minat_config.json`, tidak di-hardcode.
- Pemanggilan Gemini hanya dari server; API key lewat `.env`.

## 4. Kontrak API

Status: **draf — belum disepakati.** Daftar endpoint dari PRD sumber bagian 8; masukan/keluaran belum dirinci.
Setelah disepakati, kontrak dibekukan.

Aturan perubahan setelah beku:

1. Ubah hanya dengan persetujuan pengguna.
2. Dalam commit tersendiri, tidak dicampur perubahan fitur.
3. Menambah field opsional itu murah; mengganti nama/menghapus field itu mahal.

| Endpoint | Fitur | Masukan | Keluaran |
| --- | --- | --- | --- |
| `GET /api/school` | F-05, F-06 | NPSN 8 digit atau nama sekolah | Nama resmi, kab/kota, provinsi, akreditasi, kuota eligible per jurusan |
| `GET /api/prodi` | F-08, F-09, F-10, F-11 | Kata kunci, filter (rumpun, jenjang, klaster, akreditasi, provinsi, portofolio) | Daftar/detail prodi + statistik + info PDDikti |
| `POST /api/peluang` | F-08, F-09 | Profil akademik siswa + prodi pilihan | Rentang peluang, label, 3 alasan, flag estimasi/data terbatas, validasi provinsi |
| `POST /api/kecocokan` | F-03, F-08 | Jawaban kuis, chip hobi, mapel favorit | Skor RIASEC, kode Holland, % kecocokan per prodi |
| `GET /api/test-drive` | F-11, F-14 | id prodi | Soal (4 opsi), pembahasan, kompetensi lulusan, fakta kampus & persaingan |
| `POST /api/chat` | F-09 | Pesan pengguna | Jawaban chatbot (angka hanya dari API internal) |

## 5. Konvensi

| Hal | Konvensi |
| --- | --- |
| Penamaan field JSON / kolom DB | _TBD (TBD-04)_ — dataset sumber memakai `snake_case` |
| ID prodi | `id_prodi` dari snpmb.id (kunci bersama semua file data) |
| Nama provinsi | Selalu dinormalisasi lewat `ak_provinsi_crosswalk.csv` |
| Akreditasi | Dinormalisasi ke skor 0–4 lewat `ak_akreditasi_map.csv` |
| Format galat | _TBD_ |
| Format tanggal/waktu | _TBD_ |
| Bahasa teks antarmuka | Bahasa Indonesia |
| Variabel lingkungan | `.env` (tidak di-commit), contoh di `.env.example` — mis. kunci Gemini, kredensial Google OAuth, URL Supabase |

## 6. Strategi Test

- **Wajib dites:** aturan satu provinsi (termasuk kasus beda format nama provinsi dan pemekaran Papua), label keketatan,
  gerbang eligibilitas, skor akademik SNBP, peluang SNBT, kecocokan minat, fallback prodi tanpa histori, bentuk respons endpoint.
- **Skenario uji:** 10 skenario siswa (PRD sumber bagian 8).
- **Tidak wajib:** komponen UI murni tampilan.

## 7. Keputusan Terbuka

Jangan diputuskan agen sendiri; tanyakan pemiliknya.

| Kode | Pertanyaan | Pemilik |
| --- | --- | --- |
| TBD-01 | Supabase (hosted) atau PostgreSQL lokal untuk pengembangan? | farrelzaki |
| TBD-02 | Framework test (TypeScript) untuk logika skoring. | farrelzaki |
| TBD-03 | Platform hosting demo. | farrelzaki |
| TBD-04 | Konvensi field JSON API: `snake_case` mengikuti dataset atau `camelCase`? | farrelzaki |
| TBD-05 | Skema tabel DB dan cara impor CSV (skrip seed). | farrelzaki |

## 8. Risiko Teknis

| Risiko | Mitigasi |
| --- | --- |
| Nama provinsi berbeda antar file → aturan provinsi salah | Join wajib lewat crosswalk; provinsi PTN dari `ak_ptn.csv` |
| SNBP: diterima > daya tampung di 3.134 data | Rasio memakai diterima ÷ peminat |
| 212 prodi tanpa histori, 203 tanpa estimasi UTBK | Fallback rata-rata rumpun di PTN sama, label "data terbatas" |
| Data PDDikti tidak lengkap (kompetensi, deskripsi, masa studi, koordinat) | Tampilkan field yang ada saja; koordinat dari `ak_ptn.csv` |
| Gemini mengarang angka atau output tidak valid | Function calling ke API internal; validasi skema JSON; fallback bank soal |
| Soal versi 1 terimpor ganda | Impor hanya `ak_soal_spesifik_prodi_ptn_v2.csv` |
| Ukuran data besar (261.558 baris peminat per provinsi) | Impor ke DB dengan indeks; jangan dimuat ke klien |
