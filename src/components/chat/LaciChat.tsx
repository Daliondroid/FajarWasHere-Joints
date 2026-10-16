'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import type { PreferensiRingkas } from '@/types';
import PemilihPreferensi from '@/components/ui/PemilihPreferensi';

const NAV = [
  { label: 'Simulasi', href: '/katalog', ikon: '/figma/icon-simulasi.svg' },
  { label: 'Preferensi', href: '/preferensi', ikon: '/figma/icon-preferensi.svg' },
  { label: 'Rekomendasi', href: '/cocokin', ikon: '/figma/icon-riwayat.svg' },
];

/**
 * Side drawer chat (Figma M16 `177:1673`, Hal. 11). Riwayat chat di API berupa satu percakapan per akun,
 * jadi daftar riwayat berisi percakapan saat ini + tombol hapus riwayat (DELETE /api/chat).
 */
export default function LaciChat({
  daftar,
  onPilih,
  judulPercakapan,
  tanggal,
  onHapusRiwayat,
  onTutup,
}: {
  daftar: PreferensiRingkas[] | null;
  onPilih: (id: string) => void;
  judulPercakapan: string | null;
  tanggal: string | null;
  onHapusRiwayat: () => void;
  onTutup: () => void;
}) {
  return (
    <div role="dialog" aria-modal="true" aria-label="Menu chat" className="fixed inset-0 z-[60] flex justify-center">
      <div className="absolute inset-0 bg-ink/55" onClick={onTutup} />
      <div className="relative h-full w-full max-w-[402px]" onClick={onTutup}>
        <aside
          onClick={(e) => e.stopPropagation()}
          className="absolute top-0 right-0 flex h-full w-[320px] flex-col gap-3.5 overflow-y-auto border-l-2 border-ink bg-paper px-4 pt-4 pb-6"
        >
          <div className="flex items-center gap-2">
            <p className="flex-1 t-display-s text-ink">Menu</p>
            <button type="button" aria-label="Tutup menu" onClick={onTutup} className="cursor-pointer">
              <img src="/figma/icon-close-18.svg" alt="" width={18} height={18} />
            </button>
          </div>
          {daftar && daftar.length > 0 && <PemilihPreferensi daftar={daftar} onPilih={onPilih} className="w-full" />}
          <Link href="/preferensi" className="t-body-s font-bold text-blue">
            Kelola preferensi →
          </Link>
          <nav className="flex flex-col gap-0.5">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="flex items-center gap-3 px-4 py-3">
                <img src={n.ikon} alt="" width={20} height={20} />
                <span className="flex-1 t-label-m text-ink">{n.label}</span>
                <img src="/figma/icon-chevron-right.svg" alt="" width={14} height={14} />
              </Link>
            ))}
          </nav>
          <img src="/figma/garis-putus-288.svg" alt="" className="h-0.5 w-full" />
          <p className="t-label-s text-muted">RIWAYAT CHAT</p>
          <div className="flex flex-1 flex-col gap-1">
            {judulPercakapan ? (
              <>
                <div className="flex items-center gap-2.5 border-[1.5px] border-blue bg-blue-50 px-3 py-2.5">
                  <img src="/figma/icon-chat-aktif.svg" alt="" width={16} height={16} />
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className="truncate t-body-s font-bold text-blue-700">{judulPercakapan}</p>
                    {tanggal && <p className="t-body-s text-muted">{tanggal}</p>}
                  </div>
                </div>
                <button type="button" onClick={onHapusRiwayat} className="self-start px-3 py-1 t-body-s font-bold text-red cursor-pointer">
                  Hapus riwayat chat
                </button>
              </>
            ) : (
              <p className="flex items-center gap-2.5 px-3 py-2.5 t-body-s text-muted">
                <img src="/figma/icon-chat.svg" alt="" width={16} height={16} />
                Belum ada percakapan.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2.5 border-[1.5px] border-red p-3 cursor-pointer"
          >
            <img src="/figma/icon-logout.svg" alt="" width={16} height={16} />
            <span className="t-label-m text-red">Keluar (Logout)</span>
          </button>
        </aside>
      </div>
    </div>
  );
}
