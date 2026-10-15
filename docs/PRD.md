# PRD — Cocokin!

> Menjawab: **apa yang dibangun dan mengapa.** Bentuk teknisnya di `ARSITEKTUR.md`.
> Ringkasan terstruktur dari dokumen sumber `referensi/PRD_Cocokin_v2.1.md`.
> Spesifikasi per halaman, rumus lengkap, dan tabel dataset dirujuk ke dokumen sumber; jangan disalin ulang di sini.
> Jika dokumen ini berbeda dengan PRD sumber, **dokumen ini yang berlaku** (revisi 2.2, bagian 11).

## 0. Metadata

| Butir | Isi |
| --- | --- |
| Versi | 2.2 |
| Tanggal | 2026-10-15 |
| Status | Disepakati (PRD sumber v2.1 + revisi 2.2, lihat bagian 11) |
| Sumber | `referensi/PRD_Cocokin_v2.1.md`, `Data/README.md`, `Data/AUDIT_DATA.md`, revisi pengguna 2026-10-15 (T-17), aturan TKA Kemendikdasmen |
| Desain | Figma `FIGMA-JOINTS`, page **HIFI v3** (mobile 402 px dan desktop 1440 px) |
| Konteks | Hackathon JOINTS UGM 2026 · Tema Education · Subtema siswa SMA kelas akhir |

## 1. Ringkasan

**Cocokin!** — *"Cari yang Cocok, Uji Rasanya, Tembus Kampus Impianmu!"* — adalah platform web untuk
siswa SMA/SMK/MA kelas 12 yang menggabungkan tiga hal: cek kecocokan jurusan (minat RIASEC/O*NET),
prediksi peluang masuk PTN lewat SNBP/SNBT berbasis data resmi snpmb.id, dan *Test Drive* (studi kasus singkat, tanpa batas waktu)
untuk merasakan cara berpikir mahasiswa sebuah prodi. Gaya visual retro pixel 8-bit dengan palet warna Google.

Nilai inti: menjawab dua ketakutan siswa — *"Apakah aku bisa lolos?"* dan *"Apakah aku bakal nyesel?"*

## 2. Masalah

1. **Salah jurusan** — banyak mahasiswa merasa salah jurusan (angka "87%/ICCN" belum terverifikasi; jangan
   dipakai tanpa sumber), berujung IPK turun, pindah jurusan, atau putus kuliah.
2. **SNBP 2026 bersifat "one-way ticket"** — lulus SNBP berarti tidak bisa ikut UTBK-SNBT maupun Mandiri di PTN mana pun.
3. **Solusi yang ada terpisah-pisah:** kalkulator SNBP tidak peduli kecocokan; tes minat tidak tahu realitas
   kuota dan persaingan; tidak ada pratinjau perkuliahan.

Solusi: **Dual-Engine** — *Admission Matcher* (peluang berbasis data resmi 2021–2026) dan *Test Drive*
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
- **Metrik keberhasilan (kriteria demo MVP):**
  - 10 skenario siswa lolos uji.
  - Soal 3–5 prodi demo sudah ditinjau manual.
  - Aturan satu provinsi teruji memakai crosswalk.
  - Alur Halaman 1–13 berjalan end-to-end.
  - Video demo 2 menit selesai.

## 4. Pengguna

| Pengguna | Kebutuhan utama |
| --- | --- |
| Siswa SMA/SMK/MA kelas 12 (pejuang SNBP) | Tahu apakah masuk kuota eligible sekolah, peluang per prodi/kampus, dan pilihan yang patuh aturan provinsi |
| Pejuang SNBT (termasuk gap year) | Membandingkan skor TO dengan estimasi skor prodi, memantau riwayat TO |
| Siswa yang belum tahu minat | Kuis minat singkat, kode Holland, prodi yang cocok, dan pratinjau rasa kuliah |
| Guru BK | Rujukan data resmi untuk mendampingi siswa |

