import { describe, expect, it } from 'vitest';
import { DEKLARASI_ALAT, jalankanAlat } from '@/lib/chat/alat';
import { angkaDariTeks, periksaAngka } from '@/lib/chat/grounding';
import { jedaKuota, jenisGalat, panggilDenganUlang } from '@/lib/chat/gemini';
import { GalatKuota, type KeluaranModel, type MasukanModel, type ModelChat } from '@/lib/chat/model';
import { PembatasLaju } from '@/lib/chat/pembatas';
import { sinkronPengguna } from '@/lib/layanan/akun';
import {
  layananHapusRiwayatChat,
  layananKirimPesan,
  layananRiwayatChat,
  MAKS_PUTARAN_ALAT,
  validasiPesan,
} from '@/lib/layanan/chat';
import { layananBuatPreferensi } from '@/lib/layanan/preferensi';
import type { RepoChat } from '@/lib/layanan/repo_chat';
import type { PesanChat } from '@/types';
import { BADAN_PREF, repoAkunPalsu } from './repo_akun_palsu';
import { prodi, repoPalsu } from './repo_palsu';

const PROFIL = { sub: 'g-chat', email: 'chat@example.com', name: 'Siswa', email_verified: true };
const HUKUM = { r: 1, i: 2, a: 5, s: 6, e: 5, c: 2, kode_holland: 'SEA' };
const PRODI = [
  prodi({ id_prodi: 1, nama: 'BIOLOGI', kode_bps_ptn: '35', rasio_terima_snbp_2025: 0.2156 }),
  prodi({ id_prodi: 2, kode_bps_ptn: '35', rasio_terima_snbp_2025: 0.4 }),
  prodi({ id_prodi: 3, rumpun_id: 'hukum', kode_bps_ptn: '35', rasio_terima_snbp_2025: 0.3, ...HUKUM }),
];

/** Model palsu: memutar daftar keluaran berurutan dan mencatat masukan. */
function modelSkrip(langkah: (KeluaranModel | Error)[]) {
  const masukan: MasukanModel[] = [];
  const model: ModelChat = {
    async hasilkan(m) {
      masukan.push(structuredClone(m));
      const l = langkah.shift();
      if (!l) throw new Error('skrip habis');
      if (l instanceof Error) throw l;
      return l;
    },
  };
  return { model, masukan };
}

function repoChatPalsu() {
  const pesan: (PesanChat & { pengguna: string })[] = [];
  const repoChat: RepoChat = {
    ambilRiwayat: async (p, batas) => pesan.filter((m) => m.pengguna === p).slice(-batas).map(({ peran, isi, dibuat_pada }) => ({ peran, isi, dibuat_pada })),
    simpanPesan: async (p, peran, isi) => void pesan.push({ pengguna: p, peran, isi, dibuat_pada: `t${pesan.length}` }),
    hapusRiwayat: async (p) => void pesan.splice(0, pesan.length, ...pesan.filter((m) => m.pengguna !== p)),
  };
  return { repoChat, pesan };
}

async function siap(model: ModelChat | null, dgnPreferensi = true) {
  const { repo: repoAkun } = repoAkunPalsu();
  const id = await sinkronPengguna(PROFIL, repoAkun);
  if (dgnPreferensi) await layananBuatPreferensi(id, BADAN_PREF, repoAkun);
  const { repoChat, pesan } = repoChatPalsu();
  const deps = { model: model ? [model] : [], repo: repoPalsu(PRODI), repoAkun, repoChat, pembatas: new PembatasLaju(), sekarang: () => new Date('2026-10-16T00:00:00Z') };
  return { id, deps, pesan };
}

describe('grounding angka (BR-12)', () => {
  it('membaca format angka Indonesia', () => {
    expect(angkaDariTeks('Rasio 21,6% dari 1.250 peminat, daya tampung 72')).toEqual([21.6, 1250, 72]);
  });
  it('angka dari hasil alat lolos, termasuk rasio yang ditulis sebagai persen', () => {
    expect(periksaAngka('Keketatannya 21,6% dengan daya tampung 72 kursi.', [{ rasio: 0.2156, dt: 72 }]).valid).toBe(true);
    expect(periksaAngka('Peluangmu 40–60% (estimasi).', [{ rentang: [40, 60] }]).valid).toBe(true);
  });
  it('angka karangan ditandai; angka kecil dan tahun diabaikan', () => {
    expect(periksaAngka('Daya tampungnya 150 kursi.', [{ dt: 72 }])).toEqual({ valid: false, tanpa_sumber: [150] });
    expect(periksaAngka('Ada 3 kartu untuk SNBP 2026.', []).valid).toBe(true);
  });
});

