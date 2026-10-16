'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Icon, IconName } from '@/components/ui/Icon';
import ScrollProgress from '@/components/ui/ScrollProgress';
import LoginModal from '@/components/auth/LoginModal';

interface NavbarProps {
  onMenuClick?: () => void;
  isOpen?: boolean;
  backHref?: string;
  title?: string;
  rightElement?: React.ReactNode;
}

export default function Navbar({
  onMenuClick,
  isOpen: controlledIsOpen,
  backHref,
  title,
  rightElement,
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

  // Nav Items persis Figma M02 (node 172:344, component 81:128)
  const navItems: { label: string; href: string; icon: IconName; isActive: boolean }[] = [
    {
      label: 'Beranda',
      href: '/',
      icon: 'home',
      isActive: pathname === '/',
    },
    {
      label: 'Cocokin',
      href: '/cocokin',
      icon: 'spark',
      isActive: pathname.startsWith('/cocokin') || pathname.startsWith('/rekomendasi'),
    },
    {
      label: 'Preferensi',
      href: '/preferensi',
      icon: 'grid',
      isActive: pathname.startsWith('/preferensi'),
    },
    {
      label: 'Test Drive',
      href: '/katalog',
      icon: 'play',
      isActive: pathname.startsWith('/katalog') || pathname.startsWith('/test-drive'),
    },
  ];

  return (
    <>
      {/* ── MOBILE NAVBAR (<1024px) ── */}
      <div className="lg:hidden">
        <header className={`sticky top-0 z-50 bg-white ${isOpen ? '' : 'border-b-2 border-[#151D21]'}`}>
          <div className="w-full max-w-[402px] mx-auto px-4 h-[60px] flex items-center justify-between">
            {backHref ? (
              /* Mode Halaman Detail / Sub-page (persis Figma M20 node 215:3198) */
              <>
                <div className="w-8 flex items-center justify-start">
                  <Link
                    href={backHref}
                    className="p-1 hover:opacity-75 active:scale-90 flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Kembali"
                  >
                    <Icon name="back" className="w-5 h-5 text-[#151D21]" />
                  </Link>
                </div>

                {title && (
                  <h1 className="font-['Press_Start_2P',monospace] text-xs font-bold text-[#151D21] text-center truncate max-w-[260px]">
                    {title}
                  </h1>
                )}

                <div className="w-8 flex items-center justify-end">
                  {rightElement || null}
                </div>
              </>
            ) : (
              /* Mode Beranda / Main Navigation (persis Figma M01/M02 node 172:203 & 172:344) */
              <>
                <Link href="/" onClick={closeMenu} className="flex items-center gap-2">
                  <Image
                    src="/assets/logo-cap.png"
                    alt="Cocokin Logo"
                    width={32}
                    height={32}
                    priority
                    className="w-8 h-8 object-contain image-pixelated"
                  />
                  <span className="font-['Press_Start_2P',monospace] text-sm font-black text-[#151D21] tracking-tight">
                    Cocokin!
                  </span>
                </Link>

                {/* Right Action: Avatar/Masuk + Menu/Close button */}
                <div className="flex items-center gap-2">
                  {!isOpen && (
                    isAuthenticated ? (
                      <div
                        className="w-8 h-8 bg-[#FEBD01] border-2 border-[#151D21] flex items-center justify-center shadow-[1px_1px_0px_#151D21] text-[10px] font-bold font-['Press_Start_2P',monospace] text-[#151D21]"
                        title={userName}
                      >
                        {userInitials || 'AR'}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsLoginModalOpen(true)}
                        className="px-2.5 py-1 bg-[#22A94F] text-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[8px] hover:bg-[#1E9646] transition-colors cursor-pointer"
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
                    className="p-1 cursor-pointer flex items-center justify-center hover:opacity-75 active:scale-95 transition-transform"
                  >
                    {isOpen ? (
                      <Icon name="close" className="w-5 h-5 text-[#151D21]" />
                    ) : (
                      <Icon name="menu" className="w-5 h-5 text-[#151D21]" />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* 4-Color Segmented Scroll Progress Bar (F-01, Figma 167:105) */}
          <ScrollProgress className="pb-1" />
        </header>

        {/* Menu Overlay Drawer (Figma M02 / node 172:344 & 172:467) */}
        {isOpen && (
          <div
            className="fixed inset-0 top-[64px] z-40 bg-[#151D21]/60 backdrop-blur-[1px] flex justify-center animate-fade-in"
            onClick={closeMenu}
          >
            <div
              className="w-full max-w-[402px] bg-white border-b-2 border-[#151D21] shadow-[0_8px_0_0_#151D21] flex flex-col max-h-[calc(100vh-64px)] overflow-y-auto px-6 pt-4 pb-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* User Session Info if authenticated */}
              {isAuthenticated && (
                <div className="mb-3 p-3 bg-[#EEF5FF] border border-[#277EFD] flex items-center gap-3">
                  <div className="w-8 h-8 bg-white border border-[#151D21] flex items-center justify-center font-['Press_Start_2P',monospace] text-[10px] font-bold text-[#277EFD] shadow-[1px_1px_0px_#151D21]">
                    {userInitials || 'AR'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-['Outfit',sans-serif] font-bold text-xs text-[#151D21] truncate">
                      {userName}
                    </p>
                    <p className="font-['Outfit',sans-serif] text-[11px] text-gray-600 truncate">
                      {session?.user?.email || 'siswa@sma.sch.id'}
                    </p>
                  </div>
                </div>
              )}

              {/* 4 Nav Items persis Figma node 172:467 */}
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`flex items-center justify-between py-3 px-4 transition-colors font-['Press_Start_2P',monospace] text-[11px] ${
                      item.isActive
                        ? 'bg-[#EAF2FF] border-l-4 border-[#277EFD] text-[#1A5FD1]'
                        : 'text-[#151D21] hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        name={item.icon}
                        className={`w-4 h-4 shrink-0 ${
                          item.isActive ? 'text-[#277EFD]' : 'text-[#151D21]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    <Icon
                      name="chevron-right"
                      className={`w-3.5 h-3.5 shrink-0 ${
                        item.isActive ? 'text-[#277EFD]' : 'text-[#6B7680]'
                      }`}
                    />
                  </Link>
                ))}
              </nav>

              {/* Pemisah Garis Putus-putus persis Figma M02 */}
              <div className="border-t border-dashed border-[#D9D5CB] my-4" />

              {/* Tombol Aksi Bawah */}
              <div>
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      signOut();
                    }}
                    className="w-full py-3 bg-red-50 hover:bg-red-100 text-[#F1402E] border-2 border-[#151D21] font-['Press_Start_2P',monospace] text-[10px] shadow-[2px_2px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer text-center"
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
                    className="w-full py-3.5 bg-[#277EFD] hover:bg-[#1A5FD1] text-white border-2 border-[#151D21] font-['Press_Start_2P',monospace] text-[10px] shadow-[2px_2px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer text-center"
                  >
                    MASUK DENGAN GOOGLE
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── DESKTOP NAVBAR (≥1024px, Figma D01/D03 node 184:1919 & 184:2164) ── */}
      <div className="hidden lg:block sticky top-0 z-50 bg-white border-b-2 border-[#151D21] w-full">
        <div className="max-w-[1200px] mx-auto px-6 h-[76px] flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/assets/logo-cap.png"
              alt="Cocokin Logo"
              width={40}
              height={40}
              priority
              className="w-10 h-10 object-contain image-pixelated"
            />
            <span className="font-['Pixelify_Sans',sans-serif] text-[20px] font-bold text-[#151D21] tracking-tight">
              Cocokin!
            </span>
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-8">
            <Link
              href="/"
              className="flex flex-col items-center group cursor-pointer"
            >
              <span
                className={`font-['Pixelify_Sans',sans-serif] text-[15px] font-semibold transition-colors ${
                  pathname === '/' ? 'text-[#277EFD]' : 'text-[#151D21] group-hover:text-[#277EFD]'
                }`}
              >
                Beranda
              </span>
              <span
                className={`h-[3px] bg-[#277EFD] transition-all mt-1 ${
                  pathname === '/' ? 'w-6 opacity-100' : 'w-0 opacity-0 group-hover:w-4 group-hover:opacity-50'
                }`}
              />
            </Link>

            <Link
              href="/cocokin"
              className="flex flex-col items-center group cursor-pointer"
            >
              <span
                className={`font-['Pixelify_Sans',sans-serif] text-[15px] font-semibold transition-colors ${
                  pathname.startsWith('/cocokin') || pathname.startsWith('/rekomendasi')
                    ? 'text-[#277EFD]'
                    : 'text-[#151D21] group-hover:text-[#277EFD]'
                }`}
              >
                Cocokin
              </span>
              <span
                className={`h-[3px] bg-[#277EFD] transition-all mt-1 ${
                  pathname.startsWith('/cocokin') || pathname.startsWith('/rekomendasi')
                    ? 'w-6 opacity-100'
                    : 'w-0 opacity-0 group-hover:w-4 group-hover:opacity-50'
                }`}
              />
            </Link>

            <Link
              href="/preferensi"
              className="flex flex-col items-center group cursor-pointer"
            >
              <span
                className={`font-['Pixelify_Sans',sans-serif] text-[15px] font-semibold transition-colors ${
                  pathname.startsWith('/preferensi') ? 'text-[#277EFD]' : 'text-[#151D21] group-hover:text-[#277EFD]'
                }`}
              >
                Preferensi
              </span>
              <span
                className={`h-[3px] bg-[#277EFD] transition-all mt-1 ${
                  pathname.startsWith('/preferensi') ? 'w-6 opacity-100' : 'w-0 opacity-0 group-hover:w-4 group-hover:opacity-50'
                }`}
              />
            </Link>

            <Link
              href="/katalog"
              className="flex flex-col items-center group cursor-pointer"
            >
              <span
                className={`font-['Pixelify_Sans',sans-serif] text-[15px] font-semibold transition-colors ${
                  pathname.startsWith('/katalog') || pathname.startsWith('/test-drive')
                    ? 'text-[#277EFD]'
                    : 'text-[#151D21] group-hover:text-[#277EFD]'
                }`}
              >
                Simulasi
              </span>
              <span
                className={`h-[3px] bg-[#277EFD] transition-all mt-1 ${
                  pathname.startsWith('/katalog') || pathname.startsWith('/test-drive')
                    ? 'w-6 opacity-100'
                    : 'w-0 opacity-0 group-hover:w-4 group-hover:opacity-50'
                }`}
              />
            </Link>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-2.5 px-3 py-1.5 border-2 border-[#151D21] bg-white shadow-[2px_2px_0px_#151D21] hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 bg-[#FEBD01] border-2 border-[#151D21] flex items-center justify-center font-['Pixelify_Sans',sans-serif] text-xs font-bold text-[#151D21]">
                    {userInitials || 'AR'}
                  </div>
                  <span className="font-['Pixelify_Sans',sans-serif] text-[15px] font-semibold text-[#151D21]">
                    {userName}
                  </span>
                  <Icon name="chevron-down" className="w-3.5 h-3.5 text-[#151D21]" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-1 w-48 bg-white border-2 border-[#151D21] shadow-[4px_4px_0px_#000000] py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                  <Link
                    href="/preferensi"
                    className="flex items-center gap-2 px-4 py-2 font-['Pixelify_Sans',sans-serif] text-sm text-[#151D21] hover:bg-[#EEF5FF]"
                  >
                    <Icon name="grid" className="w-4 h-4 text-[#277EFD]" />
                    <span>Kelola Preferensi</span>
                  </Link>
                  <div className="border-t border-dashed border-[#D9D5CB] my-1" />
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 font-['Pixelify_Sans',sans-serif] text-sm text-[#F1402E] hover:bg-red-50 cursor-pointer"
                  >
                    <Icon name="logout" className="w-4 h-4 text-[#F1402E]" />
                    <span>Keluar dari Akun</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="px-4 py-2 bg-[#277EFD] text-white border-2 border-[#000000] shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[11px] hover:bg-[#1A5FD1] transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>MASUK</span>
                <Icon name="arrow-right" className="w-3 h-3 text-white" />
              </button>
            )}
          </div>
        </div>

        {/* 4-Color Segmented Scroll Progress Bar (Desktop 1200px / 1440px) */}
        <ScrollProgress className="w-full" />
      </div>

      {/* Modal Login Google */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
