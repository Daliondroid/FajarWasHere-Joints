# Prosedur Pengerjaan Hi-Fi Desktop v3 (1440px) — Edisi Sinkron 17 Frame

> Status: **Rencana Kerja & Prosedur Resmi** (diselaraskan dengan update Figma 16 Okt 2026).  
> Sumber kebenaran: Figma file `7cjqnxwFVnIH22ba3Kof7Z`, page **HIFI v3 — PRD 2.2**,  
> section **🖥️ Desktop v3 — PRD 2.2** (node `184:2363`, **17 frame lengkap** lebar 1440px).  
> Pendamping: `rencana_upgrade_mobile_v3.md` (mobile), `CATATAN_DESAIN_FIGMA_DESKTOP_VS_MOBILE.md`.

---

## 1. Hasil Audit Sinkronisasi Figma (Mobile vs Desktop)

Setelah teman desainer memperbarui section **🖥️ Desktop v3**, kami melakukan audit AST Figma menyeluruh. **Hasil: 100% SINKRON!** Semua 17 state mobile kini telah memiliki padanan resmi di desktop:

| # | Frame Desktop | Node ID | Dimensi | Padanan Mobile | Status Sinkronisasi |
|---|---|---|---|---|---|
| 01 | **D01 · Beranda — belum login** | `184:1919` | 1440×2492 | M01 | ✅ Sinkron (Hero, 3 Value Props, CTA) |
| 02 | **D02 · Beranda — modal login Google** | `184:2066` | 1440×1024 | M03 | ✅ Sinkron (Overlay + Dialog 440px) |
| 03 | **D03 · Beranda — sudah login** | `184:2164` | 1440×2492 | M04 | ✅ Sinkron (CTA "Lihat Rekomendasi") |
| 04 | **D04 · Preferensi** | `186:2285` | 1440×1177 | M05/M06 | ✅ Sinkron (Grid kartu preferensi) |
| 05 | **D04b · Preferensi baru (modal)** | `272:4935` | 1440×1177 | M07 | ✅ **Baru ditambahkan!** Modal jalur SNBP/SNBT |
| 06 | **D05 · Kuis minat RIASEC** | `186:2457` | 1440×1090 | M08 | ✅ Sinkron (Split 2 kolom: stepper + soal) |
| 07 | **D05b · Hasil minat, hobi & mapel** | `272:4996` | 1440×991 | M09 | ✅ **Baru ditambahkan!** Hasil RIASEC + pill minat |
| 08 | **D06 · Bahan SNBP (Sekolah, Rapor, TKA)** | `188:2472` | 1440×1521 | M10/M10b | ✅ Sinkron (Form 2 kolom + popover mapel) |
| 09 | **D06b · Bahan SNBP — wilayah & alumni** | `272:5336` | 1440×698 | M11 | ✅ **Baru ditambahkan!** Wilayah & rekam alumni |
| 10 | **D06c · Bahan SNBT — try out & portofolio**| `272:5711` | 1440×872 | M12 | ✅ **Baru ditambahkan!** Form skor subtes UTBK |
| 11 | **D07 · Rekomendasi (3 Tiket)** | `188:2673` | 1440×1132 | M13 | ✅ **Diselaraskan!** 3 tiket (94%, 86%, 79%) |
| 12 | **D07b · Popup detail rekomendasi** | `272:4282` | 1440×1132 | M14 | ✅ **Baru ditambahkan!** Pop-up daya tampung |
| 13 | **D08 · Cocokin AI — chat** | `189:2794` | 1440×1026 | M15/M16 | ✅ Sinkron (Sidebar 340px + Chat Area 1100px) |
| 14 | **D09 · Katalog Simulasi** | `189:2937` | 1440×1526 | M17 | ✅ Sinkron (Sidebar filter 300px + grid kartu) |
| 15 | **D10 · Mini Challenge — soal** | `190:3108` | 1440×852 | M18 | ✅ **Diselaraskan!** Soal `kasir.js` (JavaScript) |
| 16 | **D10b · Mini Challenge — hasil koreksi** | `272:4558` | 1440×1044 | M19 | ✅ **Diselaraskan!** Pembahasan & "Kenyataan kuliah" |
| 17 | **D11 · Syarat & Ketentuan** | `215:3387` | 1440×1851 | M20 | ✅ Sinkron (TOC sticky 260px + isi 760px) |

