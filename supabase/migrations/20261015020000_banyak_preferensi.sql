-- T-18: banyak preferensi per akun (PRD 2.2: F-18, F-19, BR-16, BR-17, BR-18, K-04, K-08).
-- Tabel preferensi, profil_akademik, riwayat_to masih kosong saat migrasi ini dibuat (2026-10-15),
-- sehingga dibuat ulang tanpa konversi data.

drop table if exists riwayat_to;
drop table if exists profil_akademik;
drop table if exists preferensi;

-- Satu akun boleh punya banyak preferensi; tepat satu aktif (BR-16); satu jalur per preferensi (BR-17).
create table preferensi (
  id                uuid primary key default gen_random_uuid(),
  pengguna_id       uuid not null references pengguna (id) on delete cascade,
  nama              text not null check (char_length(btrim(nama)) between 1 and 40),
  jalur             text not null check (jalur in ('snbp', 'snbt')),
  aktif             boolean not null default false,
  mode_minat        text not null default 'mini_ip_30' check (mode_minat in ('mini_ip_30', 'ipsf_60')),
  jawaban_minat     jsonb not null default '{}', -- {"IP01": 0..4}
  skor_riasec       jsonb not null,              -- {"R": 1..7, ...} dihitung server
  kode_holland      char(3) not null,
  chip_hobi         text[] not null default '{}',
  mapel_favorit     text[] not null default '{}' check (cardinality(mapel_favorit) <= 3),
  tahun_lulus       smallint,
  pernah_lulus_snbp boolean not null default false,
  dibuat_pada       timestamptz not null default now(),
  diperbarui_pada   timestamptz not null default now()
);

create unique index preferensi_nama_unik on preferensi (pengguna_id, lower(btrim(nama)));
create unique index preferensi_satu_aktif on preferensi (pengguna_id) where aktif;
create index preferensi_pengguna_idx on preferensi (pengguna_id, diperbarui_pada desc);

-- Bahan SNBP (Hal. 5–6), satu per preferensi SNBP. Alamat tidak disimpan; kab/kota dari sekolah (BR-14).
-- Kolom alumni_tidak_daftar_ulang dihapus (K-04). nilai_tka memuat 3 mapel wajib + 2 mapel pilihan (BR-18).
create table profil_akademik (
  preferensi_id         uuid primary key references preferensi (id) on delete cascade,
  npsn                  char(8) references sekolah (npsn),
  jurusan_sekolah       text,
  kode_kab              text references kabupaten_kota (kode_kab),
  rapor_rata            numeric(5, 2) check (rapor_rata between 0 and 100),
  nilai_mapel_pendukung jsonb not null default '{}', -- {"Biologi": 90}
  peringkat_paralel     integer check (peringkat_paralel > 0),
  jumlah_siswa_jurusan  integer check (jumlah_siswa_jurusan > 0),
  nilai_tka             jsonb not null default '{}', -- {"bahasa_indonesia": .., "pilihan": [{"mapel": .., "nilai": ..}]}
  prestasi              jsonb not null default '[]', -- [{"tingkat": .., "bidang": .., "peringkat": ..}]
  reputasi_alumni       text check (reputasi_alumni in ('langganan_ptn_top', 'rutin_lolos', 'satu_lima_per_tahun', 'sekolah_baru')),
  kampus_alumni         integer[] not null default '{}', -- id_ptn
  diperbarui_pada       timestamptz not null default now()
);

-- Bahan SNBT (Hal. 7): riwayat try out per preferensi SNBT.
create table riwayat_to (
  id            bigint generated always as identity primary key,
  preferensi_id uuid not null references preferensi (id) on delete cascade,
  tanggal       date not null,
  sumber_to     text,
  skala         text not null default 'tidak_tahu' check (skala in ('irt_200_1000', 'bimbel', 'tidak_tahu')),
  skor_pu       numeric(6, 2),
  skor_ppu      numeric(6, 2),
  skor_pbm      numeric(6, 2),
  skor_pk       numeric(6, 2),
  skor_lit_ind  numeric(6, 2),
  skor_lit_ing  numeric(6, 2),
  skor_pm       numeric(6, 2)
);

create index riwayat_to_preferensi_idx on riwayat_to (preferensi_id, tanggal);

-- Simulasi tanpa rating/refleksi (K-08).
alter table riwayat_test_drive drop column if exists refleksi;

-- RLS aktif tanpa policy, sama seperti tabel lain: akses hanya lewat server (service role).
alter table preferensi enable row level security;
alter table profil_akademik enable row level security;
alter table riwayat_to enable row level security;

