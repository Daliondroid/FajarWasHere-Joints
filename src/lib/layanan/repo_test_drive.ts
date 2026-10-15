/** Akses data Test Drive (T-14). Implementasi: src/lib/db/repo_test_drive_supabase.ts. */
import type { LapisanSoal, RefleksiTestDrive } from '@/types';

export interface BarisSoal {
  id_soal: string;
  lapisan: LapisanSoal;
  id_prodi: number | null;
  rumpun_id: string | null;
  soal: string;
  opsi_a: string;
  opsi_b: string;
  opsi_c: string;
  opsi_d: string;
  kunci: 'A' | 'B' | 'C' | 'D';
  pembahasan: string | null;
  sumber: string | null;
  status: string | null;
}

export interface RepoTestDrive {
  /** Soal spesifik/umum milik prodi + soal rumpun prodi tersebut. */
  soalUntukProdi(idProdi: number, rumpunId: string): Promise<BarisSoal[]>;
  soalById(idSoal: string): Promise<BarisSoal | null>;
  simpanJawaban(penggunaId: string, d: { id_prodi: number; id_soal: string; jawaban: string; benar: boolean }): Promise<void>;
  /** Isi refleksi pada riwayat terakhir prodi itu yang belum berrefleksi; jika tidak ada, buat baris baru. */
  simpanRefleksi(penggunaId: string, idProdi: number, refleksi: RefleksiTestDrive): Promise<void>;
  /** Refleksi terakhir per prodi milik pengguna. */
  refleksiPengguna(penggunaId: string): Promise<Record<string, RefleksiTestDrive>>;
}