describe('pembatas laju', () => {
  it('maks N pesan per jendela, lalu pulih', () => {
    const p = new PembatasLaju(2, 1000);
    expect([p.izinkan('a', 0), p.izinkan('a', 10), p.izinkan('a', 20)]).toEqual([true, true, false]);
    expect(p.izinkan('b', 20)).toBe(true);
    expect(p.izinkan('a', 1015)).toBe(true);
  });
});

describe('alat function calling', () => {
  it('semua alat terdeklarasi dengan nama unik', () => {
    expect(new Set(DEKLARASI_ALAT.map((a) => a.nama)).size).toBe(5);
  });
  it('rekomendasi_saya dan peluang_saya memakai preferensi aktif', async () => {
    const { id, deps } = await siap(null);
    const k = { penggunaId: id, repo: deps.repo, repoAkun: deps.repoAkun };
    const rek = (await jalankanAlat('rekomendasi_saya', {}, k)) as { jalur: string; kartu: unknown[] };
    expect(rek.jalur).toBe('SNBP');
    expect(rek.kartu).toHaveLength(3);
    const pel = (await jalankanAlat('peluang_saya', { id_prodi: [1, 3] }, k)) as { hasil: { id_prodi: number }[] };
    expect(pel.hasil.map((h) => h.id_prodi)).toEqual([1, 3]);
  });
  it('galat layanan dikembalikan sebagai data; alat asing ditolak halus', async () => {
    const { id, deps } = await siap(null);
    const k = { penggunaId: id, repo: deps.repo, repoAkun: deps.repoAkun };
    expect(await jalankanAlat('detail_prodi', { id_prodi: 999 }, k)).toMatchObject({ galat: expect.stringContaining('tidak ditemukan') });
    expect(await jalankanAlat('hapus_semua', {}, k)).toMatchObject({ galat: expect.any(String) });
  });
  it('tanpa preferensi -> pesan arahkan isi Preferensi', async () => {
    const { id, deps } = await siap(null, false);
    expect(await jalankanAlat('rekomendasi_saya', {}, { penggunaId: id, repo: deps.repo, repoAkun: deps.repoAkun })).toMatchObject({ tersedia: false });
  });
});

