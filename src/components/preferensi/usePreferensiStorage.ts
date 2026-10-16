'use client';

import { useState, useEffect } from 'react';

export interface PreferensiDraft {
  nama: string;
  jalur: 'snbp' | 'snbt';
  
  // RIASEC answers: "IP01" .. "IP30" -> 0..4
  jawaban_minat: Record<string, number>;
  
  // Minat & Hobi
  chip_hobi: string[];
  hobbiesStory: string;
  mapel_favorit: string[];

  // SNBP
  npsn: string;
  nama_sekolah?: string;
  provinsi?: string;
  kabupaten?: string;
  rapor_rata: number;
  nilai_mapel_pendukung: Record<string, number>;
  nilai_tka: {
    matematika: number;
    bahasa_indonesia: number;
    bahasa_inggris: number;
    pilihan: Record<string, number>;
  };
  reputasi_alumni: 'sangat_tinggi' | 'tinggi' | 'sedang' | 'rendah' | '';
  kampus_alumni: string[]; // nama kampus

  // SNBT
  skor_to: {
    pu: number;
    ppu: number;
    pbm: number;
    pk: number;
    lit_ind: number;
    lit_ing: number;
    pm: number;
  };
  riwayat_to: Array<{
    bulan: string;
    tanggal: string;
    rata_rata: number;
  }>;
}

export interface PreferensiSavedItem {
  id: string;
  nama: string;
  jalur: 'snbp' | 'snbt';
  is_aktif: boolean;
  ringkasan: string;
  skor_riasec?: { R: number; I: number; A: number; S: number; E: number; C: number };
  kode_holland?: string;
  nama_karakter?: string;
  rekomendasi_teratas?: {
    prodi: string;
    kampus: string;
    cocok: number;
    peluang: string;
  };
  created_at: string;
  data: PreferensiDraft;
}

const DRAFT_KEY = 'cocokin_v3_wizard_draft';
const SAVED_KEY = 'cocokin_v3_saved_preferensi';

export const INITIAL_DRAFT: PreferensiDraft = {
  nama: '',
  jalur: 'snbp',
  jawaban_minat: {},
  chip_hobi: ['Ngoprek Kode & Gadget', 'Eksperimen Sains & Riset'],
  hobbiesStory: 'Aku suka main teka-teki logika dan pernah bikin game kecil pakai Scratch lalu Python. Lebih suka kerja sendiri dulu baru presentasi.',
  mapel_favorit: ['Matematika', 'Fisika', 'Informatika'],
  npsn: '20403161',
  nama_sekolah: 'SMAN 8 Yogyakarta',
  provinsi: 'D.I. Yogyakarta',
  kabupaten: 'Kota Yogyakarta',
  rapor_rata: 88.4,
  nilai_mapel_pendukung: { 'Matematika Tingkat Lanjut': 91 },
  nilai_tka: {
    matematika: 88.0,
    bahasa_indonesia: 82.5,
    bahasa_inggris: 85.0,
    pilihan: { 'Matematika Tingkat Lanjut': 86.0, Fisika: 84.5 },
  },
  reputasi_alumni: 'sangat_tinggi',
  kampus_alumni: ['UGM', 'UNY', 'UPN "VETERAN" YK'],
  skor_to: {
    pu: 720,
    ppu: 680,
    pbm: 650,
    pk: 700,
    lit_ind: 640,
    lit_ing: 710,
    pm: 690,
  },
  riwayat_to: [
    { bulan: 'AGU', tanggal: '08 Agu 2026', rata_rata: 612 },
    { bulan: 'AGU', tanggal: '18 Agu 2026', rata_rata: 646 },
    { bulan: 'SEP', tanggal: '19 Sep 2026', rata_rata: 684 },
  ],
};

const DEFAULT_SAVED_LIST: PreferensiSavedItem[] = [
  {
    id: 'pref-default-1',
    nama: 'Informatika Impian',
    jalur: 'snbp',
    is_aktif: true,
    ringkasan: '30/30 RIASEC • Rapor 88,4 • 2 Mapel TKA',
    kode_holland: 'ICR',
    nama_karakter: 'Pemikir Sistematis',
    rekomendasi_teratas: {
      prodi: 'Teknologi Informasi',
      kampus: 'UGM',
      cocok: 94,
      peluang: '10–20% (estimasi)',
    },
    created_at: '15 Okt 2026',
    data: {
      ...INITIAL_DRAFT,
      nama: 'Informatika Impian',
      jalur: 'snbp',
    },
  },
  {
    id: 'pref-default-2',
    nama: 'Cadangan SNBT',
    jalur: 'snbt',
    is_aktif: false,
    ringkasan: '30/30 RIASEC • Skor TO 684 • 3 Riwayat TO',
    kode_holland: 'ICR',
    nama_karakter: 'Pemikir Sistematis',
    rekomendasi_teratas: {
      prodi: 'Ilmu Komputer',
      kampus: 'UGM',
      cocok: 92,
      peluang: '40–55% (estimasi)',
    },
    created_at: '14 Okt 2026',
    data: {
      ...INITIAL_DRAFT,
      nama: 'Cadangan SNBT',
      jalur: 'snbt',
    },
  },
  {
    id: 'pref-default-3',
    nama: 'Plan B Statistika',
    jalur: 'snbp',
    is_aktif: false,
    ringkasan: '30/30 RIASEC • Rapor 88,4 • 2 Mapel TKA',
    kode_holland: 'ICE',
    nama_karakter: 'Analis Teliti',
    rekomendasi_teratas: {
      prodi: 'Statistika',
      kampus: 'UGM',
      cocok: 81,
      peluang: '25–40% (estimasi)',
    },
    created_at: '12 Okt 2026',
    data: {
      ...INITIAL_DRAFT,
      nama: 'Plan B Statistika',
      jalur: 'snbp',
    },
  },
];

