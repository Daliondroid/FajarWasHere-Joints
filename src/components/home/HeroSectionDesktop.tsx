'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Icon } from '@/components/ui/Icon';
import LoginModal from '@/components/auth/LoginModal';
import Footer from '@/components/Footer';

export default function HeroSectionDesktop() {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const scrollToCaraKerja = () => {
    const el = document.getElementById('cara-kerja-desktop');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col bg-white">
      {/* ── 1. HERO SECTION (1440x920, Figma D01/D03 node 184:1919 & 184:2164) ── */}
      <section className="relative w-full min-h-[840px] flex flex-col justify-between overflow-hidden bg-[#FDFBF7] border-b-2 border-black pt-12 pb-8">
        {/* Background Panorama Kampus */}
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply flex items-center justify-end">
          <Image
            src="/assets/hero-ugm.png"
            alt="Kampus Background"
            width={1200}
            height={700}
            priority
            className="w-auto h-full max-h-[800px] object-cover object-right-bottom"
          />
        </div>

        {/* Bottom Fade Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none" />

        {/* Hero Content (Container 1200px) */}
        <div className="relative z-10 max-w-[1200px] w-full mx-auto px-6 flex flex-col items-start pt-8">
          {/* Tagline Badge */}
          <div className="mb-6 inline-flex items-center px-4 py-1.5 border-2 border-[#277EFD] bg-white shadow-[2px_2px_0px_#151D21]">
            <span className="font-['Press_Start_2P',monospace] text-[10px] text-[#277EFD] tracking-wider uppercase font-bold">
              5.150 PRODI · 146 PTN · SNBP &amp; SNBT
            </span>
          </div>

          {/* Headline with Badges */}
          <div className="max-w-[840px] mb-6 flex flex-col items-start">
            <h1 className="font-['Press_Start_2P',monospace] text-[28px] xl:text-[32px] leading-[1.8] text-[#151D21]">
              Temukan jurusan yang{' '}
              <span className="inline-block px-3.5 py-1 bg-[#277EFD] text-white border-3 border-black shadow-[4px_4px_0px_#000000] align-middle">
                cocok
              </span>{' '}
              &amp; tembus kampus{' '}
              <span className="inline-block px-3.5 py-1 bg-[#FEBD01] text-[#151D21] border-3 border-black shadow-[4px_4px_0px_#000000] align-middle">
                impian
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="max-w-[580px] text-[16px] leading-relaxed text-[#3A444B] font-['Plus_Jakarta_Sans',sans-serif] mb-8">
            Uji rasa kuliahmu lewat studi kasus singkat, cocokkan minat, dan hitung peluang tembus PTN lewat data resmi SNPMB &amp; PDDikti.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-5 mb-12">
            {isAuthenticated ? (
              <Link
                href="/cocokin"
                className="px-6 py-3.5 bg-[#277EFD] hover:bg-[#1A5FD1] text-white border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-xs flex items-center gap-2.5 transition-all cursor-pointer"
              >
                <span>LIHAT REKOMENDASI</span>
                <Icon name="arrow-right" className="w-4 h-4 text-white" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="px-6 py-3.5 bg-[#277EFD] hover:bg-[#1A5FD1] text-white border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-xs flex items-center gap-2.5 transition-all cursor-pointer"
              >
                <span>MULAI SEKARANG</span>
                <Icon name="arrow-right" className="w-4 h-4 text-white" />
              </button>
            )}

            <Link
              href="/katalog"
              className="px-6 py-3.5 bg-white hover:bg-gray-50 text-[#151D21] border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-xs flex items-center gap-2.5 transition-all cursor-pointer"
            >
              <span>JELAJAHI SIMULASI</span>
            </Link>
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="relative z-10 max-w-[1200px] w-full mx-auto px-6 flex justify-start">
          <button
            type="button"
            onClick={scrollToCaraKerja}
            className="flex items-center gap-2 text-xs font-['Pixelify_Sans',sans-serif] font-semibold text-[#6B7680] hover:text-[#151D21] transition-colors cursor-pointer"
          >
            <Icon name="chevron-down" className="w-4 h-4" />
            <span>Jelajahi alur</span>
          </button>
        </div>
      </section>

      {/* ── 2. STATISTIK SECTION (1440x127, Figma D01 node 184:1919) ── */}
      <section className="w-full bg-[#FFFFFF] border-b-2 border-black py-8">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-4 gap-6">
          <div className="flex flex-col items-start p-4 bg-[#F7F5F0] border-2 border-black shadow-[3px_3px_0px_#000]">
            <span className="font-['Pixelify_Sans',sans-serif] text-[36px] font-bold text-[#277EFD] leading-none mb-2">
              5.150
            </span>
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#6B7680] font-medium">
              Program studi (snpmb.id)
            </span>
          </div>

          <div className="flex flex-col items-start p-4 bg-[#F7F5F0] border-2 border-black shadow-[3px_3px_0px_#000]">
            <span className="font-['Pixelify_Sans',sans-serif] text-[36px] font-bold text-[#F1402E] leading-none mb-2">
              146
            </span>
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#6B7680] font-medium">
              PTN · akademik, politeknik, PTKIN
            </span>
          </div>

          <div className="flex flex-col items-start p-4 bg-[#F7F5F0] border-2 border-black shadow-[3px_3px_0px_#000]">
            <span className="font-['Pixelify_Sans',sans-serif] text-[36px] font-bold text-[#22A94F] leading-none mb-2">
              1 soal
            </span>
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#6B7680] font-medium">
              Studi kasus per prodi
            </span>
          </div>

          <div className="flex flex-col items-start p-4 bg-[#F7F5F0] border-2 border-black shadow-[3px_3px_0px_#000]">
            <span className="font-['Pixelify_Sans',sans-serif] text-[36px] font-bold text-[#FEBD01] leading-none mb-2">
              30
            </span>
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#6B7680] font-medium">
              Kegiatan kuis minat RIASEC
            </span>
          </div>
        </div>
      </section>

      {/* ── 3. CARA KERJA SECTION (1440x422, Figma D01 node 184:1919) ── */}
      <section id="cara-kerja-desktop" className="w-full bg-[#FFFFFF] border-b-2 border-black py-16">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col items-start">
          <div className="mb-2 inline-flex items-center px-3 py-1 bg-[#EEF5FF] border border-[#277EFD]">
            <span className="font-['Press_Start_2P',monospace] text-[9px] text-[#277EFD] tracking-wider uppercase font-bold">
              CARA KERJA
            </span>
          </div>
          <h2 className="font-['Press_Start_2P',monospace] text-[20px] text-[#151D21] mb-10 leading-snug">
            3 langkah menuju jurusan yang pas
          </h2>

          <div className="w-full grid grid-cols-3 gap-6">
            {/* Langkah 01 */}
            <div className="bg-[#FFFDF7] border-2 border-black shadow-[4px_4px_0px_#000] p-6 flex flex-col gap-3">
              <div className="w-12 h-12 bg-[#FEBD01] border-2 border-black flex items-center justify-center font-['Press_Start_2P',monospace] text-sm font-bold text-[#151D21] shadow-[2px_2px_0px_#000]">
                01
              </div>
              <h3 className="font-['Pixelify_Sans',sans-serif] text-[18px] font-bold text-[#151D21] mt-2">
                Isi kuis minat
              </h3>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#6B7680] leading-relaxed">
                30 kegiatan singkat (RIASEC) menentukan kode Holland-mu secara objektif.
              </p>
            </div>

            {/* Langkah 02 */}
            <div className="bg-[#FFFDF7] border-2 border-black shadow-[4px_4px_0px_#000] p-6 flex flex-col gap-3">
              <div className="w-12 h-12 bg-[#277EFD] border-2 border-black flex items-center justify-center font-['Press_Start_2P',monospace] text-sm font-bold text-white shadow-[2px_2px_0px_#000]">
                02
              </div>
              <h3 className="font-['Pixelify_Sans',sans-serif] text-[18px] font-bold text-[#151D21] mt-2">
                Lengkapi data jalurmu
              </h3>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#6B7680] leading-relaxed">
                SNBP: NPSN, rapor &amp; TKA. SNBT: nilai try out 7 subtes UTBK terverifikasi.
              </p>
            </div>

            {/* Langkah 03 */}
            <div className="bg-[#FFFDF7] border-2 border-black shadow-[4px_4px_0px_#000] p-6 flex flex-col gap-3">
              <div className="w-12 h-12 bg-[#22A94F] border-2 border-black flex items-center justify-center font-['Press_Start_2P',monospace] text-sm font-bold text-white shadow-[2px_2px_0px_#000]">
                03
              </div>
              <h3 className="font-['Pixelify_Sans',sans-serif] text-[18px] font-bold text-[#151D21] mt-2">
                Lihat peluang &amp; Simulasi
              </h3>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#6B7680] leading-relaxed">
                Kecocokan, peluang per kampus berlabel estimasi resmi, lalu cicipi studi kasus kuliahnya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. PREFERENSI CTA SECTION (1440x600, Figma D01 node 184:1919) ── */}
      <section className="w-full bg-[#F7F5F0] border-b-2 border-black py-16">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-12 gap-12 items-center">
          {/* Ilustrasi Siswa Pixel & Stars (Kolom 1: 5 kolom) */}
          <div className="col-span-5 relative flex items-center justify-center">
            <div className="relative w-[300px] h-[400px]">
              <Image
                src="/assets/student-girl-pixel.png"
                alt="Siswa SMA Pixel"
                width={290}
                height={435}
                className="w-full h-full object-contain image-pixelated"
              />
              {/* Star Decors */}
              <div className="absolute -top-4 -left-4 w-7 h-7 bg-[#FEBD01] border-2 border-black rotate-12 shadow-[2px_2px_0px_#000]" />
              <div className="absolute top-1/4 -right-4 w-8 h-8 bg-[#277EFD] border-2 border-black -rotate-6 shadow-[2px_2px_0px_#000]" />
              <div className="absolute -bottom-3 right-8 w-6 h-6 bg-[#22A94F] border-2 border-black rotate-45 shadow-[2px_2px_0px_#000]" />
            </div>
          </div>

          {/* Teks CTA & Button (Kolom 2: 7 kolom) */}
          <div className="col-span-7 flex flex-col items-start">
            <h2 className="font-['Press_Start_2P',monospace] text-[22px] xl:text-[24px] text-[#151D21] leading-relaxed mb-6">
              Isi preferensi dulu yuu, biar ramalan Cocokin! makin akurat!
            </h2>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[16px] text-[#3A444B] leading-relaxed mb-8 max-w-[620px]">
              Kuis minat ±3 menit + data jalur SNBP/SNBT. Kamu bisa menyimpan beberapa preferensi sekaligus dan memilih mana yang aktif.
            </p>
            <Link
              href="/preferensi"
              className="px-8 py-4 bg-[#277EFD] hover:bg-[#1A5FD1] text-white border-2 border-black shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] font-['Press_Start_2P',monospace] text-xs flex items-center gap-3 transition-all cursor-pointer"
            >
              <span>MULAI SEKARANG</span>
              <Icon name="arrow-right" className="w-4 h-4 text-white" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. DESKTOP FOOTER ── */}
      <Footer />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
