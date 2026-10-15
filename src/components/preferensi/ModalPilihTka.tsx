'use client';

import React, { useState } from 'react';
import { MAPEL_PILIHAN_TKA_OPTIONS } from './riasecData';

interface ModalPilihTkaProps {
  isOpen: boolean;
  selected: string[];
  onSave: (mapel: string[]) => void;
  onClose: () => void;
}

export default function ModalPilihTka({
  isOpen,
  selected: initialSelected,
  onSave,
  onClose,
}: ModalPilihTkaProps) {
  const [tempSelected, setTempSelected] = useState<string[]>(initialSelected);

  if (!isOpen) return null;

  const handleToggle = (mapel: string) => {
    if (tempSelected.includes(mapel)) {
      setTempSelected((prev) => prev.filter((m) => m !== mapel));
    } else {
      if (tempSelected.length < 2) {
        setTempSelected((prev) => [...prev, mapel]);
      } else {
        alert('Sesuai aturan Kemendikdasmen (BR-18), kamu hanya memilih tepat 2 mata pelajaran pilihan!');
      }
    }
  };

  const handleApply = () => {
    if (tempSelected.length !== 2) {
      alert('Pilih tepat 2 mata pelajaran pilihan TKA.');
      return;
    }
    onSave(tempSelected);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[360px] bg-white border-3 border-black shadow-[4px_4px_0px_#000000] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Retro Header */}
        <div className="bg-[#4285F4] px-3 py-2 border-b-2 border-black flex items-center justify-between text-white">
          <span className="font-['Press_Start_2P',monospace] text-[9px] font-bold">
            PILIH 2 MAPEL PILIHAN TKA
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-5 h-5 bg-white border border-black flex items-center justify-center text-black hover:bg-red-500 hover:text-white text-xs font-bold"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-4 font-['Outfit',sans-serif]">
          <p className="text-xs text-gray-700 leading-relaxed mb-3">
            Pilih <strong>2 mata pelajaran pilihan</strong> yang kamu ikuti dalam Tes Kemampuan Akademik (TKA) sesuai Kurikulum Merdeka.
          </p>

          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 mb-4">
            {MAPEL_PILIHAN_TKA_OPTIONS.map((mapel) => {
              const isChecked = tempSelected.includes(mapel);
              return (
                <button
                  key={mapel}
                  type="button"
                  onClick={() => handleToggle(mapel)}
                  className={`w-full p-2 border-2 border-black flex items-center justify-between text-xs font-bold transition-all shadow-[1px_1px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer ${
                    isChecked
                      ? 'bg-[#EEF5FF] text-[#277EFD] ring-1 ring-black'
                      : 'bg-white text-black hover:bg-gray-50'
                  }`}
                >
                  <span>{mapel}</span>
                  <div
                    className={`w-4 h-4 border border-black flex items-center justify-center text-[10px] ${
                      isChecked ? 'bg-[#277EFD] text-white' : 'bg-white'
                    }`}
                  >
                    {isChecked ? '✓' : ''}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs font-bold mb-3">
            <span>Terpilih: {tempSelected.length} dari 2</span>
            {tempSelected.length === 2 && (
              <span className="text-[#34A853]">✓ Lengkap</span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border-2 border-black text-xs font-bold hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={tempSelected.length !== 2}
              className="flex-1 py-2 bg-[#4285F4] hover:bg-[#277EFD] text-white border-2 border-black font-['Press_Start_2P',monospace] text-[8px] disabled:opacity-50 cursor-pointer"
            >
              SIMPAN MAPEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