describe('POST /api/chat', () => {
  it('memanggil alat lalu menjawab; angka terverifikasi; riwayat tersimpan', async () => {
    const { model, masukan } = modelSkrip([
      { teks: null, panggilan: [{ nama: 'detail_prodi', argumen: { id_prodi: 1 }, id: 'c1' }] },
      { teks: 'Biologi punya keketatan SNBP 21,6% (sedang).', panggilan: [] },
    ]);
    const { id, deps, pesan } = await siap(model);
    const r = await layananKirimPesan(id, { pesan: 'Seketat apa Biologi?' }, deps);
    expect(r).toMatchObject({ alat_dipakai: ['detail_prodi'], angka_terverifikasi: true, cadangan: false });
    expect(masukan[1].konten.at(-1)!.bagian[0]).toMatchObject({ hasil: { nama: 'detail_prodi', id: 'c1' } });
    expect(masukan[0].sistem).toContain('JANGAN mengarang angka');
    expect(pesan.map((m) => m.peran)).toEqual(['pengguna', 'asisten']);
  });

  it('angka karangan -> diminta tulis ulang sekali; tetap salah -> angka_terverifikasi false', async () => {
    const { model, masukan } = modelSkrip([
      { teks: 'Daya tampungnya 999 kursi.', panggilan: [] },
      { teks: 'Daya tampungnya 888 kursi.', panggilan: [] },
    ]);
    const { id, deps } = await siap(model);
    const r = await layananKirimPesan(id, { pesan: 'Berapa daya tampung Biologi?' }, deps);
    expect(r.angka_terverifikasi).toBe(false);
    expect(masukan[1].alat).toEqual([]);
    expect(JSON.stringify(masukan[1].konten.at(-1))).toContain('999');
  });

  it('perbaikan berhasil -> angka_terverifikasi true', async () => {
    const { model } = modelSkrip([
      { teks: 'Daya tampungnya 999 kursi.', panggilan: [] },
      { teks: 'Datanya tidak tersedia.', panggilan: [] },
    ]);
    const { id, deps } = await siap(model);
    expect((await layananKirimPesan(id, { pesan: 'Berapa daya tampung?' }, deps)).angka_terverifikasi).toBe(true);
  });

  it('batas putaran alat: putaran terakhir dipaksa menjawab tanpa alat', async () => {
    const panggil = { teks: null, panggilan: [{ nama: 'preferensi_aktif', argumen: {} }] };
    const { model, masukan } = modelSkrip([...Array(MAKS_PUTARAN_ALAT).fill(panggil), { teks: 'Selesai.', panggilan: [] }]);
    const { id, deps } = await siap(model);
    const r = await layananKirimPesan(id, { pesan: 'Halo' }, deps);
    expect(r.balasan).toBe('Selesai.');
    expect(masukan.at(-1)!.alat).toEqual([]);
    expect(JSON.stringify(masukan.at(-1)!.konten.at(-1))).toContain('Batas pemanggilan alat');
  });

  it('tanpa kunci Gemini atau Gemini galat -> jawaban cadangan dari rekomendasi', async () => {
    const tanpa = await siap(null);
    const r1 = await layananKirimPesan(tanpa.id, { pesan: 'Rekomendasi aku?' }, tanpa.deps);
    expect(r1).toMatchObject({ cadangan: true, angka_terverifikasi: true });
    expect(r1.balasan).toContain('Dream Goal');
    const galat = await siap(modelSkrip([new Error('503')]).model);
    expect((await layananKirimPesan(galat.id, { pesan: 'Halo' }, galat.deps)).cadangan).toBe(true);
  });

  it('riwayat dikirim sebagai konteks; GET & DELETE riwayat', async () => {
    const { model, masukan } = modelSkrip([
      { teks: 'Halo juga!', panggilan: [] },
      { teks: 'Tentu.', panggilan: [] },
    ]);
    const { id, deps } = await siap(model);
    await layananKirimPesan(id, { pesan: 'Halo' }, deps);
    await layananKirimPesan(id, { pesan: 'Bisa bantu?' }, deps);
    expect(masukan[1].konten.map((k) => k.peran)).toEqual(['user', 'model', 'user']);
    expect((await layananRiwayatChat(id, deps)).data).toHaveLength(4);
    expect(await layananHapusRiwayatChat(id, deps)).toEqual({ terhapus: true });
    expect((await layananRiwayatChat(id, deps)).data).toEqual([]);
  });

  it('validasi, login, dan pembatas laju', async () => {
    const { id, deps } = await siap(null);
    expect(() => validasiPesan({ pesan: '   ' })).toThrow();
    expect(() => validasiPesan({ pesan: 'x'.repeat(1001) })).toThrow();
    await expect(layananKirimPesan(null, { pesan: 'Halo' }, deps)).rejects.toMatchObject({ kode: 'TIDAK_LOGIN' });
    const ketat = { ...deps, pembatas: new PembatasLaju(1, 60_000) };
    await layananKirimPesan(id, { pesan: 'Satu' }, ketat);
    await expect(layananKirimPesan(id, { pesan: 'Dua' }, ketat)).rejects.toMatchObject({ kode: 'TERLALU_SERING', status: 429 });
  });
});

describe('adapter Gemini', () => {
  it('thought signature panggilan alat dikirim balik pada giliran berikutnya', async () => {
    const { model, masukan } = modelSkrip([
      { teks: null, panggilan: [{ nama: 'preferensi_aktif', argumen: {}, id: 'c1', tanda: 'sig-abc' }] },
      { teks: 'Preferensimu jalur SNBP.', panggilan: [] },
    ]);
    const { id, deps } = await siap(model);
    await layananKirimPesan(id, { pesan: 'Preferensiku apa?' }, deps);
    const giliranModel = masukan[1].konten.find((k) => k.peran === 'model' && 'panggilan' in k.bagian[0])!;
    expect(giliranModel.bagian[0]).toMatchObject({ panggilan: { tanda: 'sig-abc' } });
  });
});

