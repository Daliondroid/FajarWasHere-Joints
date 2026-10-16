'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { TopBar } from '@/components/ui/TopBar';
import { RetroWindow } from '@/components/ui/RetroWindow';

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
        {/* 1. Top Bar */}
        <TopBar title={prodiTitle} onBack={() => router.push('/katalog')} />

        <main className="w-full px-4 pt-5 pb-16 flex flex-col flex-1 gap-4">
          {/* 2. Intro Banner Persis Figma M18 / M19 */}
          {!isAnswered ? (
            <div className="w-full border-2 border-[#151D21] bg-[#FFFDF0] shadow-[3px_3px_0px_#151D21] p-3.5">
              <h1 className="font-['Press_Start_2P',monospace] text-xs text-[#151D21] leading-relaxed">
                Yuk, rasakan cara berpikir anak IT!
              </h1>
            </div>
          ) : (
            <div
              className={`w-full border-2 border-[#151D21] p-3.5 shadow-[3px_3px_0px_#151D21] ${
                isSelectedCorrect ? 'bg-[#EAF7EE]' : 'bg-[#FFF2F0]'
              }`}
            >
              <h1 className="font-['Press_Start_2P',monospace] text-xs text-[#151D21] leading-relaxed">
                {isSelectedCorrect
                  ? 'Jawabanmu benar! Kamu punya insting logika yang tajam.'
                  : `Jawabanmu ${selectedItem?.key} belum tepat. Jawaban yang benar ditandai hijau.`}
              </h1>
            </div>
          )}

          {/* 3. Window 1: SKENARIO */}
          <RetroWindow
            title="SKENARIO"
            variant="yellow"
            contentClassName="p-4 flex flex-col gap-3"
          >
            <p className="text-xs text-[#151D21] leading-relaxed">
              Aplikasi kasir minimarket error saat jam sibuk. Harga barang Rp50.000 dengan diskon 20%, tapi struk pelanggan malah menampilkan total Rp60.000!
            </p>

            <span className="font-['Press_Start_2P',monospace] text-[8px] text-[#277EFD] tracking-wider uppercase">
              KODE DI BALIK LAYAR
            </span>

            {/* Code Block */}
            <div className="w-full bg-[#181E24] border border-black overflow-hidden">
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

            <h2 className="font-bold text-sm text-[#151D21] mt-1">
              Kenapa totalnya jadi lebih mahal dari harga asli?
            </h2>

            {/* 4 Pilihan Ganda Persis Figma M18 / M19 */}
            <div className="flex flex-col gap-2">
              {options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = opt.isCorrect;

                let cardStyle = 'bg-white border-[#151D21] hover:bg-gray-50';
                if (isAnswered) {
                  if (isCorrect) {
                    cardStyle = 'bg-[#EAF7EE] border-[#22A94F] ring-2 ring-[#22A94F]';
                  } else if (isSelected && !isCorrect) {
                    cardStyle = 'bg-[#FFF2F0] border-[#F1402E] ring-2 ring-[#F1402E]';
                  }
                } else if (isSelected) {
                  cardStyle = 'bg-[#EEF5FF] border-[#277EFD] ring-2 ring-[#277EFD]';
                }

                return (
                  <div
                    key={opt.key}
                    onClick={() => {
                      if (!isAnswered) setSelectedOption(idx);
                    }}
                    className={`p-3 border-2 shadow-[2px_2px_0px_#151D21] flex items-center justify-between cursor-pointer transition-all ${cardStyle}`}
                  >
                    <span className="text-xs text-[#151D21] font-medium leading-relaxed">
                      {opt.label}
                    </span>

                    {/* Status Badge Saat Terjawab (M19) */}
                    {isAnswered && (
                      <div>
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
                className="w-full mt-2 py-3 bg-[#FEBD01] hover:bg-[#E5AB00] text-[#151D21] border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[10px] text-center transition-all cursor-pointer"
              >
                KUNCI JAWABAN
              </button>
            )}
          </RetroWindow>

          {/* 4. Window 2: PEMBAHASAN (Persis Figma M19) */}
          {isAnswered && (
            <RetroWindow
              title="PEMBAHASAN"
              variant="green"
              contentClassName="p-4 flex flex-col gap-2.5"
            >
              <span className="font-['Press_Start_2P',monospace] text-xs font-bold text-[#22A94F]">
                Jawaban benar: B
              </span>
              <p className="text-xs text-[#151D21] leading-relaxed">
                Diskon seharusnya mengurangi harga, bukan ditambahkan. Ini kode yang benar:
              </p>
              <div className="w-full bg-[#181E24] border border-black p-2.5 font-mono text-xs text-white">
                <span className="text-[#FEBD01]">let</span> total = harga - diskon;{' '}
                <span className="text-[#22A94F] font-semibold">{'// ✓ 40rb'}</span>
              </div>

              <div className="pt-2 border-t border-gray-200 mt-2 flex items-center justify-between">
                <Link
                  href="/katalog"
                  className="px-3 py-2 bg-white hover:bg-gray-50 border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] font-['Press_Start_2P',monospace] text-[9px] text-[#151D21]"
                >
                  PRODI LAIN
                </Link>
                <Link
                  href="/cocokin"
                  className="px-3 py-2 bg-[#22A94F] hover:bg-[#1E9646] text-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] font-['Press_Start_2P',monospace] text-[9px]"
                >
                  SELESAI
                </Link>
              </div>
            </RetroWindow>
          )}
        </main>
      </div>
    </div>
  );
}
