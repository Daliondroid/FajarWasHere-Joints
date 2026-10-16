'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Icon } from '@/components/ui/Icon';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/api/auth/lanjut' });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[360px] bg-white border-2 border-black shadow-[4px_4px_0px_#000000] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Retro Window Header persis Figma M03 (node 172:502) */}
        <div className="bg-[#277EFD] px-3.5 py-2 border-b-2 border-black flex items-center justify-between text-white select-none">
          <span
            id="login-modal-title"
            className="font-['Press_Start_2P',monospace] text-[10px] tracking-wider text-white font-bold"
          >
            MASUK KE COCOKIN!
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-white border border-black inline-block" />
            <span className="w-2 h-2 bg-white border border-black inline-block" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup jendela login"
              className="w-4 h-4 bg-white border border-black flex items-center justify-center text-black hover:bg-[#F1402E] hover:text-white transition-colors text-[10px] font-bold cursor-pointer leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col items-center text-center">
          {/* Logo Toga Pixel langsung tanpa frame kotak */}
          <div className="mb-3">
            <Image
              src="/assets/logo-cap.png"
              alt="Cocokin Logo"
              width={64}
              height={64}
              priority
              className="w-16 h-16 object-contain image-pixelated"
            />
          </div>

          <h3 className="font-['Press_Start_2P',monospace] text-sm text-[#151D21] mb-2 leading-snug">
            Masuk dulu, yuk!
          </h3>

          <p className="text-xs text-[#3A444B] leading-relaxed mb-6 font-['Outfit',sans-serif] max-w-[280px]">
            Preferensi dan hasil rekomendasimu tersimpan di akun, jadi tetap aman walau cache browser terhapus.
          </p>

          {/* Tombol Google Neobrutalis */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 bg-white border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-3 transition-all hover:bg-gray-50 mb-4 cursor-pointer"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="font-['Outfit',sans-serif] font-bold text-sm text-[#151D21]">
              Masuk dengan Google
            </span>
          </button>

          {/* Privacy Note persis Box Figma */}
          <div className="w-full bg-[#F6F5F2] border border-[#D9D5CB] p-3 flex items-center justify-center gap-2 text-[11px] text-[#3A444B] font-['Outfit',sans-serif]">
            <Icon name="lock" className="w-3.5 h-3.5 shrink-0 text-[#6B7680]" />
            <span>
              Dengan masuk, kamu menyetujui{' '}
              <Link
                href="/syarat-ketentuan"
                onClick={onClose}
                className="text-[#277EFD] underline font-bold hover:opacity-80"
              >
                Syarat &amp; Ketentuan
              </Link>
              .
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
