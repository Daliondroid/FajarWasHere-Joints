import { bacaJson, tangani } from '@/lib/api/galat';
import { headerHapusCookieSesi, idPenggunaSesi } from '@/lib/auth/sesi';
import { repoAkunSupabase } from '@/lib/db/repo_akun_supabase';
import { layananHapusAkun, layananStatusAkun } from '@/lib/layanan/akun';

export async function GET() {
  return tangani(async () => layananStatusAkun(await idPenggunaSesi(), repoAkunSupabase));
}

export async function DELETE(req: Request) {
  return tangani(async () => {
    const hasil = await layananHapusAkun(await idPenggunaSesi(), await bacaJson(req), repoAkunSupabase);
    const res = Response.json(hasil);
    for (const c of headerHapusCookieSesi()) res.headers.append('Set-Cookie', c);
    return res;
  });
}
