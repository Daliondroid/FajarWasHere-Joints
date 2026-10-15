import { tangani } from '@/lib/api/galat';
import { repoSupabase } from '@/lib/db/repo_supabase';
import { layananSekolah } from '@/lib/layanan/sekolah';

export async function GET(req: Request) {
  return tangani(() => layananSekolah(new URL(req.url).searchParams, repoSupabase));
}
