'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Icon } from '@/components/ui/Icon';
import PemilihPreferensi, { PreferensiItem } from '@/components/ui/PemilihPreferensi';

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
  const [preferensiList, setPreferensiList] = useState<PreferensiItem[]>([
    { id: 'pref-1', nama: 'Informatika Impian', jalur: 'snbp', is_aktif: true },
    { id: 'pref-2', nama: 'Cadangan SNBT', jalur: 'snbt', is_aktif: false },
    { id: 'pref-3', nama: 'Plan B Statistika', jalur: 'snbp', is_aktif: false },
  ]);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProdi, setSelectedProdi] = useState<RecommendationItem | null>(null);

  const handlePilihPreferensi = (id: string) => {
    setPreferensiList((prev) =>
      prev.map((p) => ({ ...p, is_aktif: p.id === id }))
    );
  };

  const handleOpenDetail = (item: RecommendationItem) => {
    setSelectedProdi(item);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex justify-center">
      <div className="w-full max-w-[402px] bg-white border-x-2 border-black flex flex-col min-h-screen font-['Outfit',sans-serif]">
        {/* Navbar */}
        <Navbar backHref="/" title="Cocokin" />

        <main className="w-full px-4 pt-5 pb-8 flex flex-col flex-1">
          {/* 1. Tag Analisis Selesai */}
          <div className="mb-2">
            <span className="inline-block px-2 py-0.5 border-2 border-[#22A94F] bg-white font-['Press_Start_2P',monospace] text-[8px] text-[#22A94F] tracking-wider uppercase shadow-[1px_1px_0px_#22A94F]">
              ANALISIS SELESAI
            </span>
          </div>

          {/* 2. Headline & Subtitle */}
          <h1 className="font-['Press_Start_2P',monospace] text-sm sm:text-base leading-relaxed text-[#151D21] mb-2">
            Rekomendasi jurusan untukmu
          </h1>
          <p className="text-xs text-[#6B7680] leading-relaxed mb-4">
            Berdasarkan minat, gaya belajar, dan data akademik yang kamu kirim.
          </p>

          {/* Pemilih Preferensi Aktif */}
          <div className="mb-5">
            <PemilihPreferensi
              preferensiList={preferensiList}
              onPilih={handlePilihPreferensi}
            />
          </div>

          {/* 3. Ticket Cards (Figma Card/Major Ticket M13: 205:3349) */}
          <div className="flex flex-col gap-4 mb-6">
            {RECOMMENDATIONS.map((item) => (
              <div
                key={item.id}
                className="relative bg-[#277EFD] border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] flex overflow-hidden"
              >
                {/* Left Perforated Stub */}
                <div className="w-[74px] shrink-0 border-r-2 border-dashed border-white/50 flex flex-col items-center justify-center p-2 text-white bg-[#1E6FD9]">
                  <span className="font-['Press_Start_2P',monospace] text-[7px] uppercase tracking-wider mb-1 opacity-90">
                    RANK
                  </span>
                  <span className="font-['Press_Start_2P',monospace] text-base font-black">
                    {item.rank}
                  </span>
                </div>

                {/* Right Ticket Body */}
                <div className="flex-1 p-3 flex flex-col justify-between text-white">
                  <div>
                    <h2 className="font-['Press_Start_2P',monospace] text-xs font-bold leading-snug">
                      {item.prodi}
                    </h2>
                    <p className="text-xs text-blue-100 font-medium mt-1">
                      {item.campus} · {item.jenjang}
                    </p>

                    {/* Match Progress Bar */}
                    <div className="flex items-center gap-2 mt-2.5">
                      <span className="text-xs font-medium">Cocok</span>
                      <div className="w-[100px] h-3 border border-black bg-white overflow-hidden relative">
                        <div
                          className="h-full bg-[#FEBD01]"
                          style={{ width: `${item.matchScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold">
                        {item.matchScore}%
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons: SIMULASI & DETAIL */}
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/20">
                    <Link
                      href={`/test-drive/${item.slug}`}
                      className="px-2.5 py-1.5 bg-[#F1402E] hover:bg-[#D93424] text-white border border-[#151D21] shadow-[1px_1px_0px_#151D21] font-['Press_Start_2P',monospace] text-[8px] tracking-wider active:translate-x-[1px]"
                    >
                      SIMULASI
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(item)}
                      className="px-2.5 py-1.5 bg-white hover:bg-gray-100 text-[#151D21] border border-[#151D21] shadow-[1px_1px_0px_#151D21] font-['Press_Start_2P',monospace] text-[8px] tracking-wider active:translate-x-[1px] cursor-pointer"
                    >
                      DETAIL
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 4. Explore Card ("Penasaran jurusan lain?") */}
          <div className="w-full bg-[#FFFDF0] border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] p-4 flex flex-col gap-2 mb-4">
            <h3 className="font-['Press_Start_2P',monospace] text-xs font-bold text-[#151D21]">
              Penasaran jurusan lain?
            </h3>
            <p className="text-xs text-[#6B7680] leading-relaxed">
              Coba test drive untuk merasakan studi kasus asli tiap jurusan.
            </p>
            <Link
              href="/katalog"
              className="mt-1 self-start px-3 py-2 bg-white hover:bg-gray-50 border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] font-['Press_Start_2P',monospace] text-[9px] text-[#151D21] active:translate-x-[1px]"
            >
              JELAJAHI SIMULASI
            </Link>
          </div>

          {/* 5. Tanya AI Card ("Masih ragu?") */}
          <div className="w-full bg-[#EEF5FF] border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] p-4 flex flex-col gap-2 mb-6">
            <h3 className="font-['Press_Start_2P',monospace] text-xs font-bold text-[#151D21]">
              Masih ragu? Tanya Cocokin AI
            </h3>
            <p className="text-xs text-[#6B7680] leading-relaxed">
              Ceritakan jurusan & kampus incaranmu, kami bantu susun strategi masuknya.
            </p>
            <Link
              href="/chat"
              className="mt-1 self-start px-3 py-2 bg-[#277EFD] hover:bg-[#1E6FD9] text-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] font-['Press_Start_2P',monospace] text-[9px] active:translate-x-[1px]"
            >
              MULAI CHAT
            </Link>
          </div>
        </main>

        {/* Footer GELAP Persis Figma M13 */}
        <footer className="w-full bg-[#151D21] text-white px-5 pt-8 pb-6 border-t-2 border-black flex flex-col gap-6 font-['Outfit',sans-serif]">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/logo-cap.png"
                alt="Cocokin Logo"
                width={28}
                height={28}
                className="w-7 h-7 object-contain image-pixelated"
              />
              <span className="font-['Press_Start_2P',monospace] text-sm font-bold text-white tracking-wider">
                Cocokin!
              </span>
            </div>
            <p className="text-xs text-[#D9D5CB] leading-relaxed">
              Cari yang cocok, uji rasanya, tembus kampus impianmu.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <h4 className="font-['Press_Start_2P',monospace] text-[9px] text-[#FEBD01] mb-2.5 uppercase tracking-wider">
                JELAJAHI
              </h4>
              <ul className="space-y-2 text-white">
                <li><Link href="/" className="hover:text-[#277EFD]">Beranda</Link></li>
                <li><Link href="/cocokin" className="hover:text-[#277EFD]">Cocokin</Link></li>
                <li><Link href="/preferensi" className="hover:text-[#277EFD]">Preferensi</Link></li>
                <li><Link href="/katalog" className="hover:text-[#277EFD]">Test Drive Jurusan</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-['Press_Start_2P',monospace] text-[9px] text-[#FEBD01] mb-2.5 uppercase tracking-wider">
                SUMBER DATA
              </h4>
              <ul className="space-y-2 text-white text-[11px] leading-tight">
                <li>snpmb.id (daya tampung, peminat, kuota sekolah)</li>
                <li>PDDikti (akreditasi & kompetensi prodi)</li>
                <li>O*NET Interest Profiler · CC BY 4.0</li>
                <li>Kepmendikdasmen 102/M/2025</li>
              </ul>
            </div>
          </div>

          <div className="p-3 border border-[#FEBD01] flex items-start gap-2.5 bg-black/20">
            <Icon name="info" className="w-4 h-4 text-[#FEBD01] shrink-0 mt-0.5" />
            <p className="text-[11px] text-white leading-relaxed">
              Semua angka peluang adalah estimasi berbasis data resmi, bukan jaminan kelulusan.
            </p>
          </div>

          <div className="border-t border-gray-700 pt-3 flex flex-col gap-2 text-[11px] text-[#D9D5CB]">
            <p>© 2026 Cocokin! • Hackathon JOINTS UGM 2026</p>
            <div className="flex items-center justify-between">
              <Link href="/syarat-ketentuan" className="text-white hover:underline">
                Syarat & ketentuan
              </Link>
            </div>
          </div>
        </footer>

        {/* POPUP DETAIL MODAL M14 (node 205:3518) */}
        {isDetailModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="w-full max-w-[380px] bg-white border-2 border-[#151D21] shadow-[6px_6px_0px_#151D21] p-4 flex flex-col max-h-[90vh] overflow-y-auto">
              {/* Header Modal */}
              <div className="mb-3">
                <span className="text-xs text-[#6B7680] block mb-1">
                  Dream Goal · {selectedProdi?.campus || 'Universitas Gadjah Mada'} · {selectedProdi?.jenjang || 'S1'}
                </span>
                <h3 className="font-['Press_Start_2P',monospace] text-sm text-[#151D21] leading-snug">
                  {selectedProdi?.prodi || 'Teknologi Informasi'}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-[#EEF5FF] border border-[#277EFD] text-[#277EFD] font-bold text-[10px]">
                    SAINTEK
                  </span>
                  <span className="text-xs text-[#6B7680]">
                    HOLLAND CIE cocok dengan ICR-mu
                  </span>
                </div>
              </div>

              {/* Peluang per Kampus */}
              <div className="mb-4">
                <span className="font-['Press_Start_2P',monospace] text-[8px] text-[#277EFD] tracking-wider uppercase block mb-1.5">
                  PELUANG PER KAMPUS · ESTIMASI
                </span>
                <div className="space-y-2">
                  <div className="p-2.5 bg-[#FFFDF0] border border-[#151D21] flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#151D21]">UGM</span>
                      <span className="px-1.5 py-0.5 bg-[#F1402E] text-white font-bold text-[8px]">
                        SANGAT KETAT
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7680]">
                      Teknologi Informasi · diterima SNBP 2025: 3,7%
                    </p>
                    <div className="flex items-center justify-between text-xs font-bold text-[#151D21] pt-1">
                      <span>Peluangmu 10–20%</span>
                      <span className="text-[#277EFD] text-[11px] underline">Kenapa?</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white border border-[#D9D5CB] flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#151D21]">UNY</span>
                      <span className="text-xs text-[#6B7680]">Peluangmu 15–25%</span>
                    </div>
                    <p className="text-xs text-[#6B7680]">
                      Pend. Teknik Informatika · diterima 3,6%
                    </p>
                  </div>
                </div>
              </div>

              {/* Kenapa Peluangmu di UGM 10-20%? */}
              <div className="mb-5 bg-[#F9F8F6] border border-[#D9D5CB] p-3 space-y-2 text-xs">
                <span className="font-bold text-[#151D21] block">
                  Kenapa peluangmu di UGM 10–20%?
                </span>
                <p className="text-[#3A444B] leading-relaxed">
                  • Hanya 24 dari 645 pendaftar SNBP 2025 diterima (3,7%). <span className="font-bold text-[#22A94F]">RESMI</span>
                </p>
                <p className="text-[#3A444B] leading-relaxed">
                  • Peringkatmu 36 dari 287, masih di dalam kuota eligible sekolah (115).
                </p>
                <p className="text-[#3A444B] leading-relaxed">
                  • Rapor 88,40 setelah dikoreksi TKA ada di kisaran atas pendaftar dari sekolahmu.
                </p>
                <p className="text-[#3A444B] leading-relaxed">
                  • Akreditasi Unggul · dosen:mhs 1:10 · masa studi 4,1 th <span className="font-bold text-[#277EFD]">PDDIKTI</span>
                </p>
              </div>

              {/* Action Buttons Modal Persis Figma M14 */}
              <div className="grid grid-cols-2 gap-2 mt-auto pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="py-2.5 bg-white hover:bg-gray-50 text-[#151D21] border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] font-['Press_Start_2P',monospace] text-[10px] text-center cursor-pointer"
                >
                  TUTUP
                </button>
                <Link
                  href={`/test-drive/${selectedProdi?.slug || 'teknologi-informasi'}`}
                  className="py-2.5 bg-[#22A94F] hover:bg-[#1E9646] text-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] font-['Press_Start_2P',monospace] text-[10px] text-center flex items-center justify-center cursor-pointer"
                >
                  TEST DRIVE
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
