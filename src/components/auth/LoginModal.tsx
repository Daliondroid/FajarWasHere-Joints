'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { RetroWindow } from '@/components/ui/RetroWindow';
import Logo from '@/components/ui/Logo';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Halaman tujuan setelah login (path relatif); kosong = smart routing /api/auth/lanjut. */
  kembali?: string | null;
}

/** Modal Login Google (Figma M03 `172:579`, PRD F-02). Tutup lewat scrim atau Escape. */
export default function LoginModal({ isOpen, onClose, kembali }: LoginModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const tutup = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', tutup);
    return () => window.removeEventListener('keydown', tutup);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Masuk ke Cocokin!"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/55 px-6"
      onClick={onClose}
    >
      <div className="w-full max-w-[354px]" onClick={(e) => e.stopPropagation()}>
        <RetroWindow title="Masuk ke Cocokin!" variant="blue" contentClassName="flex flex-col items-center gap-3.5 px-5 pt-6 pb-5">
          <Logo ukuran={64} />
          <p className="t-display-s text-ink">Masuk dulu, yuk!</p>
          <p className="t-body-m text-center text-muted">
            Preferensi dan hasil rekomendasimu tersimpan di akun, jadi tetap aman walau cache browser terhapus.
          </p>
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: kembali ?? '/api/auth/lanjut' })}
            className="flex h-[52px] w-full max-w-[300px] items-center justify-center gap-3 border-2 border-ink bg-paper shadow-pixel-sm cursor-pointer transition-[transform,box-shadow] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#151D21]"
          >
            <img src="/figma/logo-google.svg" alt="" width={20} height={20} />
            <span className="t-body-m font-semibold text-ink">Masuk dengan Google</span>
          </button>
          <div className="flex w-full items-center gap-2 bg-canvas p-2.5">
            <img src="/figma/icon-lock.svg" alt="" width={14} height={14} className="shrink-0" />
            <p className="flex-1 t-body-s text-ink-2">
              Dengan masuk, kamu menyetujui{' '}
              <Link href="/syarat-ketentuan" onClick={onClose} className="font-bold text-blue-700 underline">
                Syarat &amp; Ketentuan
              </Link>
              .
            </p>
          </div>
        </RetroWindow>
      </div>
    </div>
  );
}
