'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import LoginModal from '@/components/auth/LoginModal';
import IkonFigma from '@/components/ui/IkonFigma';
import Tombol from '@/components/ui/Tombol';

/** Drawer menu mobile (Figma M02 `172:467`) di bawah Top Bar 64 px. */
export default function MenuDrawer({ terbuka, setTerbuka }: { terbuka: boolean; setTerbuka: (b: boolean) => void }) {
  const [loginTerbuka, setLoginTerbuka] = useState(false);
  const pathname = usePathname();
  const { status } = useSession();
  const masuk = status === 'authenticated';

  const menu = [
    { label: 'Beranda', href: '/', ikon: '/figma/icon-home-aktif.svg', aktif: pathname === '/' },
    { label: 'Cocokin', href: '/cocokin', ikon: '/figma/icon-cocokin.svg', aktif: pathname.startsWith('/cocokin') },
    { label: 'Preferensi', href: '/preferensi', ikon: '/figma/icon-preferensi.svg', aktif: pathname.startsWith('/preferensi') },
    {
      label: 'Simulasi',
      href: '/katalog',
      ikon: '/figma/icon-simulasi.svg',
      aktif: pathname.startsWith('/katalog') || pathname.startsWith('/test-drive'),
    },
  ];

  return (
    <>
      {terbuka && (
        <div className="fixed inset-0 top-16 z-40" onClick={() => setTerbuka(false)}>
          <div className="absolute inset-0 bg-ink/55" />
          <nav
            className="relative mx-auto flex w-full max-w-[402px] flex-col gap-1 border-b-2 border-ink bg-paper px-6 pt-4 pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            {menu.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                onClick={() => setTerbuka(false)}
                className={`flex items-center gap-3 px-4 py-3 ${
                  m.aktif ? 'border-l-4 border-blue bg-blue-50 text-blue-700' : 'text-ink'
                }`}
              >
                <IkonFigma src={m.ikon} ukuran={20} className={m.aktif ? 'text-blue' : 'text-ink'} />
                <span className="flex-1 t-label-m">{m.label}</span>
                <IkonFigma src="/figma/icon-chevron-right.svg" ukuran={14} className={m.aktif ? 'text-blue' : 'text-ink'} />
              </Link>
            ))}
            <img src="/figma/garis-putus.svg" alt="" width={354} height={2} className="w-full h-0.5" />
            <div className="h-2" />
            {masuk ? (
              <Tombol
                jenis="secondary"
                penuh
                onClick={() => {
                  setTerbuka(false);
                  signOut({ callbackUrl: '/' });
                }}
              >
                Keluar
              </Tombol>
            ) : (
              <Tombol
                penuh
                onClick={() => {
                  setTerbuka(false);
                  setLoginTerbuka(true);
                }}
              >
                Masuk dengan Google
              </Tombol>
            )}
          </nav>
        </div>
      )}

      <LoginModal isOpen={loginTerbuka} onClose={() => setLoginTerbuka(false)} />
    </>
  );
}
