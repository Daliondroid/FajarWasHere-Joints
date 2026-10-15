'use client';

import React from 'react';
import { RetroWindow } from '@/components/ui/RetroWindow';
import { Icon } from '@/components/ui/Icon';

interface StepFormSNBPProps {
  npsn: string;
  alamat: string;
  selectedAlumniRep: string;
  selectedCampuses: string[];
  onChangeNpsn: (val: string) => void;
  onChangeAlamat: (val: string) => void;
  onSelectAlumniRep: (val: string) => void;
  onToggleCampus: (val: string) => void;
}

const ALUMNI_REPUTATION_OPTIONS = [
  'Langganan banjir PTN top',
  'Rutin lolos PTN negeri',
  'Lolos 1–5 siswa per tahun',
  'Sekolah baru / belum ada jejak',
];

const CAMPUS_OPTIONS = ['UGM', 'ITB', 'UI', 'IPB'];

export default function StepFormSNBP({
  npsn,
  alamat,
  selectedAlumniRep,
  selectedCampuses,
  onChangeNpsn,
  onChangeAlamat,
  onSelectAlumniRep,
  onToggleCampus,
}: StepFormSNBPProps) {
  return (
    <RetroWindow
      title="JALUR SNBP · PRESTASI"
      variant="yellow"
      className="mb-8"
      contentClassName="p-4 flex flex-col gap-5"
    >
      {/* 1. Upload Nilai Rapor */}
      <div>
        <label className="w-full py-6 px-4 border-2 border-dashed border-[#277EFD] bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/40 transition-colors">
          <Icon name="upload" className="w-8 h-8 text-[#277EFD] mb-2" />
          <span className="font-['Press_Start_2P',monospace] text-[10px] sm:text-xs text-black text-center mb-1">
            Unggah rapor semester 1-5
          </span>
          <span className="text-xs text-[#6B7280]">PDF · maks. 10 MB</span>
          <input type="file" accept=".pdf" className="hidden" />
        </label>
      </div>

      {/* 2. NPSN */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-black">
          NPSN (Nomor Pokok Sekolah)
        </label>
        <input
          type="text"
          value={npsn}
          onChange={(e) => onChangeNpsn(e.target.value)}
          placeholder="20403214"
          className="w-full h-10 px-3 border-2 border-black bg-white text-xs text-black focus:outline-none"
        />
      </div>

      {/* 3. Alamat Sekolah */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-black">
          Alamat sekolah
        </label>
        <input
          type="text"
          value={alamat}
          onChange={(e) => onChangeAlamat(e.target.value)}
          placeholder="Contoh: Jl. Kaliurang Km 5, Sleman"
          className="w-full h-10 px-3 border-2 border-black bg-white text-xs text-black focus:outline-none"
        />
      </div>

      {/* 4. Upload Sertifikat / Portofolio */}
      <div>
        <label className="w-full py-6 px-4 border-2 border-dashed border-[#277EFD] bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/40 transition-colors">
          <Icon name="upload" className="w-8 h-8 text-[#277EFD] mb-2" />
          <span className="font-['Press_Start_2P',monospace] text-[10px] sm:text-xs text-black text-center mb-1">
            Sertifikat / portofolio
          </span>
          <span className="text-xs text-[#6B7280]">PDF, JPG, atau MP4 · maks. 25 MB</span>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png,.mp4" className="hidden" />
        </label>
      </div>

      {/* 5. Reputasi Alumni Sekolah */}
      <div className="flex flex-col gap-2">
        <div>
          <h4 className="font-['Press_Start_2P',monospace] text-[10px] sm:text-[11px] text-black">
            Reputasi alumni sekolah
          </h4>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Pilih yang paling menggambarkan sekolahmu
          </p>
        </div>

        <div className="flex flex-col gap-2 mt-1">
          {ALUMNI_REPUTATION_OPTIONS.map((opt) => {
            const isSelected = selectedAlumniRep === opt;
            return (
              <div
                key={opt}
                onClick={() => onSelectAlumniRep(opt)}
                className={`flex items-center gap-3 p-2.5 cursor-pointer transition-colors ${
                  isSelected ? 'bg-[#EEF5FF]' : 'hover:bg-gray-50'
                }`}
              >
                <div
                  className={`w-5 h-5 border-2 border-black flex items-center justify-center ${
                    isSelected ? 'bg-[#277EFD] text-white' : 'bg-white'
                  }`}
                >
                  {isSelected && <Icon name="check" className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className="text-xs text-black font-medium">{opt}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Kampus Basis Alumni */}
      <div className="flex flex-col gap-2">
        <div>
          <h4 className="font-['Press_Start_2P',monospace] text-[10px] sm:text-[11px] text-black">
            Kampus basis alumni
          </h4>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Kampus tempat alumni sekolahmu banyak diterima
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap mt-1">
          {CAMPUS_OPTIONS.map((c) => {
            const isSelected = selectedCampuses.includes(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => onToggleCampus(c)}
                className={`px-3 py-1.5 font-['Press_Start_2P',monospace] text-[9px] border-2 transition-all ${
                  isSelected
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-[#277EFD] border-[#277EFD] hover:bg-blue-50'
                }`}
              >
                {c}
              </button>
            );
          })}
          <button
            type="button"
            className="px-3 py-1.5 font-['Press_Start_2P',monospace] text-[9px] border-2 border-black bg-[#FEBD01] text-black hover:bg-yellow-400"
          >
            + TAMBAH
          </button>
        </div>
      </div>
    </RetroWindow>
  );
}
