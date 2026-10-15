'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import StepperHeader from '@/components/preferensi/StepperHeader';
import StepMinatHobi from '@/components/preferensi/StepMinatHobi';
import { usePreferensiStorage } from '@/components/preferensi/usePreferensiStorage';

export default function PreferensiMinatPage() {
  const router = useRouter();
  const { draft, isLoaded, updateDraft } = usePreferensiStorage();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const toggleHobby = (hobby: string) => {
    setErrorMessage('');
    const current = draft.selectedHobbies;
    if (current.includes(hobby)) {
      updateDraft({ selectedHobbies: current.filter((h) => h !== hobby) });
    } else {
      updateDraft({ selectedHobbies: [...current, hobby] });
    }
  };

  const handleNext = () => {
    if (draft.selectedHobbies.length === 0 && draft.hobbiesStory.trim() === '') {
      setErrorMessage('Pilih minimal 1 hobi/minat atau isi cerita hobi di textarea!');
      return;
    }
    setErrorMessage('');
    router.push('/preferensi/akademik');
  };

  const handleBack = () => {
    router.push('/');
  };

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <span className="font-['Press_Start_2P',monospace] text-xs">MEMUAT...</span>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black py-6 px-4">
      <div className="w-full max-w-[402px] mx-auto flex flex-col">
        {/* Top Header: Chevron Back Arrow & Title Preferensi */}
        <div className="flex items-center mb-6">
          <button
            type="button"
            onClick={handleBack}
            className="w-8 h-8 flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
            aria-label="Kembali ke Beranda"
          >
            <svg
              className="w-6 h-6 text-black"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <polygon points="15.41,7.41 14,6 8,12 14,18 15.41,16.59 10.83,12" />
            </svg>
          </button>
          <div className="flex-1 text-center pr-8">
            <h1 className="font-['Press_Start_2P',monospace] text-base font-bold text-black">
              Preferensi
            </h1>
          </div>
        </div>

        {/* Stepper Wizard: Aktif di Stage 1 (Minat & Hobi) */}
        <StepperHeader currentStage={1} />

        {/* Form Minat & Hobi */}
        <StepMinatHobi
          selectedHobbies={draft.selectedHobbies}
          hobbiesStory={draft.hobbiesStory}
          errorMessage={errorMessage}
          onToggleHobby={toggleHobby}
          onChangeStory={(val) => {
            updateDraft({ hobbiesStory: val });
            setErrorMessage('');
          }}
          onBack={handleBack}
          onNext={handleNext}
        />
      </div>
    </main>
  );
}
