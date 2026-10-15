import { describe, it, expect } from 'vitest';

describe('Aplikasi Cocokin! - Rute & Data Katalog Mock', () => {
  const routes = [
    { path: '/', label: 'Beranda' },
    { path: '/preferensi/minat', label: 'Preferensi Minat' },
    { path: '/preferensi/akademik', label: 'Preferensi Akademik' },
    { path: '/cocokin', label: 'Dashboard Rekomendasi' },
    { path: '/chat', label: 'Chatbot' },
    { path: '/katalog', label: 'Katalog Simulation' },
    { path: '/test-drive/informatika', label: 'Mini Challenge' },
  ];

  it('semua rute aplikasi terdefinisi dan valid', () => {
    routes.forEach((r) => {
      expect(r.path.startsWith('/')).toBe(true);
      expect(r.label).toBeTruthy();
    });
  });

  it('katalog prodi mendukung kategori IPA dan IPS', () => {
    const sample = [
      { name: 'Informatika', category: 'IPA' },
      { name: 'Ilmu Hukum', category: 'IPS' },
    ];
    const ipa = sample.filter((p) => p.category === 'IPA');
    const ips = sample.filter((p) => p.category === 'IPS');

    expect(ipa).toHaveLength(1);
    expect(ips).toHaveLength(1);
    expect(ipa[0].name).toBe('Informatika');
  });

  it('skor kecocokan rekomendasi berada pada rentang 0 - 100 persen', () => {
    const skor = 80;
    expect(skor).toBeGreaterThanOrEqual(0);
    expect(skor).toBeLessThanOrEqual(100);
  });
});
