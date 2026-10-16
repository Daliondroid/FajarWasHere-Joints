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
| T-02 | Scaffolding Next.js 15 + TypeScript + Tailwind + Vitest, struktur folder sesuai bagian 1, token `DESIGN_SYSTEM.md`, `.env.example`; isi ARSITEKTUR bagian 3 | daliondroid | `[x]` | `fitur/daliondroid-T-02` | semua file bersama, kerangka `src/` | 2026-10-15 | Commit 6dfaf36 di-fast-forward ke `main` oleh farrelzaki (test, lint, build lulus). Commit T-06 di branch yang sama belum digabung |
| T-06 | UI 8-bit: navbar, beranda, CTA, modal login, wizard preferensi (Hal. 1–7) | daliondroid | `[x]` | `fitur/daliondroid-T-07` | `src/app/`, `src/components/` | 2026-10-15 | F-01–F-07 100% sesuai Figma; wizard modular & draft persistensi |
| T-07 | UI dashboard rekomendasi (Hal. 8) | daliondroid | `[x]` | `fitur/daliondroid-T-07` | `src/app/`, `src/components/` | 2026-10-15 | F-08 100% sesuai Figma; kartu rekomendasi, skor kecocokan, tombol simulation & chat |
| T-08 | UI katalog prodi + Test Drive (Hal. 12–13) | daliondroid | `[x]` | `fitur/daliondroid-T-07` | `src/app/`, `src/components/` | 2026-10-15 | F-10, F-11 100% sesuai Figma; filter IPA/IPS, challenge 60s, code block, feedback |
| T-15 | UI banner chat, chatbot, drawer menu (Hal. 9–11) | daliondroid | `[x]` | `fitur/daliondroid-T-07` | `src/app/`, `src/components/` | 2026-10-15 | F-09 100% sesuai Figma; input mic pixel, drawer histori & quick prompts |
| T-11 | Pitch deck 10 slide + video demo 2 menit | daliondroid | `[ ]` | | di luar repo | | Materi lomba; data dan hasil QA dari farrelzaki |
| T-03 | Skema DB (migrasi) + skrip impor dataset `Data/` ke Supabase | farrelzaki | `[x]` | `main` (PR #1) | `supabase/`, `scripts/` | 2026-10-15 | TBD-05. Skema + data sudah dimuat ke Supabase `cocokin` |
| T-04 | Modul skoring murni + test (provinsi, keketatan, eligibilitas, peluang, kecocokan) | farrelzaki | `[x]` | `main` (PR #2) | `src/lib/` | 2026-10-15 | BR-01–BR-11. Modul di `src/lib/skoring/`, asumsi di `parameter_estimasi.json` |
| T-13 | Login Google (NextAuth), sesi 30 hari, smart routing, hapus akun + API simpan preferensi | farrelzaki | `[x]` | `main` (PR #4) | `src/app/api/auth/`, `src/app/api/akun/`, `src/app/api/preferensi/`, `src/lib/`, `src/middleware.ts` | 2026-10-15 | F-02, F-16. Scope + `/api/preferensi` dan middleware, atas perintah farrelzaki |
| T-05 | API `/api/school`, `/api/prodi`, `/api/peluang`, `/api/kecocokan` + kontrak di ARSITEKTUR | farrelzaki | `[x]` | `main` (PR #3) | `src/app/api/`, `src/lib/` | 2026-10-15 | Kontrak (ARSITEKTUR bagian 4, `src/types/api.ts`) **menunggu tinjauan daliondroid** sebelum dibekukan |
| T-14 | API `/api/test-drive` (soal berlapis, reveal, refleksi) | farrelzaki | `[x]` | `main` (PR #7) | `src/app/api/`, `src/lib/` | 2026-10-15 | F-11. Rute UI Hal. 13: `/test-drive/[id_prodi]` (angka). Tanpa timer & refleksi sejak T-18 |
| T-09 | Chatbot Gemini 2.5 Flash + function calling, API `/api/chat` | farrelzaki | `[ ]` | | `src/app/api/`, `src/lib/` | | F-09 |
| T-10 | QA 10 skenario siswa + tinjau soal 3–5 prodi demo | farrelzaki | `[ ]` | | `src/lib/`, `Data/` | | R-02 |
| T-17 | Revisi PRD 2.2: scroll progress navbar, modal login & CTA sudah login, banyak preferensi + preferensi aktif, desktop, mapel pilihan TKA, hapus riwayat alumni | farrelzaki | `[x]` | `main` | `docs/PRD.md` | 2026-10-15 | Langsung ke main tanpa PR atas izin farrelzaki. Desain: Figma page "HIFI v3 — PRD 2.2" |
| T-18 | DB + API banyak preferensi per akun (nama, jalur tunggal, status aktif) + pemilih preferensi aktif | farrelzaki | `[x]` | `main` (PR #8) | `supabase/migrations/`, `src/app/api/preferensi/`, `src/lib/`, `docs/ARSITEKTUR.md` | 2026-10-16 | F-18, F-19, BR-16, BR-17. Perubahan besar: skema `preferensi` kini satu baris per akun Scope + TKA 2 mapel pilihan (BR-18), hapus alumni tidak daftar ulang (K-04), data TO per preferensi SNBT, hapus refleksi & durasi simulasi (K-06, K-08, R-06), atas perintah farrelzaki |
| T-19 | API rekomendasi 3 kartu (Dream Goal, Safety Net serumpun, Alternatif) + data popup DETAIL dari preferensi aktif | farrelzaki | `[x]` | `main` (PR #9) | `src/app/api/rekomendasi/`, `src/lib/` | 2026-10-16 | F-08, K-07, K-10, BR-01. Ditambah atas perintah farrelzaki |
| T-20 | UI 8-bit Mobile v3 (Tahap A–C): fondasi, beranda v3, modal login, wizard preferensi multi-preferensi & RIASEC | daliondroid | `[~]` | `fitur/daliondroid-T-20` | `src/app/`, `src/components/`, `src/styles/`, `public/` | 2026-10-16 | Sesuai Figma HIFI v3 M01–M12, M10b, M20 |

Rincian langkah task (rencana, checklist) ditulis di `TASK.md` pribadi, bukan di sini.

## 4. Kunci File Bersama

Sebelum menyunting file bersama (bagian 1), tambahkan baris di sini, commit, dan push. Hapus barisnya setelah perubahanmu masuk ke branch utama.

| File | Dikunci oleh | Sejak | Alasan |
| --- | --- | --- | --- |

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

- 2026-10-15 · T-02 · scaffolding Next.js 15, Tailwind, Vitest, token visual · test, lint, build lulus · branch fitur/daliondroid-T-02 digabung farrelzaki ke main
- 2026-10-15 · T-06 · UI landing page, navbar 8-bit, CTA, wizard preferensi langkah 1-3 modular · 100% persis Figma · branch fitur/daliondroid-T-07
- 2026-10-15 · T-07, T-08, T-15 · implementasi dashboard rekomendasi (/cocokin), chat & drawer (/chat), katalog (/katalog), mini challenge 60s (/test-drive/[id]), dropdown menu overlay di Navbar · 100% persis Figma, 84/84 test passed, lint 0 error, build 16 routes sukses · branch fitur/daliondroid-T-07 di-push ke remote, siap di-merge
- 2026-10-16 · T-20 · mulai pengerjaan UI Mobile v3 (Tahap A–C): fondasi, beranda v3, modal login, wizard preferensi RIASEC & SNBP/SNBT · branch fitur/daliondroid-T-20 · koordinasi desain HIFI v3 PRD 2.2

### Log farrelzaki

- 2026-10-15 · T-01 · isi docs/PRD, ARSITEKTUR, DESIGN_SYSTEM, README, papan task dari PRD v2.1 · tinjau diff · PRD sumber dipindah ke docs/referensi/
- 2026-10-15 · T-12 · keputusan OQ/TBD dicatat di docs; Data/README & AUDIT diselaraskan ke Cocokin!; soal v1 dihapus · JSON & py dicek valid · tenggat hackathon masih belum diketahui
- 2026-10-15 · T-16 · tambah anggota daliondroid, mode multi-branch, bagi wilayah & task, siapkan branch fitur/daliondroid-T-02 dan fitur/farrelzaki-T-03, kunci file bersama untuk T-02 · atas perintah farrelzaki
- 2026-10-15 · T-03 · migrasi skema awal (27 tabel, RLS tanpa policy) + scripts/impor_data.py; dimuat ke Supabase cocokin · jumlah baris 21 tabel cocok, 84 MB · akses DB hanya dari server (service role); kunci supabase/migrations dilepas
- 2026-10-15 · T-02 · gabungkan scaffolding daliondroid (6dfaf36) ke main lewat fast-forward, lepas kunci file bersama · npm test 3/3, lint, build lulus · T-06 di fitur/daliondroid-T-02 belum digabung
- 2026-10-15 · T-04 · modul skoring murni src/lib/skoring (BR-01–BR-11) + 47 test · npm test 50/50, tsc, lint, build lulus; angka cocok skoring_referensi.py · parameter asumsi di src/lib/skoring/parameter_estimasi.json; tipe src/types belum selaras, dibahas di kontrak T-05
- 2026-10-15 · T-05 · 5 endpoint (school, prodi, prodi/[id], peluang, kecocokan) + kontrak + supabase-js 2.117.3; kunci file bersama dilepas · npm test 81/81, tsc, lint, build, uji e2e ke Supabase lulus · daliondroid: mohon tinjau kontrak ARSITEKTUR bagian 4 / src/types/api.ts; tipe lama di src/types/index.ts diganti; isi NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY di .env untuk memanggil API lokal
- 2026-10-15 · T-13 · login Google next-auth 4.24.15 (sesi JWT 30 hari), /api/auth/lanjut, /api/akun (status, hapus), /api/preferensi GET/PUT, middleware gerbang login, migrasi preferensi (ipsf_60, 0..4); kunci dilepas · npm test 97/97, build, uji e2e login Google nyata lulus · daliondroid: tombol login `signIn('google', { callbackUrl: '/api/auth/lanjut' })`, keluar `signOut()`; isi GOOGLE_CLIENT_ID/SECRET, NEXTAUTH_SECRET, NEXTAUTH_URL di .env (minta ke farrelzaki)
- 2026-10-15 · T-13 · lanjutan: /cocokin wajib login dan jadi tujuan smart routing; /katalog publik; kunci dilepas · npm test 97/97, build, cek redirect di dev lulus (PR #5) · daliondroid: halaman Hal. 8 tetap di /cocokin
- 2026-10-15 · T-06/07/08/15 · gabungkan branch fitur/daliondroid-T-07 ke main lewat PR #6 (squash, branch dibiarkan) · uji gabung: npm test 100/100, tsc, lint, build lulus · UI belum memanggil API; Test Drive akan memakai /test-drive/[id_prodi]
- 2026-10-15 · T-14 · /api/test-drive (maks 3 soal tanpa kunci, berlapis spesifik/umum → rumpun → cadangan; reality check), /jawab, /refleksi (wajib login); refleksi jadi tie-breaker /api/kecocokan; kunci dilepas · npm test 117/117, build, e2e Supabase + login Google lulus · daliondroid: Hal. 13 pakai /test-drive/[id_prodi]; kunci & pembahasan diambil dari /jawab
- 2026-10-16 · T-18 · banyak preferensi per akun (nama unik, jalur tetap, tepat satu aktif) via migrasi 20261015020000 + fungsi SQL atomik; /api/preferensi (+/aktif, /[id], /[id]/aktif); TO per preferensi SNBT; TKA 2 mapel pilihan; reputasi alumni; simulasi tanpa timer & refleksi; kunci dilepas · npm test 127/127, build, e2e login Google lulus · daliondroid: wizard simpan via POST /api/preferensi (edit: PUT /[id]); Hal. 8/chat/katalog pakai GET /api/preferensi/aktif; pemilih: POST /api/preferensi/[id]/aktif
- 2026-10-16 · T-19 · GET /api/rekomendasi: 3 kartu (dream_goal, safety_net serumpun patuh BR-01, alternatif rumpun lain) + `detail` popup (kode Holland, keketatan, peluang sesuai jalur, 3 alasan, PDDikti) dari preferensi aktif; kunci dilepas · npm test 137/137, build, e2e data nyata lulus · daliondroid (T-20): Hal. 8 cukup GET /api/rekomendasi, popup pakai kartu[i].detail; catatan "minat 40%, gaya belajar 25%, peluang 35%" di /cocokin tidak sesuai BR-10 (kecocokan = 0,8 RIASEC + 0,2 hobi; peluang terpisah)
- 2026-10-15 · T-17 · docs/PRD.md 2.2: F-01 progres scroll, F-02 modal login + CTA sudah login, F-18/F-19/BR-16/BR-17 banyak preferensi (1 aktif, 1 jalur), BR-18 2 mapel pilihan TKA dipilih siswa, riwayat alumni tidak daftar ulang dihapus (K-04) · diff ditinjau; langsung ke main atas izin farrelzaki · daliondroid: UI perlu ikut Figma "HIFI v3 — PRD 2.2" (R-05); T-18 untuk DB/API
- 2026-10-15 · T-17 · docs/PRD.md: Test Drive tanpa timer (F-11, K-06), rekomendasi ringkas + popup DETAIL (F-08, K-07) · diff ditinjau; langsung ke main atas izin farrelzaki · daliondroid: ikuti Figma HIFI v3 M13/M14/M18/M19
- 2026-10-15 · T-17 · docs/PRD.md: hasil Test Drive = versi koreksi layar soal, tanpa rating/refleksi (F-11, K-08) · diff ditinjau · R-06: endpoint/field refleksi dari T-14 perlu dihapus
- 2026-10-15 · T-17 · docs/PRD.md: keterangan kecil dipindah ke Halaman Syarat & Ketentuan (F-20, K-09), tautan di footer & modal login · diff ditinjau; langsung ke main atas izin farrelzaki · daliondroid: ikuti Figma HIFI v3 M20/D11 + footer
- 2026-10-15 · T-17 · docs/PRD.md: hasil rekomendasi jadi 3 kartu (#3 Alternatif, F-08, K-10) · diff ditinjau; langsung ke main atas izin farrelzaki · daliondroid: endpoint rekomendasi kembalikan 3 prodi
- 2026-10-15 · T-17 · docs/PRD.md: "Test Drive" diganti "Simulasi" (K-11) · diff ditinjau; langsung ke main atas izin farrelzaki · daliondroid: ganti label UI, rute/API boleh tetap

## 9. Mengubah File Ini

1. `git pull --rebase` dulu.
2. Ubah hanya baris task, kunci, atau log milikmu.
3. Commit terpisah: `docs: kolaborasi <ringkas> (T-xx)`, lalu langsung push agar anggota lain melihatnya.
4. Mengubah aturan (bagian 0, 2, 5, 6, 7) atau daftar anggota butuh persetujuan seluruh anggota.
