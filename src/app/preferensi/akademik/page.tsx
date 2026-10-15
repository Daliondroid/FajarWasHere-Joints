'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Icon } from '@/components/ui/Icon';
import { usePreferensiStorage } from '@/components/preferensi/usePreferensiStorage';
import ModalPilihTka from '@/components/preferensi/ModalPilihTka';

export default function PreferensiAkademikPage() {
  const router = useRouter();
  const { draft, updateDraft, simpanDraftSebagaiPreferensi } = usePreferensiStorage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Jalur aktif dari draft
  const isSNBP = draft.jalur === 'snbp';

  // State SNBP
  const [npsn, setNpsn] = useState(draft.npsn || '20403161');
  const [raporRata, setRaporRata] = useState(draft.rapor_rata || 89.4);
  const [tkaWajib, setTkaWajib] = useState({
    matematika: draft.nilai_tka?.matematika || 88,
    bahasa_indonesia: draft.nilai_tka?.bahasa_indonesia || 86,
    bahasa_inggris: draft.nilai_tka?.bahasa_inggris || 90,
  });
  const [tkaPilihan, setTkaPilihan] = useState<Record<string, number>>(
    draft.nilai_tka?.pilihan || { Fisika: 85, Informatika: 92 }
  );
  const [isTkaModalOpen, setIsTkaModalOpen] = useState(false);

  const [reputasiAlumni, setReputasiAlumni] = useState(
    draft.reputasi_alumni || 'sangat_tinggi'
  );
  const [kampusAlumni, setKampusAlumni] = useState<string[]>(
    draft.kampus_alumni && draft.kampus_alumni.length > 0
      ? draft.kampus_alumni
      : ['UGM', 'UNY', 'UPN "VETERAN" YK']
  );
  const [newCampusInput, setNewCampusInput] = useState('');

  // State SNBT
  const [skorTo, setSkorTo] = useState(
    draft.skor_to || {
      pu: 720,
      ppu: 680,
      pbm: 650,
      pk: 700,
      lit_ind: 640,
      lit_ing: 710,
      pm: 690,
    }
  );

  const rataTo = Math.round(
    Object.values(skorTo).reduce((a, b) => a + Number(b), 0) / 7
  );

  const handleSaveTkaMapel = (mapelList: string[]) => {
    const updated: Record<string, number> = {};
    mapelList.forEach((m) => {
      updated[m] = tkaPilihan[m] || 85;
    });
    setTkaPilihan(updated);
  };

  const handleAddCampus = () => {
    if (!newCampusInput.trim()) return;
    if (kampusAlumni.length >= 10) {
      alert('Maksimal 10 kampus basis alumni');
      return;
    }
    setKampusAlumni((prev) => [...prev, newCampusInput.trim().toUpperCase()]);
    setNewCampusInput('');
  };

  const handleRemoveCampus = (name: string) => {
    setKampusAlumni((prev) => prev.filter((c) => c !== name));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      updateDraft({
        npsn,
        rapor_rata: Number(raporRata),
        nilai_tka: {
          ...tkaWajib,
          pilihan: tkaPilihan,
        },
        reputasi_alumni: reputasiAlumni as 'sangat_tinggi' | 'tinggi' | 'sedang' | 'rendah',
        kampus_alumni: kampusAlumni,
        skor_to: skorTo,
      });

      await simpanDraftSebagaiPreferensi();
      router.push('/cocokin');
    } catch {
      alert('Terjadi kesalahan saat menyimpan preferensi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex justify-center">
      <div className="w-full max-w-[402px] bg-white border-x-2 border-black flex flex-col min-h-screen">
        <Navbar
          backHref="/preferensi/minat"
          title={draft.nama || (isSNBP ? 'Bahan SNBP' : 'Bahan SNBT')}
        />

        <main className="p-4 flex-1 flex flex-col font-['Outfit',sans-serif] space-y-5">
          {/* Stepper Header (M10 / M12) */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#34A853] text-white border-2 border-black flex items-center justify-center font-['Press_Start_2P',monospace] text-[10px] font-bold shadow-[1px_1px_0px_#000000]">
                ✓
              </div>
              <span className="font-['Press_Start_2P',monospace] text-[9px] text-black font-bold">
                MINAT
              </span>
            </div>

            <div className="flex-1 mx-3 h-0.5 bg-black" />

            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 border-2 border-black flex items-center justify-center font-['Press_Start_2P',monospace] text-[10px] font-bold shadow-[1px_1px_0px_#000000] ${
                  isSNBP ? 'bg-[#FBBC05] text-black' : 'bg-[#4285F4] text-white'
                }`}
              >
                2
              </div>
              <span className="font-['Press_Start_2P',monospace] text-[9px] text-black font-bold">
                BAHAN
              </span>
            </div>
          </div>

          {isSNBP ? (
            /* ========================= FORM BAHAN SNBP (M10, M11) ========================= */
            <>
              {/* Heading */}
              <div>
                <span className="inline-block px-2 py-0.5 bg-[#FFFDF0] border border-black text-[#FBBC05] font-['Press_Start_2P',monospace] text-[8px] mb-2 shadow-[1px_1px_0px_#000000]">
                  LANGKAH 2 • BAHAN SNBP
                </span>
                <h1 className="font-['Press_Start_2P',monospace] text-xs text-black mb-1.5 leading-snug">
                  Data sekolah, rapor & TKA
                </h1>
                <p className="text-xs text-gray-600">
                  Data resmi SNPMB, rapor semester 1–5, dan 2 mapel pilihan TKA Kemendikdasmen.
                </p>
              </div>

              {/* Window: SEKOLAH & AKREDITASI */}
              <div className="bg-white border-2 border-black shadow-[3px_3px_0px_#000000]">
                <div className="bg-[#FBBC05] px-3 py-1.5 border-b-2 border-black flex items-center justify-between text-black">
                  <span className="font-['Press_Start_2P',monospace] text-[8px] font-bold">
                    SEKOLAH & AKREDITASI
                  </span>
                  <span className="w-2 h-2 bg-white border border-black" />
                </div>
                <div className="p-3.5 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-black mb-1">
                      NPSN Sekolah:
                    </label>
                    <input
                      type="text"
                      value={npsn}
                      onChange={(e) => setNpsn(e.target.value)}
                      placeholder="Masukkan NPSN"
                      className="w-full p-2.5 border-2 border-black text-xs font-bold shadow-[2px_2px_0px_#000000] focus:outline-none focus:bg-[#FFFDF0]"
                    />
                  </div>
                  <div className="p-2.5 bg-[#F8FAFC] border border-black text-xs space-y-1">
                    <p className="font-bold text-black">SMAN 1 YOGYAKARTA</p>
                    <p className="text-gray-600">Akreditasi A • Kuota Siswa Eligible: 40%</p>
                  </div>
                </div>
              </div>

              {/* Window: NILAI RAPOR SEMESTER 1-5 */}
              <div className="bg-white border-2 border-black shadow-[3px_3px_0px_#000000]">
                <div className="bg-[#4285F4] px-3 py-1.5 border-b-2 border-black flex items-center justify-between text-white">
                  <span className="font-['Press_Start_2P',monospace] text-[8px]">
                    NILAI RAPOR SEMESTER 1-5
                  </span>
                  <span className="w-2 h-2 bg-white border border-black" />
                </div>
                <div className="p-3.5 space-y-3">
                  {/* Upload box */}
                  <div className="border-2 border-dashed border-black p-4 text-center bg-[#F9FAFB] cursor-pointer hover:bg-gray-100 transition-colors">
                    <Icon name="upload" className="w-6 h-6 mx-auto text-gray-500 mb-1" />
                    <p className="text-xs font-bold text-black">Unggah foto / PDF rapor (opsional)</p>
                    <p className="text-[10px] text-gray-500">Nilai akan diekstrak otomatis via OCR</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-black mb-1">
                      Rata-rata Nilai Rapor (Skala 0–100):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={raporRata}
                      onChange={(e) => setRaporRata(Number(e.target.value))}
                      className="w-full p-2.5 border-2 border-black text-sm font-bold shadow-[2px_2px_0px_#000000] focus:outline-none focus:bg-[#EEF5FF]"
                    />
                  </div>
                </div>
              </div>

              {/* Window: TES KEMAMPUAN AKADEMIK (TKA) */}
              <div className="bg-white border-2 border-black shadow-[3px_3px_0px_#000000]">
                <div className="bg-[#34A853] px-3 py-1.5 border-b-2 border-black flex items-center justify-between text-white">
                  <span className="font-['Press_Start_2P',monospace] text-[8px]">
                    TKA (3 WAJIB + 2 PILIHAN)
                  </span>
                  <span className="w-2 h-2 bg-white border border-black" />
                </div>
                <div className="p-3.5 space-y-3">
                  <p className="text-[11px] text-gray-600">
                    Nilai TKA Kemendikdasmen untuk memvalidasi bobot rapor sekolahmu.
                  </p>

                  {/* 3 Mapel Wajib */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>Matematika (Wajib)</span>
                      <input
                        type="number"
                        value={tkaWajib.matematika}
                        onChange={(e) =>
                          setTkaWajib({ ...tkaWajib, matematika: Number(e.target.value) })
                        }
                        className="w-20 p-1.5 border-2 border-black text-center font-bold"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>Bahasa Indonesia (Wajib)</span>
                      <input
                        type="number"
                        value={tkaWajib.bahasa_indonesia}
                        onChange={(e) =>
                          setTkaWajib({ ...tkaWajib, bahasa_indonesia: Number(e.target.value) })
                        }
                        className="w-20 p-1.5 border-2 border-black text-center font-bold"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>Bahasa Inggris (Wajib)</span>
                      <input
                        type="number"
                        value={tkaWajib.bahasa_inggris}
                        onChange={(e) =>
                          setTkaWajib({ ...tkaWajib, bahasa_inggris: Number(e.target.value) })
                        }
                        className="w-20 p-1.5 border-2 border-black text-center font-bold"
                      />
                    </div>
                  </div>

                  {/* 2 Mapel Pilihan (BR-18, M10b) */}
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-black">
                        2 Mapel Pilihan TKA:
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsTkaModalOpen(true)}
                        className="px-2 py-1 bg-[#EEF5FF] text-[#277EFD] border border-black font-bold text-[10px] shadow-[1px_1px_0px_#000000] cursor-pointer"
                      >
                        Ubah Mapel
                      </button>
                    </div>

                    <div className="space-y-2">
                      {Object.keys(tkaPilihan).map((mapel) => (
                        <div
                          key={mapel}
                          className="flex items-center justify-between text-xs font-bold bg-gray-50 p-2 border border-black"
                        >
                          <span>{mapel}</span>
                          <input
                            type="number"
                            value={tkaPilihan[mapel]}
                            onChange={(e) =>
                              setTkaPilihan({
                                ...tkaPilihan,
                                [mapel]: Number(e.target.value),
                              })
                            }
                            className="w-20 p-1 border-2 border-black text-center font-bold bg-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Window: WILAYAH & REPUTASI ALUMNI (M11) */}
              <div className="bg-white border-2 border-black shadow-[3px_3px_0px_#000000]">
                <div className="bg-[#EA4335] px-3 py-1.5 border-b-2 border-black flex items-center justify-between text-white">
                  <span className="font-['Press_Start_2P',monospace] text-[8px]">
                    WILAYAH & ALUMNI (SELF-REPORT)
                  </span>
                  <span className="w-2 h-2 bg-white border border-black" />
                </div>
                <div className="p-3.5 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-black mb-1">
                      Provinsi & Wilayah:
                    </label>
                    <div className="p-2.5 bg-gray-50 border border-black text-xs font-bold text-gray-700">
                      D.I. Yogyakarta • Kota Yogyakarta (Otomatis dari NPSN)
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-black mb-1.5">
                      Reputasi Alumni di PTN:
                    </label>
                    <div className="space-y-1.5">
                      {[
                        { id: 'sangat_tinggi', label: 'Langganan banjir PTN top' },
                        { id: 'tinggi', label: 'Rutin lolos PTN' },
                        { id: 'sedang', label: '1–5 siswa per tahun' },
                        { id: 'rendah', label: 'Sekolah baru / belum ada jejak' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setReputasiAlumni(opt.id as 'sangat_tinggi' | 'tinggi' | 'sedang' | 'rendah')}
                          className={`w-full p-2 border border-black text-left text-xs font-bold flex items-center justify-between cursor-pointer ${
                            reputasiAlumni === opt.id
                              ? 'bg-[#EEF5FF] text-[#277EFD] ring-1 ring-black'
                              : 'bg-white text-black'
                          }`}
                        >
                          <span>{opt.label}</span>
                          <span
                            className={`w-3.5 h-3.5 rounded-full border border-black flex items-center justify-center ${
                              reputasiAlumni === opt.id ? 'bg-[#277EFD]' : 'bg-white'
                            }`}
                          >
                            {reputasiAlumni === opt.id && (
                              <span className="w-1.5 h-1.5 bg-white rounded-full" />
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Kampus basis alumni */}
                  <div>
                    <label className="block text-xs font-bold text-black mb-1.5">
                      Kampus Basis Alumni (Maks. 10):
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newCampusInput}
                        onChange={(e) => setNewCampusInput(e.target.value)}
                        placeholder="Ketik nama PTN (mis. ITB)"
                        className="flex-1 p-2 border-2 border-black text-xs font-bold"
                      />
                      <button
                        type="button"
                        onClick={handleAddCampus}
                        className="px-3 bg-black text-white text-xs font-bold cursor-pointer"
                      >
                        + TAMBAH
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {kampusAlumni.map((camp) => (
                        <span
                          key={camp}
                          className="px-2 py-0.5 bg-[#FFFDF0] border border-black text-xs font-bold flex items-center gap-1.5"
                        >
                          {camp}
                          <button
                            type="button"
                            onClick={() => handleRemoveCampus(camp)}
                            className="text-red-500 font-bold hover:text-red-700 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* ========================= FORM BAHAN SNBT (M12) ========================= */
            <>
              <div>
                <span className="inline-block px-2 py-0.5 bg-[#EEF5FF] border border-black text-[#4285F4] font-['Press_Start_2P',monospace] text-[8px] mb-2 shadow-[1px_1px_0px_#000000]">
                  LANGKAH 2 • BAHAN SNBT
                </span>
                <h1 className="font-['Press_Start_2P',monospace] text-xs text-black mb-1.5 leading-snug">
                  Nilai try out terakhirmu
                </h1>
                <p className="text-xs text-gray-600">
                  Peluang SNBT dihitung dari skor TO dibanding estimasi skor UTBK tiap prodi.
                </p>
              </div>

              {/* Window: SUMBER & SKOR TRY OUT */}
              <div className="bg-white border-2 border-black shadow-[3px_3px_0px_#000000]">
                <div className="bg-[#4285F4] px-3 py-1.5 border-b-2 border-black flex items-center justify-between text-white">
                  <span className="font-['Press_Start_2P',monospace] text-[8px]">
                    SKOR 7 SUBTES UTBK (SKALA 200–1000)
                  </span>
                  <span className="w-2 h-2 bg-white border border-black" />
                </div>
                <div className="p-3.5 space-y-2.5">
                  {[
                    { key: 'pu' as const, label: 'Penalaran Umum (PU)' },
                    { key: 'ppu' as const, label: 'Pengetahuan & Pemahaman Umum' },
                    { key: 'pbm' as const, label: 'Pemahaman Bacaan & Menulis' },
                    { key: 'pk' as const, label: 'Pengetahuan Kuantitatif (PK)' },
                    { key: 'lit_ind' as const, label: 'Literasi Bahasa Indonesia' },
                    { key: 'lit_ing' as const, label: 'Literasi Bahasa Inggris' },
                    { key: 'pm' as const, label: 'Penalaran Matematika (PM)' },
                  ].map((sub) => (
                    <div
                      key={sub.key}
                      className="flex items-center justify-between text-xs font-bold"
                    >
                      <span className="text-gray-800">{sub.label}</span>
                      <input
                        type="number"
                        min="200"
                        max="1000"
                        value={skorTo[sub.key]}
                        onChange={(e) =>
                          setSkorTo({
                            ...skorTo,
                            [sub.key]: Number(e.target.value),
                          })
                        }
                        className="w-20 p-1.5 border-2 border-black text-center font-bold bg-white"
                      />
                    </div>
                  ))}

                  <div className="pt-2.5 border-t-2 border-black flex items-center justify-between">
                    <span className="font-['Press_Start_2P',monospace] text-[9px] text-black">
                      RATA-RATA 7 SUBTES:
                    </span>
                    <span className="font-['Press_Start_2P',monospace] text-xs font-bold text-[#4285F4]">
                      {rataTo}
                    </span>
                  </div>
                </div>
              </div>

              {/* Window: RIWAYAT TRY OUT */}
              <div className="bg-white border-2 border-black shadow-[3px_3px_0px_#000000]">
                <div className="bg-[#FBBC05] px-3 py-1.5 border-b-2 border-black flex items-center justify-between text-black">
                  <span className="font-['Press_Start_2P',monospace] text-[8px] font-bold">
                    RIWAYAT TRY OUT BULANAN
                  </span>
                  <span className="w-2 h-2 bg-white border border-black" />
                </div>
                <div className="p-3.5">
                  {/* Grafik bar sederhana */}
                  <div className="flex items-end justify-around h-32 border-b-2 border-black pb-2 mb-3">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold">612</span>
                      <div className="w-12 bg-[#4285F4] border-2 border-black h-16 shadow-[1px_1px_0px_#000000]" />
                      <span className="text-[10px] text-gray-600 font-bold">AGU</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold">646</span>
                      <div className="w-12 bg-[#34A853] border-2 border-black h-20 shadow-[1px_1px_0px_#000000]" />
                      <span className="text-[10px] text-gray-600 font-bold">SEP</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold">684</span>
                      <div className="w-12 bg-[#FBBC05] border-2 border-black h-24 shadow-[1px_1px_0px_#000000]" />
                      <span className="text-[10px] text-gray-600 font-bold">OKT</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="px-2 py-0.5 bg-[#34A853] text-white border border-black text-[10px]">
                      +72 SEJAK AGUSTUS
                    </span>
                    <span className="text-gray-700">Rata-rata naik tiap bulan</span>
                  </div>
                </div>
              </div>

              {/* Window: PORTOFOLIO */}
              <div className="bg-white border-2 border-black shadow-[3px_3px_0px_#000000]">
                <div className="bg-[#34A853] px-3 py-1.5 border-b-2 border-black flex items-center justify-between text-white">
                  <span className="font-['Press_Start_2P',monospace] text-[8px]">
                    PORTOFOLIO (OPSIONAL)
                  </span>
                  <span className="w-2 h-2 bg-white border border-black" />
                </div>
                <div className="p-3.5">
                  <div className="border-2 border-dashed border-black p-4 text-center bg-[#F9FAFB] cursor-pointer hover:bg-gray-100 transition-colors">
                    <Icon name="upload" className="w-6 h-6 mx-auto text-gray-500 mb-1" />
                    <p className="text-xs font-bold text-black">Unggah portofolio seni / olahraga</p>
                    <p className="text-[10px] text-gray-500">PDF, JPG, atau MP4 • maks. 25 MB</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Bottom Action Bar */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => router.push('/preferensi/minat')}
              className="flex-1 py-3 bg-white hover:bg-gray-100 border-2 border-black shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[9px] text-black flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Icon name="back" className="w-3.5 h-3.5 text-black" />
              <span>KEMBALI</span>
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-[#34A853] hover:bg-[#22A94F] text-white border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[9px] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'MENYIMPAN...' : 'COCOKKAN!'}</span>
              <Icon name="spark" className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </main>

        {/* Modal Pilih 2 Mapel Pilihan TKA (M10b) */}
        <ModalPilihTka
          isOpen={isTkaModalOpen}
          selected={Object.keys(tkaPilihan)}
          onSave={handleSaveTkaMapel}
          onClose={() => setIsTkaModalOpen(false)}
        />
      </div>
    </div>
  );
}
