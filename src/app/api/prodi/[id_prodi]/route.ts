import { tangani } from '@/lib/api/galat';
import { repoSupabase } from '@/lib/db/repo_supabase';
import { layananDetailProdi } from '@/lib/layanan/prodi';

export async function GET(_req: Request, { params }: { params: Promise<{ id_prodi: string }> }) {
  const { id_prodi } = await params;
  return tangani(() => layananDetailProdi(id_prodi, repoSupabase));
}
