'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

import ScrollProgress from '@/components/ui/ScrollProgress';

interface TopBarProps {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  showBack?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  onBack,
  rightElement,
  showBack = true,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-[#151D21]">
      <div className="w-full max-w-[402px] mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Back Arrow */}
        <div className="w-8 flex items-center justify-start">
          {showBack && (
            <button
              type="button"
              onClick={handleBack}
              aria-label="Kembali"
              className="p-1 cursor-pointer hover:opacity-70 active:scale-90 transition-transform"
            >
              <Icon name="back" className="w-5 h-5 text-[#151D21]" />
            </button>
          )}
        </div>

        {/* Center: Title */}
        <h1 className="font-['Press_Start_2P',monospace] text-[12px] text-[#151D21] text-center truncate max-w-[260px] tracking-tight">
          {title}
        </h1>

        {/* Right: Custom element or spacer */}
        <div className="w-8 flex items-center justify-end">
          {rightElement || null}
        </div>
      </div>

      {/* Scroll Progress 4 Segmen Berjarak sesuai Figma */}
      <ScrollProgress className="pb-1" />
    </header>
  );
};
