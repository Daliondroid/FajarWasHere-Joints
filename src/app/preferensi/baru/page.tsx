'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { usePreferensiStorage } from '@/components/preferensi/usePreferensiStorage';

export default function PreferensiBaruPage() {
  const router = useRouter();
  const { draft, updateDraft } = usePreferensiStorage();
  const [nama, setNama] = useState(draft.nama || '');
  const [jalur, setJalur] = useState<'snbp' | 'snbt'>(draft.jalur || 'snbp');
  const [tahunLulus, setTahunLulus] = useState('2027 · kelas 12 sekarang');
  const [errorMsg, setErrorMsg] = useState('');

  const handleNext = () => {
    if (!nama.trim()) {
      setErrorMsg('Harap beri nama preferensi kamu!');
      return;
    }
    updateDraft({ nama: nama.trim(), jalur });
    router.push('/preferensi/riasec');
  };

  const handleBatal = () => {
    router.push('/preferensi');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex justify-center">
      <div className="w-full max-w-[402px] bg-white border-x-2 border-black flex flex-col min-h-screen">
        <Navbar backHref="/preferensi" title="Preferensi baru" />

        <main className="p-4 flex-1 flex flex-col font-['Outfit',sans-serif]">
          {/* Header */}
          <div className="mb-5">
            <h1 className="font-['Press_Start_2P',monospace] text-sm text-[#151D21] mb-1.5 leading-snug">
              Preferensi baru
            </h1>
            <p className="text-xs text-[#6B7680] leading-relaxed">
              Beri nama skenario dan pilih jalur masuknya. Kuis minat berikutnya akan menyesuaikan.
            </p>
          </div>

          {/* Form Content */}
          <div className="space-y-5">
            {/* Field 1: Nama Preferensi */}
            <div>
              <label className="block text-xs font-bold text-[#151D21] mb-2">
                Nama preferensi
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => {
                  setNama(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Informatika Impian"
                maxLength={40}
                className="w-full p-3 bg-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] text-sm font-medium text-[#151D21] placeholder:text-gray-400 focus:outline-none focus:bg-[#EEF5FF]"
              />
              {errorMsg && (
                <p className="text-xs text-[#F1402E] font-bold mt-1.5">{errorMsg}</p>
              )}
            </div>

            {/* Field 2: Pilih Jalur */}
            <div>
              <label className="block font-bold text-sm text-[#151D21] mb-2.5">
                Pilih jalur
              </label>
              <div className="flex flex-col gap-3">
                {/* Opsi SNBP */}
                <div
                  onClick={() => setJalur('snbp')}
                  className={`p-3.5 border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] cursor-pointer transition-all flex items-center gap-3.5 ${
                    jalur === 'snbp'
                      ? 'bg-[#FFFDF0] ring-2 ring-[#FEBD01]'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="px-3 py-1.5 bg-[#FEBD01] border-2 border-[#151D21] font-['Press_Start_2P',monospace] text-xs font-bold text-[#151D21] shrink-0">
                    SNBP
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-[#151D21] font-medium leading-relaxed">
                      Rapor smt 1–5, TKA & prestasi
                    </span>
                  </div>
                </div>

                {/* Opsi SNBT */}
                <div
                  onClick={() => setJalur('snbt')}
                  className={`p-3.5 border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] cursor-pointer transition-all flex items-center gap-3.5 ${
                    jalur === 'snbt'
                      ? 'bg-[#EEF5FF] ring-2 ring-[#277EFD]'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="px-3 py-1.5 bg-[#277EFD] border-2 border-[#151D21] font-['Press_Start_2P',monospace] text-xs font-bold text-white shrink-0">
                    SNBT
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-[#151D21] font-medium leading-relaxed">
                      Nilai try out 7 subtes UTBK
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Field 3: Tahun lulus SMA/SMK/MA */}
            <div>
              <label className="block text-xs font-bold text-[#151D21] mb-2">
                Tahun lulus SMA/SMK/MA
              </label>
              <select
                value={tahunLulus}
                onChange={(e) => setTahunLulus(e.target.value)}
                className="w-full p-3 bg-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] text-xs font-medium text-[#151D21] focus:outline-none cursor-pointer"
              >
                <option value="2027 · kelas 12 sekarang">2027 · kelas 12 sekarang</option>
                <option value="2026 · alumni 1 tahun">2026 · alumni 1 tahun</option>
                <option value="2025 · alumni 2 tahun">2025 · alumni 2 tahun</option>
              </select>
            </div>
          </div>

          {/* Sticky Bottom Bar Persis Figma M07 */}
          <div className="mt-auto pt-6 pb-2 border-t border-gray-200 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleBatal}
              className="py-3 bg-white hover:bg-gray-50 text-[#151D21] border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[10px] sm:text-[11px] text-center transition-all cursor-pointer"
            >
              BATAL
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="py-3 bg-[#22A94F] hover:bg-[#1E9646] text-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[10px] sm:text-[11px] text-center transition-all cursor-pointer"
            >
              BUAT & MULAI
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
