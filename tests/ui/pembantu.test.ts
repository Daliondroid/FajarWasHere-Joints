import { describe, expect, it } from 'vitest';
import { inisial } from '@/components/Navbar';
import { rataTo, toKosong } from '@/components/preferensi/FormSnbt';
import { drafBaru } from '@/lib/klien/draf_preferensi';

describe('inisial avatar', () => {
  it('ambil maks. 2 huruf depan, kapital', () => {
    expect(inisial('Ari Rahman Saputra')).toBe('AR');
    expect(inisial('farrel')).toBe('F');
    expect(inisial('  ')).toBe('?');
    expect(inisial(null)).toBe('?');
  });
});

describe('rata-rata try out', () => {
  it('hanya subtes yang terisi, dibulatkan', () => {
    const to = toKosong();
    expect(rataTo(to)).toBeNull();
    expect(rataTo({ ...to, skor: { ...to.skor, pu: 700, pk: 651 } })).toBe(676);
  });
});

describe('draf preferensi baru', () => {
  it('SNBP/SNBT mulai tanpa bahan jalur dan mode Mini-IP', () => {
    const d = drafBaru('Impian', 'snbt', 2025, true);
    expect(d.id_ubah).toBeNull();
    expect(d.isi).toMatchObject({
      nama: 'Impian',
      jalur: 'snbt',
      akademik: null,
      riwayat_to: [],
      kelulusan: { tahun_lulus: 2025, pernah_lulus_snbp: true },
      minat: { mode: 'mini_ip_30', jawaban_minat: {} },
    });
  });
});
