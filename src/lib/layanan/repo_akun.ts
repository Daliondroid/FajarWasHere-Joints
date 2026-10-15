/** Akses data pengguna & preferensi (T-13, T-18). Implementasi: src/lib/db/repo_akun_supabase.ts; test memakai repo palsu. */
import type { ItemMinat, ProfilRiasec } from '@/lib/skoring';
import type { IsiPreferensi, PreferensiDetail } from '@/types';

export interface DataGoogle {
  google_sub: string;
  email: string;
  nama: string | null;
}

/** Data yang disimpan untuk satu preferensi (preferensi + profil_akademik + riwayat_to). */
export interface SimpanPreferensi extends Omit<IsiPreferensi, 'akademik'> {
  skor_riasec: ProfilRiasec;
  kode_holland: string;
  akademik: (NonNullable<IsiPreferensi['akademik']> & { kode_kab: string | null }) | null;
}

/** Baris ringkas untuk daftar kartu (cukup untuk menghitung rekomendasi teratas). */
export interface BarisPreferensiRingkas {
  id: string;
  nama: string;
  jalur: IsiPreferensi['jalur'];
  aktif: boolean;
  kode_holland: string;
  skor_riasec: ProfilRiasec;
  chip_hobi: string[];
  mapel_favorit: string[];
  diperbarui_pada: string;
}

export interface RepoAkun {
  /** Insert atau perbarui pengguna berdasarkan google_sub; mengembalikan id internal. */
  upsertPengguna(data: DataGoogle): Promise<string>;
  ambilPengguna(id: string): Promise<{ id: string; email: string; nama: string | null } | null>;
  /** Menghapus pengguna; seluruh data terkait ikut terhapus (on delete cascade). */
  hapusPengguna(id: string): Promise<void>;

  punyaPreferensi(penggunaId: string): Promise<boolean>;
  daftarPreferensi(penggunaId: string): Promise<BarisPreferensiRingkas[]>;
  /** null bila tidak ada atau bukan milik pengguna. `skor_to_terbaru` diisi layanan. */
  ambilPreferensi(penggunaId: string, id: string): Promise<Omit<PreferensiDetail, 'skor_to_terbaru'> | null>;
  idPreferensiAktif(penggunaId: string): Promise<string | null>;
  /** id null = buat baru (otomatis aktif). Mengembalikan id, atau null bila id bukan milik pengguna. Nama ganda -> galat VALIDASI. */
  simpanPreferensi(penggunaId: string, id: string | null, data: SimpanPreferensi): Promise<string | null>;
  gantiNamaPreferensi(penggunaId: string, id: string, nama: string): Promise<boolean>;
  aktifkanPreferensi(penggunaId: string, id: string): Promise<boolean>;
  /** Hapus; bila yang dihapus aktif, preferensi lain terbaru jadi aktif. */
  hapusPreferensi(penggunaId: string, id: string): Promise<boolean>;

  /** kode_kab sekolah, atau null jika NPSN tidak ada. */
  kodeKabSekolah(npsn: string): Promise<string | null>;
  idPtnAda(ids: number[]): Promise<number[]>;
  itemMinat(): Promise<ItemMinat[]>;
}
