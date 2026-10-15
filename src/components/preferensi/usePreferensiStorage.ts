'use client';

import { useEffect, useState } from 'react';
import { TryoutItem } from '@/components/preferensi/StepFormSNBT';

export interface PreferensiDraft {
  // Step 1: Minat & Hobi
  selectedHobbies: string[];
  hobbiesStory: string;

  // Step 2: Akademik
  selectedTrack: 'SNBP' | 'SNBT' | '';
  // SNBP
  npsn: string;
  alamat: string;
  selectedAlumniRep: string;
  selectedCampus: string;
  // SNBT
  activeScoreIndex: number;
  tryoutList: TryoutItem[];
}

const STORAGE_KEY = 'cocokin_preferensi_draft_v1';

const DEFAULT_TRYOUTS: TryoutItem[] = [
  {
    date: '15/10/2026',
    scores: {
      pu: '900',
      ppu: '700',
      pbm: '500',
      pk: '650',
      lbind: '433',
      lbing: '830',
      pm: '720',
    },
  },
  {
    date: '1/10/2026',
    scores: {
      pu: '900',
      ppu: '700',
      pbm: '500',
      pk: '650',
      lbind: '433',
      lbing: '830',
      pm: '720',
    },
  },
];

const INITIAL_DRAFT: PreferensiDraft = {
  selectedHobbies: [],
  hobbiesStory: '',
  selectedTrack: '',
  npsn: '',
  alamat: '',
  selectedAlumniRep: '',
  selectedCampus: 'UGM',
  activeScoreIndex: 0,
  tryoutList: DEFAULT_TRYOUTS,
};

export function usePreferensiStorage() {
  const [draft, setDraftState] = useState<PreferensiDraft>(INITIAL_DRAFT);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage saat mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setDraftState((prev) => ({ ...prev, ...parsed }));
      }
    } catch (err) {
      console.warn('Gagal memuat preferensi draft dari localStorage:', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Update state dan sync ke localStorage
  const updateDraft = (updates: Partial<PreferensiDraft>) => {
    setDraftState((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        console.warn('Gagal menyimpan preferensi draft ke localStorage:', err);
      }
      return next;
    });
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setDraftState(INITIAL_DRAFT);
    } catch (err) {
      console.warn('Gagal menghapus preferensi draft:', err);
    }
  };

  return {
    draft,
    isLoaded,
    updateDraft,
    clearDraft,
  };
}
