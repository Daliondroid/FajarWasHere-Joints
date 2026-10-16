import { describe, expect, it } from 'vitest';
import { sinkronPengguna } from '@/lib/layanan/akun';
import { layananBuatPreferensi } from '@/lib/layanan/preferensi';
import { layananRekomendasi, pilihKartu, profilDariPreferensi } from '@/lib/layanan/rekomendasi';
import { skorPrestasi } from '@/lib/skoring';
import type { PreferensiDetail } from '@/types';
import { BADAN_PREF, BADAN_PREF_SNBT, repoAkunPalsu } from './repo_akun_palsu';
import { prodi, repoPalsu, SEKOLAH } from './repo_palsu';

const PROFIL_GOOGLE = { sub: 'g-1', email: 's@example.com', name: 'Siswa', email_verified: true };
const RIASEC = { R: 4, I: 7, A: 2.5, S: 2.5, E: 1, C: 5.5 };
const HUKUM = { r: 1, i: 2, a: 5, s: 6, e: 5, c: 2, kode_holland: 'SEA' };

/** Preferensi SNBP lengkap; sekolah SEKOLAH (provinsi 35). */
function pref(lain: Partial<PreferensiDetail> = {}): PreferensiDetail {
  return {
    id: 'p1',
    nama: 'Uji',
    jalur: 'snbp',
    aktif: true,
    minat: { mode: 'mini_ip_30', jawaban_minat: {}, chip_hobi: [], mapel_favorit: [] },
    kelulusan: { tahun_lulus: 2026, pernah_lulus_snbp: false },
    akademik: {
      npsn: SEKOLAH.npsn,
      jurusan_sekolah: 'MIPA',
      rapor_rata: 90,
      nilai_mapel_pendukung: {},
      peringkat_paralel: 3,
      jumlah_siswa_jurusan: null,
      nilai_tka: {},
      prestasi: [],
      reputasi_alumni: null,
      kampus_alumni: [],
    },
    riwayat_to: [],
    skor_riasec: RIASEC,
    kode_holland: 'ICR',
    skor_to_terbaru: null,
    dibuat_pada: '',
    diperbarui_pada: '',
    ...lain,
  };
}

// Rumpun teknik (cocok tinggi, vektor sama -> skor seri) di Jabar (32) dan Jatim (35); rumpun hukum (cocok rendah).
const PRODI = [
  prodi({ id_prodi: 1, id_ptn: 10, kode_bps_ptn: '32', rasio_terima_snbp_2025: 0.05 }),
  prodi({ id_prodi: 2, id_ptn: 11, kode_bps_ptn: '32', rasio_terima_snbp_2025: 0.4 }),
  prodi({ id_prodi: 3, id_ptn: 12, kode_bps_ptn: '35', rasio_terima_snbp_2025: 0.2 }),
  prodi({ id_prodi: 4, id_ptn: 13, kode_bps_ptn: '35', rumpun_id: 'hukum', rasio_terima_snbp_2025: 0.3, ...HUKUM }),
  prodi({ id_prodi: 5, id_ptn: 14, kode_bps_ptn: '35', rumpun_id: 'hukum', rasio_terima_snbp_2025: 0.1, ...HUKUM }),
];

