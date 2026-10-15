import { tangani } from '@/lib/api/galat';
import { repoSupabase } from '@/lib/db/repo_supabase';
import { repoTestDriveSupabase } from '@/lib/db/repo_test_drive_supabase';
import { layananTestDrive } from '@/lib/layanan/test_drive';

export async function GET(req: Request) {
  return tangani(() => layananTestDrive(new URL(req.url).searchParams, repoSupabase, repoTestDriveSupabase));
}
