import { describe, expect, it } from 'vitest';
import { tangani } from '@/lib/api/galat';
import { validasiPreferensi } from '@/lib/api/validasi';
import { butuhLogin, HALAMAN_WAJIB_LOGIN, SESI_DETIK, tujuanSetelahLogin, urlGerbangLogin } from '@/lib/auth/rute';
import { headerHapusCookieSesi } from '@/lib/auth/sesi';
import { layananHapusAkun, layananStatusAkun, profilGoogleValid, sinkronPengguna } from '@/lib/layanan/akun';
import { layananAmbilPreferensi, layananSimpanPreferensi } from '@/lib/layanan/preferensi';
import type { RepoAkun, SimpanPreferensi } from '@/lib/layanan/repo_akun';
import { config } from '@/middleware';
import { ITEM, jawaban } from './repo_palsu';

const ID = '11111111-2222-3333-4444-555555555555';

function repoAkunPalsu() {
  const pengguna = new Map<string, { id: string; google_sub: string; email: string; nama: string | null }>();
  const pref = new Map<string, SimpanPreferensi>();
  const repo: RepoAkun = {
    async upsertPengguna(d) {
      const ada = [...pengguna.values()].find((p) => p.google_sub === d.google_sub);
      const id = ada?.id ?? (pengguna.size === 0 ? ID : `id-${pengguna.size}`);
      pengguna.set(id, { id, ...d });
      return id;
    },
    ambilPengguna: async (id) => pengguna.get(id) ?? null,
    async hapusPengguna(id) {
      pengguna.delete(id);
      pref.delete(id); // meniru on delete cascade
    },
    sudahIsiPreferensi: async (id) => pref.has(id),
    async ambilPreferensi(id) {
      const p = pref.get(id);
      if (!p) return null;
      const akademik = p.akademik && { ...p.akademik };
      if (akademik) delete (akademik as { kode_kab?: string | null }).kode_kab;
      return {
        minat: p.minat,
        jalur: p.jalur,
        akademik,
        skor_riasec: p.skor_riasec,
        kode_holland: p.kode_holland,
        diperbarui_pada: '2026-10-15T00:00:00Z',
      };
    },
    async simpanPreferensi(id, d) {
      pref.set(id, d);
    },
    kodeKabSekolah: async (npsn) => (npsn === '20500001' ? '356000' : null),
    idPtnAda: async (ids) => ids.filter((i) => i < 1000),
    itemMinat: async () => ITEM,
  };
  return { repo, pengguna, pref };
}

const PROFIL = { sub: 'google-123', email: 'siswa@example.com', name: ' Siswa ', email_verified: true };

const BADAN_PREF = {
  minat: { jawaban_minat: jawaban({ R: 2, I: 4, A: 1, S: 1, E: 0, C: 3 }), chip_hobi: ['H04'], mapel_favorit: ['Biologi'] },
  jalur: { ikut_snbp: true, ikut_snbt: true, tahun_lulus: 2026 },
  akademik: {
    npsn: '20500001',
    jurusan_sekolah: 'MIPA',
    rapor_rata: 88.5,
    nilai_mapel_pendukung: { Biologi: 90 },
    peringkat_paralel: 4,
    nilai_tka: { matematika: 60 },
    prestasi: [{ tingkat: 'provinsi', bidang: 'OSN Biologi', peringkat: 'juara 2' }],
    reputasi_alumni: 'rutin_lolos',
    kampus_alumni: [361],
  },
};

describe('aturan rute (F-02)', () => {
  it('smart routing', () => {
    expect(tujuanSetelahLogin(false, false)).toBe('/');
    expect(tujuanSetelahLogin(true, false)).toBe('/preferensi');
    expect(tujuanSetelahLogin(true, true)).toBe('/cocokin');
  });
  it('halaman wajib login, tanpa salah cocok prefix', () => {
    expect(butuhLogin('/preferensi')).toBe(true);
    expect(butuhLogin('/preferensi/minat')).toBe(true);
    expect(butuhLogin('/cocokin')).toBe(true);
    expect(butuhLogin('/rekomendasi')).toBe(true);
    expect(butuhLogin('/katalog')).toBe(false);
    expect(butuhLogin('/')).toBe(false);
    expect(butuhLogin('/preferensi-lain')).toBe(false);
    expect(butuhLogin('/api/prodi')).toBe(false);
  });
  it('matcher middleware sama dengan daftar halaman wajib login', () => {
    expect(config.matcher).toEqual(HALAMAN_WAJIB_LOGIN.map((p) => `${p}/:path*`));
  });
  it('gerbang login hanya menyimpan path relatif (tanpa open redirect)', () => {
    expect(urlGerbangLogin('/preferensi/minat')).toBe('/?login=1&kembali=%2Fpreferensi%2Fminat');
    expect(urlGerbangLogin('//jahat.example')).toBe('/?login=1&kembali=%2F');
  });
  it('sesi 30 hari', () => {
    expect(SESI_DETIK).toBe(2_592_000);
  });
});

