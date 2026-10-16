'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { PreferensiRingkas } from '@/types';

/** Pemilih Preferensi (Figma `168:181`, PRD F-19): ganti preferensi aktif di Beranda, Rekomendasi, Chat, Simulasi. */
export default function PemilihPreferensi({
  daftar,
  onPilih,
  className = '',
}: {
  daftar: PreferensiRingkas[];
  onPilih: (id: string) => void;
  className?: string;
}) {
  const [buka, setBuka] = useState(false);
  const aktif = daftar.find((p) => p.aktif) ?? daftar[0];
  if (!aktif) return null;

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={buka}
        onClick={() => setBuka((b) => !b)}
        className="flex w-full items-center gap-2.5 border-2 border-ink bg-paper py-2 pr-3 pl-2.5 text-left shadow-pixel-sm cursor-pointer"
      >
        <span className={`size-4 shrink-0 border-[1.5px] border-ink ${aktif.jalur === 'snbp' ? 'bg-yellow' : 'bg-blue'}`} />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="whitespace-nowrap t-label-s text-muted">PREFERENSI AKTIF · {aktif.jalur.toUpperCase()}</span>
          <span className="truncate t-label-m text-ink">{aktif.nama}</span>
        </span>
        <img src="/figma/icon-chevron-down-14.svg" alt="" width={14} height={14} className={buka ? 'rotate-180' : ''} />
      </button>

      {buka && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setBuka(false)} />
          <ul role="listbox" className="absolute top-full right-0 left-0 z-50 mt-1.5 border-2 border-ink bg-paper shadow-pixel-sm">
            {daftar.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={p.aktif}
                  onClick={() => {
                    setBuka(false);
                    if (!p.aktif) onPilih(p.id);
                  }}
                  className={`flex w-full items-center gap-2.5 px-2.5 py-2 text-left cursor-pointer ${p.aktif ? 'bg-blue-50' : 'hover:bg-canvas'}`}
                >
                  <span className={`size-3.5 shrink-0 border-[1.5px] border-ink ${p.jalur === 'snbp' ? 'bg-yellow' : 'bg-blue'}`} />
                  <span className="flex-1 truncate t-label-m text-ink">{p.nama}</span>
                  {p.aktif && <span className="t-label-s text-blue-700">AKTIF</span>}
                </button>
              </li>
            ))}
            <li className="border-t-2 border-dashed border-ink">
              <Link href="/preferensi/baru" className="block px-2.5 py-2 t-body-s font-bold text-blue-700">
                + Tambah preferensi
              </Link>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}
