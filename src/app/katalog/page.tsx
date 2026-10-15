'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/ui/TopBar';
import { Icon } from '@/components/ui/Icon';

interface MajorItem {
  id: string;
  slug: string;
  name: string;
  category: 'SAINTEK' | 'SOSHUM';
  info: string;
}

const MAJOR_DATA: MajorItem[] = [
  {
    id: '1',
    slug: 'informatika',
    name: 'Informatika',
    category: 'SAINTEK',
    info: 'Saintek · 112 kampus · Cocok 92%',
  },
  {
    id: '2',
    slug: 'kedokteran',
    name: 'Kedokteran',
    category: 'SAINTEK',
    info: 'Saintek · 92 kampus',
  },
  {
    id: '3',
    slug: 'farmasi',
    name: 'Farmasi',
    category: 'SAINTEK',
    info: 'Saintek · 74 kampus',
  },
  {
    id: '4',
    slug: 'statistika',
    name: 'Statistika',
    category: 'SAINTEK',
    info: 'Saintek · 48 kampus',
  },
  {
    id: '5',
    slug: 'teknik-sipil',
    name: 'Teknik Sipil',
    category: 'SAINTEK',
    info: 'Saintek · 101 kampus',
  },
  {
    id: '6',
    slug: 'arsitektur',
    name: 'Arsitektur',
    category: 'SAINTEK',
    info: 'Saintek · 63 kampus',
  },
  {
    id: '7',
    slug: 'biologi',
    name: 'Biologi',
    category: 'SAINTEK',
    info: 'Saintek · 88 kampus',
  },
  {
    id: '8',
    slug: 'ilmu-hukum',
    name: 'Ilmu Hukum',
    category: 'SOSHUM',
    info: 'Soshum · 140 kampus',
  },
  {
    id: '9',
    slug: 'manajemen',
    name: 'Manajemen',
    category: 'SOSHUM',
    info: 'Soshum · 185 kampus',
  },
  {
    id: '10',
    slug: 'psikologi',
    name: 'Psikologi',
    category: 'SOSHUM',
    info: 'Soshum · 95 kampus',
  },
];

export default function KatalogPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'SEMUA' | 'SAINTEK' | 'SOSHUM'>('SAINTEK');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = MAJOR_DATA.filter((m) => {
    const matchCategory =
      activeTab === 'SEMUA' || m.category === activeTab;
    const matchSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.info.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-['Outfit',sans-serif]">
      {/* 1. Top Bar */}
      <TopBar title="Simulasi" onBack={() => router.push('/cocokin')} />

      <main className="w-full max-w-[402px] mx-auto px-4 pt-6 pb-16 flex flex-col flex-1">
        {/* 2. Tag */}
        <div className="mb-2">
          <span className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px] text-[#277EFD] tracking-wider uppercase">
            TEST DRIVE JURUSAN
          </span>
        </div>

        {/* 3. Heading & Subtitle */}
        <h1 className="font-['Press_Start_2P',monospace] text-[16px] sm:text-[18px] leading-[1.6] font-bold text-black">
          Rasakan dulu, baru putuskan
        </h1>
        <p className="text-xs text-[#4B5563] leading-relaxed mt-2 mb-5">
          Coba studi kasus real untuk merasakan cara berpikir di tiap jurusan.
        </p>

        {/* 4. Search Box with Search Icon */}
        <div className="w-full h-11 border-2 border-black shadow-[3px_3px_0px_#000] bg-white px-3 flex items-center gap-2.5 mb-4">
          <Icon name="search" className="w-5 h-5 text-black shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari jurusan, mis. Farmasi"
            className="w-full text-xs text-black placeholder:text-gray-400 focus:outline-none bg-transparent"
          />
        </div>

        {/* 5. Segmented Control (SEMUA | SAINTEK | SOSHUM) */}
        <div className="w-full border-2 border-black bg-white flex overflow-hidden mb-5">
          {(['SEMUA', 'SAINTEK', 'SOSHUM'] as const).map((tab, idx) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-center font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px] font-bold transition-colors ${
                idx < 2 ? 'border-r-2 border-black' : ''
              } ${
                activeTab === tab
                  ? 'bg-[#277EFD] text-white'
                  : 'bg-white text-black hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 6. List Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-['Press_Start_2P',monospace] text-[9px] text-[#6B7280] tracking-wider uppercase">
            DAFTAR JURUSAN
          </span>
          <span className="text-xs font-semibold text-black">
            2.318 hasil
          </span>
        </div>

        {/* 7. Major List Items (List/Major) */}
        <div className="flex flex-col gap-2.5">
          {filtered.map((major) => (
            <Link
              key={major.id}
              href={`/test-drive/${major.slug}`}
              className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between hover:bg-gray-50 active:translate-y-0.5 transition-transform"
            >
              <div className="flex items-center gap-3">
                {/* Light blue square with blue plus */}
                <div className="w-9 h-9 border border-[#277EFD] bg-[#EEF5FF] flex items-center justify-center shrink-0">
                  <Icon name="plus" className="w-4 h-4 text-[#277EFD]" />
                </div>

                <div className="flex flex-col">
                  <h3 className="font-['Press_Start_2P',monospace] text-xs font-bold text-black leading-snug">
                    {major.name}
                  </h3>
                  <span className="text-[11px] text-[#6B7280] mt-0.5">
                    {major.info}
                  </span>
                </div>
              </div>

              <Icon name="chevron-right" className="w-4 h-4 text-black shrink-0" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
