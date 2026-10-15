'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Icon } from '@/components/ui/Icon';
import LoginModal from '@/components/auth/LoginModal';
import PemilihPreferensi, { PreferensiItem } from '@/components/ui/PemilihPreferensi';

export default function HeroSection() {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock initial preferensi list untuk preview M04 jika sudah login
  const [preferensiList, setPreferensiList] = useState<PreferensiItem[]>([
    { id: 'pref-1', nama: 'Informatika Impian', jalur: 'snbp', is_aktif: true },
    { id: 'pref-2', nama: 'Cadangan SNBT', jalur: 'snbt', is_aktif: false },
  ]);

  const handlePilihPreferensi = (id: string) => {
    setPreferensiList((prev) =>
      prev.map((p) => ({ ...p, is_aktif: p.id === id }))
    );
  };

  const scrollToCaraKerja = () => {
    const el = document.getElementById('cara-kerja');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await fetch('/api/akun', { method: 'DELETE' });
      window.location.href = '/';
    } catch {
      alert('Gagal menghapus data akun');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="w-full max-w-[402px] mx-auto flex flex-col items-center px-4 pt-6 pb-12">
      {/* 1. Tagline Pill */}
      <div className="mb-4 inline-flex items-center px-3 py-1 border-[2px] border-[#4285F4] bg-white shadow-[2px_2px_0px_#000000]">
        <span className="font-['Press_Start_2P',monospace] text-[9px] text-[#4285F4] tracking-wider uppercase">
          5.150 PRODI • 146 PTN • SNBP & SNBT
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
          <span className="px-2.5 py-0.5 bg-[#4285F4] text-white border-2 border-black font-['Press_Start_2P',monospace] text-[15px] sm:text-[17px] shadow-[2px_2px_0px_#000000]">
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
          <span className="px-2.5 py-0.5 bg-[#FBBC05] text-black border-2 border-black font-['Press_Start_2P',monospace] text-[15px] sm:text-[17px] shadow-[2px_2px_0px_#000000]">
            impian
          </span>
        </div>
      </div>

      {/* 3. Subtitle */}
      <p className="text-center text-[13px] leading-relaxed text-[#4B5563] mt-3 mb-6 max-w-[340px] font-['Outfit',sans-serif]">
        Uji rasa kuliahmu lewat studi kasus singkat, cocokkan minat, dan hitung peluang tembus PTN lewat data resmi SNPMB & PDDikti.
      </p>

      {/* 4. Action Buttons (M01 vs M04) */}
      <div className="w-full flex flex-col gap-3 max-w-[340px] mb-6">
        {isAuthenticated ? (
          <Link
            href="/cocokin"
            className="w-full bg-[#4285F4] hover:bg-[#277EFD] text-white border-2 border-black shadow-[4px_4px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] py-3.5 text-center font-['Press_Start_2P',monospace] text-xs flex items-center justify-center gap-2 transition-all"
          >
            <span>LIHAT REKOMENDASI</span>
            <Icon name="arrow-right" className="w-4 h-4 text-white" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setIsLoginModalOpen(true)}
            className="w-full bg-[#4285F4] hover:bg-[#277EFD] text-white border-2 border-black shadow-[4px_4px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] py-3.5 text-center font-['Press_Start_2P',monospace] text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>MULAI SEKARANG</span>
            <Icon name="arrow-right" className="w-4 h-4 text-white" />
          </button>
        )}

        <button
          type="button"
          onClick={scrollToCaraKerja}
          className="w-full bg-white hover:bg-gray-50 text-black border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] py-3.5 text-center font-['Press_Start_2P',monospace] text-xs transition-all cursor-pointer"
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
            Jelajahi
          </p>
        </div>
      </div>

      {/* 6. Stats Section (3 Cards) */}
      <div className="w-full grid grid-cols-3 gap-2 my-6">
        <div className="bg-white border-2 border-black p-2.5 flex flex-col items-center text-center shadow-[2px_2px_0px_#000000]">
          <span className="font-['Press_Start_2P',monospace] text-xs sm:text-[13px] font-bold text-black mb-1">
            5.150
          </span>
          <span className="text-[11px] text-[#6B7280] font-['Outfit',sans-serif]">Program studi</span>
        </div>
        <div className="bg-white border-2 border-black p-2.5 flex flex-col items-center text-center shadow-[2px_2px_0px_#000000]">
          <span className="font-['Press_Start_2P',monospace] text-xs sm:text-[13px] font-bold text-black mb-1">
            146
          </span>
          <span className="text-[11px] text-[#6B7280] font-['Outfit',sans-serif]">PTN</span>
        </div>
        <div className="bg-white border-2 border-black p-2.5 flex flex-col items-center text-center shadow-[2px_2px_0px_#000000]">
          <span className="font-['Press_Start_2P',monospace] text-xs sm:text-[13px] font-bold text-black mb-1">
            1 Klik
          </span>
          <span className="text-[11px] text-[#6B7280] font-['Outfit',sans-serif]">Simulasi Kuliah</span>
        </div>
      </div>

      {/* 7. Section CARA KERJA */}
      <section id="cara-kerja" className="w-full pt-6 pb-8 flex flex-col">
        <div className="mb-2">
          <span className="font-['Press_Start_2P',monospace] text-[10px] text-[#4285F4] tracking-wider uppercase">
            CARA KERJA
          </span>
        </div>
        <h2 className="font-['Press_Start_2P',monospace] text-sm sm:text-base text-black leading-relaxed mb-5">
          3 langkah menuju jurusan yang pas
        </h2>

        <div className="flex flex-col gap-4">
          {/* Step 01 */}
          <div className="bg-white border-2 border-black shadow-[3px_3px_0px_#000000] p-3.5 flex items-start gap-3">
            <div className="w-9 h-9 shrink-0 bg-[#FBBC05] border-2 border-black flex items-center justify-center font-['Press_Start_2P',monospace] text-xs font-bold text-black">
              01
            </div>
            <div className="flex flex-col font-['Outfit',sans-serif]">
              <h3 className="font-['Press_Start_2P',monospace] text-xs text-black mb-1.5 leading-snug">
                Isi kuis minat
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                30 kegiatan singkat (RIASEC) menentukan kode Holland-mu.
              </p>
            </div>
          </div>

          {/* Step 02 */}
          <div className="bg-white border-2 border-black shadow-[3px_3px_0px_#000000] p-3.5 flex items-start gap-3">
            <div className="w-9 h-9 shrink-0 bg-[#4285F4] border-2 border-black flex items-center justify-center font-['Press_Start_2P',monospace] text-xs font-bold text-white">
              02
            </div>
            <div className="flex flex-col font-['Outfit',sans-serif]">
              <h3 className="font-['Press_Start_2P',monospace] text-xs text-black mb-1.5 leading-snug">
                Lengkapi data jalurmu
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                SNBP: NPSN, rapor & TKA. SNBT: nilai try out 7 subtes.
              </p>
            </div>
          </div>

          {/* Step 03 */}
          <div className="bg-white border-2 border-black shadow-[3px_3px_0px_#000000] p-3.5 flex items-start gap-3">
            <div className="w-9 h-9 shrink-0 bg-[#34A853] border-2 border-black flex items-center justify-center font-['Press_Start_2P',monospace] text-xs font-bold text-white">
              03
            </div>
            <div className="flex flex-col font-['Outfit',sans-serif]">
              <h3 className="font-['Press_Start_2P',monospace] text-xs text-black mb-1.5 leading-snug">
                Lihat peluang & Test Drive
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Kecocokan, peluang per kampus berlabel estimasi, lalu cicipi soal kuliahnya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Preferensi CTA Card (M01 vs M04) */}
      <section className="w-full pt-4 pb-10 flex flex-col items-center">
        {isAuthenticated ? (
          /* M04: Preferensi CTA Card Saat Sudah Login */
          <div className="w-full bg-white border-2 border-black shadow-[4px_4px_0px_#000000] p-4 flex flex-col items-center text-center">
            <h2 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-black leading-relaxed mb-2">
              Yuk, lihat rekomendasi jurusan untukmu!
            </h2>
            <p className="text-xs text-[#4B5563] max-w-[320px] mb-4 font-['Outfit',sans-serif]">
              Kamu punya {preferensiList.length} preferensi tersimpan. Hasilnya mengikuti preferensi yang sedang aktif.
            </p>

            {/* Pemilih Preferensi Aktif */}
            <div className="w-full max-w-[340px] mb-4">
              <PemilihPreferensi
                preferensiList={preferensiList}
                onPilih={handlePilihPreferensi}
              />
            </div>

            {/* Character Illustration with Stars */}
            <div className="relative w-[220px] h-[280px] flex items-center justify-center my-2">
              <Image
                src="/assets/student-character.png"
                alt="Siswa Ceria"
                width={220}
                height={280}
                className="w-full h-full object-contain"
              />
              <span className="absolute top-8 left-4 text-sm text-[#FBBC05] animate-pulse">★</span>
              <span className="absolute top-2 right-8 text-xs text-[#FBBC05] animate-pulse">★</span>
              <span className="absolute top-20 right-2 text-base text-[#FBBC05] animate-pulse">★</span>
              <span className="absolute top-32 left-1 text-base text-[#FBBC05] animate-pulse">★</span>
              <span className="absolute bottom-16 right-2 text-xl text-[#FBBC05] animate-pulse">★</span>
            </div>

            {/* Tombol Lihat Rekomendasi */}
            <div className="w-full max-w-[340px] mt-3 flex flex-col items-center">
              <Link
                href="/cocokin"
                className="w-full bg-[#4285F4] hover:bg-[#277EFD] text-white border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] py-3.5 text-center font-['Press_Start_2P',monospace] text-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>LIHAT REKOMENDASI</span>
                <Icon name="arrow-right" className="w-4 h-4 text-white" />
              </Link>
              <Link
                href="/preferensi"
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#4285F4] font-bold font-['Outfit',sans-serif] hover:underline"
              >
                <Icon name="lock" className="w-3.5 h-3.5 text-[#4285F4]" />
                <span>Kelola preferensi →</span>
              </Link>
            </div>
          </div>
        ) : (
          /* M01: Card Saat Belum Login */
          <div className="w-full bg-white border-2 border-black shadow-[4px_4px_0px_#000000] p-4 flex flex-col items-center text-center">
            <h2 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-black leading-relaxed mb-2">
              Isi <span className="text-[#34A853]">preferensi</span> dulu, yuk!
            </h2>
            <p className="text-xs text-[#4B5563] max-w-[320px] mb-4 font-['Outfit',sans-serif]">
              Cuma butuh ±3 menit. Datamu aman dan hanya dipakai untuk rekomendasi.
            </p>

            <div className="relative w-[220px] h-[280px] flex items-center justify-center my-2">
              <Image
                src="/assets/student-character.png"
                alt="Siswa Ceria"
                width={220}
                height={280}
                className="w-full h-full object-contain"
              />
              <span className="absolute top-8 left-4 text-sm text-[#FBBC05] animate-pulse">★</span>
              <span className="absolute top-2 right-8 text-xs text-[#FBBC05] animate-pulse">★</span>
              <span className="absolute top-20 right-2 text-base text-[#FBBC05] animate-pulse">★</span>
              <span className="absolute top-32 left-1 text-base text-[#FBBC05] animate-pulse">★</span>
            </div>

            <div className="w-full max-w-[340px] mt-3 flex flex-col items-center">
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full bg-[#4285F4] hover:bg-[#277EFD] text-white border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] py-3.5 text-center font-['Press_Start_2P',monospace] text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>MULAI SEKARANG</span>
                <Icon name="arrow-right" className="w-4 h-4 text-white" />
              </button>
              <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-gray-500 font-['Outfit',sans-serif]">
                <Icon name="lock" className="w-3.5 h-3.5 text-gray-500" />
                <span>Tidak dibagikan ke pihak lain</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 9. Footer Lengkap (M01 / M04) */}
      <footer className="w-full border-t-2 border-black pt-6 pb-4 mt-6 flex flex-col gap-5 font-['Outfit',sans-serif]">
        {/* Brand */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/logo-cap.png"
              alt="Cocokin Logo"
              width={24}
              height={24}
              className="w-6 h-6 object-contain image-pixelated"
            />
            <span className="font-['Press_Start_2P',monospace] text-xs font-bold text-black">
              Cocokin!
            </span>
          </div>
          <p className="text-xs text-gray-600">
            Cari yang cocok, uji rasanya, tembus kampus impianmu.
          </p>
        </div>

        {/* Kolom JELAJAHI & SUMBER DATA */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <h4 className="font-['Press_Start_2P',monospace] text-[9px] text-black mb-2 uppercase">
              JELAJAHI
            </h4>
            <ul className="space-y-1.5 text-gray-600">
              <li>
                <Link href="/" className="hover:text-[#4285F4] transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/cocokin" className="hover:text-[#4285F4] transition-colors">
                  Cocokin
                </Link>
              </li>
              <li>
                <Link href="/preferensi" className="hover:text-[#4285F4] transition-colors">
                  Preferensi
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:text-[#4285F4] transition-colors">
                  Test Drive Jurusan
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-['Press_Start_2P',monospace] text-[9px] text-black mb-2 uppercase">
              SUMBER DATA
            </h4>
            <ul className="space-y-1.5 text-gray-600 text-[11px] leading-tight">
              <li>snpmb.id</li>
              <li>PDDikti</li>
              <li>O*NET Interest Profiler</li>
              <li>Kepmendikdasmen 102/M/2025</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-2.5 bg-[#FFFDF0] border border-black flex items-start gap-2 shadow-[1px_1px_0px_#000000]">
          <Icon name="info" className="w-3.5 h-3.5 text-[#FBBC05] shrink-0 mt-0.5" />
          <p className="text-[11px] text-gray-700 leading-relaxed">
            Semua angka peluang adalah estimasi berbasis data resmi, bukan jaminan kelulusan.
          </p>
        </div>

        {/* Bawah */}
        <div className="border-t border-gray-200 pt-3 flex flex-col gap-2 text-[11px] text-gray-500">
          <p>© 2026 Cocokin! • Hackathon JOINTS UGM 2026</p>
          <div className="flex items-center justify-between">
            <Link
              href="/syarat-ketentuan"
              className="text-[#4285F4] hover:underline"
            >
              Syarat & ketentuan
            </Link>
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <Icon name="trash" className="w-3 h-3 text-red-600" />
                <span>Hapus akun & data</span>
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Modal Login Google */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Modal Konfirmasi Hapus Akun */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-[340px] bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000000]">
            <h3 className="font-['Press_Start_2P',monospace] text-xs text-red-600 mb-2">
              HAPUS AKUN & DATA?
            </h3>
            <p className="font-['Outfit',sans-serif] text-xs text-gray-700 leading-relaxed mb-4">
              Semua preferensi dan riwayat Anda akan dihapus secara permanen dari server. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2 border border-black font-['Outfit',sans-serif] font-bold text-xs hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 py-2 bg-red-600 text-white border border-black font-['Outfit',sans-serif] font-bold text-xs hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
