'use client';

import React from 'react';

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
  { name: 'CODING', col: 1 },
  { name: 'Networking', col: 2 },
  { name: 'Musik', col: 1 },
  { name: 'Fotografi', col: 2 },
  { name: 'Membaca', col: 1 },
  { name: 'Desain', col: 2 },
  { name: 'Memasak', col: 1 },
  { name: 'Blogging', col: 2 },
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
    <div className="flex flex-col">
      <h2 className="font-['Press_Start_2P',monospace] text-sm sm:text-base font-bold text-black leading-relaxed mb-6">
        Apa <span className="text-[#F1402E]">hobi</span> dan{' '}
        <span className="text-[#F1402E]">minat</span>
        <br />
        kamu ?
      </h2>

      {/* Grid 2 Kolom Tombol Hobi */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-6">
        {HOBBY_LIST.map((item) => {
          const isSelected = selectedHobbies.includes(item.name);
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => onToggleHobby(item.name)}
              className={`h-[36px] flex items-center justify-center font-['Press_Start_2P',monospace] text-[10px] font-bold border-2 border-black transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#22A94F] text-white shadow-[3px_3px_0px_#000000]'
                  : 'bg-white text-black shadow-[3px_3px_0px_#000000] hover:bg-gray-50'
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      {/* Textarea kotak tebal border hitam persis Figma */}
      <div className="w-full border-2 border-black shadow-[4px_4px_0px_#000000] bg-white p-3 mb-2">
        <textarea
          rows={5}
          value={hobbiesStory}
          onChange={(e) => onChangeStory(e.target.value)}
          placeholder="Tulis hobi dan minat lain mu di bawah sedetail mungkin"
          className="w-full text-xs leading-relaxed text-black resize-none focus:outline-none"
        />
      </div>

      {/* Warning icon + placeholder note */}
      <div className="flex items-center gap-1.5 mb-2 text-[#F1402E] text-[10.5px]">
        <span className="w-4 h-4 rounded-full border border-[#F1402E] flex items-center justify-center text-[10px] font-bold">
          !
        </span>
        <span>Tulis hobi dan minat lain mu di bawah sedetail mungkin</span>
      </div>

      {/* Error Banner jika Langkah 1 belum diisi */}
      {errorMessage && (
        <div className="w-full bg-[#FCE8E6] border-2 border-[#F1402E] p-2.5 mb-4 text-[#F1402E] text-xs font-bold flex items-center gap-2">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Navigasi Tombol Kembali & Lanjut */}
      <div className="flex items-center justify-between gap-4 mt-auto">
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
