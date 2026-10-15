/** Format galat seragam untuk semua route handler (ARSITEKTUR bagian 5). */
import type { GalatApi } from '@/types';

type KodeGalat = GalatApi['error']['kode'];

const STATUS: Record<KodeGalat, number> = { VALIDASI: 400, TIDAK_LOGIN: 401, TIDAK_DITEMUKAN: 404, SERVER: 500 };

export class ApiGalat extends Error {
  constructor(
    public readonly kode: KodeGalat,
    pesan: string,
  ) {
    super(pesan);
  }
  get status() {
    return STATUS[this.kode];
  }
}

export const galatValidasi = (pesan: string) => new ApiGalat('VALIDASI', pesan);
export const galatTidakDitemukan = (pesan: string) => new ApiGalat('TIDAK_DITEMUKAN', pesan);
export const galatTidakLogin = () => new ApiGalat('TIDAK_LOGIN', 'Silakan masuk dengan akun Google dulu.');

export function responsGalat(e: unknown): Response {
  if (e instanceof ApiGalat) {
    const badan: GalatApi = { error: { kode: e.kode, pesan: e.message } };
    return Response.json(badan, { status: e.status });
  }
  console.error(e);
  const badan: GalatApi = { error: { kode: 'SERVER', pesan: 'Terjadi kesalahan di server.' } };
  return Response.json(badan, { status: 500 });
}

/** Bungkus handler: hasil dijadikan JSON (kecuali sudah Response); galat apa pun diubah ke format seragam. */
export async function tangani(fn: () => Promise<unknown>): Promise<Response> {
  try {
    const hasil = await fn();
    return hasil instanceof Response ? hasil : Response.json(hasil);
  } catch (e) {
    return responsGalat(e);
  }
}

/** Baca badan JSON request; badan rusak -> 400. */
export async function bacaJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    throw galatValidasi('Badan request harus JSON yang valid.');
  }
}
