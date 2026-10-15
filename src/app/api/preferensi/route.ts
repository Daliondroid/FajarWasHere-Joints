import { bacaJson, tangani } from '@/lib/api/galat';
import { idPenggunaSesi } from '@/lib/auth/sesi';
import { repoAkunSupabase } from '@/lib/db/repo_akun_supabase';
import { layananAmbilPreferensi, layananSimpanPreferensi } from '@/lib/layanan/preferensi';

export async function GET() {
  return tangani(async () => layananAmbilPreferensi(await idPenggunaSesi(), repoAkunSupabase));
}

export async function PUT(req: Request) {
  return tangani(async () => layananSimpanPreferensi(await idPenggunaSesi(), await bacaJson(req), repoAkunSupabase));
}
