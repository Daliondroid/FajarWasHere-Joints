'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/ui/TopBar';
import { Icon } from '@/components/ui/Icon';
import { RetroWindow } from '@/components/ui/RetroWindow';
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

  // Skor 6 dimensi Holland RIASEC (sesuai Figma M09)
  const riasecScores = [
    { key: 'R', score: 3.4, color: '#FEBD01', width: 68 },
    { key: 'I', score: 4.6, color: '#277EFD', width: 92 },
    { key: 'A', score: 2.0, color: '#D3D6DA', width: 40 },
    { key: 'S', score: 1.8, color: '#D3D6DA', width: 36 },
    { key: 'E', score: 2.4, color: '#D3D6DA', width: 48 },
    { key: 'C', score: 4.1, color: '#22A94F', width: 82 },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* ── MOBILE CONTAINER (<1024px) ── */}
      <div className="lg:hidden flex justify-center">
        <div className="w-full max-w-[402px] bg-white border-x-2 border-[#151D21] flex flex-col min-h-screen">
          {/* TopBar persis M09 */}
          <TopBar
            title={draft.nama || 'Informatika Impian'}
            onBack={() => router.push('/preferensi/riasec')}
          />

          <main className="p-6 pb-8 flex-1 flex flex-col font-['Outfit',sans-serif] space-y-5">
            {/* Stepper Header Persis Figma M09 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#277EFD] border-2 border-[#151D21] flex items-center justify-center font-['Press_Start_2P',monospace] text-[10px] font-bold text-white shadow-[1px_1px_0px_#151D21]">
                  1
                </div>
                <span className="font-['Press_Start_2P',monospace] text-[10px] text-[#151D21] font-bold tracking-tight">
                  MINAT
                </span>
              </div>

              <div className="flex-1 mx-3 h-0.5 bg-[#151D21]" />

              <div className="flex items-center gap-2 opacity-60">
                <div className="w-6 h-6 bg-white border-2 border-[#151D21] flex items-center justify-center font-['Press_Start_2P',monospace] text-[10px] font-bold text-[#6B7680]">
                  2
                </div>
                <span className="font-['Press_Start_2P',monospace] text-[10px] text-[#6B7680] tracking-tight">
                  BAHAN
                </span>
              </div>
            </div>

            {/* Heading */}
            <div>
              <span className="font-['Pixelify_Sans',sans-serif] text-[12px] font-medium text-[#277EFD] tracking-wider uppercase block mb-1">
                HASIL KUIS MINAT
              </span>
              <h1 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-[#151D21] leading-relaxed">
                Kelas karaktermu: ICR
              </h1>
            </div>

            {/* Box Hasil Karakter ICR Retro Hitam Persis Figma M09 (node 174:852) */}
            <div className="bg-[#151D21] border-2 border-[#151D21] shadow-[5px_5px_0px_#151D21] p-4 flex flex-col gap-4 text-white">
              {/* Top: Kode ICR + Nama Karakter */}
              <div className="flex items-start gap-3">
                <div className="px-2.5 py-1.5 border-2 border-[#FEBD01] bg-transparent">
                  <span className="font-['Press_Start_2P',monospace] text-lg font-bold text-[#FEBD01]">
                    ICR
                  </span>
                </div>
                <div className="flex flex-col">
                  <h2 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-white font-bold leading-snug">
                    Pemikir Sistematis
                  </h2>
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#D9D5CB] mt-0.5">
                    Investigative · Conventional · Realistic
                  </p>
                </div>
              </div>

              {/* Profil RIASEC (6 Baris Progres Horizontal M09) */}
              <div className="flex flex-col gap-2 pt-2 border-t border-[#3A444B]">
                {riasecScores.map((item) => (
                  <div key={item.key} className="flex items-center gap-3">
                    <span className="font-['Press_Start_2P',monospace] text-[11px] text-white w-4">
                      {item.key}
                    </span>
                    <div className="flex-1 h-2 bg-[#3A444B] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${item.width}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                    <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-white w-7 text-right">
                      {item.score.toFixed(1).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hobi Pelengkap (8 Chip Persis Figma M09) */}
            <div>
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm text-[#151D21] mb-2">
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
                          ? 'bg-[#277EFD] text-white shadow-[2px_2px_0px_#151D21] font-bold'
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
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm text-[#151D21] mb-2">
                Mapel favorit · {selectedMapel.length}/3
              </h2>
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

            {/* Cerita Bebas (Opsional) Menggunakan RetroWindow Hitam */}
            <RetroWindow
              title="CERITA BEBAS (OPSIONAL)"
              variant="black"
              contentClassName="p-3.5 flex flex-col gap-3"
            >
              <textarea
                rows={3}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Ceritakan minat atau hobimu yang belum tercakup di atas..."
                className="w-full p-2.5 bg-[#F7F5F0] border-2 border-[#151D21] text-xs text-[#151D21] leading-relaxed focus:outline-none"
              />

              {/* Kotak DIBANTU AI Persis M09 */}
              <div className="bg-[#EAF2FF] border-2 border-[#277EFD] p-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-[#151D21] text-white font-['Press_Start_2P',monospace] text-[7px] font-bold">
                    DIBANTU AI
                  </span>
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#151D21] font-bold">
                    Saran chip dari ceritamu
                  </span>
                </div>
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#3A444B]">
                  + Ngoprek Kode &amp; Gadget · + Informatika
                </p>
                <button
                  type="button"
                  onClick={applyAiSuggestion}
                  className="self-start py-1.5 px-2.5 bg-white hover:bg-gray-50 text-[#151D21] border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[8px] cursor-pointer"
                >
                  TERAPKAN SARAN
                </button>
              </div>
            </RetroWindow>

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
                className="py-3 bg-[#277EFD] hover:bg-[#1E6FD9] text-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[10px] text-center transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>LANJUT</span>
                <Icon name="arrow-right" className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* ── DESKTOP CONTAINER (≥1024px, Figma D05b node 272:4996) ── */}
      <div className="hidden lg:flex flex-col w-full min-h-screen bg-[#FDFBF7]">
        {/* Desktop TopBar */}
        <div className="w-full bg-white border-b-2 border-[#151D21] sticky top-0 z-40">
          <div className="max-w-[1200px] mx-auto px-6 h-[76px] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-['Pixelify_Sans',sans-serif] text-[20px] font-bold text-[#151D21]">
                Cocokin!
              </span>
              <span className="font-['Pixelify_Sans',sans-serif] text-sm text-[#6B7680]">
                / {draft.nama || 'Informatika Impian'} · Hasil Minat &amp; Hobi
              </span>
            </div>
            <button
              type="button"
              onClick={() => router.push('/preferensi/riasec')}
              className="px-4 py-2 bg-white hover:bg-gray-50 border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] font-['Press_Start_2P',monospace] text-[10px] text-[#151D21] cursor-pointer flex items-center gap-2"
            >
              <Icon name="back" className="w-3.5 h-3.5 text-[#151D21]" />
              <span>KEMBALI KE KUIS</span>
            </button>
          </div>
        </div>

        {/* 2-Kolom Split Layout D05b (1200px) */}
        <main className="max-w-[1200px] w-full mx-auto px-6 py-10 flex-1 grid grid-cols-12 gap-8 items-start font-['Plus_Jakarta_Sans',sans-serif]">
          {/* Kolom Kiri (4 kolom / 380px) */}
          <div className="col-span-4 sticky top-28 flex flex-col gap-6 p-6 bg-white border-2 border-black shadow-[4px_4px_0px_#000]">
            {/* Stepper Header */}
            <div className="flex items-center justify-between pb-4 border-b border-black/10">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-[#277EFD] border-2 border-[#151D21] flex items-center justify-center font-['Press_Start_2P',monospace] text-xs font-bold text-white shadow-[1px_1px_0px_#151D21]">
                  1
                </div>
                <span className="font-['Press_Start_2P',monospace] text-xs text-[#151D21] font-bold">
                  MINAT
                </span>
              </div>
              <div className="w-8 h-0.5 bg-[#151D21]" />
              <div className="flex items-center gap-2.5 opacity-40">
                <div className="w-7 h-7 bg-white border-2 border-[#151D21] flex items-center justify-center font-['Press_Start_2P',monospace] text-xs font-bold text-[#6B7680]">
                  2
                </div>
                <span className="font-['Press_Start_2P',monospace] text-xs text-[#6B7680]">
                  BAHAN
                </span>
              </div>
            </div>

            {/* Heading Info */}
            <div>
              <span className="font-['Pixelify_Sans',sans-serif] text-[12px] font-semibold text-[#277EFD] tracking-wider uppercase block mb-1">
                LANGKAH 1 · HASIL KUIS MINAT
              </span>
              <h1 className="font-['Press_Start_2P',monospace] text-sm text-[#151D21] mb-3 leading-snug">
                Kelas karaktermu: ICR
              </h1>
              <p className="text-xs text-[#6B7680] leading-relaxed">
                Tipe <strong className="text-[#151D21]">Pemikir Sistematis</strong>. Dominan pada dimensi Investigasi dan Konvensional, menyukai pemecahan masalah berbasis logika dan data terstruktur.
              </p>
            </div>
          </div>

          {/* Kolom Kanan (8 kolom / 764px) */}
          <div className="col-span-8 flex flex-col gap-6">
            {/* Box Hasil Karakter ICR Retro Hitam */}
            <div className="bg-[#151D21] border-2 border-black shadow-[5px_5px_0px_#000] p-6 flex flex-col gap-5 text-white">
              <div className="flex items-start gap-4">
                <div className="px-3.5 py-2 border-2 border-[#FEBD01] bg-transparent">
                  <span className="font-['Press_Start_2P',monospace] text-2xl font-bold text-[#FEBD01]">
                    ICR
                  </span>
                </div>
                <div className="flex flex-col">
                  <h2 className="font-['Press_Start_2P',monospace] text-base text-white font-bold leading-snug">
                    Pemikir Sistematis
                  </h2>
                  <p className="text-xs text-[#D9D5CB] mt-1">
                    Investigative · Conventional · Realistic
                  </p>
                </div>
              </div>

              {/* Profil RIASEC 6 Dimensi */}
              <div className="flex flex-col gap-3 pt-3 border-t border-[#3A444B]">
                {riasecScores.map((item) => (
                  <div key={item.key} className="flex items-center gap-4">
                    <span className="font-['Press_Start_2P',monospace] text-xs text-white w-5">
                      {item.key}
                    </span>
                    <div className="flex-1 h-3 bg-[#3A444B] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${item.width}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-white w-8 text-right">
                      {item.score.toFixed(1).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hobi Pelengkap */}
            <div className="p-6 bg-white border-2 border-black shadow-[4px_4px_0px_#000] flex flex-col gap-3">
              <h2 className="font-bold text-sm text-[#151D21]">
                Hobi pelengkap
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {FIGMA_HOBI_CHIPS.map((chip) => {
                  const isSelected = selectedChips.includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => toggleChip(chip)}
                      className={`px-3.5 py-2 border-2 border-black text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#277EFD] text-white shadow-[2px_2px_0px_#000] font-bold'
                          : 'bg-[#F7F5F0] text-[#151D21] hover:bg-gray-100'
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mapel Favorit */}
            <div className="p-6 bg-white border-2 border-black shadow-[4px_4px_0px_#000] flex flex-col gap-3">
              <h2 className="font-bold text-sm text-[#151D21]">
                Mapel favorit · {selectedMapel.length}/3
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {FIGMA_MAPEL_OPTIONS.map((mapel) => {
                  const isSelected = selectedMapel.includes(mapel);
                  return (
                    <button
                      key={mapel}
                      type="button"
                      onClick={() => toggleMapel(mapel)}
                      className={`px-3.5 py-2 border-2 border-black text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#277EFD] text-white shadow-[2px_2px_0px_#000] font-bold'
                          : 'bg-[#F7F5F0] text-[#151D21] hover:bg-gray-100'
                      }`}
                    >
                      {mapel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cerita Bebas Desktop */}
            <RetroWindow
              title="CERITA BEBAS (OPSIONAL)"
              variant="black"
              contentClassName="p-5 flex flex-col gap-4"
            >
              <textarea
                rows={3}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Ceritakan minat atau hobimu yang belum tercakup di atas..."
                className="w-full p-3 bg-[#F7F5F0] border-2 border-[#151D21] text-sm text-[#151D21] leading-relaxed focus:outline-none"
              />

              <div className="bg-[#EAF2FF] border-2 border-[#277EFD] p-4 flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#151D21] text-white font-['Press_Start_2P',monospace] text-[8px] font-bold">
                    DIBANTU AI
                  </span>
                  <span className="font-bold text-xs text-[#151D21]">
                    Saran chip dari ceritamu
                  </span>
                </div>
                <p className="text-xs text-[#3A444B] leading-relaxed">
                  + Ngoprek Kode &amp; Gadget · + Informatika
                </p>
                <button
                  type="button"
                  onClick={applyAiSuggestion}
                  className="self-start py-1.5 px-3 bg-white hover:bg-gray-50 text-[#151D21] border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[8px] cursor-pointer"
                >
                  TERAPKAN SARAN
                </button>
              </div>
            </RetroWindow>

            {/* Tombol Lanjut Desktop */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-4 bg-[#277EFD] hover:bg-[#1E6FD9] text-white border-2 border-black shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] font-['Press_Start_2P',monospace] text-xs cursor-pointer flex items-center gap-2.5"
              >
                <span>LANJUT KE BAHAN AKADEMIK</span>
                <Icon name="arrow-right" className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
