'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import StepperHeader from '@/components/preferensi/StepperHeader';
import StepPilihJalur from '@/components/preferensi/StepPilihJalur';
import StepFormSNBP from '@/components/preferensi/StepFormSNBP';
import StepFormSNBT from '@/components/preferensi/StepFormSNBT';
import { usePreferensiStorage } from '@/components/preferensi/usePreferensiStorage';

export default function PreferensiAkademikPage() {
  const router = useRouter();
  const { draft, isLoaded, updateDraft } = usePreferensiStorage();

  // Sub-step dalam halaman Akademik:
  // Jika belum memilih jalur, tampilkan 'jalur'. Jika sudah ada jalur yang dipilih, default ke 'form'
  const [subStep, setSubStep] = useState<'jalur' | 'form'>('jalur');
  const [trackError, setTrackError] = useState<string>('');
  const [snbpError, setSnbpError] = useState<string>('');

  // Saat pertama kali dimuat, jika user sudah memilih jalur di draft sebelumnya, kita bisa langsung aktifkan tampilan form jika diinginkan,
  // atau user bisa switch kembali ke jalur kapan saja.
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
  };

  const handleSubmitForm = () => {
    if (draft.selectedTrack === 'SNBP') {
      if (!draft.selectedAlumniRep) {
        setSnbpError('Pilih salah satu reputasi alumni sekolah kamu terlebih dahulu!');
        return;
      }
    }
    setSnbpError('');
    // Direct ke halaman rekomendasi /cocokin
    router.push('/cocokin');
  };

  const handleBack = () => {
    setTrackError('');
    setSnbpError('');

    if (subStep === 'form') {
      // Kembali ke pemilihan jalur di dalam halaman akademik
      setSubStep('jalur');
    } else {
      // Kembali ke halaman minat & hobi
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

  return (
    <main className="min-h-screen bg-white text-black py-6 px-4">
      <div className="w-full max-w-[402px] mx-auto flex flex-col">
        {/* Top Header: Chevron Back Arrow & Title Preferensi */}
        <div className="flex items-center mb-6">
          <button
            type="button"
            onClick={handleBack}
            className="w-8 h-8 flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
            aria-label="Kembali"
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

        {/* Stepper Wizard: Aktif di Stage 2 (Akademik) */}
        <StepperHeader currentStage={2} />

        {/* SUB-STEP 1: PILIH JALUR SNBP / SNBT */}
        {subStep === 'jalur' && (
          <StepPilihJalur
            selectedTrack={draft.selectedTrack}
            errorMessage={trackError}
            onSelectTrack={handleSelectTrack}
            onBack={handleBack}
            onNext={handleNextFromJalur}
          />
        )}

        {/* SUB-STEP 2: FORM DETAIL SNBP */}
        {subStep === 'form' && draft.selectedTrack === 'SNBP' && (
          <StepFormSNBP
            npsn={draft.npsn}
            alamat={draft.alamat}
            selectedAlumniRep={draft.selectedAlumniRep}
            selectedCampus={draft.selectedCampus}
            errorMessage={snbpError}
            onChangeNpsn={(val) => updateDraft({ npsn: val })}
            onChangeAlamat={(val) => updateDraft({ alamat: val })}
            onSelectAlumniRep={(rep) => {
              updateDraft({ selectedAlumniRep: rep });
              setSnbpError('');
            }}
            onSelectCampus={(camp) => updateDraft({ selectedCampus: camp })}
            onBack={handleBack}
            onSubmit={handleSubmitForm}
          />
        )}

        {/* SUB-STEP 2: FORM DETAIL SNBT */}
        {subStep === 'form' && draft.selectedTrack === 'SNBT' && (
          <StepFormSNBT
            tryoutList={draft.tryoutList}
            activeScoreIndex={draft.activeScoreIndex}
            onSelectScoreIndex={(idx) => updateDraft({ activeScoreIndex: idx })}
            onBack={handleBack}
            onSubmit={handleSubmitForm}
          />
        )}
      </div>
    </main>
  );
}
