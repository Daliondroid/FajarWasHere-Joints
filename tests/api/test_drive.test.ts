import { describe, expect, it } from 'vitest';
import { bandingkanHasil, layananKecocokan } from '@/lib/layanan/kecocokan';
import type { RepoAkun } from '@/lib/layanan/repo_akun';
import type { BarisSoal, RepoTestDrive } from '@/lib/layanan/repo_test_drive';
import {
  acakUrutan,
  layananJawabTestDrive,
  layananRefleksiTestDrive,
  layananTestDrive,
  pilihKompetensi,
  pilihSoal,
} from '@/lib/layanan/test_drive';
import type { HasilKecocokanProdi, RefleksiTestDrive } from '@/types';
import { jawaban, prodi, repoPalsu } from './repo_palsu';

const ID_PENGGUNA = '11111111-2222-3333-4444-555555555555';
const tetap = () => 0; // pengacak deterministik

function soal(id_soal: string, lapisan: BarisSoal['lapisan'], lain: Partial<BarisSoal> = {}): BarisSoal {
  return {
    id_soal,
    lapisan,
    id_prodi: lapisan === 'rumpun' ? null : 1,
    rumpun_id: lapisan === 'rumpun' ? 'teknik' : null,
    soal: `Pertanyaan ${id_soal}?`,
    opsi_a: 'a', opsi_b: 'b', opsi_c: 'c', opsi_d: 'd',
    kunci: 'C',
    pembahasan: `Pembahasan ${id_soal}`,
    sumber: 'PDDikti',
    status: 'otomatis_perlu_review',
    ...lain,
  };
}

const BANK = [soal('S1', 'spesifik'), soal('S2', 'spesifik'), soal('U1', 'umum'), soal('R1', 'rumpun'), soal('R2', 'rumpun')];

function repoTdPalsu(bank: BarisSoal[] = BANK) {
  const riwayat: { pengguna: string; id_prodi: number; id_soal?: string; benar?: boolean; refleksi?: RefleksiTestDrive }[] = [];
  const repoTd: RepoTestDrive = {
    soalUntukProdi: async (id, rumpun) => bank.filter((s) => s.id_prodi === id || (s.lapisan === 'rumpun' && s.rumpun_id === rumpun)),
    soalById: async (id) => bank.find((s) => s.id_soal === id) ?? null,
    async simpanJawaban(pengguna, d) {
      riwayat.push({ pengguna, ...d });
    },
    async simpanRefleksi(pengguna, id_prodi, refleksi) {
      const r = [...riwayat].reverse().find((x) => x.pengguna === pengguna && x.id_prodi === id_prodi && !x.refleksi);
      if (r) r.refleksi = refleksi;
      else riwayat.push({ pengguna, id_prodi, refleksi });
    },
    async refleksiPengguna(pengguna) {
      const hasil: Record<string, RefleksiTestDrive> = {};
      for (const r of [...riwayat].reverse()) if (r.pengguna === pengguna && r.refleksi && !(r.id_prodi in hasil)) hasil[r.id_prodi] = r.refleksi;
      return hasil;
    },
  };
  return { repoTd, riwayat };
}

const repoAkun = { ambilPengguna: async (id: string) => (id === ID_PENGGUNA ? { id, email: 'x@example.com', nama: null } : null) } as RepoAkun;

describe('pemilihan soal berlapis', () => {
  it('spesifik dulu, lalu rumpun, lalu cadangan; maks 3', () => {
    expect(pilihSoal(BANK, tetap).map((s) => s.lapisan)).toEqual(['spesifik', 'rumpun', 'spesifik']);
  });
  it('tanpa soal spesifik memakai soal umum', () => {
    const tanpaSpesifik = BANK.filter((s) => s.lapisan !== 'spesifik');
    expect(pilihSoal(tanpaSpesifik, tetap).map((s) => s.id_soal)).toEqual(['U1', 'R2', 'R1']);
  });
  it('cadangan tidak mengulang teks pertanyaan yang sama', () => {
    const umumKembar = [
      soal('U1', 'umum', { soal: 'Secara umum, kemampuan mana?' }),
      soal('U2', 'umum', { soal: 'Secara umum, kemampuan mana?' }),
      soal('R1', 'rumpun'),
      soal('R2', 'rumpun'),
    ];
    const teks = pilihSoal(umumKembar, tetap).map((s) => s.soal);
    expect(new Set(teks).size).toBe(teks.length);
  });
  it('bank kosong -> tanpa soal; hanya rumpun -> soal rumpun', () => {
    expect(pilihSoal([], tetap)).toEqual([]);
    expect(pilihSoal([soal('R1', 'rumpun')], tetap).map((s) => s.id_soal)).toEqual(['R1']);
  });
  it('pengacak mengubah urutan tanpa kehilangan item', () => {
    expect(acakUrutan([1, 2, 3, 4], tetap).sort()).toEqual([1, 2, 3, 4]);
  });
});

