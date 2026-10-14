# KOLABORASI.md

> Aturan kerja tim untuk manusia **dan** agen AI. File ini **di-commit** dan sama untuk semua anggota.
> File pribadi (`AGENTS.md`, `TASK.md`, `PROJECT_STATE.md`) di-gitignore; milik masing-masing orang.
> Jika file ini bertentangan dengan `AGENTS.md` dalam urusan kerja tim, **file ini yang berlaku**.

---

## ✏️ Isi Di Sini Dulu

Cukup ubah blok di bawah. Satu baris per anggota: `panggilan = "username GitHub"`.
Ganti teks di kiri `=` dengan nama panggilan, dan teks di dalam tanda kutip dengan username GitHub.
Seluruh file ini merujuk anggota memakai **panggilan** dari blok ini.

```ini
[anggota]
farrelzaki = "farrelzaki"
daliondroid = "daliondroid"
# tambah baris lain jika anggota lebih banyak

[git]
mode = "multi-branch"   # pilih: "satu-branch" atau "multi-branch" (lihat bagian 2)
branch_utama = "main"
```

Contoh terisi: `budi = "budi-santoso"`.

---

## 0. Protokol Agen (wajib, sebelum eksekusi apa pun)

Agen AI wajib menjalankan langkah ini di awal setiap sesi, **sebelum membaca task, menulis file, atau menjalankan perintah git yang mengubah apa pun**:

1. **Baca file ini sampai habis.**
2. **Tanyakan identitas pengguna.** Ajukan pertanyaan pilihan berisi semua panggilan di blok *Isi Di Sini Dulu*, misalnya:
   > Sebelum mulai, kamu siapa? (1) panggilan1 (2) panggilan2 (3) …
   - Jangan menebak dari nama folder, riwayat chat, atau `git config`.
   - Jika blok masih berisi placeholder (`panggilan1`, `username-github`), minta pengguna mengisinya dulu.
   - Jika jawaban **tidak ada** di blok, berhenti. Minta pengguna menambahkan dirinya lebih dulu.
3. **Cek konsistensi (peringatan saja, tidak memblokir).** Jika `gh` tersedia, bandingkan username GitHub pengguna di blok dengan `gh api user --jq .login`. Jika berbeda, beri tahu pengguna.
4. **Catat** pengguna aktif di `PROJECT_STATE.md` pribadi (field `Pengguna aktif`).
5. **Sinkronkan.** Jalankan `git pull --rebase` (lihat bagian 2 untuk branch yang dipakai) sebelum mulai bekerja.
6. **Tampilkan task milik pengguna aktif** dari *Papan Task* (bagian 3), lalu tanyakan mana yang dikerjakan.

Identitas berlaku untuk satu sesi. Jika pengguna bilang "sekarang aku X", ulangi langkah 2–6.

## 1. Peran Dan Wilayah

Kolom *Panggilan* harus sama persis dengan panggilan di blok *Isi Di Sini Dulu*.

| Panggilan | Peran | Wilayah (folder/file milik) |
| --- | --- | --- |
| daliondroid | Frontend & UI/UX: scaffolding, halaman 1–13, komponen 8-bit, pitch deck | `src/app/**` **kecuali** `src/app/api/**` · `src/components/` · `src/styles/` · `public/` · `docs/DESIGN_SYSTEM.md` |
| farrelzaki | Backend, Data & AI: DB, impor data, skoring, API, auth, Gemini, QA | `src/app/api/**` · `src/lib/` (skoring, db, auth, gemini, beserta test-nya) · `supabase/` kecuali migrasi · `scripts/` · `Data/` · `docs/PRD.md` |

Struktur folder di atas adalah rencana; T-02 (scaffolding) wajib membuatnya persis seperti ini.
**Pengecualian T-02:** daliondroid boleh membuat kerangka kosong (folder, file placeholder) di wilayah farrelzaki selama scaffolding — disetujui farrelzaki 2026-10-15.

UI memanggil backend hanya lewat endpoint di kontrak API. Selama endpoint belum ada, frontend memakai **mock lokal** di wilayah daliondroid sesuai bentuk kontrak (bagian 5).

**File bersama** (menyentuh semua orang, wajib dikunci dulu di bagian 4):
`package.json` / lockfile, konfigurasi (`tsconfig.json`, `next.config.*`, `tailwind.config.*`, `postcss.config.*`, `vitest.config.*`, config lint, `.env.example`, config Vercel), migrasi database (`supabase/migrations/`), tipe kontrak API bersama (`src/types/`), kontrak API di `docs/ARSITEKTUR.md`, `README.md`, dan file ini.

