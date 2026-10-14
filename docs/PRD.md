# PRD — Cocokin!

> Menjawab: **apa yang dibangun dan mengapa.** Bentuk teknisnya di `ARSITEKTUR.md`.
> Ringkasan terstruktur dari dokumen sumber `referensi/PRD_Cocokin_v2.1.md`.
> Spesifikasi per halaman, rumus lengkap, dan tabel dataset dirujuk ke dokumen sumber; jangan disalin ulang di sini.

## 0. Metadata

| Butir | Isi |
| --- | --- |
| Versi | 2.1 |
| Tanggal | 2026-10-15 |
| Status | Disepakati (mengikuti PRD sumber v2.1) |
| Sumber | `referensi/PRD_Cocokin_v2.1.md`, `Data/README.md`, `Data/AUDIT_DATA.md` |
| Konteks | Hackathon JOINTS UGM 2026 · Tema Education · Subtema siswa SMA kelas akhir |

## 1. Ringkasan

**Cocokin!** — *"Cari yang Cocok, Uji Rasanya, Tembus Kampus Impianmu!"* — adalah platform web untuk
siswa SMA/SMK/MA kelas 12 yang menggabungkan tiga hal: cek kecocokan jurusan (minat RIASEC/O*NET),
prediksi peluang masuk PTN lewat SNBP/SNBT berbasis data resmi snpmb.id, dan *Test Drive* 60 detik
untuk merasakan cara berpikir mahasiswa sebuah prodi. Gaya visual retro pixel 8-bit dengan palet warna Google.

Nilai inti: menjawab dua ketakutan siswa — *"Apakah aku bisa lolos?"* dan *"Apakah aku bakal nyesel?"*

## 2. Masalah

1. **Salah jurusan** — banyak mahasiswa merasa salah jurusan (angka "87%/ICCN" belum terverifikasi; jangan
   dipakai tanpa sumber), berujung IPK turun, pindah jurusan, atau putus kuliah.
2. **SNBP 2026 bersifat "one-way ticket"** — lulus SNBP berarti tidak bisa ikut UTBK-SNBT maupun Mandiri di PTN mana pun.
3. **Solusi yang ada terpisah-pisah:** kalkulator SNBP tidak peduli kecocokan; tes minat tidak tahu realitas
   kuota dan persaingan; tidak ada pratinjau perkuliahan.

Solusi: **Dual-Engine** — *Admission Matcher* (peluang berbasis data resmi 2021–2026) dan *Test Drive 60 Detik*
(kompetensi nyata prodi dari PDDikti).

## 3. Tujuan, Non-Goals, Metrik

- **Tujuan:**
  - Memberi 2 rekomendasi jurusan + kampus (Dream Goal dan Safety Net serumpun) yang patuh aturan SNBP 2026.
  - Menampilkan kecocokan minat dan estimasi peluang yang dapat dijelaskan ("Kenapa?") dan bersumber data.
  - Memungkinkan siswa mencoba soal/skenario kompetensi untuk seluruh 5.150 prodi di 146 PTN.
  - Memisahkan tegas angka **resmi**, **estimasi**, dan **sintetis** di antarmuka.
- **Non-goals (sengaja tidak dibangun):**
  - LLM tidak menentukan rekomendasi, skor kecocokan, atau angka peluang (semua deterministik).
  - Tidak menampilkan "mata kuliah asli" per prodi (data tidak tersedia publik) — diganti kompetensi lulusan resmi.
  - Tidak menghitung UKT per prodi.
  - Tidak menjamin kelulusan; semua peluang berupa estimasi berlabel.
  - Tidak menyimpan alamat lengkap siswa atau foto rapor/sertifikat setelah diekstrak.
  - Jalur Mandiri tidak dicakup.
- **Metrik keberhasilan:** _TBD (lihat OQ-03)_. Kandidat dari PRD sumber: 10 skenario siswa uji lolos,
  soal 3–5 prodi demo sudah ditinjau, aturan provinsi teruji memakai crosswalk, demo video 2 menit.

## 4. Pengguna

| Pengguna | Kebutuhan utama |
| --- | --- |
| Siswa SMA/SMK/MA kelas 12 (pejuang SNBP) | Tahu apakah masuk kuota eligible sekolah, peluang per prodi/kampus, dan pilihan yang patuh aturan provinsi |
| Pejuang SNBT (termasuk gap year) | Membandingkan skor TO dengan estimasi skor prodi, memantau riwayat TO |
| Siswa yang belum tahu minat | Kuis minat singkat, kode Holland, prodi yang cocok, dan pratinjau rasa kuliah |
| Guru BK | Rujukan data resmi untuk mendampingi siswa |

