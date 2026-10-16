'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Icon } from '@/components/ui/Icon';

export default function SyaratKetentuanPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex justify-center">
      <div className="w-full max-w-[402px] bg-white border-x-2 border-[#151D21] flex flex-col min-h-screen">
        {/* Navbar with centered title and back button (persis Figma M20 node 215:3198) */}
        <Navbar backHref="/" title="Syarat & Ketentuan" />

        <main className="p-6 pb-12 flex-1 flex flex-col gap-5 font-['Outfit',sans-serif]">
          {/* Header Section */}
          <div className="flex flex-col gap-2.5">
            <h1 className="font-['Press_Start_2P',monospace] text-base text-[#151D21] leading-snug">
              Syarat &amp; Ketentuan
            </h1>
            <p className="text-sm text-[#3A444B] leading-relaxed">
              Rincian kecil di balik angka, aturan, dan datamu, dikumpulkan di satu tempat supaya halaman lain tetap ringkas.
            </p>
            <p className="text-xs text-[#6B7680]">
              Diperbarui 15 Oktober 2026
            </p>
          </div>

          <div className="border-t border-dashed border-[#D9D5CB] my-1" />

          {/* Seksi 1: Angka peluang & estimasi */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Icon name="chart" className="w-5 h-5 text-[#151D21] shrink-0" />
              <h2 className="font-['Press_Start_2P',monospace] text-xs font-bold text-[#151D21]">
                Angka peluang &amp; estimasi
              </h2>
            </div>
            <ul className="space-y-2.5 text-[13px] text-[#3A444B] leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#151D21] mt-2 shrink-0" />
                <span>
                  Semua angka peluang adalah estimasi dari data resmi tahun sebelumnya, bukan jaminan kelulusan.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#151D21] mt-2 shrink-0" />
                <span>
                  Peluang selalu tampil sebagai rentang. Akreditasi sekolah dan reputasi alumni masing-masing menggeser hasil paling banyak ±5 poin persentil.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#151D21] mt-2 shrink-0" />
                <span>
                  Prodi tanpa data histori memakai rata-rata rumpun yang sama di PTN itu dan diberi label &ldquo;data terbatas&rdquo;.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#151D21] mt-2 shrink-0" />
                <span>
                  Skala skor Try Out tiap bimbel berbeda dan bukan IRT, jadi peluang SNBT hanya perkiraan kasar.
                </span>
              </li>
            </ul>
          </section>

          <div className="border-t border-dashed border-[#D9D5CB] my-1" />

          {/* Seksi 2: Aturan SNBP & SNBT */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Icon name="check" className="w-5 h-5 text-[#151D21] shrink-0" />
              <h2 className="font-['Press_Start_2P',monospace] text-xs font-bold text-[#151D21]">
                Aturan SNBP &amp; SNBT
              </h2>
            </div>
            <ul className="space-y-2.5 text-[13px] text-[#3A444B] leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#151D21] mt-2 shrink-0" />
                <span>
                  Dua pilihan prodi SNBP sah hanya jika salah satu PTN berada di provinsi sekolahmu.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#151D21] mt-2 shrink-0" />
                <span>
                  Lulusan 2024 dan 2025 hanya bisa ikut SNBT. Yang sudah lulus SNBP 2024–2026 tidak bisa ikut SNBT 2026.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#151D21] mt-2 shrink-0" />
                <span>
                  Nilai TKA dipakai untuk memvalidasi nilai rapor. Dua mapel pilihan TKA bebas kamu pilih; menyamakannya dengan mapel pendukung prodi incaran hanya anjuran.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#151D21] mt-2 shrink-0" />
                <span>
                  Mapel pendukung paling banyak 2, mengikuti Kepmendikdasmen 102/M/2025.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#151D21] mt-2 shrink-0" />
                <span>
                  267 prodi seni dan olahraga mewajibkan portofolio.
                </span>
              </li>
            </ul>
          </section>

          <div className="border-t border-dashed border-[#D9D5CB] my-1" />

          {/* Seksi 3: Kecocokan & preferensi */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Icon name="spark" className="w-5 h-5 text-[#151D21] shrink-0" />
              <h2 className="font-['Press_Start_2P',monospace] text-xs font-bold text-[#151D21]">
                Kecocokan &amp; preferensi
              </h2>
            </div>
            <ul className="space-y-2.5 text-[13px] text-[#3A444B] leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#151D21] mt-2 shrink-0" />
                <span>
                  Skor kecocokan dihitung otomatis, bukan oleh AI: 80% dari profil minat RIASEC dan 20% dari hobi. Mapel favorit (maks. 3) hanya penentu urutan saat skor sama.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#151D21] mt-2 shrink-0" />
                <span>
                  Satu preferensi punya satu jalur, SNBP atau SNBT, yang tidak bisa diubah. Untuk jalur lain, buat preferensi baru.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#151D21] mt-2 shrink-0" />
                <span>
                  Hanya satu preferensi yang aktif. Jika preferensi aktif dihapus, preferensi yang terakhir diperbarui menjadi aktif.
                </span>
              </li>
            </ul>
          </section>

          <div className="border-t border-dashed border-[#D9D5CB] my-1" />

          {/* Seksi 4: Data sekolah & alumni */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Icon name="school" className="w-5 h-5 text-[#151D21] shrink-0" />
              <h2 className="font-['Press_Start_2P',monospace] text-xs font-bold text-[#151D21]">
                Data sekolah &amp; alumni
              </h2>
            </div>
            <ul className="space-y-2.5 text-[13px] text-[#3A444B] leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#151D21] mt-2 shrink-0" />
                <span>
                  Kuota eligible sekolah diambil dari data resmi SNPMB berdasarkan NPSN.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#151D21] mt-2 shrink-0" />
                <span>
                  Data alumni per sekolah tidak tersedia publik. Reputasi alumni berasal dari isianmu sendiri, dan data alumni di versi demo ini bersifat sintetis.
                </span>
              </li>
            </ul>
          </section>

          <div className="border-t border-dashed border-[#D9D5CB] my-1" />

          {/* Seksi 5: Privasi */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Icon name="lock" className="w-5 h-5 text-[#151D21] shrink-0" />
              <h2 className="font-['Press_Start_2P',monospace] text-xs font-bold text-[#151D21]">
                Privasi
              </h2>
            </div>
            <ul className="space-y-2.5 text-[13px] text-[#3A444B] leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#151D21] mt-2 shrink-0" />
                <span>
                  Kami hanya menyimpan nama dan email dari akun Google-mu.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#151D21] mt-2 shrink-0" />
                <span>
                  Alamat cukup provinsi dan kabupaten/kota, terisi otomatis dari NPSN.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#151D21] mt-2 shrink-0" />
                <span>
                  Foto atau PDF rapor dihapus setelah nilainya diekstrak. Cek ulang hasil ekstraksi sebelum disimpan.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#151D21] mt-2 shrink-0" />
                <span>
                  Akun dan semua datamu bisa dihapus kapan saja lewat &ldquo;Hapus akun &amp; data&rdquo; di footer.
                </span>
              </li>
            </ul>
          </section>

          <div className="border-t border-dashed border-[#D9D5CB] my-1" />

          {/* Seksi 6: AI & sumber data */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Icon name="info" className="w-5 h-5 text-[#151D21] shrink-0" />
              <h2 className="font-['Press_Start_2P',monospace] text-xs font-bold text-[#151D21]">
                AI &amp; sumber data
              </h2>
            </div>
            <ul className="space-y-2.5 text-[13px] text-[#3A444B] leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#151D21] mt-2 shrink-0" />
                <span>
                  AI hanya dipakai untuk membaca rapor dan teks hobi, serta menjawab chatbot. Angka di jawaban chatbot diambil dari data internal, bukan dikarang AI.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#151D21] mt-2 shrink-0" />
                <span>
                  Soal Test Drive disusun dari kompetensi lulusan resmi (PDDikti) dan ditinjau tim. Soal buatan AI diberi label.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#151D21] mt-2 shrink-0" />
                <span>
                  Kuis minat memakai O*NET Interest Profiler, lisensi CC BY 4.0.
                </span>
              </li>
            </ul>
          </section>
        </main>

        {/* Footer Dark Theme Persis Komponen Footer Figma (169:336) */}
        <Footer />
      </div>
    </div>
  );
}
