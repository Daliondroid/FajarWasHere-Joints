'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function TestDriveDetailPage() {
  const params = useParams();
  const prodiId = typeof params?.id === 'string' ? params.id : 'informatika';
  
  // Format readable prodi title
  const prodiTitle = prodiId
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const [selectedOption, setSelectedOption] = useState<number | null>(1); // default option 2 selected for demo/preview
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    if (!isTimerRunning || secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsLeft]);

  const options = [
    'Teori diskon yaitu menambahkan terhadap harga asli',
    'Rumus perhitungannya keliru: harga ditambah diskon',
    'Diskon 20% itu terlalu besar untuk harga Rp 50.000',
  ];

  return (
    <div className="min-h-screen bg-white text-black font-['Outfit',sans-serif]">
      <div className="w-full max-w-[402px] mx-auto px-4 pt-5 pb-16 flex flex-col border-x border-gray-100">
        {/* Header */}
        <header className="flex items-center justify-between pb-2">
          {/* Back Button to /katalog */}
          <Link
            href="/katalog"
            aria-label="Kembali ke Katalog"
            className="p-1 hover:bg-gray-100 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-black"
            >
              <path
                d="M15 19L8 12L15 5"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="square"
              />
            </svg>
          </Link>

          {/* Title */}
          <h1 className="font-['Press_Start_2P',monospace] text-[14px] font-bold text-black tracking-wide truncate max-w-[240px]">
            {prodiTitle}
          </h1>

          {/* Search Icon */}
          <div className="p-1">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-black"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="3" />
              <path d="M16.5 16.5L21.5 21.5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="square" />
            </svg>
          </div>
        </header>

        {/* Intro Banner with Timer */}
        <div className="mt-4 border-[2px] border-dashed border-[#EF4444] border-l-[8px] border-l-[#EF4444] p-3 flex items-center justify-between">
          <p className="font-['Outfit',sans-serif] text-[13px] font-medium text-black leading-snug">
            Yuk rasakan cara berpikir anak IT selama 60 detik
          </p>
          <div className="ml-2 px-2 py-1 bg-red-50 border border-red-300 text-[#EF4444] font-['Press_Start_2P',monospace] text-[10px] whitespace-nowrap">
            {secondsLeft}s
          </div>
        </div>

        {/* Mini Challenge Title */}
        <h2 className="font-['Press_Start_2P',monospace] text-[14px] font-bold text-black text-center mt-6 mb-4">
          Mini challenge
        </h2>

        {/* Challenge Box (Yellow Dashed Border) */}
        <div className="border-[2px] border-dashed border-[#F59E0B] p-4 bg-white">
          <p className="font-['Outfit',sans-serif] text-[14px] font-bold text-[#10B981] mb-1">
            Skenario :
          </p>
          <p className="font-['Outfit',sans-serif] text-[12px] text-black leading-relaxed">
            Aplikasi kasir minimarket error saat jam sibuk. Kasir menginput harga barang Rp 50.000 dengan diskon 20%. Namun di struk pelanggan, total tagihan yang keluar justru Rp 60.000!
          </p>

          <p className="font-['Outfit',sans-serif] text-[12px] text-black font-semibold mt-3 mb-1">
            Kode di balik layar terlihat seperti ini:
          </p>

          {/* Code Snippet Box */}
          <div className="bg-[#262626] text-white p-3 rounded-none border border-black font-mono text-[11px] leading-relaxed">
            <div className="text-gray-400 text-[10px] pb-1 border-b border-gray-600 mb-2">
              javascript
            </div>
            <div>
              <span className="text-gray-300">diskon = harga * 0.2; </span>
              <span className="text-emerald-400">{'// Nilai diskon: 10.000'}</span>
            </div>
            <div>
              <span className="text-gray-300">totalBayar = harga + diskon; </span>
              <span className="text-emerald-400">{'// <-- Masalahnya di sini'}</span>
            </div>
          </div>

          {/* Dashed Separator Line */}
          <div className="border-b-[2px] border-dashed border-[#F59E0B] my-4"></div>

          {/* Question */}
          <p className="font-['Outfit',sans-serif] text-[12px] font-medium text-black mb-3">
            Menurut kamu, kenapa total tagihannya jadi lebih mahal dari harga asli?
          </p>

          {/* Options */}
          <div className="flex flex-col gap-2.5">
            {options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedOption(idx);
                    setIsTimerRunning(false);
                  }}
                  className="flex items-start gap-2.5 text-left group cursor-pointer"
                >
                  <div
                    className={`w-[16px] h-[16px] mt-0.5 border-[2px] border-[#4285F4] flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#4285F4]' : 'bg-white'
                    }`}
                  >
                    {isSelected && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 6L5 9L10 3"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinecap="square"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="font-['Outfit',sans-serif] text-[12px] text-black leading-snug">
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Section (Green Dashed Border) */}
        <div className="border-[2px] border-dashed border-[#10B981] p-4 bg-white mt-5">
          <p className="font-['Outfit',sans-serif] text-[13px] font-bold text-[#EF4444] mb-1">
            Feedback:
          </p>
          <p className="font-['Outfit',sans-serif] text-[12px] text-black leading-relaxed">
            Tepat sekali! Kamu baru saja melakukan Debugging Logika Kode, hal paling mendasar yang akan kamu temui setiap hari di jurusan Informatika.
          </p>

          {/* Dashed Separator Line */}
          <div className="border-b-[2px] border-dashed border-[#10B981] my-4"></div>

          <p className="font-['Outfit',sans-serif] text-[13px] font-bold text-[#F59E0B] mb-2.5">
            Kenyataan Kuliah:
          </p>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-start gap-2 text-[12px] text-black leading-relaxed">
              <span className="text-[#4285F4] shrink-0 mt-0.5 text-[11px]">▶</span>
              <p>
                Di jurusan IT, kamu bukan cuma belajar &apos;pakai software&apos;, tapi merancang logika di baliknya.
              </p>
            </div>

            <div className="flex items-start gap-2 text-[12px] text-black leading-relaxed">
              <span className="text-[#4285F4] shrink-0 mt-0.5 text-[11px]">▶</span>
              <p>
                Mata kuliah yang mengajarkan ini: <span className="font-bold">Dasar Pemrograman, Algoritma &amp; Struktur Data.</span>
              </p>
            </div>

            <div className="flex items-start gap-2 text-[12px] text-black leading-relaxed">
              <span className="text-[#4285F4] shrink-0 mt-0.5 text-[11px]">▶</span>
              <p>
                Tantangan nyata: &quot;Kamu akan sering menghabiskan berjam-jam hanya untuk mencari typo satu tanda titik koma (;).&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Back to Cocokin Button */}
        <div className="mt-6">
          <Link
            href="/cocokin"
            className="w-full bg-white hover:bg-gray-50 text-black font-['Press_Start_2P',monospace] text-[11px] py-3.5 border-[3px] border-black shadow-[4px_4px_0px_#000] text-center block active:translate-y-0.5 transition-transform"
          >
            KEMBALI KE COCOKIN
          </Link>
        </div>
      </div>
    </div>
  );
}
