# Dataset Cocokin! (Hackathon JOINTS UGM 2026)

Dikumpulkan 14 Okt 2026. Semua angka resmi berasal dari portal SNPMB (snpmb.id). Data yang berupa **estimasi** atau **sintetis** diberi label jelas di nama kolom/file.

## 1. Data resmi SNPMB (diambil dari endpoint publik snpmb.id lewat browser)

> File utama memakai awalan `ak_` (mis. `ak_prodi_master.csv`); nama file di dokumen ini sesuai nama di folder. Gunakan nama apa adanya.

| File | Baris | Isi | Dipakai untuk |
|---|---|---|---|
| `ak_ptn.csv` | 146 | Meta PTN: id, kode, nama, jenis (akademik/vokasi), PTN-BH, PTKIN, web, alamat, provinsi, kota, **lat/lon** (OSM Nominatim), ikut SNBP/SNBT (Universitas Terbuka hanya SNBP) | Peta, filter provinsi (aturan SNBP), jarak |
| `ak_snbp_prodi.csv` | ±5.140 | Per prodi: daya tampung 2026, daya tampung/peminat/**diterima** 2021–2025, jenjang, portofolio | Mesin peluang SNBP (rasio diterima/peminat) |
| `ak_snbt_prodi.csv` | ±5.140 | Per prodi: daya tampung 2026, daya tampung & peminat 2021–2025, portofolio | Keketatan SNBT, tren peminat |
| `ak_snbt_peminat_provinsi.csv` | ±261.000 | Peminat SNBT per prodi × tahun × provinsi asal | Persaingan dari provinsi siswa |
| `ak_sekolah_kuota_snbp_2026.csv` | ±42.600 | Seluruh SMA/SMK/MA: NPSN, **akreditasi**, persen kuota, kuota siswa eligible per jurusan, kab/kota, provinsi, lat/lon kab | Input akreditasi & kuota eligible, jarak sekolah→kampus |
| `ak_kabupaten_kota.csv` | 526 | Kode & nama kab/kota SNPMB + centroid lat/lon | Hitung jarak (haversine) |
| `aturan_seleksi_2026.json` | – | Aturan SNBP/SNBT 2026 (kuota akreditasi, komponen nilai, pilihan prodi, portofolio, konsekuensi) | Config mesin aturan |
| `mapel_pendukung_snbp.csv` | 59 | Rumpun prodi → mapel pendukung (Kepmendikdasmen 102/M/2025) | Komponen ke-2 SNBP |

## 2. Data turunan (dibangun dari data resmi + sumber tervalidasi)

| File | Isi | Metode |
|---|---|---|
| `ak_prodi_master.csv` | ±5.150 baris, satu baris per prodi (SNBP ∪ SNBT): rumpun, **vektor RIASEC 6 dimensi + kode Holland**, mapel pendukung, statistik SNBP (rasio diterima 2025 & rata-rata 3 tahun), statistik SNBT (keketatan 2025, tren 3 tahun), **est_skor_utbk** (+ rentang) | Lihat bagian 4 |
| `rumpun_riasec.csv` | 78 rumpun prodi → profil RIASEC (skala O*NET OI 1–7) | Rata-rata Interest O*NET dari 1–4 okupasi representatif |
| `onet_rumpun_okupasi.csv` | Okupasi O*NET (SOC) per rumpun + skor RIASEC asli | O*NET 30.0 `Interests.txt` (CC BY 4.0) |
| `classify.py`, `families.json` | Pengklasifikasi nama prodi → rumpun (regex, cakupan 100% dari 1.317 nama unik) | Bisa dijalankan ulang tiap tahun |

## 3. Form minat (hobi & minat) — instrumen tervalidasi

* `form_minat_riasec_items.csv` – 60 item **O*NET Interest Profiler Short Form** (kolom `mini_ip_30=1` = 30 item **Mini-IP**), sudah diterjemahkan & diadaptasi ke bahasa Indonesia, urutan tampil berselang R-I-A-S-E-C.
* `form_minat_config.json` – skala jawaban 5 poin, penskoran, cek kualitas, bagian hobi (pelengkap, bobot ≤20%), mapel favorit, metode pencocokan (Pearson profil + C-index Brown & Gore), bukti validitas.
* `skoring_referensi.py` – implementasi referensi skor minat, kode Holland, kecocokan, C-index, peluang SNBT.

Kenapa RIASEC/O*NET: model Holland adalah teori minat karier paling banyak diteliti; Mini-IP 30 item punya alpha .74–.81 dan korelasi .95–.96 dengan versi 60 item, serta mereproduksi struktur heksagonal RIASEC (Rounds dkk., 2016). Lisensi CC BY 4.0 sehingga boleh diterjemahkan/diadaptasi dengan atribusi. Kecocokan minat–lingkungan studi terbukti memprediksi prestasi & ketekunan (Nye dkk., 2012). Adaptasi CABIN-NET (instrumen O*NET) versi Indonesia (UMM, 2026) melaporkan reliabilitas >.70 dan validitas konvergen dengan O*NET IP. **Sebelum klaim "tervalidasi untuk siswa Indonesia", lakukan pilot ±100–200 siswa SMA** (alpha per skala, korelasi antarskala mengikuti heksagon) sesuai ITC Guidelines for Translating and Adapting Tests (2017).

## 4. Data ESTIMASI & SINTETIS (wajib diberi label di UI)

* `est_skor_utbk` di `ak_prodi_master.csv` – **tidak ada data resmi skor UTBK per prodi**. Model: rata-rata skor UTBK kampus (20 PTN akademik & 20 politeknik teratas, `utbk_anchor_kampus.csv`) diregresikan terhadap log keketatan SNBT rata-rata kampus (akademik: skor = 410,5 + 78,0·ln(keketatan), r = 0,67; vokasi: 427,4 + 44,5·ln, r = 0,75). Kampus tanpa anchor memakai prediksi regresi; skor prodi = skor kampus + 0,5·b·(ln keketatan prodi − rata-rata ln kampus), dibatasi 380–780, rentang ±35. Gunakan sebagai *perkiraan kasar*.
* `utbk_nasional_2025.csv` – min/rerata/maks nasional per jenjang 2025 (rilis konferensi pers SNBT 2025).
* `ak_alumni_sintetis_snbp.csv` – **SINTETIS**. Rekam jejak alumni per sekolah tidak tersedia publik. Dibangkitkan untuk 300 sekolah (150 A, 100 B, 50 C) × 2023–2025, peluang diterima ∝ rasio diterima prodi 2025 × faktor akreditasi × nilai rapor; IPK tahun-1 sintetis. Hanya untuk demo; ganti dengan data BK sekolah mitra bila ada.
* `bank_soal_simulasi.csv` – 269 soal orisinal (35 bergaya 7 subtes UTBK + 234 soal "cicip jurusan" untuk 78 rumpun, 3 soal/rumpun). Bukan soal resmi.


## 6. Data PDDikti (Kemdiktisaintek) — per prodi per kampus

Diambil dari API publik pddikti.kemdiktisaintek.go.id (14 Okt 2026). 4.915 dari 5.150 prodi SNPMB (95%) berhasil dicocokkan ke PDDikti. Sisanya (sebagian besar Univ. Sulawesi Barat, Bangka Belitung, Maritim Raja Ali Haji) tidak tercantum lengkap di PDDikti.

| File | Isi |
|---|---|
| `ak_pddikti_prodi.csv` | id_prodi SNPMB ↔ prodi PDDikti: akreditasi (4.720 prodi), akreditasi internasional, jumlah dosen & mahasiswa, rasio dosen:mahasiswa, rata-rata masa studi (3.628 prodi), tanggal berdiri, provinsi & kab/kota **lokasi prodi** (menyelesaikan kasus PSDKU di luar provinsi induk), lat/lon prodi (2.311), website |
| `ak_profil_prodi_ptn.json` | Per prodi per kampus: deskripsi, visi, misi, daftar kompetensi lulusan & capaian pembelajaran (teks resmi, dibersihkan) — untuk kartu profil di Halaman Cocokin (8) dan Test Drive (13), serta grounding Gemini |
| `ak_soal_spesifik_prodi_ptn_v2.csv` | 2.424 soal **khusus per prodi per kampus** untuk 1.862 prodi, dibangkitkan otomatis dari teks kompetensi/capaian PDDikti; pengecoh diambil dari prodi bidang ilmu lain. Status `otomatis_perlu_review`. (Versi 1 sudah dihapus.) |
| `ak_soal_umum_prodi.csv` | 9.663 soal kompetensi umum untuk 3.288 prodi sisanya, diambil dari prodi sama di kampus lain. |
| `alias_pencarian.csv` | 110 singkatan prodi & kampus (TI, DKV, FK, HI, UGM, UNAIR, POLBAN, …) untuk pencarian di Katalog Test Drive (12) |

### Struktur Test Drive (Halaman 13, per prodi per kampus)
1. **Soal spesifik kampus** (`ak_soal_spesifik_prodi_ptn_v2.csv`, 1–2 soal) — bila tersedia; jika tidak, **soal kompetensi umum** (`ak_soal_umum_prodi.csv`).
2. **Soal rumpun** (`bank_soal_simulasi.csv`, 3 soal per rumpun × 78 rumpun = 234 + 35 soal gaya UTBK) — tersedia untuk SEMUA prodi lewat kolom `rumpun_id` di `ak_prodi_master.csv` (237 prodi kependidikan dipetakan lewat nama rumpun saat impor, lihat `scripts/README.md`).
3. **Kartu profil prodi** (`ak_profil_prodi_ptn.json` + `ak_pddikti_prodi.csv`): akreditasi, rasio dosen, masa studi, kompetensi lulusan.
4. Pertanyaan refleksi "seru atau berat?" → memperbarui skor kecocokan.

Isi kurikulum inti satu prodi relatif seragam secara nasional (standar SN-Dikti), jadi soal rumpun sudah mewakili "rasa kuliah"; pembeda antarkampus diambil dari kompetensi/kekhasan resmi masing-masing kampus.

## 5. Sumber
* SNPMB: snpmb.id/snbp/informasi-umum, /snbp/kuota-sekolah, /snbp/daya-tampung-snbp, /utbk-snbt/informasi-umum, /utbk-snbt/daya-tampung-snbt
* O*NET Resource Center: Interest Profiler Short Form & Mini-IP (onetcenter.org/IPSF.html; reports/Mini-IP.html), database 30.0 Interests.txt
* Kepmendikdasmen 102/M/2025 (mapel pendukung) – rekap Ruangguru & detik.com
* Kompas.com 15/04/2026 "Cek Rata-rata Nilai Tertinggi hingga Terendah di UTBK SNBT 2023–2025"; Ruangguru "Data Statistik UTBK-SNBT 2025"
* Nye, Su, Rounds & Drasgow (2012), Perspectives on Psychological Science 7(4); Brown & Gore (1994) C-index; ITC Guidelines (2017); Putri (2026) Adaptasi CABIN-NET versi Indonesia, UMM
* PDDikti Kemdiktisaintek: pddikti.kemdiktisaintek.go.id (API publik detail PT & prodi)
* OpenStreetMap Nominatim (geokode PTN & kab/kota, © OpenStreetMap contributors, ODbL)
