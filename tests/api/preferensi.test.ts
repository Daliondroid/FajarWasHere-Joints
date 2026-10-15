import { describe, expect, it } from 'vitest';
import { validasiIsiPreferensi, validasiNilaiTka } from '@/lib/api/validasi';
import { layananStatusAkun, sinkronPengguna } from '@/lib/layanan/akun';
import {
  layananAktifkanPreferensi,
  layananAmbilPreferensi,
  layananBuatPreferensi,
  layananDaftarPreferensi,
  layananGantiNamaPreferensi,
  layananHapusPreferensi,
  layananPreferensiAktif,
  layananUbahPreferensi,
  skorToTerbaru,
} from '@/lib/layanan/preferensi';
import { BADAN_PREF, BADAN_PREF_SNBT, ID_PENGGUNA, repoAkunPalsu } from './repo_akun_palsu';
import { prodi, repoPalsu } from './repo_palsu';

const PROFIL = { sub: 'google-123', email: 'siswa@example.com', name: 'Siswa', email_verified: true };

async function siap() {
  const r = repoAkunPalsu();
  const id = await sinkronPengguna(PROFIL, r.repo);
  return { ...r, id };
}

describe('membuat dan membaca preferensi (BR-16, BR-17)', () => {
  it('preferensi pertama aktif; skor RIASEC dihitung server; kab/kota dari sekolah', async () => {
    const { repo, pref, id } = await siap();
    const { data } = await layananBuatPreferensi(id, BADAN_PREF, repo);
    expect(data).toMatchObject({ nama: 'Impian Kedokteran', jalur: 'snbp', aktif: true, kode_holland: 'ICR', skor_to_terbaru: null });
    expect(data!.akademik!.nilai_tka.pilihan).toHaveLength(2);
    expect(pref.get(data!.id)!.akademik!.kode_kab).toBe('356000');
    expect((await layananStatusAkun(id, repo)).sudah_isi_preferensi).toBe(true);
    expect((await layananPreferensiAktif(id, repo)).data!.id).toBe(data!.id);
  });

  it('preferensi baru menggeser status aktif; tepat satu aktif', async () => {
    const { repo, id } = await siap();
    const a = (await layananBuatPreferensi(id, BADAN_PREF, repo)).data!;
    const b = (await layananBuatPreferensi(id, BADAN_PREF_SNBT, repo)).data!;
    expect(b.aktif).toBe(true);
    expect((await layananAmbilPreferensi(id, a.id, repo)).data!.aktif).toBe(false);
    const daftar = (await layananDaftarPreferensi(id, repo, repoPalsu([]))).data;
    expect(daftar.filter((p) => p.aktif)).toHaveLength(1);
    expect(daftar[0].id).toBe(b.id);
  });

  it('SNBT: riwayat TO disimpan, skor_to_terbaru = rata-rata subtes terisi pada TO terbaru', async () => {
    const { repo, id } = await siap();
    const { data } = await layananBuatPreferensi(id, BADAN_PREF_SNBT, repo);
    expect(data!.riwayat_to).toHaveLength(2);
    expect(data!.akademik).toBeNull();
    expect(data!.skor_to_terbaru).toBeCloseTo((700 + 650 + 650) / 3, 1);
  });

  it('daftar kartu memuat rekomendasi teratas', async () => {
    const { repo, id } = await siap();
    await layananBuatPreferensi(id, BADAN_PREF, repo);
    const repoProdi = repoPalsu([
      prodi({ id_prodi: 1, r: 1, i: 1, a: 7, s: 7, e: 1, c: 1, kode_holland: 'ASR' }),
      prodi({ id_prodi: 2, nama: 'BIOLOGI', r: 4, i: 7, a: 2.5, s: 2.5, e: 1, c: 5.5, kode_holland: 'ICR' }),
    ]);
    const [kartu] = (await layananDaftarPreferensi(id, repo, repoProdi)).data;
    expect(kartu.rekomendasi_teratas).toMatchObject({ id_prodi: 2, nama_prodi: 'BIOLOGI' });
  });

  it('nama wajib unik per akun (tanpa beda huruf besar/kecil)', async () => {
    const { repo, id } = await siap();
    await layananBuatPreferensi(id, BADAN_PREF, repo);
    await expect(layananBuatPreferensi(id, { ...BADAN_PREF, nama: 'impian kedokteran' }, repo)).rejects.toMatchObject({ kode: 'VALIDASI' });
  });
});

