'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
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
  const [raporRata, setRaporRata] = useState(draft.rapor_rata || 88.4);
  const [peringkat, setPeringkat] = useState(36);
  const [mapelPendukung, setMapelPendukung] = useState({
    nama: 'Matematika Tingkat Lanjut',
    nilai: 91,
  });
  const [tkaWajib, setTkaWajib] = useState({
    bahasa_indonesia: draft.nilai_tka?.bahasa_indonesia || 82.5,
    matematika: draft.nilai_tka?.matematika || 88.0,
    bahasa_inggris: draft.nilai_tka?.bahasa_inggris || 85.0,
  });
  const [tkaPilihan, setTkaPilihan] = useState<Record<string, number>>(
    draft.nilai_tka?.pilihan || { 'Matematika Tingkat Lanjut': 86.0, Fisika: 84.5 }
  );
  const [isTkaModalOpen, setIsTkaModalOpen] = useState(false);

  const [reputasiAlumni, setReputasiAlumni] = useState(
    draft.reputasi_alumni || 'Langganan banjir PTN top'
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
      updated[m] = tkaPilihan[m] || 85.0;
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
        reputasi_alumni: 'sangat_tinggi',
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
          title={draft.nama || (isSNBP ? 'Informatika Impian' : 'Cadangan SNBT')}
        />

        <main className="p-4 flex-1 flex flex-col font-['Outfit',sans-serif] space-y-5">
          {/* Stepper Header (M10 / M12) */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#22A94F] text-white border-2 border-[#151D21] flex items-center justify-center font-['Press_Start_2P',monospace] text-[10px] font-bold shadow-[1px_1px_0px_#151D21]">
                ✓
              </div>
              <span className="font-['Press_Start_2P',monospace] text-[9px] text-[#151D21] font-bold">
                MINAT
              </span>
            </div>

            <div className="flex-1 mx-3 h-0.5 bg-[#151D21]" />

            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 border-2 border-[#151D21] flex items-center justify-center font-['Press_Start_2P',monospace] text-[10px] font-bold shadow-[1px_1px_0px_#151D21] ${
                  isSNBP ? 'bg-[#FEBD01] text-[#151D21]' : 'bg-[#277EFD] text-white'
                }`}
              >
                2
              </div>
              <span className="font-['Press_Start_2P',monospace] text-[9px] text-[#151D21] font-bold">
                BAHAN
              </span>
            </div>
          </div>

          {isSNBP ? (
            /* ========================= FORM BAHAN SNBP (M10, M10b, M11) ========================= */
            <>
              {/* Heading */}
              <div>
                <span className="font-['Press_Start_2P',monospace] text-[8px] sm:text-[9px] text-[#277EFD] tracking-wider uppercase block mb-1.5">
                  LANGKAH 2 · BAHAN SNBP
                </span>
                <h1 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-[#151D21] leading-relaxed">
                  Sekolah, rapor & TKA
                </h1>
                <p className="text-xs text-[#6B7680] mt-1 leading-relaxed">
                  Dipakai untuk cek kuota eligible sekolah dan menghitung peluang SNBP.
                </p>
              </div>

              {/* 1. SEKOLAH */}
              <div className="bg-white border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] p-3.5 space-y-3">
                <span className="font-['Press_Start_2P',monospace] text-[8px] text-[#277EFD] tracking-wider uppercase block">
                  1 · SEKOLAH
                </span>
                <div>
                  <label className="text-xs text-[#6B7680] block mb-1">
                    NPSN atau nama sekolah
                  </label>
                  <input
                    type="text"
                    value={npsn}
                    onChange={(e) => setNpsn(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#151D21] text-xs font-bold text-[#151D21]"
                  />
                </div>

                <div className="bg-[#F9F8F6] border border-[#D9D5CB] p-3 flex flex-col gap-1.5">
                  <div className="font-bold text-sm text-[#151D21]">
                    SMAN 8 Yogyakarta
                  </div>
                  <div className="text-xs text-[#6B7680]">
                    Kota Yogyakarta · D.I. Yogyakarta
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-[#EEF5FF] border border-[#277EFD] text-[#277EFD] font-bold text-[10px]">
                      AKREDITASI A
                    </span>
                    <span className="text-[11px] text-[#6B7680]">terkunci dari data resmi</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 pt-2 border-t border-gray-200">
                    <span className="text-xs font-semibold text-[#151D21]">
                      Kuota eligible: 115 dari 287 siswa (40%)
                    </span>
                    <span className="px-1.5 py-0.5 bg-[#EAF7EE] text-[#22A94F] font-bold text-[9px] border border-[#22A94F]">
                      RESMI · SNPMB 2026
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. RAPOR & PERINGKAT */}
              <div className="bg-white border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] p-3.5 space-y-3">
                <span className="font-['Press_Start_2P',monospace] text-[8px] text-[#277EFD] tracking-wider uppercase block">
                  2 · RAPOR & PERINGKAT
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#151D21] font-medium block mb-1">
                      Rata-rata rapor smt 1–5
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={raporRata}
                      onChange={(e) => setRaporRata(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border border-[#151D21] text-xs font-bold text-[#151D21]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#151D21] font-medium block mb-1">
                      Peringkat paralel (dari 287)
                    </label>
                    <input
                      type="number"
                      value={peringkat}
                      onChange={(e) => setPeringkat(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border border-[#151D21] text-xs font-bold text-[#151D21]"
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-[#EAF7EE] border border-[#22A94F] text-xs text-[#22A94F] font-medium">
                  Masuk kuota eligible sekolah ({peringkat} ≤ 115)
                </div>

                <div>
                  <label className="text-xs font-bold text-[#151D21] block mb-1.5">
                    Mapel pendukung
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={mapelPendukung.nama}
                      onChange={(e) => setMapelPendukung((p) => ({ ...p, nama: e.target.value }))}
                      className="flex-1 p-2 bg-white border border-[#151D21] text-xs"
                    />
                    <input
                      type="number"
                      value={mapelPendukung.nilai}
                      onChange={(e) => setMapelPendukung((p) => ({ ...p, nilai: Number(e.target.value) }))}
                      className="w-16 p-2 bg-white border border-[#151D21] text-xs font-bold text-center"
                    />
                  </div>
                  <span className="text-[11px] text-[#277EFD] font-bold block mt-1 cursor-pointer">
                    + Tambah mapel pendukung
                  </span>
                </div>

                <div className="p-3 bg-[#F9F8F6] border border-dashed border-[#151D21] text-center">
                  <span className="text-xs font-bold text-[#151D21] block">
                    Unggah foto/PDF rapor (opsional)
                  </span>
                  <span className="text-[11px] text-[#6B7680]">PDF atau foto · maks. 10 MB</span>
                </div>
              </div>

              {/* 3. NILAI TKA (WAJIB) */}
              <div className="bg-white border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] p-3.5 space-y-3">
                <span className="font-['Press_Start_2P',monospace] text-[8px] text-[#277EFD] tracking-wider uppercase block">
                  3 · NILAI TKA (WAJIB)
                </span>

                {/* Mapel Wajib */}
                <span className="text-[10px] font-['Press_Start_2P',monospace] text-[#6B7680] block">
                  MAPEL WAJIB
                </span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Bahasa Indonesia</span>
                    <input
                      type="number"
                      step="0.1"
                      value={tkaWajib.bahasa_indonesia}
                      onChange={(e) => setTkaWajib((p) => ({ ...p, bahasa_indonesia: Number(e.target.value) }))}
                      className="w-16 p-1.5 bg-white border border-[#151D21] text-center font-bold text-xs"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Matematika</span>
                    <input
                      type="number"
                      step="0.1"
                      value={tkaWajib.matematika}
                      onChange={(e) => setTkaWajib((p) => ({ ...p, matematika: Number(e.target.value) }))}
                      className="w-16 p-1.5 bg-white border border-[#151D21] text-center font-bold text-xs"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Bahasa Inggris</span>
                    <input
                      type="number"
                      step="0.1"
                      value={tkaWajib.bahasa_inggris}
                      onChange={(e) => setTkaWajib((p) => ({ ...p, bahasa_inggris: Number(e.target.value) }))}
                      className="w-16 p-1.5 bg-white border border-[#151D21] text-center font-bold text-xs"
                    />
                  </div>
                </div>

                {/* Mapel Pilihan (Pilih 2) */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-['Press_Start_2P',monospace] text-[#6B7680]">
                      MAPEL PILIHAN
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsTkaModalOpen(true)}
                      className="px-2 py-0.5 bg-[#FEBD01] border border-[#151D21] text-[9px] font-bold shadow-[1px_1px_0px_#151D21] cursor-pointer"
                    >
                      PILIH 2
                    </button>
                  </div>

                  <div className="space-y-2">
                    {Object.entries(tkaPilihan).map(([namaMapel, nilai], idx) => (
                      <div key={namaMapel} className="flex items-center justify-between text-xs">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-[#6B7680]">Mapel pilihan {idx + 1}</span>
                          <span className="font-semibold text-[#151D21]">{namaMapel}</span>
                        </div>
                        <input
                          type="number"
                          step="0.1"
                          value={nilai}
                          onChange={(e) =>
                            setTkaPilihan((prev) => ({
                              ...prev,
                              [namaMapel]: Number(e.target.value),
                            }))
                          }
                          className="w-16 p-1.5 bg-white border border-[#151D21] text-center font-bold text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. PRESTASI */}
              <div className="bg-white border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] p-3.5 space-y-2">
                <span className="font-['Press_Start_2P',monospace] text-[8px] text-[#277EFD] tracking-wider uppercase block">
                  4 · PRESTASI
                </span>
                <div className="p-2.5 bg-[#F9F8F6] border border-[#D9D5CB] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#151D21]">
                      Olimpiade Sains Provinsi · Informatika
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="px-1.5 py-0.2 bg-[#EEF5FF] text-[#277EFD] text-[9px] font-bold">
                        PROVINSI
                      </span>
                      <span className="px-1.5 py-0.2 bg-[#EAF7EE] text-[#22A94F] text-[9px] font-bold">
                        JUARA 2
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-[#277EFD] font-bold block pt-1 cursor-pointer">
                  + Tambah prestasi (maks 3)
                </span>
              </div>

              {/* WILAYAH & REPUTASI ALUMNI (M11) */}
              <div className="bg-white border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] p-3.5 space-y-3">
                <span className="font-['Press_Start_2P',monospace] text-[8px] text-[#277EFD] tracking-wider uppercase block">
                  WILAYAH & REPUTASI ALUMNI
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#6B7680] block mb-1">Provinsi</span>
                    <span className="font-bold text-[#151D21]">D.I. Yogyakarta</span>
                  </div>
                  <div>
                    <span className="text-[#6B7680] block mb-1">Kabupaten/Kota</span>
                    <span className="font-bold text-[#151D21]">Kota Yogyakarta</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <label className="text-xs font-bold text-[#151D21] block mb-1.5">
                    REPUTASI ALUMNI · SELF-REPORT
                  </label>
                  <select
                    value={reputasiAlumni}
                    onChange={(e) => setReputasiAlumni(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#151D21] text-xs font-medium cursor-pointer"
                  >
                    <option value="Langganan banjir PTN top">Langganan banjir PTN top</option>
                    <option value="Rutin lolos PTN">Rutin lolos PTN</option>
                    <option value="1–5 siswa per tahun">1–5 siswa per tahun</option>
                    <option value="Sekolah baru / belum ada jejak">Sekolah baru / belum ada jejak</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <label className="text-xs font-bold text-[#151D21] block mb-1.5">
                    Kampus basis alumni
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {kampusAlumni.map((kampus) => (
                      <span
                        key={kampus}
                        className="px-2 py-1 bg-white border border-[#151D21] text-xs font-bold flex items-center gap-1.5"
                      >
                        {kampus}
                        <button
                          type="button"
                          onClick={() => handleRemoveCampus(kampus)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newCampusInput}
                      onChange={(e) => setNewCampusInput(e.target.value)}
                      placeholder="Cari dari 146 PTN..."
                      className="flex-1 p-2 bg-white border border-[#151D21] text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddCampus}
                      className="px-3 py-2 bg-[#FEBD01] border border-[#151D21] text-xs font-bold shadow-[1px_1px_0px_#151D21]"
                    >
                      + TAMBAH
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* ========================= FORM BAHAN SNBT (M12) ========================= */
            <>
              <div>
                <span className="font-['Press_Start_2P',monospace] text-[8px] sm:text-[9px] text-[#277EFD] tracking-wider uppercase block mb-1.5">
                  LANGKAH 2 · BAHAN SNBT
                </span>
                <h1 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-[#151D21] leading-relaxed">
                  Nilai try out terakhirmu
                </h1>
                <p className="text-xs text-[#6B7680] mt-1 leading-relaxed">
                  Peluang SNBT dihitung dari skor TO dibanding estimasi skor UTBK tiap prodi.
                </p>
              </div>

              {/* SUMBER & SKOR TRY OUT */}
              <div className="bg-white border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] p-3.5 space-y-3">
                <span className="font-['Press_Start_2P',monospace] text-[8px] text-[#277EFD] tracking-wider uppercase block">
                  SUMBER & SKOR TRY OUT
                </span>
                <p className="text-xs text-[#6B7680]">
                  Skala IRT 200–1000 (seperti UTBK)
                </p>

                {/* 7 Subtes */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Penalaran Umum (PU)</span>
                    <input
                      type="number"
                      value={skorTo.pu}
                      onChange={(e) => setSkorTo((p) => ({ ...p, pu: Number(e.target.value) }))}
                      className="w-16 p-1.5 bg-white border border-[#151D21] text-center font-bold"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Pengetahuan & Pemahaman Umum</span>
                    <input
                      type="number"
                      value={skorTo.ppu}
                      onChange={(e) => setSkorTo((p) => ({ ...p, ppu: Number(e.target.value) }))}
                      className="w-16 p-1.5 bg-white border border-[#151D21] text-center font-bold"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Pemahaman Bacaan & Menulis</span>
                    <input
                      type="number"
                      value={skorTo.pbm}
                      onChange={(e) => setSkorTo((p) => ({ ...p, pbm: Number(e.target.value) }))}
                      className="w-16 p-1.5 bg-white border border-[#151D21] text-center font-bold"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Pengetahuan Kuantitatif (PK)</span>
                    <input
                      type="number"
                      value={skorTo.pk}
                      onChange={(e) => setSkorTo((p) => ({ ...p, pk: Number(e.target.value) }))}
                      className="w-16 p-1.5 bg-white border border-[#151D21] text-center font-bold"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Literasi Bahasa Indonesia</span>
                    <input
                      type="number"
                      value={skorTo.lit_ind}
                      onChange={(e) => setSkorTo((p) => ({ ...p, lit_ind: Number(e.target.value) }))}
                      className="w-16 p-1.5 bg-white border border-[#151D21] text-center font-bold"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Literasi Bahasa Inggris</span>
                    <input
                      type="number"
                      value={skorTo.lit_ing}
                      onChange={(e) => setSkorTo((p) => ({ ...p, lit_ing: Number(e.target.value) }))}
                      className="w-16 p-1.5 bg-white border border-[#151D21] text-center font-bold"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Penalaran Matematika (PM)</span>
                    <input
                      type="number"
                      value={skorTo.pm}
                      onChange={(e) => setSkorTo((p) => ({ ...p, pm: Number(e.target.value) }))}
                      className="w-16 p-1.5 bg-white border border-[#151D21] text-center font-bold"
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-[#F9F8F6] border border-[#D9D5CB] flex items-center justify-between mt-2">
                  <span className="font-['Press_Start_2P',monospace] text-[9px] text-[#151D21]">
                    RATA-RATA 7 SUBTES
                  </span>
                  <span className="font-['Press_Start_2P',monospace] text-sm text-[#277EFD]">
                    {rataTo}
                  </span>
                </div>
              </div>

              {/* RIWAYAT TRY OUT */}
              <div className="bg-white border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] p-3.5 space-y-2.5">
                <span className="font-['Press_Start_2P',monospace] text-[8px] text-[#277EFD] tracking-wider uppercase block">
                  RIWAYAT TRY OUT
                </span>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs p-2 bg-[#F9F8F6]">
                    <span className="font-bold text-[#151D21]">612</span>
                    <span className="text-[#6B7680]">08 Agu 2026</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 bg-[#F9F8F6]">
                    <span className="font-bold text-[#151D21]">646</span>
                    <span className="text-[#6B7680]">18 Agu 2026</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 bg-[#F9F8F6]">
                    <span className="font-bold text-[#151D21]">684</span>
                    <span className="text-[#6B7680]">19 Sep 2026</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="px-2 py-0.5 bg-[#EAF7EE] text-[#22A94F] font-bold text-[10px] border border-[#22A94F]">
                    +72 SEJAK AGUSTUS
                  </span>
                  <span className="text-[#6B7680]">Rata-rata naik tiap bulan</span>
                </div>

                <span className="text-[10px] font-['Press_Start_2P',monospace] text-[#277EFD] block pt-2 cursor-pointer">
                  + TAMBAH RIWAYAT TO
                </span>
              </div>

              {/* PORTOFOLIO */}
              <div className="bg-white border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] p-3.5 text-center">
                <span className="font-['Press_Start_2P',monospace] text-[8px] text-[#277EFD] tracking-wider uppercase block mb-1">
                  PORTOFOLIO
                </span>
                <span className="text-xs font-bold text-[#151D21] block">
                  Unggah portofolio (opsional)
                </span>
                <span className="text-[11px] text-[#6B7680]">PDF, JPG, atau MP4 · maks. 25 MB</span>
              </div>
            </>
          )}

          {/* Sticky Bottom Action Bar Persis Figma M10 / M12 */}
          <div className="mt-auto pt-4 pb-2 border-t border-gray-200 grid grid-cols-2 gap-3 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={() => router.push('/preferensi/minat')}
              className="py-3 bg-white hover:bg-gray-50 text-[#151D21] border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[10px] text-center transition-all cursor-pointer"
            >
              KEMBALI
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="py-3 bg-[#22A94F] hover:bg-[#1E9646] text-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] active:translate-x-[1px] active:translate-y-[1px] font-['Press_Start_2P',monospace] text-[10px] text-center transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'MENYIMPAN...' : 'COCOKKAN!'}
            </button>
          </div>
        </main>

        {/* Modal Sheet M10b untuk memilih mapel pilihan TKA */}
        <ModalPilihTka
          isOpen={isTkaModalOpen}
          onClose={() => setIsTkaModalOpen(false)}
          selected={Object.keys(tkaPilihan)}
          onSave={handleSaveTkaMapel}
        />
      </div>
    </div>
  );
}