describe('akun', () => {
  it('hanya email Google terverifikasi yang diterima', () => {
    expect(profilGoogleValid(PROFIL)).toBe(true);
    expect(profilGoogleValid({ ...PROFIL, email_verified: false })).toBe(false);
    expect(profilGoogleValid({ ...PROFIL, sub: '' })).toBe(false);
  });

  it('login berulang memakai pengguna yang sama; nama dirapikan', async () => {
    const { repo, pengguna } = repoAkunPalsu();
    const a = await sinkronPengguna(PROFIL, repo);
    const b = await sinkronPengguna({ ...PROFIL, name: 'Nama Baru' }, repo);
    expect(a).toBe(b);
    expect(pengguna.size).toBe(1);
    expect(pengguna.get(a)?.nama).toBe('Nama Baru');
    await expect(sinkronPengguna({ ...PROFIL, email_verified: false }, repo)).rejects.toThrow();
  });

  it('status: belum login, lalu login tanpa preferensi', async () => {
    const { repo } = repoAkunPalsu();
    expect(await layananStatusAkun(null, repo)).toEqual({ login: false, pengguna: null, sudah_isi_preferensi: false });
    const id = await sinkronPengguna(PROFIL, repo);
    expect(await layananStatusAkun(id, repo)).toEqual({
      login: true,
      pengguna: { nama: 'Siswa', email: 'siswa@example.com' },
      sudah_isi_preferensi: false,
    });
  });

  it('sesi milik akun yang sudah dihapus dianggap belum login', async () => {
    const { repo } = repoAkunPalsu();
    expect((await layananStatusAkun(ID, repo)).login).toBe(false);
  });

  it('hapus akun: wajib login dan konfirmasi "HAPUS", data ikut terhapus', async () => {
    const { repo, pengguna, pref } = repoAkunPalsu();
    const id = await sinkronPengguna(PROFIL, repo);
    await layananSimpanPreferensi(id, BADAN_PREF, repo);
    await expect(layananHapusAkun(null, { konfirmasi: 'HAPUS' }, repo)).rejects.toMatchObject({ kode: 'TIDAK_LOGIN' });
    await expect(layananHapusAkun(id, { konfirmasi: 'hapus' }, repo)).rejects.toMatchObject({ kode: 'VALIDASI' });
    expect(await layananHapusAkun(id, { konfirmasi: 'HAPUS' }, repo)).toEqual({ terhapus: true });
    expect(pengguna.size).toBe(0);
    expect(pref.size).toBe(0);
  });

  it('header penghapus cookie sesi', () => {
    const h = headerHapusCookieSesi();
    expect(h).toHaveLength(2);
    expect(h.every((c) => c.includes('Max-Age=0') && c.includes('HttpOnly'))).toBe(true);
    expect(h[1]).toContain('Secure');
  });

  it('galat belum login -> 401', async () => {
    const r = await tangani(() => layananAmbilPreferensi(null, repoAkunPalsu().repo));
    expect(r.status).toBe(401);
    expect(await r.json()).toMatchObject({ error: { kode: 'TIDAK_LOGIN' } });
  });
});

describe('preferensi', () => {
  it('simpan lalu ambil; skor RIASEC dihitung server; kab/kota dari sekolah', async () => {
    const { repo, pref } = repoAkunPalsu();
    const id = await sinkronPengguna(PROFIL, repo);
    const r = await layananSimpanPreferensi(id, BADAN_PREF, repo);
    expect(r.data).toMatchObject({ kode_holland: 'ICR', minat: { mode: 'mini_ip_30' }, jalur: { pernah_lulus_snbp: false } });
    expect(r.data!.skor_riasec.I).toBe(7);
    expect(pref.get(id)!.akademik!.kode_kab).toBe('356000');
    expect((await layananStatusAkun(id, repo)).sudah_isi_preferensi).toBe(true);
    expect((await layananAmbilPreferensi(id, repo)).data!.akademik!.rapor_rata).toBe(88.5);
  });

  it('akademik boleh null', async () => {
    const { repo } = repoAkunPalsu();
    const id = await sinkronPengguna(PROFIL, repo);
    const r = await layananSimpanPreferensi(id, { ...BADAN_PREF, akademik: null }, repo);
    expect(r.data!.akademik).toBeNull();
  });

  it('menolak NPSN, kampus, skala, dan isian yang tidak valid', async () => {
    const { repo } = repoAkunPalsu();
    const id = await sinkronPengguna(PROFIL, repo);
    const ak = BADAN_PREF.akademik;
    await expect(layananSimpanPreferensi(id, { ...BADAN_PREF, akademik: { ...ak, npsn: '99999999' } }, repo)).rejects.toMatchObject({ kode: 'TIDAK_DITEMUKAN' });
    await expect(layananSimpanPreferensi(id, { ...BADAN_PREF, akademik: { ...ak, kampus_alumni: [5000] } }, repo)).rejects.toMatchObject({ kode: 'VALIDASI' });
    await expect(
      layananSimpanPreferensi(id, { ...BADAN_PREF, minat: { ...BADAN_PREF.minat, jawaban_minat: { R1: 2 } } }, repo),
    ).rejects.toMatchObject({ kode: 'VALIDASI' });
    expect(() => validasiPreferensi({ ...BADAN_PREF, jalur: { ikut_snbp: 'ya', ikut_snbt: true } })).toThrow();
    expect(() => validasiPreferensi({ ...BADAN_PREF, akademik: { ...ak, prestasi: [1, 2, 3, 4] } })).toThrow();
    expect(() => validasiPreferensi({ ...BADAN_PREF, akademik: { ...ak, reputasi_alumni: 'bagus' } })).toThrow();
  });

  it('tanpa login atau akun sudah dihapus -> TIDAK_LOGIN', async () => {
    const { repo } = repoAkunPalsu();
    await expect(layananSimpanPreferensi(null, BADAN_PREF, repo)).rejects.toMatchObject({ kode: 'TIDAK_LOGIN' });
    await expect(layananSimpanPreferensi(ID, BADAN_PREF, repo)).rejects.toMatchObject({ kode: 'TIDAK_LOGIN' });
  });
});
