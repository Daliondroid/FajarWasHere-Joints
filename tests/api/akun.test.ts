import { describe, expect, it } from 'vitest';
import { tangani } from '@/lib/api/galat';
import { butuhLogin, HALAMAN_WAJIB_LOGIN, SESI_DETIK, tujuanSetelahLogin, urlGerbangLogin } from '@/lib/auth/rute';
import { headerHapusCookieSesi } from '@/lib/auth/sesi';
import { layananHapusAkun, layananStatusAkun, profilGoogleValid, sinkronPengguna } from '@/lib/layanan/akun';
import { layananBuatPreferensi, layananPreferensiAktif } from '@/lib/layanan/preferensi';
import { config } from '@/middleware';
import { BADAN_PREF, ID_PENGGUNA as ID, repoAkunPalsu } from './repo_akun_palsu';

const PROFIL = { sub: 'google-123', email: 'siswa@example.com', name: ' Siswa ', email_verified: true };

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
    await layananBuatPreferensi(id, BADAN_PREF, repo);
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
    const r = await tangani(() => layananPreferensiAktif(null, repoAkunPalsu().repo));
    expect(r.status).toBe(401);
    expect(await r.json()).toMatchObject({ error: { kode: 'TIDAK_LOGIN' } });
  });
});
