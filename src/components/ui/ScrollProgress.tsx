'use client';

import { useEffect, useState } from 'react';

interface ScrollProgressProps {
  className?: string;
}

export default function ScrollProgress({ className = '' }: ScrollProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight <= 0) {
        setProgress(0);
        return;
      }
      const currentProgress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
      setProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div
      className={`w-full h-1 bg-[#D3D6DA] relative overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* 4-Color Strip mengisi proporsional sejauh progress scroll */}
      <div
        className="h-full absolute left-0 top-0 transition-[width] duration-75 ease-out overflow-hidden"
        style={{ width: `${progress}%` }}
      >
        <div className="w-screen max-w-[402px] h-full grid grid-cols-4">
          <div className="bg-[#277EFD]"></div>
          <div className="bg-[#F1402E]"></div>
          <div className="bg-[#FEBD01]"></div>
          <div className="bg-[#22A94F]"></div>
        </div>
      </div>
    </div>
  );
}