describe('rotasi model gratis dan konteks siswa', () => {
  it('model pertama kena kuota -> pesan diulang dengan model berikutnya', async () => {
    const habis = modelSkrip([new GalatKuota('model-a', 30_000)]);
    const cadang = modelSkrip([{ teks: 'Halo dari model B.', panggilan: [] }]);
    const { id, deps } = await siap(null);
    const r = await layananKirimPesan(id, { pesan: 'Halo' }, { ...deps, model: [habis.model, cadang.model] });
    expect(r).toMatchObject({ balasan: 'Halo dari model B.', cadangan: false });
  });

  it('semua model kena kuota -> jawaban cadangan', async () => {
    const { id, deps } = await siap(null);
    const r = await layananKirimPesan(id, { pesan: 'Halo' }, { ...deps, model: [modelSkrip([new GalatKuota('a', 1)]).model, modelSkrip([new GalatKuota('b', 1)]).model] });
    expect(r.cadangan).toBe(true);
  });

  it('data preferensi & rekomendasi ada di instruksi sistem; angkanya sah tanpa memanggil alat', async () => {
    const { model, masukan } = modelSkrip([{ teks: 'Dream Goal-mu kecocokannya tinggi.', panggilan: [] }]);
    const { id, deps } = await siap(model);
    await layananKirimPesan(id, { pesan: 'Rekomendasiku?' }, deps);
    expect(masukan[0].sistem).toContain('"rekomendasi_saya"');
    expect(masukan[0].sistem).toContain('"preferensi_aktif"');
    expect(masukan).toHaveLength(1);
  });

  it('membaca jeda kuota dari galat 429 Gemini', () => {
    expect(jedaKuota({ status: 429, message: '{"retryDelay":"31s"}' })).toBe(31_000);
    expect(jedaKuota(new Error('RESOURCE_EXHAUSTED ... Please retry in 12.5s.'))).toBe(12_500);
    expect(jedaKuota({ status: 429, message: 'x' })).toBe(60_000);
    expect(jedaKuota(new Error('500 internal'))).toBeNull();
  });
});

describe('ketahanan galat Gemini (T-24)', () => {
  it('menggolongkan galat: kuota, sementara, tidak ada, lainnya', () => {
    expect(jenisGalat({ status: 429, message: 'x' })).toBe('kuota');
    expect(jenisGalat({ status: 503, message: 'This model is currently experiencing high demand.' })).toBe('sementara');
    expect(jenisGalat(new Error('{"error":{"code":503,"status":"UNAVAILABLE"}}'))).toBe('sementara');
    expect(jenisGalat(new TypeError('fetch failed'))).toBe('sementara');
    expect(jenisGalat({ status: 404, message: 'models/gemini-2.5-flash-lite is no longer available to new users' })).toBe('tidak_ada');
    expect(jenisGalat(new Error('400 INVALID_ARGUMENT'))).toBeNull();
  });

  it('galat sementara diulang di model yang sama sampai berhasil', async () => {
    let n = 0;
    const peta = new Map<string, number>();
    const hasil = await panggilDenganUlang(
      'm',
      async () => {
        n++;
        if (n < 3) throw { status: 503, message: 'high demand' };
        return 'ok';
      },
      peta,
      [0, 0],
    );
    expect([hasil, n, peta.has('m')]).toEqual(['ok', 3, false]);
  });

  it('sementara berulang / 404 -> model dijeda dan GalatKuota dilempar; galat lain diteruskan', async () => {
    const peta = new Map<string, number>();
    await expect(panggilDenganUlang('a', async () => Promise.reject({ status: 503, message: 'x' }), peta, [0])).rejects.toMatchObject({
      jenis: 'sementara',
    });
    await expect(panggilDenganUlang('b', async () => Promise.reject({ status: 404, message: 'NOT_FOUND' }), peta, [0])).rejects.toBeInstanceOf(GalatKuota);
    expect([peta.has('a'), peta.has('b')]).toEqual([true, true]);
    await expect(panggilDenganUlang('c', async () => Promise.reject(new Error('400 bad')), peta, [0])).rejects.toThrow('400 bad');
    expect(peta.has('c')).toBe(false);
  });

  it('model pertama tidak memberi teks -> pindah ke model berikutnya, bukan cadangan', async () => {
    const kosong = modelSkrip([{ teks: null, panggilan: [] }]);
    const cadang = modelSkrip([{ teks: 'Halo dari model B.', panggilan: [] }]);
    const { id, deps } = await siap(null);
    const r = await layananKirimPesan(id, { pesan: 'Halo' }, { ...deps, model: [kosong.model, cadang.model] });
    expect(r).toMatchObject({ balasan: 'Halo dari model B.', cadangan: false });
  });
  it('melewati batas waktu pesan -> jawaban cadangan, tidak menggantung', async () => {
    const lambat: ModelChat = { hasilkan: () => new Promise(() => undefined) };
    const { id, deps } = await siap(null);
    const r = await layananKirimPesan(id, { pesan: 'Halo' }, { ...deps, model: [lambat], batasMs: 30 });
    expect(r.cadangan).toBe(true);
  });

  it('batas waktu panggilan (abort) digolongkan sementara', () => {
    expect(jenisGalat(new DOMException('The operation was aborted due to timeout', 'TimeoutError'))).toBe('sementara');
  });
});
