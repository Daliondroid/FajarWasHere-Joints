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

  // Segment ranges: 0-25%, 25-50%, 50-75%, 75-100%
  const getSegmentWidth = (index: number) => {
    const start = index * 25;
    const end = (index + 1) * 25;
    if (progress <= start) return 0;
    if (progress >= end) return 100;
    return ((progress - start) / 25) * 100;
  };

  const segmentColors = ['#277EFD', '#F1402E', '#FEBD01', '#22A94F'];

  return (
    <div
      className={`w-full max-w-[402px] mx-auto px-4 py-1.5 bg-white grid grid-cols-4 gap-2 ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {segmentColors.map((color, index) => {
        const segWidth = getSegmentWidth(index);
        return (
          <div
            key={index}
            className="h-1 bg-[#D3D6DA] rounded-full overflow-hidden relative"
          >
            <div
              className="h-full rounded-full transition-[width] duration-75 ease-out"
              style={{
                width: `${segWidth}%`,
                backgroundColor: color,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
