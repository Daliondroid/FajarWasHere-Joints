/** Akses data pengguna (T-13). Implementasi: src/lib/db/repo_akun_supabase.ts; test memakai repo palsu. */
import type { ItemMinat } from '@/lib/skoring';
import type { PreferensiPengguna, ResponsPreferensi } from '@/types';

export interface DataGoogle {
  google_sub: string;
  email: string;
  nama: string | null;
}

/** Baris yang disimpan ke tabel preferensi + profil_akademik. */
export interface SimpanPreferensi {
  minat: PreferensiPengguna['minat'];
  jalur: PreferensiPengguna['jalur'];
  skor_riasec: Record<'R' | 'I' | 'A' | 'S' | 'E' | 'C', number>;
  kode_holland: string;
  akademik: (NonNullable<PreferensiPengguna['akademik']> & { kode_kab: string | null }) | null;
}

export interface RepoAkun {
  /** Insert atau perbarui pengguna berdasarkan google_sub; mengembalikan id internal. */
  upsertPengguna(data: DataGoogle): Promise<string>;
  ambilPengguna(id: string): Promise<{ id: string; email: string; nama: string | null } | null>;
  /** Menghapus pengguna; seluruh data terkait ikut terhapus (on delete cascade). */
  hapusPengguna(id: string): Promise<void>;
  sudahIsiPreferensi(id: string): Promise<boolean>;
  ambilPreferensi(id: string): Promise<ResponsPreferensi['data']>;
  simpanPreferensi(id: string, data: SimpanPreferensi): Promise<void>;
  /** kode_kab sekolah, atau null jika NPSN tidak ada. */
  kodeKabSekolah(npsn: string): Promise<string | null>;
  idPtnAda(ids: number[]): Promise<number[]>;
  itemMinat(): Promise<ItemMinat[]>;
}
