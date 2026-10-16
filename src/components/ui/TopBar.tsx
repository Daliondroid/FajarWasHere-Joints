'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ScrollProgress from '@/components/ui/ScrollProgress';
import MenuDrawer from '@/components/MenuDrawer';

interface TopBarProps {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  showBack?: boolean;
  /** Tombol menu di kanan yang membuka drawer navigasi (mis. Chat M15). */
  denganMenu?: boolean;
}

/** Top Bar varian Back (Figma `80:108`): tombol kembali 40, judul Display/S di tengah, aksi opsional. */
export const TopBar: React.FC<TopBarProps> = ({ title, onBack, rightElement, showBack = true, denganMenu = false }) => {
  const router = useRouter();
  const [menu, setMenu] = useState(false);

  return (
    <>
    <header className="sticky top-0 z-50 bg-paper">
      <div className="flex h-[60px] items-center gap-2 px-3">
        <div className="size-10 shrink-0">
          {showBack && (
            <button
              type="button"
              onClick={onBack ?? (() => router.back())}
              aria-label="Kembali"
              className="flex size-10 items-center justify-center cursor-pointer"
            >
              <img src="/figma/icon-back.svg" alt="" width={20} height={20} />
            </button>
          )}
        </div>
        <h1 className="flex-1 min-w-0 truncate text-center t-display-s text-ink">{title}</h1>
        <div className="flex size-10 shrink-0 items-center justify-center">
          {denganMenu ? (
            <button
              type="button"
              aria-label={menu ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={menu}
              onClick={() => setMenu((m) => !m)}
              className="flex size-10 items-center justify-center cursor-pointer"
            >
              <img src={menu ? '/figma/icon-close.svg' : '/figma/icon-menu.svg'} alt="" width={20} height={20} />
            </button>
          ) : (
            (rightElement ?? null)
          )}
        </div>
      </div>
      <ScrollProgress />
    </header>
    {denganMenu && <MenuDrawer terbuka={menu} setTerbuka={setMenu} />}
    </>
  );
};
