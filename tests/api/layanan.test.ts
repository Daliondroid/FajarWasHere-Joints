import { describe, expect, it } from 'vitest';
import { layananKecocokan, jumlahMapelCocok } from '@/lib/layanan/kecocokan';
import { layananPeluang, nilaiMapelPendukung } from '@/lib/layanan/peluang';
import { keRingkas, layananDaftarProdi, layananDetailProdi, rumpunCocok, uraiKueri } from '@/lib/layanan/prodi';
import { kuotaJurusan, layananSekolah } from '@/lib/layanan/sekolah';
import { ITEM, jawaban, prodi, repoPalsu, SEKOLAH } from './repo_palsu';

const PTN = [
  { id_ptn: 2, nama: 'UNIVERSITAS INDONESIA' },
  { id_ptn: 3, nama: 'UNIVERSITAS GADJAH MADA' },
];
const ALIAS = [
  { alias: 'UI', jenis: 'ptn' as const, arti: 'UNIVERSITAS INDONESIA' },
  { alias: 'TI', jenis: 'prodi' as const, arti: 'Teknik Informatika / Teknologi Informasi' },
];

describe('/api/school', () => {
  const repo = repoPalsu([]);
  it('cari per NPSN -> detail dengan kuota per jurusan (angka)', async () => {
    const r = await layananSekolah(new URLSearchParams('npsn=20500001'), repo);
    expect(r.data).toMatchObject({ nama: 'SMAN 1 CONTOH', ada_data_pdss: true, label_data: 'resmi' });
    expect((r.data as { jurusan_kuota: unknown }).jurusan_kuota).toEqual([
      { jurusan: 'MIPA', kuota: 40 },
      { jurusan: 'Ilmu Pengetahuan Sosial', kuota: 40 },
    ]);
  });
  it('NPSN tidak ada -> 404; tanpa parameter -> 400', async () => {
    await expect(layananSekolah(new URLSearchParams('npsn=99999999'), repo)).rejects.toMatchObject({ kode: 'TIDAK_DITEMUKAN' });
    await expect(layananSekolah(new URLSearchParams(''), repo)).rejects.toMatchObject({ kode: 'VALIDASI' });
  });
  it('cari per nama -> daftar', async () => {
    const r = await layananSekolah(new URLSearchParams('q=contoh'), repo);
    expect(Array.isArray(r.data) && r.data.length).toBe(1);
  });
  it('kuota jurusan tidak peka huruf besar; sekolah tanpa PDSS -> null', () => {
    expect(kuotaJurusan(SEKOLAH, 'mipa')).toBe(40);
    expect(kuotaJurusan(SEKOLAH, 'Bahasa')).toBeNull();
    expect(kuotaJurusan({ ...SEKOLAH, kuota_siswa: 0 }, 'MIPA')).toBeNull();
  });
});

