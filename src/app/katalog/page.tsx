'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/ui/TopBar';
import { Icon } from '@/components/ui/Icon';
import PemilihPreferensi from '@/components/ui/PemilihPreferensi';
import { usePreferensiStorage } from '@/components/preferensi/usePreferensiStorage';

interface MajorItem {
  id: string;
  slug: string;
  name: string;
  campus: string;
  location: string;
  jenjang: 'S1' | 'D4' | 'D3';
  klaster: string;
  akreditasi: string;
  tingkatKeketatan: string;
  category: 'SAINTEK' | 'SOSHUM';
}

const MAJOR_DATA: MajorItem[] = [
  {
    id: '1',
    slug: 'teknologi-informasi',
    name: 'Teknologi Informasi',
    campus: 'Universitas Gadjah Mada',
    location: 'D.I. Yogyakarta',
    jenjang: 'S1',
    klaster: 'KLASTER: TEKNOLOGI',
    akreditasi: 'UNGGUL',
    tingkatKeketatan: 'Diterima SNBP 2025: 3,7%',
    category: 'SAINTEK',
  },
  {
    id: '2',
    slug: 'ilmu-komputer',
    name: 'Ilmu Komputer',
    campus: 'Universitas Gadjah Mada',
    location: 'D.I. Yogyakarta',
    jenjang: 'S1',
    klaster: 'KLASTER: TEKNOLOGI',
    akreditasi: 'UNGGUL',
    tingkatKeketatan: 'Diterima SNBP 2025: 4,0%',
    category: 'SAINTEK',
  },
  {
    id: '3',
    slug: 'pendidikan-teknik-informatika',
    name: 'Pend. Teknik Informatika',
    campus: 'Universitas Negeri Yogyakarta',
    location: 'D.I. Yogyakarta',
    jenjang: 'S1',
    klaster: 'KLASTER: TEKNOLOGI',
    akreditasi: 'UNGGUL',
    tingkatKeketatan: 'Diterima SNBP 2025: 3,6%',
    category: 'SAINTEK',
  },
  {
    id: '4',
    slug: 'sistem-informasi',
    name: 'Sistem Informasi',
    campus: 'UPN "Veteran" Yogyakarta',
    location: 'D.I. Yogyakarta',
    jenjang: 'S1',
    klaster: 'KLASTER: TEKNOLOGI',
    akreditasi: 'A',
    tingkatKeketatan: 'Diterima SNBP 2025: 8,1%',
    category: 'SAINTEK',
  },
  {
    id: '5',
    slug: 'desain-komunikasi-visual',
    name: 'Desain Komunikasi Visual',
    campus: 'ISI Yogyakarta',
    location: 'D.I. Yogyakarta',
    jenjang: 'S1',
    klaster: 'KLASTER: SENI & DESAIN',
    akreditasi: 'A',
    tingkatKeketatan: 'Diterima SNBP 2025: 6,8%',
    category: 'SOSHUM',
  },
  {
    id: '6',
    slug: 'teknik-informatika-polban',
    name: 'Teknik Informatika',
    campus: 'Politeknik Negeri Bandung',
    location: 'Jawa Barat',
    jenjang: 'D4',
    klaster: 'KLASTER: TEKNOLOGI',
    akreditasi: 'UNGGUL',
    tingkatKeketatan: 'Diterima SNBP 2025: 3,5%',
    category: 'SAINTEK',
  },
];

