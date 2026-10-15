import { bacaJson, tangani } from '@/lib/api/galat';
import { idPenggunaSesi } from '@/lib/auth/sesi';
import { repoAkunSupabase } from '@/lib/db/repo_akun_supabase';
import { repoSupabase } from '@/lib/db/repo_supabase';
import { layananBuatPreferensi, layananDaftarPreferensi } from '@/lib/layanan/preferensi';

export async function GET() {
  return tangani(async () => layananDaftarPreferensi(await idPenggunaSesi(), repoAkunSupabase, repoSupabase));
}

export async function POST(req: Request) {
  return tangani(async () => layananBuatPreferensi(await idPenggunaSesi(), await bacaJson(req), repoAkunSupabase));
}
