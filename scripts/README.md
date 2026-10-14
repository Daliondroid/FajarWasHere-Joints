# scripts/

## `impor_data.py` — muat dataset `Data/` ke database

Urutan untuk database baru (Supabase):

1. **Terapkan skema.** Jalankan `supabase/migrations/20261015000000_skema_awal.sql`, lewat salah satu cara:
   - Supabase Dashboard → SQL Editor → tempel isi file → Run, atau
   - `psql "$SUPABASE_DB_URL" -f supabase/migrations/20261015000000_skema_awal.sql`
2. **Ubah dataset jadi CSV per tabel** (hanya Python standard library):

   ```bash
   python scripts/impor_data.py            # keluaran: build/impor/ (di-gitignore)
   ```

   Skrip berhenti dengan `GAGAL: ...` bila ada kunci yang tidak cocok, dan mencetak
   jumlah prodi per klaster dibandingkan PRD.
3. **Muat CSV** dari dalam folder keluaran (butuh `psql`):

   ```bash
   cd build/impor && psql "$SUPABASE_DB_URL" -f muat.sql
   ```

   Tanpa `psql` terpasang, pakai Docker:

   ```bash
   docker run --rm -v "$PWD/build/impor:/impor" -w /impor postgres:17 psql "$SUPABASE_DB_URL" -f muat.sql
   ```

`SUPABASE_DB_URL` diambil dari Supabase Dashboard → Connect → **Session pooler** (IPv4), bentuknya
`postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres`.
Simpan di `.env`, jangan di-commit.

`muat.sql` berjalan dalam satu transaksi: jika satu tabel gagal, tidak ada yang tersimpan.
Skrip ini untuk database **kosong**; memuat ulang ke tabel yang sudah berisi akan gagal karena kunci ganda.

## Data tambahan untuk impor

- `Data/klaster.csv` — 9 klaster (PRD bagian 5).
- `Data/rumpun_klaster.csv` — pemetaan 78 rumpun ke klaster. Hasilnya sama persis dengan jumlah per klaster di PRD.
- 237 prodi kependidikan tanpa `rumpun_id` di `ak_prodi_master.csv` dipetakan lewat nama rumpun ke `edu:*`
  di `rumpun_riasec.csv`, sehingga semua prodi punya rumpun dan soal rumpun.
