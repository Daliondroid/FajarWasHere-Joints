'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import LoginModal from '@/components/auth/LoginModal';
import Logo from '@/components/ui/Logo';
import ScrollProgress from '@/components/ui/ScrollProgress';
import Tombol from '@/components/ui/Tombol';

/** Inisial avatar dari nama akun Google (maks. 2 huruf). */
export function inisial(nama: string | null | undefined): string {
  const huruf = (nama ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .map((k) => k[0]);
  return huruf.slice(0, 2).join('').toUpperCase() || '?';
}

/** Navbar Desktop (Figma `169:423`): Tamu = tombol MASUK, Masuk = chip akun. Tampil mulai breakpoint lg. */
export default function NavbarDesktop({ className = '' }: { className?: string }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const masuk = status === 'authenticated';
  const [loginTerbuka, setLoginTerbuka] = useState(false);
  const [akunTerbuka, setAkunTerbuka] = useState(false);

  const menu = [
    { label: 'Beranda', href: '/', aktif: pathname === '/' },
    { label: 'Cocokin', href: '/cocokin', aktif: pathname.startsWith('/cocokin') || pathname.startsWith('/chat') },
    { label: 'Preferensi', href: '/preferensi', aktif: pathname.startsWith('/preferensi') },
    { label: 'Simulasi', href: '/katalog', aktif: pathname.startsWith('/katalog') || pathname.startsWith('/test-drive') },
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 hidden bg-paper lg:block ${className}`}>
        <div className="flex h-[76px] items-center gap-9 px-12">
          <Link href="/" className="flex items-center gap-3">
            <Logo ukuran={40} />
            <span className="t-label-l text-ink">Cocokin!</span>
          </Link>
          <div className="flex-1" />
          {menu.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              aria-current={m.aktif ? 'page' : undefined}
              className={`flex flex-col items-center gap-1 t-label-m ${m.aktif ? 'text-blue' : 'text-ink hover:text-blue'}`}
            >
              {m.label}
              {m.aktif && <span className="h-[3px] w-6 bg-blue" />}
            </Link>
          ))}
          {masuk ? (
            <div className="relative">
              <button
                type="button"
                aria-expanded={akunTerbuka}
                aria-haspopup="menu"
                onClick={() => setAkunTerbuka((t) => !t)}
                className="flex items-center gap-2.5 border-[1.5px] border-ink py-1.5 pr-2.5 pl-1.5 cursor-pointer"
              >
                <span className="flex size-8 items-center justify-center border-2 border-ink bg-yellow t-label-s text-ink">
                  {inisial(session?.user?.name)}
                </span>
                <span className="max-w-[160px] truncate t-label-m text-ink">{session?.user?.name ?? 'Akun'}</span>
                <img src="/figma/icon-chevron-down-14.svg" alt="" width={14} height={14} />
              </button>
              {akunTerbuka && (
                <div
                  role="menu"
                  className="absolute top-full right-0 mt-2 flex w-[200px] flex-col gap-1 border-2 border-ink bg-paper p-2 shadow-pixel-sm"
                >
                  <Link role="menuitem" href="/preferensi" onClick={() => setAkunTerbuka(false)} className="px-3 py-2 t-label-m text-ink hover:bg-blue-50">
                    Kelola preferensi
                  </Link>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="px-3 py-2 text-left t-label-m text-ink hover:bg-blue-50 cursor-pointer"
                  >
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : status === 'unauthenticated' ? (
            <Tombol ukuran="M" onClick={() => setLoginTerbuka(true)}>
              Masuk
            </Tombol>
          ) : (
            <span className="h-11 w-[120px]" aria-hidden />
          )}
        </div>
        <ScrollProgress />
      </header>
      <LoginModal isOpen={loginTerbuka} onClose={() => setLoginTerbuka(false)} />
    </>
  );
}
