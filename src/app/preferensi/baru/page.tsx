'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Icon } from '@/components/ui/Icon';
import { usePreferensiStorage } from '@/components/preferensi/usePreferensiStorage';

export default function PreferensiBaruPage() {
  const router = useRouter();
  const { draft, updateDraft } = usePreferensiStorage();
  const [nama, setNama] = useState(draft.nama || '');
  const [jalur, setJalur] = useState<'snbp' | 'snbt'>(draft.jalur || 'snbp');
  const [errorMsg, setErrorMsg] = useState('');

  const handleNext = () => {
    if (!nama.trim()) {
      setErrorMsg('Harap beri nama preferensi kamu!');
      return;
    }
    updateDraft({ nama: nama.trim(), jalur });
    router.push('/preferensi/riasec');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex justify-center">
      <div className="w-full max-w-[402px] bg-white border-x-2 border-black flex flex-col min-h-screen">
        <Navbar backHref="/preferensi" title="Preferensi Baru" />

        <main className="p-4 flex-1 flex flex-col font-['Outfit',sans-serif]">
          {/* Header */}
          <div className="mb-6">
            <span className="inline-block px-2 py-0.5 bg-[#EEF5FF] border border-black text-[#277EFD] font-['Press_Start_2P',monospace] text-[8px] mb-2 shadow-[1px_1px_0px_#000000]">
              LANGKAH 0 • IDENTITAS
            </span>
            <h1 className="font-['Press_Start_2P',monospace] text-sm text-black mb-1.5 leading-snug">
              Beri nama & pilih jalur
            </h1>
            <p className="text-xs text-gray-600 leading-relaxed">
              Satu preferensi mengunci satu jalur seleksi (SNBP atau SNBT) agar peluang kampus terhitung akurat.
            </p>
          </div>

          {/* Input Nama Preferensi */}
          <div className="mb-6">
            <label className="block font-['Press_Start_2P',monospace] text-[9px] text-black mb-2 uppercase">
              Nama Preferensi:
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => {
                setNama(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Misal: Rencana Utama SNBP / Teknik UI"
              maxLength={40}
              className="w-full p-3 bg-white border-2 border-black shadow-[3px_3px_0px_#000000] text-sm font-bold text-black placeholder:text-gray-400 focus:outline-none focus:bg-[#EEF5FF]"
            />
            {errorMsg && (
              <p className="text-xs text-red-600 font-bold mt-1.5">{errorMsg}</p>
            )}
          </div>

          {/* Pilihan Kartu Jalur */}
          <div className="mb-6 space-y-3.5">
            <label className="block font-['Press_Start_2P',monospace] text-[9px] text-black uppercase">
              PILIH JALUR SELEKSI:
            </label>

            {/* Kartu SNBP */}
            <div
              onClick={() => setJalur('snbp')}
              className={`p-3.5 border-2 border-black shadow-[3px_3px_0px_#000000] cursor-pointer transition-all ${
                jalur === 'snbp'
                  ? 'bg-[#FFFDF0] ring-2 ring-black'
                  : 'bg-white hover:bg-gray-50 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 bg-[#FBBC05] border border-black font-['Press_Start_2P',monospace] text-[8px] font-bold text-black">
                  SNBP • JALUR PRESTASI
                </span>
                <div
                  className={`w-4 h-4 rounded-full border-2 border-black flex items-center justify-center ${
                    jalur === 'snbp' ? 'bg-[#FBBC05]' : 'bg-white'
                  }`}
                >
                  {jalur === 'snbp' && (
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                  )}
                </div>
              </div>

              <h3 className="font-['Outfit',sans-serif] font-bold text-sm text-black mb-1">
                Seleksi Nasional Berdasarkan Prestasi
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Seleksi berbasis nilai rapor semester 1–5, kuota eligible akreditasi sekolahmu, dan nilai validasi TKA Kemendikdasmen.
              </p>
            </div>

            {/* Kartu SNBT */}
            <div
              onClick={() => setJalur('snbt')}
              className={`p-3.5 border-2 border-black shadow-[3px_3px_0px_#000000] cursor-pointer transition-all ${
                jalur === 'snbt'
                  ? 'bg-[#EEF5FF] ring-2 ring-black'
                  : 'bg-white hover:bg-gray-50 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 bg-[#4285F4] border border-black font-['Press_Start_2P',monospace] text-[8px] font-bold text-white">
                  SNBT • JALUR TES UTBK
                </span>
                <div
                  className={`w-4 h-4 rounded-full border-2 border-black flex items-center justify-center ${
                    jalur === 'snbt' ? 'bg-[#4285F4]' : 'bg-white'
                  }`}
                >
                  {jalur === 'snbt' && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </div>
              </div>

              <h3 className="font-['Outfit',sans-serif] font-bold text-sm text-black mb-1">
                Seleksi Nasional Berdasarkan Tes
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Seleksi murni berbasis skor Tes Potensi Skolastik & Literasi UTBK (7 subtes). Terbuka tanpa batas kuota eligible sekolah.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-auto pt-4">
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3.5 bg-[#4285F4] hover:bg-[#277EFD] text-white border-2 border-black shadow-[4px_4px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] font-['Press_Start_2P',monospace] text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>LANJUT KE KUIS MINAT</span>
              <Icon name="arrow-right" className="w-4 h-4 text-white" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
