/**
 * Abstraksi model bahasa untuk chatbot (T-09). Layanan hanya bergantung pada antarmuka ini,
 * sehingga test memakai model palsu dan implementasi Gemini ada di ./gemini.ts.
 */

export interface PanggilanAlat {
  nama: string;
  argumen: Record<string, unknown>;
  id?: string;
  /** Thought signature Gemini 3; wajib dikirim balik apa adanya pada giliran berikutnya. */
  tanda?: string;
}

export type Bagian = { teks: string } | { panggilan: PanggilanAlat } | { hasil: { nama: string; id?: string; isi: unknown } };

export interface Konten {
  peran: 'user' | 'model';
  bagian: Bagian[];
}

export interface DeklarasiAlat {
  nama: string;
  deskripsi: string;
  /** JSON Schema parameter. */
  parameter: Record<string, unknown>;
}

export interface MasukanModel {
  sistem: string;
  konten: Konten[];
  /** Kosong = model wajib menjawab teks tanpa memanggil alat. */
  alat: DeklarasiAlat[];
}

export interface KeluaranModel {
  teks: string | null;
  panggilan: PanggilanAlat[];
}

export interface ModelChat {
  /** Nama model (untuk log). */
  nama?: string;
  hasilkan(masukan: MasukanModel): Promise<KeluaranModel>;
}

/** Model tidak bisa dipakai sementara: kuota habis (429), galat sementara berulang (503), atau model tidak ada (404). Layanan lalu mencoba model berikutnya. */
export class GalatKuota extends Error {
  constructor(
    public readonly model: string,
    public readonly jedaMs: number,
    public readonly jenis: 'kuota' | 'sementara' | 'tidak_ada' = 'kuota',
  ) {
    super(
      jenis === 'kuota'
        ? `Kuota ${model} habis; coba lagi dalam ${Math.round(jedaMs / 1000)} detik.`
        : jenis === 'tidak_ada'
          ? `Model ${model} tidak tersedia (404); dilewati.`
          : `Model ${model} sedang sibuk/galat sementara; dijeda ${Math.round(jedaMs / 1000)} detik.`,
    );
  }
}
