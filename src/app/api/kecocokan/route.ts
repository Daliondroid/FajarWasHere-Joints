import { bacaJson, tangani } from '@/lib/api/galat';
import { idPenggunaSesi } from '@/lib/auth/sesi';
import { repoSupabase } from '@/lib/db/repo_supabase';
import { repoTestDriveSupabase } from '@/lib/db/repo_test_drive_supabase';
import { layananKecocokan } from '@/lib/layanan/kecocokan';

export async function POST(req: Request) {
  return tangani(async () => {
    const badan = await bacaJson(req);
    // Refleksi Test Drive tersimpan hanya dibaca bila pengguna login dan badan tidak membawanya.
    const refleksiSesi = async () => {
      const id = await idPenggunaSesi();
      return id ? repoTestDriveSupabase.refleksiPengguna(id) : {};
    };
    return layananKecocokan(badan, repoSupabase, refleksiSesi);
  });
}
