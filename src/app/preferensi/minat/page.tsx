'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/ui/TopBar';
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
      setErrorMessage('Pilih minimal 1 hobi/minat atau ceritakan minatmu di kolom yang tersedia!');
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
    <main className="min-h-screen bg-white text-black flex flex-col">
      <TopBar title="Preferensi" onBack={handleBack} />

      <div className="w-full max-w-[402px] mx-auto px-4 pt-6 flex-1 flex flex-col">
        {/* Stepper Wizard: Stage 1 (Minat & Hobi) */}
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
