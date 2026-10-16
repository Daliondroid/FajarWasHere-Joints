/**
 * Pembaca rapor (F-13). Layanan hanya bergantung pada antarmuka ini sehingga test memakai pembaca palsu;
 * implementasi Gemini (multimodal, keluaran JSON) ada di bawah dan hanya untuk server.
 * Kuota/galat sementara/404 ditangani panggilDenganUlang (dilempar sebagai GalatKuota -> pembaca berikutnya).
 */
import { GoogleGenAI } from '@google/genai';
import { MODEL_BAWAAN, panggilDenganUlang } from '@/lib/chat/gemini';

/** Membaca gambar/PDF lebih lama dari chat. */
const BATAS_BACA_MS = 40_000;
import { INSTRUKSI_RAPOR, SKEMA_RAPOR } from './ekstraksi';

export interface BerkasRapor {
  mime: string;
  /** Isi berkas base64 (tidak disimpan di mana pun, BR-14). */
  data: string;
}

export interface PembacaRapor {
  nama?: string;
  /** Keluaran mentah model (belum diverifikasi). Lempar GalatKuota bila kuota habis. */
  baca(berkas: BerkasRapor): Promise<unknown>;
}

const jeda = new Map<string, number>();

class PembacaGemini implements PembacaRapor {
  constructor(
    private readonly ai: GoogleGenAI,
    public readonly nama: string,
  ) {}

  async baca(berkas: BerkasRapor): Promise<unknown> {
    const res = await panggilDenganUlang(
      this.nama,
      () =>
        this.ai.models.generateContent({
          model: this.nama,
          contents: [{ role: 'user', parts: [{ inlineData: { mimeType: berkas.mime, data: berkas.data } }, { text: INSTRUKSI_RAPOR }] }],
          config: { temperature: 0, responseMimeType: 'application/json', responseJsonSchema: SKEMA_RAPOR, abortSignal: AbortSignal.timeout(BATAS_BACA_MS) },
        }),
      jeda,
    );
    const teks = res.text?.trim();
    if (!teks) return null;
    try {
      return JSON.parse(teks);
    } catch {
      return null;
    }
  }
}

let semua: PembacaRapor[] | undefined;

/** Pembaca siap pakai, urut prioritas (memakai GEMINI_MODEL yang sama dengan chat); kosong bila kunci tidak diisi. */
export function pembacaGemini(sekarang: number = Date.now()): PembacaRapor[] {
  if (typeof window !== 'undefined') throw new Error('pembacaGemini hanya boleh dipakai di server.');
  if (semua === undefined) {
    const kunci = process.env.GEMINI_API_KEY;
    const nama = (process.env.GEMINI_MODEL || MODEL_BAWAAN.join(','))
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const ai = kunci ? new GoogleGenAI({ apiKey: kunci }) : null;
    semua = ai ? nama.map((n) => new PembacaGemini(ai, n)) : [];
  }
  return semua.filter((p) => (jeda.get(p.nama!) ?? 0) <= sekarang);
}
