'use client';

import React from 'react';

interface StepperHeaderProps {
  currentStage: 1 | 2; // 1: Minat & Hobi, 2: Akademik
}

export default function StepperHeader({ currentStage }: StepperHeaderProps) {
  return (
    <div className="w-full max-w-[286px] mx-auto flex flex-col items-center mb-8">
      <div className="w-full flex items-center justify-between relative px-2">
        {/* Dashed Connecting Line */}
        <div className="absolute left-6 right-6 top-[13px] h-[2px] border-b-2 border-dashed border-[#F1402E] -z-0"></div>

        {/* Step 1 Box: Minat & Hobi */}
        <div className="relative z-10 flex flex-col items-center">
          <div
            className={`w-[28px] h-[26px] border-2 border-black flex items-center justify-center font-['Press_Start_2P',monospace] text-xs font-bold ${
              currentStage >= 1
                ? 'bg-[#22A94F] text-black shadow-[2px_2px_0px_#000000]'
                : 'bg-[#D9D9D9] text-black'
            }`}
          >
            1
          </div>
          <span className="text-[10px] text-[#151D21] font-medium mt-1.5 whitespace-nowrap">
            Minat & Hobi
          </span>
        </div>

        {/* Step 2 Box: Akademik */}
        <div className="relative z-10 flex flex-col items-center">
          <div
            className={`w-[28px] h-[26px] border-2 border-black flex items-center justify-center font-['Press_Start_2P',monospace] text-xs font-bold ${
              currentStage === 2
                ? 'bg-[#22A94F] text-black shadow-[2px_2px_0px_#000000]'
                : 'bg-[#D9D9D9] text-black'
            }`}
          >
            2
          </div>
          <span className="text-[10px] text-[#151D21] font-medium mt-1.5 whitespace-nowrap">
            Akademik
          </span>
        </div>
      </div>
    </div>
  );
}