### Poin Penyelarasan Utama yang Sudah Selesai di Figma:
1. **Konten Soal:** D10 & D10b telah memakai studi kasus `kasir.js`, persis 100% seperti M18 & M19.
2. **Tiket Rekomendasi:** D07 sudah menampilkan 3 tiket (Dream Goal 94%, Safety Net 86%, Alternatif 79%), selaras dengan PRD 2.2 dan kontrak API backend T-19.
3. **Detail Peluang Kampus:** D07b ditambahkan sebagai pop-up detail, persis seperti bottom sheet M14 di mobile.
4. **Terminologi Resmi:** Semua label "Test Drive" telah diseragamkan menjadi **"Simulasi"** (K-11), dan "Reality Check" menjadi **"Kenyataan kuliah"**.
5. **Standarisasi Font:** Figma menetapkan 4 font resmi:
   - `Pixelify Sans` — Heading skor, tombol 8-bit, judul tiket.
   - `Press Start 2P` — Logo retro dan badge 8-bit.
   - `Plus Jakarta Sans` — Body text, label form, deskripsi modern.
   - `JetBrains Mono` — Code snippet di Mini Challenge (`kasir.js`).

---

## 2. Prinsip Arsitektur Anti-Rusak-Mobile (Strict Rules)

Pengerjaan desktop **HARAM merusak tampilan mobile**. Aturan teknis ketat yang wajib dipatuhi:

1. **Prinsip Mobile-First & Aditif:**
   - Styling dasar (tanpa prefiks breakpoint) **sepenuhnya milik mobile (<1024px)**.
   - Semua modifikasi styling desktop **wajib menggunakan modifier Tailwind `lg:` (≥1024px)**.
   - *Dilarang keras mengubah kelas CSS dasar tanpa prefiks `lg:` pada komponen yang sudah ada*, kecuali saat penggantian wrapper ke `PageShell` yang terverifikasi visualnya.
2. **Abstraksi `PageShell`:**
   - Wrapper hardcode `max-w-[402px] mx-auto min-h-screen border-x-2` yang tersebar di halaman-halaman akan digantikan secara terpusat oleh komponen `PageShell`:
     - Mobile: `max-w-[402px] mx-auto border-x-2 border-black bg-[#F7F5F0]`
     - Desktop: `lg:max-w-none lg:border-x-0 lg:w-full`
3. **Pemisahan Subtree untuk Komponen Berbeda Struktur:**
   - Komponen dengan tata letak yang berbeda total antara mobile dan desktop (misal: Navbar, Sidebar Chat D08, Sidebar Katalog D09, Layout 2-Kolom Soal D10) **tidak boleh dipaksakan dalam satu komponen yang rumit**.
   - Gunakan subtree terpisah:
     - `NavbarMobile` (`lg:hidden`) vs `NavbarDesktop` (`hidden lg:block`)
     - `ChatMobile` (`lg:hidden`) vs `ChatDesktop` (`hidden lg:flex`)
     - `FilterDrawerMobile` (`lg:hidden`) vs `FilterSidebarDesktop` (`hidden lg:block`)
   - **Logika & State tetap satu:** Semua state (active tab, search query, answers, filter) tetap dikelola di page level atau shared hook (`usePreferensiStorage`, dll.), sehingga komponen Desktop dan Mobile berbagi logic yang sama tanpa duplikasi state.