Sebagian besar pengguna **di bawah 18 tahun** — berlaku aturan privasi BR-14.

## 5. Fitur

ID halaman (Hal.) mengacu pada 13 halaman di PRD sumber bagian 4, ditambah **Hal. P (Halaman Preferensi)** dari revisi 2.2.
Prioritas disepakati 2026-10-15: halaman inti dan hapus akun = Wajib; yang opsional di PRD sumber = Sebaiknya; input suara = Nanti.

| ID | Fitur | Hal. | Prioritas | Kriteria terima |
| --- | --- | --- | --- | --- |
| F-01 | Beranda hero + CTA onboarding | 1–2 | Wajib | Navbar (Beranda, Cocokin, **Preferensi**, Login/Logout). Garis warna (biru-merah-kuning-hijau, terputus per segmen) di bawah navbar adalah **indikator progres scroll**: terisi warna sejauh halaman sudah di-scroll, sisanya abu-abu; berlaku di semua halaman. Headline, tombol `MULAI SEKARANG`; isi CTA berubah menurut status login (F-02) |
| F-02 | Login Google (modal) + smart routing | 2 | Wajib | Klik CTA saat belum login → **modal popup** "Masuk dengan Google" di atas halaman. Setelah login: akun sudah punya preferensi → langsung Hal. 8 (preferensi aktif); belum punya → Hal. P. Status dibaca dari akun di server, bukan dari cache browser: cache terhapus → diminta login lagi dari CTA → tetap langsung ke Hal. 8. Saat login dan sudah punya preferensi, bagian CTA beranda berganti menjadi "Yuk, lihat rekomendasi jurusan untukmu" (tombol ke Hal. 8). Sesi 30 hari |
| F-03 | Kuis minat RIASEC + chip hobi + mapel favorit | 3 | Wajib | 30 item Mini-IP (5 per layar, skala 5), kode Holland 3 huruf; chip hobi bobot ≤ 20%; maks 3 mapel favorit |
| F-04 | Pilih jalur SNBP/SNBT + validasi | 4 | Wajib | Dipilih saat **membuat preferensi**, bersama nama preferensi; satu jalur per preferensi (BR-17). Gap year → SNBP nonaktif; peringatan bagi yang pernah lulus SNBP 2024–2026 |
| F-05 | Bahan SNBP: NPSN, rapor, TKA, prestasi | 5 | Wajib | Lookup NPSN/nama sekolah mengisi nama, wilayah, akreditasi, kuota eligible per jurusan; input rapor smt 1–5, mapel pendukung (maks 2), peringkat paralel, prestasi. Nilai TKA: 3 mapel wajib + **2 mapel pilihan yang dipilih siswa** dari daftar resmi, masing-masing dengan nilainya (BR-18); UI menyarankan mapel pilihan yang sama dengan mapel pendukung prodi incaran |
| F-06 | Alamat & reputasi alumni | 6 | Wajib | Provinsi/kab terisi dari NPSN; reputasi alumni self-report; tag kampus alumni dengan autocomplete 146 PTN + alias |
| F-07 | Bahan SNBT | 7 | Wajib | Hanya untuk preferensi SNBT: 7 subtes TO, sumber TO, riwayat TO + grafik. Flag portofolio (BR-15). Pertanyaan riwayat alumni tidak daftar ulang **dihapus** karena tidak resmi (K-04) |
| F-08 | Dashboard rekomendasi | 8 | Wajib | Memakai preferensi aktif; pemilih preferensi (F-19) di bawah judul. Tampilan ringkas: 2 kartu tiket (Dream Goal, Safety Net serumpun) berisi peringkat, jurusan, kampus, % kecocokan, tombol `SIMULASI` dan `DETAIL`. Tombol `DETAIL` membuka **popup detail**: kode Holland prodi, peluang per kampus (rentang + label keketatan + label estimasi), 3 alasan "Kenapa?" berbasis data, dan info PDDikti (K-07). Footer situs di bawah halaman |
| F-09 | Chatbot Cocokin! + drawer menu | 9–11 | Wajib | Angka hanya dari API internal (function calling); jawab "datanya tidak tersedia" bila tidak ada. Jawaban memakai preferensi aktif. Drawer: Test Drive, **Preferensi**, Riwayat Chat, Logout + pemilih preferensi (F-19) |
| F-10 | Katalog 5.150 prodi | 12 | Wajib | Fuzzy search + alias; filter rumpun, jenjang, 9 klaster, akreditasi, provinsi, wajib portofolio; virtualized list |
| F-11 | Test Drive mini challenge | 13 | Wajib | Soal 4 opsi dari bank soal berlapis, **tanpa timer** (K-06); setelah `KUNCI JAWABAN`, layar soal yang sama tampil versi koreksi: jawaban siswa ditandai merah bila salah, jawaban benar hijau, opsi lain diredupkan, tanpa penjelasan untuk opsi yang salah. Insight di bagian bawah: pembahasan jawaban benar, kompetensi lulusan resmi, fakta kampus & persaingan. **Tanpa rating/refleksi** (K-08) |
| F-12 | Ekstraksi AI teks hobi bebas | 3 | Sebaiknya | Teks bebas → chip hobi/mapel, dikonfirmasi siswa |
| F-13 | Upload foto/PDF rapor + ekstraksi AI | 5 | Sebaiknya | Nilai hasil ekstraksi wajib dikonfirmasi; file dihapus setelah diekstrak |
| F-14 | Skenario studi kasus Gemini (AI 3) | 13 | Sebaiknya | Grounding ke kompetensi prodi, validasi skema JSON, label "dibuat AI", fallback ke bank soal |
| F-15 | Mode lengkap kuis 60 item | 3 | Sebaiknya | Dipakai otomatis bila profil terlalu datar |
| F-16 | Hapus akun & data | — | Wajib | Tombol hapus akun menghapus profil dan preferensi |
| F-17 | Input suara di chatbot | 10 | Nanti | — |
| F-18 | Halaman Preferensi (kelola banyak preferensi) | P | Wajib | Pintu masuk menu **Preferensi** (navbar dan drawer), menggantikan "Edit Preferensi". Berisi kartu preferensi tersimpan + kotak bergaris putus-putus "+ Tambah preferensi" (keadaan kosong: hanya kotak ini). Warna kartu mengikuti jalur: **kuning = SNBP, biru = SNBT**. Kartu menampilkan nama, jalur, status aktif, kode Holland, rekomendasi teratas, dan waktu diperbarui. Aksi: jadikan aktif, edit (membuka wizard yang sudah terisi), ganti nama, hapus (dengan konfirmasi). Tambah: isi nama + pilih jalur → Hal. 3 → bahan sesuai jalur |
| F-19 | Pemilih preferensi aktif | 8, 10–12 | Wajib | Kontrol "Preferensi: <nama>" di Hal. 8, chatbot/drawer, dan katalog Test Drive. Mengganti preferensi aktif (BR-16) lalu memuat ulang hasil; tautan "Kelola" ke Hal. P |
| F-20 | Halaman Syarat & Ketentuan | S&K | Wajib | Satu halaman berisi catatan kecil yang dipindah dari layar lain: angka & estimasi (rentang, ±5 poin persentil, data terbatas, skala TO), aturan SNBP/SNBT (BR-01, BR-11, BR-18, mapel pendukung, BR-15), kecocokan & preferensi (BR-10, BR-16, BR-17), data sekolah & alumni, privasi (BR-14), AI & sumber data (BR-12, atribusi O*NET). Dibuka dari tautan "Syarat & ketentuan" di footer dan kalimat persetujuan di modal login (K-09) |

