'use client';

/**
 * Draf wizard preferensi (Hal. P → kuis → data jalur) di sessionStorage. Data baru tersimpan permanen
 * saat POST/PUT /api/preferensi di langkah terakhir; draf hanya penampung antarlayar.
 */
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { IsiPreferensi, JalurPreferensi, PreferensiDetail } from '@/types';
import { panggilApi } from './api';

export interface DrafPreferensi {
  /** Terisi saat mengubah preferensi yang sudah ada (PUT). */
  id_ubah: string | null;
  isi: IsiPreferensi;
}

const KUNCI = 'cocokin_draf_preferensi';

export function drafBaru(nama: string, jalur: JalurPreferensi, tahunLulus: number, pernahLulusSnbp: boolean): DrafPreferensi {
  return {
    id_ubah: null,
    isi: {
      nama,
      jalur,
      minat: { mode: 'mini_ip_30', jawaban_minat: {}, chip_hobi: [], mapel_favorit: [] },
      kelulusan: { tahun_lulus: tahunLulus, pernah_lulus_snbp: pernahLulusSnbp },
      akademik: null,
      riwayat_to: [],
    },
  };
}

export function drafDariPreferensi(p: PreferensiDetail): DrafPreferensi {
  const { nama, jalur, minat, kelulusan, akademik, riwayat_to } = p;
  return { id_ubah: p.id, isi: { nama, jalur, minat, kelulusan, akademik, riwayat_to } };
}

export function bacaDraf(): DrafPreferensi | null {
  try {
    const teks = sessionStorage.getItem(KUNCI);
    return teks ? (JSON.parse(teks) as DrafPreferensi) : null;
  } catch {
    return null;
  }
}

export function simpanDraf(d: DrafPreferensi): void {
  try {
    sessionStorage.setItem(KUNCI, JSON.stringify(d));
  } catch {
    // Penyimpanan diblokir: wizard tetap jalan selama halaman tidak dimuat ulang.
  }
}

export function hapusDraf(): void {
  try {
    sessionStorage.removeItem(KUNCI);
  } catch {
    // abaikan
  }
}

/** Draf aktif untuk halaman wizard; tanpa draf (mis. dibuka langsung) kembali ke halaman Preferensi. */
export function useDraf() {
  const router = useRouter();
  const [draf, setDrafState] = useState<DrafPreferensi | null>(null);

  useEffect(() => {
    const d = bacaDraf();
    if (d) setDrafState(d);
    else router.replace('/preferensi');
  }, [router]);

  const ubahIsi = useCallback((ubah: (isi: IsiPreferensi) => IsiPreferensi) => {
    setDrafState((d) => {
      if (!d) return d;
      const baru = { ...d, isi: ubah(d.isi) };
      simpanDraf(baru);
      return baru;
    });
  }, []);

  return { draf, ubahIsi };
}

/** Simpan draf ke akun: POST (baru, otomatis aktif) atau PUT (ubah, lalu dijadikan aktif). */
export async function kirimDraf(d: DrafPreferensi): Promise<void> {
  if (d.id_ubah) {
    await panggilApi(`/api/preferensi/${d.id_ubah}`, { method: 'PUT', body: d.isi });
    await panggilApi(`/api/preferensi/${d.id_ubah}/aktif`, { method: 'POST' });
  } else {
    await panggilApi('/api/preferensi', { method: 'POST', body: d.isi });
  }
  hapusDraf();
}
