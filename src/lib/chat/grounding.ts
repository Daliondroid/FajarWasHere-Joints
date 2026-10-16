/**
 * BR-12: angka di balasan chatbot harus berasal dari hasil alat (API internal) atau pesan pengguna.
 * Fungsi murni; dipakai layanan chat untuk memeriksa balasan Gemini.
 */

/** Angka kecil (≤ 10, mis. "3 kartu", "#1") dan tahun 2020–2030 tidak diperiksa. */
const ABAIKAN = (n: number) => (Number.isInteger(n) && n <= 10) || (Number.isInteger(n) && n >= 2020 && n <= 2030);

/** Ambil angka dari teks berbahasa Indonesia ("21,6%", "1.250", "600"). */
export function angkaDariTeks(teks: string): number[] {
  const hasil: number[] = [];
  for (const m of teks.matchAll(/\d+(?:[.,]\d+)*/g)) {
    let s = m[0];
    // "1.250" atau "12.345.678" = pemisah ribuan; "21,6" = desimal.
    if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
    else s = s.replace(',', '.');
    const n = Number(s);
    if (Number.isFinite(n)) hasil.push(n);
  }
  return hasil;
}

/** Semua angka di nilai JSON (rekursif), termasuk angka di dalam string. */
export function angkaDariData(data: unknown, keluar: number[] = []): number[] {
  if (typeof data === 'number' && Number.isFinite(data)) keluar.push(data);
  else if (typeof data === 'string') keluar.push(...angkaDariTeks(data));
  else if (Array.isArray(data)) data.forEach((d) => angkaDariData(d, keluar));
  else if (data && typeof data === 'object') Object.values(data).forEach((d) => angkaDariData(d, keluar));
  return keluar;
}

/** Bentuk wajar sebuah angka sumber: apa adanya, dibulatkan, dan versi persen dari rasio 0..1. */
function varian(x: number): number[] {
  const v = [x, Math.round(x), Math.round(x * 10) / 10];
  if (x > 0 && x < 1) v.push(Math.round(x * 100), Math.round(x * 1000) / 10);
  return v;
}

export interface HasilGrounding {
  valid: boolean;
  /** Angka di balasan yang tidak ditemukan di sumber. */
  tanpa_sumber: number[];
}

export function periksaAngka(balasan: string, sumber: unknown[]): HasilGrounding {
  const dikenal = sumber.flatMap((s) => angkaDariData(s)).flatMap(varian);
  const cocok = (n: number) => dikenal.some((g) => Math.abs(g - n) <= 0.051);
  const tanpa = [...new Set(angkaDariTeks(balasan).filter((n) => !ABAIKAN(n) && !cocok(n)))];
  return { valid: tanpa.length === 0, tanpa_sumber: tanpa };
}
