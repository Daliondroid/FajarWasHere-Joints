/** GET /api/school */
import { galatTidakDitemukan, galatValidasi } from '@/lib/api/galat';
import { validasiNpsn } from '@/lib/api/validasi';
import type { ResponsSekolah, SekolahDetail } from '@/types';
import type { BarisSekolah, Repo } from './repo';

export function keSekolahDetail(b: BarisSekolah): SekolahDetail {
  return {
    npsn: b.npsn,
    nama: b.nama,
    jenis: b.jenis,
    akreditasi: b.akreditasi,
    kab_kota: b.kab_kota,
    provinsi: b.provinsi,
    kode_bps: b.kode_bps,
    persen_kuota: b.persen_kuota,
    kuota_siswa: b.kuota_siswa,
    jurusan_kuota: Object.entries(b.jurusan_kuota).map(([jurusan, kuota]) => ({ jurusan, kuota: Number(kuota) })),
    ada_data_pdss: b.kuota_siswa > 0,
    label_data: 'resmi',
  };
}

/** Kuota eligible jurusan (cocok tanpa beda huruf besar/kecil); null jika tak ada data PDSS/jurusan. */
export function kuotaJurusan(b: BarisSekolah, jurusan: string | undefined): number | null {
  if (b.kuota_siswa <= 0 || !jurusan) return null;
  const kunci = jurusan.trim().toLowerCase();
  const ketemu = Object.entries(b.jurusan_kuota).find(([j]) => j.trim().toLowerCase() === kunci);
  if (!ketemu) return null;
  const n = Number(ketemu[1]);
  return Number.isFinite(n) ? n : null;
}

export async function layananSekolah(sp: URLSearchParams, repo: Repo): Promise<ResponsSekolah> {
  const npsn = sp.get('npsn');
  const q = sp.get('q');
  if (npsn) {
    const b = await repo.sekolahByNpsn(validasiNpsn(npsn));
    if (!b) throw galatTidakDitemukan(`Sekolah dengan NPSN ${npsn} tidak ditemukan.`);
    return { data: keSekolahDetail(b) };
  }
  if (q) {
    const teks = q.trim();
    if (teks.length < 3 || teks.length > 100) throw galatValidasi('q harus 3–100 karakter.');
    if (/^\d{8}$/.test(teks)) return layananSekolah(new URLSearchParams({ npsn: teks }), repo);
    return { data: (await repo.cariSekolah(teks, 20)).map(keSekolahDetail) };
  }
  throw galatValidasi('Isi parameter npsn atau q.');
}
