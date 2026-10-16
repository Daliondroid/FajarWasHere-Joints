'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { usePreferensiStorage } from '@/components/preferensi/usePreferensiStorage';

const FIGMA_HOBI_CHIPS = [
  'Ngoprek Kode & Gadget',
  'Gambar & Desain Visual',
  'Jualan & Rintis Bisnis',
  'Eksperimen Sains & Riset',
  'Debat & Analisis Hukum',
  'Menulis Cerita & Konten',
  'Peduli Kesehatan & Medis',
  'Lingkungan & Sosial',
];

const FIGMA_MAPEL_OPTIONS = [
  'Matematika',
  'Fisika',
  'Informatika',
  'Kimia',
  'Biologi',
  'Ekonomi',
  'Bahasa Inggris',
];

export default function MinatHobiPage() {
  const router = useRouter();
  const { draft, updateDraft } = usePreferensiStorage();

  const [selectedChips, setSelectedChips] = useState<string[]>(
    draft.chip_hobi && draft.chip_hobi.length > 0
      ? draft.chip_hobi
      : ['Ngoprek Kode & Gadget', 'Eksperimen Sains & Riset']
  );
  const [story, setStory] = useState(
    draft.hobbiesStory ||
      'Aku suka main teka-teki logika dan pernah bikin game kecil pakai Scratch lalu Python. Lebih suka kerja sendiri dulu baru presentasi.'
  );
  const [selectedMapel, setSelectedMapel] = useState<string[]>(
    draft.mapel_favorit && draft.mapel_favorit.length > 0
      ? draft.mapel_favorit
      : ['Matematika', 'Fisika', 'Informatika']
  );

  const toggleChip = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const toggleMapel = (m: string) => {
    if (selectedMapel.includes(m)) {
      setSelectedMapel((prev) => prev.filter((item) => item !== m));
    } else {
      if (selectedMapel.length < 3) {
        setSelectedMapel((prev) => [...prev, m]);
      } else {
        alert('Maksimal 3 mata pelajaran favorit!');
      }
    }
  };

  const applyAiSuggestion = () => {
    const aiChips = ['Ngoprek Kode & Gadget'];
    const aiMapel = ['Informatika'];
    setSelectedChips((prev) => Array.from(new Set([...prev, ...aiChips])));
    setSelectedMapel((prev) => {
      const merged = Array.from(new Set([...prev, ...aiMapel]));
      return merged.slice(0, 3);
    });
  };

  const handleNext = () => {
    updateDraft({
      chip_hobi: selectedChips,
      hobbiesStory: story,
      mapel_favorit: selectedMapel,
    });
    router.push('/preferensi/akademik');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex justify-center">
      <div className="w-full max-w-[402px] bg-white border-x-2 border-black flex flex-col min-h-screen">
        <Navbar backHref="/preferensi/riasec" title={draft.nama || 'Informatika Impian'} />

        <main className="p-4 flex-1 flex flex-col font-['Outfit',sans-serif] space-y-5">
          {/* Stepper Header (M09) */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#FEBD01] border-2 border-[#151D21] flex items-center justify-center font-['Press_Start_2P',monospace] text-[10px] font-bold text-[#151D21] shadow-[1px_1px_0px_#151D21]">
                1
              </div>
              <span className="font-['Press_Start_2P',monospace] text-[9px] text-[#151D21] font-bold">
                MINAT
              </span>
            </div>

            <div className="flex-1 mx-3 h-0.5 bg-[#151D21]" />

            <div className="flex items-center gap-2 opacity-50">
              <div className="w-6 h-6 bg-gray-100 border-2 border-[#151D21] flex items-center justify-center font-['Press_Start_2P',monospace] text-[10px] font-bold text-gray-500">
                2
              </div>
              <span className="font-['Press_Start_2P',monospace] text-[9px] text-gray-500">
                BAHAN
              </span>
            </div>
          </div>

          {/* Heading */}
          <div>
            <span className="font-['Press_Start_2P',monospace] text-[8px] sm:text-[9px] text-[#277EFD] tracking-wider uppercase block mb-1.5">
              HASIL KUIS MINAT
            </span>
            <h1 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-[#151D21] leading-relaxed">
              Kelas karaktermu: ICR
            </h1>
          </div>

          {/* Box Hasil Karakter ICR Persis Figma M09 */}
          <div className="bg-white border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-['Press_Start_2P',monospace] text-xl sm:text-2xl font-bold text-[#277EFD]">
                  ICR
                </span>
                <h3 className="font-bold text-base text-[#151D21] mt-0.5">
                  Pemikir Sistematis
                </h3>
              </div>
            </div>
            <p className="text-xs text-[#6B7680] leading-relaxed">
              Investigative · Conventional · Realistic
            </p>

            {/* Skor 6 Dimensi Holland Bar */}
            <div className="grid grid-cols-6 gap-1 pt-2 border-t border-gray-200 text-center">
              <div>
                <span className="text-[10px] font-bold text-[#151D21] block">R</span>
                <span className="text-xs text-[#6B7680]">3,4</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#277EFD] block">I</span>
                <span className="text-xs font-bold text-[#277EFD]">4,6</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#151D21] block">A</span>
                <span className="text-xs text-[#6B7680]">2,0</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#151D21] block">S</span>
                <span className="text-xs text-[#6B7680]">1,8</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#151D21] block">E</span>
                <span className="text-xs text-[#6B7680]">2,4</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#22A94F] block">C</span>
                <span className="text-xs font-bold text-[#22A94F]">4,1</span>
              </div>
            </div>
          </div>

          {/* Hobi Pelengkap (8 Chip Persis Figma M09) */}
          <div>
            <h2 className="font-bold text-sm text-[#151D21] mb-2.5">
              Hobi pelengkap
            </h2>
            <div className="flex flex-wrap gap-2">
              {FIGMA_HOBI_CHIPS.map((chip) => {
                const isSelected = selectedChips.includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => toggleChip(chip)}
                    className={`px-3 py-1.5 border-2 border-[#151D21] text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FEBD01] text-[#151D21] shadow-[2px_2px_0px_#151D21] font-bold'
                        : 'bg-white text-[#151D21] hover:bg-gray-50'
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mapel Favorit (3/3 Dipilih) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="font-bold text-sm text-[#151D21]">
                Mapel favorit · {selectedMapel.length}/3
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {FIGMA_MAPEL_OPTIONS.map((mapel) => {
                const isSelected = selectedMapel.includes(mapel);
                return (
                  <button
                    key={mapel}
                    type="button"
                    onClick={() => toggleMapel(mapel)}
                    className={`px-3 py-1.5 border-2 border-[#151D21] text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#277EFD] text-white shadow-[2px_2px_0px_#151D21] font-bold'
                        : 'bg-white text-[#151D21] hover:bg-gray-50'
                    }`}
                  >
                    {mapel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cerita Bebas (Opsional) + Saran Chip AI */}
          <div className="bg-white border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] p-3.5 flex flex-col gap-2.5">
            <span className="font-['Press_Start_2P',monospace] text-[8px] text-[#277EFD] tracking-wider uppercase">
              CERITA BEBAS (OPSIONAL)
            </span>
            <textarea
              rows={3}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Ceritakan minat atau hobimu yang belum tercakup di atas..."
              className="w-full p-2.5 bg-[#F9F8F6] border border-[#D9D5CB] text-xs text-[#151D21] leading-relaxed focus:outline-none"
            />

            {/* Kotak DIBANTU AI */}
            <div className="bg-[#EEF5FF] border border-[#277EFD] p-2.5 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-['Press_Start_2P',monospace] text-[8px] text-[#277EFD]">
                  DIBANTU AI
                </span>
                <button
                  type="button"
                  onClick={applyAiSuggestion}
                  className="font-['Press_Start_2P',monospace] text-[7px] bg-white border border-[#151D21] px-2 py-1 shadow-[1px_1px_0px_#151D21] hover:bg-gray-50 active:translate-x-[1px] cursor-pointer"
                >
                  TERAPKAN SARAN
                </button>
              </div>
              <p className="text-[11px] text-[#151D21]">
                Saran chip dari ceritamu: <span className="font-semibold text-[#277EFD]">+ Ngoprek Kode & Gadget · + Informatika</span>
              </p>
            </div>
          </div>

          {/* Sticky Bottom Action Bar Persis Figma M09 */}
          <div className="mt-auto pt-4 pb-2 border-t border-gray-200 grid grid-cols-2 gap-3 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={() => router.push('/preferensi/riasec')}
              className="py-3 bg-white hover:bg-gray-50 text-[#151D21] border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[10px] text-center transition-all cursor-pointer"
            >
              KEMBALI
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="py-3 bg-[#22A94F] hover:bg-[#1E9646] text-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[10px] text-center transition-all cursor-pointer"
            >
              LANJUT
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