### Alur pengguna utama

1. Beranda (1) → CTA (2). Belum login → **modal login Google**.
2. Setelah login, akun belum punya preferensi → **Halaman Preferensi (P)** → "+ Tambah preferensi": nama + jalur (4)
   → Minat (3) → bahan sesuai jalur:
   - SNBP: Sekolah, Rapor & TKA (5) → Alamat & Reputasi Alumni (6).
   - SNBT: Try Out & Portofolio (7).
   Preferensi yang baru selesai dibuat otomatis aktif, lalu pengguna masuk ke Hal. 8.
3. Akun sudah punya preferensi → langsung Hal. 8 memakai preferensi aktif. Di beranda, CTA berganti
   menjadi "Yuk, lihat rekomendasi jurusan untukmu".
4. Dari 8: banner → Chatbot (9–11), atau tombol Test Drive → Katalog (12) → Mini Challenge (13).
5. Menu **Preferensi** (navbar dan drawer) untuk menambah, mengedit, mengaktifkan, atau menghapus preferensi;
   pemilih preferensi (F-19) untuk berganti tanpa keluar halaman.

Smart routing PRD sumber (otomatis pindah ke Hal. 8 saat scroll melewati hero) **diganti** perilaku CTA di F-02.

## 6. Aturan Bisnis