4. **Zero Hydration Mismatch:**
   - Pengalihan tampilan mobile vs desktop dilakukan via CSS Tailwind (`hidden lg:block` / `lg:hidden`), **bukan menggunakan JavaScript `window.innerWidth` atau `useMediaQuery`** agar SSR Next.js 15 tidak mengalami hydration error.

---

## 3. Gerbang Verifikasi Visual (4 Titik Kritis)

Setiap sesi implementasi wajib lolos uji di 4 lebar viewport berikut:

| Viewport | Peruntukan | Syarat Kelulusan |
|---|---|---|
| **402px** | Mobile Standar | **100% Identik dengan baseline mobile.** Tidak boleh ada perubahan posisi, padding, atau teks 1 pixel pun. |
| **1023px** | Batas Maksimal Mobile | Halaman tetap berada di tengah container mobile (402px) tanpa ada horizontal scrollbar atau overflow. |
| **1024px** | Batas Minimal Desktop | Tampilan berpindah ke layout desktop tanpa ada teks bertumpuk atau elemen terpotong. |
| **1440px** | Standar Figma Desktop | **100% Sesuai AST Figma Desktop** (padding 120px, container 1200px, font, warna, border, dan elevasi). |

Selain pengujian visual di atas, setiap sesi wajib lulus:
- `npm.cmd run lint` (0 error, 0 warning baru)
- `npm.cmd run test` (127/127 passing, 0 regresi)
- `npm.cmd run build` (25 rute sukses ter-generate)

---

## 4. Pembagian Sesi Pengerjaan (D0 s/d D6)

### Sesi D0 — Persiapan Font, Design Token & Baseline Testing
- **Tujuan:** Menyiapkan fondasi font dan token tanpa menyentuh tampilan visual.
- **Pekerjaan:**
  1. Konfigurasi `next/font/google` di `src/app/layout.tsx` untuk memuat:
     - `Plus Jakarta Sans` (font body modern)
     - `JetBrains Mono` (font code snippet)
     - Memastikan `Pixelify Sans` dan `Press Start 2P` terhubung ke class font Tailwind.
  2. Tambahkan token ukuran desktop di `src/app/globals.css` (@theme Tailwind v4):
     - Container max: `1200px`
     - Padding horizontal desktop: `120px` (atau `48px` untuk navbar)
  3. Ambil screenshot baseline semua halaman di viewport 402px sebagai tolok ukur uji anti-regresi.

### Sesi D1 — Fondasi Layout Shell & Komponen Global
- **Tujuan:** Membangun kerangka desktop global yang membungkus aplikasi.
- **Frame Target:** D01/D03 (Shell), D02 (`LoginModal`), Navbar Desktop, Footer Desktop.
- **Pekerjaan:**
  1. Buat `src/components/layout/PageShell.tsx` (responsif 402px di mobile, full container di desktop).
  2. Buat `src/components/layout/NavbarDesktop.tsx` (1440×80px, padding 48px, menu navigasi, profil user "Ari Rahman" dropdown, dan `ScrollProgressBar` 4 segmen).
  3. Buat `src/components/layout/FooterDesktop.tsx` (1440×343px, background `#151D21`, 3 kolom link, disclaimer border kuning).
  4. Sesuaikan `src/components/auth/LoginModal.tsx` agar pada desktop tampil sebagai dialog modal terpusat (440px) dengan backdrop gelap yang rapi.
- **Verifikasi:** Viewport 402px wajib 100% identik dengan baseline.

### Sesi D2 — Beranda (`/`) & Syarat Ketentuan (`/syarat-ketentuan`)
- **Frame Target:** D01, D03, D11.
- **Pekerjaan:**
  1. `src/app/page.tsx` & `src/components/home/`: Implementasi layout desktop Hero Section 2 kolom, 3 Value Proposition cards (grid 3 kolom), dan CTA state belum/sudah login.
  2. `src/app/syarat-ketentuan/page.tsx`: Layout desktop 2 kolom dengan Sticky Table of Contents (260px) di kiri dan konten isi (760px) di kanan.

