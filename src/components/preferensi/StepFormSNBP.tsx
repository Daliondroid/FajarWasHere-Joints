'use client';

import React from 'react';
import Image from 'next/image';

interface StepFormSNBPProps {
  npsn: string;
  alamat: string;
  selectedAlumniRep: string;
  selectedCampus: string;
  errorMessage: string;
  onChangeNpsn: (val: string) => void;
  onChangeAlamat: (val: string) => void;
  onSelectAlumniRep: (val: string) => void;
  onSelectCampus: (val: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const ALUMNI_REPUTATION_OPTIONS = [
  'Langganan Banjir PTN Top',
  'Rutin Lolos PTN Negeri',
  'Lolos 1-5 Siswa / Tahun',
  'Sekolah Baru / Belum Ada Jejak',
];

const CAMPUS_OPTIONS = [
  { name: 'UGM', border: 'border-[#277EFD]' },
  { name: 'ITB', border: 'border-[#F1402E]' },
  { name: 'UI', border: 'border-[#FEBD01]' },
  { name: 'IPB', border: 'border-[#22A94F]' },
];

export default function StepFormSNBP({
  npsn,
  alamat,
  selectedAlumniRep,
  selectedCampus,
  errorMessage,
  onChangeNpsn,
  onChangeAlamat,
  onSelectAlumniRep,
  onSelectCampus,
  onBack,
  onSubmit,
}: StepFormSNBPProps) {
  return (
    <div className="flex flex-col space-y-6">
      {/* KOTAK KUNING DASHED SNBP */}
      <div className="w-full border-2 border-dashed border-[#FEBD01] p-4 bg-white flex flex-col space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-4 h-4 bg-[#FEBD01] inline-block"></span>
          <span className="font-['Press_Start_2P',monospace] text-xs font-bold text-black">
            SNBP
          </span>
        </div>

        {/* Upload Nilai Raport */}
        <div>
          <p className="text-xs font-normal text-black mb-2">
            Upload Nilai Raport Semester 1-5 (dalam PDF)
          </p>
          <label className="w-full h-[140px] border border-[#FEBD01] flex flex-col items-center justify-center cursor-pointer hover:bg-yellow-50/40 transition-colors">
            <Image
              src="/assets/icon-upload.png"
              alt="Upload icon"
              width={64}
              height={64}
              className="w-16 h-16 object-contain image-pixelated mb-1"
            />
            <input type="file" accept=".pdf" className="hidden" />
          </label>
        </div>

        {/* NPSN */}
        <div>
          <p className="text-xs font-normal text-black mb-1">
            NPSN (No. Sekolah)
          </p>
          <input
            type="text"
            value={npsn}
            onChange={(e) => onChangeNpsn(e.target.value)}
            className="w-full h-[37px] border border-[#FEBD01] px-3 text-xs focus:outline-none"
          />
        </div>

        {/* Sertifikat / Portofolio */}
        <div>
          <p className="text-xs font-normal text-black mb-2">
            Sertifikat / portofolio (pdf, img, video)
          </p>
          <label className="w-full h-[140px] border border-[#FEBD01] flex flex-col items-center justify-center cursor-pointer hover:bg-yellow-50/40 transition-colors">
            <Image
              src="/assets/icon-upload.png"
              alt="Upload icon"
              width={64}
              height={64}
              className="w-16 h-16 object-contain image-pixelated mb-1"
            />
            <input type="file" accept=".pdf,image/*,video/*" className="hidden" />
          </label>
        </div>

        {/* Alamat */}
        <div>
          <p className="text-xs font-normal text-black mb-1">Alamat</p>
          <input
            type="text"
            value={alamat}
            onChange={(e) => onChangeAlamat(e.target.value)}
            className="w-full h-[37px] border border-[#FEBD01] px-3 text-xs focus:outline-none"
          />
        </div>

        <div className="border-b border-dashed border-[#FEBD01] my-2"></div>

        {/* Reputasi Alumni */}
        <div>
          <p className="text-xs font-normal text-black mb-2">
            Reputasi Alumni
          </p>
          <div className="space-y-2 text-xs">
            {ALUMNI_REPUTATION_OPTIONS.map((rep) => (
              <label
                key={rep}
                onClick={() => onSelectAlumniRep(rep)}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <span
                  className={`w-[15px] h-[15px] border border-black flex items-center justify-center ${
                    selectedAlumniRep === rep ? 'bg-[#FEBD01]' : 'bg-white'
                  }`}
                >
                  {selectedAlumniRep === rep && (
                    <span className="text-[10px] font-black">✓</span>
                  )}
                </span>
                <span>{rep}</span>
              </label>
            ))}
          </div>
          <p className="text-[10px] text-[#F1402E] mt-2">
            Pilih salah satu ya..
          </p>

          {/* Warning Banner jika Reputasi Alumni belum dipilih */}
          {errorMessage && (
            <div className="w-full bg-[#FCE8E6] border-2 border-[#F1402E] p-2.5 mt-3 text-[#F1402E] text-xs font-bold flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Kampus Basis Alumni */}
        <div className="pt-2">
          <p className="text-xs font-normal text-black mb-2">
            Kampus Basis Alumni
          </p>
          <div className="grid grid-cols-4 gap-1.5 mb-2">
            {CAMPUS_OPTIONS.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => onSelectCampus(c.name)}
                className={`h-[33px] border ${c.border} text-xs font-bold flex items-center justify-center cursor-pointer transition-colors ${
                  selectedCampus === c.name
                    ? 'bg-[#FEBD01] text-black font-black'
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="w-full h-[33px] border border-[#277EFD] text-xs font-bold flex items-center justify-center text-black bg-white hover:bg-blue-50/50 cursor-pointer"
          >
            + Kampus
          </button>
        </div>
      </div>

      {/* Navigasi Tombol */}
      <div className="flex items-center justify-between gap-4 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="w-[128px] h-[34px] pixel-btn-white flex items-center justify-center cursor-pointer"
        >
          KEMBALI
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="w-[129px] h-[34px] pixel-btn-blue flex items-center justify-center cursor-pointer"
        >
          LANJUT
        </button>
      </div>
    </div>
  );
}
