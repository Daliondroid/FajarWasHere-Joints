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

  // Initial preferensi list untuk preview M04 jika sudah login
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
    <div className="w-full max-w-[402px] mx-auto flex flex-col items-center">
      {/* Container Utama Konten */}
      <div className="w-full px-4 pt-6 pb-6 flex flex-col items-center">
        {/* 1. Tagline Pill */}
        <div className="mb-4 inline-flex items-center px-3 py-1 border-[2px] border-[#277EFD] bg-white shadow-[2px_2px_0px_#151D21]">
          <span className="font-['Press_Start_2P',monospace] text-[9px] text-[#277EFD] tracking-wider uppercase">
            5.150 PRODI • 146 PTN • SNBP & SNBT
          </span>
        </div>

        {/* 2. Headline with Badges */}
        <div className="flex flex-col items-center text-center mb-3">
          <h1 className="font-['Press_Start_2P',monospace] text-[17px] sm:text-[19px] leading-[1.6] text-[#151D21]">
            Temukan jurusan
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="font-['Press_Start_2P',monospace] text-[17px] sm:text-[19px] text-[#151D21]">
              yang
            </span>
            <span className="px-2.5 py-0.5 bg-[#277EFD] text-white border-2 border-[#151D21] font-['Press_Start_2P',monospace] text-[15px] sm:text-[17px] shadow-[2px_2px_0px_#151D21]">
              cocok
            </span>
            <span className="font-['Press_Start_2P',monospace] text-[17px] sm:text-[19px] text-[#151D21]">
              &
            </span>
          </div>
          <div className="font-['Press_Start_2P',monospace] text-[17px] sm:text-[19px] leading-[1.6] text-[#151D21] mt-2">
            tembus kampus
          </div>
          <div className="mt-2.5">
            <span className="px-2.5 py-0.5 bg-[#FEBD01] text-[#151D21] border-2 border-[#151D21] font-['Press_Start_2P',monospace] text-[15px] sm:text-[17px] shadow-[2px_2px_0px_#151D21]">
              impian
            </span>
          </div>
        </div>

        {/* 3. Subtitle */}
        <p className="text-center text-[13px] leading-relaxed text-[#3A444B] mt-3 mb-6 max-w-[354px] font-['Outfit',sans-serif]">
          Uji rasa kuliahmu lewat studi kasus singkat, cocokkan minat, dan hitung peluang tembus PTN lewat data resmi SNPMB & PDDikti.
        </p>

        {/* 4. Action Buttons (M01: Tombol Hijau + Putih) */}
        <div className="w-full flex flex-col gap-3 max-w-[354px] mb-6">
          {isAuthenticated ? (
            <Link
              href="/cocokin"
              className="w-full bg-[#22A94F] hover:bg-[#1E9646] text-white border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] py-3.5 text-center font-['Press_Start_2P',monospace] text-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>LIHAT REKOMENDASI</span>
              <Icon name="arrow-right" className="w-4 h-4 text-white" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full bg-[#22A94F] hover:bg-[#1E9646] text-white border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] py-3.5 text-center font-['Press_Start_2P',monospace] text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>MULAI SEKARANG</span>
              <Icon name="arrow-right" className="w-4 h-4 text-white" />
            </button>
          )}

          <button
            type="button"
            onClick={scrollToCaraKerja}
            className="w-full bg-white hover:bg-gray-50 text-[#151D21] border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] py-3.5 text-center font-['Press_Start_2P',monospace] text-xs transition-all cursor-pointer"
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
            <Icon name="chevron-down" className="w-5 h-5 text-[#151D21] animate-bounce mb-1" />
            <p className="font-['Outfit',sans-serif] font-bold text-xs text-[#151D21] text-center">
              Jelajahi
            </p>
          </div>
        </div>

        {/* 6. Stats Section (3 Cards border tipis #D9D5CB persis Figma) */}
        <div className="w-full grid grid-cols-3 gap-2 my-6">
          <div className="bg-white border border-[#D9D5CB] p-2.5 flex flex-col items-center text-center">
            <span className="font-['Press_Start_2P',monospace] text-xs sm:text-[13px] font-bold text-[#151D21] mb-1">
              5.150
            </span>
            <span className="text-[11px] text-[#6B7680] font-['Outfit',sans-serif]">Program studi</span>
          </div>
          <div className="bg-white border border-[#D9D5CB] p-2.5 flex flex-col items-center text-center">
            <span className="font-['Press_Start_2P',monospace] text-xs sm:text-[13px] font-bold text-[#151D21] mb-1">
              146
            </span>
            <span className="text-[11px] text-[#6B7680] font-['Outfit',sans-serif]">PTN</span>
          </div>
          <div className="bg-white border border-[#D9D5CB] p-2.5 flex flex-col items-center text-center">
            <span className="font-['Press_Start_2P',monospace] text-xs sm:text-[13px] font-bold text-[#151D21] mb-1">
              1 Klik
            </span>
            <span className="text-[11px] text-[#6B7680] font-['Outfit',sans-serif]">Simulasi Kuliah</span>
          </div>
        </div>

        {/* 7. Section CARA KERJA */}
        <section id="cara-kerja" className="w-full pt-6 pb-8 flex flex-col">
          <div className="mb-2">
            <span className="font-['Press_Start_2P',monospace] text-[10px] text-[#277EFD] tracking-wider uppercase">
              CARA KERJA
            </span>
          </div>
          <h2 className="font-['Press_Start_2P',monospace] text-sm sm:text-base text-[#151D21] leading-relaxed mb-5">
            3 langkah menuju jurusan yang pas
          </h2>

          <div className="flex flex-col gap-4">
            {/* Step 01 */}
            <div className="bg-white border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] p-3.5 flex items-start gap-3">
              <div className="w-11 h-11 shrink-0 bg-[#FEBD01] border-2 border-[#151D21] flex items-center justify-center font-['Press_Start_2P',monospace] text-xs font-bold text-[#151D21]">
                01
              </div>
              <div className="flex flex-col font-['Outfit',sans-serif]">
                <h3 className="font-['Press_Start_2P',monospace] text-xs text-[#151D21] mb-1.5 leading-snug">
                  Isi kuis minat
                </h3>
                <p className="text-xs text-[#6B7680] leading-relaxed">
                  30 kegiatan singkat (RIASEC) menentukan kode Holland-mu.
                </p>
              </div>
            </div>

            {/* Step 02 */}
            <div className="bg-white border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] p-3.5 flex items-start gap-3">
              <div className="w-11 h-11 shrink-0 bg-[#277EFD] border-2 border-[#151D21] flex items-center justify-center font-['Press_Start_2P',monospace] text-xs font-bold text-white">
                02
              </div>
              <div className="flex flex-col font-['Outfit',sans-serif]">
                <h3 className="font-['Press_Start_2P',monospace] text-xs text-[#151D21] mb-1.5 leading-snug">
                  Lengkapi data jalurmu
                </h3>
                <p className="text-xs text-[#6B7680] leading-relaxed">
                  SNBP: NPSN, rapor & TKA. SNBT: nilai try out 7 subtes.
                </p>
              </div>
            </div>

            {/* Step 03 */}
            <div className="bg-white border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] p-3.5 flex items-start gap-3">
              <div className="w-11 h-11 shrink-0 bg-[#22A94F] border-2 border-[#151D21] flex items-center justify-center font-['Press_Start_2P',monospace] text-xs font-bold text-white">
                03
              </div>
              <div className="flex flex-col font-['Outfit',sans-serif]">
                <h3 className="font-['Press_Start_2P',monospace] text-xs text-[#151D21] mb-1.5 leading-snug">
                  Lihat peluang & Test Drive
                </h3>
                <p className="text-xs text-[#6B7680] leading-relaxed">
                  Kecocokan, peluang per kampus berlabel estimasi, lalu cicipi soal kuliahnya.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Preferensi CTA Section (PERSIS FIGMA M01 / GAMBAR 2) */}
        <section className="w-full pt-8 pb-10 flex flex-col items-center text-center">
          {isAuthenticated ? (
            /* Kondisi M04 Sudah Login */
            <div className="w-full flex flex-col items-center text-center">
              <h2 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-[#151D21] leading-relaxed mb-2">
                Yuk, lihat rekomendasi jurusan untukmu!
              </h2>
              <p className="text-xs text-[#6B7680] max-w-[320px] mb-4 font-['Outfit',sans-serif]">
                Kamu punya {preferensiList.length} preferensi tersimpan. Hasilnya mengikuti preferensi yang sedang aktif.
              </p>

              <div className="w-full max-w-[340px] mb-4">
                <PemilihPreferensi
                  preferensiList={preferensiList}
                  onPilih={handlePilihPreferensi}
                />
              </div>

              {/* Character Illustration with Stars */}
              <div className="relative w-[280px] h-[340px] flex items-center justify-center my-3">
                <Image
                  src="/assets/student-character.png"
                  alt="Siswa Ceria"
                  width={210}
                  height={315}
                  className="w-[210px] h-[315px] object-contain image-pixelated"
                />
                <span className="absolute top-10 left-4 text-base text-[#FEBD01] animate-pulse">★</span>
                <span className="absolute top-4 right-14 text-sm text-[#FEBD01] animate-pulse">★</span>
                <span className="absolute top-28 right-6 text-xl text-[#FEBD01] animate-pulse">★</span>
                <span className="absolute top-40 left-2 text-2xl text-[#FEBD01] animate-pulse">★</span>
                <span className="absolute bottom-24 right-4 text-3xl text-[#FEBD01] animate-pulse">★</span>
                <span className="absolute bottom-14 left-8 text-sm text-[#FEBD01] animate-pulse">★</span>
                <span className="absolute bottom-28 left-4 text-xs text-[#FEBD01] animate-pulse">★</span>
              </div>

              <div className="w-full max-w-[340px] mt-2 flex flex-col items-center">
                <Link
                  href="/cocokin"
                  className="w-full bg-[#22A94F] hover:bg-[#1E9646] text-white border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] py-3.5 text-center font-['Press_Start_2P',monospace] text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <span>LIHAT REKOMENDASI</span>
                  <Icon name="arrow-right" className="w-4 h-4 text-white" />
                </Link>
                <Link
                  href="/preferensi"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#277EFD] font-bold font-['Outfit',sans-serif] hover:underline"
                >
                  <Icon name="lock" className="w-3.5 h-3.5 text-[#277EFD]" />
                  <span>Kelola preferensi →</span>
                </Link>
              </div>
            </div>
          ) : (
            /* Kondisi M01 Belum Login - PERSIS SCREENSHOT FIGMA DARI USER */
            <div className="w-full flex flex-col items-center text-center">
              <h2 className="font-['Press_Start_2P',monospace] text-[13px] sm:text-[15px] text-[#151D21] leading-[1.8] max-w-[354px] mb-2">
                Isi <span className="text-[#22A94F]">preferensi</span> dulu yuu, biar ramalan Cocokin! makin akurat!
              </h2>

              <p className="text-xs text-[#6B7680] max-w-[320px] mb-4 font-['Outfit',sans-serif] leading-relaxed">
                Kuis minat ±3 menit + data jalur SNBP/SNBT. Bisa simpan beberapa preferensi sekaligus.
              </p>

              {/* Character Illustration with Scattered Stars */}
              <div className="relative w-[280px] h-[340px] flex items-center justify-center my-3">
                <Image
                  src="/assets/student-character.png"
                  alt="Siswa Ceria Pixel"
                  width={210}
                  height={315}
                  className="w-[210px] h-[315px] object-contain image-pixelated"
                />
                <span className="absolute top-10 left-4 text-base text-[#FEBD01] animate-pulse">★</span>
                <span className="absolute top-4 right-14 text-sm text-[#FEBD01] animate-pulse">★</span>
                <span className="absolute top-28 right-6 text-xl text-[#FEBD01] animate-pulse">★</span>
                <span className="absolute top-40 left-2 text-2xl text-[#FEBD01] animate-pulse">★</span>
                <span className="absolute bottom-24 right-4 text-3xl text-[#FEBD01] animate-pulse">★</span>
                <span className="absolute bottom-14 left-8 text-sm text-[#FEBD01] animate-pulse">★</span>
                <span className="absolute bottom-28 left-4 text-xs text-[#FEBD01] animate-pulse">★</span>
              </div>

              {/* Action Button HIJAU persis Figma */}
              <div className="w-full max-w-[340px] mt-2 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="w-full bg-[#22A94F] hover:bg-[#1E9646] text-white border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] py-3.5 text-center font-['Press_Start_2P',monospace] text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>MULAI SEKARANG</span>
                  <Icon name="arrow-right" className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* 9. Footer GELAP #151D21 Persis Figma M01 (node 172:203) */}
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
              <li>PDDikti (akreditasi & kompetensi prodi)</li>
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
              className="text-white hover:underline"
            >
              Syarat & ketentuan
            </Link>
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="text-[#F1402E] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Icon name="trash" className="w-3.5 h-3.5 text-[#F1402E]" />
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