describe('kompetensi lulusan', () => {
  it('pilih kalimat utuh, buang potongan, maks 3', () => {
    const k = pilihKompetensi([
      'dalam profesi dokter hewan untuk melindungi kesehatan hewan',
      'Mampu mendiagnosis penyakit hewan secara klinis',
      'Mampu merancang program kesehatan masyarakat veteriner',
      'Singkat',
      'Mampu berkomunikasi efektif dengan pemilik hewan',
      'Mampu bekerja sama dalam tim multidisiplin kesehatan',
    ]);
    expect(k).toHaveLength(3);
    expect(k.every((x) => /^[A-Z]/.test(x))).toBe(true);
  });
  it('tanpa kalimat utuh tetap memakai yang tersedia', () => {
    expect(pilihKompetensi(['dalam profesi dokter hewan untuk melindungi kesehatan hewan'])).toHaveLength(1);
  });
});

describe('GET /api/test-drive', () => {
  const repo = repoPalsu([prodi({ id_prodi: 1, rumpun_id: 'teknik', dt_snbp_2026: 50 })]);

  it('soal tanpa kunci, reality check, durasi 60 detik', async () => {
    const r = await layananTestDrive(new URLSearchParams('id_prodi=1'), repo, repoTdPalsu().repoTd, tetap);
    expect(r.prodi).toMatchObject({ id_prodi: 1, rumpun_id: 'teknik' });
    expect(r.soal).toHaveLength(3);
    expect(r.soal[0]).toMatchObject({ lapisan: 'spesifik', label_data: 'soal', opsi: { A: 'a', D: 'd' } });
    expect(JSON.stringify(r.soal)).not.toMatch(/kunci|pembahasan/);
    expect(r.reality_check.fakta_persaingan).toMatchObject({ daya_tampung_snbp_2026: 50, keketatan_snbp: { label: 'sedang' } });
    expect(r.durasi_detik).toBe(60);
  });
  it('validasi id_prodi', async () => {
    const td = repoTdPalsu().repoTd;
    await expect(layananTestDrive(new URLSearchParams(''), repo, td)).rejects.toMatchObject({ kode: 'VALIDASI' });
    await expect(layananTestDrive(new URLSearchParams('id_prodi=abc'), repo, td)).rejects.toMatchObject({ kode: 'VALIDASI' });
    await expect(layananTestDrive(new URLSearchParams('id_prodi=9'), repo, td)).rejects.toMatchObject({ kode: 'TIDAK_DITEMUKAN' });
  });
});

