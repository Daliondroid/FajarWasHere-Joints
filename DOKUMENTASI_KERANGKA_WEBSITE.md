# Dokumentasi Hasil Kerja & Kerangka Website Cocokin!

Dokumen ini merangkum seluruh pekerjaan yang telah diselesaikan oleh **daliondroid** (Frontend & UI/UX Developer) serta memetakan struktur arsitektur rute, letak halaman, komponen, dan alur antarmuka web platform **Cocokin!** (Hackathon JOINTS UGM 2026).

---

## 1. Ringkasan Pekerjaan yang Telah Diselesaikan

### A. Scaffolding & Design System 8-Bit Retro RPG (Task T-02)
- **Framework & Tooling**: Inisialisasi Next.js 15 (App Router, Turbopack, TypeScript 5), Tailwind CSS v4, dan Vitest runner.
- **Visual Tokens**:
  - Palet warna resmi Google 8-bit: Biru `#277EFD` (`#4285F4`), Merah `#F1402E`, Kuning `#FEBD01`, Hijau `#22A94F`, Hitam `#000000`/`#151D21`, dan Putih `#FFFFFF`.
  - Tipografi retro: `Press Start 2P` (`var(--font-pixel)`) untuk headline/badge dan `Outfit`/`Inter` (`var(--font-body)`) untuk konten teks.
  - Pixel utilities: `.pixel-border`, `.pixel-border-sm`, `.pixel-btn-blue`, `.pixel-btn-white`, `.pixel-badge-blue`.

### B. Ekstraksi Aset Desain Figma HIFI (Task T-06)
- Terhubung langsung ke Figma REST API menggunakan personal access token untuk menarik node HIFI (`18:886`, `21:549`, `21:859`, `21:929`).
- Mengekspor dan mengintegrasikan aset piksel murni ke `public/assets/`:
  - `logo-cap.png`: Topi toga piksel wisuda (34x34).
  - `student-character.png`: Karakter siswa SMA berseragam tersenyum membawa HP.
  - `hero-campus.png`: Ilustrasi piksel Balairung UGM & gedung universitas.
  - `icon-upload.png`: Ikon panah upload berkas retro.

### C. Implementasi Halaman Beranda / Landing Page (Task T-06)
- **Navbar Pixel**: Logo topi toga, teks retro `Cocokin!`, 3 garis hamburger menu, dan aksen strip 4-warna di bawah navbar.
- **Hero Section**: 
  - Headline retro berjenjang dengan badge biru `[cocok]` dan `[impian]`.
  - Spasi dan layout tipografi rapi.
  - Komposisi visual: Karakter siswa di sisi kiri dan Balairung kampus UGM di kanan tanpa gap putih.
  - Tombol aksi utama biru: `MULAI` mengarah langsung ke alur preferensi.

### D. Pemisahan Modular Form Preferensi & Solusi F5 Anti-Reset (Task T-06)
- **Pemisahan URL Rute Mandiri**:
  - Memisahkan Bagian 1 (Minat & Hobi) dan Bagian 2 (Akademik) ke rute URL masing-masing agar fokus, rapi, dan tidak membebani pengguna.
- **Persistensi State Draft (`localStorage`)**:
  - Membuat hook `usePreferensiStorage.ts` dengan key `cocokin_preferensi_draft_v1`.
  - **Mencegah Reset saat Refresh**: Jika pengguna sedang mengisi rapor SNBP atau skor UTBK SNBT di `/preferensi/akademik` lalu me-refresh browser (F5), halaman **tetap berada di Akademik** dan data yang telah diisi tidak hilang.
- **Refaktor Komponen**: Memecah halaman 600+ baris menjadi sub-komponen terisolasi di `src/components/preferensi/`.

---

## 2. Peta Rute & Kerangka Halaman Website

Berikut adalah peta struktur rute dan letak tiap halaman di dalam `src/app/`:

```text
src/app/
├── layout.tsx                     # Root layout (Font Press Start 2P, Outfit, metadata)
├── globals.css                    # Definisi tema Tailwind v4, token warna, & pixel utility classes
├── page.tsx                       # [Halaman 1] Beranda (Landing Page) -> URL: /
│
└── preferensi/
    ├── page.tsx                   # Index preferensi -> Otomatis redirect ke /preferensi/minat
    │
    ├── minat/
    │   └── page.tsx               # [Bagian 1] Minat & Hobi -> URL: /preferensi/minat
    │
    └── akademik/
        └── page.tsx               # [Bagian 2] Akademik -> URL: /preferensi/akademik
```

