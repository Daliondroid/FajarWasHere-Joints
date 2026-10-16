import type { ReactNode } from 'react';

/** Kolom halaman mobile 402 px (frame Figma Mobile v3). Tata letak desktop menyusul (task terpisah). */
export default function BingkaiMobile({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className="min-h-screen bg-canvas">
      <div className={`mx-auto flex min-h-screen w-full max-w-[402px] flex-col bg-paper ${className}`}>{children}</div>
    </div>
  );
}