Semua parameter disimpan di config (`Data/aturan_seleksi_2026.json`, `Data/form_minat_config.json`), bukan di-hardcode.
Rumus lengkap: PRD sumber bagian 6.2.

| ID | Aturan |
| --- | --- |
| BR-01 | **Satu provinsi SNBP:** dua pilihan prodi valid hanya jika salah satu PTN berada di provinsi sekolah (atau hanya satu pilihan). Provinsi selalu dibandingkan lewat `ak_provinsi_crosswalk.csv`; provinsi PTN dari `ak_ptn.csv`, bukan PDDikti. PTN dengan dua provinsi di data SNPMB (UI: DKI Jakarta & Jawa Barat; Universitas Papua: Papua Barat & Papua Barat Daya) dianggap cocok bila salah satunya sama — *interpretasi, perlu dicek ke aturan resmi*. Pelanggaran → badge merah. |
| BR-02 | **Keketatan SNBP** = diterima ÷ peminat (data 2025, tampilkan juga rata-rata 3 tahun). **SNBT** = daya tampung ÷ peminat. |
| BR-03 | **Label keketatan:** < 5% Sangat Ketat 🔴 · 5–<15% Ketat 🟡 · 15–<35% Sedang 🔵 · ≥ 35% Longgar 🟢. |
| BR-04 | **Gerbang eligibilitas:** peringkat paralel > kuota eligible jurusan sekolah → "Belum masuk kuota eligible — fokus ke SNBT"; peluang SNBP tidak dihitung. Sekolah tanpa data PDSS/akreditasi → perkiraan dari persen akreditasi (A 40%, B 25%, C/tidak terakreditasi 5%) dengan pemberitahuan. |
| BR-05 | **Skor akademik SNBP:** S = w1·Rapor_terkoreksi + w2·Mapel Pendukung + w3·Prestasi, w1 ≥ 0,5 dan w2 + w3 ≤ 0,5 (default 0,6/0,25/0,15). Rapor_terkoreksi = Rapor + k·z_TKA; k adalah asumsi berlabel. |
| BR-06 | **Faktor akreditasi dan reputasi alumni self-report** masing-masing maksimal ±5 poin persentil. Faktor "alumni tidak daftar ulang" dihapus (tidak ada aturan resmi SNPMB, K-04). |
| BR-07 | **Output peluang** selalu rentang (mis. 35–50%) + label rendah/sedang/tinggi + 3 alasan berbasis data + label "estimasi". |
| BR-08 | **Prodi tanpa histori** (212 prodi): pakai rata-rata rumpun yang sama di PTN yang sama, label "data terbatas". |
| BR-09 | **Peluang SNBT:** P = 1 / (1 + e^(−1,7·(TO − est_skor_utbk)/35)); `est_skor_utbk` wajib berlabel estimasi. TO bukan skala IRT → peringatan skala. |
| BR-10 | **Kecocokan minat** = 0,8 × ((r_Pearson(profil siswa, profil prodi) + 1)/2 × 100) + 0,2 × skor hobi. Label: ≥ 80 Sangat cocok · ≥ 65 Cocok · ≥ 50 Cukup · < 50 Kurang cocok. Tie-breaker: mapel favorit. |
| BR-11 | **Validasi jalur:** lulusan 2024/2025 tidak bisa SNBP; yang lulus SNBP 2024–2026 tidak bisa SNBT 2026. |
| BR-12 | **Grounding AI:** LLM tidak boleh mengarang angka. Chatbot mengambil angka dari API internal; hasil ekstraksi AI wajib dikonfirmasi siswa. |
| BR-13 | **Label data di UI:** resmi (snpmb.id, PDDikti, Kepmendikdasmen 102/M/2025), estimasi (skor UTBK prodi, koreksi TKA, peluang), sintetis (data alumni — demo saja), soal (dibuat otomatis, perlu review). |
| BR-14 | **Privasi:** simpan data seperlunya; alamat hanya provinsi & kab/kota; foto rapor/sertifikat dihapus setelah diekstrak; sediakan hapus akun & data. |
| BR-15 | **Portofolio** wajib untuk prodi seni & olahraga sesuai kolom `portofolio` di data: 267 prodi (229 S1, 32 D4, 6 D3). Angka 229 di PRD sumber hanya menghitung S1. |
| BR-16 | **Preferensi aktif:** satu akun boleh punya banyak preferensi, dan **tepat satu** berstatus aktif. Preferensi yang baru dibuat otomatis aktif. Rekomendasi (Hal. 8), jawaban chatbot, dan urutan katalog Test Drive selalu memakai preferensi aktif. Menghapus preferensi aktif → preferensi lain yang terakhir diperbarui menjadi aktif; menghapus satu-satunya preferensi → akun kembali berstatus "belum punya preferensi". Nama preferensi wajib diisi dan unik per akun. |
| BR-17 | **Satu jalur per preferensi:** SNBP atau SNBT, dipilih saat membuat preferensi dan tidak bisa diubah sesudahnya (untuk jalur lain, buat preferensi baru). Warna di UI: SNBP kuning, SNBT biru. Validasi BR-11 berlaku saat memilih jalur. |
| BR-18 | **TKA SMA/SMK (Kemendikdasmen):** 3 mapel wajib (Bahasa Indonesia, Matematika, Bahasa Inggris) + **2 mapel pilihan berbeda** yang dipilih siswa dari: Matematika Tingkat Lanjut, Bahasa Indonesia Tingkat Lanjut, Bahasa Inggris Tingkat Lanjut, Fisika, Kimia, Biologi, Ekonomi, Sosiologi, Geografi, Sejarah, Antropologi, Pendidikan Pancasila dan Kewarganegaraan, Bahasa Asing (Arab, Jerman, Prancis, Jepang, Korea, Mandarin), serta Produk/Projek Kreatif dan Kewirausahaan (khusus SMK/MAK). Pemilihan sesuai prodi incaran hanya **anjuran**, bukan syarat; UI menandai pilihan yang cocok dengan `mapel_pendukung_snbp.csv`. Daftar mapel disimpan di config. TKA dipakai sebagai validator rapor (BR-05). |

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
| Soal | `ak_soal_spesifik_prodi_ptn_v2.csv`, `ak_soal_umum_prodi.csv`, `bank_soal_simulasi.csv` | Versi 1 sudah dihapus. Bank soal berisi 269 soal (35 UTBK + 3 per rumpun × 78), bukan 425 seperti di PRD sumber |
| Pengguna | Dibuat aplikasi | Akun Google dan **banyak preferensi per akun**. Atribut preferensi: nama, jalur (SNBP/SNBT), status aktif, jawaban minat + skor RIASEC/kode Holland, chip hobi & mapel favorit, profil akademik (rapor/TKA/prestasi/alumni) atau nilai TO sesuai jalur, hasil rekomendasi tersimpan, waktu dibuat/diperbarui — **data sensitif anak di bawah umur** |
| Alumni | `ak_alumni_sintetis_snbp.csv` | **Sintetis**, demo saja |