### Sesi D3 — Alur Preferensi & Form Akademik
- **Frame Target:** D04, D04b, D05, D05b, D06, D06b, D06c.
- **Pekerjaan:**
  1. `/preferensi` (D04): Grid kartu preferensi (3 kolom) + tile putus-putus "+ Tambah Preferensi" + Modal D04b (pilihan jalur SNBP/SNBT).
  2. `/preferensi/riasec` (D05): Layout split 2 kolom (kiri: Stepper 380px, kanan: Kartu Soal 764px).
  3. `/preferensi/minat` (D05b): Layout desktop hasil skor RIASEC + pemilihan pill hobi & mapel favorit.
  4. `/preferensi/akademik` (D06 & D06b): Layout 2 kolom (kiri checklist kelengkapan 340px, kanan form sekolah, rapor, TKA, prestasi, dan wilayah/alumni 804px).
  5. `/preferensi/snbt` (D06c): Form input skor try out subtes UTBK & portofolio.

### Sesi D4 — Rekomendasi 3 Tiket & Katalog Simulasi
- **Frame Target:** D07, D07b, D09.
- **Pekerjaan:**
  1. `/cocokin` (D07 & D07b):
     - Grid 3 Tiket Rekomendasi (#1 Dream Goal, #2 Safety Net, #3 Alternatif) dengan indikator peluang dan kecocokan RIASEC.
     - Modal Dialog D07b untuk rincian daya tampung, peluang per kampus, dan riwayat keketatan snpmb.id.
     - Banner ajakan Simulasi & Chat AI.
  2. `/katalog` (D09):
     - Layout Desktop: Sidebar Filter sticky di kiri (300px) dan Grid Kartu Prodi 2 Kolom di kanan (860px).
     - Tombol aksi langsung "[SIMULASI]" di tiap kartu prodi.

### Sesi D5 — AI Chat Konsultasi & Mini Challenge
- **Frame Target:** D08, D10, D10b.
- **Pekerjaan:**
  1. `/chat` (D08): Layout split penuh (Sidebar riwayat chat & navigasi 340px dengan background `#F7F5F0`, Main Chat area 1100px dengan input bar floating di bawah).
  2. `/test-drive/[id]` (D10 & D10b):
     - Layout desktop 2 kolom terpusat untuk soal `kasir.js` (kiri deskripsi kasus & pilihan jawaban, kanan editor code preview `JetBrains Mono`).
     - State D10b: Panel hasil koreksi instan + bagian "Kenyataan kuliah" (drop out rate, beban skripsi, prospek kerja).

### Sesi D6 — Pengujian Regresi Total, Lint, Build & PR
- **Pekerjaan:**
  1. Pengujian interaksi lengkap pada 4 breakpoint (402, 1023, 1024, 1440).
  2. Jalankan test suite `npm.cmd run test` (harus 127/127 pass).
  3. Jalankan `npm.cmd run lint` & `npm.cmd run build`.
  4. Dokumentasikan token dan komponen baru di `docs/DESIGN_SYSTEM.md`.
  5. Buat Pull Request (PR) dari branch `fitur/daliondroid-T-21`.

---

## 5. Ringkasan Checklist Kontrol Kualitas per Frame

Sebelum sebuah frame desktop dinyatakan selesai (Definition of Done), periksa:
- [ ] Angka AST Figma cocok (width, height, padding, gap, border-radius, font-size).
- [ ] Render tampilan 1440px cocok visualnya dengan frame Figma Desktop.
- [ ] Render tampilan 402px **tidak bergeser / tidak berubah** dibandingkan baseline mobile.
- [ ] State form / interaksi terhubung sempurna ke state yang sama dengan mobile.
- [ ] Tidak ada warning lint dan build berhasil.

Dokumen ini siap dijadikan panduan eksekusi bertahap bersama tim!
