import { bacaJson, tangani } from '@/lib/api/galat';
import { idPenggunaSesi } from '@/lib/auth/sesi';
import { repoAkunSupabase } from '@/lib/db/repo_akun_supabase';
import { repoSupabase } from '@/lib/db/repo_supabase';
import { repoTestDriveSupabase } from '@/lib/db/repo_test_drive_supabase';
import { layananRefleksiTestDrive } from '@/lib/layanan/test_drive';

export async function POST(req: Request) {
  return tangani(async () =>
    layananRefleksiTestDrive(await idPenggunaSesi(), await bacaJson(req), {
      repo: repoSupabase,
      repoTd: repoTestDriveSupabase,
      repoAkun: repoAkunSupabase,
    }),
  );
}
