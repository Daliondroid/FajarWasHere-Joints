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
        <Navbar backHref="/" title="Preferensi" />

        <main className="p-4 flex-1 flex flex-col font-['Outfit',sans-serif]">
          {/* Header Label Kategori */}
          <div className="mb-2">
            <span className="font-['Press_Start_2P',monospace] text-[9px] text-[#277EFD] tracking-wider uppercase">
              PREFERENSI
            </span>
          </div>

          {isEmpty ? (
            /* ================= M05: PREFERENSI KOSONG (node 173:476) ================= */
            <div className="flex-1 flex flex-col">
              <h1 className="font-['Press_Start_2P',monospace] text-sm sm:text-base text-[#151D21] mb-2 leading-relaxed">
                Simpan beberapa rencana sekaligus
              </h1>

              <p className="text-xs text-[#6B7680] mb-5 leading-relaxed">
                Buat preferensi terpisah untuk SNBP dan SNBT. Rekomendasi, chat, dan Test Drive selalu mengikuti preferensi yang aktif.
              </p>

              {/* Legenda SNBP & SNBT */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 bg-[#FEBD01] border border-[#151D21]" />
                  <span className="text-xs text-[#151D21] font-medium">SNBP · jalur prestasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 bg-[#277EFD] border border-[#151D21]" />
                  <span className="text-xs text-[#151D21] font-medium">SNBT · jalur tes</span>
                </div>
              </div>

              {/* Card Tambah Preferensi (M05) */}
              <Link
                href="/preferensi/baru"
                className="w-full p-4 bg-white border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-3.5 hover:bg-gray-50 transition-all mb-4"
              >
                <div className="w-10 h-10 bg-[#FFFDF0] border-2 border-[#151D21] flex items-center justify-center shrink-0">
                  <Icon name="plus" className="w-5 h-5 text-[#151D21]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-[#151D21]">
                    Tambah preferensi
                  </span>
                  <span className="text-xs text-[#6B7680]">
                    Buat skenario baru untuk SNBP atau SNBT
                  </span>
                </div>
              </Link>

              {/* Keterangan M05 */}
              <p className="text-xs text-[#6B7680] leading-relaxed text-center mt-auto pb-6">
                Belum ada preferensi. Mulai dari jurusan yang paling kamu incar dulu.
              </p>
            </div>
          ) : (
            /* ================= M06: PREFERENSI TERSIMPAN (node 173:518) ================= */
            <div className="flex-1 flex flex-col">
              <h1 className="font-['Press_Start_2P',monospace] text-sm sm:text-base text-[#151D21] mb-2 leading-relaxed">
                Preferensimu ({savedList.length})
              </h1>

              <p className="text-xs text-[#6B7680] mb-4 leading-relaxed">
                Ketuk JADIKAN AKTIF untuk berganti. Rekomendasi, chat, dan Test Drive langsung mengikuti.
              </p>

              {/* Legenda SNBP & SNBT */}
              <div className="flex items-center gap-4 mb-5 pb-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 bg-[#FEBD01] border border-[#151D21]" />
                  <span className="text-xs text-[#151D21] font-medium">SNBP · jalur prestasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 bg-[#277EFD] border border-[#151D21]" />
                  <span className="text-xs text-[#151D21] font-medium">SNBT · jalur tes</span>
                </div>
              </div>

              {/* List Kartu Preferensi Persis Figma M06 */}
              <div className="flex flex-col gap-4 mb-5">
                {savedList.map((item) => {
                  const isSNBP = item.jalur === 'snbp';
                  const isAktif = item.is_aktif;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] bg-white transition-all ${
                        isAktif ? 'bg-[#FCFAF7]' : ''
                      }`}
                    >
                      {/* Baris Atas: Jalur + Status Aktif */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 border-2 border-[#151D21] font-['Press_Start_2P',monospace] text-[8px] font-bold ${
                              isSNBP
                                ? 'bg-[#FEBD01] text-[#151D21]'
                                : 'bg-[#277EFD] text-white'
                            }`}
                          >
                            {isSNBP ? 'SNBP' : 'SNBT'}
                          </span>
                          <span className="text-xs text-[#6B7680]">
                            {isSNBP ? 'Jalur prestasi' : 'Jalur tes UTBK'}
                          </span>
                        </div>

                        {isAktif && (
                          <span className="px-2 py-0.5 bg-[#22A94F] text-white border-2 border-[#151D21] font-['Press_Start_2P',monospace] text-[7px] font-bold flex items-center gap-1 shadow-[1px_1px_0px_#151D21]">
                            <Icon name="check" className="w-3 h-3 text-white" />
                            AKTIF
                          </span>
                        )}
                      </div>

                      {/* Nama Preferensi & Kode Holland */}
                      <h3 className="font-['Press_Start_2P',monospace] text-xs font-bold text-[#151D21] mb-1">
                        {item.nama}
                      </h3>
                      <p className="text-xs text-[#6B7680] mb-3 font-medium">
                        {item.kode_holland || 'ICR'} · {item.nama_karakter || 'Pemikir Sistematis'}
                      </p>

                      {/* Box REKOMENDASI TERATAS (Persis M06) */}
                      <div className="bg-[#F9F8F6] border border-[#D9D5CB] p-3 mb-3 flex flex-col gap-1">
                        <span className="font-['Press_Start_2P',monospace] text-[8px] text-[#277EFD] tracking-wider uppercase">
                          REKOMENDASI TERATAS
                        </span>
                        <div className="font-bold text-sm text-[#151D21]">
                          {item.rekomendasi_teratas?.prodi || 'Teknologi Informasi'} · {item.rekomendasi_teratas?.kampus || 'UGM'}
                        </div>
                        <div className="text-xs text-[#6B7680]">
                          Cocok {item.rekomendasi_teratas?.cocok || 94}% · Peluang {item.rekomendasi_teratas?.peluang || '10–20% (estimasi)'}
                        </div>
                      </div>

                      {/* Footer Kartu: Tanggal & Aksi */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <span className="text-[11px] text-[#6B7680]">
                          Diperbarui {item.created_at || '15 Okt 2026'}
                        </span>

                        <div className="flex items-center gap-2">
                          {!isAktif && (
                            <button
                              type="button"
                              onClick={() => setAktif(item.id)}
                              className="px-2.5 py-1.5 bg-white hover:bg-gray-50 border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[8px] text-[#151D21] cursor-pointer transition-all"
                            >
                              JADIKAN AKTIF
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus preferensi "${item.nama}"?`)) {
                                hapusPreferensi(item.id);
                              }
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                            aria-label={`Hapus ${item.nama}`}
                          >
                            <Icon name="trash" className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Card Tambah Preferensi (M06) */}
              <Link
                href="/preferensi/baru"
                className="w-full p-3.5 bg-white border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-3.5 hover:bg-gray-50 transition-all mb-4"
              >
                <div className="w-9 h-9 bg-[#FFFDF0] border-2 border-[#151D21] flex items-center justify-center shrink-0">
                  <Icon name="plus" className="w-4 h-4 text-[#151D21]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-[#151D21]">
                    Tambah preferensi
                  </span>
                  <span className="text-xs text-[#6B7680]">
                    Buat skenario baru untuk SNBP atau SNBT
                  </span>
                </div>
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
