'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Icon } from '@/components/ui/Icon';
import { usePreferensiStorage } from '@/components/preferensi/usePreferensiStorage';
import {
  RIASEC_QUESTIONS,
  RIASEC_SCALE_OPTIONS,
} from '@/components/preferensi/riasecData';

export default function RiasecQuizPage() {
  const router = useRouter();
  const { draft, updateDraft } = usePreferensiStorage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>(
    draft.jawaban_minat || {}
  );

  const currentQ = RIASEC_QUESTIONS[currentIndex];
  const totalQ = RIASEC_QUESTIONS.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQ) * 100);

  const handleSelectOption = (val: number) => {
    const updated = { ...answers, [currentQ.id]: val };
    setAnswers(updated);
    updateDraft({ jawaban_minat: updated });

    if (currentIndex < totalQ - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      router.push('/preferensi/minat');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      router.push('/preferensi/baru');
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQ - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      router.push('/preferensi/minat');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex justify-center">
      <div className="w-full max-w-[402px] bg-white border-x-2 border-black flex flex-col min-h-screen">
        <Navbar backHref="/preferensi/baru" title={draft.nama || 'Kuis Minat RIASEC'} />

        <main className="p-4 flex-1 flex flex-col font-['Outfit',sans-serif]">
          {/* Stepper Header (M08) */}
          <div className="flex items-center justify-between mb-5 px-2">
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

          {/* Title Header */}
          <div className="mb-4">
            <span className="inline-block px-2 py-0.5 bg-[#EEF5FF] border border-black text-[#277EFD] font-['Press_Start_2P',monospace] text-[8px] mb-2 shadow-[1px_1px_0px_#000000]">
              LANGKAH 1 • KUIS MINAT RIASEC
            </span>
            <h1 className="font-['Press_Start_2P',monospace] text-xs text-black mb-1.5 leading-snug">
              Seberapa suka kamu dengan kegiatan ini?
            </h1>
            <p className="text-xs text-gray-600">
              Tidak ada jawaban salah. Jawab spontan sesuai kata hatimu.
            </p>
          </div>

          {/* Progress Bar Pertanyaan */}
          <div className="mb-5">
            <div className="flex items-center justify-between font-['Press_Start_2P',monospace] text-[8px] text-gray-600 mb-1.5">
              <span>PERTANYAAN {currentIndex + 1} DARI {totalQ}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 border border-black overflow-hidden shadow-[1px_1px_0px_#000000]">
              <div
                className="h-full bg-[#4285F4] transition-[width] duration-150 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Card Soal Retro Window */}
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_#000000] overflow-hidden mb-5">
            <div className="bg-[#4285F4] px-3 py-1.5 border-b-2 border-black flex items-center justify-between text-white">
              <span className="font-['Press_Start_2P',monospace] text-[8px]">
                {currentQ.id} • {currentQ.typeName.toUpperCase()}
              </span>
              <div className="flex gap-1">
                <span className="w-2.5 h-2.5 bg-white border border-black" />
                <span className="w-2.5 h-2.5 bg-white border border-black" />
              </div>
            </div>

            <div className="p-4">
              <p className="font-['Outfit',sans-serif] font-bold text-sm text-black leading-relaxed min-h-[50px] mb-4">
                &ldquo;{currentQ.text}&rdquo;
              </p>

              {/* 5 Skala Jawaban */}
              <div className="space-y-2">
                {RIASEC_SCALE_OPTIONS.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectOption(opt.value)}
                      className={`w-full p-2.5 border-2 border-black text-left flex items-center justify-between text-xs font-bold transition-all shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer ${
                        isSelected
                          ? 'bg-[#EEF5FF] ring-2 ring-black font-extrabold'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{opt.emoji}</span>
                        <span className="text-black">{opt.label}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border-2 border-black flex items-center justify-center ${
                          isSelected ? 'bg-[#4285F4]' : 'bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Action Navigation */}
          <div className="mt-auto pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrev}
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
              <span>{currentIndex === totalQ - 1 ? 'LIHAT HASIL' : 'LEWATI'}</span>
              <Icon name="arrow-right" className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
