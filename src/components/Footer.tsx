'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Icon } from '@/components/ui/Icon';

interface FooterProps {
  onDeleteAccountClick?: () => void;
}

export default function Footer({ onDeleteAccountClick }: FooterProps) {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <footer className="w-full bg-[#151D21] text-white px-5 pt-8 pb-6 border-t-2 border-black flex flex-col gap-6 font-['Outfit',sans-serif]">
      {/* Brand */}
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

      {/* Kolom JELAJAHI & SUMBER DATA */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <h4 className="font-['Press_Start_2P',monospace] text-[9px] text-[#FEBD01] mb-2.5 uppercase tracking-wider">
            JELAJAHI
          </h4>
          <ul className="space-y-2 text-white">
            <li>
              <Link href="/" className="hover:text-[#277EFD] transition-colors">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/cocokin" className="hover:text-[#277EFD] transition-colors">
                Cocokin
              </Link>
            </li>
            <li>
              <Link href="/preferensi" className="hover:text-[#277EFD] transition-colors">
                Preferensi
              </Link>
            </li>
            <li>
              <Link href="/katalog" className="hover:text-[#277EFD] transition-colors">
                Test Drive Jurusan
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-['Press_Start_2P',monospace] text-[9px] text-[#FEBD01] mb-2.5 uppercase tracking-wider">
            SUMBER DATA
          </h4>
          <ul className="space-y-2 text-white text-[11px] leading-tight">
            <li>snpmb.id (daya tampung, peminat, kuota sekolah)</li>
            <li>PDDikti (akreditasi &amp; kompetensi prodi)</li>
            <li>O*NET Interest Profiler • CC BY 4.0</li>
            <li>Kepmendikdasmen 102/M/2025</li>
          </ul>
        </div>
      </div>

      {/* Disclaimer Box dengan Border Kuning #FEBD01 */}
      <div className="p-3 border border-[#FEBD01] flex items-start gap-2.5 bg-black/20">
        <Icon name="info" className="w-4 h-4 text-[#FEBD01] shrink-0 mt-0.5" />
        <p className="text-[11px] text-white leading-relaxed">
          Semua angka peluang adalah estimasi berbasis data resmi, bukan jaminan kelulusan.
        </p>
      </div>

      {/* Bawah */}
      <div className="border-t border-gray-700 pt-3 flex flex-col gap-2 text-[11px] text-[#D9D5CB]">
        <p>© 2026 Cocokin! • Hackathon JOINTS UGM 2026</p>
        <div className="flex items-center justify-between">
          <Link
            href="/syarat-ketentuan"
            className="text-white hover:underline font-bold"
          >
            Syarat &amp; ketentuan
          </Link>
          {isAuthenticated && onDeleteAccountClick && (
            <button
              type="button"
              onClick={onDeleteAccountClick}
              className="text-[#F1402E] hover:underline flex items-center gap-1 cursor-pointer font-bold"
            >
              <Icon name="trash" className="w-3.5 h-3.5 text-[#F1402E]" />
              <span>Hapus akun &amp; data</span>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
