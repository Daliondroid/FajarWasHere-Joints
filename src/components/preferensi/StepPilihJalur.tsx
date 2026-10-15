'use client';

import React from 'react';

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
  return (
    <div className="flex flex-col">
      <div className="space-y-4 mb-6 mt-6">
        {/* Box SNBP: Dashed Yellow Border */}
        <div
          onClick={() => onSelectTrack('SNBP')}
          className={`w-full h-[54px] border-2 border-dashed border-[#FEBD01] bg-white flex items-center px-4 cursor-pointer transition-all ${
            selectedTrack === 'SNBP' ? 'bg-[#FFFBEA]' : 'hover:bg-gray-50'
          }`}
        >
          <div className="w-[21px] h-[21px] border border-[#FEBD01] flex items-center justify-center mr-4">
            {selectedTrack === 'SNBP' && (
              <span className="text-xs font-black text-[#FEBD01]">✓</span>
            )}
          </div>
          <span className="font-['Press_Start_2P',monospace] text-xs font-bold text-black">
            SNBP
          </span>
        </div>

        {/* Box SNBT: Dashed Blue Border */}
        <div
          onClick={() => onSelectTrack('SNBT')}
          className={`w-full h-[54px] border-2 border-dashed border-[#277EFD] bg-white flex items-center px-4 cursor-pointer transition-all ${
            selectedTrack === 'SNBT' ? 'bg-[#F0F6FF]' : 'hover:bg-gray-50'
          }`}
        >
          <div className="w-[21px] h-[21px] border border-[#277EFD] flex items-center justify-center mr-4">
            {selectedTrack === 'SNBT' && (
              <span className="text-xs font-black text-[#277EFD]">✓</span>
            )}
          </div>
          <span className="font-['Press_Start_2P',monospace] text-xs font-bold text-black">
            SNBT
          </span>
        </div>
      </div>

      {/* Error Banner jika Langkah 2 belum dipilih */}
      {errorMessage && (
        <div className="w-full bg-[#FCE8E6] border-2 border-[#F1402E] p-2.5 mb-6 text-[#F1402E] text-xs font-bold flex items-center gap-2">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Navigasi Tombol */}
      <div className="flex items-center justify-between gap-4 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="w-[128px] h-[34px] pixel-btn-white flex items-center justify-center cursor-pointer"
        >
          KEMBALI
        </button>
        <button
          type="button"
          onClick={onNext}
          className="w-[129px] h-[34px] pixel-btn-blue flex items-center justify-center cursor-pointer"
        >
          LANJUT
        </button>
      </div>
    </div>
  );
}