## 2. Mode Git Proyek

Mode dan branch utama diambil dari blok `[git]` di bagian atas file ini.

| Mode | Cocok untuk |
| --- | --- |
| `satu-branch` | Tim kecil, wilayah file jelas terpisah, iterasi cepat |
| `multi-branch` | Tim lebih besar, banyak file bersinggungan, perlu riwayat per task yang rapi |

## 3. Papan Task

Aturan untuk agen:

- **Hanya kerjakan task yang `Pemilik`-nya adalah pengguna aktif.**
- Diminta mengerjakan task milik orang lain → **tolak**, sebutkan pemiliknya. Boleh dikerjakan hanya jika pemiliknya setuju; catat `disetujui <pemilik> <tanggal>` di kolom Catatan.
- Task dengan pemilik `-` boleh diklaim: isi panggilan pengguna aktif, ubah status ke `[~]`, **commit + push perubahan papan ini dulu**, baru mulai mengerjakan. Jika push ditolak karena orang lain mengklaim duluan, batalkan klaim.
- Pengguna hanya mengubah baris task miliknya sendiri. Task baru boleh ditambahkan siapa saja di bagian bawah tabel.
- Status: `[ ]` belum · `[~]` dikerjakan · `[x]` selesai · `[-]` batal

| ID | Task | Pemilik | Status | Branch | Area / file | Update | Catatan |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-01 | Sesuaikan dokumen template dengan PRD v2.1 | farrelzaki | `[x]` | `main` | `docs/`, `README.md`, `KOLABORASI.md` | 2026-10-15 | |
| T-12 | Putuskan pertanyaan terbuka; selaraskan dokumen dataset | farrelzaki | `[x]` | `main` | `docs/`, `Data/*.md` | 2026-10-15 | |
| T-16 | Ubah tim jadi 2 orang, mode multi-branch, bagi task | farrelzaki | `[x]` | `main` | `KOLABORASI.md`, `README.md` | 2026-10-15 | |
| T-02 | Scaffolding Next.js 15 + TypeScript + Tailwind + Vitest, struktur folder sesuai bagian 1, token `DESIGN_SYSTEM.md`, `.env.example`; isi ARSITEKTUR bagian 3 | daliondroid | `[ ]` | `fitur/daliondroid-T-02` | semua file bersama, kerangka `src/` | 2026-10-15 | Malam ini. File bersama sudah dikunci (bagian 4). Memblokir T-04, T-13, dan semua UI |
| T-06 | UI 8-bit: navbar, beranda, CTA, modal login, wizard preferensi (Hal. 1–7) | daliondroid | `[ ]` | | `src/app/`, `src/components/` | | F-01–F-07; data dari mock sampai T-05 siap |
| T-07 | UI dashboard rekomendasi (Hal. 8) | daliondroid | `[ ]` | | `src/app/`, `src/components/` | | F-08 |
| T-08 | UI katalog prodi + Test Drive (Hal. 12–13) | daliondroid | `[ ]` | | `src/app/`, `src/components/` | | F-10, F-11 |
| T-15 | UI banner chat, chatbot, drawer menu (Hal. 9–11) | daliondroid | `[ ]` | | `src/app/`, `src/components/` | | F-09 |
| T-11 | Pitch deck 10 slide + video demo 2 menit | daliondroid | `[ ]` | | di luar repo | | Materi lomba; data dan hasil QA dari farrelzaki |
| T-03 | Skema DB (migrasi) + skrip impor dataset `Data/` ke Supabase | farrelzaki | `[~]` | `fitur/farrelzaki-T-03` | `supabase/`, `scripts/` | 2026-10-15 | TBD-05. Rancangan skema boleh dimulai sebelum T-02; skrip impor setelah T-02 di-merge |
| T-04 | Modul skoring murni + test (provinsi, keketatan, eligibilitas, peluang, kecocokan) | farrelzaki | `[ ]` | | `src/lib/` | | BR-01–BR-10; setelah T-02 |
| T-13 | Login Google (NextAuth), sesi 30 hari, smart routing, hapus akun | farrelzaki | `[ ]` | | `src/app/api/auth/`, `src/lib/` | | F-02, F-16; setelah T-02 |
| T-05 | API `/api/school`, `/api/prodi`, `/api/peluang`, `/api/kecocokan` + kontrak di ARSITEKTUR | farrelzaki | `[ ]` | | `src/app/api/`, `src/lib/` | | Kontrak disepakati dengan daliondroid sebelum dibekukan |
| T-14 | API `/api/test-drive` (soal berlapis, reveal, refleksi) | farrelzaki | `[ ]` | | `src/app/api/`, `src/lib/` | | F-11 |
| T-09 | Chatbot Gemini 2.5 Flash + function calling, API `/api/chat` | farrelzaki | `[ ]` | | `src/app/api/`, `src/lib/` | | F-09 |
| T-10 | QA 10 skenario siswa + tinjau soal 3–5 prodi demo | farrelzaki | `[ ]` | | `src/lib/`, `Data/` | | R-02 |

