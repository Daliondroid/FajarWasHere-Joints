# QA Cocokin! — 10 Skenario Siswa & Tinjauan Soal Prodi Demo (T-10)

Tanggal: 2026-10-16 · Pelaksana: farrelzaki · Kriteria demo MVP: `docs/PRD.md` bagian 3, risiko R-02.

## 1. 10 skenario siswa

Diuji otomatis terhadap data Supabase asli (prodi, sekolah, PTN, soal). Akun dan preferensi memakai repo palsu
di memori, jadi tidak ada data yang ditulis ke DB. Kode: `tests/qa/skenario.test.ts`.

```bash
node --env-file=.env node_modules/vitest/vitest.mjs run tests/qa
```

Tanpa kunci Supabase, test ini dilewati (`npm test` biasa tetap jalan).

| # | Siswa | Yang diuji | Hasil |
| --- | --- | --- | --- |
| S1 | MAN 2 Aceh Besar, MIPA, peringkat 2, minat Investigative | 3 kartu SNBP (Dream, Safety serumpun, Alternatif rumpun lain); pasangan #1 + #2 sah BR-01; peluang dihitung | Lulus |
| S2 | SMA Jawa Barat (kuota MIPA 10), peringkat 1 | Bila Dream di luar Jabar, Safety Net di Jabar; validasi provinsi sah | Lulus |
| S3 | Aceh, peringkat 16 dari kuota 15 | SNBP tidak dihitung; catatan "Belum masuk kuota eligible — fokus ke SNBT" (BR-04) | Lulus setelah perbaikan (temuan Q-1) |
| S4 | Sekolah tanpa data PDSS (akreditasi A), 100 siswa jurusan | Kuota diperkirakan 40% = 40 siswa, alasan menyebut perkiraan | Lulus |
| S5 | Lulusan 2025 (gap year) | Preferensi SNBP ditolak, SNBT diterima (BR-11) | Lulus |
| S6 | Pernah lulus SNBP | Preferensi SNBT ditolak (BR-11) | Lulus |
| S7 | SNBT dengan TO 750 / 450 / tanpa TO | Peluang naik seiring skor TO; tanpa TO peluang tidak dihitung + catatan | Lulus |
| S8 | Minat Artistic | Kode Holland siswa dan prodi Dream diawali A; prodi seni membawa flag portofolio (BR-15) | Lulus |
| S9 | Prodi baru tanpa histori (Teknik Sumber Daya Air USK) | Fallback rata-rata rumpun di PTN sama, label "data terbatas" (BR-08) | Lulus |
| S10 | Dua pilihan SNBP | UI sah untuk sekolah Jabar (2 provinsi), tidak sah untuk Aceh; UNIPA sah untuk Papua Barat Daya; Uncen tidak sah untuk Papua Pegunungan (pemekaran 2022) — lewat crosswalk | Lulus |

Ditambah uji: Simulasi tiga prodi demo hanya menampilkan soal berstatus `ditinjau_tim`. **Total 11/11 lulus.**

Chatbot (F-09) diuji manual dengan Gemini nyata di T-09 (rekomendasi, peluang per kampus, perbandingan daya tampung,
pertanyaan di luar data). Alur UI Hal. 1–13 end-to-end menunggu UI daliondroid tersambung ke API (T-20).

## 2. Tinjauan soal prodi demo (R-02)

Prodi demo (keputusan farrelzaki): **332021** STEI-K ITB, **382020** Teknik Informatika ITS,
**361045** Teknologi Informasi UGM, beserta soal rumpun `informatika` dan `sistem_informasi`. Total 13 soal.

Kriteria: kunci benar; tepat satu jawaban yang masuk akal; pengecoh jelas dari bidang lain; kalimat utuh tanpa typo;
posisi kunci tidak menumpuk.

