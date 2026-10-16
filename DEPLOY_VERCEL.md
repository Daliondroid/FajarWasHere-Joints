# Panduan Deploy Cocokin! ke Vercel (untuk pemilik repo)

Untuk: **daliondroid** (pemilik repo `Daliondroid/FajarWasHere-Joints`). Dari: farrelzaki.
Tujuan: demo hackathon di URL Vercel. Branch yang di-deploy: `main` (sudah berisi Mobile v3 + API; tampilan desktop v3 belum masuk, masih dikerjakan).

> **Rahasia (nilai env) JANGAN ditaruh di repo, chat grup, atau file ini.** Minta ke farrelzaki lewat jalur pribadi (DM / password manager), lalu tempel langsung ke Vercel.

## 1. Yang perlu disiapkan

| Kebutuhan | Keterangan |
| --- | --- |
| Akun Vercel | Login dengan GitHub pemilik repo. Free (Hobby) cukup untuk demo. |
| Repo | Import `FajarWasHere-Joints`, branch `main`. Framework terdeteksi otomatis: **Next.js**. |
| Node | 20 atau 22 (bawaan Vercel). Tidak perlu diubah. |
| Perintah | Biarkan bawaan: install `npm install`/`npm ci`, build `npm run build` (= `next build --turbopack`), output Next.js. Tidak ada `vercel.json`. |
| Database | **Tidak perlu impor ulang.** Supabase hosted `cocokin` sudah berisi skema + data dataset. Cukup pakai kunci yang sama (lihat bagian 2). |

## 2. Environment Variables (Project → Settings → Environment Variables → Production)

Hanya 7 variabel yang dibaca aplikasi. Nama persis seperti di bawah.

| Nama | Wajib | Dari mana | Catatan |
| --- | --- | --- | --- |
| `NEXTAUTH_URL` | ya | URL produksi Vercel, mis. `https://cocokin.vercel.app` | **Tanpa** garis miring di akhir. Isi setelah tahu domainnya (lihat langkah 3), lalu redeploy. |
| `NEXTAUTH_SECRET` | ya | Dari farrelzaki, **atau** buat baru: `openssl rand -base64 32` | Boleh beda dari lokal. Konsekuensi kalau diganti: sesi login lama tidak berlaku. |
| `GOOGLE_CLIENT_ID` | ya | Dari farrelzaki (OAuth client yang sama), atau buat client sendiri (lihat bagian 4) | |
| `GOOGLE_CLIENT_SECRET` | ya | Sama seperti di atas | |
| `NEXT_PUBLIC_SUPABASE_URL` | ya | Dari farrelzaki (URL proyek Supabase `cocokin`) | Bukan rahasia, tapi tetap dikirim terpisah. |
| `SUPABASE_SERVICE_ROLE_KEY` | ya | Dari farrelzaki | **Sangat rahasia** (bypass RLS). Hanya dipakai di server. Jangan beri awalan `NEXT_PUBLIC_`. |
| `GEMINI_API_KEY` | untuk chat | Dari farrelzaki (kunci tingkat gratis Google AI Studio) | Kosong = chat tetap jalan dengan jawaban cadangan non-AI (`cadangan: true`), tapi tanpa Gemini. |

Opsional: `GEMINI_MODEL` (daftar model dipisah koma; bawaan `gemini-3.5-flash-lite,gemini-3.1-flash-lite,gemini-2.5-flash-lite`). Biarkan kosong.

**Tidak perlu di Vercel:** `SUPABASE_DB_URL` (hanya untuk skrip impor lokal `scripts/impor_data.py`) dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` (ada di `.env.example` tapi tidak dipakai kode).

Centang environment **Production** (dan Preview jika mau, tapi login Google hanya jalan di domain yang didaftarkan, lihat bagian 4).

## 3. Urutan deploy

1. Vercel → **Add New → Project** → pilih repo `FajarWasHere-Joints` → Import.
2. Di halaman konfigurasi, buka **Environment Variables** dan isi semua variabel bagian 2 **kecuali `NEXTAUTH_URL`** (domain belum diketahui). Boleh isi sementara `https://localhost:3000`.
3. Klik **Deploy**. Build biasanya 1–3 menit.
4. Catat domain produksi (mis. `https://xxxx.vercel.app`; bisa diganti nama proyek agar rapi: Settings → Domains).
5. Ubah `NEXTAUTH_URL` ke domain itu → **Redeploy** (Deployments → ⋯ → Redeploy). Variabel hanya terbaca saat build/deploy baru.
6. Daftarkan redirect URI di Google (bagian 4), lalu uji (bagian 5).

