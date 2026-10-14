# Audit Dataset ArahKuliah — 14 Okt 2026

## Integritas (LULUS)
- 5.150 prodi, 146 PTN. Tidak ada id_prodi ganda; semua id cocok antar file (master, snbp, snbt, pddikti).
- Semua prodi punya rumpun, profil RIASEC, mapel pendukung, dan soal kompetensi (spesifik 1.862 + umum 3.288).
- Soal: tidak ada kunci rusak, opsi kosong, atau opsi kembar; sebaran kunci A/B/C/D seimbang.

## Celah yang ditemukan & perbaikannya
| # | Celah | Dampak | Status |
|---|---|---|---|
| 1 | Nama provinsi beda format di 5 file ("Jakarta Raya" vs "Prov. D.K.I. Jakarta" vs "DKI Jakarta"); peminat SNBT memakai 34 provinsi lama, data sekolah memakai 38 provinsi (pemekaran Papua 2022) | Aturan "1 prodi wajib satu provinsi" bisa salah total | **Diperbaiki**: `ak_provinsi_crosswalk.csv` (nama kanonik + kode BPS + provinsi induk sebelum pemekaran). Selalu join lewat file ini. |
| 2 | Akreditasi prodi campur skema lama (A/B/C) dan baru (Unggul/Baik Sekali/Baik/Sementara) | Filter & skor akreditasi tidak konsisten | **Diperbaiki**: `ak_akreditasi_map.csv` (skor 0–4). |
| 3 | SNBP: diterima > daya tampung di 3.134 sel tahun-prodi (mis. PDH USK 2022: dt 55, diterima 70) | Bukan error; PTN menambah kuota saat seleksi | Pakai `diterima/peminat` untuk peluang, jangan `daya_tampung/peminat`. |
| 4 | 212 prodi tanpa histori sama sekali (194 berstatus prodi baru); 203 tanpa estimasi skor UTBK | Peluang tidak bisa dihitung | Fallback: rata-rata rumpun yang sama di PTN yang sama, label "data terbatas". |
| 5 | Sekolah: 1.192 tanpa akreditasi + 214 "Tidak Terakreditasi" (kuota 5%); 3.580 sekolah kuota 0 karena belum mengisi PDSS | Eligibilitas tidak pasti | Tampilkan "sekolah belum mengisi PDSS — perkiraan dari persen kuota". |
| 6 | PDDikti: provinsi Univ. Borneo Tarakan masih Kalimantan Timur (data lama, seharusnya Kaltara) | Lokasi salah 16 prodi | Gunakan provinsi dari ptn.csv (SNPMB), bukan PDDikti. |
| 7 | PDDikti: 2.457 prodi tanpa teks kompetensi, 2.283 tanpa deskripsi, 1.522 tanpa masa studi, 2.839 tanpa koordinat prodi | Kartu profil tidak lengkap | Kartu menampilkan field yang ada saja; koordinat pakai ptn.csv. |
| 8 | 12 kab/kota & 13 sekolah tanpa koordinat (semuanya luar negeri) | — | Abaikan jarak untuk sekolah luar negeri. |
| 9 | `ak_soal_spesifik_prodi_ptn.csv` (versi 1) masih ada | Bisa terimpor ganda | Hapus; pakai `_v2`. |

## Data yang MEMANG belum ada (tidak tersedia publik)
1. Bobot komponen SNBP per PTN (rapor vs mapel pendukung vs prestasi) — ditetapkan tiap PTN, tidak dipublikasikan seragam.
2. Rubrik/bobot prestasi & sertifikat (tingkat lomba) — perlu daftar lomba terkurasi (mis. Puspresnas/Kemendikdasmen) + bobot buatan tim.
3. Ambang/distribusi nilai rapor diterima per prodi.
4. Rumus koreksi rapor oleh TKA.
5. Konversi skor try-out bimbel → skala UTBK.
6. Peminat & diterima 2026 (endpoint SNPMB baru sampai 2025).
7. UKT per prodi (tiap PTN format sendiri).
8. Rekam jejak alumni nyata per sekolah (dipakai data sintetis).
