# PROSEDUR_FIGMA_WORKFLOW.md

> Panduan Prosedur Integrasi Figma ke Kode UI Antigravity untuk Tim Frontend (`daliondroid`).
> Proyek: **Cocokin! (Hackathon JOINTS UGM 2026)**

---

## 1. Status Koneksi Saat Ini

Koneksi antara **Antigravity** dan **Figma Project** telah **TERHUBUNG & TERVERIFIKASI SUKSES**.

- **File Project**: `FIGMA JOINTS`
- **File Key**: `7cjqnxwFVnIH22ba3Kof7Z`
- **Daftar Page Terdeteksi**:
  - `AHMAD`
  - `ARI`
  - `ASSET` (berisi koleksi ikon, gambar gedung, karakter siswa)
  - `HIFI` (berisi frame *Landing page*, *Langkah 1*, *Langkah 2*, *Langkah 3*)
- **Penyimpanan Kredensial**: Tersimpan aman di `.env.local` (di-gitignore, tidak akan bocor ke Git remote).

---

## 2. Cara Kerja Integrasi Figma di Antigravity

Dengan token dan file key yang sudah terhubung, Antigravity dapat:
1. **Membaca Struktur Node & Hirarki**: Mendeteksi teks, ukuran font, padding, margin, warna HSL/Hex, dan tata letak per-frame tanpa Anda perlu copy-paste CSS satu per satu.
2. **Download Otomatis Aset Gambar & Ikon**: Antigravity bisa mengekspor layer ilustrasi (misal: karakter anak SMA, gedung UGM, logo pixel) langsung menjadi file PNG/SVG ke dalam folder `public/assets/`.
3. **Menerjemahkan ke Design System Kita**: Menyesuaikan output desain dengan token yang telah kita siapkan di `docs/DESIGN_SYSTEM.md` (`.pixel-box`, `.pixel-btn`, Google palette `#4285F4`, font `Press Start 2P` & `Outfit`).

---

## 3. Prosedur Step-by-Step Mengerjakan UI ke Depannya

Setiap kali teman Anda selesai mendesain atau memperbarui halaman tertentu di Figma, ikuti alur berikut:

### Langkah 1: Buat/Pindah ke Branch Task yang Sesuai
Pastikan bekerja di branch fitur yang benar (misalnya untuk Task T-06):
```bash
git checkout -b fitur/daliondroid-T-06
```

### Langkah 2: Berikan Target Frame / Link Figma ke Antigravity
Cukup buka frame yang ingin dikerjakan di Figma, lalu berikan instruksi singkat di chat Antigravity:
> **Contoh Prompt Anda:**
> *"Tolong ambil aset dan buat komponen untuk frame **Landing page** dan **Langkah 1** dari page **HIFI**."*
> 
> Atau cukup kirim link/node ID-nya:
> *"Kerjakan node `18-885` (Landing Page)."*

### Langkah 3: Ekstraksi Otomatis oleh Antigravity
Antigravity akan otomatis melakukan:
1. Menarik data node frame dari Figma REST API.
2. Mengunduh semua aset gambar & ikon yang dipakai ke `public/assets/` dengan nama file yang rapi.
3. Membuat komponen React di `src/components/` (misal `HeroSection.tsx`, `PreferenceFormStep1.tsx`, dsb).
4. Menyusun halaman di `src/app/` (misal `src/app/page.tsx` atau `src/app/preferensi/page.tsx`).

### Langkah 4: Preview & Uji Lokal
1. Jalankan server lokal:
   ```bash
   npm run dev
   ```
2. Buka `http://localhost:3000` di browser untuk melihat hasil render.
3. Jika ada detail visual yang perlu disesuaikan (misal padding kurang pas atau ukuran teks ingin dinaikkan), cukup sampaikan:
   > *"Tolong tombol 'LANJUT' dibuat bayangan pixel hitam 4px ke bawah."*

### Langkah 5: Verifikasi Kualitas (Wajib Sebelum Commit)
Pastikan kode memenuhi standar proyek:
```bash
npm run lint
npm run test
npm run build
```

### Langkah 6: Git Commit & Dokumentasi
1. Lakukan commit dengan format konvensi:
   ```bash
   git add .
   git commit -m "feat(ui): implementasi landing page dan form minat langkah 1 (T-06)"
   git push origin fitur/daliondroid-T-06
   ```
2. Perbarui `TASK.md` dan `PROJECT_STATE.md`.

---

## 4. Tips Kolaborasi dengan Teman Desainer di Figma

1. **Grupkan Aset di Page `ASSET`**:
   Minta teman desainer untuk menamai layer gambar dengan jelas (misalnya `character-student`, `hero-ugm`, `icon-check`), agar ketika diekspor otomatis oleh Antigravity, nama filenya langsung rapi.
2. **Jika Desain Mengalami Perubahan (Revisi)**:
   Teman Anda tidak perlu mengirim file baru. Cukup beri tahu Antigravity:
   > *"Teman saya baru update warna tombol di frame Langkah 2, tolong sync ulang dari Figma."*
   Antigravity akan langsung membaca data terbaru dari Figma API.
