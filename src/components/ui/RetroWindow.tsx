import React from 'react';

interface RetroWindowProps {
  title: string;
  variant?: 'yellow' | 'blue' | 'green' | 'red' | 'black';
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  headerRight?: React.ReactNode;
}

/** Window Figma (`80:94`): border 2, shadow-md; header 36 px, garis bawah 2, judul Label/S + tiga kotak kontrol. */
export const RetroWindow: React.FC<RetroWindowProps> = ({
  title,
  variant = 'yellow',
  children,
  className = '',
  contentClassName = 'p-4',
  headerRight,
}) => {
  const header = {
    yellow: 'bg-yellow text-ink',
    blue: 'bg-blue text-paper',
    green: 'bg-green text-paper',
    red: 'bg-red text-paper',
    black: 'bg-ink text-paper',
  }[variant];

  return (
    <div className={`bg-paper border-2 border-ink shadow-pixel-md ${className}`}>
      <div className={`flex h-9 items-center gap-2 border-b-2 border-ink px-3 select-none ${header}`}>
        <span className="flex-1 min-w-0 truncate t-label-s uppercase">{title}</span>
        {headerRight ?? (
          <div className="flex shrink-0 gap-1" aria-hidden="true">
            <span className="size-2.5 border-[1.5px] border-ink bg-paper" />
            <span className="size-2.5 border-[1.5px] border-ink bg-paper" />
            <span className="size-2.5 border-[1.5px] border-ink bg-paper" />
          </div>
        )}
      </div>
      <div className={contentClassName}>{children}</div>
    </div>
  );
};