Rincian langkah task (rencana, checklist) ditulis di `TASK.md` pribadi, bukan di sini.

## 4. Kunci File Bersama

Sebelum menyunting file bersama (bagian 1), tambahkan baris di sini, commit, dan push. Hapus barisnya setelah perubahanmu masuk ke branch utama.

| File | Dikunci oleh | Sejak | Alasan |
| --- | --- | --- | --- |
| `package.json`, lockfile, semua config (bagian 1), `.env.example`, `src/types/` | daliondroid | 2026-10-15 | T-02 scaffolding (dikunci lebih dulu oleh farrelzaki atas nama daliondroid) |
| `supabase/migrations/` | farrelzaki | 2026-10-15 | T-03 skema DB awal |

Agen **tidak boleh** menyunting file bersama yang sedang dikunci orang lain.

## 5. Aturan Git Umum (semua mode)

- **Hanya sunting file di wilayahmu** (bagian 1) dan file task milikmu. Butuh perubahan di wilayah orang lain → minta pemiliknya; jangan perbaiki sendiri.
- Bug di wilayah orang lain → laporkan ke pengguna; jangan perbaiki.
- Jangan "sekalian merapikan" (format, impor, nama variabel) di luar file task.
- Butuh fungsi/endpoint milik orang lain yang belum ada → pakai bentuk dari kontrak API dan buat **mock lokal** di wilayahmu.
- **Dilarang** `git push --force` ke branch yang dipakai bersama, `git reset --hard` atas commit yang sudah di-push, dan rewrite history bersama.
- `.env` dan rahasia tidak pernah di-commit.

### Commit Dan Push Dilakukan Agen

Commit, push, dan merge **dikerjakan oleh agen**, bukan diketik manual, agar riwayat rapi, seragam, dan tidak bertabrakan. Agen tidak perlu menunggu disuruh; pengguna cukup bilang "jangan commit dulu" jika ingin menahan.

Kapan agen commit:

- Setelah satu langkah kerja selesai **dan** verifikasinya (test/lint/build yang ada) lulus.
- Satu commit = satu perubahan logis. Jangan menimbun banyak perubahan tak berhubungan dalam satu commit.
- Jangan commit kode yang gagal test/build; perbaiki dulu atau laporkan.

Cara agen commit:

1. Periksa `git status` dan `git diff`; pastikan hanya file milik task/wilayah pengguna aktif yang berubah.
2. Tambahkan file satu per satu (`git add path/file`). **Jangan `git add .` / `git add -A`.**
3. Tulis pesan commit otomatis dari isi diff, format: `<modul>: <apa yang berubah> (T-xx)`.
   - Huruf kecil, kalimat perintah, ringkas (≤ 72 karakter), mis. `api: tambah endpoint login (T-01)`.
   - `<modul>` sesuai area yang diubah: `api`, `ui`, `db`, `docs`, `config`, `test`, dsb.
   - Tambahkan badan pesan (baris kosong lalu poin singkat) jika perubahannya perlu penjelasan.
4. Push mengikuti langkah mode di bagian 6.
5. Setelah push, laporkan ke pengguna: hash commit, pesan, dan branch.

Agen **berhenti dan bertanya** jika: ada konflik (bagian 7), ada perubahan di luar wilayah pengguna di working tree, push ditolak setelah `pull --rebase`, atau perlu force push.

## 6. Aturan Per Mode

### Mode `satu-branch`

Semua orang bekerja langsung di branch utama.

```bash
git pull --rebase                 # sebelum mulai
# ... kerja di wilayahmu saja ...
git add path/file-yang-diubah
git commit -m "ui: tambah form login (T-02)"
git pull --rebase                 # WAJIB sebelum push
# jalankan test/build singkat jika ada
git push
```

