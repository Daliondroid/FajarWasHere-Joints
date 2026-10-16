'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Icon } from '@/components/ui/Icon';
import PemilihPreferensi from '@/components/ui/PemilihPreferensi';
import { usePreferensiStorage } from '@/components/preferensi/usePreferensiStorage';

interface RecommendationItem {
  id: string;
  rank: string;
  prodi: string;
  campus: string;
  jenjang: string;
  matchScore: number;
  slug: string;
}

const RECOMMENDATIONS: RecommendationItem[] = [
  {
    id: 'ti-ugm',
    rank: '#1',
    prodi: 'Teknologi Informasi',
    campus: 'Universitas Gadjah Mada',
    jenjang: 'S1',
    matchScore: 94,
    slug: 'teknologi-informasi',
  },
  {
    id: 'si-upn',
    rank: '#2',
    prodi: 'Sistem Informasi',
    campus: 'UPN "Veteran" Yogyakarta',
    jenjang: 'S1',
    matchScore: 86,
    slug: 'sistem-informasi',
  },
  {
    id: 'ilkom-undip',
    rank: '#3',
    prodi: 'Ilmu Komputer',
    campus: 'Universitas Diponegoro',
    jenjang: 'S1',
    matchScore: 79,
    slug: 'ilmu-komputer',
  },
];

