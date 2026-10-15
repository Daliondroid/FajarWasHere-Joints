import { describe, expect, it } from 'vitest';
import {
  labelPeluang,
  peluangSnbp,
  peluangSnbt,
  peluangSnbtTitik,
  penyesuaianPosisi,
  persentilKuota,
  rentang,
  skorAkademik,
  validasiBobot,
  zTka,
} from '@/lib/skoring';

describe('skor akademik SNBP (BR-05)', () => {
  it('tanpa TKA: S = 0,6·rapor + 0,25·mapel + 0,15·prestasi', () => {
    const h = skorAkademik({ rapor: 90, mapel_pendukung: 80, prestasi: 50 });
    expect(h.skor).toBeCloseTo(0.6 * 90 + 0.25 * 80 + 0.15 * 50);
    expect(h.z_tka).toBeNull();
  });
  it('TKA di atas rerata menaikkan rapor terkoreksi (k = 5, SD = 15)', () => {
    const h = skorAkademik({ rapor: 85, tka: { matematika: 36.1 + 15 } });
    expect(h.z_tka).toBeCloseTo(1);
    expect(h.rapor_terkoreksi).toBeCloseTo(90);
  });
  it('z TKA dibatasi ±2 dan rapor terkoreksi maks 100', () => {
    expect(zTka({ matematika: 100 })).toBe(2);
    expect(skorAkademik({ rapor: 98, tka: { matematika: 100 } }).rapor_terkoreksi).toBe(100);
  });
  it('menolak bobot yang melanggar aturan resmi', () => {
    expect(() => validasiBobot({ w1_rapor: 0.4, w2_mapel_pendukung: 0.3, w3_prestasi: 0.3 })).toThrow();
    expect(() => validasiBobot({ w1_rapor: 0.5, w2_mapel_pendukung: 0.3, w3_prestasi: 0.3 })).toThrow();
    expect(() => validasiBobot({ w1_rapor: 0.5, w2_mapel_pendukung: 0.25, w3_prestasi: 0.25 })).not.toThrow();
  });
});

describe('posisi siswa (BR-06)', () => {
  it('persentil kuota: peringkat 1 = 100', () => {
    expect(persentilKuota(1, 40)).toBe(100);
    expect(persentilKuota(40, 40)).toBeCloseTo(2.5);
  });
  it('penyesuaian akreditasi dan alumni dalam ±5', () => {
    expect(penyesuaianPosisi('A', 'diterima')).toEqual({ akreditasi: 3, alumni: 3 });
    expect(penyesuaianPosisi(null, 'tidak_daftar_ulang')).toEqual({ akreditasi: -3, alumni: -3 });
    const { akreditasi, alumni } = penyesuaianPosisi('B', null);
    expect(akreditasi).toBe(0);
    expect(alumni).toBe(0);
  });
});

describe('rentang & label (BR-07)', () => {
  it('rentang kelipatan 5 dan di 0..100', () => {
    expect(rentang(37.2, 52.2)).toEqual([35, 55]);
    expect(rentang(-3, 4)).toEqual([0, 5]);
    expect(rentang(99, 100)).toEqual([95, 100]);
  });
  it('label rendah < 35 ≤ sedang < 65 ≤ tinggi', () => {
    expect(labelPeluang(34.9)).toBe('rendah');
    expect(labelPeluang(35)).toBe('sedang');
    expect(labelPeluang(65)).toBe('tinggi');
  });
});

describe('peluangSnbp', () => {
  const dasar = {
    akademik: { rapor: 90, mapel_pendukung: 90, prestasi: 40 },
    eligibilitas: { peringkat_paralel: 3, kuota_jurusan: 40, akreditasi_sekolah: 'A' },
    prodi: { rasio_terima: 0.2, rasio_terima_rata3th: 0.18 },
  };

  it('menghasilkan rentang, label, 3 alasan, dan flag estimasi', () => {
    const h = peluangSnbp(dasar);
    expect(h.dihitung).toBe(true);
    expect(h.alasan).toHaveLength(3);
    expect(h.estimasi).toBe(true);
    expect(h.rentang![0]).toBeLessThan(h.rentang![1]);
    expect(h.rentang![0]).toBeLessThanOrEqual(h.peluang!);
    expect(h.rentang![1]).toBeGreaterThanOrEqual(h.peluang!);
    expect(h.rincian.ambang).toBeCloseTo(80);
  });

  it('peringkat lebih baik dan prodi lebih longgar -> peluang lebih tinggi', () => {
    const buruk = peluangSnbp({ ...dasar, eligibilitas: { ...dasar.eligibilitas, peringkat_paralel: 35 } });
    const ketat = peluangSnbp({ ...dasar, prodi: { rasio_terima: 0.04 } });
    const longgar = peluangSnbp({ ...dasar, prodi: { rasio_terima: 0.5 } });
    const p = peluangSnbp(dasar).peluang!;
    expect(buruk.peluang!).toBeLessThan(p);
    expect(ketat.peluang!).toBeLessThan(p);
    expect(longgar.peluang!).toBeGreaterThan(p);
    expect(ketat.label_keketatan).toBe('sangat_ketat');
  });

  it('di luar kuota eligible -> tidak dihitung, arahkan ke SNBT', () => {
    const h = peluangSnbp({ ...dasar, eligibilitas: { ...dasar.eligibilitas, peringkat_paralel: 41 } });
    expect(h.dihitung).toBe(false);
    expect(h.peluang).toBeNull();
    expect(h.pesan).toContain('fokus ke SNBT');
  });

  it('prodi fallback rumpun ditandai data terbatas', () => {
    const h = peluangSnbp({ ...dasar, prodi: { rasio_terima: 0.2, data_terbatas: true } });
    expect(h.data_terbatas).toBe(true);
    expect(h.alasan[1]).toContain('data terbatas');
  });

  it('tanpa data keketatan -> tidak dihitung', () => {
    expect(peluangSnbp({ ...dasar, prodi: { rasio_terima: null } }).dihitung).toBe(false);
  });
});

describe('peluangSnbt (BR-09)', () => {
  it('sama dengan skoring_referensi.peluang_snbt', () => {
    expect(peluangSnbtTitik(680, 650)).toBeCloseTo(81.1, 1);
    expect(peluangSnbtTitik(650, 650)).toBeCloseTo(50, 5);
  });
  it('rentang dari est_skor_utbk_bawah/atas, dengan peringatan skala', () => {
    const h = peluangSnbt({ skor_to: 600, est_skor_utbk: 569, est_skor_utbk_bawah: 534, est_skor_utbk_atas: 604 });
    expect(h.dihitung).toBe(true);
    expect(h.peringatan_skala).toBe(true);
    expect(h.estimasi).toBe(true);
    expect(h.rentang![0]).toBeLessThanOrEqual(h.peluang!);
    expect(h.rentang![1]).toBeGreaterThanOrEqual(h.peluang!);
  });
  it('tanpa estimasi skor prodi -> tidak dihitung', () => {
    expect(peluangSnbt({ skor_to: 600, est_skor_utbk: null }).dihitung).toBe(false);
  });
});
