# Log Percakapan & Pelaksanaan Penyelarasan Desain Figma Mobile v3 (HIFI v3 - PRD 2.2)

Dokumen ini mencatat seluruh rangkaian percakapan, analisis teknis, pengambilan keputusan, dan implementasi kode antara pengguna (**daliondroid**) dan asisten AI (**Antigravity**) dalam menyelaraskan antarmuka web *Cocokin!* agar **100% presisi dan identik** dengan desain Figma halaman `HIFI v3 - PRD 2.2`.

---

## 1. Latar Belakang & Identifikasi Masalah

* **Masalah Awal:** Pengguna mengecek hasil implementasi sebelumnya dan mendapati bahwa beberapa tampilan antarmuka di versi mobile masih memiliki deviasi dari desain Figma, serta terdapat bug visual spesifik seperti tombol Beranda di navigasi yang tabrakan/menimpa garis pembatas hitam (`TopBar`).
* **Kebutuhan Pengguna:** Memastikan implementasi kode benar-benar 100% sama dengan Figma tanpa tebak-tebakan atau asumsi neobrutalisme umum, sekaligus membagi pekerjaan dalam sesi-sesi bertahap agar terkontrol dan dapat diverifikasi secara objektif.
* **Strategi Solusi:** 
  1. Menggunakan Figma REST API untuk mengunduh **AST JSON lengkap** (`document`, `bounding box`, `fills`, `strokes`, `padding`, `typography`, `vector paths`) serta **render visual resmi (@2x PNG)** untuk seluruh 19 frame Mobile v3.
  2. Membagi eksekusi ke dalam 5 sesi terencana:
     - **Sesi 1 (Tahap B):** Fondasi & Beranda (`M01`, `M02`, `M03`, `M04`, `M20`)
     - **Sesi 2 (Tahap C1):** Manajemen Preferensi (`M05`, `M06`, `M07`)
     - **Sesi 3 (Tahap C2):** RIASEC & Input Akademik (`M08`, `M09`, `M10`, `M10b`, `M11`, `M12`)
     - **Sesi 4 (Tahap D):** Rekomendasi Jurusan (`M13`, `M14`)
     - **Sesi 5 (Tahap E):** Chat AI, Katalog & Test Drive (`M15`, `M16`, `M17`, `M18`, `M19`)

---

## 2. Rincian Pelaksanaan per Sesi

### Sesi 1: Fondasi, Navigasi & Beranda (Tahap B)
* **Frame Terkait:**
  * `M01`: Landing Page Belum Login (`node 172:203`)
  * `M02`: Drawer Menu Overlay (`node 172:344`)
  * `M03`: Modal Login Google (`node 172:502`)
  * `M04`: Landing Page Sudah Login (`node 172:601`)
  * `M20`: Syarat & Ketentuan Layanan (`node 173:476`)
* **Pekerjaan yang Dilakukan:**
  1. **Perbaikan Navbar & TopBar:**
     - Memperbaiki margin/padding dan posisi tombol navigasi agar tidak lagi menabrak 4-color stripe progress bar (`#277EFD`, `#F1402E`, `#FEBD01`, `#22A94F`).
     - Mengintegrasikan avatar inisial pengguna (`#FEBD01` border-2 `#151D21`) dan hamburger menu button.
  2. **Drawer Navigasi M02 (`Navbar.tsx`):**
     - Menu side drawer dengan navigasi Beranda, Cocokin, Preferensi, Test Drive Jurusan, status preferensi aktif, dan tombol aksi login/logout.
  3. **Modal Login Google M03 (`LoginModal.tsx`):**
     - Kotak retro window bertema neobrutalisme kuning dengan ikon Google pixel dan tombol aksi masuk akun.
  4. **Shared Footer M13/M20 (`Footer.tsx`):**
     - Footer gelap `#151D21` konsisten dengan kolom *JELAJAHI*, *SUMBER DATA* (snpmb.id, PDDikti, O*NET, Kepmendikdasmen 102/M/2025), kotak disclaimer ber-border `#FEBD01`, hak cipta 2026, dan tautan S&K.
  5. **Halaman Syarat & Ketentuan M20 (`/syarat-ketentuan`):**
     - 6 klausul aturan resmi, batasan data, penjelasan privasi, dan tombol persetujuan kembali ke beranda.

