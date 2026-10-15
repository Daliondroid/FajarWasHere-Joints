import { bacaJson, tangani } from '@/lib/api/galat';
import { idPenggunaSesi } from '@/lib/auth/sesi';
import { repoAkunSupabase } from '@/lib/db/repo_akun_supabase';
import {
  layananAmbilPreferensi,
  layananGantiNamaPreferensi,
  layananHapusPreferensi,
  layananUbahPreferensi,
} from '@/lib/layanan/preferensi';

type Konteks = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Konteks) {
  const { id } = await params;
  return tangani(async () => layananAmbilPreferensi(await idPenggunaSesi(), id, repoAkunSupabase));
}

export async function PUT(req: Request, { params }: Konteks) {
  const { id } = await params;
  return tangani(async () => layananUbahPreferensi(await idPenggunaSesi(), id, await bacaJson(req), repoAkunSupabase));
}

export async function PATCH(req: Request, { params }: Konteks) {
  const { id } = await params;
  return tangani(async () => layananGantiNamaPreferensi(await idPenggunaSesi(), id, await bacaJson(req), repoAkunSupabase));
}

export async function DELETE(_req: Request, { params }: Konteks) {
  const { id } = await params;
  return tangani(async () => layananHapusPreferensi(await idPenggunaSesi(), id, repoAkunSupabase));
}
