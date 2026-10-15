/** Akun pengguna: sinkron login Google, status, hapus akun (F-02, F-16). */
import { galatTidakLogin, galatValidasi } from '@/lib/api/galat';
import type { ResponsAkun, ResponsHapusAkun } from '@/types';
import type { RepoAkun } from './repo_akun';

export interface ProfilGoogle {
  sub?: string;
  email?: string | null;
  name?: string | null;
  email_verified?: boolean;
}

/** Hanya akun Google dengan email terverifikasi yang boleh masuk. */
export function profilGoogleValid(p: ProfilGoogle | undefined): p is ProfilGoogle & { sub: string; email: string } {
  return !!p && typeof p.sub === 'string' && p.sub !== '' && typeof p.email === 'string' && p.email_verified === true;
}

/** Dipanggil sekali saat login: simpan seperlunya (BR-14) dan kembalikan id internal. */
export async function sinkronPengguna(p: ProfilGoogle, repo: RepoAkun): Promise<string> {
  if (!profilGoogleValid(p)) throw new Error('Profil Google tidak valid atau email belum terverifikasi.');
  return repo.upsertPengguna({ google_sub: p.sub, email: p.email, nama: p.name?.trim() || null });
}

export async function layananStatusAkun(idSesi: string | null, repo: RepoAkun): Promise<ResponsAkun> {
  const pengguna = idSesi ? await repo.ambilPengguna(idSesi) : null;
  if (!pengguna) return { login: false, pengguna: null, sudah_isi_preferensi: false };
  return {
    login: true,
    pengguna: { nama: pengguna.nama, email: pengguna.email },
    sudah_isi_preferensi: await repo.punyaPreferensi(pengguna.id),
  };
}

export async function layananHapusAkun(idSesi: string | null, badan: unknown, repo: RepoAkun): Promise<ResponsHapusAkun> {
  if (!idSesi) throw galatTidakLogin();
  const konfirmasi = typeof badan === 'object' && badan !== null ? (badan as { konfirmasi?: unknown }).konfirmasi : undefined;
  if (konfirmasi !== 'HAPUS') throw galatValidasi('Ketik konfirmasi "HAPUS" untuk menghapus akun.');
  await repo.hapusPengguna(idSesi);
  return { terhapus: true };
}
