import { tangani } from '@/lib/api/galat';
import { repoSupabase } from '@/lib/db/repo_supabase';
import { layananDaftarProdi } from '@/lib/layanan/prodi';

export async function GET(req: Request) {
  return tangani(() => layananDaftarProdi(new URL(req.url).searchParams, repoSupabase));
}