## 8. Kebutuhan Non-Fungsional

- **Bahasa:** antarmuka Bahasa Indonesia.
- **Transparansi:** setiap angka punya sumber dan label (resmi/estimasi/sintetis); tombol "Kenapa?" di peluang. Penjelasan rinci (aturan, rumus, sumber, privasi) cukup di Halaman Syarat & Ketentuan (F-20) agar layar tetap ringkas.
- **Privasi & keamanan:** BR-14; sesi HttpOnly cookie; tidak ada rahasia (API key Gemini, OAuth) di repo.
- **Keandalan AI:** output Gemini divalidasi skema; selalu ada fallback non-AI.
- **Performa:** katalog 5.150 prodi memakai virtualized list dan pencarian instan.
- **Perangkat:** mobile-first (siswa SMA mayoritas mengakses lewat ponsel); tampilan desktop (1440 px) didesain penuh di Figma HIFI v3 untuk demo.
- **Aksesibilitas:** lihat `DESIGN_SYSTEM.md` bagian 8.

## 9. Rilis Dan Milestone

| Milestone | Target | Isi |
| --- | --- | --- |
| MVP hackathon | Sprint 48 jam (tanggal belum diketahui, OQ-02) | F-01 s.d. F-11, F-16; impor dataset; 3–5 prodi demo dengan soal yang sudah ditinjau |
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
| OQ-02 | Tanggal sprint dan tenggat pengumpulan hackathon — belum diketahui. | farrelzaki |
| R-04 | Skema `preferensi`/`profil_akademik` dan kontrak `/api/preferensi` di main masih **satu preferensi per akun** (primary key `pengguna_id`). F-18, F-19, BR-16, BR-17 butuh migrasi dan perubahan kontrak (T-18, perubahan besar, perlu persetujuan). Sekalian: hapus field `alumni_tidak_daftar_ulang` (K-04) dan simpan nama + nilai 2 mapel pilihan TKA di `nilai_tka` (BR-18); daftar mapel pilihan TKA belum ada di `Data/aturan_seleksi_2026.json`. | farrelzaki |
| R-05 | UI (T-06–T-08, T-15) perlu menyesuaikan: Hal. P, pemilih preferensi, modal login, CTA sudah login, label menu "Preferensi", progres scroll, footer Hal. 8, tata letak desktop; `DESIGN_SYSTEM.md` masih menyebut "Edit Preferensi". | daliondroid |
| R-06 | API T-14 di main masih punya `POST /api/test-drive/refleksi`, field `refleksi` di kontrak (`src/types/api.ts`, ARSITEKTUR) dan tie-breaker refleksi → perlu dihapus atau dinonaktifkan sesuai K-08. | farrelzaki |

