# Design System — Cocokin!

> Semua nilai visual di kode harus berasal dari token di sini. Sumber kebenaran: Figma **FIGMA-JOINTS**
> (`7cjqnxwFVnIH22ba3Kof7Z`), page **"HIFI v3 — PRD 2.2"**: koleksi variabel *Cocokin Tokens*, text style,
> effect style, dan section **🧩 Components** (`80:2`). Kalau Figma dan dokumen ini berbeda, ikuti Figma lalu perbarui dokumen ini.

Status: **final v3** (diambil dari Figma 2026-10-16) · PRD acuan: `docs/PRD.md` 2.2

Penanda nilai: `[Figma]` diambil langsung dari Figma HIFI v3 · `[Improvisasi]` aturan kode yang tidak ada di Figma.

## 1. Prinsip

1. **Dunia pixel 8-bit yang tenang.** Bingkai tegas 2 px, bayangan keras tanpa blur, sudut tajam. Warna cerah dipakai
   untuk makna, bukan hiasan. `[Figma]`
2. **Ringkas dulu, detail belakangan.** Layar kerja hanya memuat yang perlu untuk keputusan; rincian masuk popup
   (`DETAIL`, `Kenapa?`) dan keterangan kecil masuk Halaman Syarat & Ketentuan (PRD F-20, K-07, K-09).
3. **Warna selalu bermakna sama** (bagian 2.3): jalur, keketatan, label data, benar/salah.
4. **Font pixel hanya untuk judul, label, dan tombol.** Teks panjang memakai Plus Jakarta Sans.
5. **Ciri khas visual yang wajib dijaga:** garis putus-putus (penghubung stepper, perforasi tiket, kotak tambah/opsi),
   garis progres scroll empat warna yang terputus di bawah navbar, tiket rekomendasi dengan sobekan, jendela retro
   dengan header berwarna dan tiga kotak kontrol.

## 2. Warna

### 2.1 Token `[Figma]`

| Token | Hex | Pemakaian |
| --- | --- | --- |
| `ink` | `#151D21` | Teks utama, semua bingkai dan bayangan pixel, latar footer, tag gelap |
| `ink-2` | `#3A444B` | Teks sekunder, label input |
| `muted` | `#6B7680` | Keterangan, placeholder, langkah stepper yang belum aktif |
| `line` | `#D9D5CB` | Garis pemisah putus-putus di halaman teks |
| `track` | `#D3D6DA` | Bagian progres yang belum terisi (scroll progress, bar kecocokan) |
| `canvas` | `#F7F5F0` | Latar kotak info lembut (mis. kotak privasi modal) |
| `paper` | `#FFFFFF` | Latar halaman, kartu, jendela, field |
| `blue` | `#277EFD` | Aksi utama, terpilih, SNBT, Dream Goal, bubble pengguna |
| `blue-700` | `#1A5FD1` | Teks di atas `blue-50`, tautan, nav aktif |
| `blue-200` | `#BBD5FE` | Kartu preferensi SNBT tidak aktif |
| `blue-50` | `#EAF2FF` | Latar terpilih (opsi, nav aktif), tag biru |
| `yellow` | `#FEBD01` | SNBP, peringatan, aksen bintang, tombol Warning |
| `yellow-200` | `#FFE58A` | Kartu preferensi SNBP tidak aktif |
| `yellow-50` | `#FFF6D6` | Tag kuning |
| `green` | `#22A94F` | Benar, resmi, Safety Net, sukses |
| `green-50` | `#E6F6EC` | Tag hijau, label data resmi |
| `red` | `#F1402E` | Salah, bahaya, hapus, pelanggaran aturan |
| `red-50` | `#FEECEA` | Tag merah |
| `code-bg` | `#1E2630` | Blok kode (jarang dipakai) |

Teks di atas `yellow`, `yellow-200`, dan semua latar `-50` selalu `ink` (atau `blue-700` di `blue-50`); teks di atas
`blue`, `green`, `red`, `ink` selalu `paper`.

### 2.2 Garis progres scroll (PRD F-01, K-03) `[Figma]`

Empat segmen terputus (gap 8 px, tinggi 4 px) berurutan **blue → red → yellow → green**, latar segmen `track`.
Segmen terisi sesuai posisi scroll halaman; sisanya tetap abu-abu.

### 2.3 Warna bermakna

