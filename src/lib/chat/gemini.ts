/**
 * Implementasi ModelChat dengan Gemini (server saja). Kunci lewat GEMINI_API_KEY.
 * GEMINI_MODEL boleh berisi daftar model dipisah koma; kuota tingkat gratis dihitung per model per project,
 * jadi bila satu model kena 429, pesan diulang dengan model berikutnya dan model itu dijeda sampai kuotanya pulih.
 */
import { GoogleGenAI, type Content, type Part } from '@google/genai';
import { GalatKuota, type Bagian, type KeluaranModel, type MasukanModel, type ModelChat } from './model';

/** Model Flash-Lite stabil yang mendukung function calling (dipilih farrelzaki 2026-10-16: tingkat gratis, hemat token). */
export const MODEL_BAWAAN = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-2.5-flash-lite'];
const JEDA_BAWAAN_MS = 60_000;

/** Model yang sedang dijeda karena kuota habis: nama -> waktu boleh dipakai lagi (ms). */
const jeda = new Map<string, number>();

function keBagianGemini(b: Bagian): Part {
  if ('teks' in b) return { text: b.teks };
  if ('panggilan' in b) {
    const p = b.panggilan;
    return { functionCall: { name: p.nama, args: p.argumen, id: p.id }, ...(p.tanda ? { thoughtSignature: p.tanda } : {}) };
  }
  return { functionResponse: { name: b.hasil.nama, id: b.hasil.id, response: { hasil: b.hasil.isi } } };
}

/** 429 / RESOURCE_EXHAUSTED -> lama jeda (ms) dari retryDelay bila ada; selain itu null. */
export function jedaKuota(e: unknown): number | null {
  const status = (e as { status?: number })?.status;
  const pesan = typeof (e as { message?: unknown })?.message === 'string' ? (e as { message: string }).message : String(e);
  if (status !== 429 && !pesan.includes('RESOURCE_EXHAUSTED')) return null;
  const detik = pesan.match(/retryDelay"\s*:\s*"(\d+(?:\.\d+)?)s"/) ?? pesan.match(/retry in (\d+(?:\.\d+)?)s/i);
  return detik ? Math.ceil(Number(detik[1]) * 1000) : JEDA_BAWAAN_MS;
}

class ModelGemini implements ModelChat {
  constructor(
    private readonly ai: GoogleGenAI,
    public readonly nama: string,
  ) {}

  async hasilkan(m: MasukanModel): Promise<KeluaranModel> {
    const contents: Content[] = m.konten.map((k) => ({ role: k.peran, parts: k.bagian.map(keBagianGemini) }));
    let res;
    try {
      res = await this.ai.models.generateContent({
        model: this.nama,
        contents,
        config: {
          systemInstruction: m.sistem,
          temperature: 0.4,
          tools: m.alat.length
            ? [{ functionDeclarations: m.alat.map((a) => ({ name: a.nama, description: a.deskripsi, parametersJsonSchema: a.parameter })) }]
            : undefined,
        },
      });
    } catch (e) {
      const ms = jedaKuota(e);
      if (ms === null) throw e;
      jeda.set(this.nama, Date.now() + ms);
      throw new GalatKuota(this.nama, ms);
    }
    // Baca dari parts (bukan res.functionCalls) agar thought signature ikut tersimpan.
    const parts = res.candidates?.[0]?.content?.parts ?? [];
    const panggilan = parts
      .filter((p) => p.functionCall)
      .map((p) => ({
        nama: p.functionCall!.name ?? '',
        argumen: p.functionCall!.args ?? {},
        id: p.functionCall!.id,
        tanda: p.thoughtSignature,
      }));
    const teks = res.text?.trim() || null;
    if (!teks && !panggilan.length) {
      const k = res.candidates?.[0];
      console.warn('Gemini tanpa teks/panggilan:', this.nama, k?.finishReason, k?.finishMessage ?? '', parts.map((p) => Object.keys(p).join('+')));
    }
    return { teks, panggilan };
  }
}

let semua: ModelChat[] | undefined;

/** Model yang siap dipakai, urut prioritas; kosong bila GEMINI_API_KEY belum diisi atau semua sedang dijeda. */
export function modelGemini(sekarang: number = Date.now()): ModelChat[] {
  if (typeof window !== 'undefined') throw new Error('modelGemini hanya boleh dipakai di server.');
  if (semua === undefined) {
    const kunci = process.env.GEMINI_API_KEY;
    const nama = (process.env.GEMINI_MODEL || MODEL_BAWAAN.join(','))
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const ai = kunci ? new GoogleGenAI({ apiKey: kunci }) : null;
    semua = ai ? nama.map((n) => new ModelGemini(ai, n)) : [];
  }
  return semua.filter((m) => (jeda.get(m.nama!) ?? 0) <= sekarang);
}