---

### Sesi 2: Manajemen Preferensi (Tahap C1)
* **Frame Terkait:**
  * `M05`: Preferensi Kosong (`node 173:518`)
  * `M06`: Preferensi Tersimpan (`node 173:642`)
  * `M07`: Bottom Sheet Preferensi Baru (`node 173:696`)
* **Pekerjaan yang Dilakukan:**
  1. **Preferensi Kosong M05 (`/preferensi`):**
     - Banner heading retro dengan empty-state card bertitik putus-putus "+ BUAT PREFERENSI PERTAMA".
  2. **Preferensi Tersimpan M06 (`/preferensi`):**
     - Kartu solid/soft kuning untuk SNBP (`#FEBD01`) dan biru untuk SNBT (`#277EFD`).
     - Badge status `AKTIF` ber-border hitam, indikator ringkasan nilai, tombol `Ganti Aktif` dan tombol `Hapus`.
  3. **Form Preferensi Baru M07 (`/preferensi/baru`):**
     - Bottom sheet modal / form input nama preferensi dan pilihan jalur seleksi radio box (SNBP vs SNBT) lengkap dengan tag deskripsi masing-masing jalur.
  4. **Penyimpanan Lokal Reaktif (`usePreferensiStorage.ts`):**
     - Sinkronisasi `localStorage` untuk draft preferensi dan daftar preferensi tersimpan, mendukung pengalihan preferensi aktif secara instan di seluruh halaman.

---

### Sesi 3: RIASEC & Input Akademik (Tahap C2)
* **Frame Terkait:**
  * `M08`: Kuis Minat RIASEC 30 Soal (`node 174:852`)
  * `M09`: Hasil Kode Minat Holland (`node 174:1038`)
  * `M10`: Bahan SNBP Bagian 1 — Nilai Rapor & TKA (`node 175:1016`)
  * `M10b`: Bottom Sheet Pilihan Mapel Pendukung TKA (`node 198:3260`)
  * `M11`: Bahan SNBP Bagian 2 — Kuota & Rekam Jejak (`node 175:1197`)
  * `M12`: Bahan SNBT — Skor UTBK & Portofolio (`node 175:1016` varian SNBT)
* **Pekerjaan yang Dilakukan:**
  1. **Kuis RIASEC M08 (`/preferensi/riasec`):**
     - 30 butir pertanyaan aktivitas resmi O*NET RIASEC dengan 5 skala emoji rating pixel asli Figma (`Icon/face-1` s.d. `Icon/face-5`).
     - Perhitungan deterministik skor 6 dimensi: Realistic, Investigative, Artistic, Social, Enterprising, Conventional.
  2. **Hasil Minat M09 (`/preferensi/minat`):**
     - Kartu hitam retro ICR, 6 progress bar horizontal warna-warni tiap dimensi Holland, chips pilihan hobi, textarea cerita minat dengan tombol generator bantuan AI, dan pemilihan 3 mapel favorit.
  3. **Bahan Akademik SNBP M10, M10b, M11 (`/preferensi/akademik`):**
     - Rapor semester 1–5 dengan rata-rata otomatis, 3 mata pelajaran wajib TKA.
     - Modal bottom sheet M10b untuk memilih 2 mapel pendukung TKA sesuai kurikulum resmi.
     - Form rekam jejak alumni sekolah dan penentuan kampus basis.
  4. **Bahan Akademik SNBT M12 (`/preferensi/akademik`):**
     - Input skor 7 subtes UTBK (skala 200–1000) dengan kalkulasi rata-rata otomatis, visual grafik tren skor bulanan, dan opsi portofolio seni/olahraga.

---

### Sesi 4: Hasil Rekomendasi Jurusan (Tahap D)
* **Frame Terkait:**
  * `M13`: Rekomendasi 3 Kartu Tiket (`node 205:3349`)
  * `M14`: Popup Detail Rekomendasi (`node 205:3518`)