describe('/api/prodi', () => {
  it('uraiKueri: alias PTN jadi pembatas, alias prodi diganti artinya', () => {
    expect(uraiKueri('TI UI', ALIAS, PTN)).toMatchObject({
      teks_prodi: ['Teknik Informatika', 'Teknologi Informasi'],
      id_ptn_alias: [2],
      id_ptn_teks: [],
    });
  });
  it('uraiKueri: teks bebas dicari di nama prodi atau nama PTN', () => {
    expect(uraiKueri('gadjah', ALIAS, PTN)).toMatchObject({ teks_prodi: ['gadjah'], id_ptn_teks: [3], id_ptn_alias: [] });
  });
  it('nama PTN di teks bebas dikenali sebagai filter PTN (lengkap atau inti)', () => {
    const ptn = [
      { id_ptn: 111, nama: 'UNIVERSITAS SYIAH KUALA' },
      { id_ptn: 2, nama: 'UNIVERSITAS INDONESIA' },
      { id_ptn: 3, nama: 'UNIVERSITAS GADJAH MADA' },
    ];
    expect(uraiKueri('Kedokteran Hewan Universitas Syiah Kuala', [], ptn)).toMatchObject({ teks_prodi: ['kedokteran hewan'], id_ptn_alias: [111], ada_alias_ptn: true });
    expect(uraiKueri('teknik sipil gadjah mada', [], ptn)).toMatchObject({ teks_prodi: ['teknik sipil'], id_ptn_alias: [3] });
    expect(uraiKueri('Universitas Syiah Kuala', [], ptn)).toMatchObject({ teks_prodi: [], id_ptn_alias: [111] });
    // Inti satu kata yang umum ("indonesia") tidak dianggap nama PTN.
    expect(uraiKueri('Pendidikan Bahasa Indonesia', [], ptn)).toMatchObject({ teks_prodi: ['Pendidikan Bahasa Indonesia'], id_ptn_alias: [] });
    expect(uraiKueri('Ilmu Hukum Universitas Indonesia', [], ptn)).toMatchObject({ teks_prodi: ['ilmu hukum'], id_ptn_alias: [2] });
  });

  it('teks pencarian juga cocok ke nama rumpun', () => {
    const rumpun = new Map([['kedokteran_hewan', 'Kedokteran Hewan'], ['hukum', 'Ilmu Hukum']]);
    expect(rumpunCocok(['kedokteran hewan'], rumpun)).toEqual(['kedokteran_hewan']);
    expect(rumpunCocok(['abc'], rumpun)).toEqual([]);
  });

  it('alias PTN tanpa PTN cocok -> hasil kosong', async () => {
    const r = await layananDaftarProdi(new URLSearchParams('q=ITX'), repoPalsu([prodi({ id_prodi: 1 })]));
    expect(r).toMatchObject({ data: [], total: 0 });
  });
  it('ringkas: keketatan berlabel, SNBT = daya tampung ÷ peminat, est UTBK berlabel estimasi', () => {
    const r = keRingkas(prodi({ id_prodi: 1 }));
    expect(r.keketatan_snbp).toMatchObject({ rasio: 0.2, label: 'sedang', data_terbatas: false });
    expect(r.keketatan_snbt).toMatchObject({ rasio: 0.1, label: 'ketat' });
    expect(r.est_skor_utbk).toMatchObject({ nilai: 600, label_data: 'estimasi' });
  });
  it('detail prodi baru memakai fallback rumpun (BR-08)', async () => {
    const repo = repoPalsu([
      prodi({ id_prodi: 1, rasio_terima_snbp_2025: null, est_skor_utbk: null, is_baru: true }),
      prodi({ id_prodi: 2, rasio_terima_snbp_2025: 0.1, est_skor_utbk: 620 }),
      prodi({ id_prodi: 3, rasio_terima_snbp_2025: 0.3, est_skor_utbk: 580 }),
    ]);
    const { data } = await layananDetailProdi('1', repo);
    expect(data.keketatan_snbp).toMatchObject({ data_terbatas: true });
    expect(data.keketatan_snbp!.rasio).toBeCloseTo(0.2);
    expect(data.est_skor_utbk).toMatchObject({ nilai: 600, metode: 'rata_rumpun_ptn' });
    expect(data.mapel_pendukung_snbp).toEqual(['Fisika', 'Matematika Tingkat Lanjut']);
  });
  it('detail: id bukan angka -> 400, tidak ada -> 404', async () => {
    await expect(layananDetailProdi('abc', repoPalsu([]))).rejects.toMatchObject({ kode: 'VALIDASI' });
    await expect(layananDetailProdi('9', repoPalsu([]))).rejects.toMatchObject({ kode: 'TIDAK_DITEMUKAN' });
  });
});