export function usePreferensiStorage() {
  const [draft, setDraftState] = useState<PreferensiDraft>(INITIAL_DRAFT);
  const [savedList, setSavedList] = useState<PreferensiSavedItem[]>(DEFAULT_SAVED_LIST);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedDraft = localStorage.getItem(DRAFT_KEY);
      if (storedDraft) {
        setDraftState(JSON.parse(storedDraft));
      }

      const storedSaved = localStorage.getItem(SAVED_KEY);
      if (storedSaved) {
        setSavedList(JSON.parse(storedSaved));
      } else {
        localStorage.setItem(SAVED_KEY, JSON.stringify(DEFAULT_SAVED_LIST));
      }
    } catch {
      // Fallback ignore error
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updateDraft = (updates: Partial<PreferensiDraft>) => {
    setDraftState((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const resetDraft = () => {
    setDraftState(INITIAL_DRAFT);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
  };

  const setAktif = async (id: string) => {
    setSavedList((prev) => {
      const next = prev.map((p) => ({
        ...p,
        is_aktif: p.id === id,
      }));
      try {
        localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    try {
      await fetch(`/api/preferensi/${id}/aktif`, { method: 'POST' });
    } catch {
      // offline fallback
    }
  };

  const hapusPreferensi = async (id: string) => {
    setSavedList((prev) => {
      const remaining = prev.filter((p) => p.id !== id);
      if (remaining.length > 0 && !remaining.some((p) => p.is_aktif)) {
        remaining[0].is_aktif = true;
      }
      try {
        localStorage.setItem(SAVED_KEY, JSON.stringify(remaining));
      } catch {
        // ignore
      }
      return remaining;
    });

    try {
      await fetch(`/api/preferensi/${id}`, { method: 'DELETE' });
    } catch {
      // offline fallback
    }
  };

  const simpanDraftSebagaiPreferensi = async (): Promise<PreferensiSavedItem> => {
    const isSNBP = draft.jalur === 'snbp';
    const ringkasan = isSNBP
      ? `30/30 RIASEC • Rapor ${draft.rapor_rata} • ${Object.keys(draft.nilai_tka.pilihan).length} Mapel TKA`
      : `30/30 RIASEC • Skor TO ${Math.round(
          Object.values(draft.skor_to).reduce((a, b) => a + b, 0) / 7
        )} • ${draft.riwayat_to.length} Riwayat TO`;

    const newItem: PreferensiSavedItem = {
      id: `pref-${Date.now()}`,
      nama: draft.nama || (isSNBP ? 'Preferensi SNBP Baru' : 'Preferensi SNBT Baru'),
      jalur: draft.jalur,
      is_aktif: true,
      ringkasan,
      kode_holland: 'IRC',
      created_at: new Date().toISOString().split('T')[0],
      data: { ...draft },
    };

    // Update list dan jadikan preferensi baru ini aktif (sesuai F-19)
    setSavedList((prev) => {
      const updated = prev.map((p) => ({ ...p, is_aktif: false }));
      const next = [newItem, ...updated];
      try {
        localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    // Coba simpan ke server backend jika user login
    try {
      await fetch('/api/preferensi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: newItem.nama,
          jalur: newItem.jalur,
          minat: {
            mode: 'ipsf_30',
            jawaban_minat: draft.jawaban_minat,
            chip_hobi: draft.chip_hobi,
            mapel_favorit: draft.mapel_favorit,
          },
          kelulusan: {
            tahun_lulus: 2026,
            pernah_lulus_snbp: false,
          },
          akademik: isSNBP
            ? {
                npsn: draft.npsn,
                jurusan_sekolah: 'MIPA',
                rapor_rata: draft.rapor_rata,
                nilai_mapel_pendukung: draft.nilai_mapel_pendukung,
                peringkat_paralel: 15,
                jumlah_siswa_jurusan: 150,
                nilai_tka: {
                  matematika: draft.nilai_tka.matematika,
                  bahasa_indonesia: draft.nilai_tka.bahasa_indonesia,
                  bahasa_inggris: draft.nilai_tka.bahasa_inggris,
                  pilihan: draft.nilai_tka.pilihan,
                },
                prestasi: [],
                reputasi_alumni: draft.reputasi_alumni || 'sangat_tinggi',
                kampus_alumni: [1, 2, 3],
              }
            : null,
          riwayat_to: isSNBP
            ? []
            : [
                {
                  tanggal: '2026-09-19',
                  sumber_to: 'Bimbel Nasional',
                  skala: 'irt_200_1000',
                  skor: {
                    pu: draft.skor_to.pu,
                    ppu: draft.skor_to.ppu,
                    pbm: draft.skor_to.pbm,
                    pk: draft.skor_to.pk,
                    lit_ind: draft.skor_to.lit_ind,
                    lit_ing: draft.skor_to.lit_ing,
                    pm: draft.skor_to.pm,
                  },
                },
              ],
        }),
      });
    } catch {
      // offline fallback
    }

    resetDraft();
    return newItem;
  };

  return {
    draft,
    savedList,
    isLoaded,
    updateDraft,
    resetDraft,
    setAktif,
    hapusPreferensi,
    simpanDraftSebagaiPreferensi,
  };
}
