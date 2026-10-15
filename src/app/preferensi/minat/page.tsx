'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Icon } from '@/components/ui/Icon';
import { usePreferensiStorage } from '@/components/preferensi/usePreferensiStorage';

const HOBBY_CHIPS = [
  'Coding & Web',
  'Game Development',
  'Desain UI/UX',
  'Robotik & IoT',
  'Musik & Audio',
  'Menulis Cerita',
  'Fotografi & Video',
  'Matematika & Logika',
  'Sains & Eksperimen',
  'Bisnis & Jualan',
  'Organisasi & Relawan',
];

const MAPEL_OPTIONS = [
  'Informatika',
  'Matematika',
  'Fisika',
  'Bahasa Inggris',
  'Kimia',
  'Biologi',
  'Ekonomi',
  'Sosiologi',
  'Geografi',
];

export default function MinatHobiPage() {
  const router = useRouter();
  const { draft, updateDraft } = usePreferensiStorage();

  const [selectedChips, setSelectedChips] = useState<string[]>(
    draft.chip_hobi && draft.chip_hobi.length > 0
      ? draft.chip_hobi
      : ['Coding & Web', 'Desain UI/UX']
  );
  const [story, setStory] = useState(
    draft.hobbiesStory ||
      'Aku suka memecahkan teka-teki logika, ngoprek website, dan pernah membuat mini game sederhana. Lebih suka fokus analisis data dan eksplorasi teknologi baru.'
  );
  const [selectedMapel, setSelectedMapel] = useState<string[]>(
    draft.mapel_favorit && draft.mapel_favorit.length > 0
      ? draft.mapel_favorit
      : ['Informatika', 'Matematika']
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
    const aiChips = ['Robotik & IoT', 'Matematika & Logika'];
    setSelectedChips((prev) => Array.from(new Set([...prev, ...aiChips])));
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
        <Navbar backHref="/preferensi/riasec" title={draft.nama || 'Minat & Hobi'} />

        <main className="p-4 flex-1 flex flex-col font-['Outfit',sans-serif] space-y-5">
          {/* Stepper Header (M09) */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#FBBC05] border-2 border-black flex items-center justify-center font-['Press_Start_2P',monospace] text-[10px] font-bold text-black shadow-[1px_1px_0px_#000000]">
                1
              </div>
              <span className="font-['Press_Start_2P',monospace] text-[9px] text-black font-bold">
                MINAT
              </span>
            </div>

            <div className="flex-1 mx-3 h-0.5 bg-black" />

            <div className="flex items-center gap-2 opacity-50">
              <div className="w-6 h-6 bg-gray-100 border-2 border-black flex items-center justify-center font-['Press_Start_2P',monospace] text-[10px] font-bold text-gray-500">
                2
              </div>
              <span className="font-['Press_Start_2P',monospace] text-[9px] text-gray-500">
                BAHAN
              </span>
            </div>
          </div>

          {/* Heading */}
          <div>
            <span className="inline-block px-2 py-0.5 bg-[#EEF5FF] border border-black text-[#277EFD] font-['Press_Start_2P',monospace] text-[8px] mb-2 shadow-[1px_1px_0px_#000000]">
              LANGKAH 1 • MINAT & HOBI
            </span>
            <h1 className="font-['Press_Start_2P',monospace] text-xs text-black mb-1.5 leading-snug">
              Hasil tes minat & eksplorasi hobimu
            </h1>
            <p className="text-xs text-gray-600">
              Profil Holland membantu mencocokkan karaktermu dengan jurusan kuliah yang relevan.
            </p>
          </div>

          {/* Window 1: Hasil Tes RIASEC */}
          <div className="bg-white border-2 border-black shadow-[3px_3px_0px_#000000]">
            <div className="bg-[#4285F4] px-3 py-1.5 border-b-2 border-black flex items-center justify-between text-white">
              <span className="font-['Press_Start_2P',monospace] text-[8px]">
                HASIL TES RIASEC • KODE HOLLAND
              </span>
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-white border border-black" />
                <span className="w-2 h-2 bg-white border border-black" />
              </div>
            </div>

            <div className="p-3.5">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">
                    3 TIPE DOMINANMU:
                  </span>
                  <div className="font-['Press_Start_2P',monospace] text-sm text-[#4285F4] mt-0.5">
                    IRC
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-gray-800">
                    Investigative, Realistic, Conventional
                  </span>
                </div>
              </div>

              {/* Progress bars RIASEC */}
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Investigative (I)</span>
                  <span className="text-gray-500">92%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 border border-black overflow-hidden">
                  <div className="h-full bg-[#4285F4]" style={{ width: '92%' }} />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="font-bold">Realistic (R)</span>
                  <span className="text-gray-500">84%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 border border-black overflow-hidden">
                  <div className="h-full bg-[#34A853]" style={{ width: '84%' }} />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="font-bold">Conventional (C)</span>
                  <span className="text-gray-500">76%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 border border-black overflow-hidden">
                  <div className="h-full bg-[#FBBC05]" style={{ width: '76%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Window 2: Hobi & Eksplorasi Diri */}
          <div className="bg-white border-2 border-black shadow-[3px_3px_0px_#000000]">
            <div className="bg-[#FBBC05] px-3 py-1.5 border-b-2 border-black flex items-center justify-between text-black">
              <span className="font-['Press_Start_2P',monospace] text-[8px] font-bold">
                EKSPLORASI HOBI
              </span>
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-white border border-black" />
                <span className="w-2 h-2 bg-white border border-black" />
              </div>
            </div>

            <div className="p-3.5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-black mb-2">
                  Pilih chip minat & hobi:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {HOBBY_CHIPS.map((chip) => {
                    const isSelected = selectedChips.includes(chip);
                    return (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => toggleChip(chip)}
                        className={`px-2.5 py-1 text-xs font-bold border border-black transition-all shadow-[1px_1px_0px_#000000] cursor-pointer ${
                          isSelected
                            ? 'bg-[#34A853] text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1.5">
                  Cerita kegiatan yang kamu sukai:
                </label>
                <textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 border-2 border-black text-xs text-black shadow-[2px_2px_0px_#000000] focus:outline-none focus:bg-[#EEF5FF]"
                />
              </div>

              {/* Bantuan AI Saran Chip */}
              <div className="p-2.5 bg-[#EEF5FF] border border-black flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 bg-[#4285F4] text-white font-['Press_Start_2P',monospace] text-[7px]">
                    AI
                  </span>
                  <span className="text-[11px] text-gray-700 font-bold">
                    + Robotik & Logika
                  </span>
                </div>
                <button
                  type="button"
                  onClick={applyAiSuggestion}
                  className="px-2 py-1 bg-white hover:bg-gray-50 border border-black text-[10px] font-bold shadow-[1px_1px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                >
                  TERAPKAN
                </button>
              </div>
            </div>
          </div>

          {/* Window 3: Mata Pelajaran Favorit */}
          <div className="bg-white border-2 border-black shadow-[3px_3px_0px_#000000]">
            <div className="bg-[#34A853] px-3 py-1.5 border-b-2 border-black flex items-center justify-between text-white">
              <span className="font-['Press_Start_2P',monospace] text-[8px]">
                MAPEL FAVORIT (MAKS. 3)
              </span>
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-white border border-black" />
                <span className="w-2 h-2 bg-white border border-black" />
              </div>
            </div>

            <div className="p-3.5">
              <p className="text-xs text-gray-600 mb-2.5">
                Pilih hingga 3 mata pelajaran yang paling kamu minati:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {MAPEL_OPTIONS.map((m) => {
                  const isSelected = selectedMapel.includes(m);
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleMapel(m)}
                      className={`px-2.5 py-1 text-xs font-bold border border-black transition-all shadow-[1px_1px_0px_#000000] cursor-pointer ${
                        isSelected
                          ? 'bg-[#4285F4] text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {isSelected ? '✓ ' : ''}
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => router.push('/preferensi/riasec')}
              className="flex-1 py-3 bg-white hover:bg-gray-100 border-2 border-black shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[9px] text-black flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Icon name="back" className="w-3.5 h-3.5 text-black" />
              <span>KEMBALI</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-3 bg-[#4285F4] hover:bg-[#277EFD] text-white border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[9px] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>LANJUT KE BAHAN</span>
              <Icon name="arrow-right" className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