Sebagian besar pengguna **di bawah 18 tahun** — berlaku aturan privasi BR-14.

## 5. Fitur

ID halaman (Hal.) mengacu pada 13 halaman di PRD sumber bagian 4.
Prioritas diturunkan dari PRD sumber: halaman inti = Wajib; yang ditandai opsional di sumber = Sebaiknya.

| ID | Fitur | Hal. | Prioritas | Kriteria terima |
| --- | --- | --- | --- | --- |
| F-01 | Beranda hero + CTA onboarding | 1–2 | Wajib | Navbar (Beranda, Cocokin, Edit Preferensi, Login/Logout), headline, tombol `MULAI SEKARANG` |
| F-02 | Login Google + smart routing | 2 | Wajib | Belum login → modal Google; login & sudah isi preferensi → langsung Hal. 8; sesi 30 hari |
| F-03 | Kuis minat RIASEC + chip hobi + mapel favorit | 3 | Wajib | 30 item Mini-IP (5 per layar, skala 5), kode Holland 3 huruf; chip hobi bobot ≤ 20%; maks 3 mapel favorit |
| F-04 | Pilih jalur SNBP/SNBT + validasi | 4 | Wajib | Gap year → SNBP nonaktif; peringatan bagi yang pernah lulus SNBP 2024–2026 |
| F-05 | Bahan SNBP: NPSN, rapor, TKA, prestasi | 5 | Wajib | Lookup NPSN/nama sekolah mengisi nama, wilayah, akreditasi, kuota eligible per jurusan; input rapor smt 1–5, mapel pendukung (maks 2), peringkat paralel, TKA, prestasi |
| F-06 | Alamat & reputasi alumni | 6 | Wajib | Provinsi/kab terisi dari NPSN; reputasi alumni self-report; tag kampus alumni dengan autocomplete 146 PTN + alias |
| F-07 | Riwayat alumni & bahan SNBT | 7 | Wajib | Pertanyaan alumni tidak daftar ulang (opsional, berlabel bukan aturan resmi); 7 subtes TO, sumber TO, riwayat TO + grafik; flag portofolio |
| F-08 | Dashboard rekomendasi | 8 | Wajib | 2 kartu (Dream Goal, Safety Net serumpun), % kecocokan, peluang per kampus berupa rentang + label + tombol "Kenapa?", info PDDikti |
| F-09 | Chatbot Cocokin! + drawer menu | 9–11 | Wajib | Angka hanya dari API internal (function calling); jawab "datanya tidak tersedia" bila tidak ada |
| F-10 | Katalog 5.150 prodi | 12 | Wajib | Fuzzy search + alias; filter rumpun, jenjang, 9 klaster, akreditasi, provinsi, wajib portofolio; virtualized list |
| F-11 | Test Drive mini challenge | 13 | Wajib | Soal 4 opsi + timer 60 detik dari bank soal berlapis; reveal pembahasan, kompetensi lulusan, fakta kampus & persaingan; refleksi memperbarui skor Hal. 8 |
| F-12 | Ekstraksi AI teks hobi bebas | 3 | Sebaiknya | Teks bebas → chip hobi/mapel, dikonfirmasi siswa |
| F-13 | Upload foto/PDF rapor + ekstraksi AI | 5 | Sebaiknya | Nilai hasil ekstraksi wajib dikonfirmasi; file dihapus setelah diekstrak |
| F-14 | Skenario studi kasus Gemini (AI 3) | 13 | Sebaiknya | Grounding ke kompetensi prodi, validasi skema JSON, label "dibuat AI", fallback ke bank soal |
| F-15 | Mode lengkap kuis 60 item | 3 | Sebaiknya | Dipakai otomatis bila profil terlalu datar |
| F-16 | Hapus akun & data | — | Wajib | Tombol hapus akun menghapus profil dan preferensi |
| F-17 | Input suara di chatbot | 10 | Nanti | — |

### Alur pengguna utama

1. Beranda (1) → CTA (2) → **gerbang login Google**.
2. Belum pernah isi preferensi: Minat (3) → Jalur (4) → Bahan SNBP (5) → Alamat & Alumni (6) → Riwayat & SNBT (7).
3. Hasil di Halaman Cocokin (8). Pengguna lama langsung ke sini.
4. Dari 8: banner → Chatbot (9–11), atau tombol Test Drive → Katalog (12) → Mini Challenge (13).
5. Refleksi Test Drive memperbarui skor kecocokan di Halaman 8.

## 6. Aturan Bisnis

Semua parameter disimpan di config (`Data/aturan_seleksi_2026.json`, `Data/form_minat_config.json`), bukan di-hardcode.
Rumus lengkap: PRD sumber bagian 6.2.

