import React from 'react';

interface RetroWindowProps {
  title: string;
  variant?: 'yellow' | 'blue' | 'green' | 'red';
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  headerRight?: React.ReactNode;
}

export const RetroWindow: React.FC<RetroWindowProps> = ({
  title,
  variant = 'yellow',
  children,
  className = '',
  contentClassName = 'p-4',
  headerRight,
}) => {
  const headerBg = {
    yellow: 'bg-[#FEBD01] text-black border-b-[3px] border-black',
    blue: 'bg-[#277EFD] text-white border-b-[3px] border-black',
    green: 'bg-[#22A94F] text-white border-b-[3px] border-black',
    red: 'bg-[#F1402E] text-white border-b-[3px] border-black',
  }[variant];

  return (
    <div className={`bg-white pixel-border overflow-hidden ${className}`}>
      {/* Window Header */}
      <div className={`px-3 py-2 flex items-center justify-between font-['Press_Start_2P'] text-[11px] tracking-wider font-bold select-none ${headerBg}`}>
        <span className="uppercase truncate">{title}</span>
        {headerRight ? (
          headerRight
        ) : (
          <div className="flex items-center gap-1.5 shrink-0 ml-2" aria-hidden="true">
            <div className="w-3 h-3 bg-white border-[1.5px] border-black" />
            <div className="w-3 h-3 bg-white border-[1.5px] border-black" />
            <div className="w-3 h-3 bg-white border-[1.5px] border-black" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={contentClassName}>{children}</div>
    </div>
  );
};
