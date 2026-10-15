'use client';

import React from 'react';
import Image from 'next/image';

export interface SubtestScores {
  pu: string;
  ppu: string;
  pbm: string;
  pk: string;
  lbind: string;
  lbing: string;
  pm: string;
}

export interface TryoutItem {
  date: string;
  scores: SubtestScores;
}

interface StepFormSNBTProps {
  tryoutList: TryoutItem[];
  activeScoreIndex: number;
  onSelectScoreIndex: (idx: number) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const SUBTEST_LABELS = [
  { key: 'pu', label: 'Penalaran Umum (PU)' },
  { key: 'ppu', label: 'Pengetahuan dan Pemahaman Umum (PPU)' },
  { key: 'pbm', label: 'Pemahaman Bacaan dan Menulis (PBM)' },
  { key: 'pk', label: 'Pengetahuan Kuantitatif (PK)' },
  { key: 'lbind', label: 'Literasi dalam Bahasa Indonesia' },
  { key: 'lbing', label: 'Literasi dalam Bahasa Inggris' },
  { key: 'pm', label: 'Penalaran Matematika (PM)' },
];

export default function StepFormSNBT({
  tryoutList,
  activeScoreIndex,
  onSelectScoreIndex,
  onBack,
  onSubmit,
}: StepFormSNBTProps) {
  return (
    <div className="flex flex-col space-y-6">
      {/* KOTAK BIRU DASHED SNBT */}
      <div className="w-full border-2 border-dashed border-[#277EFD] p-4 bg-white flex flex-col space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-4 h-4 bg-[#277EFD] inline-block"></span>
          <span className="font-['Press_Start_2P',monospace] text-xs font-bold text-black">
            SNBT
          </span>
        </div>

        <div>
          <p className="text-xs font-bold text-black mb-2">Nilai Try Out</p>
          <div className="space-y-1.5 text-xs">
            {SUBTEST_LABELS.map((subtest) => (
              <div
                key={subtest.key}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[#22A94F] text-[10px]">▶</span>
                  <span>{subtest.label}</span>
                </div>
                <span className="text-gray-400">.........</span>
              </div>
            ))}
          </div>
        </div>

        {/* Kartu Kuning Histori Nilai TO */}
        <div className="flex gap-2 justify-center py-2">
          {tryoutList.map((item, idx) => (
            <div
              key={item.date}
              onClick={() => onSelectScoreIndex(idx)}
              className={`w-[98px] bg-[#FEBD01] border-2 border-black p-2 flex flex-col cursor-pointer ${
                activeScoreIndex === idx ? 'shadow-[3px_3px_0px_#000000]' : 'opacity-80'
              }`}
            >
              <div className="flex justify-between text-[9px] font-mono leading-tight mb-2">
                <div className="flex flex-col">
                  <span>PU</span>
                  <span>PPU</span>
                  <span>PBM</span>
                  <span>PK</span>
                  <span>LBInd</span>
                  <span>LBIng</span>
                  <span>PM</span>
                </div>
                <div className="flex flex-col text-right font-bold">
                  <span>{item.scores.pu}</span>
                  <span>{item.scores.ppu}</span>
                  <span>{item.scores.pbm}</span>
                  <span>{item.scores.pk}</span>
                  <span>{item.scores.lbind}</span>
                  <span>{item.scores.lbing}</span>
                  <span>{item.scores.pm}</span>
                </div>
              </div>
              <span className="text-[8px] text-center font-mono border-t border-black/40 pt-1">
                {item.date}
              </span>
            </div>
          ))}
        </div>

        {/* Upload Portofolio SNBT */}
        <div>
          <p className="text-xs font-normal text-black mb-2">
            Sertifikat / portofolio (pdf, img, video)
          </p>
          <label className="w-full h-[140px] border border-[#277EFD] flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/40 transition-colors">
            <Image
              src="/assets/icon-upload.png"
              alt="Upload icon"
              width={64}
              height={64}
              className="w-16 h-16 object-contain image-pixelated mb-1"
            />
            <input type="file" accept=".pdf,image/*,video/*" className="hidden" />
          </label>
        </div>
      </div>

      {/* Navigasi Tombol */}
      <div className="flex items-center justify-between gap-4 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="w-[128px] h-[34px] pixel-btn-white flex items-center justify-center cursor-pointer"
        >
          KEMBALI
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="w-[129px] h-[34px] pixel-btn-blue flex items-center justify-center cursor-pointer"
        >
          LANJUT
        </button>
      </div>
    </div>
  );
}
