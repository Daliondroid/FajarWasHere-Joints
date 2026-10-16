'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { usePreferensiStorage } from '@/components/preferensi/usePreferensiStorage';
import { RIASEC_QUESTIONS, RIASEC_3_OPTIONS } from '@/components/preferensi/riasecData';

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

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex justify-center">
      <div className="w-full max-w-[402px] bg-white border-x-2 border-black flex flex-col min-h-screen">
        <Navbar backHref="/preferensi/baru" title={draft.nama || 'Informatika Impian'} />

        <main className="p-4 flex-1 flex flex-col font-['Outfit',sans-serif]">
          {/* Stepper Header (M08) */}
          <div className="flex items-center justify-between mb-5 px-1">
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
          <div className="mb-4">
            <span className="font-['Press_Start_2P',monospace] text-[8px] sm:text-[9px] text-[#277EFD] tracking-wider uppercase block mb-1.5">
              LANGKAH 1 · KUIS MINAT
            </span>
            <h1 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-[#151D21] mb-2 leading-relaxed">
              Seberapa suka kamu dengan kegiatan ini?
            </h1>
            <p className="text-xs text-[#6B7680] leading-relaxed">
              Bayangkan kamu melakukannya sebagai pekerjaan. Jangan pikirkan gaji atau apakah kamu sudah bisa.
            </p>
          </div>

          {/* Subheader Pagination Banner */}
          <div className="flex items-center justify-between py-2 mb-3 border-y border-gray-200">
            <span className="font-['Press_Start_2P',monospace] text-[8px] text-[#277EFD] tracking-wider uppercase">
              KEGIATAN {startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, RIASEC_QUESTIONS.length)} DARI 30
            </span>
            <span className="text-xs text-[#6B7680] font-medium">
              Layar {pageIndex + 1} dari {totalPages}
            </span>
          </div>

          {/* List 5 Pertanyaan Per Layar Persis Figma M08 */}
          <div className="flex flex-col gap-4 mb-6">
            {currentQuestions.map((q, idx) => {
              const qNumber = startIdx + idx + 1;
              const formattedNum = qNumber < 10 ? `0${qNumber}` : `${qNumber}`;
              const currentVal = answers[q.id] || 3;

              return (
                <div
                  key={q.id}
                  className="p-3.5 bg-white border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] flex flex-col gap-2.5"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="font-['Press_Start_2P',monospace] text-[10px] text-[#277EFD] pt-0.5 shrink-0">
                      {formattedNum}
                    </span>
                    <p className="text-xs sm:text-sm text-[#151D21] font-medium leading-relaxed">
                      {q.text}
                    </p>
                  </div>

                  {/* 3 Opsi Respon (Sangat tidak suka, Ragu, Sangat suka) */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1.5">
                    {RIASEC_3_OPTIONS.map((opt) => {
                      const isSelected = currentVal === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSelect(q.id, opt.value)}
                          className={`py-2 px-1 text-center text-[10px] sm:text-[11px] font-medium border-2 border-[#151D21] transition-all cursor-pointer ${
                            isSelected
                              ? opt.value === 5
                                ? 'bg-[#22A94F] text-white shadow-[2px_2px_0px_#151D21] font-bold'
                                : opt.value === 1
                                ? 'bg-[#F1402E] text-white shadow-[2px_2px_0px_#151D21] font-bold'
                                : 'bg-[#FEBD01] text-[#151D21] shadow-[2px_2px_0px_#151D21] font-bold'
                              : 'bg-white text-[#151D21] hover:bg-gray-50'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
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
