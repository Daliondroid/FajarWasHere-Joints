/**
 * POST /api/rapor/ekstrak (F-13, T-30): baca foto/PDF rapor dengan AI lalu kembalikan nilai terverifikasi
 * untuk dikonfirmasi siswa. Berkas tidak disimpan (BR-14); gagal baca tidak memblokir isi manual.
 */
import { ApiGalat, galatTidakLogin, galatValidasi } from '@/lib/api/galat';
import { GalatKuota } from '@/lib/chat/model';
import type { PembatasLaju } from '@/lib/chat/pembatas';
import { MAKS_UKURAN_RAPOR, TIPE_RAPOR, rapikanHasil } from '@/lib/rapor/ekstraksi';
import type { PembacaRapor } from '@/lib/rapor/pembaca';
import type { ResponsEkstrakRapor } from '@/types';
import type { RepoAkun } from './repo_akun';

export interface BerkasUnggahan {
  tipe: string;
  ukuran: number;
  isi: ArrayBuffer;
}

export interface DepsRapor {
  /** Urut prioritas; kosong = AI tidak tersedia (kunci kosong / kuota habis). */
  pembaca: PembacaRapor[];
  repoAkun: RepoAkun;
  pembatas: PembatasLaju;
}

const MB = (n: number) => `${Math.round(n / (1024 * 1024))} MB`;

export function validasiBerkas(b: BerkasUnggahan | null): BerkasUnggahan {
  if (!b) throw galatValidasi('berkas wajib diunggah (field "berkas").');
  if (!(TIPE_RAPOR as readonly string[]).includes(b.tipe)) throw galatValidasi('Format harus PDF, JPG, PNG, atau WEBP.');
  if (b.ukuran <= 0) throw galatValidasi('Berkas kosong.');
  if (b.ukuran > MAKS_UKURAN_RAPOR) throw galatValidasi(`Ukuran berkas maksimal ${MB(MAKS_UKURAN_RAPOR)}.`);
  return b;
}

export async function layananEkstrakRapor(idSesi: string | null, berkas: BerkasUnggahan | null, deps: DepsRapor): Promise<ResponsEkstrakRapor> {
  if (!idSesi || !(await deps.repoAkun.ambilPengguna(idSesi))) throw galatTidakLogin();
  const b = validasiBerkas(berkas);
  if (!deps.pembatas.izinkan(idSesi)) throw new ApiGalat('TERLALU_SERING', 'Terlalu sering mengunggah. Coba lagi beberapa menit lagi.');

  const masukan = { mime: b.tipe, data: Buffer.from(b.isi).toString('base64') };
  for (const p of deps.pembaca) {
    try {
      const hasil = rapikanHasil(await p.baca(masukan));
      if (!hasil) return { data: null, pesan: 'Rapor tidak terbaca. Pastikan foto jelas dan tegak, atau isi nilainya manual.' };
      return { data: hasil, pesan: null };
    } catch (e) {
      if (e instanceof GalatKuota) continue;
      console.error('Ekstraksi rapor gagal:', p.nama, e);
      return { data: null, pesan: 'AI gagal membaca rapor saat ini. Isi nilainya manual dulu, ya.' };
    }
  }
  return { data: null, pesan: 'Pembaca rapor AI sedang tidak tersedia. Isi nilainya manual dulu, ya.' };
}
