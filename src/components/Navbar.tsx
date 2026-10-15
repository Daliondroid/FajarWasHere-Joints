'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Icon } from '@/components/ui/Icon';
import ScrollProgress from '@/components/ui/ScrollProgress';
import LoginModal from '@/components/auth/LoginModal';

interface NavbarProps {
  onMenuClick?: () => void;
  isOpen?: boolean;
  backHref?: string;
  title?: string;
}

export default function Navbar({
  onMenuClick,
  isOpen: controlledIsOpen,
  backHref,
  title,
}: NavbarProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isAuthenticated = status === 'authenticated';
  const userName = session?.user?.name || 'Ari Rahman';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

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
          {backHref ? (
            <div className="flex items-center gap-3">
              <Link
                href={backHref}
                className="p-1 hover:bg-gray-100 border border-black shadow-[1px_1px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center transition-all"
                aria-label="Kembali"
              >
                <Icon name="back" className="w-4 h-4 text-black" />
              </Link>
              {title && (
                <span className="font-['Outfit',sans-serif] font-bold text-sm text-black truncate max-w-[200px]">
                  {title}
                </span>
              )}
            </div>
          ) : (
            /* Logo Toga Pixel + Text Cocokin! */
            <Link href="/" onClick={closeMenu} className="flex items-center gap-2">
              <Image
                src="/assets/logo-cap.png"
                alt="Cocokin Logo"
                width={32}
                height={32}
                priority
                className="w-8 h-8 object-contain image-pixelated"
              />
              <span className="font-['Press_Start_2P',monospace] text-sm font-black text-black tracking-tight">
                Cocokin!
              </span>
            </Link>
          )}

          {/* Right Action: Avatar/Masuk + Hamburger Menu */}
          <div className="flex items-center gap-2">
            {!backHref && (
              isAuthenticated ? (
                <div
                  className="w-7 h-7 bg-[#EEF5FF] border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_#000000] text-[10px] font-bold font-['Press_Start_2P',monospace] text-[#277EFD]"
                  title={userName}
                >
                  {userInitials || 'AR'}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-2.5 py-1 bg-[#4285F4] text-white border border-black shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[8px] hover:bg-[#277EFD] transition-colors cursor-pointer"
                >
                  MASUK
                </button>
              )
            )}

            {/* Toggle Button: Hamburger or Close X */}
            <button
              type="button"
              aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
              onClick={handleToggle}
              className="p-1 cursor-pointer flex items-center justify-center active:scale-95 transition-transform"
            >
              {isOpen ? (
                <Icon name="close" className="w-5 h-5 text-black" />
              ) : (
                <Icon name="menu" className="w-5 h-5 text-black" />
              )}
            </button>
          </div>
        </div>

        {/* 4-Color Strip Bar with Reactive Scroll Progress (F-01) */}
        <ScrollProgress />
      </header>

      {/* Menu Overlay Drawer (Figma M02 / 172:344) */}
      {isOpen && (
        <div className="fixed inset-0 top-[49px] z-40 bg-black/50 backdrop-blur-[1px] flex justify-center">
          <div className="w-full max-w-[402px] bg-white border-b-2 border-black shadow-[0_8px_0_0_#000000] flex flex-col max-h-[calc(100vh-49px)] overflow-y-auto">
            {/* User Session Info if authenticated */}
            {isAuthenticated && (
              <div className="p-4 bg-[#EEF5FF] border-b-2 border-black flex items-center gap-3">
                <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center font-['Press_Start_2P',monospace] text-xs font-bold text-[#277EFD] shadow-[2px_2px_0px_#000000]">
                  {userInitials || 'AR'}
                </div>
                <div className="min-w-0">
                  <p className="font-['Outfit',sans-serif] font-bold text-sm text-black truncate">
                    {userName}
                  </p>
                  <p className="font-['Outfit',sans-serif] text-xs text-gray-600 truncate">
                    {session?.user?.email || 'siswa@sma.sch.id'}
                  </p>
                </div>
              </div>
            )}

            <nav className="p-4 flex flex-col gap-2 font-['Press_Start_2P',monospace] text-[10px]">
              <Link
                href="/"
                onClick={closeMenu}
                className={`flex items-center justify-between px-3 py-3 border border-black shadow-[2px_2px_0px_#000000] transition-colors ${
                  pathname === '/'
                    ? 'bg-[#EEF5FF] text-[#277EFD]'
                    : 'bg-white hover:bg-gray-50 text-black'
                }`}
              >
                <span>BERANDA</span>
                <Icon name="chevron-right" className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/cocokin"
                onClick={closeMenu}
                className={`flex items-center justify-between px-3 py-3 border border-black shadow-[2px_2px_0px_#000000] transition-colors ${
                  pathname === '/cocokin'
                    ? 'bg-[#EEF5FF] text-[#277EFD]'
                    : 'bg-white hover:bg-gray-50 text-black'
                }`}
              >
                <span>COCOKIN (REKOMENDASI)</span>
                <Icon name="chevron-right" className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/preferensi"
                onClick={closeMenu}
                className={`flex items-center justify-between px-3 py-3 border border-black shadow-[2px_2px_0px_#000000] transition-colors ${
                  pathname.startsWith('/preferensi')
                    ? 'bg-[#EEF5FF] text-[#277EFD]'
                    : 'bg-white hover:bg-gray-50 text-black'
                }`}
              >
                <span>KELOLA PREFERENSI</span>
                <Icon name="chevron-right" className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/katalog"
                onClick={closeMenu}
                className={`flex items-center justify-between px-3 py-3 border border-black shadow-[2px_2px_0px_#000000] transition-colors ${
                  pathname.startsWith('/katalog') || pathname.startsWith('/test-drive')
                    ? 'bg-[#EEF5FF] text-[#277EFD]'
                    : 'bg-white hover:bg-gray-50 text-black'
                }`}
              >
                <span>SIMULASI KULIAH</span>
                <Icon name="chevron-right" className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/chat"
                onClick={closeMenu}
                className={`flex items-center justify-between px-3 py-3 border border-black shadow-[2px_2px_0px_#000000] transition-colors ${
                  pathname.startsWith('/chat')
                    ? 'bg-[#EEF5FF] text-[#277EFD]'
                    : 'bg-white hover:bg-gray-50 text-black'
                }`}
              >
                <span>CHAT AI</span>
                <Icon name="chevron-right" className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/syarat-ketentuan"
                onClick={closeMenu}
                className={`flex items-center justify-between px-3 py-3 border border-black shadow-[2px_2px_0px_#000000] transition-colors ${
                  pathname === '/syarat-ketentuan'
                    ? 'bg-[#EEF5FF] text-[#277EFD]'
                    : 'bg-white hover:bg-gray-50 text-black'
                }`}
              >
                <span>SYARAT & KETENTUAN</span>
                <Icon name="chevron-right" className="w-3.5 h-3.5" />
              </Link>
            </nav>

            <div className="p-4 border-t-2 border-black bg-gray-50">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    signOut();
                  }}
                  className="w-full py-2.5 bg-red-100 hover:bg-red-200 border-2 border-black font-['Press_Start_2P',monospace] text-[9px] text-red-700 shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
                >
                  KELUAR DARI AKUN
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    setIsLoginModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-[#4285F4] hover:bg-[#277EFD] text-white border-2 border-black font-['Press_Start_2P',monospace] text-[9px] shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
                >
                  MASUK DENGAN GOOGLE
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Login Google */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
