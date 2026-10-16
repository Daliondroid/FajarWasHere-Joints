import { bacaJson, tangani } from '@/lib/api/galat';
import { idPenggunaSesi } from '@/lib/auth/sesi';
import { modelGemini } from '@/lib/chat/gemini';
import { PembatasLaju } from '@/lib/chat/pembatas';
import { repoAkunSupabase } from '@/lib/db/repo_akun_supabase';
import { repoChatSupabase } from '@/lib/db/repo_chat_supabase';
import { repoSupabase } from '@/lib/db/repo_supabase';
import { layananHapusRiwayatChat, layananKirimPesan, layananRiwayatChat } from '@/lib/layanan/chat';

const pembatas = new PembatasLaju();

/** Satu pesan bisa beberapa kali memanggil Gemini + alat data (T-24); jangan sampai terpotong batas bawaan fungsi. */
export const maxDuration = 60;
const depsRiwayat = { repoAkun: repoAkunSupabase, repoChat: repoChatSupabase };

export async function POST(req: Request) {
  return tangani(async () =>
    layananKirimPesan(await idPenggunaSesi(), await bacaJson(req), {
      model: modelGemini(),
      repo: repoSupabase,
      ...depsRiwayat,
      pembatas,
    }),
  );
}

export async function GET() {
  return tangani(async () => layananRiwayatChat(await idPenggunaSesi(), depsRiwayat));
}

export async function DELETE() {
  return tangani(async () => layananHapusRiwayatChat(await idPenggunaSesi(), depsRiwayat));
}