* **Pekerjaan yang Dilakukan:**
  1. **Halaman Rekomendasi M13 (`src/app/cocokin/page.tsx`):**
     - Header brand Cocokin!, avatar user `#FEBD01`, hamburger menu, dan 4-segmen scroll progress bar.
     - Tag hijau `#22A94F` `ANALISIS SELESAI`, judul font `Press Start 2P`, subjudul, dan pemilih preferensi aktif.
     - **3 Kartu Tiket Rekomendasi (`Card/Major Ticket`):**
       - Latar biru `#277EFD`, border-2 `#151D21`, shadow `[4px_4px_0px_#151D21]`.
       - Stub kiri `RANK #1`, `#2`, `#3` dengan garis batas putus-putus dan **dua notch setengah lingkaran (cut-out ticket notches)** atas dan bawah.
       - Body kanan: Nama jurusan (font `Pixelify Sans`), kampus, jenjang, progress bar kecocokan (`bg-[#FEBD01]` dengan track putih), tombol merah `SIMULASI` dan tombol putih `DETAIL`.
     - Explore card kuning `#FFF6D6` ("Penasaran jurusan lain?") dengan tombol `JELAJAHI SIMULASI` ke `/katalog`.
     - Chat CTA card biru `#EEF5FF` ("Masih ragu? Tanya Cocokin AI") dengan tombol `MULAI CHAT` ke `/chat`.
     - Shared Footer gelap M13/M20.
  2. **Popup Detail Rekomendasi M14 (Bottom Sheet Modal di `/cocokin`):**
     - Scrim gelap `#151D21/60`, handle bar atas, header dengan badge rank biru `#1`, nama prodi, dream goal, dan tombol tutup `[×]`.
     - Bar persentase kecocokan + chips `[ICR]`, `[TEKNIK]`, dan teks `cocok dengan ICR-mu`.
     - Seksi Peluang per Kampus (SNBP 2026): Kartu UGM (`[SANGAT KETAT]`, peluang 10–20%) dan UNY (15–25%).
     - Seksi "Kenapa peluangmu di UGM 10–20%?": 3 alasan berbasis data resmi dengan badge `[KOMPETITIF]`, `[ELIGIBLE]`, dan `[POTENSI]`.
     - Seksi PDDikti: Akreditasi Unggul, rasio dosen:mahasiswa, masa studi, dan badge hijau `[PDDIKTI]`.
     - Tombol aksi: Biru `TEST DRIVE` dan putih `TUTUP`.

---

### Sesi 5: Chat AI, Katalog & Test Drive (Tahap E)
* **Frame Terkait:**
  * `M15`: Chat Cocokin AI (`node 177:1569`)
  * `M16`: Side Drawer Riwayat Chat (`node 177:1649`)
  * `M17`: Katalog Test Drive Jurusan (`node 180:1706`)
  * `M18`: Mini Challenge: Soal Kasus (`node 206:3221`)
  * `M19`: Mini Challenge: Hasil Koreksi (`node 207:3189`)
