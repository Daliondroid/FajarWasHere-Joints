'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { TopBar } from '@/components/ui/TopBar';
import { RetroWindow } from '@/components/ui/RetroWindow';
import { Icon } from '@/components/ui/Icon';

export default function TestDriveDetailPage() {
  const router = useRouter();
  const params = useParams();
  const prodiId = typeof params?.id === 'string' ? params.id : 'informatika';

  const prodiTitle = prodiId
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const [selectedOption, setSelectedOption] = useState<number>(1); // Option B default selected as shown in Figma

  const options = [
    { label: 'A. Diskon memang menambah harga asli', correct: false },
    { label: 'B. Rumusnya keliru: harga malah ditambah diskon', correct: true },
    { label: 'C. Diskon 20% terlalu besar untuk Rp50.000 pada Minimarket', correct: false },
  ];

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-['Outfit',sans-serif]">
      {/* 1. Top Bar */}
      <TopBar title={prodiTitle} onBack={() => router.push('/katalog')} />

      <main className="w-full max-w-[402px] mx-auto px-4 pt-5 pb-16 flex flex-col flex-1 gap-5">
        {/* 2. Intro Banner (Red dashed with solid red left border) */}
        <div className="w-full border-2 border-dashed border-[#F1402E] border-l-[8px] border-l-[#F1402E] bg-white p-3.5">
          <p className="font-['Press_Start_2P',monospace] text-[10px] sm:text-[11px] text-black leading-relaxed">
            Yuk, rasakan cara berpikir anak IT!
          </p>
        </div>

        {/* 3. Window 1: SKENARIO */}
        <RetroWindow
          title="SKENARIO"
          variant="yellow"
          contentClassName="p-4 flex flex-col"
        >
          <p className="text-xs text-black leading-relaxed mb-3">
            Aplikasi kasir minimarket error saat jam sibuk. Harga barang Rp50.000 dengan diskon 20%, tapi struk pelanggan malah menampilkan total Rp60.000!
          </p>

          <span className="font-['Press_Start_2P',monospace] text-[8px] sm:text-[9px] text-[#6B7280] tracking-wider uppercase mb-2">
            KODE DI BALIK LAYAR
          </span>

          {/* Code Block */}
          <div className="w-full bg-[#181E24] border border-black overflow-hidden mb-4">
            <div className="px-3 py-1 bg-[#222A32] border-b border-black text-[11px] font-mono text-gray-400">
              kasir.js
            </div>
            <div className="p-3 font-mono text-xs leading-relaxed text-white">
              <div className="flex items-center">
                <span className="text-gray-500 w-5 select-none text-[11px]">1</span>
                <span>
                  <span className="text-[#FEBD01]">let</span> harga = 50000;
                </span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-gray-500 w-5 select-none text-[11px]">2</span>
                <span>
                  <span className="text-[#FEBD01]">let</span> diskon = harga * 0.2;{' '}
                  <span className="text-gray-500">{'// 10rb'}</span>
                </span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-gray-500 w-5 select-none text-[11px]">3</span>
                <span>
                  <span className="text-[#FEBD01]">let</span> total = harga + diskon;{' '}
                  <span className="text-[#F1402E] font-bold">{'// bug'}</span>
                </span>
              </div>
            </div>
          </div>

          <h3 className="font-['Press_Start_2P',monospace] text-[11px] sm:text-xs font-bold text-black leading-relaxed mb-3">
            Kenapa totalnya jadi lebih mahal dari harga asli?
          </h3>

          {/* Options */}
          <div className="flex flex-col gap-2">
            {options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = isSelected && opt.correct;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedOption(idx)}
                  className={`p-3 border flex items-start gap-3 cursor-pointer transition-colors ${
                    isCorrect
                      ? 'bg-[#EAF7EE] border-2 border-[#22A94F]'
                      : isSelected
                      ? 'bg-blue-50 border-2 border-[#277EFD]'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-5 h-5 border-2 border-black flex items-center justify-center shrink-0 mt-0.5 ${
                      isCorrect ? 'bg-[#22A94F]' : 'bg-white'
                    }`}
                  >
                    {isCorrect && <Icon name="check" className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className="text-xs text-black leading-relaxed font-medium">
                    {opt.label}
                  </span>
                </div>
              );
            })}
          </div>
        </RetroWindow>

        {/* 4. Window 2: FEEDBACK */}
        <RetroWindow
          title="FEEDBACK"
          variant="green"
          contentClassName="p-4 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-2">
            <Icon name="check" className="w-4 h-4 text-[#22A94F]" />
            <span className="font-['Press_Start_2P',monospace] text-xs font-bold text-[#22A94F]">
              Tepat sekali!
            </span>
          </div>

          <p className="text-xs text-black leading-relaxed mb-3">
            Kamu baru saja melakukan debugging logika kode — hal paling mendasar yang akan kamu temui setiap hari di jurusan Informatika.
          </p>

          <div className="w-full bg-[#181E24] border border-black p-2.5 font-mono text-xs text-white">
            <span className="text-[#FEBD01]">let</span> total = harga - diskon;{' '}
            <span className="text-[#22A94F] font-semibold">{'// ✔ 40rb'}</span>
          </div>
        </RetroWindow>

        {/* 5. Window 3: KENYATAAN KULIAH */}
        <RetroWindow
          title={`KENYATAAN KULIAH ${prodiTitle.toUpperCase()}`}
          variant="blue"
          contentClassName="p-4 flex flex-col gap-3"
        >
          <div className="flex items-start gap-2.5">
            <Icon name="arrow-right" className="w-4 h-4 text-[#277EFD] shrink-0 mt-0.5" />
            <p className="text-xs text-black leading-relaxed">
              <strong className="font-bold">Bukan sekadar pakai software.</strong> Kamu merancang logika di balik aplikasinya.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <Icon name="arrow-right" className="w-4 h-4 text-[#277EFD] shrink-0 mt-0.5" />
            <p className="text-xs text-black leading-relaxed">
              <strong className="font-bold">Mata kuliah terkait:</strong> Dasar Pemrograman, Algoritma & Struktur Data.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <Icon name="arrow-right" className="w-4 h-4 text-[#277EFD] shrink-0 mt-0.5" />
            <p className="text-xs text-black leading-relaxed">
              <strong className="font-bold">Tantangan nyata:</strong> Bisa berjam-jam mencari satu titik koma (;) yang hilang.
            </p>
          </div>
        </RetroWindow>

        {/* 6. Action Buttons */}
        <div className="flex flex-col gap-3 mt-2">
          <Link
            href="/katalog"
            className="w-full pixel-btn-blue py-3.5 text-xs tracking-wider flex items-center justify-center gap-2"
          >
            <span>COBA JURUSAN LAIN</span>
            <Icon name="arrow-right" className="w-4 h-4 text-white" />
          </Link>
          <Link
            href="/cocokin"
            className="w-full pixel-btn-white py-3.5 text-xs tracking-wider text-center"
          >
            KEMBALI KE COCOKIN
          </Link>
        </div>
      </main>
    </div>
  );
}
