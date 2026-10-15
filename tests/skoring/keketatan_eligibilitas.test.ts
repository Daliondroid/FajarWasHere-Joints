import { describe, expect, it } from 'vitest';
import {
  cekEligibilitas,
  labelKeketatan,
  rasioSnbp,
  rasioSnbt,
  rataRumpunPtn,
  validasiJalur,
} from '@/lib/skoring';

describe('keketatan (BR-02, BR-03)', () => {
  it('SNBP memakai diterima ÷ peminat, SNBT daya tampung ÷ peminat', () => {
    expect(rasioSnbp(72, 334)).toBeCloseTo(0.2156, 4);
    expect(rasioSnbt(92, 488)).toBeCloseTo(0.1885, 4);
  });
  it('peminat 0 atau data kosong -> null', () => {
    expect(rasioSnbp(10, 0)).toBeNull();
    expect(rasioSnbt(null, 100)).toBeNull();
  });
  it('label sesuai ambang 5/15/35 %, batas bawah inklusif', () => {
    expect(labelKeketatan(0.0499)).toBe('sangat_ketat');
    expect(labelKeketatan(0.05)).toBe('ketat');
    expect(labelKeketatan(0.1499)).toBe('ketat');
    expect(labelKeketatan(0.15)).toBe('sedang');
    expect(labelKeketatan(0.35)).toBe('longgar');
  });
});

describe('rataRumpunPtn (BR-08)', () => {
  const daftar = [
    { id_prodi: 'a', id_ptn: '1', rumpun_id: 'teknik', rasio: 0.1 },
    { id_prodi: 'b', id_ptn: '1', rumpun_id: 'teknik', rasio: 0.2 },
    { id_prodi: 'c', id_ptn: '1', rumpun_id: 'hukum', rasio: 0.9 },
    { id_prodi: 'd', id_ptn: '2', rumpun_id: 'teknik', rasio: 0.9 },
    { id_prodi: 'e', id_ptn: '1', rumpun_id: 'teknik', rasio: null },
  ];
  it('rata-rata rumpun sama di PTN sama, tanpa prodi itu sendiri', () => {
    const h = rataRumpunPtn({ id_prodi: 'baru', id_ptn: '1', rumpun_id: 'teknik' }, daftar, (p) => p.rasio);
    expect(h?.nilai).toBeCloseTo(0.15);
    expect(h?.jumlah_pembanding).toBe(2);
    expect(h?.data_terbatas).toBe(true);
  });
  it('tanpa pembanding -> null', () => {
    expect(rataRumpunPtn({ id_prodi: 'x', id_ptn: '3', rumpun_id: 'teknik' }, daftar, (p) => p.rasio)).toBeNull();
  });
});

describe('cekEligibilitas (BR-04)', () => {
  it('memakai kuota resmi jurusan', () => {
    expect(cekEligibilitas({ peringkat_paralel: 40, kuota_jurusan: 40 }).eligible).toBe(true);
    const h = cekEligibilitas({ peringkat_paralel: 41, kuota_jurusan: 40 });
    expect(h.eligible).toBe(false);
    expect(h.pesan).toContain('fokus ke SNBT');
  });
  it('tanpa kuota resmi -> perkiraan dari akreditasi (A 40%, B 25%, C/lainnya 5%)', () => {
    expect(cekEligibilitas({ peringkat_paralel: 1, akreditasi_sekolah: 'A', jumlah_siswa_jurusan: 100 }).kuota).toBe(40);
    expect(cekEligibilitas({ peringkat_paralel: 1, akreditasi_sekolah: 'B', jumlah_siswa_jurusan: 100 }).kuota).toBe(25);
    const tt = cekEligibilitas({ peringkat_paralel: 6, akreditasi_sekolah: 'Tidak Terakreditasi', jumlah_siswa_jurusan: 100 });
    expect(tt.kuota).toBe(5);
    expect(tt.eligible).toBe(false);
    expect(tt.sumber_kuota).toBe('perkiraan_akreditasi');
    expect(tt.pesan).toContain('akreditasi');
  });
  it('tanpa data kuota sama sekali -> tidak bisa ditentukan', () => {
    expect(cekEligibilitas({ peringkat_paralel: 1 }).eligible).toBeNull();
  });
});

describe('validasiJalur (BR-11)', () => {
  it('siswa kelas 12 tahun ini boleh SNBP dan SNBT', () => {
    expect(validasiJalur({ tahun_lulus: 2026 })).toMatchObject({ boleh_snbp: true, boleh_snbt: true });
  });
  it('lulusan 2024/2025 tidak boleh SNBP', () => {
    expect(validasiJalur({ tahun_lulus: 2025 })).toMatchObject({ boleh_snbp: false, boleh_snbt: true });
  });
  it('lulus SNBP 2024–2026 tidak boleh SNBT', () => {
    expect(validasiJalur({ tahun_lulus: 2025, lulus_snbp_tahun: 2025 }).boleh_snbt).toBe(false);
  });
  it('lulusan 2023 tidak boleh SNBT 2026', () => {
    expect(validasiJalur({ tahun_lulus: 2023 }).boleh_snbt).toBe(false);
  });
});
