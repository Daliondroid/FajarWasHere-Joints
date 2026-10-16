import { tangani } from '@/lib/api/galat';
import { idPenggunaSesi } from '@/lib/auth/sesi';
import { PembatasLaju } from '@/lib/chat/pembatas';
import { repoAkunSupabase } from '@/lib/db/repo_akun_supabase';
import { layananEkstrakRapor, type BerkasUnggahan } from '@/lib/layanan/rapor';
import { pembacaGemini } from '@/lib/rapor/pembaca';

/** Maks 10 unggahan per 10 menit per pengguna (melindungi kuota Gemini). */
const pembatas = new PembatasLaju(10, 10 * 60 * 1000);

/** Membaca model AI bisa lebih dari 10 detik (batas bawaan fungsi Vercel Hobby). */
export const maxDuration = 60;

async function bacaBerkas(req: Request): Promise<BerkasUnggahan | null> {
  try {
    const f = (await req.formData()).get('berkas');
    if (!f || typeof f === 'string') return null;
    return { tipe: f.type, ukuran: f.size, isi: await f.arrayBuffer() };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  return tangani(async () =>
    layananEkstrakRapor(await idPenggunaSesi(), await bacaBerkas(req), {
      pembaca: pembacaGemini(),
      repoAkun: repoAkunSupabase,
      pembatas,
    }),
  );
}
