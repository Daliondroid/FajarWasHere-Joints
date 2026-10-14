# Design System — Cocokin!

> Semua nilai visual di kode harus berasal dari token di sini.

Status: **draf** · Sumber desain: `referensi/PRD_Cocokin_v2.1.md` bagian 3 dan 4 (wireframe *Low Fidelity.jpeg* belum ada di `referensi/`)

Penanda nilai: `[Dari Desain]` diambil dari PRD · `[Improvisasi]` dirancang di sini · `TBD` belum ditetapkan.

## 1. Prinsip

1. **Retro Pixel 8-Bit Arcade / RPG** dipadukan palet warna Google yang ramah dan vibrant. `[Dari Desain]`
2. Proses terasa seperti game: kuis minat sebagai kartu RPG, kode Holland sebagai "class" karakter. `[Dari Desain]`
3. Warna punya makna konsisten: status keketatan dan rumpun ilmu selalu memakai warna yang sama. `[Dari Desain]`
4. Gaya pixel hanya untuk judul, lencana, dan bingkai; teks panjang tetap memakai font yang mudah dibaca. `[Dari Desain]`

## 2. Warna

| Token | Nilai | Pemakaian |
| --- | --- | --- |
| `color-primary` (Google Blue) | `#4285F4` `[Dari Desain]` | Tombol aksi utama (Next, Mulai, Search), link navigasi, elemen SAINTEK, status *Sedang* |
| `color-danger` (Google Red) | `#EA4335` `[Dari Desain]` | Peringatan, tombol Back/Batal, status *Sangat Ketat*, pelanggaran aturan provinsi |
| `color-warning` (Google Yellow) | `#FBBC05` `[Dari Desain]` | Lencana prestasi, bintang rekomendasi, status *Ketat*, aksen gold |
| `color-success` (Google Green) | `#34A853` `[Dari Desain]` | Status *Longgar/Aman*, tombol konfirmasi (`MULAI SEKARANG`), elemen SOSHUM |
| `color-border` | `#1A1A1A` `[Dari Desain]` | Bingkai dan bayangan pixel |
| `color-bg` (light) | `#F8F9FA` `[Dari Desain]` | Retro Canvas Off-White |
| `color-bg` (dark) | `#202124` `[Dari Desain]` | Retro Slate Dark |
| `color-text` | TBD | — |

## 3. Tipografi

| Token | Font | Ukuran / tinggi baris | Bobot | Pemakaian |
| --- | --- | --- | --- | --- |
| `text-heading` | 'Press Start 2P' atau 'Silkscreen' `[Dari Desain]` | TBD | — | Judul, badge, tombol |
| `text-body` | 'Outfit' atau 'Inter' `[Dari Desain]` | TBD | 500–600 `[Dari Desain]` | Teks panjang, chat, pembahasan soal |

Pilihan final antara dua font per peran: TBD.

## 4. Spasi, Radius, Bayangan

| Token | Nilai |
| --- | --- |
| `border-pixel` | `3px solid #1A1A1A` `[Dari Desain]` |
| `shadow-pixel` | `4px 4px 0px #1A1A1A` `[Dari Desain]` |
| `radius` | `0` `[Improvisasi]` — sudut tajam sesuai gaya pixel |
| `space-1` | TBD |

## 5. Tata Letak Dan Breakpoint

TBD (bergantung OQ-04 di `PRD.md`: mobile-first atau desktop-first).

## 6. Komponen

| Komponen | Varian / state | Catatan |
| --- | --- | --- |
| Button | primary (blue), confirm (green), danger (red), disabled | Bingkai dan bayangan pixel |
| Navbar | — | Logo pixel Cocokin! (dadu/gamepad 8-bit); menu Beranda, Cocokin, Edit Preferensi, Login/Logout |
| Progress bar wizard | langkah aktif / selesai | `[1. Minat]` ── `[2. Bahan]` |
| Kartu kuis minat | 5 tombol skala | 😖 Sangat tidak suka · 🙁 Tidak suka · 😐 Ragu · 🙂 Suka · 🤩 Sangat suka |
| Chip hobi / tag kampus | dipilih, tidak dipilih | Multi-select |
| Radio 8-bit | — | Reputasi alumni (👑 ⚔️ 🛡️ 🌲) |
| Kartu rekomendasi | Dream Goal, Safety Net | Bar kecocokan `[██████████░] 94% Match`, peluang per kampus, tombol "Kenapa?" |
| Badge keketatan | Sangat Ketat, Ketat, Sedang, Longgar | Warna sesuai bagian 2 |
| Badge rumpun / jenjang / akreditasi | SAINTEK (blue), SOSHUM (green), S1/D4/D3 | — |
| Label data | resmi, estimasi, sintetis, data terbatas, dibuat AI | Wajib di setiap angka/konten terkait |
| Chat bubble | pengguna, bot | Gaya 8-bit |
| Mini challenge | timer 60 detik, opsi A–D, reveal | — |

## 7. Microcopy

- Sapaan santai ala kakak tingkat, Bahasa Indonesia, contoh: *"Isi preferensi dulu yuu, biar ramalan Cocokin! makin akurat!"* `[Dari Desain]`
- Headline: *"Jangan sampai salah jurusan. Uji dulu, baru pilih!"* `[Dari Desain]`
- Jujur soal data: *"Data kuota sekolahmu belum tersedia, kami pakai perkiraan dari persen akreditasi."*; chatbot menjawab *"datanya tidak tersedia"* bila data kosong. `[Dari Desain]`
- Angka peluang selalu disertai kata *estimasi*. `[Dari Desain]`

## 8. Aksesibilitas

TBD. Catatan awal `[Improvisasi]`: font pixel tidak dipakai untuk teks panjang; status keketatan tidak hanya dibedakan warna
(selalu disertai teks label); kontras teks pada latar kuning `#FBBC05` perlu dicek.
