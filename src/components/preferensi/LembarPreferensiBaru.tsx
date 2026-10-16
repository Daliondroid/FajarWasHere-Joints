'use client';

import { useState } from 'react';
import type { JalurPreferensi } from '@/types';
import { ATURAN } from '@/lib/skoring/parameter';
import { validasiJalur } from '@/lib/skoring/eligibilitas';
import { Isian, Pilihan } from '@/components/ui/Isian';
import IkonFigma from '@/components/ui/IkonFigma';
import Tombol from '@/components/ui/Tombol';

const TAHUN = ATURAN.tahun_acuan;

const JALUR: { id: JalurPreferensi; keterangan: string; warna: string }[] = [
  { id: 'snbp', keterangan: 'Rapor smt 1–5, TKA & prestasi', warna: 'bg-yellow' },
  { id: 'snbt', keterangan: 'Nilai try out 7 subtes UTBK', warna: 'bg-blue-200' },
];

export interface IsianPreferensiBaru {
  nama: string;
  jalur: JalurPreferensi;
  tahun_lulus: number;
  pernah_lulus_snbp: boolean;
}

/**
 * Bottom sheet "Preferensi baru" (Figma M07 `173:655`; desktop = modal D04b `272:4960`): nama, jalur (BR-17, tidak bisa diubah), tahun lulus.
 * BR-11 dicek di sini supaya siswa tahu sebelum mengisi kuis.
 */
export default function LembarPreferensiBaru({
  namaTerpakai,
  onBatal,
  onBuat,
}: {
  namaTerpakai: string[];
  onBatal: () => void;
  onBuat: (isi: IsianPreferensiBaru) => void;
}) {
  const [nama, setNama] = useState('');
  const [jalur, setJalur] = useState<JalurPreferensi>('snbp');
  const [tahun, setTahun] = useState(TAHUN);
  const [pernahSnbp, setPernahSnbp] = useState(false);

  const j = validasiJalur({ tahun_lulus: tahun, lulus_snbp_tahun: pernahSnbp ? TAHUN : null }, TAHUN);
  const bersih = nama.trim();
  const galat = !bersih
    ? null
    : bersih.length > 40
      ? 'Nama maksimal 40 karakter.'
      : namaTerpakai.some((n) => n.toLowerCase() === bersih.toLowerCase())
        ? 'Nama ini sudah dipakai preferensi lain.'
        : jalur === 'snbp' && !j.boleh_snbp
          ? j.alasan[0]
          : jalur === 'snbt' && !j.boleh_snbt
            ? j.alasan.find((a) => a.includes('SNBT'))
            : null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Preferensi baru" className="fixed inset-0 z-[60] flex items-end justify-center lg:items-start lg:pt-[140px]">
      <div className="absolute inset-0 bg-ink/55" onClick={onBatal} />
      <form
        className="relative flex w-full max-w-[402px] flex-col gap-4 border-t-2 border-ink bg-paper px-6 pt-3 pb-7 lg:max-w-[520px] lg:gap-[18px] lg:border-2 lg:p-7 lg:shadow-pixel-md"
        onSubmit={(e) => {
          e.preventDefault();
          if (bersih && !galat) onBuat({ nama: bersih, jalur, tahun_lulus: tahun, pernah_lulus_snbp: pernahSnbp });
        }}
      >
        <div className="flex justify-center lg:hidden">
          <span className="h-1 w-12 bg-track" />
        </div>
        <h2 className="t-display-s text-ink">Preferensi baru</h2>
        <Isian label="Nama preferensi" placeholder="Contoh: Informatika Impian" value={nama} maxLength={40} onChange={(e) => setNama(e.target.value)} autoFocus />
        <p className="t-label-m text-ink">Pilih jalur</p>
        <div className="flex gap-3" role="radiogroup" aria-label="Jalur">
          {JALUR.map((o) => {
            const pilih = jalur === o.id;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={pilih}
                onClick={() => setJalur(o.id)}
                className={`flex min-w-0 flex-1 flex-col gap-2 p-3.5 text-left cursor-pointer ${
                  pilih ? `border-2 border-ink shadow-pixel-md ${o.warna}` : 'border-2 border-dashed border-blue bg-blue-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`flex size-5 items-center justify-center border-2 border-ink ${pilih ? 'bg-ink' : 'bg-paper'}`}>
                    {pilih && <IkonFigma src="/figma/icon-check-12.svg" ukuran={12} className={o.id === 'snbp' ? 'text-yellow' : 'text-blue-200'} />}
                  </span>
                  <span className="t-display-s text-ink">{o.id.toUpperCase()}</span>
                </span>
                <span className="t-body-s text-ink-2">{o.keterangan}</span>
              </button>
            );
          })}
        </div>
        <Pilihan label="Tahun lulus SMA/SMK/MA" value={tahun} onChange={(e) => setTahun(Number(e.target.value))}>
          <option value={TAHUN}>{TAHUN} · kelas 12 sekarang</option>
          <option value={TAHUN - 1}>{TAHUN - 1}</option>
          <option value={TAHUN - 2}>{TAHUN - 2}</option>
        </Pilihan>
        {jalur === 'snbt' && (
          <label className="flex items-center gap-2 t-body-s text-ink-2">
            <input type="checkbox" checked={pernahSnbp} onChange={(e) => setPernahSnbp(e.target.checked)} className="size-4 accent-blue" />
            Saya sudah pernah lulus SNBP {TAHUN - 2}–{TAHUN}
          </label>
        )}
        {galat && <p className="t-body-s font-bold text-red">{galat}</p>}
        <div className="flex gap-3">
          <Tombol jenis="secondary" onClick={onBatal}>
            Batal
          </Tombol>
          <Tombol type="submit" ikon penuh disabled={!bersih || !!galat} className="flex-1">
            Buat &amp; mulai
          </Tombol>
        </div>
      </form>
    </div>
  );
}
