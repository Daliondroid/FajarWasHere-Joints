import { bacaJson, tangani } from '@/lib/api/galat';
import { repoSupabase } from '@/lib/db/repo_supabase';
import { layananKecocokan } from '@/lib/layanan/kecocokan';

export async function POST(req: Request) {
  return tangani(async () => layananKecocokan(await bacaJson(req), repoSupabase));
}
