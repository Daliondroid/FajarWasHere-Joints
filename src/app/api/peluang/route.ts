import { bacaJson, tangani } from '@/lib/api/galat';
import { repoSupabase } from '@/lib/db/repo_supabase';
import { layananPeluang } from '@/lib/layanan/peluang';

export async function POST(req: Request) {
  return tangani(async () => layananPeluang(await bacaJson(req), repoSupabase));
}