* **Pekerjaan yang Dilakukan:**
  1. **Halaman Chat AI M15 (`src/app/chat/page.tsx`):**
     - TopBar dengan tombol kembali, judul *Cocokin AI*, tombol menu drawer chat, dan 4-color stripe progress bar.
     - Subheader container `#F7F5F0` berisi `PemilihPreferensi` aktif (*Informatika Impian · SNBP*).
     - Bubble pesan bot dengan avatar toga resmi dan badge data hijau `[DATA RESMI · SNPMB.ID]`.
     - 3 Quick Prompt Chips interaktif dengan ikon spark (`Icon/spark`) yang dapat langsung diklik untuk mengirim pertanyaan.
     - Bubble pesan user berwarna biru `#277EFD` dengan teks putih.
     - Sticky Composer bawah: Tombol lampiran `[+]`, input pertanyaan, dan tombol kirim biru `#277EFD` dengan ikon pixel pesawat kertas (`Icon/send`).
  2. **Drawer Menu Chat M16 (`src/app/chat/page.tsx`):**
     - Side drawer overlay geser dari kanan dengan header "Menu" dan tombol tutup `[×]`.
     - Komponen `PemilihPreferensi` aktif + tautan `Kelola preferensi →` ke `/preferensi`.
     - Navigasi cepat ke Simulasi, Preferensi, dan Beranda.
     - Seksi `RIWAYAT CHAT` menampilkan 4 riwayat percakapan dengan active state berwarna biru muda `#EAF2FF`.
     - Tombol merah `Keluar (Logout)` di bagian paling bawah.
  3. **Katalog Test Drive M17 (`src/app/katalog/page.tsx`):**
     - TopBar *Simulasi* + subheader `PemilihPreferensi`.
     - Tag `TEST DRIVE JURUSAN` + Heading `5.150 prodi dari 146 PTN`.
     - Search box ber-border hitam dan shadow neobrutalisme.
     - Segmented tabs: `SEMUA (5.150)`, `SAINTEK (2.952)`, `SOSHUM (2.198)`.
     - Filter chip jenjang: `Semua Jenjang`, `S1`, `D4`, `D3`.
     - Active filter tags `[KLASTER: TEKNOLOGI ×]` dan tombol `FILTER (3)`.
     - Kartu prodi lengkap dengan jenjang, klaster, akreditasi, tingkat keketatan SNBP, dan tombol biru `SIMULASI`.
  4. **Mini Challenge Test Drive M18 & M19 (`src/app/test-drive/[id]/page.tsx`):**
     - TopBar nama prodi + banner intro status dengan strip aksen vertikal.
     - **RetroWindow SKENARIO (Kuning `#FEBD01`):** Studi kasus bug kasir minimarket + blok kode syntax-highlighted `kasir.js` + 4 opsi jawaban pilihan ganda.
     - Tombol biru `KUNCI JAWABAN` pada mode soal (M18).
     - Saat dijawab (M19): Pilihan benar otomatis ditandai hijau `[BENAR]` dan pilihan salah yang dipilih pengguna ditandai merah `[JAWABANMU]`.
     - **RetroWindow PEMBAHASAN (Hijau `#22A94F`):** Penjelasan logika dan kode perbaikan.
     - **RetroWindow KENYATAAN KULIAH (Biru `#277EFD`):** Tiga poin fakta kurikulum dan statistik persaingan berbasis snpmb.id dan PDDikti.
     - Tombol navigasi bawah: `COBA JURUSAN LAIN` ke `/katalog` dan `KEMBALI KE COCOKIN` ke `/cocokin`.
  5. **Penambahan Ikon Pixel Asli (`src/components/ui/Icon.tsx`):**
     - Menambahkan path SVG pixel resmi dari Figma untuk `filter` (`167:14`), `logout` (`167:11`), dan `question` (`167:29`).

---

## 3. Verifikasi & Pengujian Kualitas

| Jenis Pengujian | Perintah | Hasil | Keterangan |
| :--- | :--- | :--- | :--- |
| **Linting** | `npm.cmd run lint` | **0 Error / 0 Warning** | Standar ESLint terpenuhi bersih. |
| **Unit Testing** | `npm.cmd run test` | **127 / 127 Passed** | 12 test suite (skoring, API, rute, design system) lulus 100%. |
| **Production Build** | `npm.cmd run build` | **25 / 25 Routes Sukses** | Turbopack Next.js 15 mengompilasi seluruh rute statis & dinamis tanpa galat. |
| **Isolasi File Lokal** | `git status` | **Aman** | File `src/middleware.ts` milik pengguna lokal tidak disentuh. |

---

## 4. Riwayat Git & Commit Branch `fitur/daliondroid-T-20`

Semua perubahan kode telah di-commit dan di-push ke remote branch pengguna:

1. **Commit `5d15b02`**:
   `ui: selaraskan 100% halaman preferensi M05-M07 dan kuis akademik M08-M12 sesuai figma (T-20)`
2. **Commit `3b89a0b`**:
   `ui: selaraskan 100% rekomendasi M13-M14 dan chat katalog test drive M15-M19 sesuai figma (T-20)`
3. **Penyimpanan Dokumentasi**:
   Commit dokumen log percakapan dan ringkasan implementasi ini ke dalam branch `fitur/daliondroid-T-20`.
