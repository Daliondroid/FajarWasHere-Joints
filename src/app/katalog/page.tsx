'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ProdiItem {
  id: string;
  slug: string;
  name: string;
  category: 'IPA' | 'IPS';
  totalPeminat?: number;
}

export default function KatalogPage() {
  const [selectedFilter, setSelectedFilter] = useState<'IPA' | 'IPS'>('IPA');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const sampleProdi: ProdiItem[] = [
    { id: '1', slug: 'informatika', name: 'Informatika', category: 'IPA' },
    { id: '2', slug: 'sistem-informasi', name: 'Sistem Informasi', category: 'IPA' },
    { id: '3', slug: 'kedokteran', name: 'Kedokteran', category: 'IPA' },
    { id: '4', slug: 'teknik-elektro', name: 'Teknik Elektro', category: 'IPA' },
    { id: '5', slug: 'farmasi', name: 'Farmasi', category: 'IPA' },
    { id: '6', slug: 'teknik-sipil', name: 'Teknik Sipil', category: 'IPA' },
    { id: '7', slug: 'ilmu-komputer', name: 'Ilmu Komputer', category: 'IPA' },
    { id: '8', slug: 'teknik-industri', name: 'Teknik Industri', category: 'IPA' },
    { id: '9', slug: 'statistika', name: 'Statistika', category: 'IPA' },
    { id: '10', slug: 'hukum', name: 'Ilmu Hukum', category: 'IPS' },
    { id: '11', slug: 'manajemen', name: 'Manajemen', category: 'IPS' },
    { id: '12', slug: 'akuntansi', name: 'Akuntansi', category: 'IPS' },
    { id: '13', slug: 'ilmu-komunikasi', name: 'Ilmu Komunikasi', category: 'IPS' },
    { id: '14', slug: 'psikologi', name: 'Psikologi', category: 'IPS' },
    { id: '15', slug: 'hubungan-internasional', name: 'Hubungan Internasional', category: 'IPS' },
  ];

  const filtered = sampleProdi.filter((p) => {
    const matchCategory = p.category === selectedFilter;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-white text-black font-['Outfit',sans-serif]">
      <div className="w-full max-w-[402px] mx-auto px-4 pt-5 pb-16 flex flex-col min-h-screen border-x border-gray-100">
        {/* Top Header */}
        <header className="flex items-center justify-between pb-3">
          {/* Back Button */}
          <Link
            href="/cocokin"
            aria-label="Kembali ke Cocokin"
            className="p-1 hover:bg-gray-100 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-black"
            >
              <path
                d="M15 19L8 12L15 5"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="square"
              />
            </svg>
          </Link>

          {/* Title */}
          <h1 className="font-['Press_Start_2P',monospace] text-[15px] font-bold text-black tracking-wide">
            Simulation
          </h1>

          {/* Search Toggle Icon */}
          <button
            type="button"
            aria-label="Cari Jurusan"
            onClick={() => setIsSearchOpen((prev) => !prev)}
            className="p-1 hover:bg-gray-100 transition-colors"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-black"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="3" />
              <path d="M16.5 16.5L21.5 21.5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="square" />
            </svg>
          </button>
        </header>

        {/* Optional Search Bar Input */}
        {isSearchOpen && (
          <div className="mt-2 mb-3 animate-in fade-in duration-100">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik nama prodi..."
              autoFocus
              className="w-full border-[2px] border-black p-2.5 text-xs font-['Outfit',sans-serif] outline-none shadow-[2px_2px_0px_#000]"
            />
          </div>
        )}

        {/* Filter Jurusan Section */}
        <div className="mt-3">
          <p className="font-['Outfit',sans-serif] text-[13px] font-medium text-black mb-2">
            Filter Jurusan
          </p>

          <div className="grid grid-cols-2 gap-3">
            {/* IPA Button */}
            <button
              type="button"
              onClick={() => setSelectedFilter('IPA')}
              className={`py-2 px-4 border-[2px] border-black text-center font-['Press_Start_2P',monospace] text-xs transition-transform active:translate-y-0.5 ${
                selectedFilter === 'IPA'
                  ? 'bg-white shadow-[3px_3px_0px_#000] border-[3px]'
                  : 'bg-gray-50 opacity-70'
              }`}
            >
              IPA
            </button>

            {/* IPS Button */}
            <button
              type="button"
              onClick={() => setSelectedFilter('IPS')}
              className={`py-2 px-4 border-[2px] border-black text-center font-['Press_Start_2P',monospace] text-xs transition-transform active:translate-y-0.5 ${
                selectedFilter === 'IPS'
                  ? 'bg-white shadow-[3px_3px_0px_#000] border-[3px]'
                  : 'bg-gray-50 opacity-70'
              }`}
            >
              IPS
            </button>
          </div>
        </div>

        {/* Daftar Jurusan List */}
        <div className="mt-6 flex-1 flex flex-col">
          <h2 className="font-['Outfit',sans-serif] text-[13px] font-semibold text-black mb-3">
            Daftar Jurusan (5140)
          </h2>

          <div className="flex flex-col gap-3">
            {filtered.map((prodi) => (
              <Link
                key={prodi.id}
                href={`/test-drive/${prodi.slug}`}
                className="w-full h-[54px] bg-[#4285F4] hover:bg-[#3367D6] border-[3px] border-black shadow-[4px_4px_0px_#000] flex items-center px-4 active:translate-y-0.5 transition-all"
              >
                <span className="font-['Press_Start_2P',monospace] text-[12px] font-bold text-white tracking-wide truncate">
                  {prodi.name}
                </span>
              </Link>
            ))}

            {filtered.length === 0 && (
              <p className="text-center text-xs text-gray-500 py-8">
                Tidak ada jurusan yang cocok dengan pencarian.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
