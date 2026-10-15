'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

export interface PreferensiItem {
  id: string;
  nama: string;
  jalur: 'snbp' | 'snbt';
  is_aktif?: boolean;
}

interface PemilihPreferensiProps {
  preferensiList?: PreferensiItem[];
  aktifId?: string;
  onPilih?: (id: string) => void;
  className?: string;
}

export default function PemilihPreferensi({
  preferensiList = [],
  aktifId,
  onPilih,
  className = '',
}: PemilihPreferensiProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Cari preferensi yang sedang aktif
  const aktifItem =
    preferensiList.find((p) => (aktifId ? p.id === aktifId : p.is_aktif)) ||
    preferensiList[0] || {
      id: 'default',
      nama: 'Informatika Impian',
      jalur: 'snbp' as const,
      is_aktif: true,
    };

  const isSNBP = aktifItem.jalur === 'snbp';
  const colorBg = isSNBP ? 'bg-[#FBBC05]' : 'bg-[#4285F4]';

  const handleSelect = (id: string) => {
    if (onPilih) {
      onPilih(id);
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Selector Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full bg-white border-2 border-black p-2.5 flex items-center justify-between shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] transition-all hover:bg-gray-50 text-left cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Badge kotak warna jalur */}
          <div
            className={`w-3.5 h-3.5 ${colorBg} border border-black shrink-0 shadow-[1px_1px_0px_#000000]`}
          />
          <div className="min-w-0 flex flex-col">
            <span className="font-['Press_Start_2P',monospace] text-[8px] text-gray-500 uppercase tracking-tight truncate">
              PREFERENSI AKTIF • {aktifItem.jalur.toUpperCase()}
            </span>
            <span className="font-['Outfit',sans-serif] font-bold text-sm text-black truncate">
              {aktifItem.nama}
            </span>
          </div>
        </div>
        <Icon
          name="chevron-down"
          className={`w-4 h-4 text-black shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border-2 border-black shadow-[4px_4px_0px_#000000] max-h-60 overflow-y-auto">
            <div className="p-2 border-b border-gray-200 bg-[#F9FAFB]">
              <span className="font-['Press_Start_2P',monospace] text-[8px] text-gray-600">
                PILIH PREFERENSI AKTIF:
              </span>
            </div>

            {preferensiList.length > 0 ? (
              preferensiList.map((item) => {
                const isSelected = item.id === aktifItem.id;
                const isItemSNBP = item.jalur === 'snbp';
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#EEF5FF] transition-colors border-b border-gray-100 last:border-b-0 ${
                      isSelected ? 'bg-[#EEF5FF] font-bold' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-3 h-3 border border-black shrink-0 ${
                          isItemSNBP ? 'bg-[#FBBC05]' : 'bg-[#4285F4]'
                        }`}
                      />
                      <span className="font-['Outfit',sans-serif] text-xs text-black truncate">
                        {item.nama}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="font-['Press_Start_2P',monospace] text-[7px] text-[#277EFD] shrink-0">
                        AKTIF
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-3 text-xs text-gray-500 font-['Outfit',sans-serif] text-center">
                Belum ada preferensi lain
              </div>
            )}

            {/* Tombol Buat Baru */}
            <div className="p-2 bg-gray-50 border-t border-black">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  router.push('/preferensi/baru');
                }}
                className="w-full py-1.5 px-2 bg-white border border-black text-center font-['Press_Start_2P',monospace] text-[8px] text-black hover:bg-yellow-100 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Icon name="plus" className="w-3 h-3" />
                <span>TAMBAH PREFERENSI BARU</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
