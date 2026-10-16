/** Pemanggil API internal dari komponen klien (bentuk galat `{ error: { kode, pesan } }`, docs/ARSITEKTUR.md §4). */
import type { GalatApi } from '@/types';

export class GalatPermintaan extends Error {
  constructor(
    readonly kode: string,
    pesan: string,
    readonly status: number,
  ) {
    super(pesan);
  }
}

export async function panggilApi<T>(url: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const res = await fetch(url, {
    method: init?.method ?? 'GET',
    headers: init?.body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
    cache: 'no-store',
  });
  const isi = await res.json().catch(() => null);
  if (!res.ok) {
    const g = (isi as Partial<GalatApi> | null)?.error;
    throw new GalatPermintaan(g?.kode ?? 'SERVER', g?.pesan ?? 'Terjadi kesalahan. Coba lagi.', res.status);
  }
  return isi as T;
}

export const pesanGalat = (e: unknown) => (e instanceof Error ? e.message : 'Terjadi kesalahan. Coba lagi.');