| ID | Aturan |
| --- | --- |
| BR-01 | **Satu provinsi SNBP:** dua pilihan prodi valid hanya jika salah satu PTN berada di provinsi sekolah (atau hanya satu pilihan). Provinsi selalu dibandingkan lewat `ak_provinsi_crosswalk.csv`; provinsi PTN dari `ak_ptn.csv`, bukan PDDikti. Pelanggaran → badge merah. |
| BR-02 | **Keketatan SNBP** = diterima ÷ peminat (data 2025, tampilkan juga rata-rata 3 tahun). **SNBT** = daya tampung ÷ peminat. |
| BR-03 | **Label keketatan:** < 5% Sangat Ketat 🔴 · 5–<15% Ketat 🟡 · 15–<35% Sedang 🔵 · ≥ 35% Longgar 🟢. |
| BR-04 | **Gerbang eligibilitas:** peringkat paralel > kuota eligible jurusan sekolah → "Belum masuk kuota eligible — fokus ke SNBT"; peluang SNBP tidak dihitung. Sekolah tanpa data PDSS/akreditasi → perkiraan dari persen akreditasi (A 40%, B 25%, C/tidak terakreditasi 5%) dengan pemberitahuan. |
| BR-05 | **Skor akademik SNBP:** S = w1·Rapor_terkoreksi + w2·Mapel Pendukung + w3·Prestasi, w1 ≥ 0,5 dan w2 + w3 ≤ 0,5 (default 0,6/0,25/0,15). Rapor_terkoreksi = Rapor + k·z_TKA; k adalah asumsi berlabel. |
| BR-06 | **Faktor akreditasi dan alumni self-report** masing-masing maksimal ±5 poin persentil. Alumni tidak daftar ulang bukan aturan resmi SNPMB dan hanya faktor kecil. |
| BR-07 | **Output peluang** selalu rentang (mis. 35–50%) + label rendah/sedang/tinggi + 3 alasan berbasis data + label "estimasi". |
| BR-08 | **Prodi tanpa histori** (212 prodi): pakai rata-rata rumpun yang sama di PTN yang sama, label "data terbatas". |
| BR-09 | **Peluang SNBT:** P = 1 / (1 + e^(−1,7·(TO − est_skor_utbk)/35)); `est_skor_utbk` wajib berlabel estimasi. TO bukan skala IRT → peringatan skala. |
| BR-10 | **Kecocokan minat** = 0,8 × ((r_Pearson(profil siswa, profil prodi) + 1)/2 × 100) + 0,2 × skor hobi. Label: ≥ 80 Sangat cocok · ≥ 65 Cocok · ≥ 50 Cukup · < 50 Kurang cocok. Tie-breaker: mapel favorit, refleksi Test Drive. |
| BR-11 | **Validasi jalur:** lulusan 2024/2025 tidak bisa SNBP; yang lulus SNBP 2024–2026 tidak bisa SNBT 2026. |
| BR-12 | **Grounding AI:** LLM tidak boleh mengarang angka. Chatbot mengambil angka dari API internal; hasil ekstraksi AI wajib dikonfirmasi siswa. |
| BR-13 | **Label data di UI:** resmi (snpmb.id, PDDikti, Kepmendikdasmen 102/M/2025), estimasi (skor UTBK prodi, koreksi TKA, peluang), sintetis (data alumni — demo saja), soal (dibuat otomatis, perlu review). |
| BR-14 | **Privasi:** simpan data seperlunya; alamat hanya provinsi & kab/kota; foto rapor/sertifikat dihapus setelah diekstrak; sediakan hapus akun & data. |
| BR-15 | **Portofolio** wajib untuk prodi seni & olahraga sesuai kolom `portofolio` di data (lihat OQ-06 soal jumlahnya). |

## 7. Data

Seluruh dataset ada di `Data/` (detail: PRD sumber bagian 6.1, `Data/README.md`, `Data/AUDIT_DATA.md`).

