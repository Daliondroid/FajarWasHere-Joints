'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';

interface StepPilihJalurProps {
  selectedTrack: 'SNBP' | 'SNBT' | '';
  errorMessage: string;
  onSelectTrack: (track: 'SNBP' | 'SNBT') => void;
  onBack: () => void;
  onNext: () => void;
}

export default function StepPilihJalur({
  selectedTrack,
  errorMessage,
  onSelectTrack,
  onBack,
  onNext,
}: StepPilihJalurProps) {
  const isSnbp = selectedTrack === 'SNBP';
  const isSnbt = selectedTrack === 'SNBT';

  return (
    <div className="flex flex-col pb-24">
      {/* Step tag */}
      <div className="mb-2">
        <span className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px] text-[#277EFD] tracking-wider uppercase">
          LANGKAH 2 DARI 2
        </span>
      </div>

      {/* Heading */}
      <h2 className="font-['Press_Start_2P',monospace] text-base sm:text-lg text-black leading-relaxed mb-2">
        Jalur masuk mana yang kamu incar?
      </h2>
      <p className="text-xs text-[#6B7280] mb-6">
        Boleh pilih keduanya. Kami sesuaikan data yang perlu kamu isi berikutnya.
      </p>

      {/* Track Options */}
      <div className="flex flex-col gap-4 mb-6">
        {/* SNBP Option */}
        <div
          onClick={() => onSelectTrack('SNBP')}
          className={`w-full p-4 border-2 border-dashed border-[#FEBD01] cursor-pointer transition-all flex items-start gap-3 ${
            isSnbp ? 'bg-[#FEF9E7]' : 'bg-white hover:bg-yellow-50/50'
          }`}
        >
          {/* Checkbox box */}
          <div className="w-5 h-5 mt-0.5 border-2 border-black bg-white flex items-center justify-center shrink-0">
            {isSnbp && <Icon name="check" className="w-3.5 h-3.5 text-black" />}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="font-['Press_Start_2P',monospace] text-xs font-bold text-black">
                SNBP
              </span>
              <span className="px-2 py-0.5 border border-[#FEBD01] bg-white font-['Press_Start_2P',monospace] text-[8px] text-black">
                JALUR PRESTASI
              </span>
            </div>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Seleksi berdasarkan nilai rapor semester 1–5 dan prestasi akademik/non-akademik.
            </p>
          </div>
        </div>

        {/* SNBT Option */}
        <div
          onClick={() => onSelectTrack('SNBT')}
          className={`w-full p-4 border-2 border-dashed border-[#277EFD] cursor-pointer transition-all flex items-start gap-3 ${
            isSnbt ? 'bg-[#EEF5FF]' : 'bg-white hover:bg-blue-50/50'
          }`}
        >
          {/* Checkbox box */}
          <div className="w-5 h-5 mt-0.5 border-2 border-black bg-white flex items-center justify-center shrink-0">
            {isSnbt && <Icon name="check" className="w-3.5 h-3.5 text-[#277EFD]" />}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="font-['Press_Start_2P',monospace] text-xs font-bold text-black">
                SNBT
              </span>
              <span className="px-2 py-0.5 border border-[#277EFD] bg-white font-['Press_Start_2P',monospace] text-[8px] text-[#277EFD]">
                JALUR TES
              </span>
            </div>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Seleksi berdasarkan skor UTBK. Kamu bisa isi nilai try out terbaru.
            </p>
          </div>
        </div>
      </div>

      {/* Note Box: PERLU DIINGAT */}
      <div className="w-full p-4 border-2 border-[#FEBD01] bg-[#FFFDF5] flex items-start gap-3 mb-6">
        <Icon name="info" className="w-5 h-5 text-black shrink-0 mt-0.5" />
        <div className="flex flex-col">
          <span className="font-['Press_Start_2P',monospace] text-[10px] font-bold text-black mb-1.5">
            PERLU DIINGAT
          </span>
          <p className="text-xs text-[#4B5563] leading-relaxed">
            Peserta yang lolos SNBP tidak dapat mendaftar SNBT di tahun yang sama. Pilih dengan sadar, ya.
          </p>
        </div>
      </div>

      {/* Error Banner jika belum memilih */}
      {errorMessage && (
        <div className="w-full bg-[#FCE8E6] border-2 border-[#F1402E] p-2.5 mb-4 text-[#F1402E] text-xs font-bold flex items-center gap-2">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black z-40 py-3 px-4">
        <div className="w-full max-w-[402px] mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 pixel-btn-white py-3 text-xs tracking-wider"
          >
            KEMBALI
          </button>
          <button
            type="button"
            onClick={onNext}
            className="flex-1 pixel-btn-blue py-3 text-xs tracking-wider flex items-center justify-center gap-2"
          >
            <span>LANJUT</span>
            <Icon name="arrow-right" className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
