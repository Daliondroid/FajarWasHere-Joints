/** Baca sesi di route handler / server component. */
import { getServerSession } from 'next-auth';
import { opsiAuth } from './opsi';

/** id pengguna internal dari sesi, atau null jika belum login. */
export async function idPenggunaSesi(): Promise<string | null> {
  const sesi = await getServerSession(opsiAuth);
  return sesi?.user?.id || null;
}

/** Cookie sesi NextAuth (http dan https). Dihapus setelah akun dihapus. */
export const COOKIE_SESI = ['next-auth.session-token', '__Secure-next-auth.session-token'] as const;

export function headerHapusCookieSesi(): string[] {
  return COOKIE_SESI.map(
    (nama) => `${nama}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${nama.startsWith('__Secure-') ? '; Secure' : ''}`,
  );
}
