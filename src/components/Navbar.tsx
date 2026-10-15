import Image from 'next/image';
import Link from 'next/link';

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
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
          onClick={onMenuClick}
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
    </header>
  );
}
