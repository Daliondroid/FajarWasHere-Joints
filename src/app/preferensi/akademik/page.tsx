'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/ui/TopBar';
import { Icon } from '@/components/ui/Icon';
import StepperHeader from '@/components/preferensi/StepperHeader';
import StepPilihJalur from '@/components/preferensi/StepPilihJalur';
import StepFormSNBP from '@/components/preferensi/StepFormSNBP';
import StepFormSNBT, { SubtestScores } from '@/components/preferensi/StepFormSNBT';
import { usePreferensiStorage } from '@/components/preferensi/usePreferensiStorage';

export default function PreferensiAkademikPage() {
  const router = useRouter();
  const { draft, isLoaded, updateDraft } = usePreferensiStorage();

  const [subStep, setSubStep] = useState<'jalur' | 'form'>('jalur');
  const [trackError, setTrackError] = useState<string>('');

  // Default SNBT scores if not yet populated
  const defaultScores: SubtestScores = {
    pu: '720',
    ppu: '680',
    pbm: '650',
    pk: '700',
    lbind: '640',
    lbing: '710',
    pm: '690',
  };

  const currentScores: SubtestScores = {
    pu: draft.tryoutList?.[0]?.scores.pu || defaultScores.pu,
    ppu: draft.tryoutList?.[0]?.scores.ppu || defaultScores.ppu,
    pbm: draft.tryoutList?.[0]?.scores.pbm || defaultScores.pbm,
    pk: draft.tryoutList?.[0]?.scores.pk || defaultScores.pk,
    lbind: draft.tryoutList?.[0]?.scores.lbind || defaultScores.lbind,
    lbing: draft.tryoutList?.[0]?.scores.lbing || defaultScores.lbing,
    pm: draft.tryoutList?.[0]?.scores.pm || defaultScores.pm,
  };

  const handleScoreChange = (key: keyof SubtestScores, val: string) => {
    const updated = { ...currentScores, [key]: val };
    const list = [...(draft.tryoutList || [])];
    if (list.length > 0) {
      list[0] = { ...list[0], scores: updated };
    } else {
      list.push({ date: '15 Okt 2026', scores: updated });
    }
    updateDraft({ tryoutList: list });
  };

  const handleSelectTrack = (track: 'SNBP' | 'SNBT') => {
    updateDraft({ selectedTrack: track });
    setTrackError('');
  };

  const handleNextFromJalur = () => {
    if (!draft.selectedTrack) {
      setTrackError('Pilih salah satu jalur seleksi (SNBP atau SNBT) untuk lanjut!');
      return;
    }
    setTrackError('');
    setSubStep('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitForm = () => {
    router.push('/cocokin');
  };

  const handleBack = () => {
    setTrackError('');
    if (subStep === 'form') {
      setSubStep('jalur');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/preferensi/minat');
    }
  };

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <span className="font-['Press_Start_2P',monospace] text-xs">MEMUAT...</span>
      </main>
    );
  }

  const pageTitle = subStep === 'form' ? 'Data Akademik' : 'Preferensi';

  return (
    <main className="min-h-screen bg-white text-black flex flex-col">
      <TopBar title={pageTitle} onBack={handleBack} />

      {/* Top Action Bar when on form sub-step matching Figma 84:272 */}
      {subStep === 'form' && (
        <div className="w-full max-w-[402px] mx-auto px-4 pt-3 pb-1 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 pixel-btn-white py-2.5 text-xs tracking-wider"
          >
            KEMBALI
          </button>
          <button
            type="button"
            onClick={handleSubmitForm}
            className="flex-1 pixel-btn-blue py-2.5 text-xs tracking-wider flex items-center justify-center gap-2"
          >
            <span>LIHAT HASIL</span>
            <Icon name="arrow-right" className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      <div className="w-full max-w-[402px] mx-auto px-4 pt-4 flex-1 flex flex-col">
        {/* Stepper Wizard: Stage 2 (Akademik) */}
        <StepperHeader currentStage={2} />

        {/* SUB-STEP 1: PILIH JALUR SNBP / SNBT (Figma 84:203) */}
        {subStep === 'jalur' && (
          <StepPilihJalur
            selectedTrack={draft.selectedTrack}
            errorMessage={trackError}
            onSelectTrack={handleSelectTrack}
            onBack={handleBack}
            onNext={handleNextFromJalur}
          />
        )}

        {/* SUB-STEP 2: FORM DATA AKADEMIK (Figma 84:272) */}
        {subStep === 'form' && (
          <div className="flex flex-col pb-16">
            {/* Heading */}
            <div className="mb-2">
              <span className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px] text-[#277EFD] tracking-wider uppercase">
                LANGKAH 2 DARI 2
              </span>
            </div>
            <h2 className="font-['Press_Start_2P',monospace] text-base sm:text-lg text-black leading-relaxed mb-1.5">
              Lengkapi data akademikmu
            </h2>
            <p className="text-xs text-[#6B7280] mb-6">
              Dipakai untuk menghitung peluang lolos di setiap jalur yang kamu pilih.
            </p>

            {/* Always show both windows or selected track window */}
            <StepFormSNBP
              npsn={draft.npsn || '20403214'}
              alamat={draft.alamat}
              selectedAlumniRep={draft.selectedAlumniRep || 'Langganan banjir PTN top'}
              selectedCampuses={draft.selectedCampuses || ['IPB']}
              onChangeNpsn={(val) => updateDraft({ npsn: val })}
              onChangeAlamat={(val) => updateDraft({ alamat: val })}
              onSelectAlumniRep={(val) => updateDraft({ selectedAlumniRep: val })}
              onToggleCampus={(c) => {
                const list = draft.selectedCampuses || ['IPB'];
                const updated = list.includes(c) ? list.filter((x) => x !== c) : [...list, c];
                updateDraft({ selectedCampuses: updated });
              }}
            />

            <StepFormSNBT
              scores={currentScores}
              onChangeScore={handleScoreChange}
            />

            {/* Bottom button for convenience */}
            <div className="w-full flex items-center justify-between gap-3 mt-4 mb-8">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 pixel-btn-white py-3 text-xs tracking-wider"
              >
                KEMBALI
              </button>
              <button
                type="button"
                onClick={handleSubmitForm}
                className="flex-1 pixel-btn-blue py-3 text-xs tracking-wider flex items-center justify-center gap-2"
              >
                <span>LIHAT HASIL</span>
                <Icon name="arrow-right" className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