describe('aturan jalur (BR-11, BR-17)', () => {
  it('lulusan 2025 tidak bisa membuat preferensi SNBP', async () => {
    const { repo, id } = await siap();
    await expect(
      layananBuatPreferensi(id, { ...BADAN_PREF, kelulusan: { tahun_lulus: 2025, pernah_lulus_snbp: false } }, repo),
    ).rejects.toMatchObject({ kode: 'VALIDASI' });
  });

  it('pernah lulus SNBP tidak bisa membuat preferensi SNBT', async () => {
    const { repo, id } = await siap();
    await expect(
      layananBuatPreferensi(id, { ...BADAN_PREF_SNBT, kelulusan: { tahun_lulus: 2025, pernah_lulus_snbp: true } }, repo),
    ).rejects.toMatchObject({ kode: 'VALIDASI' });
  });

  it('jalur tidak bisa diubah saat edit; edit lain diterima', async () => {
    const { repo, id } = await siap();
    const a = (await layananBuatPreferensi(id, BADAN_PREF, repo)).data!;
    await expect(layananUbahPreferensi(id, a.id, BADAN_PREF_SNBT, repo)).rejects.toMatchObject({ kode: 'VALIDASI' });
    const ubah = await layananUbahPreferensi(id, a.id, { ...BADAN_PREF, minat: { ...BADAN_PREF.minat, mapel_favorit: ['Kimia'] } }, repo);
    expect(ubah.data!.minat.mapel_favorit).toEqual(['Kimia']);
  });

  it('bahan tidak sesuai jalur ditolak', () => {
    expect(() => validasiIsiPreferensi({ ...BADAN_PREF_SNBT, akademik: BADAN_PREF.akademik })).toThrow();
    expect(() => validasiIsiPreferensi({ ...BADAN_PREF, riwayat_to: BADAN_PREF_SNBT.riwayat_to })).toThrow();
  });
});

describe('ganti nama, aktifkan, hapus (F-18, F-19)', () => {
  it('ganti nama dan jadikan aktif', async () => {
    const { repo, id } = await siap();
    const a = (await layananBuatPreferensi(id, BADAN_PREF, repo)).data!;
    await layananBuatPreferensi(id, BADAN_PREF_SNBT, repo);
    expect((await layananGantiNamaPreferensi(id, a.id, { nama: 'Rencana A' }, repo)).data!.nama).toBe('Rencana A');
    expect((await layananAktifkanPreferensi(id, a.id, repo)).data!.aktif).toBe(true);
    expect((await layananPreferensiAktif(id, repo)).data!.id).toBe(a.id);
  });

  it('hapus preferensi aktif -> preferensi lain terbaru jadi aktif; hapus terakhir -> belum punya', async () => {
    const { repo, id } = await siap();
    const a = (await layananBuatPreferensi(id, BADAN_PREF, repo)).data!;
    const b = (await layananBuatPreferensi(id, BADAN_PREF_SNBT, repo)).data!;
    expect(await layananHapusPreferensi(id, b.id, repo)).toEqual({ terhapus: true, id_aktif: a.id });
    expect(await layananHapusPreferensi(id, a.id, repo)).toEqual({ terhapus: true, id_aktif: null });
    expect((await layananStatusAkun(id, repo)).sudah_isi_preferensi).toBe(false);
    expect((await layananPreferensiAktif(id, repo)).data).toBeNull();
  });

  it('preferensi milik akun lain atau id tidak valid', async () => {
    const { repo, id } = await siap();
    const a = (await layananBuatPreferensi(id, BADAN_PREF, repo)).data!;
    const lain = await sinkronPengguna({ ...PROFIL, sub: 'google-lain', email: 'lain@example.com' }, repo);
    await expect(layananAmbilPreferensi(lain, a.id, repo)).rejects.toMatchObject({ kode: 'TIDAK_DITEMUKAN' });
    await expect(layananHapusPreferensi(lain, a.id, repo)).rejects.toMatchObject({ kode: 'TIDAK_DITEMUKAN' });
    await expect(layananAmbilPreferensi(id, 'bukan-uuid', repo)).rejects.toMatchObject({ kode: 'VALIDASI' });
  });

  it('tanpa login atau akun sudah dihapus -> TIDAK_LOGIN', async () => {
    const { repo } = repoAkunPalsu();
    await expect(layananBuatPreferensi(null, BADAN_PREF, repo)).rejects.toMatchObject({ kode: 'TIDAK_LOGIN' });
    await expect(layananPreferensiAktif(ID_PENGGUNA, repo)).rejects.toMatchObject({ kode: 'TIDAK_LOGIN' });
  });
});