| Makna | Warna | Contoh |
| --- | --- | --- |
| Jalur SNBP / SNBT | `yellow` / `blue` | Kartu preferensi, pemilih preferensi (BR-17) |
| Keketatan (BR-03) | Sangat Ketat `red` · Ketat `yellow` · Sedang `blue` · Longgar `green` | Tag keketatan di Baris Peluang |
| Label data (BR-13) | Resmi `green` · Estimasi `yellow` · Sintetis `red` `[Improvisasi]` · Dibantu AI `ink` | Tag di samping angka |
| Tiket rekomendasi | #1 Dream Goal `blue` · #2 Safety Net `green` · #3 Alternatif `yellow` `[Improvisasi]` | Tiket Hal. 8 (K-10) |
| Jawaban simulasi | Benar `green` · Jawabanmu salah `red` | Hasil Simulasi (K-08) |
| Status aktif | Kartu penuh warna + bayangan MD; tidak aktif memakai `-200` + bayangan SM | Preferensi (BR-16) |

Status tidak boleh hanya dibedakan warna: selalu ada teks label (mis. "SANGAT KETAT", "AKTIF", "BENAR").

## 3. Tipografi `[Figma]`

Font: **Press Start 2P** (display & tombol), **Pixelify Sans** (label & judul kartu), **Plus Jakarta Sans** (teks),
**JetBrains Mono** (kode). Semua dari Google Fonts. Letter spacing 0 kecuali `Label/S`.

| Style | Font | Ukuran / tinggi baris | Pemakaian |
| --- | --- | --- | --- |
| `Display/L` | Press Start 2P Regular | 22 / 36 | Judul halaman desktop, nomor peringkat tiket |
| `Display/M` | Press Start 2P Regular | 16 / 28 | Judul halaman mobile |
| `Display/S` | Press Start 2P Regular | 12 / 20 | Judul modal, judul kecil |
| `Button` | Press Start 2P Regular | 11 / 16, huruf kapital | Label tombol |
| `Label/L` | Pixelify Sans SemiBold | 18 / 24 | Nama jurusan di tiket, nama preferensi, logo teks |
| `Label/M` | Pixelify Sans SemiBold | 15 / 20 | Judul kartu, chip, item navigasi |
| `Label/S` | Pixelify Sans Medium | 12 / 16, spasi 6%, kapital | Tag, header jendela, label stepper, judul kolom footer |
| `Body/L` | Plus Jakarta Sans Regular | 16 / 26 | Paragraf pembuka |
| `Body/M` | Plus Jakarta Sans Regular | 14 / 22 | Teks umum, isi input, chat |
| `Body/M Strong` | Plus Jakarta Sans SemiBold | 14 / 22 | Penekanan, teks soal |
| `Body/S` | Plus Jakarta Sans Regular | 12 / 18 | Keterangan, meta |
| `Body/S Strong` | Plus Jakarta Sans Bold | 12 / 18 | Label input, angka peluang, tautan kecil |
| `Code` | JetBrains Mono Regular | 12 / 20 | Kode |

Teks panjang tidak boleh memakai font pixel. Hindari label kapital di atas setiap judul; pakai hanya bila memberi informasi.

## 4. Spasi, Bingkai, Bayangan `[Figma]`

| Token | Nilai |
| --- | --- |
| `space` | 2 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 px |
| `border` | `2px solid ink` (komponen utama) · `1.5px` untuk tag, field kecil, kotak dalam kartu |
| `border-dashed` | `2px dashed ink`, pola 6–4/6–5 (stepper, perforasi tiket, opsi kartu, Tambah Preferensi) |
| `shadow-sm` (Pixel/Shadow SM) | `3px 3px 0 ink` — tombol, chip, field terpilih, kartu kecil |
| `shadow-md` (Pixel/Shadow MD) | `5px 5px 0 ink` — jendela, tiket, kartu preferensi aktif |
| `radius` | `0` di semua komponen |
| `scrim` | `ink` opasitas 55% di belakang modal/sheet |

Interaksi tombol `[Improvisasi]`: saat ditekan geser `translate(2px, 2px)` dan bayangan mengecil ke `1px 1px`;
fokus keyboard memakai outline `2px solid blue-700` dengan offset 2 px.

## 5. Tata Letak Dan Breakpoint `[Figma]`

