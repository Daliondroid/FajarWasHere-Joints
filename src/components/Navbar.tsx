'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

interface NavbarProps {
  onMenuClick?: () => void;
  isOpen?: boolean;
}

export default function Navbar({ onMenuClick, isOpen: controlledIsOpen }: NavbarProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const pathname = usePathname();

  const handleToggle = () => {
    if (onMenuClick) {
      onMenuClick();
    } else {
      setInternalIsOpen((prev) => !prev);
    }
  };

  const closeMenu = () => {
    if (onMenuClick && controlledIsOpen) {
      onMenuClick();
    } else {
      setInternalIsOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b-2 border-black">
        <div className="w-full max-w-[402px] mx-auto px-4 py-2.5 flex items-center justify-between">
          {/* Logo Toga Pixel + Text Cocokin! */}
          <Link href="/" onClick={closeMenu} className="flex items-center gap-2">
            <Image
              src="/assets/logo-cap.png"
              alt="Cocokin Logo"
              width={34}
              height={34}
              priority
              className="w-[34px] h-[34px] object-contain image-pixelated"
            />
            <span className="font-['Press_Start_2P',monospace] text-base font-black text-black tracking-tight">
              Cocokin!
            </span>
          </Link>

          {/* Toggle Button: Hamburger or Close X */}
          <button
            type="button"
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            onClick={handleToggle}
            className="p-1 cursor-pointer flex items-center justify-center active:scale-95 transition-transform"
          >
            {isOpen ? (
              <Icon name="close" className="w-5 h-5 text-black" />
            ) : (
              <Icon name="menu" className="w-6 h-6 text-black" />
            )}
          </button>
        </div>

        {/* 4-Color Strip Bar below Header */}
        <div className="w-full grid grid-cols-4 h-[3px]">
          <div className="bg-[#277EFD]"></div>
          <div className="bg-[#F1402E]"></div>
          <div className="bg-[#FEBD01]"></div>
          <div className="bg-[#22A94F]"></div>
        </div>

        {/* Dropdown Menu Overlay matching Figma HIFI v2 (110:604) */}
        {isOpen && (
          <div className="w-full max-w-[402px] mx-auto bg-white border-b-[3px] border-black px-4 pt-3 pb-5 shadow-[0px_4px_0px_#000] relative z-50 animate-in fade-in slide-in-from-top-1 duration-100">
            <nav className="flex flex-col gap-1.5">
              {/* 1. Beranda */}
              <Link
                href="/"
                onClick={closeMenu}
                className={`flex items-center justify-between px-3 py-2.5 transition-colors ${
                  pathname === '/'
                    ? 'bg-[#EEF5FF] border-l-4 border-[#277EFD] text-[#277EFD]'
                    : 'hover:bg-gray-50 text-black'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon name="home" className={`w-5 h-5 ${pathname === '/' ? 'text-[#277EFD]' : 'text-black'}`} />
                  <span className="font-['Press_Start_2P',monospace] text-[11px]">Beranda</span>
                </div>
                <Icon name="chevron-right" className={`w-4 h-4 ${pathname === '/' ? 'text-[#277EFD]' : 'text-gray-400'}`} />
              </Link>

              {/* 2. Cocokin */}
              <Link
                href="/cocokin"
                onClick={closeMenu}
                className={`flex items-center justify-between px-3 py-2.5 transition-colors ${
                  pathname === '/cocokin' || pathname === '/rekomendasi'
                    ? 'bg-[#EEF5FF] border-l-4 border-[#277EFD] text-[#277EFD]'
                    : 'hover:bg-gray-50 text-black'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon name="plus" className="w-5 h-5 text-black" />
                  <span className="font-['Press_Start_2P',monospace] text-[11px]">Cocokin</span>
                </div>
                <Icon name="chevron-right" className="w-4 h-4 text-gray-400" />
              </Link>

              {/* 3. Simulasi jurusan */}
              <Link
                href="/katalog"
                onClick={closeMenu}
                className={`flex items-center justify-between px-3 py-2.5 transition-colors ${
                  pathname.startsWith('/katalog') || pathname.startsWith('/test-drive')
                    ? 'bg-[#EEF5FF] border-l-4 border-[#277EFD] text-[#277EFD]'
                    : 'hover:bg-gray-50 text-black'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon name="play" className="w-5 h-5 text-black" />
                  <span className="font-['Press_Start_2P',monospace] text-[11px]">Simulasi jurusan</span>
                </div>
                <Icon name="chevron-right" className="w-4 h-4 text-gray-400" />
              </Link>

              {/* 4. Edit preferensi */}
              <Link
                href="/preferensi/minat"
                onClick={closeMenu}
                className={`flex items-center justify-between px-3 py-2.5 transition-colors ${
                  pathname.startsWith('/preferensi')
                    ? 'bg-[#EEF5FF] border-l-4 border-[#277EFD] text-[#277EFD]'
                    : 'hover:bg-gray-50 text-black'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon name="edit" className="w-5 h-5 text-black" />
                  <span className="font-['Press_Start_2P',monospace] text-[11px]">Edit preferensi</span>
                </div>
                <Icon name="chevron-right" className="w-4 h-4 text-gray-400" />
              </Link>
            </nav>

            {/* Separator Dashed */}
            <div className="my-4 border-t-2 border-dashed border-gray-300" />

            {/* Tombol MASUK */}
            <Link
              href="/login"
              onClick={closeMenu}
              className="w-full pixel-btn-blue py-3 px-4 text-center justify-center flex items-center gap-2"
            >
              <span>MASUK</span>
              <Icon name="arrow-right" className="w-4 h-4 text-white" />
            </Link>

            {/* Subtext */}
            <p className="mt-3 text-center text-xs text-gray-600">
              Belum punya akun?{' '}
              <Link href="/daftar" onClick={closeMenu} className="text-[#277EFD] font-bold hover:underline">
                Daftar gratis
              </Link>
            </p>
          </div>
        )}
      </header>

      {/* Scrim backdrop */}
      {isOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 bg-black/60 z-40 transition-opacity"
          aria-hidden="true"
        />
      )}
    </>
  );
}
