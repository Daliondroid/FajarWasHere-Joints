'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';

interface StepperHeaderProps {
  currentStage: 1 | 2; // 1: Minat, 2: Bahan
}

export default function StepperHeader({ currentStage }: StepperHeaderProps) {
  return (
    <div className="w-full flex items-center justify-between font-['Press_Start_2P',monospace]">
      {/* Step 1: MINAT */}
      <div className="flex items-center gap-2">
        <div
          className={`w-6 h-6 border-2 border-[#151D21] flex items-center justify-center text-[10px] font-bold shadow-[1px_1px_0px_#151D21] ${
            currentStage === 2
              ? 'bg-[#22A94F] text-white'
              : 'bg-[#277EFD] text-white'
          }`}
        >
          {currentStage === 2 ? (
            <Icon name="check" className="w-3.5 h-3.5 text-white" />
          ) : (
            '1'
          )}
        </div>
        <span className="text-[10px] text-[#151D21] font-bold tracking-tight">
          MINAT
        </span>
      </div>

      {/* Solid Connector Line */}
      <div className="flex-1 mx-3 h-0.5 bg-[#151D21]" />

      {/* Step 2: BAHAN */}
      <div className={`flex items-center gap-2 ${currentStage === 1 ? 'opacity-60' : ''}`}>
        <div
          className={`w-6 h-6 border-2 border-[#151D21] flex items-center justify-center text-[10px] font-bold shadow-[1px_1px_0px_#151D21] ${
            currentStage === 2
              ? 'bg-[#277EFD] text-white'
              : 'bg-white text-[#6B7680]'
          }`}
        >
          2
        </div>
        <span
          className={`text-[10px] tracking-tight ${
            currentStage === 2 ? 'text-[#151D21] font-bold' : 'text-[#6B7680]'
          }`}
        >
          BAHAN
        </span>
      </div>
    </div>
  );
}