| Soal | Kunci | Temuan | Tindakan |
| --- | --- | --- | --- |
| JUR-informatika-1 (binary search) | A ✓ | — | Ditandai ditinjau |
| JUR-informatika-2 (LIFO) | ✓ | Kunci di A | Opsi diacak ulang → kunci C |
| JUR-informatika-3 (pseudocode = 10) | ✓ | Kunci di A | Opsi diacak ulang → kunci B |
| JUR-sistem_informasi-1 (ERD) | ✓ | Kunci di A | Opsi diacak ulang → kunci D |
| JUR-sistem_informasi-2 (SQL) | D ✓ | — | Ditandai ditinjau |
| JUR-sistem_informasi-3 (SDLC) | ✓ | Kunci di A | Opsi diacak ulang → kunci C |
| PT-361045-CAPAIAN (TI UGM) | B ✓ | Pengecoh D (telekomunikasi broadband) bisa dianggap benar untuk TI; C terpotong "; dan"; spasi hilang di A | D diganti pengecoh bidang lain; A, C dirapikan |
| GEN-332021-1 (STEI-K) | A ✓ | Typo "troubel"; D generik & terpotong, berlaku untuk semua prodi | Typo diperbaiki; D diganti |
| GEN-332021-2 | C ✓ | A terpotong; D "analisis visual" ambigu untuk komputasi | A dirapikan; D diganti |
| GEN-332021-3 | B ✓ | D "berpikir sistematis dan logis" jelas juga benar; A "manajemen kualitas" ambigu | A dan D diganti |
| GEN-382020-1 (TI ITS) | B ✓ | — | Ditandai ditinjau |
| GEN-382020-2 | C ✓ | — | Ditandai ditinjau |
| GEN-382020-3 | A ✓ | C terpotong dan generik | C diganti |

Semua kunci asli benar; tidak ada jawaban yang perlu diganti. Pengecoh pengganti ditulis tim (bukan dari PDDikti) dan
sengaja diambil dari bidang yang jelas berbeda. Sebaran kunci seluruh bank soal seimbang (A/B/C/D ±25%); penumpukan
hanya kebetulan pada 6 soal rumpun di atas.

Perubahan ada di `scripts/tinjau_soal_demo.sql` (idempoten). Sudah diterapkan ke Supabase `cocokin` 2026-10-16.
**Jalankan ulang setiap selesai impor ulang dataset**, karena `Data/` tidak diubah.

## 3. Temuan

| Kode | Temuan | Status |
| --- | --- | --- |
| Q-1 | `/api/rekomendasi`: siswa dengan data lengkap tapi di luar kuota eligible mendapat catatan "Lengkapi rapor, peringkat paralel, dan sekolah…" (menyesatkan) | Diperbaiki: catatan memakai alasan dari mesin peluang |
| Q-2 | Soal otomatis PDDikti: pengecoh kadang terpotong, generik ("mengembangkan diri…"), atau masih satu bidang sehingga ambigu | Diperbaiki untuk prodi demo; prodi lain tetap berlabel `otomatis_perlu_review` |
| Q-3 | UI T-20 (daliondroid): tombol hapus akun memanggil `DELETE /api/akun` tanpa badan `{"konfirmasi":"HAPUS"}` → akun tidak terhapus, UI tetap redirect | Dilaporkan di log KOLABORASI (2026-10-16) |
| Q-4 | UI `/cocokin` (daliondroid): catatan "minat 40%, gaya belajar 25%, peluang 35%" tidak sesuai BR-10 | Dilaporkan di log KOLABORASI (2026-10-16) |
| Q-5 | Safety Net memprioritaskan peluang sehingga bisa memilih prodi serumpun dengan kecocokan lebih rendah (mis. 86,9 vs 95,6) | Diperbaiki (T-21): kandidat dibatasi ≤ 5 poin di bawah Dream Goal (lalu 10, lalu tanpa batas + catatan). Siswa S1 kini mendapat Biologi UIN Ar-Raniry (95,6) |
| Q-6 | Chatbot: pemeriksaan BR-12 hanya untuk angka; tautan/teks faktual dari pengetahuan model tidak diperiksa | Dicatat; risiko kecil untuk demo |
