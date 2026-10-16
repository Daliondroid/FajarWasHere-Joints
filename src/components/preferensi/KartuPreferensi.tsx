'use client';

import { useState } from 'react';
import type { PreferensiRingkas } from '@/types';
import Tombol from '@/components/ui/Tombol';

const NAMA_SKALA: Record<string, string> = {
  R: 'Realistik',
  I: 'Investigatif',
  A: 'Artistik',
  S: 'Sosial',
  E: 'Enterprising',
  C: 'Konvensional',
};

const tanggal = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

const WARNA = {
  snbp: { aktif: 'bg-yellow shadow-pixel-md', tidak: 'bg-yellow-200 shadow-pixel-sm', jalur: 'Jalur prestasi' },
  snbt: { aktif: 'bg-blue shadow-pixel-md', tidak: 'bg-blue-200 shadow-pixel-sm', jalur: 'Jalur tes UTBK' },
};

function TombolIkon({ ikon, label, onClick }: { ikon: string; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-8 shrink-0 items-center justify-center border-[1.5px] border-ink bg-paper cursor-pointer"
    >
      <img src={ikon} alt="" width={16} height={16} />
    </button>
  );
}

/** Preferensi Card (Figma `168:160`, PRD F-18): kuning SNBP, biru SNBT; aktif = warna penuh + AKTIF (BR-16). */
export default function KartuPreferensi({
  p,
  onAktifkan,
  onUbah,
  onGantiNama,
  onHapus,
}: {
  p: PreferensiRingkas;
  onAktifkan: () => void;
  onUbah: () => void;
  onGantiNama: () => void;
  onHapus: () => void;
}) {
  const [menu, setMenu] = useState(false);
  const w = WARNA[p.jalur];
  const r = p.rekomendasi_teratas;
  // Kartu SNBT aktif berlatar blue: teks paper / blue-50 (Figma `168:107`).
  const gelap = p.aktif && p.jalur === 'snbt';
  const teks = gelap ? 'text-paper' : 'text-ink';
  const teks2 = gelap ? 'text-blue-50' : 'text-ink-2';

  return (
    <article className={`relative flex flex-col gap-3 border-2 border-ink p-4 ${p.aktif ? w.aktif : w.tidak}`}>
      <div className="flex items-center gap-2">
        <span className="bg-ink px-2 py-1 t-button text-paper">{p.jalur.toUpperCase()}</span>
        <span className={`t-body-s font-bold ${teks}`}>{w.jalur}</span>
        <span className="flex-1" />
        {p.aktif && (
          <span className="flex items-center gap-1.5 border-[1.5px] border-ink bg-paper px-2 py-1">
            <img src="/figma/icon-check-hijau.svg" alt="" width={12} height={12} />
            <span className="t-label-s text-green">AKTIF</span>
          </span>
        )}
      </div>
      <h3 className={`t-label-l ${teks}`}>{p.nama}</h3>
      <p className={`t-body-s font-bold ${teks2}`}>
        {p.kode_holland} · {NAMA_SKALA[p.kode_holland[0]] ?? ''}
      </p>
      <div className="flex flex-col gap-0.5 border-[1.5px] border-ink bg-paper px-3 py-2.5">
        <span className="t-label-s text-muted">REKOMENDASI TERATAS</span>
        {r ? (
          <>
            <span className="t-body-m font-semibold text-ink">
              {r.nama_prodi} · {r.nama_ptn}
            </span>
            <span className="t-body-s text-ink-2">Cocok {Math.round(r.skor)}%</span>
          </>
        ) : (
          <span className="t-body-s text-ink-2">Belum ada prodi yang cocok.</span>
        )}
      </div>
      <div className="relative flex items-center gap-2">
        {p.aktif ? (
          <span className={`t-body-s ${teks2}`}>Diperbarui {tanggal(p.diperbarui_pada)}</span>
        ) : (
          <Tombol jenis="secondary" ukuran="M" onClick={onAktifkan}>
            Jadikan aktif
          </Tombol>
        )}
        <span className="flex-1" />
        <TombolIkon ikon="/figma/icon-edit.svg" label={`Ubah ${p.nama}`} onClick={onUbah} />
        <TombolIkon ikon="/figma/icon-dots.svg" label={`Menu ${p.nama}`} onClick={() => setMenu((m) => !m)} />
        {menu && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setMenu(false)} />
            <div className="absolute top-full right-0 z-40 mt-1.5 flex w-40 flex-col border-2 border-ink bg-paper shadow-pixel-sm">
              <button
                type="button"
                onClick={() => {
                  setMenu(false);
                  onGantiNama();
                }}
                className="px-3 py-2 text-left t-body-s font-bold text-ink hover:bg-canvas cursor-pointer"
              >
                Ganti nama
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenu(false);
                  onHapus();
                }}
                className="border-t-[1.5px] border-ink px-3 py-2 text-left t-body-s font-bold text-red hover:bg-red-50 cursor-pointer"
              >
                Hapus preferensi
              </button>
            </div>
          </>
        )}
      </div>
    </article>
  );
}
