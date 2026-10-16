// @vitest-environment node
/**
 * T-10: QA 10 skenario siswa terhadap data Supabase asli (prodi, sekolah, PTN, soal).
 * Akun & preferensi memakai repo palsu di memori, jadi TIDAK ADA tulisan ke DB.
 * Dilewati otomatis bila kunci Supabase tidak ada. Jalankan:
 *   node --env-file=.env node_modules/vitest/vitest.mjs run tests/qa
 * Hasil & temuan: docs/QA_SOAL_DEMO.md.
 */
import { describe, expect, it } from 'vitest';
import { repoAkunSupabase } from '@/lib/db/repo_akun_supabase';
import { repoSupabase } from '@/lib/db/repo_supabase';
import { sinkronPengguna } from '@/lib/layanan/akun';
import { layananPeluang } from '@/lib/layanan/peluang';
import { layananBuatPreferensi } from '@/lib/layanan/preferensi';
import { layananDetailProdi } from '@/lib/layanan/prodi';
import { layananRekomendasi } from '@/lib/layanan/rekomendasi';
import type { RepoAkun } from '@/lib/layanan/repo_akun';
import { layananTestDrive } from '@/lib/layanan/test_drive';
import type { Skala } from '@/lib/skoring';
import { repoAkunPalsu } from '../api/repo_akun_palsu';

const ADA_DB = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
const WAKTU = 60_000;

// Data nyata (diambil dari DB 2026-10-16).
const SEKOLAH = {
  aceh: '10100269', // MAN 2 Aceh Besar, akreditasi A, kuota MIPA 15
  jabar: '20200670', // Jawa Barat, akreditasi A, kuota MIPA 10
  tanpaPdss: '10105745', // Aceh, akreditasi A, kuota_siswa 0
  papuaBaratDaya: '60400310',
  papuaPegunungan: '60300979',
};
const PRODI = { ugm: 361001, ui: 321001, unipa: 921001, uncen: 911001, prodiBaru: 111080, steiK: 332021, tiIts: 382020, tiUgm: 361045 };

const PROFIL_I = { R: 2, I: 4, A: 1, S: 1, E: 0, C: 3 } as const;
const PROFIL_A = { R: 0, I: 1, A: 4, S: 2, E: 1, C: 0 } as const;

/** Repo akun: preferensi di memori, data referensi (sekolah, PTN, item minat) dari DB asli. */
function repoAkunUji(): RepoAkun {
  return {
    ...repoAkunPalsu().repo,
    kodeKabSekolah: repoAkunSupabase.kodeKabSekolah,
    idPtnAda: repoAkunSupabase.idPtnAda,
    itemMinat: repoAkunSupabase.itemMinat,
  };
}

async function jawaban(nilai: Record<Skala, number>) {
  const items = await repoSupabase.itemMinat();
  return Object.fromEntries(items.filter((it) => it.mini_ip_30).map((it) => [it.item_id, nilai[it.skala]]));
}

async function siswa(isi: { jalur: 'snbp' | 'snbt'; minat?: Record<Skala, number>; tahun_lulus?: number; pernah_lulus_snbp?: boolean; akademik?: unknown; riwayat_to?: unknown[] }) {
  const repoAkun = repoAkunUji();
  const id = await sinkronPengguna({ sub: `qa-${Math.random()}`, email: 'qa@example.com', name: 'QA', email_verified: true }, repoAkun);
  const badan = {
    nama: `QA ${isi.jalur}`,
    jalur: isi.jalur,
    minat: { jawaban_minat: await jawaban(isi.minat ?? PROFIL_I), chip_hobi: ['H04'], mapel_favorit: ['Biologi'] },
    kelulusan: { tahun_lulus: isi.tahun_lulus ?? 2026, pernah_lulus_snbp: isi.pernah_lulus_snbp ?? false },
    akademik: isi.akademik ?? null,
    riwayat_to: isi.riwayat_to ?? [],
  };
  return { id, repoAkun, badan };
}

const akademik = (npsn: string, peringkat: number, lain: Record<string, unknown> = {}) => ({
  npsn,
  jurusan_sekolah: 'MIPA',
  rapor_rata: 90,
  nilai_mapel_pendukung: { Biologi: 92, Kimia: 88 },
  peringkat_paralel: peringkat,
  nilai_tka: { matematika: 60 },
  prestasi: [],
  reputasi_alumni: 'rutin_lolos',
  kampus_alumni: [],
  ...lain,
});

const profilPeluang = (npsn: string, lain: Record<string, unknown> = {}) => ({
  tahun_lulus: 2026,
  npsn,
  jurusan_sekolah: 'MIPA',
  peringkat_paralel: 3,
  rapor_rata: 88,
  ...lain,
});

