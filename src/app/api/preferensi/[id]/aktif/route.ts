import { tangani } from '@/lib/api/galat';
import { idPenggunaSesi } from '@/lib/auth/sesi';
import { repoAkunSupabase } from '@/lib/db/repo_akun_supabase';
import { layananAktifkanPreferensi } from '@/lib/layanan/preferensi';

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return tangani(async () => layananAktifkanPreferensi(await idPenggunaSesi(), id, repoAkunSupabase));
}