describe('/api/peluang', () => {
  const lokal = prodi({ id_prodi: 1, kode_bps_ptn: '35' }); // Jawa Timur, sama dengan sekolah
  const luar = prodi({ id_prodi: 2, kode_bps_ptn: '34', nama_ptn: 'UGM' });
  const luar2 = prodi({ id_prodi: 3, kode_bps_ptn: '32', nama_ptn: 'ITB' });
  const repo = repoPalsu([lokal, luar, luar2]);
  const profil = {
    tahun_lulus: 2026,
    npsn: '20500001',
    jurusan_sekolah: 'MIPA',
    peringkat_paralel: 5,
    rapor_rata: 90,
    nilai_mapel_pendukung: { Fisika: 92, 'Matematika Tingkat Lanjut': 88, Biologi: 70 },
    skor_to: 620,
  };

  it('keduanya: SNBP dan SNBT dihitung, kuota dari data resmi sekolah', async () => {
    const r = await layananPeluang({ jalur: 'keduanya', id_prodi: [1, 2], profil }, repo);
    expect(r.validasi_provinsi_snbp?.valid).toBe(true);
    expect(r.sekolah).toMatchObject({ kuota_jurusan: 40, sumber_kuota: 'resmi' });
    expect(r.hasil[0].snbp).toMatchObject({ dihitung: true, estimasi: true });
    expect(r.hasil[0].snbp!.alasan).toHaveLength(3);
    expect(r.hasil[0].snbt).toMatchObject({ dihitung: true, peringatan_skala: true });
  });

  it('dua pilihan SNBP di luar provinsi sekolah -> melanggar', async () => {
    const r = await layananPeluang({ jalur: 'snbp', id_prodi: [2, 3], profil }, repo);
    expect(r.validasi_provinsi_snbp).toMatchObject({ valid: false, pesan: 'Melanggar aturan provinsi SNBP!' });
    expect(r.hasil[0].snbt).toBeNull();
  });

  it('di luar kuota eligible -> SNBP tidak dihitung, SNBT tetap', async () => {
    const r = await layananPeluang({ jalur: 'keduanya', id_prodi: [1], profil: { ...profil, peringkat_paralel: 41 } }, repo);
    expect(r.hasil[0].snbp).toMatchObject({ dihitung: false });
    expect(r.hasil[0].snbp!.pesan).toContain('fokus ke SNBT');
    expect(r.hasil[0].snbt!.dihitung).toBe(true);
  });

  it('lulusan 2025 tidak bisa SNBP (BR-11)', async () => {
    const r = await layananPeluang({ jalur: 'keduanya', id_prodi: [1], profil: { ...profil, tahun_lulus: 2025 } }, repo);
    expect(r.validasi_jalur.boleh_snbp).toBe(false);
    expect(r.hasil[0].snbp).toMatchObject({ dihitung: false });
    expect(r.hasil[0].snbt!.dihitung).toBe(true);
  });

  it('data siswa kurang -> pesan jelas, bukan galat', async () => {
    const r = await layananPeluang({ jalur: 'keduanya', id_prodi: [1], profil: { tahun_lulus: 2026 } }, repo);
    expect(r.hasil[0].snbp!.pesan).toContain('rapor');
    expect(r.hasil[0].snbt!.pesan).toContain('try out');
    expect(r.sekolah).toBeNull();
  });

  it('prodi atau sekolah tidak ada -> 404', async () => {
    await expect(layananPeluang({ jalur: 'snbt', id_prodi: [1, 99], profil }, repo)).rejects.toMatchObject({ kode: 'TIDAK_DITEMUKAN' });
    await expect(
      layananPeluang({ jalur: 'snbp', id_prodi: [1], profil: { ...profil, npsn: '99999999' } }, repo),
    ).rejects.toMatchObject({ kode: 'TIDAK_DITEMUKAN' });
  });

  it('reputasi alumni + PTN tujuan di kampus alumni menaikkan peluang SNBP (BR-06)', async () => {
    const dasar = await layananPeluang({ jalur: 'snbp', id_prodi: [1], profil }, repo);
    const alumni = await layananPeluang(
      { jalur: 'snbp', id_prodi: [1], profil: { ...profil, reputasi_alumni: 'langganan_ptn_top', kampus_alumni: [lokal.id_ptn] } },
      repo,
    );
    expect(alumni.hasil[0].snbp!.rincian.skor_posisi! - dasar.hasil[0].snbp!.rincian.skor_posisi!).toBeCloseTo(5);
  });

  it('nilai mapel pendukung: rata-rata maks 2 mapel prodi', () => {
    expect(nilaiMapelPendukung('Fisika; Matematika Tingkat Lanjut', { fisika: 92, 'Matematika Tingkat Lanjut': 88 })).toBe(90);
    expect(nilaiMapelPendukung('Biologi; Kimia', { Fisika: 92 })).toBeNull();
  });
});

