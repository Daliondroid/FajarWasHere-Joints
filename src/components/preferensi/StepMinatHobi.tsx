'use client';

import React from 'react';
import { RetroWindow } from '@/components/ui/RetroWindow';
import { Icon } from '@/components/ui/Icon';

interface StepMinatHobiProps {
  selectedHobbies: string[];
  hobbiesStory: string;
  errorMessage: string;
  onToggleHobby: (hobby: string) => void;
  onChangeStory: (story: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const HOBBY_LIST = [
  'Coding',
  'Networking',
  'Musik',
  'Fotografi',
  'Membaca',
  'Desain',
  'Memasak',
  'Blogging',
];

export default function StepMinatHobi({
  selectedHobbies,
  hobbiesStory,
  errorMessage,
  onToggleHobby,
  onChangeStory,
  onBack,
  onNext,
}: StepMinatHobiProps) {
  return (
    <div className="flex flex-col pb-24">
      {/* Step tag */}
      <div className="mb-2">
        <span className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px] text-[#277EFD] tracking-wider uppercase">
          LANGKAH 1 DARI 2
        </span>
      </div>

      {/* Heading */}
      <h2 className="font-['Press_Start_2P',monospace] text-base sm:text-lg text-black leading-relaxed mb-1.5">
        Apa <span className="text-[#277EFD]">hobi</span> &{' '}
        <span className="text-[#277EFD]">minat</span> kamu?
      </h2>
      <p className="text-xs text-[#6B7280] mb-5">
        Pilih minimal 2 — boleh lebih dari satu.
      </p>

      {/* Interest chips grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {HOBBY_LIST.map((hobby) => {
          const isSelected = selectedHobbies.includes(hobby);
          return (
            <button
              key={hobby}
              type="button"
              onClick={() => onToggleHobby(hobby)}
              className={`h-[40px] px-3 flex items-center justify-center gap-1.5 font-['Press_Start_2P',monospace] text-[10px] font-bold border-2 border-black transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#277EFD] text-white shadow-[3px_3px_0px_#000000]'
                  : 'bg-white text-black shadow-[3px_3px_0px_#000000] hover:bg-gray-50'
              }`}
            >
              {isSelected && <Icon name="check" className="w-3.5 h-3.5 text-white" />}
              <span>{hobby}</span>
            </button>
          );
        })}
      </div>

      {/* Story Window matching Figma HIFI v2 */}
      <RetroWindow
        title="CERITAKAN LEBIH DETAIL"
        variant="blue"
        className="mb-4"
        contentClassName="p-3.5 flex flex-col"
      >
        <textarea
          rows={5}
          maxLength={500}
          value={hobbiesStory}
          onChange={(e) => onChangeStory(e.target.value)}
          placeholder="Aku suka main teka-teki logika dan pernah bikin game kecil pakai Scratch lalu Python. Lebih suka kerja sendiri dulu baru presentasi. Nggak terlalu suka pelajaran yang banyak hafalan."
          className="w-full text-xs sm:text-[13px] leading-relaxed text-black resize-none focus:outline-none placeholder:text-gray-400 bg-transparent"
        />

        <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-between text-[11px] text-[#6B7280]">
          <div className="flex items-center gap-1.5">
            <Icon name="spark" className="w-3.5 h-3.5 text-gray-500" />
            <span>Semakin detail, semakin akurat hasilnya</span>
          </div>
          <span className="font-medium text-black">
            {hobbiesStory.length}/500
          </span>
        </div>
      </RetroWindow>

      {/* Error Banner jika Langkah 1 belum diisi */}
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
