'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/ui/TopBar';
import { Icon, IconName } from '@/components/ui/Icon';
import { usePreferensiStorage } from '@/components/preferensi/usePreferensiStorage';
import { RIASEC_QUESTIONS } from '@/components/preferensi/riasecData';

const FACE_ICONS: IconName[] = ['face-1', 'face-2', 'face-3', 'face-4', 'face-5'];

export default function RiasecQuizPage() {
  const router = useRouter();
  const { draft, updateDraft } = usePreferensiStorage();
  const [pageIndex, setPageIndex] = useState(0); // 0 sampai 5 (6 layar)
  const [answers, setAnswers] = useState<Record<string, number>>(
    draft.jawaban_minat || {}
  );

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(RIASEC_QUESTIONS.length / ITEMS_PER_PAGE); // 6
  const startIdx = pageIndex * ITEMS_PER_PAGE;
  const currentQuestions = RIASEC_QUESTIONS.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handleSelect = (questionId: string, val: number) => {
    const updated = { ...answers, [questionId]: val };
    setAnswers(updated);
    updateDraft({ jawaban_minat: updated });
  };

  const handlePrev = () => {
    if (pageIndex > 0) {
      setPageIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/preferensi/baru');
    }
  };

  const handleNext = () => {
    if (pageIndex < totalPages - 1) {
      setPageIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/preferensi/minat');
    }
  };

  const progressPercent = ((pageIndex + 1) / totalPages) * 100;

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* ── MOBILE CONTAINER (<1024px) ── */}
      <div className="lg:hidden flex justify-center">
        <div className="w-full max-w-[402px] bg-white border-x-2 border-[#151D21] flex flex-col min-h-screen">
          {/* TopBar persis M08 */}
          <TopBar
            title={draft.nama || 'Informatika Impian'}
            onBack={handlePrev}
          />

          <main className="p-6 pb-8 flex-1 flex flex-col font-['Outfit',sans-serif]">
            {/* Stepper Header Persis Figma M08 */}
            <div className="flex items-center justify-between mb-5">
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
            <div className="mb-4">
              <span className="font-['Pixelify_Sans',sans-serif] text-[12px] font-medium text-[#277EFD] tracking-wider uppercase block mb-1">
                LANGKAH 1 · KUIS MINAT
              </span>
              <h1 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-[#151D21] mb-2 leading-relaxed">
                Seberapa suka kamu dengan kegiatan ini?
              </h1>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs sm:text-sm text-[#6B7680] leading-relaxed">
                Bayangkan kamu melakukannya sebagai pekerjaan. Jangan pikirkan gaji atau apakah kamu sudah bisa.
              </p>
            </div>

            {/* Subheader Pagination Banner + Progress Bar */}
            <div className="mb-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-['Press_Start_2P',monospace] text-[9px] text-[#277EFD] tracking-wider uppercase">
                  KEGIATAN {startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, RIASEC_QUESTIONS.length)} DARI 30
                </span>
                <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#6B7680] font-medium">
                  Layar {pageIndex + 1} dari {totalPages}
                </span>
              </div>
              {/* Progress track */}
              <div className="w-full h-1 bg-[#D3D6DA] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#277EFD] transition-all duration-200"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* List 5 Pertanyaan Per Layar Persis Figma M08 */}
            <div className="flex flex-col gap-4 mb-6">
              {currentQuestions.map((q, idx) => {
                const qNumber = startIdx + idx + 1;
                const formattedNum = qNumber < 10 ? `0${qNumber}` : `${qNumber}`;
                const currentVal = answers[q.id] || 0;
                const isAnswered = currentVal > 0;

                return (
                  <div
                    key={q.id}
                    className={`p-4 bg-white border-2 shadow-[4px_4px_0px_#151D21] flex flex-col gap-3.5 transition-all ${
                      isAnswered ? 'border-[#277EFD]' : 'border-[#151D21]'
                    }`}
                  >
                    {/* Top: Nomor + Teks Kegiatan */}
                    <div className="flex items-start gap-3">
                      <span className="px-2 py-0.5 bg-[#277EFD] text-white font-['Press_Start_2P',monospace] text-[10px] shrink-0 font-bold">
                        {formattedNum}
                      </span>
                      <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs sm:text-sm text-[#151D21] font-semibold leading-relaxed">
                        {q.text}
                      </p>
                    </div>

                    {/* Skala 5 Pilihan (Icon face 1 - 5) */}
                    <div className="grid grid-cols-5 gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((val, faceIdx) => {
                        const isSelected = currentVal === val;
                        const iconName = FACE_ICONS[faceIdx];

                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleSelect(q.id, val)}
                            className={`h-10 border-2 border-[#151D21] flex items-center justify-center transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#277EFD] text-white shadow-[2px_2px_0px_#151D21]'
                                : 'bg-white text-[#151D21] hover:bg-gray-50'
                            }`}
                            aria-label={`Skala ${val}`}
                          >
                            <Icon
                              name={iconName}
                              className={`w-6 h-6 ${
                                isSelected ? 'text-white' : 'text-[#151D21]'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>

                    {/* Keterangan Skala Bawah */}
                    <div className="flex items-center justify-between font-['Plus_Jakarta_Sans',sans-serif] text-[10px] sm:text-[11px] text-[#6B7680] pt-0.5">
                      <span>Sangat tidak suka</span>
                      <span>Ragu</span>
                      <span>Sangat suka</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sticky Bottom Action Bar Persis Figma M08 */}
            <div className="mt-auto pt-4 pb-2 border-t border-gray-200 grid grid-cols-2 gap-3 sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={handlePrev}
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

      {/* ── DESKTOP CONTAINER (≥1024px, Figma D05 node 186:2457) ── */}
      <div className="hidden lg:flex flex-col w-full min-h-screen bg-[#FDFBF7]">
        {/* Desktop TopBar */}
        <div className="w-full bg-white border-b-2 border-[#151D21] sticky top-0 z-40">
          <div className="max-w-[1200px] mx-auto px-6 h-[76px] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-['Pixelify_Sans',sans-serif] text-[20px] font-bold text-[#151D21]">
                Cocokin!
              </span>
              <span className="font-['Pixelify_Sans',sans-serif] text-sm text-[#6B7680]">
                / {draft.nama || 'Informatika Impian'} · Kuis RIASEC
              </span>
            </div>
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 bg-white hover:bg-gray-50 border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] font-['Press_Start_2P',monospace] text-[10px] text-[#151D21] cursor-pointer flex items-center gap-2"
            >
              <Icon name="back" className="w-3.5 h-3.5 text-[#151D21]" />
              <span>KEMBALI</span>
            </button>
          </div>
        </div>

        {/* 2-Kolom Split Layout D05 (1200px) */}
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
                LANGKAH 1 · KUIS MINAT RIASEC
              </span>
              <h1 className="font-['Press_Start_2P',monospace] text-sm text-[#151D21] mb-3 leading-snug">
                Seberapa suka kamu dengan kegiatan ini?
              </h1>
              <p className="text-xs text-[#6B7680] leading-relaxed">
                Bayangkan kamu melakukannya sebagai pekerjaan sehari-hari. Jangan pikirkan gaji atau apakah kamu sudah bisa.
              </p>
            </div>

            {/* Progres Box */}
            <div className="p-4 bg-[#F7F5F0] border-2 border-black flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-['Press_Start_2P',monospace] text-[9px] text-[#277EFD] font-bold">
                  SOAL {startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, RIASEC_QUESTIONS.length)} DARI 30
                </span>
                <span className="font-semibold text-xs text-[#151D21]">
                  Layar {pageIndex + 1}/{totalPages}
                </span>
              </div>
              <div className="w-full h-2 bg-white border border-black overflow-hidden">
                <div
                  className="h-full bg-[#277EFD] transition-all duration-200"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Kolom Kanan (8 kolom / 764px) */}
          <div className="col-span-8 flex flex-col gap-5">
            {currentQuestions.map((q, idx) => {
              const qNumber = startIdx + idx + 1;
              const formattedNum = qNumber < 10 ? `0${qNumber}` : `${qNumber}`;
              const currentVal = answers[q.id] || 0;
              const isAnswered = currentVal > 0;

              return (
                <div
                  key={q.id}
                  className={`p-6 bg-white border-2 shadow-[4px_4px_0px_#000] flex flex-col gap-4 transition-all ${
                    isAnswered ? 'border-[#277EFD]' : 'border-black'
                  }`}
                >
                  {/* Nomor + Teks */}
                  <div className="flex items-start gap-4">
                    <span className="px-3 py-1 bg-[#277EFD] text-white font-['Press_Start_2P',monospace] text-xs font-bold shrink-0">
                      {formattedNum}
                    </span>
                    <p className="text-base text-[#151D21] font-semibold leading-relaxed">
                      {q.text}
                    </p>
                  </div>

                  {/* Skala 5 Emoji Faces Desktop */}
                  <div className="grid grid-cols-5 gap-3 pt-2">
                    {[
                      { val: 1, label: 'Sangat tidak suka' },
                      { val: 2, label: 'Tidak suka' },
                      { val: 3, label: 'Netral' },
                      { val: 4, label: 'Suka' },
                      { val: 5, label: 'Sangat suka' },
                    ].map(({ val, label }, faceIdx) => {
                      const isSelected = currentVal === val;
                      const iconName = FACE_ICONS[faceIdx];

                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleSelect(q.id, val)}
                          className={`py-3 px-2 border-2 border-black flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#277EFD] text-white shadow-[3px_3px_0px_#000]'
                              : 'bg-[#F7F5F0] hover:bg-gray-100 text-[#151D21]'
                          }`}
                        >
                          <Icon
                            name={iconName}
                            className={`w-7 h-7 ${isSelected ? 'text-white' : 'text-[#151D21]'}`}
                          />
                          <span className={`text-[10px] font-medium leading-tight text-center ${isSelected ? 'text-white' : 'text-[#6B7680]'}`}>
                            {label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Desktop Action Buttons */}
            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrev}
                className="px-6 py-3.5 bg-white hover:bg-gray-50 text-[#151D21] border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[10px] cursor-pointer"
              >
                SEBELUMNYA
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3.5 bg-[#277EFD] hover:bg-[#1E6FD9] text-white border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[10px] cursor-pointer flex items-center gap-2"
              >
                <span>{pageIndex < totalPages - 1 ? 'SELANJUTNYA' : 'LIHAT HASIL MINAT'}</span>
                <Icon name="arrow-right" className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