### Rute yang Akan Datang (Upcoming Sesuai PRD & Backlog):
- `/rekomendasi` *(Task T-07 / Hal. 8)*: Dashboard hasil rekomendasi prodi (Dream Goal & Safety Net, persentase kecocokan, peluang lolos, alasan data).
- `/katalog` *(Task T-08 / Hal. 12)*: Katalog penelusuran 5.150 prodi se-Indonesia + filter klaster/provinsi.
- `/test-drive/[prodiId]` *(Task T-08 / Hal. 13)*: Simulasi mini challenge 60 detik per prodi untuk menguji kecocokan rasa kuliah.
- `/chat` *(Task T-15 / Hal. 9–11)*: Chatbot interaktif Cocokin! tanya jawab kampus berbasis data resmi SNPMB & PDDikti.

---

## 3. Struktur Komponen & Fungsinya

Semua komponen UI antarmuka tersimpan di direktori `src/components/`:

| File Komponen | Letak File | Deskripsi & Peran |
| --- | --- | --- |
| **Navbar** | `src/components/Navbar.tsx` | Navigasi atas global: logo toga pixel, brand `Cocokin!`, hamburger drawer, dan color-strip 4 warna Google. |
| **HeroSection** | `src/components/HeroSection.tsx` | Bagian utama landing page: headline retro, ilustrasi kampus Balairung & siswa SMA, tombol aksi `MULAI`. |
| **StepperHeader** | `src/components/preferensi/StepperHeader.tsx` | Indikator visual tahapan wizard retro: `[1] Minat & Hobi ──── [2] Akademik`. |
| **StepMinatHobi** | `src/components/preferensi/StepMinatHobi.tsx` | Tampilan Bagian 1: grid 8 tag hobi (CODING, Desain, Musik, dll.), textarea cerita minat bebas, dan banner validasi error. |
| **StepPilihJalur** | `src/components/preferensi/StepPilihJalur.tsx` | Tampilan Bagian 2A: kartu pilihan seleksi SNBP (border kuning dashed) vs SNBT (border biru dashed). |
| **StepFormSNBP** | `src/components/preferensi/StepFormSNBP.tsx` | Tampilan Bagian 2B (SNBP): upload rapor smt 1–5, input NPSN, portofolio, alamat, radio reputasi alumni, dan kampus basis. |
| **StepFormSNBT** | `src/components/preferensi/StepFormSNBT.tsx` | Tampilan Bagian 2B (SNBT): daftar 7 subtes UTBK, kartu kuning riwayat tryout, dan upload portofolio. |
| **usePreferensiStorage** | `src/components/preferensi/usePreferensiStorage.ts` | Custom hook pengelola state preferensi siswa terpusat di `localStorage` (anti-reset F5). |

---

## 4. Alur Interaksi Pengguna (User Flow)

```mermaid
flowchart TD
    A[Buka http://localhost:3000/] --> B[Halaman Beranda / Landing Page]
    B -->|Klik Tombol 'MULAI'| C[Navigasi ke /preferensi]
    C -->|Auto Redirect| D[Halaman /preferensi/minat]
    
    subgraph Bagian 1: Minat & Hobi
        D --> D1[Pilih Chip Hobi & Isi Cerita Minat]
        D1 -->|Klik 'LANJUT' (Validasi Lulus)| E[Navigasi ke /preferensi/akademik]
        D1 -->|Klik 'KEMBALI'| B
    end
    
    subgraph Bagian 2: Akademik
        E --> E1[Sub-langkah Jalur: Pilih Kartu SNBP atau SNBT]
        E1 -->|Pilih SNBP & Klik 'LANJUT'| F[Sub-langkah Form: Input SNBP]
        E1 -->|Pilih SNBT & Klik 'LANJUT'| G[Sub-langkah Form: Input SNBT]
        
        F --> F1[Upload Rapor, NPSN, Reputasi Alumni, Kampus Basis]
        G --> G1[Cek 7 Subtes UTBK, Histori Tryout, Portofolio]
        
        F1 -->|Klik 'KEMBALI'| E1
        G1 -->|Klik 'KEMBALI'| E1
        E1 -->|Klik 'KEMBALI'| D
        
        F1 -->|Klik 'LANJUT'| H[Rute /rekomendasi - Task T-07]
        G1 -->|Klik 'LANJUT'| H
    end
```

---

## 5. Status Verifikasi Teknis

- **Linting (`npm run lint`)**: 0 error, 0 warning (ESLint Next.js).
- **Unit Testing (`npm run test`)**: 3/3 passed (Vitest + jsdom).
- **Production Build (`npm run build`)**: Lulus kompilasi Turbopack Next.js 15 tanpa kendala tipe TypeScript.
- **Git Tracking**: Seluruh perubahan telah di-commit dengan rapi dan di-push ke remote branch `origin/fitur/daliondroid-T-02`.
