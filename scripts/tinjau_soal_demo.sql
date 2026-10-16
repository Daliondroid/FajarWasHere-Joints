-- T-10 (R-02): hasil tinjauan manual soal Simulasi untuk prodi demo (farrelzaki, 2026-10-16).
-- Prodi demo: 332021 STEI-K ITB, 382020 Teknik Informatika ITS, 361045 Teknologi Informasi UGM,
-- beserta soal rumpun `informatika` dan `sistem_informasi`. Rincian: docs/QA_SOAL_DEMO.md.
--
-- Data/ hanya dibaca, jadi perbaikan disimpan di sini. Jalankan ulang setiap selesai impor ulang dataset:
--   psql "$SUPABASE_DB_URL" -f scripts/tinjau_soal_demo.sql   (atau tempel di Supabase SQL Editor)
-- Skrip idempoten: hanya UPDATE berdasarkan id_soal.

begin;

-- Teknologi Informasi UGM: pengecoh D (telekomunikasi) bisa dianggap benar; A dan C dirapikan.
update soal set
  opsi_a = 'Mampu mengidentifikasi permasalahan dalam pertanian, memilih alternatif solusi berdasarkan kajian teoretis, dan mengimplementasikan dalam pembelajaran',
  opsi_c = 'Menguasai konsep lintas budaya sehingga dapat mengaplikasikannya di lingkup sosial dan pekerjaan',
  opsi_d = 'Merancang program latihan dan pembinaan prestasi olahraga'
where id_soal = 'PT-361045-CAPAIAN';

-- STEI-K ITB.
update soal set
  opsi_a = 'Mampu menginstalasi dan melakukan troubleshooting komputer secara software dan hardware',
  opsi_d = 'Mampu menyusun rencana pemberian pakan ternak ruminansia'
where id_soal = 'GEN-332021-1';

update soal set
  opsi_a = 'Menyelesaikan permasalahan hukum dalam masyarakat',
  opsi_d = 'Menguasai teknik budidaya tanaman hortikultura'
where id_soal = 'GEN-332021-2';

update soal set
  opsi_a = 'Mampu menafsirkan naskah kuno dan sumber sejarah',
  opsi_d = 'Menguasai teknik tata rias dan tata busana panggung'
where id_soal = 'GEN-332021-3';

-- Teknik Informatika ITS.
update soal set
  opsi_c = 'Menguasai prosedur pemeriksaan laboratorium klinik'
where id_soal = 'GEN-382020-3';

-- Soal rumpun: kunci menumpuk di A -> urutan opsi diacak ulang (isi dan jawaban benar tidak berubah).
update soal set opsi_a = 'queue', opsi_b = 'tree', opsi_c = 'stack', opsi_d = 'graph', kunci = 'C'
where id_soal = 'JUR-informatika-2';

update soal set opsi_a = '6', opsi_b = '10', opsi_c = '4', opsi_d = '8', kunci = 'B'
where id_soal = 'JUR-informatika-3';

update soal set opsi_a = 'Histogram', opsi_b = 'Gantt chart', opsi_c = 'Flowchart', opsi_d = 'ERD', kunci = 'D'
where id_soal = 'JUR-sistem_informasi-1';

update soal set opsi_a = 'coding', opsi_b = 'maintenance', opsi_c = 'analisis kebutuhan', opsi_d = 'deployment', kunci = 'C'
where id_soal = 'JUR-sistem_informasi-3';

-- Semua soal prodi demo sudah ditinjau (BR-13: label "soal" tetap, status menandai tinjauan tim).
update soal set status = 'ditinjau_tim'
where id_soal in (
  'PT-361045-CAPAIAN',
  'GEN-332021-1', 'GEN-332021-2', 'GEN-332021-3',
  'GEN-382020-1', 'GEN-382020-2', 'GEN-382020-3',
  'JUR-informatika-1', 'JUR-informatika-2', 'JUR-informatika-3',
  'JUR-sistem_informasi-1', 'JUR-sistem_informasi-2', 'JUR-sistem_informasi-3'
);

commit;
