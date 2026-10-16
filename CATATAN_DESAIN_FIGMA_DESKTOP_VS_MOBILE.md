# Catatan & Rekap Penyelarasan Desain Figma (Mobile vs Desktop v3)

> Dokumen ini disusun oleh tim pengembang frontend untuk tim UI/UX Designer Cocokin!  
> Sumber referensi: Figma File **Cocokin!** (`7cjqnxwFVnIH22ba3Kof7Z`), Page **HIFI v3 — PRD 2.2**.

Halo tim Designer! 👋  
Saat tim dev menyiapkan implementasi untuk resolusi **Desktop v3 (1440px)** agar selaras dengan **Mobile v3 (402px)**, kami mengidentifikasi beberapa poin yang memerlukan konfirmasi, penyelarasan aset/konten, serta beberapa frame desktop yang belum tersedia di Figma.

Mohon bantuan review dan masukannya untuk poin-poin berikut:

---

## 1. Frame Desktop yang Belum Tersedia di Figma (Missing Frames)

Di section **🖥️ Desktop v3 — PRD 2.2** saat ini terdapat 11 frame (D01–D11). Namun, ada beberapa alur/halaman penting di versi Mobile yang **belum memiliki padanan frame Desktop**:

| No | Alur / Halaman | Padanan Mobile | Status Desktop | Kebutuhan Konfirmasi |
|---|---|---|---|---|
| 1 | **Tambah Preferensi Baru** | M07 (`/preferensi/baru`) | ⚠️ Belum ada frame | Apakah dibuatkan halaman penuh 1440px, modal dialog di atas `/preferensi`, atau form 2 kolom? |
| 2 | **Minat & Gaya Belajar** | M09 (`/preferensi/minat`) | ⚠️ Belum ada frame | Apakah layout-nya split 2 kolom (kiri panduan/stepper, kanan pill opsi) serupa dengan D05 (RIASEC)? |
| 3 | **Input Wilayah & Rekam Alumni (SNBP)** | M11 (Sub-step Bahan SNBP) | ⚠️ Belum ada frame | Di D06 baru mencakup Sekolah, Rapor, TKA, dan Prestasi. Apakah wilayah & alumni digabung di D06 atau ada frame terpisah? |
| 4 | **Jalur SNBT (Skor UTBK)** | M12 (`/preferensi/snbt`) | ⚠️ Belum ada frame | Bagaimana tata letak desktop untuk input skor subtes UTBK (TPS, Literasi, Penalaran)? |

> **Opsi Sementara Tim Dev:** Jika belum sempat dibuatkan frame-nya, tim dev akan menempatkan form mobile di tengah container desktop dengan lebar terpusat (max-w 600–760px) agar tetap fungsional dan rapi.

---

## 2. Perbedaan Konten & Struktur Antara Mobile vs Desktop di Figma

Kami melihat ada variasi konten dan layout antara versi Mobile dan Desktop di Figma. Kami ingin memastikan apakah perbedaan ini disengaja atau perlu diseragamkan:

### A. Rekomendasi Prodi (M13 vs D07)
1. **Jumlah Kartu Tiket:**
   - Di Figma (baik Mobile M13 maupun Desktop D07), hanya ditampilkan **2 tiket** (#1 Teknologi Informasi UGM 94%, #2 Sistem Informasi UPN 86%).
   - Di PRD & Kontrak API Backend (T-19), rekomendasi menghasilkan **3 kartu** (Dream Goal, Safety Net, Alternatif).
   - *Pertanyaan:* Apakah di Figma memang sengaja menampilkan 2 tiket saja, atau kartu ke-3 perlu ditambahkan di desain?
2. **Detail Peluang Kampus:**
   - Di Mobile M13/M14, detail daya tampung dan peluang per kampus dibuka via **Pop-up / Bottom Sheet** (M14).
   - Di Desktop D07, detail peluang kampus ditampilkan **langsung (inline)** di dalam tiket kartu.

### B. Mini Challenge / Test Drive (M18/M19 vs D10)
1. **Penggabungan Layar:**
   - Di Mobile: Terpisah menjadi 2 halaman, yaitu **M18 (Soal Mini Challenge)** dan **M19 (Pembahasan & Kenyataan Kuliah)**.
   - Di Desktop (D10): Soal dan Pembahasan ditampilkan **bersamaan dalam 1 layar split 2 kolom**.
2. **Variasi Soal & Studi Kasus:**
   - Di Mobile (M18): Menggunakan studi kasus `kasir.js` (Logika Pemrograman / Syntax Error).
   - Di Desktop (D10): Menggunakan soal *Binary Search O(log n)* (Algoritma).
   - *Pertanyaan:* Apakah kedua soal ini mewakili 2 level/prodi berbeda, atau salah satunya yang menjadi acuan utama mock data?
3. **Penamaan Bagian:**
   - Mobile M19: `"KENYATAAN KULIAH"`
   - Desktop D10: `"Reality Check"`

### C. Halaman Chat Konsultasi (M15/M16 vs D08)
1. **Daftar Riwayat Chat:**
   - Di Mobile M16: Terdapat riwayat chat spesifik:
     - *"Peluang Teknologi Informasi UGM · Hari ini"*
     - *"Beda SI dan Informatika · Kemarin"*
     - *"Strategi pilih 2 prodi SNBP · 12 Okt"*
     - *"Prodi serumpun yang longgar · 10 Okt"*
   - Di Desktop D08: Layout sidebar kiri (340px) sudah sangat jelas dan rapi untuk menampilkan riwayat chat ini.

### D. Katalog Prodi (M17 vs D09)
1. **Layout Filter:**
   - Mobile M17: Filter menggunakan chip horizontal & bottom sheet.
   - Desktop D09: Filter diletakkan di sidebar kiri fixed/sticky (300px) dan grid kartu 2 kolom di kanan (860px).
2. **Tombol Aksi Kartu:**
   - Di Desktop D09: Terdapat tombol aksi langsung `[TEST DRIVE]` di setiap kartu prodi, sedangkan di Mobile hanya kartu klik.

---

## 3. Catatan Standarisasi Tipografi (Font Family)

Di dalam file Figma, kami mendeteksi penggunaan beberapa font family:
1. `Press Start 2P` — Digunakan untuk Logo, badge 8-bit, dan aksen retro tertentu.
2. `Pixelify Sans` — Digunakan untuk heading skor, judul tiket rekomendasi, dan angka persentase.
3. `Outfit` vs `Plus Jakarta Sans` — Sebagian teks body/label memakai `Outfit`, dan sebagian komponen memakai `Plus Jakarta Sans`.

*Pertanyaan:* Apakah ke depannya font sans-serif modern utama disepakati menggunakan **Outfit** atau **Plus Jakarta Sans** agar styling konsisten di seluruh web?

---

## 4. Checklist Ringkas untuk Tim Designer

- [ ] Konfirmasi apakah 4 halaman di poin 1 (Preferensi Baru, Minat, Wilayah/Alumni, SNBT) akan dibuatkan frame desktop atau menggunakan fallback layout dari dev.
- [ ] Konfirmasi jumlah tiket rekomendasi (2 tiket vs 3 kategori sesuai PRD/Backend).
- [ ] Konfirmasi kesepakatan soal/studi kasus Mini Challenge (Kasir vs Binary Search).
- [ ] Konfirmasi font sans-serif utama (`Outfit` vs `Plus Jakarta Sans`).

---
*Terima kasih banyak atas kerjasamanya! Jika ada revisi atau frame baru di Figma, kabari tim dev agar langsung kami sinkronkan ke kode.* 🚀