| | Mobile (dasar) | Desktop |
| --- | --- | --- |
| Lebar frame desain | 402 px | 1440 px |
| Gutter / padding halaman | 24 px | 120 px (konten 1200 px) |
| Jarak antarblok | 16–24 px | 24–32 px |
| Navigasi | Top Bar 64 px (60 + progres 4) + drawer | Navbar Desktop 80 px |
| Aksi wizard | Bottom Action Bar menempel di bawah (KEMBALI + LANJUT) | Tombol di akhir form |

Mobile-first. Breakpoint ke tata letak desktop: `lg` = 1024 px `[Improvisasi]`. Halaman teks (Syarat & Ketentuan)
dibatasi ±760 px dengan daftar isi di kiri pada desktop.

## 6. Komponen `[Figma]`

Nama mengikuti section 🧩 Components (ID node Figma dalam kurung).

| Komponen | Varian / properti | Spesifikasi kunci |
| --- | --- | --- |
| Button (`80:43`) | Type: Primary blue, Secondary paper, Danger red, Success green, Warning yellow · Size: L 48 px / M 36 px · ikon opsional | Border 2 ink, shadow-sm, padding 20/16 px, label `Button` kapital |
| Chip (`80:52`) | Default / Selected (blue, ikon cek) | Tinggi 44, `Label/M`, shadow-sm; hobi & mapel favorit |
| Tag (`80:63`) | Blue, Yellow, Green, Red, Ink | Latar `-50` + border 1.5 warna, `Label/S`; Ink = latar ink teks paper |
| Window (Window Header `80:94`) | Header Blue/Yellow/Green/Red/Ink | Jendela: border 2, shadow-md; header 36 px, garis bawah 2, judul `Label/S` + tiga kotak kontrol |
| Top Bar (`80:122`) | Brand / Back · Masuk · aksi | 60 px + Scroll Progress; judul Press Start 2P 12 px |
| Navbar Desktop (`169:423`) | Tamu / Masuk | Menu Beranda, Cocokin, Preferensi, Simulasi; aktif = teks blue + garis bawah; avatar akun |
| Scroll Progress (`167:105`) | Progress 0/15/40/70/100 | Lihat 2.2 |
| Stepper (`80:146`) | Step 1 / 2 | Penanda 32 px (aktif blue, selesai green + cek), penghubung putus-putus |
| Option (`81:57`) | Card / Compact × Default / Selected | Card: border putus-putus, terpilih blue-50 + border blue + shadow; checkbox 22 px |
| Input (`81:66`) | Default / Filled | Label `Body/S Strong` ink-2, field 48 px border 2, placeholder muted |
| Upload Zone (`81:67`) | Title, Hint | Kotak putus-putus blue di blue-50, ikon upload |
| Score Row (`81:72`) | Label, Value | Baris nilai rapor/TKA dengan kotak angka |
| Bottom Action Bar (`81:76`) | — | Garis atas 2 ink, KEMBALI (Secondary) + LANJUT (Primary) |
| Kartu Minat (`168:344`) | Jawaban Kosong/1–5 | Kuis RIASEC: nomor kotak ink, 5 kotak skala; terpilih blue + shadow |
| Preferensi Card (`168:160`) | Jalur SNBP/SNBT × Aktif Ya/Tidak | Aktif warna penuh + shadow-md + tag AKTIF; tidak aktif `-200` + shadow-sm |
| Tambah Preferensi (`168:161`) | — | Kotak putus-putus, ikon plus dalam kotak |
| Pemilih Preferensi (`168:181`) | Jalur SNBP/SNBT | Penanda warna jalur + nama + chevron |
| Card/Major Ticket (`108:608`) | Rank, Major, Campus, Match | Tiket ringkas Hal. 8: stub peringkat, perforasi putus-putus, bar kecocokan, tombol SIMULASI + DETAIL |
| Tiket Rekomendasi (`169:248`) | Dream Goal / Safety Net | Versi lengkap (desktop & popup DETAIL): badge, peluang per kampus, PDDikti, takik atas-bawah |
| Baris Peluang (`169:101`) | Kampus, Rasio, Peluang | Tag keketatan, rasio resmi, rentang peluang + tautan "Kenapa?" |
| Kartu Prodi (`169:260`) | Prodi, PTN, Statistik | Katalog: badge jenjang/rumpun/akreditasi, tombol Simulasi |
| Chat Bubble (`169:259`) | Bot / Kamu · label data | Bot: paper + avatar; Kamu: blue teks paper; shadow-sm |
| Prompt Chip (`81:129`) | Text | Saran pertanyaan chat, ikon spark |
| Nav Item (`81:128`) | Default / Active | Drawer; aktif blue-50 + garis kiri 4 blue |
| List/Major (`81:107`) | Name, Meta | Baris daftar jurusan |
| Modal Login Google (`169:337`) | — | Jendela + logo, tombol Google, kalimat persetujuan S&K |
| Footer (`169:336`) | Mobile / Desktop | Latar ink: brand, Jelajahi, Sumber data, disclaimer putus-putus kuning, Syarat & ketentuan, Hapus akun |

