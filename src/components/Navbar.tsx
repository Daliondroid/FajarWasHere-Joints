'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface NavbarProps {
  onMenuClick?: () => void;
  isOpen?: boolean;
}

export default function Navbar({ onMenuClick, isOpen: controlledIsOpen }: NavbarProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (onMenuClick) {
      onMenuClick();
    } else {
      setInternalIsOpen((prev) => !prev);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-black">
      <div className="w-full max-w-[402px] mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Logo Toga Pixel + Text Cocokin! */}
        <Link href="/" className="flex items-center gap-2">
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

        {/* Pixel Hamburger Menu Icon */}
        <button
          type="button"
          aria-label="Menu"
          onClick={handleToggle}
          className="p-1 cursor-pointer flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
        >
          <span className="w-5 h-[3px] bg-black block"></span>
          <span className="w-5 h-[3px] bg-black block"></span>
          <span className="w-5 h-[3px] bg-black block"></span>
        </button>
      </div>

      {/* 4-Color Strip Bar below Header (Google/JOINTS Palette) */}
      <div className="w-full grid grid-cols-4 h-[3px]">
        <div className="bg-[#4285F4]"></div>
        <div className="bg-[#EA4335]"></div>
        <div className="bg-[#FBBC05]"></div>
        <div className="bg-[#34A853]"></div>
      </div>

      {/* Dropdown Menu (Figma Frame 68:528) */}
      {isOpen && (
        <div className="w-full max-w-[402px] mx-auto bg-white border-b-[3px] border-black px-5 pt-4 pb-6 shadow-[0px_4px_0px_#000] animate-in fade-in slide-in-from-top-1 duration-100">
          <nav className="flex flex-col gap-4">
            {/* Beranda */}
            <div className="flex flex-col items-start">
              <Link
                href="/"
                onClick={() => setInternalIsOpen(false)}
                className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-black hover:text-[#4285F4] transition-colors"
              >
                Beranda
              </Link>
              <div className="flex gap-1.5 mt-1.5">
                <div className="w-[54px] h-[3px] bg-[#4285F4]"></div>
                <div className="w-[11px] h-[3px] bg-[#4285F4]"></div>
              </div>
            </div>

            {/* Cocokin */}
            <div className="flex flex-col items-start">
              <Link
                href="/cocokin"
                onClick={() => setInternalIsOpen(false)}
                className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-black hover:text-[#EA4335] transition-colors"
              >
                Cocokin
              </Link>
              <div className="flex gap-1.5 mt-1.5">
                <div className="w-[54px] h-[3px] bg-[#EA4335]"></div>
                <div className="w-[11px] h-[3px] bg-[#EA4335]"></div>
              </div>
            </div>

            {/* Edit Preferensi */}
            <div className="flex flex-col items-start">
              <Link
                href="/preferensi/minat"
                onClick={() => setInternalIsOpen(false)}
                className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-black hover:text-[#34A853] transition-colors"
              >
                Edit Preferensi
              </Link>
              <div className="flex gap-1.5 mt-1.5">
                <div className="w-[54px] h-[3px] bg-[#34A853]"></div>
                <div className="w-[11px] h-[3px] bg-[#34A853]"></div>
              </div>
            </div>

            {/* Masuk Button */}
            <Link
              href="/cocokin"
              onClick={() => setInternalIsOpen(false)}
              className="w-full mt-2 bg-[#4285F4] hover:bg-[#3367D6] text-white font-['Press_Start_2P',monospace] text-xs sm:text-sm py-3 px-4 border-[3px] border-black shadow-[4px_4px_0px_#000] flex items-center justify-between active:translate-y-0.5 transition-colors"
            >
              <span>MASUK</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3L19 12L5 21V3Z" fill="currentColor"/>
              </svg>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