### Keputusan (2026-10-15)

| Kode | Keputusan |
| --- | --- |
| OQ-01 | Dokumen dataset (`Data/README.md`, `Data/AUDIT_DATA.md`) diselaraskan: nama Cocokin!, nama file sesuai folder, nama halaman sesuai PRD v2.1. |
| OQ-03 | Metrik keberhasilan = kriteria demo MVP (bagian 3). |
| OQ-04 | Mobile-first. |
| OQ-05 | `ak_soal_spesifik_prodi_ptn.csv` (versi 1) dihapus dari repo. |
| OQ-06 | Portofolio memakai data: 267 prodi (BR-15). |
| OQ-07 | Prioritas fitur di bagian 5 disetujui. |
| K-01 | Satu jalur per preferensi (BR-17) — dikonfirmasi farrelzaki 2026-10-15. |
| K-02 | Smart routing lewat CTA beranda (F-02), bukan pindah otomatis saat scroll. |
| K-03 | Garis warna di bawah navbar = indikator progres scroll; bagian yang belum terlewati berwarna abu-abu. |
| K-04 | Pertanyaan riwayat alumni tidak daftar ulang dihapus dari form dan skoring karena tidak resmi — farrelzaki 2026-10-15. |
| K-05 | Mapel pilihan TKA dipilih siswa (2 dari daftar resmi, BR-18) — farrelzaki 2026-10-15. |
| K-06 | Test Drive tanpa timer: siswa menjawab tanpa batas waktu; "60 detik" tidak dipakai lagi sebagai klaim — farrelzaki 2026-10-15. |
| K-07 | Halaman rekomendasi memakai kartu ringkas; detail peluang, alasan "Kenapa?", dan PDDikti dipindah ke popup `DETAIL` — farrelzaki 2026-10-15. |
| K-08 | Test Drive tanpa rating/refleksi; hasil tampil sebagai versi koreksi layar soal dengan insight di bawah — farrelzaki 2026-10-15. |
| K-09 | Keterangan kecil (catatan aturan, sumber, privasi, penjelasan rumus) tidak ditampilkan di layar kerja; dikumpulkan di Halaman Syarat & Ketentuan (F-20). Yang tetap tampil: label data (resmi/estimasi/sintetis), status penting (eligible, pelanggaran provinsi), alasan "Kenapa?", dan disclaimer footer — farrelzaki 2026-10-15. |

