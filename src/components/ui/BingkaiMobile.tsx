import type { ReactNode } from 'react';

/** Kolom halaman mobile 402 px (frame Figma Mobile v3); mulai lg selebar layar (frame Desktop v3 1440). */
export default function BingkaiMobile({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className="min-h-screen bg-canvas">
      <div className={`mx-auto flex min-h-screen w-full max-w-[402px] flex-col bg-paper lg:max-w-none ${className}`}>{children}</div>
    </div>
  );
}
