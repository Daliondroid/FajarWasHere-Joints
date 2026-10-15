import { tangani } from '@/lib/api/galat';
import { idPenggunaSesi } from '@/lib/auth/sesi';
import { repoAkunSupabase } from '@/lib/db/repo_akun_supabase';
import { layananPreferensiAktif } from '@/lib/layanan/preferensi';

export async function GET() {
  return tangani(async () => layananPreferensiAktif(await idPenggunaSesi(), repoAkunSupabase));
}
