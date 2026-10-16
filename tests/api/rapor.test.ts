import { describe, expect, it } from 'vitest';
import { GalatKuota } from '@/lib/chat/model';
import { PembatasLaju } from '@/lib/chat/pembatas';
import { sinkronPengguna } from '@/lib/layanan/akun';
import { layananEkstrakRapor, validasiBerkas } from '@/lib/layanan/rapor';
import { MAKS_UKURAN_RAPOR, nilaiUntukMapel, rapikanHasil } from '@/lib/rapor/ekstraksi';
import type { PembacaRapor } from '@/lib/rapor/pembaca';
import { repoAkunPalsu } from './repo_akun_palsu';

const PROFIL = { sub: 'g-rapor', email: 'rapor@example.com', name: 'Siswa', email_verified: true };

const MENTAH = {
  terbaca: true,
  mapel: [
    { nama: 'Matematika (Umum)', nilai: [80, 82, 84, 86, 88] },
    { nama: 'Biologi', nilai: [90, 90, 92, 94, null] },
    { nama: 'Bahasa Indonesia', nilai: [85, 87, 'x', 120, 89] },
  ],
  rata_rata_tertulis: 87.5,
  peringkat_paralel: 12,
  jumlah_siswa: 300,
};


describe('rapikanHasil (BR-12: angka AI dicek ulang)', () => {
  it('membuang nilai di luar rentang dan menghitung rata-rata sendiri', () => {
    const h = rapikanHasil(MENTAH)!;
    expect(h.mapel[2].nilai).toEqual([85, 87, null, null, 89]);
    expect(h.mapel[0].rata).toBe(84);
    const semua = [80, 82, 84, 86, 88, 90, 90, 92, 94, 85, 87, 89];
    expect(h.rata_rata).toBe(Math.round((semua.reduce((a, b) => a + b, 0) / semua.length) * 100) / 100);
    expect(h.semester_terbaca).toEqual([1, 2, 3, 4, 5]);
    expect(h.peringkat_paralel).toBe(12);
    expect(h.jumlah_siswa).toBe(300);
    expect(h.peringatan.join(' ')).toContain('2 nilai di luar rentang');
  });

  it('memberi peringatan bila rata-rata tertulis berbeda dan semester hilang', () => {
    const h = rapikanHasil({ terbaca: true, mapel: [{ nama: 'Fisika', nilai: [70, 72, null, null, null] }], rata_rata_tertulis: 90 })!;
    expect(h.rata_rata).toBe(71);
    expect(h.semester_terbaca).toEqual([1, 2]);
    expect(h.peringatan.join(' ')).toContain('Semester 3, 4, 5 tidak terbaca');
    expect(h.peringatan.join(' ')).toContain('berbeda');
  });

  it('peringkat melebihi jumlah siswa diabaikan', () => {
    const h = rapikanHasil({ ...MENTAH, peringkat_paralel: 400 })!;
    expect(h.peringkat_paralel).toBeNull();
  });

  it('tidak terbaca / bukan objek / tanpa nilai -> null', () => {
    expect(rapikanHasil({ terbaca: false, mapel: [] })).toBeNull();
    expect(rapikanHasil(null)).toBeNull();
    expect(rapikanHasil('teks')).toBeNull();
    expect(rapikanHasil({ terbaca: true, mapel: [{ nama: 'Kimia', nilai: [null, null, null, null, null] }] })).toBeNull();
  });

  it('nilaiUntukMapel mencocokkan nama mapel longgar', () => {
    const h = rapikanHasil(MENTAH)!;
    expect(nilaiUntukMapel(h, 'Matematika')).toBe(84);
    expect(nilaiUntukMapel(h, 'biologi')).toBe(91.5);
    expect(nilaiUntukMapel(h, 'Geografi')).toBeNull();
  });
});

describe('POST /api/rapor/ekstrak', () => {
  const berkas = { tipe: 'application/pdf', ukuran: 1000, isi: new TextEncoder().encode('%PDF dummy').buffer as ArrayBuffer };

  const pembaca = (keluaran: unknown | Error): PembacaRapor & { panggilan: number } => {
    const p = {
      nama: 'palsu',
      panggilan: 0,
      async baca() {
        p.panggilan++;
        if (keluaran instanceof Error) throw keluaran;
        return keluaran;
      },
    };
    return p;
  };

  async function siap() {
    const { repo: repoAkun } = repoAkunPalsu();
    const id = await sinkronPengguna(PROFIL, repoAkun);
    return { id, repoAkun };
  }

  it('validasi berkas: wajib, format, ukuran', () => {
    expect(() => validasiBerkas(null)).toThrow('wajib');
    expect(() => validasiBerkas({ ...berkas, tipe: 'text/plain' })).toThrow('Format');
    expect(() => validasiBerkas({ ...berkas, ukuran: 0 })).toThrow('kosong');
    expect(() => validasiBerkas({ ...berkas, ukuran: MAKS_UKURAN_RAPOR + 1 })).toThrow('maksimal');
    expect(validasiBerkas(berkas)).toBe(berkas);
  });

  it('wajib login', async () => {
    const { repoAkun } = await siap();
    await expect(layananEkstrakRapor(null, berkas, { pembaca: [], repoAkun, pembatas: new PembatasLaju() })).rejects.toMatchObject({
      kode: 'TIDAK_LOGIN',
    });
  });

  it('berhasil: hasil dirapikan; kuota habis -> pembaca berikutnya', async () => {
    const { id, repoAkun } = await siap();
    const habis = pembaca(new GalatKuota('a', 1000));
    const ok = pembaca(MENTAH);
    const r = await layananEkstrakRapor(id, berkas, { pembaca: [habis, ok], repoAkun, pembatas: new PembatasLaju() });
    expect(habis.panggilan).toBe(1);
    expect(r.pesan).toBeNull();
    expect(r.data!.mapel).toHaveLength(3);
  });

  it('tidak terbaca, galat model, atau AI tidak tersedia -> data null + pesan, bukan galat', async () => {
    const { id, repoAkun } = await siap();
    const deps = (p: PembacaRapor[]) => ({ pembaca: p, repoAkun, pembatas: new PembatasLaju() });
    expect(await layananEkstrakRapor(id, berkas, deps([pembaca({ terbaca: false, mapel: [] })]))).toMatchObject({ data: null });
    expect((await layananEkstrakRapor(id, berkas, deps([pembaca(new Error('500'))]))).pesan).toContain('manual');
    expect((await layananEkstrakRapor(id, berkas, deps([]))).pesan).toContain('tidak tersedia');
  });

  it('pembatas laju -> TERLALU_SERING', async () => {
    const { id, repoAkun } = await siap();
    const pembatas = new PembatasLaju(1, 60_000);
    await layananEkstrakRapor(id, berkas, { pembaca: [pembaca(MENTAH)], repoAkun, pembatas });
    await expect(layananEkstrakRapor(id, berkas, { pembaca: [pembaca(MENTAH)], repoAkun, pembatas })).rejects.toMatchObject({
      kode: 'TERLALU_SERING',
    });
  });
});
