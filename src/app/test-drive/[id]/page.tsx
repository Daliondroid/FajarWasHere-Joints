'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { TopBar } from '@/components/ui/TopBar';
import { RetroWindow } from '@/components/ui/RetroWindow';
import { Icon } from '@/components/ui/Icon';

export default function TestDriveDetailPage() {
  const router = useRouter();
  const params = useParams();
  const prodiId = typeof params?.id === 'string' ? params.id : 'teknologi-informasi';

  const prodiTitle = prodiId
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const options = [
    { key: 'A', label: 'A. Diskon memang menambah harga asli', isCorrect: false },
    { key: 'B', label: 'B. Rumusnya keliru: harga malah ditambah diskon', isCorrect: true },
    { key: 'C', label: 'C. Diskon 20% terlalu besar untuk Rp50.000', isCorrect: false },
    { key: 'D', label: 'D. Kasir salah mengetik harga barang', isCorrect: false },
  ];

  const handlePilihKunci = () => {
    if (selectedOption === null) {
      alert('Pilih salah satu jawaban terlebih dahulu!');
      return;
    }
    setIsAnswered(true);
  };

  const selectedItem = selectedOption !== null ? options[selectedOption] : null;
  const isSelectedCorrect = selectedItem?.isCorrect;

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex justify-center">
      <div className="w-full max-w-[402px] bg-white border-x-2 border-black flex flex-col min-h-screen font-['Outfit',sans-serif]">
        {/* 1. Top Bar M18/M19 */}
        <TopBar title={prodiTitle} onBack={() => router.push('/katalog')} />

        <main className="w-full px-4 pt-5 pb-16 flex flex-col flex-1 gap-4">
          {/* 2. Intro Banner (M18 & M19: node 206:3221 & 207:3189) */}
          <div className="w-full border-2 border-[#151D21] bg-white shadow-[3px_3px_0px_#151D21] p-3.5 flex items-center gap-3">
            <div
              className={`w-1.5 self-stretch shrink-0 ${
                !isAnswered
                  ? 'bg-[#F1402E]'
                  : isSelectedCorrect
                  ? 'bg-[#22A94F]'
                  : 'bg-[#F1402E]'
              }`}
            />
            <h1 className="font-['Pixelify_Sans',sans-serif] text-[17px] font-semibold text-[#151D21] leading-snug">
              {!isAnswered
                ? 'Yuk, rasakan cara berpikir anak IT!'
                : isSelectedCorrect
                ? 'Jawabanmu benar! Kamu punya insting logika yang tajam.'
                : `Jawabanmu ${selectedItem?.key} belum tepat. Jawaban yang benar ditandai hijau.`}
            </h1>
          </div>

          {/* 3. Window 1: SKENARIO */}
          <RetroWindow
            title="SKENARIO"
            variant="yellow"
            contentClassName="p-4 flex flex-col gap-3"
          >
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#151D21] leading-relaxed">
              Aplikasi kasir minimarket error saat jam sibuk. Harga barang Rp50.000 dengan diskon 20%, tapi struk pelanggan malah menampilkan total Rp60.000!
            </p>

            <span className="font-['Pixelify_Sans',sans-serif] text-[12px] font-medium text-[#6B7680] tracking-wider uppercase">
              KODE DI BALIK LAYAR
            </span>

            {/* Code Block kasir.js */}
            <div className="w-full bg-[#1E2630] border border-[#151D21] overflow-hidden">
              <div className="px-3 py-1 bg-[#28323E] border-b border-[#151D21] text-[11px] font-mono text-gray-300 flex items-center justify-between">
                <span>kasir.js</span>
                <span className="text-gray-500 text-[10px]">JavaScript</span>
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
                    <span className="text-gray-400">{'// 10rb'}</span>
                  </span>
                </div>
                <div className="flex items-center mt-1 bg-red-950/40 px-1 -mx-1 py-0.5">
                  <span className="text-gray-500 w-5 select-none text-[11px]">3</span>
                  <span>
                    <span className="text-[#FEBD01]">let</span> total = harga + diskon;{' '}
                    <span className="text-[#F1402E] font-bold">{'// bug'}</span>
                  </span>
                </div>
              </div>
            </div>

            <h2 className="font-['Pixelify_Sans',sans-serif] text-[15px] font-semibold text-[#151D21] mt-1">
              Kenapa totalnya jadi lebih mahal dari harga asli?
            </h2>

            {/* 4 Pilihan Ganda (M18 & M19) */}
            <div className="flex flex-col gap-2">
              {options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = opt.isCorrect;

                let cardStyle = 'bg-white border-[#151D21] hover:bg-gray-50 text-[#151D21] shadow-[2px_2px_0px_#151D21]';
                if (isAnswered) {
                  if (isCorrect) {
                    cardStyle = 'bg-[#EAF7EE] border-[#22A94F] text-[#151D21] shadow-[2px_2px_0px_#22A94F] font-bold';
                  } else if (isSelected && !isCorrect) {
                    cardStyle = 'bg-[#FEECEC] border-[#F1402E] text-[#151D21] shadow-[2px_2px_0px_#F1402E]';
                  } else {
                    cardStyle = 'bg-white border-gray-300 text-gray-400 opacity-60 shadow-none';
                  }
                } else if (isSelected) {
                  cardStyle = 'bg-[#EEF5FF] border-[#277EFD] shadow-[2px_2px_0px_#277EFD] font-bold text-[#151D21]';
                }

                return (
                  <div
                    key={opt.key}
                    onClick={() => {
                      if (!isAnswered) setSelectedOption(idx);
                    }}
                    className={`p-3 border-2 flex items-center justify-between cursor-pointer transition-all ${cardStyle}`}
                  >
                    <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs leading-relaxed">
                      {opt.label}
                    </span>

                    {/* Status Badge Saat Terjawab (M19) */}
                    {isAnswered && (
                      <div className="shrink-0 ml-2">
                        {isCorrect && (
                          <span className="px-2 py-0.5 bg-[#22A94F] text-white font-bold text-[9px] border border-[#151D21]">
                            BENAR
                          </span>
                        )}
                        {!isCorrect && isSelected && (
                          <span className="px-2 py-0.5 bg-[#F1402E] text-white font-bold text-[9px] border border-[#151D21]">
                            JAWABANMU
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Tombol Kunci Jawaban (M18) */}
            {!isAnswered && (
              <button
                type="button"
                onClick={handlePilihKunci}
                className="w-full mt-2 py-3 bg-[#277EFD] hover:bg-[#1E6FD9] text-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[11px] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>KUNCI JAWABAN</span>
                <Icon name="arrow-right" className="w-3.5 h-3.5 text-white" />
              </button>
            )}
          </RetroWindow>

          {/* 4. Window 2: PEMBAHASAN (Persis Figma M19: node 207:3189) */}
          {isAnswered && (
            <>
              <RetroWindow
                title="PEMBAHASAN"
                variant="green"
                contentClassName="p-4 flex flex-col gap-2.5"
              >
                <span className="font-['Pixelify_Sans',sans-serif] text-[15px] font-semibold text-[#22A94F]">
                  Jawaban benar: B
                </span>
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#3A444B] leading-relaxed">
                  Diskon seharusnya mengurangi harga, bukan ditambahkan. Ini kode yang benar:
                </p>
                <div className="w-full bg-[#1E2630] border border-[#151D21] p-3 font-mono text-xs text-white">
                  <span className="text-[#FEBD01]">let</span> total = harga - diskon;{' '}
                  <span className="text-[#22A94F] font-semibold">{'// ✓ 40rb'}</span>
                </div>
              </RetroWindow>

              {/* 5. Window 3: KENYATAAN KULIAH · TEKNOLOGI INFORMASI (M19) */}
              <RetroWindow
                title="KENYATAAN KULIAH · TEKNOLOGI INFORMASI"
                variant="blue"
                contentClassName="p-4 flex flex-col gap-3"
              >
                <div className="flex items-start gap-2.5">
                  <Icon name="arrow-right" className="w-3.5 h-3.5 text-[#277EFD] shrink-0 mt-1" />
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#151D21] leading-relaxed">
                    Kompetensi lulusan: Software Engineer, Data Engineer, Network &amp; Security Engineer (PDDikti).
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <Icon name="arrow-right" className="w-3.5 h-3.5 text-[#277EFD] shrink-0 mt-1" />
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#151D21] leading-relaxed">
                    Kampus UGM: akreditasi Unggul · dosen:mhs 1:10 · masa studi 4,1 tahun (PDDikti).
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <Icon name="arrow-right" className="w-3.5 h-3.5 text-[#277EFD] shrink-0 mt-1" />
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#151D21] leading-relaxed">
                    Persaingan: daya tampung SNBP 2026 29 kursi · diterima 2025 3,7% (snpmb.id).
                  </p>
                </div>
              </RetroWindow>

              {/* 6. Action Buttons Bottom M19 */}
              <div className="flex flex-col gap-2.5 mt-2">
                <Link
                  href="/katalog"
                  className="w-full py-3 bg-[#277EFD] hover:bg-[#1E6FD9] text-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] font-['Press_Start_2P',monospace] text-[11px] flex items-center justify-center gap-2 active:translate-x-[1px] active:translate-y-[1px]"
                >
                  <span>COBA JURUSAN LAIN</span>
                  <Icon name="arrow-right" className="w-3.5 h-3.5 text-white" />
                </Link>
                <Link
                  href="/cocokin"
                  className="w-full py-3 bg-white hover:bg-gray-50 text-[#151D21] border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] font-['Press_Start_2P',monospace] text-[11px] flex items-center justify-center gap-2 active:translate-x-[1px] active:translate-y-[1px]"
                >
                  <span>KEMBALI KE COCOKIN</span>
                  <Icon name="back" className="w-3.5 h-3.5 text-[#151D21]" />
                </Link>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
