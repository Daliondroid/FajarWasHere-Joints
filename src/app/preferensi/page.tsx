'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Icon } from '@/components/ui/Icon';
import { usePreferensiStorage } from '@/components/preferensi/usePreferensiStorage';

export default function PreferensiIndexPage() {
  const { savedList, isLoaded, setAktif, hapusPreferensi } = usePreferensiStorage();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex justify-center items-center">
        <p className="font-['Press_Start_2P',monospace] text-xs">Memuat...</p>
      </div>
    );
  }

  const isEmpty = savedList.length === 0;

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex justify-center">
      <div className="w-full max-w-[402px] bg-white border-x-2 border-black flex flex-col min-h-screen">
        <Navbar backHref="/" title="Preferensi Jurusan" />

        <main className="p-4 flex-1 flex flex-col">
          {isEmpty ? (
            /* ================= M05: PREFERENSI KOSONG ================= */
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
              <span className="inline-block px-2.5 py-1 bg-[#EEF5FF] border border-black text-[#277EFD] font-['Press_Start_2P',monospace] text-[8px] mb-3 shadow-[1px_1px_0px_#000000]">
                PREFERENSI JURUSAN
              </span>

              <h1 className="font-['Press_Start_2P',monospace] text-sm text-black mb-3 leading-relaxed max-w-[320px]">
                Kamu belum punya preferensi tersimpan
              </h1>

              <p className="font-['Outfit',sans-serif] text-xs text-gray-600 mb-8 max-w-[300px] leading-relaxed">
                Buat preferensi pertamamu untuk melihat rekomendasi jurusan dan peluang kelulusan resmi.
              </p>

              {/* Empty state box */}
              <div className="w-24 h-24 bg-[#FFFDF0] border-2 border-black flex items-center justify-center mb-8 shadow-[3px_3px_0px_#000000]">
                <Icon name="spark" className="w-10 h-10 text-[#FBBC05]" />
              </div>

              <Link
                href="/preferensi/baru"
                className="w-full max-w-[320px] bg-[#4285F4] hover:bg-[#277EFD] text-white border-2 border-black shadow-[4px_4px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] py-3.5 text-center font-['Press_Start_2P',monospace] text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Icon name="plus" className="w-4 h-4 text-white" />
                <span>BUAT PREFERENSI PERTAMA</span>
              </Link>
            </div>
          ) : (
            /* ================= M06: PREFERENSI TERSIMPAN ================= */
            <div className="flex-1 flex flex-col">
              <div className="mb-5">
                <span className="inline-block px-2 py-0.5 bg-[#EEF5FF] border border-black text-[#277EFD] font-['Press_Start_2P',monospace] text-[8px] mb-2 shadow-[1px_1px_0px_#000000]">
                  PREFERENSI JURUSAN
                </span>
                <h1 className="font-['Press_Start_2P',monospace] text-sm text-black mb-1.5 leading-snug">
                  Preferensi Tersimpan
                </h1>
                <p className="font-['Outfit',sans-serif] text-xs text-gray-600">
                  Pilih preferensi aktif untuk melihat rekomendasi jurusan dan peluang kelulusan.
                </p>
              </div>

              {/* List Kartu Preferensi */}
              <div className="space-y-3.5 mb-6">
                {savedList.map((item) => {
                  const isSNBP = item.jalur === 'snbp';
                  const isAktif = item.is_aktif;

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 border-2 border-black shadow-[3px_3px_0px_#000000] bg-white transition-all ${
                        isAktif ? 'ring-2 ring-black bg-[#F8FAFC]' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 border border-black font-['Press_Start_2P',monospace] text-[8px] font-bold ${
                              isSNBP
                                ? 'bg-[#FBBC05] text-black'
                                : 'bg-[#4285F4] text-white'
                            }`}
                          >
                            {item.jalur.toUpperCase()}
                          </span>

                          {isAktif && (
                            <span className="px-2 py-0.5 bg-[#34A853] text-white border border-black font-['Press_Start_2P',monospace] text-[7px] font-bold">
                              AKTIF
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus preferensi "${item.nama}"?`)) {
                              hapusPreferensi(item.id);
                            }
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                          aria-label={`Hapus ${item.nama}`}
                        >
                          <Icon name="trash" className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="font-['Outfit',sans-serif] font-bold text-base text-black mb-1">
                        {item.nama}
                      </h3>

                      <p className="font-['Outfit',sans-serif] text-xs text-gray-600 mb-3">
                        {item.ringkasan}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <span className="text-[11px] text-gray-500 font-['Outfit',sans-serif]">
                          Dibuat {item.created_at}
                        </span>

                        {!isAktif ? (
                          <button
                            type="button"
                            onClick={() => setAktif(item.id)}
                            className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-black shadow-[1px_1px_0px_#000000] font-['Press_Start_2P',monospace] text-[8px] text-black active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                          >
                            JADIKAN AKTIF
                          </button>
                        ) : (
                          <span className="font-['Press_Start_2P',monospace] text-[8px] text-[#34A853] flex items-center gap-1">
                            <Icon name="check" className="w-3 h-3 text-[#34A853]" />
                            SEDANG DIGUNAKAN
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="mt-auto pt-4 space-y-3">
                <Link
                  href="/preferensi/baru"
                  className="w-full py-3 bg-white hover:bg-gray-50 text-black border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[9px] flex items-center justify-center gap-2 transition-all"
                >
                  <Icon name="plus" className="w-3.5 h-3.5 text-black" />
                  <span>TAMBAH PREFERENSI BARU</span>
                </Link>

                <Link
                  href="/cocokin"
                  className="w-full py-3.5 bg-[#4285F4] hover:bg-[#277EFD] text-white border-2 border-black shadow-[4px_4px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] font-['Press_Start_2P',monospace] text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <span>LIHAT REKOMENDASI</span>
                  <Icon name="arrow-right" className="w-4 h-4 text-white" />
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
