import { describe, expect, it } from 'vitest';
import { ApiGalat, bacaJson, tangani } from '@/lib/api/galat';
import { validasiKecocokan, validasiNpsn, validasiPeluang, validasiQueryProdi } from '@/lib/api/validasi';
import { keBarisProdi } from '@/lib/db/repo_supabase';

const salah = (f: () => unknown) => {
  try {
    f();
  } catch (e) {
    return e instanceof ApiGalat ? e.kode : 'lain';
  }
  return 'lolos';
};

describe('format galat', () => {
  it('ApiGalat -> status & badan seragam', async () => {
    const r = await tangani(async () => {
      throw new ApiGalat('TIDAK_DITEMUKAN', 'tidak ada');
    });
    expect(r.status).toBe(404);
    expect(await r.json()).toEqual({ error: { kode: 'TIDAK_DITEMUKAN', pesan: 'tidak ada' } });
  });
  it('galat lain -> 500 tanpa membocorkan pesan', async () => {
    const asli = console.error;
    console.error = () => {};
    const r = await tangani(async () => {
      throw new Error('rahasia DB');
    });
    console.error = asli;
    expect(r.status).toBe(500);
    expect(JSON.stringify(await r.json())).not.toContain('rahasia');
  });
  it('badan bukan JSON -> VALIDASI', async () => {
    await expect(bacaJson(new Request('http://x', { method: 'POST', body: '{rusak' }))).rejects.toMatchObject({ kode: 'VALIDASI' });
  });
});

describe('validasi input', () => {
  it('NPSN 8 digit', () => {
    expect(validasiNpsn(' 20500001 ')).toBe('20500001');
    expect(salah(() => validasiNpsn('1234'))).toBe('VALIDASI');
  });

  it('query prodi: bawaan dan batas', () => {
    const v = validasiQueryProdi(new URLSearchParams('q=teknik&jenjang=S1&portofolio=false'));
    expect(v).toMatchObject({ halaman: 1, per_halaman: 20, filter: { q: 'teknik', jenjang: 'S1', portofolio: false } });
    expect(salah(() => validasiQueryProdi(new URLSearchParams('per_halaman=51')))).toBe('VALIDASI');
    expect(salah(() => validasiQueryProdi(new URLSearchParams('jenjang=S3')))).toBe('VALIDASI');
  });

  it('peluang: batas jumlah prodi per jalur dan duplikat', () => {
    const profil = { tahun_lulus: 2026 };
    expect(validasiPeluang({ jalur: 'snbt', id_prodi: [1, 2, 3, 4], profil }).id_prodi).toHaveLength(4);
    expect(salah(() => validasiPeluang({ jalur: 'snbp', id_prodi: [1, 2, 3], profil }))).toBe('VALIDASI');
    expect(salah(() => validasiPeluang({ jalur: 'snbt', id_prodi: [1, 1], profil }))).toBe('VALIDASI');
    expect(salah(() => validasiPeluang({ jalur: 'snbt', id_prodi: [1], profil: { tahun_lulus: 2026, rapor_rata: 101 } }))).toBe('VALIDASI');
  });

  it('kecocokan: jawaban 0..4 bulat, mapel favorit maks 3', () => {
    expect(validasiKecocokan({ jawaban_minat: { R1: 4 } })).toMatchObject({ mode: 'mini_ip_30', batas: 20, chip_hobi: [] });
    expect(salah(() => validasiKecocokan({ jawaban_minat: { R1: 5 } }))).toBe('VALIDASI');
    expect(salah(() => validasiKecocokan({ jawaban_minat: {}, mapel_favorit: ['a', 'b', 'c', 'd'] }))).toBe('VALIDASI');
  });
});

describe('keBarisProdi (pemetaan baris Supabase)', () => {
  it('mengubah numeric teks ke number dan membuka relasi', () => {
    const b = keBarisProdi({
      id_prodi: 111001, id_ptn: 111, nama: 'PENDIDIKAN DOKTER HEWAN', jenjang: 'S1', rumpun_id: 'kedokteran_hewan',
      kelompok: 'saintek', r: '6.34', i: '5.60', a: '1.00', s: '3.23', e: '1.35', c: '4.04', kode_holland: 'RIC',
      rasio_terima_snbp_2025: '0.2156', est_skor_utbk: 569, est_skor_utbk_bawah: null,
      ptn: { nama: 'UNIVERSITAS SYIAH KUALA', kode_bps: '11', kode_bps_2: null, prov: { nama: 'Aceh' } },
      rumpun: { nama: 'Kedokteran Hewan', klaster_id: 1 },
    });
    expect(b).toMatchObject({ r: 6.34, rasio_terima_snbp_2025: 0.2156, provinsi_ptn: 'Aceh', klaster_id: 1, est_skor_utbk_bawah: null });
  });
});