describe('/api/kecocokan', () => {
  const minatI = jawaban({ R: 2, I: 4, A: 0, S: 1, E: 0, C: 3 });
  const repo = repoPalsu([
    prodi({ id_prodi: 1, r: 2, i: 2, a: 6, s: 5, e: 3, c: 1, kode_holland: 'ASE' }),
    prodi({ id_prodi: 2, r: 4, i: 6.5, a: 1.5, s: 2, e: 1.5, c: 5, kode_holland: 'ICR', mapel_pendukung_snbp: 'Fisika; Kimia' }),
    prodi({ id_prodi: 3, r: 4, i: 6.5, a: 1.5, s: 2, e: 1.5, c: 5, kode_holland: 'ICR', mapel_pendukung_snbp: 'Biologi; Kimia' }),
  ]);

  it('profil siswa dan prodi terurut; seri dipecah mapel favorit', async () => {
    const r = await layananKecocokan({ jawaban_minat: minatI, mapel_favorit: ['Biologi'] }, repo);
    expect(r.kode_holland).toBe('ICR');
    expect(r.total_dibandingkan).toBe(3);
    expect(r.hasil.map((h) => h.id_prodi)).toEqual([3, 2, 1]);
    expect(r.hasil[0]).toMatchObject({ mapel_favorit_cocok: 1, c_index: 18, label: 'Sangat cocok' });
  });

  it('filter dan batas', async () => {
    const r = await layananKecocokan({ jawaban_minat: minatI, filter: { id_prodi: [1, 2] }, batas: 1 }, repo);
    expect(r.total_dibandingkan).toBe(2);
    expect(r.hasil).toHaveLength(1);
  });

  it('chip hobi ikut menghitung skor hobi', async () => {
    const r = await layananKecocokan({ jawaban_minat: minatI, chip_hobi: ['H04'] }, repo);
    expect(r.hasil[0].skor_hobi).not.toBeNull();
  });

  it('pola seragam dan profil datar diberi peringatan', async () => {
    const r = await layananKecocokan({ jawaban_minat: jawaban({ R: 2, I: 2, A: 2, S: 2, E: 2, C: 2 }) }, repo);
    expect(r.profil_datar).toBe(true);
    expect(r.peringatan.length).toBeGreaterThanOrEqual(2);
  });

  it('skala tanpa jawaban, item atau hobi asing -> 400', async () => {
    const tanpaC = Object.fromEntries(ITEM.filter((i) => i.skala !== 'C').map((i) => [i.item_id, 2]));
    await expect(layananKecocokan({ jawaban_minat: tanpaC }, repo)).rejects.toMatchObject({ kode: 'VALIDASI' });
    await expect(layananKecocokan({ jawaban_minat: { ...minatI, X9: 1 } }, repo)).rejects.toMatchObject({ kode: 'VALIDASI' });
    await expect(layananKecocokan({ jawaban_minat: minatI, chip_hobi: ['H99'] }, repo)).rejects.toMatchObject({ kode: 'VALIDASI' });
  });

  it('jumlah mapel favorit cocok', () => {
    expect(jumlahMapelCocok('Fisika; Matematika Tingkat Lanjut', ['fisika', 'Matematika'])).toBe(1);
  });
});