| Entitas | Sumber utama | Catatan |
| --- | --- | --- |
| Prodi (5.150) & PTN (146) | `ak_prodi_master.csv`, `ak_ptn.csv` (snpmb.id) | Vektor RIASEC, kode Holland, rasio diterima, estimasi skor UTBK |
| Statistik seleksi | `ak_snbp_prodi.csv`, `ak_snbt_prodi.csv`, `ak_snbt_peminat_provinsi.csv` | Histori 2021–2025; data 2026 belum rilis |
| Sekolah (42.669) | `ak_sekolah_kuota_snbp_2026.csv` | NPSN, akreditasi, kuota eligible per jurusan |
| Wilayah | `ak_kabupaten_kota.csv`, `ak_provinsi_crosswalk.csv` | Crosswalk wajib untuk BR-01 |
| Profil & akreditasi prodi | `ak_pddikti_prodi.csv`, `ak_profil_prodi_ptn.json`, `ak_akreditasi_map.csv` | 95% prodi tercocokkan ke PDDikti |
| Instrumen minat | `form_minat_riasec_items.csv`, `form_minat_config.json`, `rumpun_riasec.csv` | O*NET, CC BY 4.0 — wajib atribusi |
| Aturan seleksi | `aturan_seleksi_2026.json`, `mapel_pendukung_snbp.csv` | Config mesin aturan |
| Soal | `ak_soal_spesifik_prodi_ptn_v2.csv`, `ak_soal_umum_prodi.csv`, `bank_soal_simulasi.csv` | Pakai `_v2`; versi 1 jangan diimpor |
| Pengguna | Dibuat aplikasi | Akun Google, preferensi, nilai rapor/TKA/TO — **data sensitif anak di bawah umur** |
| Alumni | `ak_alumni_sintetis_snbp.csv` | **Sintetis**, demo saja |

## 8. Kebutuhan Non-Fungsional

- **Bahasa:** antarmuka Bahasa Indonesia.
- **Transparansi:** setiap angka punya sumber dan label (resmi/estimasi/sintetis); tombol "Kenapa?" di peluang.
- **Privasi & keamanan:** BR-14; sesi HttpOnly cookie; tidak ada rahasia (API key Gemini, OAuth) di repo.
- **Keandalan AI:** output Gemini divalidasi skema; selalu ada fallback non-AI.
- **Performa:** katalog 5.150 prodi memakai virtualized list dan pencarian instan.
- **Perangkat:** _TBD (lihat OQ-04)_ — target siswa SMA kemungkinan besar mobile-first.
- **Aksesibilitas:** lihat `DESIGN_SYSTEM.md` bagian 8.

## 9. Rilis Dan Milestone

| Milestone | Target | Isi |
| --- | --- | --- |
| MVP hackathon | Sprint 48 jam (tanggal TBD, OQ-02) | F-01 s.d. F-11, F-16; impor dataset; 3–5 prodi demo dengan soal yang sudah ditinjau |
| Materi lomba | Bersama MVP | Pitch deck 10 slide (termasuk deklarasi AI dan slide "Sumber Data & Label Estimasi"), video demo 2 menit |
| Pasca-hackathon | TBD | F-12–F-15, F-17; pilot kuis minat 100–200 siswa sebelum klaim "tervalidasi untuk siswa Indonesia" |

## 10. Asumsi, Risiko, Pertanyaan Terbuka

| Kode | Hal | Pemilik |
| --- | --- | --- |
| A-01 | Bobot komponen SNBP, koreksi TKA (k), skor UTBK prodi, dan bobot prestasi tidak dipublikasikan → memakai default/estimasi di config, berlabel. | farrelzaki |
| A-02 | Data mata kuliah, UKT, rekam jejak alumni nyata, konversi TO bimbel, peminat/diterima 2026 tidak tersedia publik (PRD sumber bagian 10). | farrelzaki |
| R-01 | Klaim "87% salah jurusan" sulit diverifikasi → pakai formulasi aman kecuali sumber primer ditemukan. | farrelzaki |
| R-02 | Soal dibangkitkan otomatis (status `otomatis_perlu_review`) bisa keliru → tinjau manual untuk prodi demo. | farrelzaki |
| R-03 | Data pengguna di bawah umur → minimalkan data dan sediakan penghapusan. | farrelzaki |
| OQ-01 | `Data/README.md` dan `AUDIT_DATA.md` masih memakai nama lama "ArahKuliah" serta nama halaman "Simulasi/Nembak Jurusan", dan menyuruh membuang awalan `ak_` yang ternyata masih dipakai. Perlu diselaraskan? | farrelzaki |
| OQ-02 | Tanggal sprint dan tenggat pengumpulan hackathon. | farrelzaki |
| OQ-03 | Metrik keberhasilan yang diukur (selain kriteria juri). | farrelzaki |
| OQ-04 | Perangkat utama: mobile-first atau desktop-first? | farrelzaki |
| OQ-05 | `ak_soal_spesifik_prodi_ptn.csv` (versi 1) direkomendasikan audit untuk dihapus; hapus dari repo atau cukup tidak diimpor? | farrelzaki |
| OQ-06 | PRD sumber menyebut 229 prodi wajib portofolio, tetapi kolom `portofolio` di `ak_prodi_master.csv` terisi untuk 267 prodi. Mana yang benar? | farrelzaki |
