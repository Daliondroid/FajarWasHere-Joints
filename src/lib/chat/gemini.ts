/**
 * Implementasi ModelChat dengan Gemini (server saja). Kunci lewat GEMINI_API_KEY.
 * GEMINI_MODEL boleh berisi daftar model dipisah koma; kuota tingkat gratis dihitung per model per project,
 * jadi bila satu model kena 429, pesan diulang dengan model berikutnya dan model itu dijeda sampai kuotanya pulih.
 * Galat sementara (503 high demand, 500, batas waktu) diulang dulu di model yang sama, lalu pindah ke model berikutnya;
 * model yang sudah dihapus Google (404) dilewati (T-24).
 */
import { GoogleGenAI, type Content, type Part } from '@google/genai';
import { GalatKuota, type Bagian, type KeluaranModel, type MasukanModel, type ModelChat } from './model';

/**
 * Model Flash-Lite yang mendukung function calling (dipilih farrelzaki 2026-10-16: tingkat gratis, hemat token).
 * 2026-10-16: gemini-2.5-flash-lite sudah 404 untuk pengguna baru, diganti alias stabil `gemini-flash-lite-latest`.
 */
export const MODEL_BAWAAN = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-flash-lite-latest'];
const JEDA_BAWAAN_MS = 60_000;
/** Jeda model setelah galat sementara berulang (ms). */
export const JEDA_SEMENTARA_MS = 20_000;
/** Model tidak ada (404): jangan dicoba lagi sampai server dimulai ulang. */
export const JEDA_TIDAK_ADA_MS = 24 * 60 * 60 * 1000;
/** Jeda antar-ulang galat sementara di model yang sama (ms). */
export const JEDA_ULANG_MS = [700, 1600];
/** Batas satu panggilan Gemini (ms); lewat batas dianggap galat sementara. */
export const BATAS_PANGGILAN_MS = 20_000;

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

export type JenisGalatModel = 'kuota' | 'sementara' | 'tidak_ada';

/** Golongkan galat Gemini: kuota (429), sementara (503/500/504/UNAVAILABLE/fetch gagal), tidak_ada (404); lainnya null. */
export function jenisGalat(e: unknown): JenisGalatModel | null {
  if (jedaKuota(e) !== null) return 'kuota';
  const status = (e as { status?: number })?.status;
  const pesan = typeof (e as { message?: unknown })?.message === 'string' ? (e as { message: string }).message : String(e);
  if (status === 404 || /\b404\b|NOT_FOUND|no longer available/i.test(pesan)) return 'tidak_ada';
  if ((status !== undefined && status >= 500) || /\b50[0234]\b|UNAVAILABLE|INTERNAL|DEADLINE_EXCEEDED|high demand|overloaded|fetch failed|ECONNRESET|ETIMEDOUT|aborted|AbortError|TimeoutError|timed out/i.test(pesan))
    return 'sementara';
  return null;
}

const tidur = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Panggil model dengan ulang otomatis untuk galat sementara. Kuota/sementara berulang/404 -> model dijeda dan
 * GalatKuota dilempar supaya pemanggil pindah ke model berikutnya. Galat lain diteruskan apa adanya.
 */
export async function panggilDenganUlang<T>(nama: string, fn: () => Promise<T>, petaJeda: Map<string, number>, jedaUlang: number[] = JEDA_ULANG_MS): Promise<T> {
  for (let i = 0; ; i++) {
    try {
      return await fn();
    } catch (e) {
      const jenis = jenisGalat(e);
      if (jenis === 'sementara' && i < jedaUlang.length) {
        await tidur(jedaUlang[i]);
        continue;
      }
      if (jenis === null) throw e;
      const ms = jenis === 'kuota' ? jedaKuota(e)! : jenis === 'tidak_ada' ? JEDA_TIDAK_ADA_MS : JEDA_SEMENTARA_MS;
      petaJeda.set(nama, Date.now() + ms);
      throw new GalatKuota(nama, ms, jenis);
    }
  }
}

class ModelGemini implements ModelChat {
  constructor(
    private readonly ai: GoogleGenAI,
    public readonly nama: string,
  ) {}

  async hasilkan(m: MasukanModel): Promise<KeluaranModel> {
    const contents: Content[] = m.konten.map((k) => ({ role: k.peran, parts: k.bagian.map(keBagianGemini) }));
    const res = await panggilDenganUlang(
      this.nama,
      () =>
        this.ai.models.generateContent({
          model: this.nama,
          contents,
          config: {
            systemInstruction: m.sistem,
            temperature: 0.4,
            abortSignal: AbortSignal.timeout(BATAS_PANGGILAN_MS),
            tools: m.alat.length
              ? [{ functionDeclarations: m.alat.map((a) => ({ name: a.nama, description: a.deskripsi, parametersJsonSchema: a.parameter })) }]
              : undefined,
          },
        }),
      jeda,
    );
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
