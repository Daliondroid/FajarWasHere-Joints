/** Smart routing setelah login (F-02): dipakai sebagai callbackUrl signIn('google'). */
import { idPenggunaSesi } from '@/lib/auth/sesi';
import { tujuanSetelahLogin } from '@/lib/auth/rute';
import { repoAkunSupabase } from '@/lib/db/repo_akun_supabase';
import { layananStatusAkun } from '@/lib/layanan/akun';

export async function GET(req: Request) {
  let tujuan = '/';
  try {
    const status = await layananStatusAkun(await idPenggunaSesi(), repoAkunSupabase);
    tujuan = tujuanSetelahLogin(status.login, status.sudah_isi_preferensi);
  } catch (e) {
    console.error(e);
  }
  return Response.redirect(new URL(tujuan, req.url), 302);
}