describe('pemilihan 3 kartu (K-10)', () => {
  it('Dream = kecocokan tertinggi paling ketat; Safety = serumpun di provinsi sekolah; Alternatif = rumpun lain', () => {
    const h = pilihKartu({ pref: pref(), semuaProdi: PRODI, sekolah: SEKOLAH });
    expect(h.kartu.map((k) => [k.jenis, k.b.id_prodi])).toEqual([
      ['dream_goal', 1],
      ['safety_net', 3],
      ['alternatif', 4],
    ]);
    expect(h.validasi?.valid).toBe(true);
    expect(h.kartu.every((k) => k.peluang.dihitung)).toBe(true);
    expect(h.catatan).toEqual([]);
  });

  it('Dream sudah di provinsi sekolah -> Safety boleh di provinsi mana pun (peluang tertinggi)', () => {
    const lokal = PRODI.map((b) => (b.id_prodi === 1 ? { ...b, kode_bps_ptn: '35' } : b));
    const h = pilihKartu({ pref: pref(), semuaProdi: lokal, sekolah: SEKOLAH });
    expect(h.kartu[1].b.id_prodi).toBe(2); // rasio 0,4 -> peluang tertinggi
    expect(h.validasi?.valid).toBe(true);
  });

  it('tanpa prodi serumpun di provinsi sekolah -> catatan dan validasi melanggar', () => {
    const tanpaLokal = PRODI.filter((b) => b.id_prodi !== 3);
    const h = pilihKartu({ pref: pref(), semuaProdi: tanpaLokal, sekolah: SEKOLAH });
    expect(h.kartu[1].b.id_prodi).toBe(2);
    expect(h.validasi?.valid).toBe(false);
    expect(h.catatan.join(' ')).toContain('aturan satu provinsi');
  });

  it('tanpa data akademik -> peluang tidak dihitung, Safety = paling longgar, ada catatan', () => {
    const h = pilihKartu({ pref: pref({ akademik: null }), semuaProdi: PRODI, sekolah: null });
    expect(h.kartu[1].b.id_prodi).toBe(2); // tanpa sekolah, aturan provinsi tidak bisa dicek
    expect(h.kartu.every((k) => !k.peluang.dihitung)).toBe(true);
    expect(h.catatan.join(' ')).toContain('peluang SNBP');
    expect(h.validasi).toBeNull();
  });

  it('SNBT: Safety = peluang tertinggi dari skor TO; prodi tanpa SNBT tidak dipakai', () => {
    const snbt = [
      prodi({ id_prodi: 1, est_skor_utbk: 700, est_skor_utbk_bawah: null, est_skor_utbk_atas: null }),
      prodi({ id_prodi: 2, est_skor_utbk: 550, est_skor_utbk_bawah: null, est_skor_utbk_atas: null }),
      prodi({ id_prodi: 3, est_skor_utbk: 500, ada_snbt: false }),
      prodi({ id_prodi: 4, rumpun_id: 'hukum', ...HUKUM }),
    ];
    const h = pilihKartu({ pref: pref({ jalur: 'snbt', akademik: null, skor_to_terbaru: 600 }), semuaProdi: snbt, sekolah: null });
    expect(h.kartu.map((k) => k.b.id_prodi)).toEqual([1, 2, 4]);
    expect(h.kartu[1].peluang.dihitung).toBe(true);
  });

  it('tanpa kandidat -> tanpa kartu', () => {
    expect(pilihKartu({ pref: pref(), semuaProdi: [], sekolah: null }).kartu).toEqual([]);
  });
});

describe('profil dari preferensi', () => {
  it('prestasi dikonversi lewat tabel bobot tingkat (asumsi)', () => {
    expect(skorPrestasi([])).toBe(0);
    expect(skorPrestasi([{ tingkat: 'Provinsi' }, { tingkat: 'Nasional' }])).toBe(80);
    expect(skorPrestasi([{ tingkat: 'internasional' }])).toBe(100);
    expect(skorPrestasi([{ tingkat: 'Kab/Kota' }])).toBe(40);
    expect(skorPrestasi([{ tingkat: 'lain-lain' }])).toBe(0);
  });
  it('kelulusan dan alumni terbawa ke profil peluang', () => {
    const p = profilDariPreferensi(pref({ kelulusan: { tahun_lulus: null, pernah_lulus_snbp: true } }));
    expect(p).toMatchObject({ tahun_lulus: 2026, lulus_snbp_tahun: 2026, kampus_alumni: [], prestasi_skor: 0 });
  });
});

describe('GET /api/rekomendasi', () => {
  it('wajib login; tanpa preferensi -> data null', async () => {
    const { repo: repoAkun } = repoAkunPalsu();
    const repo = repoPalsu(PRODI);
    await expect(layananRekomendasi(null, { repo, repoAkun })).rejects.toMatchObject({ kode: 'TIDAK_LOGIN' });
    const id = await sinkronPengguna(PROFIL_GOOGLE, repoAkun);
    expect(await layananRekomendasi(id, { repo, repoAkun })).toEqual({ data: null });
  });

  it('memakai preferensi aktif: kartu + detail popup sesuai jalur', async () => {
    const { repo: repoAkun } = repoAkunPalsu();
    const repo = repoPalsu(PRODI);
    const id = await sinkronPengguna(PROFIL_GOOGLE, repoAkun);
    await layananBuatPreferensi(id, BADAN_PREF, repoAkun);
    const { data } = await layananRekomendasi(id, { repo, repoAkun });
    expect(data!.preferensi).toMatchObject({ nama: 'Impian Kedokteran', jalur: 'snbp' });
    expect(data!.kartu.map((k) => [k.peringkat, k.jenis])).toEqual([
      [1, 'dream_goal'],
      [2, 'safety_net'],
      [3, 'alternatif'],
    ]);
    const d = data!.kartu[0].detail;
    expect(d.peluang_snbp).toMatchObject({ estimasi: true });
    expect(d.peluang_snbt).toBeNull();
    expect(d.kode_holland).toBe('IRC');
    expect(data!.validasi_provinsi_snbp).not.toBeNull();

    // Ganti ke preferensi SNBT (otomatis aktif): detail berganti jalur.
    await layananBuatPreferensi(id, BADAN_PREF_SNBT, repoAkun);
    const snbt = (await layananRekomendasi(id, { repo, repoAkun })).data!;
    expect(snbt.preferensi.jalur).toBe('snbt');
    expect(snbt.kartu[0].detail.peluang_snbp).toBeNull();
    expect(snbt.kartu[0].detail.peluang_snbt).toMatchObject({ peringatan_skala: true });
    expect(snbt.validasi_provinsi_snbp).toBeNull();
  });
});