Popup/sheet (mis. popup DETAIL, pilih mapel TKA, preferensi baru): panel paper dengan garis atas 2 ink, pegangan abu-abu,
di atas scrim.

### Ikon `[Figma]`

Set ikon pixel 24×24 satu warna (warna mengikuti teks): menu, back, arrow-right, search, check, chevron-down,
chevron-right, upload, send, spark, info, close, plus, home, edit, play, chat, lock, clock, user, logout, filter,
trash, dots, star, school, question, attach, swap, grid, trophy, chart, face-1 s.d. face-5. Ekspor SVG ke
`public/assets/icons/`.

## 7. Token Di Kode `[Improvisasi]`

Nama token CSS mengikuti nama Figma agar mudah dicocokkan. Contoh untuk Tailwind 4 (`src/app/globals.css`):

```css
@theme {
  --color-ink: #151D21;   --color-ink-2: #3A444B;  --color-muted: #6B7680;
  --color-line: #D9D5CB;  --color-track: #D3D6DA;  --color-canvas: #F7F5F0;  --color-paper: #FFFFFF;
  --color-blue: #277EFD;  --color-blue-700: #1A5FD1; --color-blue-200: #BBD5FE; --color-blue-50: #EAF2FF;
  --color-yellow: #FEBD01; --color-yellow-200: #FFE58A; --color-yellow-50: #FFF6D6;
  --color-green: #22A94F; --color-green-50: #E6F6EC;
  --color-red: #F1402E;   --color-red-50: #FEECEA;

  --font-display: 'Press Start 2P', monospace;
  --font-label: 'Pixelify Sans', sans-serif;
  --font-body: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --shadow-pixel-sm: 3px 3px 0 #151D21;
  --shadow-pixel-md: 5px 5px 0 #151D21;
  --radius: 0px;
}
```

Catatan selisih kode saat ini: `globals.css` masih memakai bingkai `3px #000000`, bayangan `4px`, dan font Outfit/Inter.
Ganti ke nilai di atas (bingkai 2 px `ink`, bayangan 3/5 px, Plus Jakarta Sans + Pixelify Sans).

## 8. Microcopy

- Bahasa Indonesia santai ala kakak tingkat, kalimat pendek, sentence case untuk teks; kapital hanya untuk tombol dan tag.
- Nama fitur: **Simulasi** (bukan Test Drive, K-11), **Preferensi**, **Cocokin**.
- Tombol menyebut aksinya: `LANJUT`, `KEMBALI`, `SIMULASI`, `DETAIL`, `BUAT & MULAI`, `Masuk dengan Google`.
- Angka peluang selalu berlabel *estimasi*; chatbot menjawab "datanya tidak tersedia" bila data kosong.
- Keterangan kecil (aturan, rumus, sumber, privasi) tidak ditulis di layar; tautkan ke Syarat & Ketentuan (K-09).

## 9. Aksesibilitas

- Kontras: `ink` di atas `paper`/`-50`/`yellow` dan `paper` di atas `blue`/`green`/`red`/`ink` (teks ≥ 14 px
  atau tebal). Jangan menaruh teks `muted` di atas latar berwarna.
- Status tidak hanya dibedakan warna (bagian 2.3); ikon dekoratif diberi `aria-hidden`.
- Target sentuh minimal 44 px (chip, tombol L, kotak skala minat).
- Font pixel tidak dipakai untuk teks lebih dari satu baris pendek.
- Hormati `prefers-reduced-motion`: matikan animasi tekan/geser dan progres scroll beranimasi.
