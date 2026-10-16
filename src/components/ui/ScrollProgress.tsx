'use client';

import { useEffect, useState } from 'react';

/** Scroll Progress Figma (`167:105`): 4 segmen terputus blue → red → yellow → green, latar track. */
const WARNA_SEGMEN = ['bg-blue', 'bg-red', 'bg-yellow', 'bg-green'];

export default function ScrollProgress({ className = '' }: { className?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const tinggi = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setProgress(tinggi <= 0 ? 0 : Math.min(100, Math.max(0, (window.scrollY / tinggi) * 100)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const isi = (i: number) => Math.min(100, Math.max(0, ((progress - i * 25) / 25) * 100));

  return (
    <div
      className={`flex w-full h-1 gap-2 ${className}`}
      role="progressbar"
      aria-label="Progres gulir halaman"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {WARNA_SEGMEN.map((warna, i) => (
        <div key={warna} className="relative flex-1 h-full overflow-hidden bg-track">
          <div className={`absolute inset-y-0 left-0 ${warna}`} style={{ width: `${isi(i)}%` }} />
        </div>
      ))}
    </div>
  );
}
