import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { buatPetaProvinsi, normalisasiProvinsi, validasiProvinsiSnbp } from '@/lib/skoring';

// Crosswalk asli dari Data/ (tidak ada koma di dalam nilai, jadi split sederhana cukup).
const baris = readFileSync(path.resolve(__dirname, '../../Data/ak_provinsi_crosswalk.csv'), 'utf-8')
  .replace(/^﻿/, '')
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map((l) => {
    const [, nama_di_sumber, provinsi_kanonik] = l.split(',');
    return { nama_di_sumber, provinsi_kanonik };
  });
const peta = buatPetaProvinsi(baris);

describe('normalisasiProvinsi', () => {
  it('menyamakan format nama yang berbeda antar file', () => {
    expect(normalisasiProvinsi('Jakarta Raya', peta)).toBe(normalisasiProvinsi('Prov. D.K.I. Jakarta', peta));
    expect(normalisasiProvinsi('  prov. jawa   barat ', peta)).toBe('Jawa Barat');
  });
  it('mengembalikan null untuk nama tak dikenal', () => {
    expect(normalisasiProvinsi('Atlantis', peta)).toBeNull();
    expect(normalisasiProvinsi('', peta)).toBeNull();
  });
});

describe('validasiProvinsiSnbp (BR-01)', () => {
  const ugm = { provinsi: 'DI Yogyakarta' };
  const itb = { provinsi: 'Jawa Barat' };
  const unair = { provinsi: 'Jawa Timur' };

  it('satu pilihan selalu valid, beda provinsi pun', () => {
    expect(validasiProvinsiSnbp('Prov. Jawa Timur', [itb], peta).valid).toBe(true);
  });

  it('dua pilihan valid bila salah satu se-provinsi sekolah', () => {
    const h = validasiProvinsiSnbp('Prov. Jawa Timur', [itb, unair], peta);
    expect(h.valid).toBe(true);
    expect(h.pilihan_sama_provinsi).toEqual([1]);
  });

  it('dua pilihan di luar provinsi sekolah melanggar', () => {
    const h = validasiProvinsiSnbp('Prov. Jawa Timur', [itb, ugm], peta);
    expect(h.valid).toBe(false);
    expect(h.pesan).toBe('Melanggar aturan provinsi SNBP!');
  });

  it('UI (Jakarta Raya & Jawa Barat) cocok untuk sekolah di Jawa Barat maupun DKI', () => {
    const ui = { provinsi: 'Jakarta Raya', provinsi_2: 'Jawa Barat' };
    expect(validasiProvinsiSnbp('Prov. Jawa Barat', [ui, ugm], peta).valid).toBe(true);
    expect(validasiProvinsiSnbp('Prov. D.K.I. Jakarta', [ugm, ui], peta).valid).toBe(true);
  });

  it('Universitas Papua cocok untuk sekolah di Papua Barat Daya (pemekaran 2022)', () => {
    const unipa = { provinsi: 'Papua Barat', provinsi_2: 'Papua Barat Daya' };
    expect(validasiProvinsiSnbp('Prov. Papua Barat Daya', [unipa, ugm], peta).valid).toBe(true);
  });

  it('provinsi hasil pemekaran tidak disamakan dengan provinsi induk', () => {
    const uncen = { provinsi: 'Papua' };
    expect(validasiProvinsiSnbp('Prov. Papua Pegunungan', [uncen, ugm], peta).valid).toBe(false);
  });

  it('melaporkan provinsi tak dikenal', () => {
    const h = validasiProvinsiSnbp('Prov. Atlantis', [itb, ugm], peta);
    expect(h.valid).toBe(false);
    expect(h.tidak_dikenal).toEqual(['Prov. Atlantis']);
  });
});
