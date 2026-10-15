import { tangani } from '@/lib/api/galat';
import { idPenggunaSesi } from '@/lib/auth/sesi';
import { repoAkunSupabase } from '@/lib/db/repo_akun_supabase';
import { repoSupabase } from '@/lib/db/repo_supabase';
import { layananRekomendasi } from '@/lib/layanan/rekomendasi';

export async function GET() {
  return tangani(async () => layananRekomendasi(await idPenggunaSesi(), { repo: repoSupabase, repoAkun: repoAkunSupabase }));
}