## 11. Riwayat Revisi

### 2.2 (2026-10-15, T-17)

| # | Perubahan | Di PRD | Di desain (Figma HIFI v3) |
| --- | --- | --- | --- |
| 1 | Garis warna navbar menjadi progres scroll (sisa abu-abu) | F-01, K-03 | Top bar semua layar |
| 2 | Modal login Google; CTA beranda berganti untuk akun yang sudah punya preferensi; akun lama yang cache-nya terhapus langsung ke Hal. 8 setelah login | F-02, alur 1–3, K-02 | Modal login, beranda versi sudah login |
| 3 | Banyak preferensi per akun, satu aktif; Halaman Preferensi; pemilih preferensi; menu "Edit Preferensi" → "Preferensi" | F-04, F-08, F-09, F-18, F-19, BR-16, BR-17, data, R-04 | Hal. P (kosong & berisi), dialog preferensi baru, pemilih di Hal. 8/chat/Test Drive |
| 4 | Footer di Hal. 8 | F-08 | Rekomendasi |
| 5 | Desain desktop | Kebutuhan non-fungsional (Perangkat) | Set layar 1440 px |
| 6 | Desain diselaraskan dengan PRD (kuis RIASEC, TKA, NPSN, mapel pendukung, TO 7 subtes, label data, "Kenapa?", kompetensi lulusan, dll.) | — (tidak mengubah PRD) | Seluruh layar wizard, Hal. 8, 12, 13 |
| 7 | TKA: siswa memilih 2 mapel pilihan dari daftar resmi + nilainya | F-05, BR-18, K-05, R-04 | Bahan SNBP (mobile & desktop) + lembar pilih mapel TKA |
| 8 | Riwayat alumni tidak daftar ulang dihapus (tidak resmi) | F-07, BR-06, alur, K-04, R-04 | Wilayah & alumni |
| 9 | Test Drive tanpa timer | Ringkasan, solusi, F-11, F-19, K-06 | Mini challenge (soal & hasil), beranda, D10 |
| 10 | Rekomendasi ringkas seperti v2 + popup detail | F-08, K-07 | Rekomendasi + popup detail |
| 11 | Hasil Test Drive = versi koreksi layar soal, insight di bawah, tanpa rating/refleksi | F-11, F-19, BR-10, BR-16, alur, K-08, R-06 | Mini challenge hasil (M19), D10 |
| 12 | Keterangan kecil dihapus dari layar dan dipindah ke Halaman Syarat & Ketentuan; tautan di footer & modal login | F-20, NFR Transparansi, K-09 | Semua layar wizard & hasil, footer, modal login, M20 & D11 (S&K) |