-- Pindahkan status aktif secara atomik. false bila preferensi bukan milik pengguna.
create or replace function aktifkan_preferensi(p_pengguna uuid, p_preferensi uuid)
returns boolean
language plpgsql
set search_path = public
as $$
begin
  if not exists (select 1 from preferensi where id = p_preferensi and pengguna_id = p_pengguna) then
    return false;
  end if;
  update preferensi set aktif = false where pengguna_id = p_pengguna and aktif and id <> p_preferensi;
  update preferensi set aktif = true where id = p_preferensi;
  return true;
end;
$$;

-- Hapus preferensi; bila yang dihapus aktif, preferensi lain yang terakhir diperbarui menjadi aktif (BR-16).
create or replace function hapus_preferensi(p_pengguna uuid, p_preferensi uuid)
returns boolean
language plpgsql
set search_path = public
as $$
declare
  v_aktif boolean;
  v_pengganti uuid;
begin
  delete from preferensi where id = p_preferensi and pengguna_id = p_pengguna returning aktif into v_aktif;
  if not found then
    return false;
  end if;
  if v_aktif then
    select id into v_pengganti from preferensi where pengguna_id = p_pengguna order by diperbarui_pada desc limit 1;
    if v_pengganti is not null then
      update preferensi set aktif = true where id = v_pengganti;
    end if;
  end if;
  return true;
end;
$$;

-- Simpan satu dokumen preferensi (preferensi + profil_akademik + riwayat_to) dalam satu transaksi.
-- p_id null = buat baru (otomatis aktif); selain itu perbarui milik pengguna (jalur tidak diubah).
-- Mengembalikan id, atau null bila p_id bukan milik pengguna.
create or replace function simpan_preferensi(p_pengguna uuid, p_id uuid, p_pref jsonb, p_profil jsonb, p_to jsonb)
returns uuid
language plpgsql
set search_path = public
as $$
declare
  v_id uuid;
  r preferensi;
begin
  r := jsonb_populate_record(null::preferensi, p_pref);
  if p_id is null then
    insert into preferensi (pengguna_id, nama, jalur, mode_minat, jawaban_minat, skor_riasec, kode_holland,
                            chip_hobi, mapel_favorit, tahun_lulus, pernah_lulus_snbp)
    values (p_pengguna, btrim(r.nama), r.jalur, r.mode_minat, r.jawaban_minat, r.skor_riasec, r.kode_holland,
            r.chip_hobi, r.mapel_favorit, r.tahun_lulus, r.pernah_lulus_snbp)
    returning id into v_id;
    perform aktifkan_preferensi(p_pengguna, v_id);
  else
    update preferensi
       set nama = btrim(r.nama), mode_minat = r.mode_minat, jawaban_minat = r.jawaban_minat,
           skor_riasec = r.skor_riasec, kode_holland = r.kode_holland, chip_hobi = r.chip_hobi,
           mapel_favorit = r.mapel_favorit, tahun_lulus = r.tahun_lulus, pernah_lulus_snbp = r.pernah_lulus_snbp,
           diperbarui_pada = now()
     where id = p_id and pengguna_id = p_pengguna
    returning id into v_id;
    if v_id is null then
      return null;
    end if;
  end if;

  delete from profil_akademik where preferensi_id = v_id;
  if p_profil is not null and jsonb_typeof(p_profil) = 'object' then
    insert into profil_akademik
    select (jsonb_populate_record(null::profil_akademik,
              p_profil || jsonb_build_object('preferensi_id', v_id, 'diperbarui_pada', now()))).*;
  end if;

  delete from riwayat_to where preferensi_id = v_id;
  insert into riwayat_to (preferensi_id, tanggal, sumber_to, skala, skor_pu, skor_ppu, skor_pbm, skor_pk,
                          skor_lit_ind, skor_lit_ing, skor_pm)
  select v_id, x.tanggal, x.sumber_to, coalesce(x.skala, 'tidak_tahu'), x.skor_pu, x.skor_ppu, x.skor_pbm, x.skor_pk,
         x.skor_lit_ind, x.skor_lit_ing, x.skor_pm
    from jsonb_populate_recordset(null::riwayat_to, coalesce(p_to, '[]'::jsonb)) x;

  return v_id;
end;
$$;

-- Fungsi di schema public bisa dipanggil lewat RPC; RLS tidak melindunginya. Hanya service role.
revoke all on function aktifkan_preferensi(uuid, uuid) from public, anon, authenticated;
revoke all on function hapus_preferensi(uuid, uuid) from public, anon, authenticated;
revoke all on function simpan_preferensi(uuid, uuid, jsonb, jsonb, jsonb) from public, anon, authenticated;
grant execute on function aktifkan_preferensi(uuid, uuid) to service_role;
grant execute on function hapus_preferensi(uuid, uuid) to service_role;
grant execute on function simpan_preferensi(uuid, uuid, jsonb, jsonb, jsonb) to service_role;
