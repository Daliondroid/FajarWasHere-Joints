/** Implementasi RepoChat dengan supabase-js (server saja). */
import type { RepoChat } from '@/lib/layanan/repo_chat';
import type { PesanChat } from '@/types';
import { supabaseServer } from './supabase';

type Baris = Record<string, unknown>;

function cek<T>(hasil: { data: unknown; error: { message: string } | null }): T {
  if (hasil.error) throw new Error(`Supabase: ${hasil.error.message}`);
  return hasil.data as T;
}

export const repoChatSupabase: RepoChat = {
  async ambilRiwayat(penggunaId, batas) {
    const data = cek<Baris[]>(
      await supabaseServer()
        .from('riwayat_chat')
        .select('peran,isi,dibuat_pada')
        .eq('pengguna_id', penggunaId)
        .order('dibuat_pada', { ascending: false })
        .order('id', { ascending: false })
        .limit(batas),
    );
    return data
      .map((r): PesanChat => ({ peran: r.peran as PesanChat['peran'], isi: String(r.isi), dibuat_pada: String(r.dibuat_pada) }))
      .reverse();
  },

  async simpanPesan(penggunaId, peran, isi) {
    cek(await supabaseServer().from('riwayat_chat').insert({ pengguna_id: penggunaId, peran, isi }));
  },

  async hapusRiwayat(penggunaId) {
    cek(await supabaseServer().from('riwayat_chat').delete().eq('pengguna_id', penggunaId));
  },
};
