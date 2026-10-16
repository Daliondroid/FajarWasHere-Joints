'use client';

import { useCallback, useEffect, useState } from 'react';
import type { PreferensiRingkas, ResponsDaftarPreferensi } from '@/types';
import { panggilApi, pesanGalat } from './api';

/** Daftar preferensi akun (GET /api/preferensi) + ganti preferensi aktif (POST /api/preferensi/[id]/aktif). */
export function useDaftarPreferensi(aktif: boolean) {
  const [daftar, setDaftar] = useState<PreferensiRingkas[] | null>(null);
  const [galat, setGalat] = useState<string | null>(null);

  const muatUlang = useCallback(async () => {
    try {
      const { data } = await panggilApi<ResponsDaftarPreferensi>('/api/preferensi');
      setDaftar(data);
      setGalat(null);
    } catch (e) {
      setGalat(pesanGalat(e));
    }
  }, []);

  useEffect(() => {
    if (aktif) void muatUlang();
  }, [aktif, muatUlang]);

  const aktifkan = useCallback(
    async (id: string) => {
      setDaftar((d) => d?.map((p) => ({ ...p, aktif: p.id === id })) ?? d);
      try {
        await panggilApi(`/api/preferensi/${id}/aktif`, { method: 'POST' });
      } catch (e) {
        setGalat(pesanGalat(e));
      }
      await muatUlang();
    },
    [muatUlang],
  );

  return { daftar, galat, aktifkan, muatUlang, memuat: aktif && daftar === null && galat === null };
}
