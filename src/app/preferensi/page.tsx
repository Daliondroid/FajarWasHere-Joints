'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/ui/TopBar';
import { Icon } from '@/components/ui/Icon';
import { usePreferensiStorage } from '@/components/preferensi/usePreferensiStorage';

export default function PreferensiIndexPage() {
  const router = useRouter();
  const { savedList, isLoaded, setAktif, hapusPreferensi, updateDraft } = usePreferensiStorage();

  // State untuk Bottom Sheet M07 (Preferensi Baru)
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [namaBaru, setNamaBaru] = useState('Informatika Impian');
  const [jalurBaru, setJalurBaru] = useState<'snbp' | 'snbt'>('snbp');
  const [tahunLulus, setTahunLulus] = useState('2027 · kelas 12 sekarang');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex justify-center items-center">
        <p className="font-['Press_Start_2P',monospace] text-xs text-[#151D21]">Memuat...</p>
      </div>
    );
  }

  const isEmpty = savedList.length === 0;

  const handleOpenSheet = () => {
    setNamaBaru('Informatika Impian');
    setJalurBaru('snbp');
    setErrorMsg('');
    setIsSheetOpen(true);
  };

  const handleBuatPreferensi = () => {
    if (!namaBaru.trim()) {
      setErrorMsg('Harap beri nama preferensi kamu!');
      return;
    }
    updateDraft({
      nama: namaBaru.trim(),
      jalur: jalurBaru,
      tahun_lulus: tahunLulus,
    });
    setIsSheetOpen(false);
    router.push('/preferensi/riasec');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex justify-center">
      <div className="w-full max-w-[402px] bg-white border-x-2 border-[#151D21] flex flex-col min-h-screen relative">
        {/* TopBar sesuai Figma AST (node 80:108) */}
        <TopBar title="Preferensi" onBack={() => router.push('/')} />

        <main className="p-6 pb-8 flex-1 flex flex-col font-['Outfit',sans-serif]">
          {/* Header Tag Kategori */}
          <div className="mb-1">
            <span className="font-['Pixelify_Sans',sans-serif] text-[12px] font-medium text-[#277EFD] tracking-wider uppercase">
              PREFERENSI
            </span>
          </div>

          {isEmpty ? (
            /* ================= M05: PREFERENSI KOSONG (node 173:476) ================= */
            <div className="flex-1 flex flex-col">
              <h1 className="font-['Press_Start_2P',monospace] text-sm sm:text-base text-[#151D21] mb-2 leading-relaxed">
                Simpan beberapa rencana sekaligus
              </h1>

              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#6B7680] mb-5 leading-relaxed">
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
              <button
                type="button"
                onClick={handleOpenSheet}
                className="w-full p-4 bg-transparent border-2 border-dashed border-[#151D21] flex items-center gap-3.5 hover:bg-black/5 transition-all text-left cursor-pointer mb-6"
              >
                <div className="w-10 h-10 bg-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] flex items-center justify-center shrink-0">
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
              </button>

              {/* Keterangan M05 */}
              <p className="text-xs text-[#6B7680] leading-relaxed text-center mt-auto pb-4">
                Belum ada preferensi. Mulai dari jurusan yang paling kamu incar dulu.
              </p>
            </div>
          ) : (
            /* ================= M06: PREFERENSI TERSIMPAN (node 173:518) ================= */
            <div className="flex-1 flex flex-col">
              <h1 className="font-['Press_Start_2P',monospace] text-sm sm:text-base text-[#151D21] mb-2 leading-relaxed">
                Preferensimu ({savedList.length})
              </h1>

              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#6B7680] mb-5 leading-relaxed">
                Ketuk JADIKAN AKTIF untuk berganti. Rekomendasi, chat, dan Test Drive langsung mengikuti.
              </p>

              {/* List Kartu Preferensi Persis Figma M06 */}
              <div className="flex flex-col gap-4 mb-5">
                {savedList.map((item) => {
                  const isSNBP = item.jalur === 'snbp';
                  const isAktif = item.is_aktif;

                  // Warna background kartu sesuai Figma AST:
                  // Card 0 (Active SNBP): #FEBD01, (Active SNBT): #277EFD
                  // Inactive SNBP: #FFE58A, Inactive SNBT: #BBD5FE
                  const cardBgClass = isAktif
                    ? isSNBP
                      ? 'bg-[#FEBD01]'
                      : 'bg-[#277EFD]'
                    : isSNBP
                    ? 'bg-[#FFE58A]'
                    : 'bg-[#BBD5FE]';

                  return (
                    <div
                      key={item.id}
                      className={`p-4 border-2 border-[#151D21] shadow-[5px_5px_0px_#151D21] transition-all flex flex-col gap-3 ${cardBgClass}`}
                    >
                      {/* Baris Atas: Jalur + Status Aktif */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-[#151D21] text-white font-['Press_Start_2P',monospace] text-[8px] font-bold">
                            {isSNBP ? 'SNBP' : 'SNBT'}
                          </span>
                          <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#151D21] font-medium">
                            {isSNBP ? 'Jalur prestasi' : 'Jalur tes UTBK'}
                          </span>
                        </div>

                        {isAktif && (
                          <div className="px-2 py-0.5 bg-white border border-[#151D21] font-['Press_Start_2P',monospace] text-[8px] text-[#22A94F] font-bold flex items-center gap-1 shadow-[1px_1px_0px_#151D21]">
                            <Icon name="check" className="w-3 h-3 text-[#22A94F]" />
                            <span>AKTIF</span>
                          </div>
                        )}
                      </div>

                      {/* Nama Preferensi & Kode Holland */}
                      <div>
                        <h2 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm font-bold text-[#151D21] mb-1">
                          {item.nama}
                        </h2>
                        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#3A444B] font-medium">
                          {item.kode_holland || 'ICR'} · {item.nama_karakter || 'Pemikir Sistematis'}
                        </p>
                      </div>

                      {/* Box REKOMENDASI TERATAS (Figma M06) */}
                      <div className="bg-white border-2 border-[#151D21] p-3 flex flex-col gap-1">
                        <span className="font-['Pixelify_Sans',sans-serif] text-[10px] text-[#6B7680] tracking-wider uppercase font-semibold">
                          REKOMENDASI TERATAS
                        </span>
                        <div className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm text-[#151D21]">
                          {item.rekomendasi_teratas?.prodi || 'Teknologi Informasi'} · {item.rekomendasi_teratas?.kampus || 'UGM'}
                        </div>
                        <div className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#3A444B]">
                          Cocok {item.rekomendasi_teratas?.cocok || 94}% · Peluang {item.rekomendasi_teratas?.peluang || '10–20% (estimasi)'}
                        </div>
                      </div>

                      {/* Footer Kartu: Tanggal & Aksi */}
                      <div className="flex items-center justify-between pt-1">
                        {isAktif ? (
                          <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#3A444B]">
                            Diperbarui {item.created_at || '15 Okt 2026'}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setAktif(item.id)}
                            className="px-2.5 py-1.5 bg-white hover:bg-gray-50 border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[8px] text-[#151D21] cursor-pointer transition-all flex items-center gap-1.5"
                          >
                            <Icon name="check" className="w-3 h-3 text-[#151D21]" />
                            <span>JADIKAN AKTIF</span>
                          </button>
                        )}

                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            type="button"
                            onClick={() => {
                              updateDraft({
                                ...(item.data || {}),
                                nama: item.nama,
                                jalur: item.jalur,
                              });
                              router.push('/preferensi/baru');
                            }}
                            className="w-8 h-8 bg-white hover:bg-gray-50 border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] flex items-center justify-center cursor-pointer transition-all active:translate-x-[1px] active:translate-y-[1px]"
                            aria-label={`Edit ${item.nama}`}
                          >
                            <Icon name="edit" className="w-4 h-4 text-[#151D21]" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus preferensi "${item.nama}"?`)) {
                                hapusPreferensi(item.id);
                              }
                            }}
                            className="w-8 h-8 bg-white hover:bg-gray-50 border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] flex items-center justify-center cursor-pointer transition-all active:translate-x-[1px] active:translate-y-[1px]"
                            aria-label={`Hapus ${item.nama}`}
                          >
                            <Icon name="dots" className="w-4 h-4 text-[#151D21]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Card Tambah Preferensi (M06) */}
              <button
                type="button"
                onClick={handleOpenSheet}
                className="w-full p-4 bg-transparent border-2 border-dashed border-[#151D21] flex items-center gap-3.5 hover:bg-black/5 transition-all text-left cursor-pointer mb-4"
              >
                <div className="w-10 h-10 bg-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] flex items-center justify-center shrink-0">
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
              </button>
            </div>
          )}
        </main>

        {/* ================= M07: BOTTOM SHEET PREFERENSI BARU ================= */}
        {isSheetOpen && (
          <div
            className="fixed inset-0 z-50 bg-[#151D21]/60 flex items-end justify-center animate-fade-in"
            onClick={() => setIsSheetOpen(false)}
          >
            <div
              className="w-full max-w-[402px] bg-white border-t-2 border-x-2 border-[#151D21] shadow-[0px_-6px_20px_rgba(0,0,0,0.2)] p-5 pb-7 flex flex-col gap-4 animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle Bar */}
              <div className="w-12 h-1.5 bg-[#D3D6DA] rounded-full mx-auto" />

              {/* Judul Bottom Sheet */}
              <h2 className="font-['Press_Start_2P',monospace] text-sm text-[#151D21]">
                Preferensi baru
              </h2>

              {/* Field 1: Nama Preferensi */}
              <div>
                <label className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#3A444B] mb-1.5">
                  Nama preferensi
                </label>
                <input
                  type="text"
                  value={namaBaru}
                  onChange={(e) => {
                    setNamaBaru(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Informatika Impian"
                  maxLength={40}
                  className="w-full p-3 bg-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] text-sm font-medium text-[#151D21] placeholder:text-gray-400 focus:outline-none focus:bg-[#EEF5FF]"
                />
                {errorMsg && (
                  <p className="text-xs text-[#F1402E] font-bold mt-1.5">{errorMsg}</p>
                )}
              </div>

              {/* Field 2: Pilihan Jalur Side-by-Side (Figma M07) */}
              <div>
                <label className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#151D21] mb-2">
                  Pilih jalur
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Kartu Jalur SNBP */}
                  <div
                    onClick={() => setJalurBaru('snbp')}
                    className={`p-3.5 border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] cursor-pointer transition-all flex flex-col justify-between ${
                      jalurBaru === 'snbp'
                        ? 'bg-[#FEBD01]'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-[#151D21] flex items-center justify-center bg-white">
                        {jalurBaru === 'snbp' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#151D21]" />
                        )}
                      </div>
                      <span className="font-['Press_Start_2P',monospace] text-xs font-bold text-[#151D21]">
                        SNBP
                      </span>
                    </div>
                    <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#3A444B] leading-snug">
                      Rapor smt 1–5, TKA & prestasi
                    </span>
                  </div>

                  {/* Kartu Jalur SNBT */}
                  <div
                    onClick={() => setJalurBaru('snbt')}
                    className={`p-3.5 border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] cursor-pointer transition-all flex flex-col justify-between ${
                      jalurBaru === 'snbt'
                        ? 'bg-[#277EFD] text-white'
                        : 'bg-[#EAF2FF] border-[#277EFD] hover:bg-blue-100/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-[#151D21] flex items-center justify-center bg-white">
                        {jalurBaru === 'snbt' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#151D21]" />
                        )}
                      </div>
                      <span
                        className={`font-['Press_Start_2P',monospace] text-xs font-bold ${
                          jalurBaru === 'snbt' ? 'text-white' : 'text-[#277EFD]'
                        }`}
                      >
                        SNBT
                      </span>
                    </div>
                    <span
                      className={`font-['Plus_Jakarta_Sans',sans-serif] text-[11px] leading-snug ${
                        jalurBaru === 'snbt' ? 'text-blue-100' : 'text-[#3A444B]'
                      }`}
                    >
                      Nilai try out 7 subtes UTBK
                    </span>
                  </div>
                </div>
              </div>

              {/* Field 3: Tahun lulus SMA/SMK/MA */}
              <div>
                <label className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#3A444B] mb-1.5">
                  Tahun lulus SMA/SMK/MA
                </label>
                <select
                  value={tahunLulus}
                  onChange={(e) => setTahunLulus(e.target.value)}
                  className="w-full p-3 bg-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] text-xs font-medium text-[#151D21] focus:outline-none cursor-pointer"
                >
                  <option value="2027 · kelas 12 sekarang">2027 · kelas 12 sekarang</option>
                  <option value="2026 · alumni 1 tahun">2026 · alumni 1 tahun</option>
                  <option value="2025 · alumni 2 tahun">2025 · alumni 2 tahun</option>
                </select>
              </div>

              {/* Aksi Bottom Sheet Persis Figma M07 */}
              <div className="pt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsSheetOpen(false)}
                  className="py-3 bg-white hover:bg-gray-50 text-[#151D21] border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[10px] text-center transition-all cursor-pointer"
                >
                  BATAL
                </button>
                <button
                  type="button"
                  onClick={handleBuatPreferensi}
                  className="py-3 bg-[#277EFD] hover:bg-[#1E6FD9] text-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[10px] text-center transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>BUAT & MULAI</span>
                  <Icon name="arrow-right" className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
