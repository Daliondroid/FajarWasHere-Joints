# Cocokin! 🎮🎓

*"Cari yang Cocok, Uji Rasanya, Tembus Kampus Impianmu!"*

Platform web untuk siswa SMA/SMK/MA kelas 12: cek kecocokan jurusan (minat RIASEC/O*NET), estimasi peluang
masuk PTN lewat SNBP/SNBT berbasis data resmi snpmb.id dan PDDikti, serta *Test Drive* 60 detik untuk
merasakan cara berpikir mahasiswa di 5.150 prodi dari 146 PTN. Dibuat untuk Hackathon JOINTS UGM 2026.

**Status:** tahap dokumen dan dataset. Belum ada kode aplikasi.

---

## Dokumen

| File | Isi |
| --- | --- |
| `docs/PRD.md` | Apa yang dibangun: tujuan, fitur (F-xx), aturan bisnis (BR-xx), data, milestone |
| `docs/ARSITEKTUR.md` | Stack (Next.js 15, Tailwind, PostgreSQL/Supabase, Gemini 2.5 Flash), daftar endpoint, konvensi |
| `docs/DESIGN_SYSTEM.md` | Token visual 8-bit pixel × palet Google, komponen, microcopy |
| `docs/referensi/PRD_Cocokin_v2.1.md` | PRD sumber lengkap (13 halaman, rumus skoring, deklarasi AI) |
| `Data/README.md`, `Data/AUDIT_DATA.md` | Penjelasan dan audit dataset |
| `KOLABORASI.md` | Anggota, papan task, aturan Git, log kerja |

## Dataset

Folder `Data/` berisi dataset yang sudah dikumpulkan dan diaudit (14 Okt 2026):

- **Resmi:** snpmb.id (prodi, daya tampung, peminat, diterima, kuota sekolah SNBP 2026), PDDikti (akreditasi,
  profil, kompetensi prodi), Kepmendikdasmen 102/M/2025 (mapel pendukung).
- **Instrumen minat:** O*NET Interest Profiler (CC BY 4.0), diterjemahkan ke Bahasa Indonesia.
- **Estimasi:** skor UTBK per prodi (wajib diberi label di UI).
- **Sintetis:** rekam jejak alumni (hanya untuk demo).
- **Kode referensi:** `Data/kode/skoring_referensi.py`, `Data/kode/classify.py`.

## Menjalankan

Belum tersedia — menunggu scaffolding (task T-02 milik daliondroid di `KOLABORASI.md`).

## Cara Kerja Dengan Agen AI

Repo ini memakai aturan kerja untuk agen AI (Claude Code, Codex, Cursor, Copilot, Gemini/Antigravity):

- `KOLABORASI.md` (di-commit) — anggota (farrelzaki, daliondroid), wilayah file, papan task, aturan Git mode `multi-branch`.
- `AGENTS.md`, `TASK.md`, `PROJECT_STATE.md` (di-gitignore, pribadi) — aturan kerja agen, rincian task, dan catatan antarsesi.
  Anggota baru menyalin ketiga file ini ke root proyek masing-masing setelah clone.

## Atribusi

Instrumen minat dari O*NET Resource Center (CC BY 4.0). Koordinat dari OpenStreetMap Nominatim
(© OpenStreetMap contributors, ODbL). Data seleksi dari snpmb.id dan PDDikti Kemdiktisaintek.
