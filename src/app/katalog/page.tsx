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
  campus: string;
  location: string;
  jenjang: 'S1' | 'D4' | 'D3';
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
    akreditasi: 'UNGGUL',
    tingkatKeketatan: 'Diterima SNBP 2025: 3,7%',
    category: 'SAINTEK',
  },
  {
    id: '2',
    slug: 'ilmu-komputer',
    name: 'Ilmu Komputer',
    campus: 'Universitas Negeri Yogyakarta',
    location: 'D.I. Yogyakarta',
    jenjang: 'S1',
    akreditasi: 'UNGGUL',
    tingkatKeketatan: 'Diterima SNBP 2025: 4,1%',
    category: 'SAINTEK',
  },
  {
    id: '3',
    slug: 'sistem-informasi',
    name: 'Sistem Informasi',
    campus: 'UPN "Veteran" Yogyakarta',
    location: 'D.I. Yogyakarta',
    jenjang: 'S1',
    akreditasi: 'A',
    tingkatKeketatan: 'Diterima SNBP 2025: 5,2%',
    category: 'SAINTEK',
  },
  {
    id: '4',
    slug: 'desain-komunikasi-visual',
    name: 'Desain Komunikasi Visual',
    campus: 'ISI Yogyakarta',
    location: 'D.I. Yogyakarta',
    jenjang: 'S1',
    akreditasi: 'A',
    tingkatKeketatan: 'Diterima SNBP 2025: 6,8%',
    category: 'SOSHUM',
  },
  {
    id: '5',
    slug: 'teknik-informatika-polban',
    name: 'Teknik Informatika',
    campus: 'Politeknik Negeri Bandung',
    location: 'Jawa Barat',
    jenjang: 'D4',
    akreditasi: 'UNGGUL',
    tingkatKeketatan: 'Diterima SNBP 2025: 3,5%',
    category: 'SAINTEK',
  },
];

export default function KatalogPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'SEMUA' | 'SAINTEK' | 'SOSHUM'>('SEMUA');
  const [activeJenjang, setActiveJenjang] = useState<string>('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = MAJOR_DATA.filter((m) => {
    const matchCategory =
      activeTab === 'SEMUA' || m.category === activeTab;
    const matchJenjang =
      activeJenjang === 'SEMUA' || m.jenjang === activeJenjang;
    const matchSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.campus.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchJenjang && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex justify-center">
      <div className="w-full max-w-[402px] bg-white border-x-2 border-black flex flex-col min-h-screen font-['Outfit',sans-serif]">
        {/* 1. Top Bar */}
        <TopBar title="Simulasi" onBack={() => router.push('/cocokin')} />

        {/* Subheader Banner: PREFERENSI AKTIF · SNBP (M17) */}
        <div className="px-4 py-2 bg-[#F9F8F6] border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-['Press_Start_2P',monospace] text-[7px] text-[#277EFD] tracking-wider uppercase">
              PREFERENSI AKTIF · SNBP
            </span>
            <span className="font-bold text-xs text-[#151D21]">
              Informatika Impian
            </span>
          </div>
          <Link
            href="/preferensi"
            className="text-[11px] text-[#277EFD] font-bold hover:underline"
          >
            Ubah
          </Link>
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
          <div className="w-full h-11 border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] bg-white px-3 flex items-center gap-2.5 mb-4">
            <Icon name="search" className="w-4 h-4 text-[#151D21] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Cari prodi/kampus · coba "TI", "DKV", "POLBAN"'
              className="w-full text-xs text-[#151D21] placeholder:text-gray-400 focus:outline-none bg-transparent"
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

          {/* 6. Jenjang Filter Chips */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
            {[
              { id: 'SEMUA', label: 'Semua Jenjang' },
              { id: 'S1', label: 'S1 · 3.823' },
              { id: 'D4', label: 'D4 · 787' },
              { id: 'D3', label: 'D3 · 540' },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setActiveJenjang(chip.id)}
                className={`px-2.5 py-1 text-[11px] font-medium border border-[#151D21] shrink-0 transition-all cursor-pointer ${
                  activeJenjang === chip.id
                    ? 'bg-[#FEBD01] text-[#151D21] font-bold shadow-[1px_1px_0px_#151D21]'
                    : 'bg-white text-[#151D21] hover:bg-gray-50'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* 7. Subheader Result Count */}
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-200">
            <span className="font-['Press_Start_2P',monospace] text-[8px] text-[#6B7680] tracking-wider uppercase">
              {filtered.length} PRODI · URUT DARI KECOCOKAN
            </span>
          </div>

          {/* 8. Prodi Cards List */}
          <div className="flex flex-col gap-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-white border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] flex flex-col gap-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#151D21]">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#6B7680]">
                      {item.campus} · {item.location}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-[#EEF5FF] border border-[#277EFD] text-[#277EFD] font-bold text-[10px]">
                    {item.jenjang}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap text-[11px]">
                  <span className="px-1.5 py-0.5 bg-[#EAF7EE] text-[#22A94F] border border-[#22A94F] font-bold">
                    {item.akreditasi}
                  </span>
                  <span className="text-[#6B7680]">{item.tingkatKeketatan}</span>
                </div>

                <div className="pt-2 border-t border-gray-100 flex justify-end">
                  <Link
                    href={`/test-drive/${item.slug}`}
                    className="px-3 py-1.5 bg-[#22A94F] hover:bg-[#1E9646] text-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] font-['Press_Start_2P',monospace] text-[8px] active:translate-x-[1px]"
                  >
                    SIMULASI
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
