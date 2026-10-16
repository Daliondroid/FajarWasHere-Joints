/** Implementasi ModelChat dengan Gemini (server saja). Kunci lewat GEMINI_API_KEY; model lewat GEMINI_MODEL. */
import { GoogleGenAI, type Content, type Part } from '@google/genai';
import type { Bagian, KeluaranModel, MasukanModel, ModelChat } from './model';

export const MODEL_BAWAAN = 'gemini-2.5-flash';

function keBagianGemini(b: Bagian): Part {
  if ('teks' in b) return { text: b.teks };
  if ('panggilan' in b) return { functionCall: { name: b.panggilan.nama, args: b.panggilan.argumen, id: b.panggilan.id } };
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
    return {
      teks: res.text?.trim() || null,
      panggilan: (res.functionCalls ?? []).map((f) => ({ nama: f.name ?? '', argumen: f.args ?? {}, id: f.id })),
    };
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
