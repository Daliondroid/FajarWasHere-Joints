-- T-13: selaraskan tabel preferensi dengan kontrak API (docs/ARSITEKTUR.md bagian 4).
-- Mode minat memakai nama di Data/form_minat_config.json; skala jawaban 0..4.
-- Tabel masih kosong saat migrasi ini dibuat (2026-10-15), jadi tidak ada data yang perlu dikonversi.

alter table preferensi drop constraint preferensi_mode_minat_check;
alter table preferensi
  add constraint preferensi_mode_minat_check check (mode_minat in ('mini_ip_30', 'ipsf_60'));

comment on column preferensi.jawaban_minat is '{"IP01": 0..4} (skala form_minat_config.json)';
comment on column preferensi.skor_riasec is '{"R": 1..7, ...} dihitung server dari jawaban_minat';
