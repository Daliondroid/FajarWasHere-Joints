'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import ScrollProgress from '@/components/ui/ScrollProgress';
import Logo from '@/components/ui/Logo';
import MenuDrawer from '@/components/MenuDrawer';

/** Inisial avatar dari nama akun Google (maks. 2 huruf). */
export function inisial(nama: string | null | undefined): string {
  const huruf = (nama ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .map((k) => k[0]);
  return huruf.slice(0, 2).join('').toUpperCase() || '?';
}

/** Top Bar varian Brand (Figma `80:95`) + drawer menu (M02 `172:344`). */
export default function Navbar() {
  const [terbuka, setTerbuka] = useState(false);
  const { data: session, status } = useSession();
  const masuk = status === 'authenticated';

  return (
    <>
      <header className="sticky top-0 z-50 bg-paper">
        <div className="flex h-[60px] items-center gap-2 px-3">
          <Link href="/" onClick={() => setTerbuka(false)} className="flex flex-1 min-w-0 items-center gap-2 pl-1">
            <Logo />
            <span className="t-label-l text-ink">Cocokin!</span>
          </Link>
          {masuk && !terbuka && (
            <span
              title={session?.user?.name ?? undefined}
              className="flex size-8 shrink-0 items-center justify-center border-2 border-ink bg-yellow t-label-s text-ink"
            >
              {inisial(session?.user?.name)}
            </span>
          )}
          <button
            type="button"
            aria-label={terbuka ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={terbuka}
            onClick={() => setTerbuka((t) => !t)}
            className="flex size-10 shrink-0 items-center justify-center cursor-pointer"
          >
            <img src={terbuka ? '/figma/icon-close.svg' : '/figma/icon-menu.svg'} alt="" width={20} height={20} />
          </button>
        </div>
        <ScrollProgress />
      </header>

      <MenuDrawer terbuka={terbuka} setTerbuka={setTerbuka} />
    </>
  );
}
