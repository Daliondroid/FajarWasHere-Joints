'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/ui/TopBar';
import { Icon } from '@/components/ui/Icon';
import { usePreferensiStorage } from '@/components/preferensi/usePreferensiStorage';

export default function PreferensiBaruPage() {
  const router = useRouter();
  const { draft, updateDraft } = usePreferensiStorage();
  const [nama, setNama] = useState(draft.nama || 'Informatika Impian');
  const [jalur, setJalur] = useState<'snbp' | 'snbt'>(draft.jalur || 'snbp');
  const [tahunLulus, setTahunLulus] = useState(draft.tahun_lulus || '2027 · kelas 12 sekarang');
  const [errorMsg, setErrorMsg] = useState('');

  const handleNext = () => {
    if (!nama.trim()) {
      setErrorMsg('Harap beri nama preferensi kamu!');
      return;
    }
    updateDraft({
      nama: nama.trim(),
      jalur,
      tahun_lulus: tahunLulus,
    });
    router.push('/preferensi/riasec');
  };

  const handleBatal = () => {
    router.push('/preferensi');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex justify-center">
      <div className="w-full max-w-[402px] bg-white border-x-2 border-[#151D21] flex flex-col min-h-screen">
        {/* TopBar persis M07 */}
        <TopBar title="Preferensi" onBack={handleBatal} />

        <main className="p-6 flex-1 flex flex-col font-['Outfit',sans-serif]">
          {/* Header */}
          <div className="mb-5">
            <span className="font-['Pixelify_Sans',sans-serif] text-[12px] font-medium text-[#277EFD] tracking-wider uppercase block mb-1">
              PREFERENSI BARU
            </span>
            <h1 className="font-['Press_Start_2P',monospace] text-sm text-[#151D21] mb-2 leading-relaxed">
              Preferensi baru
            </h1>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#6B7680] leading-relaxed">
              Beri nama skenario dan pilih jalur masuknya. Kuis minat berikutnya akan menyesuaikan.
            </p>
          </div>

          {/* Form Content */}
          <div className="space-y-4 flex-1">
            {/* Field 1: Nama Preferensi */}
            <div>
              <label className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#3A444B] mb-1.5">
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

            {/* Field 2: Pilih Jalur Side-by-Side (Figma M07) */}
            <div>
              <label className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#151D21] mb-2">
                Pilih jalur
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Kartu Jalur SNBP */}
                <div
                  onClick={() => setJalur('snbp')}
                  className={`p-3.5 border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] cursor-pointer transition-all flex flex-col justify-between ${
                    jalur === 'snbp'
                      ? 'bg-[#FEBD01]'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-[#151D21] flex items-center justify-center bg-white">
                      {jalur === 'snbp' && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#151D21]" />
                      )}
                    </div>
                    <span className="font-['Press_Start_2P',monospace] text-xs font-bold text-[#151D21]">
                      SNBP
                    </span>
                  </div>
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#3A444B] leading-snug">
                    Rapor smt 1–5, TKA & prestasi
                  </span>
                </div>

                {/* Kartu Jalur SNBT */}
                <div
                  onClick={() => setJalur('snbt')}
                  className={`p-3.5 border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] cursor-pointer transition-all flex flex-col justify-between ${
                    jalur === 'snbt'
                      ? 'bg-[#277EFD] text-white'
                      : 'bg-[#EAF2FF] border-[#277EFD] hover:bg-blue-100/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-[#151D21] flex items-center justify-center bg-white">
                      {jalur === 'snbt' && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#151D21]" />
                      )}
                    </div>
                    <span
                      className={`font-['Press_Start_2P',monospace] text-xs font-bold ${
                        jalur === 'snbt' ? 'text-white' : 'text-[#277EFD]'
                      }`}
                    >
                      SNBT
                    </span>
                  </div>
                  <span
                    className={`font-['Plus_Jakarta_Sans',sans-serif] text-[11px] leading-snug ${
                      jalur === 'snbt' ? 'text-blue-100' : 'text-[#3A444B]'
                    }`}
                  >
                    Nilai try out 7 subtes UTBK
                  </span>
                </div>
              </div>
            </div>

            {/* Field 3: Tahun lulus SMA/SMK/MA */}
            <div>
              <label className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#3A444B] mb-1.5">
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

          {/* Sticky Bottom Action Bar Persis Figma M07 */}
          <div className="mt-auto pt-5 pb-2 border-t border-gray-200 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleBatal}
              className="py-3 bg-white hover:bg-gray-50 text-[#151D21] border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[10px] text-center transition-all cursor-pointer"
            >
              BATAL
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="py-3 bg-[#277EFD] hover:bg-[#1E6FD9] text-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[10px] text-center transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>BUAT & MULAI</span>
              <Icon name="arrow-right" className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
