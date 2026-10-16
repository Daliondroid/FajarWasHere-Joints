import Link from 'next/link';
import type { ReactNode } from 'react';

/** Button Figma (`80:43`): border 2 ink, shadow-sm, label Press Start 2P 11, tinggi L 48 / M 36. */
export type JenisTombol = 'primary' | 'secondary' | 'success' | 'danger' | 'warning';

const WARNA: Record<JenisTombol, { latar: string; teks: string; ikon: string }> = {
  primary: { latar: 'bg-blue hover:bg-blue-700', teks: 'text-paper', ikon: '/figma/icon-arrow-paper.svg' },
  secondary: { latar: 'bg-paper hover:bg-canvas', teks: 'text-ink', ikon: '/figma/icon-arrow-ink.svg' },
  success: { latar: 'bg-green hover:brightness-95', teks: 'text-paper', ikon: '/figma/icon-arrow-paper.svg' },
  danger: { latar: 'bg-red hover:brightness-95', teks: 'text-paper', ikon: '/figma/icon-arrow-paper.svg' },
  warning: { latar: 'bg-yellow hover:brightness-95', teks: 'text-ink', ikon: '/figma/icon-arrow-ink.svg' },
};

interface TombolProps {
  children: ReactNode;
  jenis?: JenisTombol;
  ukuran?: 'L' | 'M';
  /** Tampilkan ikon panah di kanan label. */
  ikon?: boolean;
  penuh?: boolean;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}

export default function Tombol({
  children,
  jenis = 'primary',
  ukuran = 'L',
  ikon = false,
  penuh = false,
  href,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}: TombolProps) {
  const w = WARNA[jenis];
  const kelas = [
    'inline-flex items-center justify-center gap-3 border-2 border-ink shadow-pixel-sm t-button whitespace-nowrap',
    'transition-[transform,box-shadow] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#151D21]',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700',
    'disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
    ukuran === 'L' ? 'h-12 px-5' : 'h-9 px-4',
    penuh ? 'w-full' : '',
    w.latar,
    w.teks,
    className,
  ].join(' ');
  const isi = (
    <>
      <span>{children}</span>
      {ikon && <img src={w.ikon} alt="" width={14} height={14} className="shrink-0" />}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={kelas}>
        {isi}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={kelas}>
      {isi}
    </button>
  );
}
