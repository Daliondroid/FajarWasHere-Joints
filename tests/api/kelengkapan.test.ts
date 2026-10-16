import { describe, expect, it } from 'vitest';
import { sinkronPengguna } from '@/lib/layanan/akun';
import { LABEL_BAHAN, kekuranganBahan } from '@/lib/layanan/kelengkapan';
import { layananBuatPreferensi } from '@/lib/layanan/preferensi';
import { layananRekomendasi } from '@/lib/layanan/rekomendasi';
import type { AkademikSnbp, TryOut } from '@/types';
import { BADAN_PREF, BADAN_PREF_SNBT, repoAkunPalsu } from './repo_akun_palsu';
import { prodi, repoPalsu } from './repo_palsu';

const PROFIL = { sub: 'g-lengkap', email: 'lengkap@example.com', name: 'Siswa', email_verified: true };

const AKADEMIK: AkademikSnbp = {
  npsn: '20500001',
  jurusan_sekolah: 'MIPA',
  rapor_rata: 88,
  nilai_mapel_pendukung: {},
  peringkat_paralel: 10,
  jumlah_siswa_jurusan: null,
  nilai_tka: {},
  prestasi: [],
  reputasi_alumni: null,
  kampus_alumni: [],
};

describe('kekuranganBahan (T-30)', () => {
  it('SNBP wajib sekolah, rapor, peringkat; TKA opsional', () => {
    expect(kekuranganBahan({ jalur: 'snbp', akademik: AKADEMIK, riwayat_to: [] })).toEqual([]);
    expect(kekuranganBahan({ jalur: 'snbp', akademik: null, riwayat_to: [] })).toEqual([
      LABEL_BAHAN.sekolah,
      LABEL_BAHAN.rapor,
      LABEL_BAHAN.peringkat,
    ]);
    expect(kekuranganBahan({ jalur: 'snbp', akademik: { ...AKADEMIK, rapor_rata: null, peringkat_paralel: 0 }, riwayat_to: [] })).toEqual([
      LABEL_BAHAN.rapor,
      LABEL_BAHAN.peringkat,
    ]);
  });

  it('SNBT wajib minimal satu skor subtes', () => {
    const to = BADAN_PREF_SNBT.riwayat_to[0] as TryOut;
    expect(kekuranganBahan({ jalur: 'snbt', akademik: null, riwayat_to: [to] })).toEqual([]);
    const kosong: TryOut = { ...to, skor: { pu: null, ppu: null, pbm: null, pk: null, lit_ind: null, lit_ing: null, pm: null } };
    expect(kekuranganBahan({ jalur: 'snbt', akademik: null, riwayat_to: [kosong] })).toEqual([LABEL_BAHAN.try_out]);
  });
});

describe('GET /api/rekomendasi menunggu bahan lengkap (T-30)', () => {
  it('rapor kosong -> kartu kosong + bahan_kurang', async () => {
    const { repo: repoAkun } = repoAkunPalsu();
    const id = await sinkronPengguna(PROFIL, repoAkun);
    await layananBuatPreferensi(id, { ...BADAN_PREF, akademik: { ...BADAN_PREF.akademik, rapor_rata: null, peringkat_paralel: null } }, repoAkun);
    const { data } = await layananRekomendasi(id, { repo: repoPalsu([prodi({ id_prodi: 1 })]), repoAkun });
    expect(data!.kartu).toEqual([]);
    expect(data!.bahan_kurang).toEqual([LABEL_BAHAN.rapor, LABEL_BAHAN.peringkat]);
    expect(data!.catatan[0]).toContain('Lengkapi dulu');
  });
});
