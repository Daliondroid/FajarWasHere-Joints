# Arsitektur — _[Nama Proyek]_

> Menjawab: **dengan apa dan dalam bentuk apa sistem dibangun.**
> Keputusan di sini mengikat. Perubahan besar butuh persetujuan pengguna (lihat `AGENTS.md` bagian 6).

Status: **draf**

## 1. Stack

| Lapisan | Pilihan | Versi | Alasan |
| --- | --- | --- | --- |
| Frontend | _[…]_ | _[…]_ | _[…]_ |
| Backend | _[…]_ | _[…]_ | _[…]_ |
| Basis data | _[…]_ | _[…]_ | _[…]_ |
| Styling | _[…]_ | _[…]_ | _[…]_ |
| Test | _[…]_ | _[…]_ | _[…]_ |
| Hosting | _[…]_ | — | _[…]_ |

Versi diverifikasi ke registry resmi saat scaffolding, bukan dari ingatan.

**Sengaja tidak dipakai:** _[teknologi yang dipertimbangkan dan ditolak, beserta alasannya]_

## 2. Gambaran Sistem

```
[Klien] ──> [API / Server] ──> [Basis data]
```

_[Ganti dengan diagram nyata: komponen, alur data, layanan eksternal.]_

## 3. Struktur Kode

<!-- Isi setelah scaffolding. Jelaskan tanggung jawab tiap folder. -->

```
src/
  ...
tests/
```

Aturan batas: _[mis. UI hanya bicara ke backend lewat endpoint di bagian 4; logika murni di folder services/lib dan wajib dites]_

## 4. Kontrak API

Status: **draf — belum disepakati.** Setelah disepakati, kontrak dibekukan.

Aturan perubahan setelah beku:

1. Ubah hanya dengan persetujuan pengguna.
2. Dalam commit tersendiri, tidak dicampur perubahan fitur.
3. Menambah field opsional itu murah; mengganti nama/menghapus field itu mahal.

| Endpoint | Fitur | Masukan | Keluaran |
| --- | --- | --- | --- |
| `GET /api/…` | F-01 | _[…]_ | _[…]_ |

## 5. Konvensi

| Hal | Konvensi |
| --- | --- |
| Penamaan field JSON / kolom DB | _[snake_case / camelCase]_ |
| Format galat | _[mis. HTTP status + `{ "message": "..." }`]_ |
| Format tanggal/waktu | _[mis. ISO 8601, UTC]_ |
| Bahasa teks antarmuka | _[…]_ |
| Variabel lingkungan | `.env` (tidak di-commit), contoh di `.env.example` |

## 6. Strategi Test

- **Wajib dites:** logika murni dan aturan bisnis, bentuk respons endpoint.
- **Tidak wajib:** _[mis. komponen UI murni tampilan]_

## 7. Keputusan Terbuka

Jangan diputuskan agen sendiri; tanyakan pemiliknya.

| Kode | Pertanyaan | Pemilik |
| --- | --- | --- |
| TBD-01 | _[…]_ | _[…]_ |

## 8. Risiko Teknis

| Risiko | Mitigasi |
| --- | --- |
| _[…]_ | _[…]_ |
