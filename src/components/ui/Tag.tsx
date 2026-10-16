import type { ReactNode } from 'react';

/** Tag Figma (`80:63`): latar -50 + border 1.5 warna, Label/S. Ink = latar ink teks paper. */
export type WarnaTag = 'blue' | 'yellow' | 'green' | 'red' | 'ink';

const WARNA: Record<WarnaTag, string> = {
  blue: 'bg-blue-50 border-blue text-blue-700',
  yellow: 'bg-yellow-50 border-yellow text-ink',
  green: 'bg-green-50 border-green text-ink',
  red: 'bg-red-50 border-red text-ink',
  ink: 'bg-ink border-ink text-paper',
};

export default function Tag({ children, warna = 'blue', className = '' }: { children: ReactNode; warna?: WarnaTag; className?: string }) {
  return (
    <span className={`inline-flex items-start px-2 py-1 border-[1.5px] t-label-s uppercase whitespace-nowrap ${WARNA[warna]} ${className}`}>
      {children}
    </span>
  );
}