## 4. Login Google (paling sering jadi penyebab gagal)

Di Google Cloud Console → APIs & Services → **Credentials** → OAuth 2.0 Client yang `Client ID`-nya dipakai:

- **Authorized JavaScript origins**: tambah `https://<domain-vercel>`
- **Authorized redirect URIs**: tambah `https://<domain-vercel>/api/auth/callback/google`

Jangan hapus entri `http://localhost:3000` supaya lokal tetap jalan.

Cek juga **OAuth consent screen**: bila statusnya *Testing*, hanya akun yang terdaftar sebagai **Test users** yang bisa login. Untuk demo, tambahkan email juri/penguji ke Test users, atau Publish app (untuk scope dasar email/profil tidak perlu verifikasi Google).

Bila client OAuth ada di akun Google farrelzaki, minta farrelzaki menambahkan dua URL di atas; atau buat client baru di akunmu dan pakai ID/secret itu.

## 5. Uji setelah deploy (smoke test)

1. `https://<domain>/` tampil beranda (hero kampus, 3 langkah, footer).
2. Klik **Masuk** → login Google berhasil dan kembali ke aplikasi (jika error `redirect_uri_mismatch` → bagian 4; jika `NO_SECRET` / sesi tidak tersimpan → cek `NEXTAUTH_SECRET` dan `NEXTAUTH_URL`).
3. Buat preferensi baru (SNBP) sampai selesai → buka `/cocokin` → muncul 3 kartu rekomendasi + popup DETAIL.
4. `/katalog` memuat daftar prodi; buka satu prodi → **Simulasi** → jawab soal → muncul koreksi.
5. `/chat` → kirim pesan "rekomendasi apa untukku?" → balasan muncul (label data resmi). Jika balasan cadangan terus-menerus: cek `GEMINI_API_KEY` atau kuota gratis habis (429, tunggu atau coba lagi nanti).
6. `/preferensi` tanpa login harus mengarah ke beranda dengan modal login (gerbang login, middleware).

Cek lewat Vercel → Deployments → **Logs** bila ada halaman 500. Galat API berbentuk `{"error":{"kode","pesan"}}`.

## 6. Hal lain yang perlu diketahui

- **Auto-deploy**: setiap push/merge ke `main` otomatis membangun ulang. Merge PR desktop v3 nanti = otomatis ter-deploy.
- **Kuota Gemini gratis** terbatas per model (rotasi 3 model Flash-Lite). Untuk demo bersama banyak orang, kemungkinan kena 429 → aplikasi memakai jawaban cadangan. Pakai **data uji**, jangan data siswa asli (aturan tingkat gratis Google, lihat `docs/ARSITEKTUR.md`).
- **Region**: bila terasa lambat, atur Function Region Vercel (Settings → Functions) mendekati region proyek Supabase (Singapura/AP-Southeast bila sesuai).
- **Akses Supabase**: aplikasi hanya mengakses DB dari server dengan service role; RLS aktif tanpa policy (sesuai desain). Tidak perlu mengubah apa pun di Supabase untuk deploy.
- **Akun uji**: akun farrelzaki punya preferensi "Uji T20 SNBP" dari pengujian; boleh dihapus lewat halaman Preferensi.
- Hapus akun lewat footer memanggil `DELETE /api/akun`; jangan diuji dengan akun juri.

## 7. Kalau deploy gagal

| Gejala | Kemungkinan penyebab |
| --- | --- |
| Build gagal "Missing ... SUPABASE" atau error saat *Collecting page data* | Variabel Supabase belum diisi / salah nama. Isi lalu Redeploy. |
| Login memantul ke beranda terus | `NEXTAUTH_SECRET` kosong atau `NEXTAUTH_URL` tidak sama dengan domain yang dibuka. |
| `redirect_uri_mismatch` | Bagian 4 belum dilakukan, atau URL salah ketik (harus `/api/auth/callback/google`). |
| Preferensi/rekomendasi kosong atau 500 | `SUPABASE_SERVICE_ROLE_KEY` salah, atau proyek Supabase dijeda (free tier dijeda setelah tidak aktif; buka dashboard dan Resume). |
| Chat selalu "cadangan" | `GEMINI_API_KEY` kosong/salah atau kuota habis. |

Pertanyaan: hubungi farrelzaki. Rujukan teknis: `docs/ARSITEKTUR.md`, `.env.example`.