describe.skipIf(!ADA_DB)('QA 10 skenario siswa (data Supabase asli)', () => {
  it('S1 SMA Aceh, MIPA, minat Investigative: 3 kartu SNBP, pasangan #1+#2 sah BR-01', async () => {
    const s = await siswa({ jalur: 'snbp', akademik: akademik(SEKOLAH.aceh, 2) });
    await layananBuatPreferensi(s.id, s.badan, s.repoAkun);
    const { data } = await layananRekomendasi(s.id, { repo: repoSupabase, repoAkun: s.repoAkun });
    expect(data!.kartu.map((k) => k.jenis)).toEqual(['dream_goal', 'safety_net', 'alternatif']);
    expect(data!.validasi_provinsi_snbp?.valid).toBe(true);
    expect(data!.kartu[1].prodi.rumpun_id).toBe(data!.kartu[0].prodi.rumpun_id);
    expect(data!.kartu[2].prodi.rumpun_id).not.toBe(data!.kartu[0].prodi.rumpun_id);
    expect(data!.kartu.every((k) => k.detail.peluang_snbp?.dihitung)).toBe(true);
  }, WAKTU);

  it('S2 SMA Jawa Barat: bila Dream di luar Jabar, Safety Net wajib di Jabar', async () => {
    const s = await siswa({ jalur: 'snbp', akademik: akademik(SEKOLAH.jabar, 1) });
    await layananBuatPreferensi(s.id, s.badan, s.repoAkun);
    const { data } = await layananRekomendasi(s.id, { repo: repoSupabase, repoAkun: s.repoAkun });
    const [dream, safety] = data!.kartu;
    expect(data!.validasi_provinsi_snbp?.valid).toBe(true);
    const dreamDiJabar = dream.prodi.provinsi_ptn === 'Jawa Barat';
    expect(dreamDiJabar || safety.prodi.provinsi_ptn === 'Jawa Barat').toBe(true);
  }, WAKTU);

  it('S3 peringkat di luar kuota eligible: SNBP tidak dihitung, arahkan ke SNBT (BR-04)', async () => {
    const s = await siswa({ jalur: 'snbp', akademik: akademik(SEKOLAH.aceh, 16) });
    await layananBuatPreferensi(s.id, s.badan, s.repoAkun);
    const { data } = await layananRekomendasi(s.id, { repo: repoSupabase, repoAkun: s.repoAkun });
    expect(data!.kartu.every((k) => k.detail.peluang_snbp?.dihitung === false)).toBe(true);
    expect(data!.catatan.join(' ')).toContain('fokus ke SNBT');
  }, WAKTU);

  it('S4 sekolah tanpa data PDSS: kuota diperkirakan dari akreditasi (A = 40%)', async () => {
    const r = await layananPeluang(
      { jalur: 'snbp', id_prodi: [PRODI.ugm], profil: profilPeluang(SEKOLAH.tanpaPdss, { jumlah_siswa_jurusan: 100, peringkat_paralel: 30 }) },
      repoSupabase,
    );
    expect(r.sekolah).toMatchObject({ kuota_jurusan: 40, sumber_kuota: 'perkiraan_akreditasi' });
    expect(r.hasil[0].snbp!.dihitung).toBe(true);
    expect(r.hasil[0].snbp!.alasan[0]).toContain('diperkirakan dari akreditasi');
  }, WAKTU);

  it('S5 lulusan 2025 (gap year): tidak bisa membuat preferensi SNBP, bisa SNBT (BR-11)', async () => {
    const snbp = await siswa({ jalur: 'snbp', tahun_lulus: 2025, akademik: akademik(SEKOLAH.aceh, 2) });
    await expect(layananBuatPreferensi(snbp.id, snbp.badan, snbp.repoAkun)).rejects.toMatchObject({ kode: 'VALIDASI' });
    const snbt = await siswa({ jalur: 'snbt', tahun_lulus: 2025 });
    expect((await layananBuatPreferensi(snbt.id, snbt.badan, snbt.repoAkun)).data!.jalur).toBe('snbt');
  }, WAKTU);

  it('S6 pernah lulus SNBP: tidak bisa membuat preferensi SNBT 2026', async () => {
    const s = await siswa({ jalur: 'snbt', tahun_lulus: 2025, pernah_lulus_snbp: true });
    await expect(layananBuatPreferensi(s.id, s.badan, s.repoAkun)).rejects.toMatchObject({ kode: 'VALIDASI' });
  }, WAKTU);

  it('S7 SNBT: peluang naik seiring skor TO; tanpa TO ada catatan', async () => {
    const to = (skor: number) => [{ tanggal: '2026-10-01', sumber_to: 'QA', skala: 'bimbel', skor: { pu: skor, ppu: skor, pbm: skor, pk: skor, lit_ind: skor, lit_ing: skor, pm: skor } }];
    const hasil = async (riwayat: unknown[]) => {
      const s = await siswa({ jalur: 'snbt', riwayat_to: riwayat });
      await layananBuatPreferensi(s.id, s.badan, s.repoAkun);
      return (await layananRekomendasi(s.id, { repo: repoSupabase, repoAkun: s.repoAkun })).data!;
    };
    const [tinggi, rendah, kosong] = [await hasil(to(750)), await hasil(to(450)), await hasil([])];
    expect(tinggi.kartu[0].prodi.id_prodi).toBe(rendah.kartu[0].prodi.id_prodi);
    expect(tinggi.kartu[0].detail.peluang_snbt!.peluang!).toBeGreaterThan(rendah.kartu[0].detail.peluang_snbt!.peluang!);
    expect(kosong.kartu[0].detail.peluang_snbt!.dihitung).toBe(false);
    expect(kosong.catatan.join(' ')).toContain('try out');
  }, WAKTU);

  it('S8 minat Artistic: Dream Goal berkode Holland A; prodi seni membawa flag portofolio (BR-15)', async () => {
    const s = await siswa({ jalur: 'snbt', minat: PROFIL_A, riwayat_to: [] });
    await layananBuatPreferensi(s.id, s.badan, s.repoAkun);
    const { data } = await layananRekomendasi(s.id, { repo: repoSupabase, repoAkun: s.repoAkun });
    expect(data!.kode_holland[0]).toBe('A');
    expect(data!.kartu[0].detail.kode_holland[0]).toBe('A');
    const semua = await repoSupabase.semuaProdi();
    const seni = semua.find((b) => b.portofolio && b.ada_snbt)!;
    expect((await layananDetailProdi(String(seni.id_prodi), repoSupabase)).data.portofolio).toBeTruthy();
  }, WAKTU);

  it('S9 prodi baru tanpa histori: fallback rumpun di PTN sama, berlabel data terbatas (BR-08)', async () => {
    const r = await layananPeluang({ jalur: 'snbp', id_prodi: [PRODI.prodiBaru], profil: profilPeluang(SEKOLAH.aceh) }, repoSupabase);
    expect(r.hasil[0].snbp).toMatchObject({ dihitung: true, data_terbatas: true });
    expect(r.hasil[0].snbp!.alasan[1]).toContain('data terbatas');
  }, WAKTU);

  it('S10 aturan satu provinsi lewat crosswalk: UI (2 provinsi), Universitas Papua, pemekaran Papua', async () => {
    const valid = async (npsn: string, ids: number[]) =>
      (await layananPeluang({ jalur: 'snbp', id_prodi: ids, profil: profilPeluang(npsn) }, repoSupabase)).validasi_provinsi_snbp!.valid;
    expect(await valid(SEKOLAH.jabar, [PRODI.ugm, PRODI.ui])).toBe(true); // UI juga terdaftar di Jawa Barat
    expect(await valid(SEKOLAH.aceh, [PRODI.ugm, PRODI.ui])).toBe(false);
    expect(await valid(SEKOLAH.papuaBaratDaya, [PRODI.ugm, PRODI.unipa])).toBe(true); // UNIPA: Papua Barat & Papua Barat Daya
    expect(await valid(SEKOLAH.papuaPegunungan, [PRODI.ugm, PRODI.uncen])).toBe(false); // pemekaran 2022: bukan provinsi Papua lagi
  }, WAKTU);
});

describe.skipIf(!ADA_DB)('QA soal prodi demo (setelah scripts/tinjau_soal_demo.sql)', () => {
  it('Simulasi 3 prodi demo hanya memakai soal yang sudah ditinjau tim', async () => {
    for (const id of [PRODI.steiK, PRODI.tiIts, PRODI.tiUgm]) {
      const r = await layananTestDrive(new URLSearchParams({ id_prodi: String(id) }), repoSupabase, {
        soalUntukProdi: (await import('@/lib/db/repo_test_drive_supabase')).repoTestDriveSupabase.soalUntukProdi,
        soalById: async () => null,
        simpanJawaban: async () => {},
      });
      expect(r.soal.length).toBeGreaterThanOrEqual(2);
      expect(r.soal.every((q) => q.status === 'ditinjau_tim')).toBe(true);
    }
  }, WAKTU);
});
