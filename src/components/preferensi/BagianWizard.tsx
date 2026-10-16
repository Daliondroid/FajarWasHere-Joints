'use client';

import type { ReactNode } from 'react';
import IkonFigma from '@/components/ui/IkonFigma';
import Tombol from '@/components/ui/Tombol';

/** Stepper (Figma `80:146`): 1 MINAT → 2 BAHAN; penanda aktif blue, selesai green + cek, penghubung putus-putus. */
export function Stepper({ langkah }: { langkah: 1 | 2 }) {
  const penanda = (no: 1 | 2) => {
    const selesai = no < langkah;
    const aktif = no === langkah;
    return (
      <span
        className={`flex size-8 items-center justify-center border-2 border-ink shadow-pixel-sm t-display-s ${
          selesai ? 'bg-green' : aktif ? 'bg-blue text-paper' : 'bg-paper text-ink'
        }`}
      >
        {selesai ? <img src="/figma/icon-check-14.svg" alt="" width={14} height={14} /> : no}
      </span>
    );
  };
  return (
    <div className="flex h-[60px] w-full items-start gap-2" aria-label={`Langkah ${langkah} dari 2`}>
      <div className="flex flex-col items-center gap-1.5">
        {penanda(1)}
        <span className="t-label-s text-ink">MINAT</span>
      </div>
      <img
        src={langkah > 1 ? '/figma/penghubung-selesai.svg' : '/figma/penghubung.svg'}
        alt=""
        className="h-4 min-w-0 flex-1"
      />
      <div className="flex flex-col items-center gap-1.5">
        {penanda(2)}
        <span className={`t-label-s ${langkah === 2 ? 'text-ink' : 'text-muted'}`}>BAHAN</span>
      </div>
    </div>
  );
}

/** Judul halaman wizard: label biru, Display/M, keterangan Body/M muted. */
export function JudulWizard({ label, judul, keterangan }: { label: string; judul: string; keterangan?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="t-label-s text-blue">{label}</p>
      <h1 className="t-display-m text-ink">{judul}</h1>
      {keterangan && <p className="t-body-m text-muted">{keterangan}</p>}
    </div>
  );
}

/** Bottom Action Bar (Figma `81:76`): garis atas 2 ink, KEMBALI (Secondary) + aksi utama (Primary). */
export function BarAksi({
  onKembali,
  onLanjut,
  label = 'Lanjut',
  nonaktif = false,
  sibuk = false,
}: {
  onKembali: () => void;
  onLanjut: () => void;
  label?: string;
  nonaktif?: boolean;
  sibuk?: boolean;
}) {
  return (
    <div className="sticky bottom-0 z-30 flex items-center gap-3 border-t-2 border-ink bg-paper px-6 pt-4 pb-6">
      <Tombol jenis="secondary" onClick={onKembali} disabled={sibuk}>
        Kembali
      </Tombol>
      <Tombol ikon onClick={onLanjut} disabled={nonaktif || sibuk} className="min-w-0 flex-1">
        {sibuk ? 'Menyimpan…' : label}
      </Tombol>
    </div>
  );
}

/** Chip (Figma `80:52`): Label/M, shadow-sm; terpilih blue + ikon cek. */
export function Chip({ label, pilih, onClick, tinggi = 40 }: { label: string; pilih: boolean; onClick: () => void; tinggi?: number }) {
  return (
    <button
      type="button"
      aria-pressed={pilih}
      onClick={onClick}
      style={{ minHeight: tinggi }}
      className={`flex items-center justify-center gap-2 border-2 border-ink px-3 py-1 text-left shadow-pixel-sm t-label-m cursor-pointer ${
        pilih ? 'bg-blue text-paper' : 'bg-paper text-ink'
      }`}
    >
      {pilih && <img src="/figma/icon-check-14.svg" alt="" width={14} height={14} />}
      {label}
    </button>
  );
}

/** Score Row (Figma `81:72`): label Body/M + kotak angka 80 × 36. */
export function BarisNilai({
  label,
  nilai,
  onUbah,
  min = 0,
  maks = 100,
  langkah = 0.01,
  tinggi = 36,
}: {
  label: ReactNode;
  nilai: number | null;
  onUbah: (v: number | null) => void;
  min?: number;
  maks?: number;
  langkah?: number;
  tinggi?: number;
}) {
  return (
    <label className="flex w-full items-center gap-3">
      <span className="min-w-0 flex-1 t-body-m text-ink">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        min={min}
        max={maks}
        step={langkah}
        value={nilai ?? ''}
        onChange={(e) => onUbah(e.target.value === '' ? null : Number(e.target.value))}
        style={{ height: tinggi }}
        className="w-20 shrink-0 border-2 border-ink bg-paper px-3 text-right t-body-m font-semibold text-ink outline-none focus-visible:shadow-pixel-sm"
      />
    </label>
  );
}

/** Option Compact (Figma `81:57`): checkbox 22 px; terpilih blue-50 + teks blue-700. */
export function Opsi({ label, pilih, onClick }: { label: string; pilih: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={pilih}
      onClick={onClick}
      className={`flex w-full items-center gap-3 p-2 text-left cursor-pointer ${pilih ? 'bg-blue-50' : ''}`}
    >
      <span
        className={`flex size-[22px] shrink-0 items-center justify-center border-2 ${pilih ? 'border-blue bg-blue' : 'border-ink bg-paper'}`}
      >
        {pilih && <IkonFigma src="/figma/icon-check-12.svg" ukuran={12} className="text-paper" />}
      </span>
      <span className={`flex-1 t-body-m ${pilih ? 'text-blue-700' : 'text-ink'}`}>{label}</span>
    </button>
  );
}

/** Upload Zone (Figma `81:67`). Unggah rapor/portofolio belum tersedia (butuh AI ekstraktor), jadi tampil nonaktif. */
export function ZonaUnggah({ judul }: { judul: string }) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-blue bg-blue-50 px-4 py-6 opacity-70">
      <img src="/figma/icon-upload.svg" alt="" width={32} height={32} />
      <p className="text-center t-label-m text-ink">{judul}</p>
      <p className="text-center t-body-s text-muted">Belum tersedia di versi demo · isi nilainya manual dulu.</p>
    </div>
  );
}
