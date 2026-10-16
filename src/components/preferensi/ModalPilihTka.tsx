'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

interface ModalPilihTkaProps {
  isOpen: boolean;
  selected: string[];
  onSave: (mapel: string[]) => void;
  onClose: () => void;
}

interface CategoryMapel {
  category: string;
  items: string[];
}

const TKA_CATEGORIES: CategoryMapel[] = [
  {
    category: 'DISARANKAN UNTUK TEKNOLOGI INFORMASI',
    items: ['Matematika Tingkat Lanjut'],
  },
  {
    category: 'SAINS',
    items: ['Fisika', 'Kimia', 'Biologi'],
  },
  {
    category: 'SOSIAL',
    items: ['Sosiologi', 'Ekonomi', 'Geografi', 'Antropologi'],
  },
  {
    category: 'BAHASA',
    items: ['Bahasa Indonesia Tingkat Lanjut', 'Bahasa Inggris Tingkat Lanjut'],
  },
  {
    category: 'KHUSUS SMK/MAK',
    items: ['Konsentrasi Keahlian / Kejuruan'],
  },
];

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
        alert('Sesuai aturan SNBP, kamu hanya dapat memilih tepat 2 mata pelajaran pilihan!');
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
      className="fixed inset-0 z-50 bg-[#151D21]/60 flex items-end lg:items-center justify-center p-0 lg:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[402px] lg:max-w-[460px] bg-white border-t-2 border-x-2 lg:border-b-2 border-[#151D21] shadow-[0px_-6px_20px_rgba(0,0,0,0.2)] lg:shadow-[4px_4px_0px_#151D21] p-5 pb-7 flex flex-col gap-4 max-h-[85vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle Bar */}
        <div className="w-12 h-1.5 bg-[#D3D6DA] rounded-full mx-auto shrink-0 lg:hidden" />

        {/* Judul + Tag Kuota Terpilih */}
        <div className="flex items-center justify-between">
          <h2 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-[#151D21]">
            Mapel pilihan TKA
          </h2>
          <span className="px-2 py-0.5 bg-[#151D21] text-white font-['Press_Start_2P',monospace] text-[8px] font-bold">
            {tempSelected.length}/2 DIPILIH
          </span>
        </div>

        {/* Kategori Mapel Persis Figma M10b */}
        <div className="flex flex-col gap-4 my-1 font-['Outfit',sans-serif]">
          {TKA_CATEGORIES.map((cat) => (
            <div key={cat.category} className="flex flex-col gap-2">
              <span className="font-['Pixelify_Sans',sans-serif] text-[11px] font-bold text-[#6B7680] tracking-wider uppercase">
                {cat.category}
              </span>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((mapel) => {
                  const isChecked = tempSelected.includes(mapel);
                  return (
                    <button
                      key={mapel}
                      type="button"
                      onClick={() => handleToggle(mapel)}
                      className={`px-3 py-1.5 border-2 border-[#151D21] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#277EFD] text-white shadow-[2px_2px_0px_#151D21]'
                          : 'bg-white text-[#151D21] hover:bg-gray-50'
                      }`}
                    >
                      {isChecked && <Icon name="check" className="w-3.5 h-3.5 text-white" />}
                      <span>{mapel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Aksi Bawah */}
        <div className="pt-2 border-t border-gray-200 grid grid-cols-2 gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="py-3 bg-white hover:bg-gray-50 text-[#151D21] border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[10px] text-center transition-all cursor-pointer"
          >
            BATAL
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={tempSelected.length !== 2}
            className="py-3 bg-[#277EFD] hover:bg-[#1E6FD9] text-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[10px] text-center transition-all cursor-pointer disabled:opacity-50"
          >
            SIMPAN PILIHAN
          </button>
        </div>
      </div>
    </div>
  );
}
