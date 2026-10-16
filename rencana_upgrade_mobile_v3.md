# Rencana Upgrade UI ke Mobile v3 (PRD 2.2)

Sumber: Figma page `HIFI v3 - PRD 2.2`, section `Mobile v3` (node `172:764`), 402 px.
Kondisi kode saat ini: mengikuti HIFI v2 (9 halaman). Desktop v3 (D01–D11) dikerjakan setelah mobile.

## Perubahan Besar v2 → v3

- **Garis 4 warna di navbar = progres scroll** (F-01), sisanya abu-abu.
- **Login Google lewat modal** (F-02). Tombol MULAI SEKARANG membuka modal saat belum login.
- **Beranda punya 2 kondisi.** Jika sudah login dan punya preferensi, CTA berubah menjadi "Yuk, lihat rekomendasi".
- **Banyak preferensi per akun, satu aktif** (F-18/19). Kuning = SNBP, biru = SNBT. Ada pemilih preferensi di Rekomendasi, Chat, dan Test Drive.
- **Wizard preferensi dirombak.** Ada layar kosong/tersimpan, nama dan jalur, kuis RIASEC, hasil minat, lalu bahan SNBP/SNBT.
- **TKA = 3 mapel wajib + 2 mapel pilihan** (M10b, BR-18). Pertanyaan alumni tidak daftar ulang dihapus (K-04).
- **Rekomendasi jadi 3 kartu + popup detail** (M13/M14). Mini Challenge dibagi jadi soal dan hasil koreksi.
- **Halaman baru: Syarat & Ketentuan** (M20).

## Daftar Frame, Rute, dan Status

Legenda: **Upgrade** = halaman sudah ada, perlu diubah. **Baru** = belum ada di kode.

| # | Frame | Node | Rute usulan | Status | Ukuran |
|---|---|---|---|---|---|
| 0 | Design System: Icons, Components | `79:45`, `80:2` | `globals.css`, `components/ui/*` | Upgrade | Sedang |
| 1 | M01 Beranda belum login | `172:203` | `/` | Upgrade | Sedang |
| 2 | M02 Beranda menu | `172:344` | Navbar | Upgrade | Kecil |
| 3 | M03 Modal login Google | `172:502` | komponen `LoginModal` | Baru | Sedang |
| 4 | M04 Beranda sudah login | `172:601` | `/` (varian) | Baru | Kecil |
| 5 | M05 Preferensi kosong | `173:476` | `/preferensi` | Upgrade | Kecil |
| 6 | M06 Preferensi tersimpan | `173:518` | `/preferensi` | Baru | Sedang |
| 7 | M07 Preferensi baru: nama dan jalur | `173:642` | `/preferensi/baru` | Upgrade (gantikan pilih jalur) | Sedang |
| 8 | M08 Kuis minat RIASEC | `173:696` | `/preferensi/riasec` | Baru | Besar |
| 9 | M09 Hasil minat, hobi, dan mapel | `174:852` | `/preferensi/minat` | Upgrade | Sedang |
| 10 | M10 Bahan SNBP: sekolah, rapor, TKA | `174:1038` | `/preferensi/akademik` | Upgrade | Besar |
| 11 | M10b Pilih mapel pilihan TKA | `198:3260` | sheet atau halaman | Baru | Kecil |
| 12 | M11 Bahan SNBP: wilayah dan alumni | `175:1016` | `/preferensi/akademik` | Upgrade | Sedang |
| 13 | M12 Bahan SNBT: try out dan portofolio | `175:1197` | `/preferensi/akademik` | Upgrade | Sedang |
| 14 | M13 Rekomendasi | `205:3349` | `/cocokin` | Upgrade | Besar |
| 15 | M14 Popup detail rekomendasi | `205:3518` | modal di `/cocokin` | Baru | Sedang |
| 16 | M15 Chat | `177:1569` | `/chat` | Upgrade | Sedang |
| 17 | M16 Drawer menu chat | `177:1649` | `/chat` | Upgrade | Kecil |
| 18 | M17 Katalog Test Drive | `180:1706` | `/katalog` | Upgrade | Sedang |
| 19 | M18 Mini Challenge: soal | `206:3221` | `/test-drive/[id]` | Upgrade | Sedang |
| 20 | M19 Mini Challenge: hasil koreksi | `207:3189` | `/test-drive/[id]` | Upgrade | Sedang |
| 21 | M20 Syarat dan Ketentuan | `215:3198` | `/syarat-ketentuan` | Baru | Kecil |

## Urutan Pengerjaan yang Disarankan

Setiap tahap bisa berdiri sendiri, jadi Anda bisa berhenti di tahap mana saja.

| Tahap | Isi | Frame | Alasan |
|---|---|---|---|
| **A. Fondasi** | Token, ikon, komponen v3, navbar dengan progres scroll, pemilih preferensi (komponen bersama) | #0, #2 | Dipakai semua halaman. Kalau terlambat, semua halaman harus dikerjakan ulang. |
| **B. Beranda dan login** | Landing v3, modal login Google, varian sudah login, S&K | #1, #3, #4, #21 | Gerbang masuk dan kesan pertama. Modal login dibuat dengan mock sesi lokal. |
| **C. Wizard preferensi** | Daftar preferensi, nama dan jalur, RIASEC, hasil minat, SNBP, TKA, SNBT | #5–#13 | Bagian terbesar dan terbanyak berubah. Bisa dibagi: C1 (#5–#9) dan C2 (#10–#13). |
| **D. Rekomendasi** | 3 kartu, popup detail, pemilih preferensi | #14, #15 | Inti produk. Butuh kontrak API T-19 dari farrelzaki (sementara pakai mock). |
| **E. Chat, katalog, Test Drive** | Chat, drawer, katalog, soal, hasil koreksi | #16–#20 | Banyak mengikuti pola yang sudah ada. |
| **F. Desktop v3** | D01–D11 (1440 px), responsif dari komponen mobile | D01–D11 | Setelah mobile stabil, supaya tidak ada kerja ganda. |

## Catatan dan Risiko

- **Data masih mock.** Sesuai `AGENTS.md`, UI memakai mock lokal sampai endpoint farrelzaki siap. Status login juga mock di tahap B.
- **Kontrak API bisa berubah.** Banyak preferensi, TKA pilihan, dan rekomendasi 3 kartu adalah kontrak API (T-18, T-19) dari farrelzaki. Perlu cek `docs/ARSITEKTUR.md` sebelum tahap C dan D.
- **Beberapa rute berubah atau bertambah.** `/preferensi/baru`, `/preferensi/riasec`, dan `/syarat-ketentuan`. Test rute di `tests/` perlu disesuaikan.
- **Kuis RIASEC (#8) adalah halaman paling kompleks.** Isi soal dan logika skor ada di wilayah backend, jadi UI cukup memakai mock.
- **Teks dan ikon di Figma ada yang rusak (karakter `?`).** Ini hanya efek output terminal, bukan masalah desain. Saya akan cek ulang saat membaca per frame.
- **Branch.** Saya usulkan branch baru `fitur/daliondroid-T-20` (nomor menyesuaikan papan `KOLABORASI.md`). Task baru ini perlu diklaim di papan task.
- **Verifikasi tiap tahap:** `lint`, `test`, `build`, dan cek visual di browser terhadap frame Figma.

## Keputusan yang Dibutuhkan dari Anda

1. Mau mulai dari tahap mana, dan berhenti sampai tahap mana?
2. Apakah tahap C dipecah (C1 dan C2) atau dikerjakan sekaligus?
3. Apakah desktop (tahap F) masuk jadwal sekarang, atau menyusul?
