'use client';

import React from 'react';
import { RetroWindow } from '@/components/ui/RetroWindow';
import { Icon } from '@/components/ui/Icon';

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
  scores: SubtestScores;
  onChangeScore: (key: keyof SubtestScores, val: string) => void;
}

const SUBTEST_FIELDS: { key: keyof SubtestScores; label: string }[] = [
  { key: 'pu', label: 'Penalaran Umum (PU)' },
  { key: 'ppu', label: 'Pengetahuan & Pemahaman Umum' },
  { key: 'pbm', label: 'Pemahaman Bacaan & Menulis' },
  { key: 'pk', label: 'Pengetahuan Kuantitatif (PK)' },
  { key: 'lbind', label: 'Literasi Bahasa Indonesia' },
  { key: 'lbing', label: 'Literasi Bahasa Inggris' },
  { key: 'pm', label: 'Penalaran Matematika (PM)' },
];

export default function StepFormSNBT({ scores, onChangeScore }: StepFormSNBTProps) {
  return (
    <RetroWindow
      title="JALUR SNBT · NILAI TRY OUT"
      variant="blue"
      className="mb-8"
      contentClassName="p-4 flex flex-col gap-6"
    >
      {/* 1. Header Skor Try Out Terakhir */}
      <div className="flex flex-col gap-1">
        <h4 className="font-['Press_Start_2P',monospace] text-xs text-black">
          Skor try out terakhir
        </h4>
        <span className="text-xs text-[#6B7280]">Skala 0–1000 · 15 Okt 2026</span>
      </div>

      {/* 2. Subtest Inputs */}
      <div className="flex flex-col gap-2.5">
        {SUBTEST_FIELDS.map((subtest) => (
          <div
            key={subtest.key}
            className="flex items-center justify-between gap-3 text-xs"
          >
            <span className="text-black font-medium text-xs flex-1 leading-snug">
              {subtest.label}
            </span>
            <input
              type="number"
              min="0"
              max="1000"
              value={scores[subtest.key]}
              onChange={(e) => onChangeScore(subtest.key, e.target.value)}
              className="w-24 h-9 border-2 border-black bg-white text-center font-bold text-sm text-black focus:outline-none"
            />
          </div>
        ))}
      </div>

      {/* 3. Riwayat Try Out */}
      <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
        <div>
          <h4 className="font-['Press_Start_2P',monospace] text-[11px] text-black">
            Riwayat try out
          </h4>
          <span className="text-xs text-[#6B7280]">Pantau perkembangan skormu</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-1">
          {/* Card 1 */}
          <div className="p-3 border-2 border-black bg-[#FEF9E7] flex flex-col">
            <span className="text-[11px] text-[#6B7280] mb-1">15 Okt 2026</span>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-lg font-black text-black">684</span>
              <span className="text-xs font-bold text-[#22A94F]">+38</span>
            </div>
            <span className="text-[10px] text-[#6B7280]">Rata-rata 7 subtes</span>
          </div>

          {/* Card 2 */}
          <div className="p-3 border-2 border-black bg-white flex flex-col">
            <span className="text-[11px] text-[#6B7280] mb-1">01 Okt 2026</span>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-lg font-black text-black">646</span>
              <span className="text-xs font-bold text-[#22A94F]">+12</span>
            </div>
            <span className="text-[10px] text-[#6B7280]">Rata-rata 7 subtes</span>
          </div>
        </div>
      </div>

      {/* 4. Upload Sertifikat / Portofolio SNBT */}
      <div>
        <label className="w-full py-6 px-4 border-2 border-dashed border-[#277EFD] bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/40 transition-colors">
          <Icon name="upload" className="w-8 h-8 text-[#277EFD] mb-2" />
          <span className="font-['Press_Start_2P',monospace] text-[10px] sm:text-xs text-black text-center mb-1">
            Sertifikat / portofolio
          </span>
          <span className="text-xs text-[#6B7280]">PDF, JPG, atau MP4 · maks. 25 MB</span>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png,.mp4" className="hidden" />
        </label>
      </div>
    </RetroWindow>
  );
}
