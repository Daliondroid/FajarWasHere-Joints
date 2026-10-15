'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { Icon } from '@/components/ui/Icon';

export default function SyaratKetentuanPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex justify-center">
      <div className="w-full max-w-[402px] bg-white border-x-2 border-black flex flex-col min-h-screen">
        {/* Navbar with back button */}
        <Navbar backHref="/" title="Syarat & Ketentuan" />

        <main className="p-4 flex-1">
          {/* Header Section */}
          <div className="mb-6 border-b-2 border-black pb-4">
            <span className="inline-block px-2 py-0.5 bg-[#EEF5FF] border border-black text-[#277EFD] font-['Press_Start_2P',monospace] text-[8px] mb-2 shadow-[1px_1px_0px_#000000]">
              INFORMASI RESMI
            </span>
            <h1 className="font-['Press_Start_2P',monospace] text-base text-black mb-2 leading-snug">
              SYARAT & KETENTUAN
            </h1>
            <p className="font-['Outfit',sans-serif] font-bold text-xs text-gray-800 mb-1">
              Baca sebelum menggunakan Cocokin!
            </p>
            <p className="font-['Outfit',sans-serif] text-xs text-gray-600 leading-relaxed">
              Ketentuan penggunaan, sumber data, dan batasan tanggung jawab.
            </p>
          </div>

          <div className="space-y-6 text-xs text-gray-800 font-['Outfit',sans-serif]">
            {/* Bagian 1: Estimasi Peluang */}
            <section className="bg-[#FFFDF0] p-3.5 border-2 border-black shadow-[3px_3px_0px_#000000]">
              <div className="flex items-center gap-2 mb-2.5">
                <Icon name="info" className="w-4 h-4 text-[#FBBC05] shrink-0" />
                <h2 className="font-['Press_Start_2P',monospace] text-[9px] text-black">
                  ESTIMASI PELUANG
                </h2>
              </div>
              <ul className="space-y-2 text-gray-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-black mt-1.5 shrink-0" />
                  <span>
                    Semua angka peluang adalah estimasi berbasis data resmi snpmb.id dan PDDikti, bukan jaminan kelulusan.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-black mt-1.5 shrink-0" />
                  <span>
                    Data daya tampung dan peminat memakai data resmi snpmb.id 2025. Seleksi nyata bergantung pada pendaftar tahun berjalan.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-black mt-1.5 shrink-0" />
                  <span>
                    Skala skor Try Out tiap bimbel berbeda dan bukan IRT, jadi peluang SNBT hanya perkiraan kasar.
                  </span>
                </li>
              </ul>
            </section>

            {/* Bagian 2: Aturan SNBP & SNBT */}
            <section className="bg-white p-3.5 border-2 border-black shadow-[3px_3px_0px_#000000]">
              <div className="flex items-center gap-2 mb-2.5">
                <Icon name="check" className="w-4 h-4 text-[#34A853] shrink-0" />
                <h2 className="font-['Press_Start_2P',monospace] text-[9px] text-black">
                  ATURAN SNBP & SNBT
                </h2>
              </div>
              <ul className="space-y-2 text-gray-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-black mt-1.5 shrink-0" />
                  <span>
                    Dua pilihan prodi SNBP sah hanya jika salah satu PTN berada di provinsi sekolahmu.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-black mt-1.5 shrink-0" />
                  <span>
                    Lulusan 2024 dan 2025 hanya bisa ikut SNBT. Yang sudah lulus SNBP 2024–2026 tidak bisa ikut SNBT 2026.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-black mt-1.5 shrink-0" />
                  <span>
                    Nilai TKA dipakai untuk memvalidasi nilai rapor. Dua mapel pilihan TKA bebas kamu pilih; menyamakannya dengan mapel pendukung prodi incaran hanya anjuran.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-black mt-1.5 shrink-0" />
                  <span>
                    Mapel pendukung paling banyak 2, mengikuti Kepmendikdasmen 102/M/2025.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-black mt-1.5 shrink-0" />
                  <span>
                    267 prodi seni dan olahraga mewajibkan portofolio.
                  </span>
                </li>
              </ul>
            </section>

            {/* Bagian 3: Kecocokan & Preferensi */}
            <section className="bg-[#EEF5FF] p-3.5 border-2 border-black shadow-[3px_3px_0px_#000000]">
              <div className="flex items-center gap-2 mb-2.5">
                <Icon name="spark" className="w-4 h-4 text-[#4285F4] shrink-0" />
                <h2 className="font-['Press_Start_2P',monospace] text-[9px] text-black">
                  KECOCOKAN & PREFERENSI
                </h2>
              </div>
              <ul className="space-y-2 text-gray-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-black mt-1.5 shrink-0" />
                  <span>
                    Skor kecocokan dihitung otomatis, bukan oleh AI: 80% dari profil minat RIASEC dan 20% dari hobi. Mapel favorit (maks. 3) hanya penentu urutan saat skor sama.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-black mt-1.5 shrink-0" />
                  <span>
                    Satu preferensi punya satu jalur, SNBP atau SNBT, yang tidak bisa diubah. Untuk jalur lain, buat preferensi baru.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-black mt-1.5 shrink-0" />
                  <span>
                    Hanya satu preferensi yang aktif. Jika preferensi aktif dihapus, preferensi yang terakhir diperbarui menjadi aktif.
                  </span>
                </li>
              </ul>
            </section>

            {/* Bagian 4: Data Sekolah & Alumni */}
            <section className="bg-white p-3.5 border-2 border-black shadow-[3px_3px_0px_#000000]">
              <div className="flex items-center gap-2 mb-2.5">
                <Icon name="school" className="w-4 h-4 text-black shrink-0" />
                <h2 className="font-['Press_Start_2P',monospace] text-[9px] text-black">
                  DATA SEKOLAH & ALUMNI
                </h2>
              </div>
              <ul className="space-y-2 text-gray-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-black mt-1.5 shrink-0" />
                  <span>
                    Kuota eligible sekolah diambil dari data resmi SNPMB berdasarkan NPSN.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-black mt-1.5 shrink-0" />
                  <span>
                    Data alumni per sekolah tidak tersedia publik. Reputasi alumni berasal dari isianmu sendiri, dan data alumni di versi demo ini bersifat sintetis.
                  </span>
                </li>
              </ul>
            </section>

            {/* Bagian 5: Privasi & Akun */}
            <section className="bg-[#FFF0F0] p-3.5 border-2 border-black shadow-[3px_3px_0px_#000000]">
              <div className="flex items-center gap-2 mb-2.5">
                <Icon name="lock" className="w-4 h-4 text-[#EA4335] shrink-0" />
                <h2 className="font-['Press_Start_2P',monospace] text-[9px] text-black">
                  PRIVASI & DATA
                </h2>
              </div>
              <ul className="space-y-2 text-gray-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-black mt-1.5 shrink-0" />
                  <span>
                    Kami hanya menyimpan nama dan email dari akun Google-mu.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-black mt-1.5 shrink-0" />
                  <span>
                    Alamat cukup provinsi dan kabupaten/kota, terisi otomatis dari NPSN.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-black mt-1.5 shrink-0" />
                  <span>
                    Foto atau PDF rapor dihapus setelah nilainya diekstrak. Cek ulang hasil ekstraksi sebelum disimpan.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-black mt-1.5 shrink-0" />
                  <span>
                    Akun dan semua datamu bisa dihapus kapan saja lewat menu &ldquo;Hapus akun &amp; data&rdquo; di footer.
                  </span>
                </li>
              </ul>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-8 border-t-2 border-black bg-white p-4 text-center font-['Outfit',sans-serif] text-xs text-gray-600">
          <p>© 2026 Cocokin! — Hackathon JOINTS UGM 2026</p>
        </footer>
      </div>
    </div>
  );
}