describe('validasi isi preferensi', () => {
  it('TKA: 0 atau 2 mapel pilihan berbeda dari daftar resmi (BR-18)', () => {
    expect(validasiNilaiTka({ matematika: 50 }, 'tka')).toEqual({ matematika: 50 });
    expect(() => validasiNilaiTka({ pilihan: [{ mapel: 'Fisika', nilai: 70 }] }, 'tka')).toThrow();
    expect(() => validasiNilaiTka({ pilihan: [{ mapel: 'Fisika', nilai: 70 }, { mapel: 'Fisika', nilai: 60 }] }, 'tka')).toThrow();
    expect(() => validasiNilaiTka({ pilihan: [{ mapel: 'Astronomi', nilai: 70 }, { mapel: 'Fisika', nilai: 60 }] }, 'tka')).toThrow();
  });

  it('nama, TO, dan isian lain', () => {
    expect(() => validasiIsiPreferensi({ ...BADAN_PREF, nama: '' })).toThrow();
    expect(() => validasiIsiPreferensi({ ...BADAN_PREF, nama: 'x'.repeat(41) })).toThrow();
    expect(() => validasiIsiPreferensi({ ...BADAN_PREF, jalur: 'mandiri' })).toThrow();
    expect(() => validasiIsiPreferensi({ ...BADAN_PREF_SNBT, riwayat_to: [{ tanggal: '15-10-2026', skor: { pu: 1 } }] })).toThrow();
    expect(() => validasiIsiPreferensi({ ...BADAN_PREF_SNBT, riwayat_to: [{ tanggal: '2026-10-15', skor: {} }] })).toThrow();
    expect(() => validasiIsiPreferensi({ ...BADAN_PREF, akademik: { ...BADAN_PREF.akademik, reputasi_alumni: 'bagus' } })).toThrow();
  });

  it('kampus alumni dan NPSN dicek ke data', async () => {
    const { repo, id } = await siap();
    const ak = BADAN_PREF.akademik;
    await expect(layananBuatPreferensi(id, { ...BADAN_PREF, akademik: { ...ak, npsn: '99999999' } }, repo)).rejects.toMatchObject({ kode: 'TIDAK_DITEMUKAN' });
    await expect(layananBuatPreferensi(id, { ...BADAN_PREF, akademik: { ...ak, kampus_alumni: [5000] } }, repo)).rejects.toMatchObject({ kode: 'VALIDASI' });
  });

  it('skorToTerbaru tanpa TO -> null', () => {
    expect(skorToTerbaru([])).toBeNull();
  });
});
