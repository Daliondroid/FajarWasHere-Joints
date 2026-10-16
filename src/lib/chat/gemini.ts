/** Implementasi ModelChat dengan Gemini (server saja). Kunci lewat GEMINI_API_KEY; model lewat GEMINI_MODEL. */
import { GoogleGenAI, type Content, type Part } from '@google/genai';
import type { Bagian, KeluaranModel, MasukanModel, ModelChat } from './model';

/** Model termurah seri 3.5 yang mendukung function calling (dipilih farrelzaki 2026-10-16 untuk hemat token). */
export const MODEL_BAWAAN = 'gemini-3.5-flash-lite';

function keBagianGemini(b: Bagian): Part {
  if ('teks' in b) return { text: b.teks };
  if ('panggilan' in b) {
    const p = b.panggilan;
    return { functionCall: { name: p.nama, args: p.argumen, id: p.id }, ...(p.tanda ? { thoughtSignature: p.tanda } : {}) };
  }
  return { functionResponse: { name: b.hasil.nama, id: b.hasil.id, response: { hasil: b.hasil.isi } } };
}

class ModelGemini implements ModelChat {
  constructor(
    private readonly ai: GoogleGenAI,
    private readonly model: string,
  ) {}

  async hasilkan(m: MasukanModel): Promise<KeluaranModel> {
    const contents: Content[] = m.konten.map((k) => ({ role: k.peran, parts: k.bagian.map(keBagianGemini) }));
    const res = await this.ai.models.generateContent({
      model: this.model,
      contents,
      config: {
        systemInstruction: m.sistem,
        temperature: 0.4,
        tools: m.alat.length
          ? [{ functionDeclarations: m.alat.map((a) => ({ name: a.nama, description: a.deskripsi, parametersJsonSchema: a.parameter })) }]
          : undefined,
      },
    });
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
      console.warn('Gemini tanpa teks/panggilan:', k?.finishReason, k?.finishMessage ?? '', parts.map((p) => Object.keys(p).join('+')));
    }
    return { teks, panggilan };
  }
}

let model: ModelChat | null | undefined;

/** null bila GEMINI_API_KEY belum diisi (layanan memakai jawaban cadangan non-AI). */
export function modelGemini(): ModelChat | null {
  if (typeof window !== 'undefined') throw new Error('modelGemini hanya boleh dipakai di server.');
  if (model !== undefined) return model;
  const kunci = process.env.GEMINI_API_KEY;
  model = kunci ? new ModelGemini(new GoogleGenAI({ apiKey: kunci }), process.env.GEMINI_MODEL || MODEL_BAWAAN) : null;
  return model;
}
