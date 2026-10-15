'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';

interface StepperHeaderProps {
  currentStage: 1 | 2; // 1: Minat & Hobi, 2: Akademik
}

export default function StepperHeader({ currentStage }: StepperHeaderProps) {
  return (
    <div className="w-full max-w-[340px] mx-auto flex flex-col items-center mb-6">
      <div className="w-full flex items-center justify-between relative px-6">
        {/* Dashed Connecting Line */}
        <div
          className={`absolute left-12 right-12 top-[16px] border-b-2 border-dashed -z-0 ${
            currentStage === 2 ? 'border-[#22A94F]' : 'border-black'
          }`}
        />

        {/* Step 1: Minat & Hobi */}
        <div className="relative z-10 flex flex-col items-center">
          <div
            className={`w-8 h-8 border-2 border-black flex items-center justify-center font-['Press_Start_2P',monospace] text-xs font-bold shadow-[2px_2px_0px_#000000] ${
              currentStage === 2
                ? 'bg-[#22A94F] text-white'
                : 'bg-[#277EFD] text-white'
            }`}
          >
            {currentStage === 2 ? (
              <Icon name="check" className="w-4 h-4 text-white" />
            ) : (
              '1'
            )}
          </div>
          <span className="font-['Press_Start_2P',monospace] text-[8px] text-black font-bold mt-2 whitespace-nowrap">
            MINAT & HOBI
          </span>
        </div>

        {/* Step 2: Akademik */}
        <div className="relative z-10 flex flex-col items-center">
          <div
            className={`w-8 h-8 border-2 border-black flex items-center justify-center font-['Press_Start_2P',monospace] text-xs font-bold shadow-[2px_2px_0px_#000000] ${
              currentStage === 2
                ? 'bg-[#277EFD] text-white'
                : 'bg-white text-black'
            }`}
          >
            2
          </div>
          <span className="font-['Press_Start_2P',monospace] text-[8px] text-black font-bold mt-2 whitespace-nowrap">
            AKADEMIK
          </span>
        </div>
      </div>
    </div>
  );
}
