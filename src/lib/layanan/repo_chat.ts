/** Akses riwayat chat (tabel riwayat_chat). Implementasi: src/lib/db/repo_chat_supabase.ts. */
import type { PesanChat } from '@/types';

export interface RepoChat {
  /** `batas` pesan terakhir, urut lama -> baru. */
  ambilRiwayat(penggunaId: string, batas: number): Promise<PesanChat[]>;
  simpanPesan(penggunaId: string, peran: PesanChat['peran'], isi: string): Promise<void>;
  hapusRiwayat(penggunaId: string): Promise<void>;
}