export default function RekomendasiPage() {
  const { savedList, setAktif } = usePreferensiStorage();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProdi, setSelectedProdi] = useState<RecommendationItem | null>(null);

  const handleOpenDetail = (item: RecommendationItem) => {
    setSelectedProdi(item);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex justify-center">
      <div className="w-full max-w-[402px] bg-white border-x-2 border-black flex flex-col min-h-screen font-['Outfit',sans-serif]">
        {/* 1. Header M13: Brand + Avatar + Menu Hamburger + 4-Segment Scroll Progress */}
        <Navbar />

        <main className="w-full px-4 pt-5 pb-8 flex flex-col flex-1">
          {/* 2. Tag Analisis Selesai */}
          <div className="mb-2.5">
            <span className="inline-block px-2.5 py-1 bg-[#E6F6EC] border-2 border-[#22A94F] font-['Pixelify_Sans',sans-serif] text-[12px] font-medium text-[#22A94F] tracking-wider uppercase">
              ANALISIS SELESAI
            </span>
          </div>

          {/* 3. Headline & Subtitle */}
          <h1 className="font-['Press_Start_2P',monospace] text-[15px] sm:text-base leading-relaxed text-[#151D21] mb-2">
            Rekomendasi jurusan untukmu
          </h1>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#6B7680] leading-relaxed mb-4">
            Berdasarkan minat, gaya belajar, dan data akademik yang kamu kirim.
          </p>

          {/* 4. Pemilih Preferensi Aktif */}
          <div className="mb-5">
            <PemilihPreferensi
              preferensiList={savedList}
              onPilih={setAktif}
            />
          </div>

          {/* 5. 3 Ticket Cards (Figma Card/Major Ticket M13: node 205:3349) */}
          <div className="flex flex-col gap-4 mb-6">
            {RECOMMENDATIONS.map((item) => (
              <div
                key={item.id}
                className="w-full bg-[#277EFD] border-2 border-[#151D21] shadow-[4px_4px_0px_#151D21] flex relative overflow-hidden"
              >
                {/* Left Ticket Stub */}
                <div className="w-[78px] shrink-0 border-r-2 border-dashed border-[#151D21] flex flex-col items-center justify-center p-2 bg-[#277EFD] relative select-none">
                  {/* Half-circle notch top */}
                  <div className="absolute -top-[10px] -right-[10px] w-5 h-5 rounded-full bg-white border-2 border-[#151D21] z-10" />
                  {/* Half-circle notch bottom */}
                  <div className="absolute -bottom-[10px] -right-[10px] w-5 h-5 rounded-full bg-white border-2 border-[#151D21] z-10" />

                  <span className="font-['Pixelify_Sans',sans-serif] text-[12px] font-medium text-[#EAF2FF] uppercase tracking-wider">
                    RANK
                  </span>
                  <span className="font-['Press_Start_2P',monospace] text-[22px] font-normal text-white mt-1">
                    {item.rank}
                  </span>
                </div>

                {/* Right Ticket Body */}
                <div className="flex-1 p-3 flex flex-col justify-between text-white gap-2.5">
                  <div>
                    <h2 className="font-['Pixelify_Sans',sans-serif] text-[18px] font-semibold text-white leading-tight">
                      {item.prodi}
                    </h2>
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#EAF2FF] font-normal mt-0.5">
                      {item.campus} · {item.jenjang}
                    </p>
                  </div>

                  {/* Match Progress Bar */}
                  <div className="flex items-center gap-2">
                    <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-bold text-white">
                      Cocok
                    </span>
                    <div className="flex-1 max-w-[158px] h-[15px] bg-white border border-[#151D21] p-[2px]">
                      <div
                        className="h-full bg-[#FEBD01]"
                        style={{ width: `${item.matchScore}%` }}
                      />
                    </div>
                    <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-bold text-white">
                      {item.matchScore}%
                    </span>
                  </div>

                  {/* Actions: SIMULASI & DETAIL */}
                  <div className="flex items-center gap-2 mt-1">
                    <Link
                      href={`/test-drive/${item.slug}`}
                      className="px-3 py-1.5 bg-[#F1402E] hover:bg-[#D93424] text-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] font-['Press_Start_2P',monospace] text-[10px] flex items-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px]"
                    >
                      <span>SIMULASI</span>
                      <Icon name="arrow-right" className="w-3 h-3 text-white" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(item)}
                      className="px-3 py-1.5 bg-white hover:bg-gray-100 text-[#151D21] border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] font-['Press_Start_2P',monospace] text-[10px] flex items-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                    >
                      <span>DETAIL</span>
                      <Icon name="info" className="w-3 h-3 text-[#151D21]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 6. Explore Card ("Penasaran jurusan lain?") */}
          <div className="w-full bg-[#FFF6D6] border-2 border-[#151D21] shadow-[4px_4px_0px_#151D21] p-4 flex flex-col gap-2 mb-4">
            <h3 className="font-['Press_Start_2P',monospace] text-xs font-bold text-[#151D21]">
              Penasaran jurusan lain?
            </h3>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#3A444B] leading-relaxed">
              Coba test drive untuk merasakan studi kasus asli tiap jurusan.
            </p>
            <Link
              href="/katalog"
              className="mt-1 self-start px-3.5 py-2.5 bg-[#F1402E] hover:bg-[#D93424] text-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] font-['Press_Start_2P',monospace] text-[10px] flex items-center gap-2 active:translate-x-[1px] active:translate-y-[1px]"
            >
              <span>JELAJAHI SIMULASI</span>
              <Icon name="arrow-right" className="w-3 h-3 text-white" />
            </Link>
          </div>

          {/* 7. Tanya AI Card ("Masih ragu? Tanya Cocokin AI") */}
          <div className="w-full bg-[#EEF5FF] border-2 border-[#151D21] shadow-[4px_4px_0px_#151D21] p-4 flex flex-col gap-2 mb-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Icon name="spark" className="w-4 h-4 text-[#FEBD01]" />
                <Icon name="spark" className="w-3 h-3 text-[#277EFD]" />
              </div>
              <div className="w-7 h-7 bg-white border-2 border-[#151D21] flex items-center justify-center shadow-[1px_1px_0px_#151D21]">
                <Icon name="school" className="w-4 h-4 text-[#277EFD]" />
              </div>
            </div>

            <h3 className="font-['Press_Start_2P',monospace] text-xs font-bold text-[#151D21]">
              Masih ragu? Tanya Cocokin AI
            </h3>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#6B7680] leading-relaxed">
              Ceritakan jurusan & kampus incaranmu, kami bantu susun strategi masuknya.
            </p>
            <Link
              href="/chat"
              className="mt-1 self-start px-3.5 py-2.5 bg-[#277EFD] hover:bg-[#1E6FD9] text-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] font-['Press_Start_2P',monospace] text-[10px] flex items-center gap-2 active:translate-x-[1px] active:translate-y-[1px]"
            >
              <span>MULAI CHAT</span>
              <Icon name="arrow-right" className="w-3 h-3 text-white" />
            </Link>
          </div>
        </main>

        {/* 8. Footer Persis Figma M13 & M20 */}
        <Footer />

        {/* 9. POPUP DETAIL BOTTOM SHEET M14 (node 205:3518) */}
        {isDetailModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#151D21]/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="w-full max-w-[402px] bg-white border-t-2 sm:border-2 border-[#151D21] shadow-[0px_-4px_0px_#151D21] sm:shadow-[6px_6px_0px_#151D21] p-4 flex flex-col max-h-[90vh] overflow-y-auto rounded-t-[16px] sm:rounded-none animate-in slide-in-from-bottom duration-200">
              {/* Handle Bar */}
              <div className="w-10 h-1 bg-[#D3D6DA] rounded-full mx-auto mb-3 shrink-0" />

              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1.5 bg-[#277EFD] text-white font-['Press_Start_2P',monospace] text-[12px] border border-[#151D21] shrink-0">
                    {selectedProdi?.rank || '#1'}
                  </div>
                  <div>
                    <h3 className="font-['Pixelify_Sans',sans-serif] text-[18px] font-semibold text-[#151D21] leading-tight">
                      {selectedProdi?.prodi || 'Teknologi Informasi'}
                    </h3>
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#6B7680] mt-0.5">
                      Dream Goal · {selectedProdi?.campus || 'Universitas Gadjah Mada'} · {selectedProdi?.jenjang || 'S1'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  aria-label="Tutup popup"
                  className="w-7 h-7 border border-[#151D21] hover:bg-gray-100 text-[#151D21] flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <Icon name="close" className="w-4 h-4" />
                </button>
              </div>

              {/* Kecocokan */}
              <div className="flex flex-col gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-bold text-[#151D21]">
                    Cocok
                  </span>
                  <div className="flex-1 h-[15px] bg-[#F7F5F0] border border-[#151D21] p-[2px]">
                    <div
                      className="h-full bg-[#FEBD01]"
                      style={{ width: `${selectedProdi?.matchScore || 94}%` }}
                    />
                  </div>
                  <span className="font-['Pixelify_Sans',sans-serif] text-[15px] font-semibold text-[#151D21]">
                    {selectedProdi?.matchScore || 94}%
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-[#151D21] text-white font-bold text-[10px] uppercase">
                    ICR
                  </span>
                  <span className="px-2 py-0.5 bg-[#FFF6D6] border border-[#151D21] text-[#151D21] font-bold text-[10px] uppercase">
                    TEKNIK
                  </span>
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#6B7680]">
                    cocok dengan ICR-mu
                  </span>
                </div>
              </div>

              <div className="border-b border-[#D3D6DA] my-2" />

              {/* Peluang per Kampus */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-['Pixelify_Sans',sans-serif] text-[15px] font-semibold text-[#151D21]">
                    Peluang per kampus
                  </span>
                  <span className="px-2 py-0.5 bg-[#FFF6D6] border border-[#151D21] text-[#151D21] font-bold text-[10px]">
                    SNBP 2026
                  </span>
                </div>

                <div className="space-y-2">
                  {/* UGM */}
                  <div className="p-3 bg-[#FFFDF0] border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-['Pixelify_Sans',sans-serif] text-[15px] font-semibold text-[#151D21]">
                        UGM
                      </span>
                      <span className="px-1.5 py-0.5 bg-[#FEECEC] border border-[#F1402E] text-[#F1402E] font-bold text-[10px]">
                        SANGAT KETAT
                      </span>
                    </div>
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#6B7680]">
                      Teknologi Informasi · diterima SNBP 2025: 3,7%
                    </p>
                    <div className="flex items-center justify-between text-[12px] font-bold text-[#151D21] pt-1">
                      <span>Peluangmu 10–20%</span>
                      <span className="text-[#277EFD] text-[11px] underline cursor-pointer">
                        Kenapa?
                      </span>
                    </div>
                  </div>

                  {/* UNY */}
                  <div className="p-3 bg-white border border-[#D9D5CB] flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-['Pixelify_Sans',sans-serif] text-[15px] font-semibold text-[#151D21]">
                        UNY
                      </span>
                      <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#6B7680] font-medium">
                        Peluangmu 15–25%
                      </span>
                    </div>
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#6B7680]">
                      Pend. Teknik Informatika · diterima 3,6%
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b border-[#D3D6DA] my-2" />

              {/* Kenapa Peluangmu di UGM 10-20%? */}
              <div className="mb-3 space-y-2">
                <span className="font-['Pixelify_Sans',sans-serif] text-[15px] font-semibold text-[#151D21] block">
                  Kenapa peluangmu di UGM 10–20%?
                </span>

                <div className="flex items-start gap-2 text-[12px] text-[#3A444B] leading-relaxed">
                  <Icon name="check" className="w-4 h-4 text-[#22A94F] shrink-0 mt-0.5" />
                  <p className="flex-1">
                    Hanya 24 dari 645 pendaftar SNBP 2025 diterima (3,7%).
                  </p>
                  <span className="px-1.5 py-0.5 bg-[#E6F6EC] border border-[#22A94F] text-[#22A94F] font-bold text-[10px] shrink-0">
                    KOMPETITIF
                  </span>
                </div>

                <div className="flex items-start gap-2 text-[12px] text-[#3A444B] leading-relaxed">
                  <Icon name="check" className="w-4 h-4 text-[#22A94F] shrink-0 mt-0.5" />
                  <p className="flex-1">
                    Peringkatmu 36 dari 287, masih di dalam kuota eligible sekolah (115).
                  </p>
                  <span className="px-1.5 py-0.5 bg-[#E6F6EC] border border-[#22A94F] text-[#22A94F] font-bold text-[10px] shrink-0">
                    ELIGIBLE
                  </span>
                </div>

                <div className="flex items-start gap-2 text-[12px] text-[#3A444B] leading-relaxed">
                  <Icon name="check" className="w-4 h-4 text-[#FEBD01] shrink-0 mt-0.5" />
                  <p className="flex-1">
                    Rapor 88,40 setelah dikoreksi TKA ada di kisaran atas pendaftar dari sekolahmu.
                  </p>
                  <span className="px-1.5 py-0.5 bg-[#FFF6D6] border border-[#8F6600] text-[#8F6600] font-bold text-[10px] shrink-0">
                    POTENSI
                  </span>
                </div>
              </div>

              <div className="border-b border-[#D3D6DA] my-2" />

              {/* PDDikti Row */}
              <div className="flex items-center gap-2 mb-4">
                <Icon name="school" className="w-4 h-4 text-[#151D21] shrink-0" />
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#3A444B] leading-tight flex-1">
                  Akreditasi Unggul · dosen:mhs 1:10 · masa studi 4,1 th
                </p>
                <span className="px-2 py-0.5 bg-[#E6F6EC] border border-[#22A94F] text-[#22A94F] font-['Pixelify_Sans',sans-serif] text-[12px] font-medium shrink-0">
                  PDDIKTI
                </span>
              </div>

              {/* Action Buttons Modal Persis Figma M14 */}
              <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-200">
                <Link
                  href={`/test-drive/${selectedProdi?.slug || 'teknologi-informasi'}`}
                  className="flex-1 py-3 bg-[#277EFD] hover:bg-[#1E6FD9] text-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] font-['Press_Start_2P',monospace] text-[11px] flex items-center justify-center gap-2 active:translate-x-[1px]"
                >
                  <span>TEST DRIVE</span>
                  <Icon name="arrow-right" className="w-3.5 h-3.5 text-white" />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="py-3 px-5 bg-white hover:bg-gray-50 text-[#151D21] border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] font-['Press_Start_2P',monospace] text-[11px] text-center cursor-pointer active:translate-x-[1px]"
                >
                  TUTUP
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