export default function KatalogPage() {
  const router = useRouter();
  const { savedList, setAktif } = usePreferensiStorage();
  const [activeTab, setActiveTab] = useState<'SEMUA' | 'SAINTEK' | 'SOSHUM'>('SEMUA');
  const [activeJenjang, setActiveJenjang] = useState<string>('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKlaster, setSelectedKlaster] = useState<string | null>('TEKNOLOGI');

  const filtered = MAJOR_DATA.filter((m) => {
    const matchCategory =
      activeTab === 'SEMUA' || m.category === activeTab;
    const matchJenjang =
      activeJenjang === 'SEMUA' || m.jenjang === activeJenjang;
    const matchKlaster =
      !selectedKlaster || m.klaster.includes(selectedKlaster);
    const matchSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.campus.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchJenjang && matchKlaster && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex justify-center">
      <div className="w-full max-w-[402px] bg-white border-x-2 border-black flex flex-col min-h-screen font-['Outfit',sans-serif]">
        {/* 1. Top Bar M17 */}
        <TopBar title="Simulasi" onBack={() => router.push('/cocokin')} />

        {/* Subheader: Preferensi Aktif Container (M17) */}
        <div className="p-3 bg-[#F7F5F0] border-b border-gray-200">
          <PemilihPreferensi
            preferensiList={savedList}
            onPilih={setAktif}
          />
        </div>

        <main className="w-full px-4 pt-5 pb-16 flex flex-col flex-1">
          {/* 2. Tag */}
          <div className="mb-2">
            <span className="font-['Press_Start_2P',monospace] text-[8px] text-[#277EFD] tracking-wider uppercase">
              TEST DRIVE JURUSAN
            </span>
          </div>

          {/* 3. Heading Persis Figma M17 */}
          <h1 className="font-['Press_Start_2P',monospace] text-sm sm:text-base leading-relaxed text-[#151D21] mb-4">
            5.150 prodi dari 146 PTN
          </h1>

          {/* 4. Search Box */}
          <div className="w-full h-11 border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] bg-white px-3 flex items-center gap-2.5 mb-3">
            <Icon name="search" className="w-4 h-4 text-[#151D21] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Cari prodi/kampus · coba "TI", "DKV", "POLBAN"'
              className="w-full text-xs text-[#151D21] placeholder:text-gray-400 focus:outline-none bg-transparent font-['Plus_Jakarta_Sans',sans-serif]"
            />
          </div>

          {/* 5. Segmented Tabs (SEMUA 5.150 | SAINTEK 2.952 | SOSHUM 2.198) */}
          <div className="w-full border-2 border-[#151D21] bg-white flex overflow-hidden mb-3">
            {[
              { id: 'SEMUA', label: 'SEMUA', count: '5.150' },
              { id: 'SAINTEK', label: 'SAINTEK', count: '2.952' },
              { id: 'SOSHUM', label: 'SOSHUM', count: '2.198' },
            ].map((tab, idx) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as 'SEMUA' | 'SAINTEK' | 'SOSHUM')}
                className={`flex-1 py-2 text-center flex flex-col items-center justify-center transition-colors cursor-pointer ${
                  idx < 2 ? 'border-r-2 border-[#151D21]' : ''
                } ${
                  activeTab === tab.id
                    ? 'bg-[#277EFD] text-white'
                    : 'bg-white text-[#151D21] hover:bg-gray-50'
                }`}
              >
                <span className="font-['Press_Start_2P',monospace] text-[8px] font-bold">
                  {tab.label}
                </span>
                <span className="text-[10px] opacity-80 mt-0.5">{tab.count}</span>
              </button>
            ))}
          </div>

          {/* 6. Jenjang Filter Chips (Persis Figma M17) */}
          <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
            {[
              { id: 'SEMUA', label: 'Semua Jenjang' },
              { id: 'S1', label: 'S1 · 3.823' },
              { id: 'D4', label: 'D4 · 787' },
              { id: 'D3', label: 'D3 · 540' },
            ].map((chip) => {
              const isSelected = activeJenjang === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setActiveJenjang(chip.id)}
                  className={`px-3 py-1 font-['Pixelify_Sans',sans-serif] text-[12px] font-medium shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#151D21] text-white shadow-[2px_2px_0px_#151D21]'
                      : 'bg-[#EAF2FF] text-[#1A5FD1] hover:bg-blue-100'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* 7. Active Klaster Filter + Filter Button (Persis Figma M17) */}
          <div className="flex items-center justify-between gap-2 mb-4">
            {selectedKlaster ? (
              <button
                type="button"
                onClick={() => setSelectedKlaster(null)}
                className="px-2.5 py-1 bg-[#FFF6D6] border border-[#151D21] font-['Pixelify_Sans',sans-serif] text-[12px] font-medium text-[#151D21] flex items-center gap-1 cursor-pointer hover:bg-yellow-100"
              >
                <span>KLASTER: {selectedKlaster} ×</span>
              </button>
            ) : (
              <span />
            )}

            <button
              type="button"
              onClick={() => setSelectedKlaster(selectedKlaster ? null : 'TEKNOLOGI')}
              className="flex items-center gap-1.5 font-['Pixelify_Sans',sans-serif] text-[12px] font-medium text-[#151D21] cursor-pointer hover:underline ml-auto"
            >
              <Icon name="filter" className="w-3.5 h-3.5 text-[#151D21]" />
              <span>FILTER (3)</span>
            </button>
          </div>

          {/* 8. Header List (Persis Figma M17) */}
          <div className="mb-3">
            <span className="font-['Pixelify_Sans',sans-serif] text-[12px] font-medium text-[#151D21] uppercase tracking-wider block">
              {filtered.length} PRODI · URUT DARI KECOCOKAN
            </span>
          </div>

          {/* 9. Prodi Cards List (Persis Figma M17: node 180:1706) */}
          <div className="flex flex-col gap-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-white border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] flex flex-col gap-2.5"
              >
                <div>
                  <h3 className="font-['Pixelify_Sans',sans-serif] text-[16px] font-semibold text-[#151D21] leading-tight">
                    {item.name}
                  </h3>
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#6B7680] mt-0.5">
                    {item.campus} · {item.location}
                  </p>
                </div>

                {/* Badges: Jenjang + Klaster + Akreditasi */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-[#151D21] text-white font-['Pixelify_Sans',sans-serif] text-[11px] font-medium">
                    {item.jenjang}
                  </span>
                  <span className="px-2 py-0.5 bg-[#EAF2FF] text-[#1A5FD1] font-['Pixelify_Sans',sans-serif] text-[11px] font-medium">
                    {item.klaster}
                  </span>
                  <span
                    className={`px-2 py-0.5 font-['Pixelify_Sans',sans-serif] text-[11px] font-medium border ${
                      item.akreditasi === 'UNGGUL'
                        ? 'bg-[#E6F6EC] text-[#22A94F] border-[#22A94F]'
                        : 'bg-[#FFF6D6] text-[#8F6600] border-[#8F6600]'
                    }`}
                  >
                    {item.akreditasi}
                  </span>
                </div>

                {/* Bottom Row: Keketatan + Button SIMULASI */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#3A444B]">
                    {item.tingkatKeketatan}
                  </span>
                  <Link
                    href={`/test-drive/${item.slug}`}
                    className="px-3 py-1.5 bg-[#277EFD] hover:bg-[#1E6FD9] text-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] font-['Press_Start_2P',monospace] text-[10px] flex items-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    <span>SIMULASI</span>
                    <Icon name="arrow-right" className="w-3 h-3 text-white" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