- Push sesering mungkin (setiap commit yang stabil); jangan menimbun perubahan berhari-hari.
- Branch utama harus tetap bisa dijalankan; jangan push kode yang rusak.
- Push ditolak (`rejected`) → `git pull --rebase` lalu push lagi. **Jangan force.**
- Wilayah file wajib dipatuhi ketat agar tidak saling menimpa.

### Mode `multi-branch`

Setiap task dikerjakan di branch sendiri, lalu digabung ke branch utama oleh agen.

```bash
git checkout main && git pull --rebase
git checkout -b fitur/<panggilan>-<ID>      # mis. fitur/budi-T-01
# ... kerja, commit kecil ...
git fetch origin && git rebase origin/main  # rutin, minimal sebelum push
git push -u origin fitur/<panggilan>-<ID>
# task selesai: buka PR ke main lalu merge (mis. gh pr create --fill && gh pr merge --squash --delete-branch)
```

- Nama branch: `fitur/…`, `perbaikan/…`, `docs/…` + panggilan + ID task.
- Satu branch = satu task. Branch berumur pendek (idealnya < 3 hari); task besar dipecah.
- **Jangan push langsung ke branch utama.** Masuk lewat PR (atau merge lokal jika repo tidak memakai PR).
- Sebelum merge: branch sudah di-rebase ke branch utama terbaru dan test/build lulus. Review anggota lain **opsional**, tidak wajib.
- Setelah rebase atas branch yang sudah di-push, gunakan `git push --force-with-lease` **hanya untuk branch milikmu sendiri**.
- Setelah merge: hapus branch, ubah status task ke `[x]`, isi log (bagian 8).
- **Pengecualian `KOLABORASI.md`:** perubahan papan task, kunci, dan log (bagian 3, 4, 8) di-commit dan di-push **langsung ke branch utama**
  (`git checkout main && git pull --rebase`, ubah, commit, push, lalu kembali ke branch task) agar anggota lain langsung melihatnya.
- Membuat branch task: `git checkout main && git pull --rebase && git checkout -b fitur/<panggilan>-<ID>`.
  Jika branch sudah disiapkan di remote: `git fetch origin && git checkout fitur/<panggilan>-<ID>`.

## 7. Konflik

- Konflik muncul → agen **berhenti** dan melapor ke pengguna: file apa, baris milik siapa.
- Jangan memilih sisi kode milik orang lain. Tanyakan pemiliknya.
- Pengecualian lockfile (`package-lock.json`, `composer.lock`, dsb.): ambil versi branch utama, lalu jalankan ulang install agar lockfile dibuat ulang dari manifest.
- Konflik di file ini (`KOLABORASI.md`): pertahankan baris milik semua orang; hanya baris milikmu yang boleh kamu ubah.

## 8. Log Per Anggota

Setiap anggota punya satu subbagian berjudul panggilannya. **Append-only**, satu baris per entri, terbaru di bawah. Hanya sunting subbagian milikmu.
Format: `- YYYY-MM-DD · T-xx · apa yang dikerjakan · hasil/verifikasi · catatan untuk tim`

### Log daliondroid

- _[belum ada]_

### Log farrelzaki

- 2026-10-15 · T-01 · isi docs/PRD, ARSITEKTUR, DESIGN_SYSTEM, README, papan task dari PRD v2.1 · tinjau diff · PRD sumber dipindah ke docs/referensi/
- 2026-10-15 · T-12 · keputusan OQ/TBD dicatat di docs; Data/README & AUDIT diselaraskan ke Cocokin!; soal v1 dihapus · JSON & py dicek valid · tenggat hackathon masih belum diketahui
- 2026-10-15 · T-16 · tambah anggota daliondroid, mode multi-branch, bagi wilayah & task, siapkan branch fitur/daliondroid-T-02 dan fitur/farrelzaki-T-03, kunci file bersama untuk T-02 · atas perintah farrelzaki

## 9. Mengubah File Ini

1. `git pull --rebase` dulu.
2. Ubah hanya baris task, kunci, atau log milikmu.
3. Commit terpisah: `docs: kolaborasi <ringkas> (T-xx)`, lalu langsung push agar anggota lain melihatnya.
4. Mengubah aturan (bagian 0, 2, 5, 6, 7) atau daftar anggota butuh persetujuan seluruh anggota.