describe('POST /api/test-drive/jawab dan /refleksi', () => {
  const repo = repoPalsu([prodi({ id_prodi: 1, rumpun_id: 'teknik' }), prodi({ id_prodi: 2, rumpun_id: 'hukum' })]);

  it('tanpa login: dinilai, tidak disimpan; kunci & pembahasan dikirim', async () => {
    const { repoTd, riwayat } = repoTdPalsu();
    const r = await layananJawabTestDrive(null, { id_prodi: 1, id_soal: 'S1', jawaban: 'C' }, { repo, repoTd, repoAkun });
    expect(r).toEqual({ id_soal: 'S1', benar: true, kunci: 'C', pembahasan: 'Pembahasan S1', tersimpan: false });
    expect(riwayat).toHaveLength(0);
  });

  it('login: jawaban salah dicatat; refleksi mengisi baris terakhir', async () => {
    const { repoTd, riwayat } = repoTdPalsu();
    const deps = { repo, repoTd, repoAkun };
    const r = await layananJawabTestDrive(ID_PENGGUNA, { id_prodi: 1, id_soal: 'R1', jawaban: 'A' }, deps);
    expect(r).toMatchObject({ benar: false, kunci: 'C', tersimpan: true });
    expect(await layananRefleksiTestDrive(ID_PENGGUNA, { id_prodi: 1, refleksi: 'seru' }, deps)).toEqual({ tersimpan: true });
    expect(riwayat).toEqual([{ pengguna: ID_PENGGUNA, id_prodi: 1, id_soal: 'R1', jawaban: 'A', benar: false, refleksi: 'seru' }]);
  });

  it('soal milik prodi lain ditolak; soal/prodi tidak ada -> 404; opsi salah -> 400', async () => {
    const deps = { repo, repoTd: repoTdPalsu().repoTd, repoAkun };
    await expect(layananJawabTestDrive(null, { id_prodi: 2, id_soal: 'S1', jawaban: 'A' }, deps)).rejects.toMatchObject({ kode: 'VALIDASI' });
    await expect(layananJawabTestDrive(null, { id_prodi: 2, id_soal: 'R1', jawaban: 'A' }, deps)).rejects.toMatchObject({ kode: 'VALIDASI' });
    await expect(layananJawabTestDrive(null, { id_prodi: 1, id_soal: 'X', jawaban: 'A' }, deps)).rejects.toMatchObject({ kode: 'TIDAK_DITEMUKAN' });
    await expect(layananJawabTestDrive(null, { id_prodi: 1, id_soal: 'S1', jawaban: 'E' }, deps)).rejects.toMatchObject({ kode: 'VALIDASI' });
  });

  it('refleksi wajib login dan nilai valid', async () => {
    const deps = { repo, repoTd: repoTdPalsu().repoTd, repoAkun };
    await expect(layananRefleksiTestDrive(null, { id_prodi: 1, refleksi: 'seru' }, deps)).rejects.toMatchObject({ kode: 'TIDAK_LOGIN' });
    await expect(layananRefleksiTestDrive('akun-terhapus', { id_prodi: 1, refleksi: 'seru' }, deps)).rejects.toMatchObject({ kode: 'TIDAK_LOGIN' });
    await expect(layananRefleksiTestDrive(ID_PENGGUNA, { id_prodi: 1, refleksi: 'bosan' }, deps)).rejects.toMatchObject({ kode: 'VALIDASI' });
  });
});

describe('refleksi sebagai tie-breaker kecocokan (BR-10)', () => {
  const dasar: HasilKecocokanProdi = {
    id_prodi: 1, nama_prodi: 'X', id_ptn: 1, nama_ptn: 'P', jenjang: 'S1', rumpun_id: 'r', kode_holland: 'ICR',
    skor: 90, label: 'Sangat cocok', skor_profil: 90, skor_hobi: null, c_index: 10, mapel_favorit_cocok: 0, refleksi: null,
  };
  it('seru > kosong > melelahkan, setelah skor dan mapel', () => {
    const urut = [
      { ...dasar, id_prodi: 1, refleksi: 'melelahkan' as const },
      { ...dasar, id_prodi: 2 },
      { ...dasar, id_prodi: 3, refleksi: 'seru' as const },
      { ...dasar, id_prodi: 4, refleksi: 'melelahkan' as const, mapel_favorit_cocok: 1 },
    ].sort(bandingkanHasil);
    expect(urut.map((h) => h.id_prodi)).toEqual([4, 3, 2, 1]);
  });

  const repo = repoPalsu([prodi({ id_prodi: 1 }), prodi({ id_prodi: 2 })]); // vektor sama -> skor seri
  const minat = jawaban({ R: 2, I: 4, A: 1, S: 1, E: 0, C: 3 });

  it('refleksi dari badan request', async () => {
    const r = await layananKecocokan({ jawaban_minat: minat, refleksi: { '2': 'seru' } }, repo);
    expect(r.hasil.map((h) => [h.id_prodi, h.refleksi])).toEqual([[2, 'seru'], [1, null]]);
  });
  it('tanpa refleksi di badan memakai refleksi tersimpan pengguna', async () => {
    const r = await layananKecocokan({ jawaban_minat: minat }, repo, async () => ({ '1': 'melelahkan' }));
    expect(r.hasil.map((h) => h.id_prodi)).toEqual([2, 1]);
  });
  it('kunci refleksi harus id angka dan nilai valid', async () => {
    await expect(layananKecocokan({ jawaban_minat: minat, refleksi: { abc: 'seru' } }, repo)).rejects.toMatchObject({ kode: 'VALIDASI' });
    await expect(layananKecocokan({ jawaban_minat: minat, refleksi: { '1': 'oke' } }, repo)).rejects.toMatchObject({ kode: 'VALIDASI' });
  });
});
