'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export default function HeroSection() {
  const scrollToCaraKerja = () => {
    const el = document.getElementById('cara-kerja');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-[402px] mx-auto flex flex-col items-center px-4 pt-6 pb-12">
      {/* 1. Tagline Pill */}
      <div className="mb-4 inline-flex items-center px-3 py-1 border-[2px] border-[#277EFD] bg-white">
        <span className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px] text-[#277EFD] tracking-wider uppercase">
          5.000+ PRODI · SNBP & SNBT
        </span>
      </div>

      {/* 2. Headline with Badges */}
      <div className="flex flex-col items-center text-center mb-3">
        <h1 className="font-['Press_Start_2P',monospace] text-[17px] sm:text-[19px] leading-[1.6] text-black">
          Temukan jurusan
        </h1>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="font-['Press_Start_2P',monospace] text-[17px] sm:text-[19px] text-black">
            yang
          </span>
          <span className="pixel-badge-blue text-[15px] sm:text-[17px]">
            cocok
          </span>
          <span className="font-['Press_Start_2P',monospace] text-[17px] sm:text-[19px] text-black">
            &
          </span>
        </div>
        <div className="font-['Press_Start_2P',monospace] text-[17px] sm:text-[19px] leading-[1.6] text-black mt-2">
          tembus kampus
        </div>
        <div className="mt-2.5">
          <span className="pixel-badge-yellow text-[15px] sm:text-[17px]">
            impian
          </span>
        </div>
      </div>

      {/* 3. Subtitle */}
      <p className="text-center text-[13px] leading-relaxed text-[#4B5563] mt-3 mb-6 max-w-[340px]">
        Cocokkan minatmu dengan 5.000+ prodi se-Indonesia, rasakan studi kasusnya, dan ketahui peluang masuk PTN-mu.
      </p>

      {/* 4. Action Buttons */}
      <div className="w-full flex flex-col gap-3 max-w-[340px] mb-6">
        <Link
          href="/preferensi"
          className="w-full pixel-btn-blue py-3.5 text-center text-xs tracking-wider"
        >
          <span>MULAI SEKARANG</span>
          <Icon name="arrow-right" className="w-4 h-4 text-white" />
        </Link>
        <button
          type="button"
          onClick={scrollToCaraKerja}
          className="w-full pixel-btn-white py-3.5 text-center text-xs tracking-wider"
        >
          LIHAT CARA KERJA
        </button>
      </div>

      {/* 5. Campus Illustration */}
      <div className="w-full relative flex flex-col items-center">
        <div className="w-full h-[280px] sm:h-[320px] relative overflow-hidden flex items-end justify-center">
          <Image
            src="/assets/hero-campus.png"
            alt="Kampus Impian Pixel"
            width={402}
            height={600}
            priority
            className="w-full object-cover object-bottom"
          />
        </div>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center justify-center pt-3 pb-6">
          <Icon name="chevron-down" className="w-5 h-5 text-black animate-bounce mb-1" />
          <p className="font-['Press_Start_2P',monospace] text-[9px] text-[#151D21] text-center">
            Scroll ke bawah untuk info lebih lanjut
          </p>
        </div>
      </div>

      {/* 6. Stats Section (3 Cards) */}
      <div className="w-full grid grid-cols-3 gap-2 my-6">
        <div className="bg-white border-2 border-black p-2.5 flex flex-col items-center text-center">
          <span className="font-['Press_Start_2P',monospace] text-xs sm:text-[13px] font-bold text-black mb-1">
            5.140
          </span>
          <span className="text-[11px] text-[#6B7280]">Program studi</span>
        </div>
        <div className="bg-white border-2 border-black p-2.5 flex flex-col items-center text-center">
          <span className="font-['Press_Start_2P',monospace] text-xs sm:text-[13px] font-bold text-black mb-1">
            85
          </span>
          <span className="text-[11px] text-[#6B7280]">PTN terdata</span>
        </div>
        <div className="bg-white border-2 border-black p-2.5 flex flex-col items-center text-center">
          <span className="font-['Press_Start_2P',monospace] text-xs sm:text-[13px] font-bold text-black mb-1">
            1 Klik
          </span>
          <span className="text-[11px] text-[#6B7280]">Simulasi Kuliah</span>
        </div>
      </div>

      {/* 7. Section CARA KERJA */}
      <section id="cara-kerja" className="w-full pt-6 pb-8 flex flex-col">
        <div className="mb-2">
          <span className="font-['Press_Start_2P',monospace] text-[10px] text-[#277EFD] tracking-wider uppercase">
            CARA KERJA
          </span>
        </div>
        <h2 className="font-['Press_Start_2P',monospace] text-sm sm:text-base text-black leading-relaxed mb-5">
          3 langkah menuju jurusan yang pas
        </h2>

        <div className="flex flex-col gap-4">
          {/* Step 01 */}
          <div className="bg-white pixel-border p-3.5 flex items-start gap-3">
            <div className="w-9 h-9 shrink-0 bg-[#FEBD01] border-2 border-black flex items-center justify-center font-['Press_Start_2P',monospace] text-xs font-bold text-black">
              01
            </div>
            <div className="flex flex-col">
              <h3 className="font-['Press_Start_2P',monospace] text-xs text-black mb-1.5 leading-snug">
                Ceritakan dirimu
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Tulis minat, hobi, dan gaya belajarmu dengan bahasamu sendiri.
              </p>
            </div>
          </div>

          {/* Step 02 */}
          <div className="bg-white pixel-border p-3.5 flex items-start gap-3">
            <div className="w-9 h-9 shrink-0 bg-[#277EFD] border-2 border-black flex items-center justify-center font-['Press_Start_2P',monospace] text-xs font-bold text-white">
              02
            </div>
            <div className="flex flex-col">
              <h3 className="font-['Press_Start_2P',monospace] text-xs text-black mb-1.5 leading-snug">
                Lengkapi data akademik
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Unggah rapor atau nilai try out sesuai jalur SNBP/SNBT.
              </p>
            </div>
          </div>

          {/* Step 03 */}
          <div className="bg-white pixel-border p-3.5 flex items-start gap-3">
            <div className="w-9 h-9 shrink-0 bg-[#22A94F] border-2 border-black flex items-center justify-center font-['Press_Start_2P',monospace] text-xs font-bold text-white">
              03
            </div>
            <div className="flex flex-col">
              <h3 className="font-['Press_Start_2P',monospace] text-xs text-black mb-1.5 leading-snug">
                Lihat hasil & coba simulasi
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Dapatkan persentase kecocokan, lalu rasakan studi kasus tiap jurusan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Preferensi CTA Section */}
      <section className="w-full pt-8 pb-10 flex flex-col items-center text-center">
        <h2 className="font-['Press_Start_2P',monospace] text-base sm:text-lg text-black leading-relaxed mb-2">
          Isi <span className="text-[#22A94F]">preferensi</span> dulu, yuk!
        </h2>
        <p className="text-xs text-[#4B5563] max-w-[320px] mb-4">
          Cuma butuh ±3 menit. Datamu aman dan hanya dipakai untuk rekomendasi.
        </p>

        {/* Character Illustration with Stars */}
        <div className="relative w-[240px] h-[340px] flex items-center justify-center my-2">
          <Image
            src="/assets/student-character.png"
            alt="Siswa Ceria"
            width={240}
            height={340}
            className="w-full h-full object-contain"
          />
          {/* Pixel Stars matching Figma */}
          <span className="absolute top-10 left-6 text-sm text-[#FEBD01] animate-pulse">★</span>
          <span className="absolute top-4 right-10 text-xs text-[#FEBD01] animate-pulse">★</span>
          <span className="absolute top-24 right-4 text-base text-[#FEBD01] animate-pulse">★</span>
          <span className="absolute top-36 left-2 text-base text-[#FEBD01] animate-pulse">★</span>
          <span className="absolute bottom-20 right-2 text-xl text-[#FEBD01] animate-pulse">★</span>
          <span className="absolute bottom-28 left-6 text-xs text-[#FEBD01] animate-pulse">★</span>
          <span className="absolute bottom-12 left-2 text-xs text-[#FEBD01] animate-pulse">★</span>
          <span className="absolute bottom-16 right-12 text-xs text-[#FEBD01] animate-pulse">★</span>
        </div>

        {/* Action Button */}
        <div className="w-full max-w-[340px] mt-4 flex flex-col items-center">
          <Link
            href="/preferensi"
            className="w-full pixel-btn-blue py-3.5 text-center text-xs tracking-wider"
          >
            <span>MULAI</span>
            <Icon name="arrow-right" className="w-4 h-4 text-white" />
          </Link>
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-gray-500">
            <Icon name="lock" className="w-3.5 h-3.5 text-gray-500" />
            <span>Tidak dibagikan ke pihak lain</span>
          </div>
        </div>
      </section>
    </div>
  );
}
