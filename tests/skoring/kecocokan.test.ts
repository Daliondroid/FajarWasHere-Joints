import { describe, expect, it } from 'vitest';
import {
  cIndex,
  kecocokan,
  kodeHolland,
  kodeHollandSeri,
  labelKecocokan,
  pearson,
  profilDatar,
  skorHobi,
  skorMinat,
  vektorHobi,
  type ItemMinat,
  type ProfilRiasec,
} from '@/lib/skoring';

// Contoh dari Data/kode/skoring_referensi.py
const siswa: ProfilRiasec = { R: 3.1, I: 6.2, A: 2.4, S: 3.0, E: 2.2, C: 5.1 };
const prodi: ProfilRiasec = { R: 3.73, I: 6.01, A: 2.58, S: 1.98, E: 2.11, C: 5.35 };

describe('skor minat & kode Holland', () => {
  const items: ItemMinat[] = [
    { item_id: 'r1', skala: 'R', mini_ip_30: true },
    { item_id: 'r2', skala: 'R', mini_ip_30: false },
    { item_id: 'i1', skala: 'I', mini_ip_30: true },
  ];
  it('skor 1..7, mode mini hanya item mini', () => {
    const h = skorMinat({ r1: 4, r2: 0, i1: 0 }, items);
    expect(h.R).toBe(7);
    expect(h.I).toBe(1);
    expect(h.A).toBeNull();
    expect(skorMinat({ r1: 4, r2: 0 }, items, 'ipsf_60').R).toBe(4);
  });
  it('kode Holland 3 huruf sesuai referensi', () => {
    expect(kodeHolland(siswa)).toBe('ICR');
    expect(kodeHollandSeri(siswa)).toBe(false);
    expect(kodeHollandSeri({ R: 5, I: 6, A: 5, S: 1, E: 1, C: 1 })).toBe(true);
  });
  it('profil datar terdeteksi', () => {
    expect(profilDatar({ R: 4, I: 4.5, A: 4.2, S: 4.1, E: 4, C: 4.3 })).toBe(true);
    expect(profilDatar(siswa)).toBe(false);
  });
});

describe('pearson & C-index', () => {
  it('pearson konstan -> 0', () => {
    expect(pearson([1, 1, 1], [1, 2, 3])).toBe(0);
    expect(pearson([1, 2, 3], [2, 4, 6])).toBeCloseTo(1);
  });
  it('C-index sesuai referensi', () => {
    expect(cIndex('ICR', 'ICR')).toBe(18);
    expect(cIndex('RIA', 'SEC')).toBe(0);
  });
});

describe('kecocokan (BR-10)', () => {
  it('tanpa hobi sama dengan referensi: 97,3 Sangat cocok', () => {
    expect(kecocokan(siswa, prodi)).toMatchObject({ skor: 97.3, label: 'Sangat cocok' });
  });
  it('dengan skor hobi 50 sama dengan referensi: 87,8', () => {
    expect(kecocokan(siswa, prodi, 50).skor).toBe(87.8);
  });
  it('label pada batas 80/65/50', () => {
    expect(labelKecocokan(80)).toBe('Sangat cocok');
    expect(labelKecocokan(79.9)).toBe('Cocok');
    expect(labelKecocokan(65)).toBe('Cocok');
    expect(labelKecocokan(50)).toBe('Cukup');
    expect(labelKecocokan(49.9)).toBe('Kurang cocok');
  });
});

describe('skor hobi', () => {
  it('menjumlahkan bobot RIASEC chip dari config', () => {
    const v = vektorHobi(['H04', 'H05']);
    expect(v.I).toBeCloseTo(1.5);
    expect(v.R).toBeCloseTo(0.3);
  });
  it('tanpa hobi -> null; hobi I cocok dengan prodi I tinggi', () => {
    expect(skorHobi([], prodi)).toBeNull();
    expect(skorHobi(['H04'], prodi)!).toBeGreaterThan(skorHobi(['H08'], prodi)!);
  });
});
