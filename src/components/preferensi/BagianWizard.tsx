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

/** Judul halaman wizard: label biru, Display/M, keterangan Body/M muted. Desktop (D05 `186:2519`): 24/35 dan 17/25. */
export function JudulWizard({ label, judul, keterangan }: { label: string; judul: string; keterangan?: string }) {
  return (
    <div className="flex flex-col gap-2 lg:gap-2.5">
      <p className="t-label-s text-blue">{label}</p>
      <h1 className="t-display-m text-ink lg:text-[24px] lg:leading-[35px]">{judul}</h1>
      {keterangan && <p className="t-body-m text-muted lg:text-[17px] lg:leading-[25px]">{keterangan}</p>}
    </div>
  );
}

/** Penanda preferensi yang sedang dibuat/diubah (Figma `168:181`), hanya tampil di desktop (kolom kiri wizard). */
export function PenandaPreferensi({ jalur, nama }: { jalur: 'snbp' | 'snbt'; nama: string }) {
  return (
    <div className="hidden w-full items-center gap-2.5 border-2 border-ink bg-paper py-2 pr-3 pl-2.5 shadow-pixel-sm lg:flex">
      <span className={`size-4 shrink-0 border-[1.5px] border-ink ${jalur === 'snbp' ? 'bg-yellow' : 'bg-blue'}`} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="whitespace-nowrap t-label-s text-muted">PREFERENSI AKTIF · {jalur.toUpperCase()}</span>
        <span className="truncate t-label-m text-ink">{nama}</span>
      </span>
    </div>
  );
}

/**
 * Tata letak halaman wizard. Mobile: satu kolom. Desktop (D05–D06c): kolom kiri 380/340 px (penanda, stepper, judul)
 * dan kolom kanan konten, jarak 56 px, tanpa footer.
 */
export function LayoutWizard({
  kiri,
  children,
  lebarKiri = 380,
  gap = 'gap-4',
  jarak = 4,
}: {
  kiri: ReactNode;
  children: ReactNode;
  lebarKiri?: 380 | 340;
  gap?: 'gap-4' | 'gap-5';
  /** Jarak konten ke bar aksi di desktop: 4 = 16 px, 6 = 24 px. */
  jarak?: 4 | 6;
}) {
  return (
    <main
      className={`flex flex-col px-6 pt-6 pb-8 lg:flex-row lg:items-start lg:gap-14 lg:px-konten lg:pt-12 ${
        jarak === 4 ? 'lg:pb-4' : 'lg:pb-6'
      } ${gap}`}
    >
      <div
        className={`contents lg:flex lg:shrink-0 lg:flex-col lg:gap-6 ${lebarKiri === 380 ? 'lg:w-[380px]' : 'lg:w-[340px]'}`}
      >
        {kiri}
      </div>
      <div className="contents lg:flex lg:min-w-0 lg:flex-1 lg:flex-col lg:gap-4">{children}</div>
    </main>
  );
}

/** Grid dua kolom isi wizard desktop (Kolom A | Kolom B); di mobile semua jendela mengalir dalam satu kolom. */
export function GridKolom({ a, b }: { a: ReactNode; b: ReactNode }) {
  return (
    <div className="contents lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
      <div className="contents lg:flex lg:min-w-0 lg:flex-col lg:gap-6">{a}</div>
      <div className="contents lg:flex lg:min-w-0 lg:flex-col lg:gap-6">{b}</div>
    </div>
  );
}

/** Checklist kemajuan bahan jalur (Figma D06 `188:2539`), hanya tampil di desktop. */
export function ChecklistBahan({ item }: { item: { label: string; selesai: boolean }[] }) {
  return (
    <ul className="hidden w-full flex-col gap-2.5 border-[1.5px] border-ink bg-canvas p-4 lg:flex" aria-label="Kemajuan bahan">
      {item.map((i) => (
        <li key={i.label} className="flex items-center gap-2.5">
          <img src={i.selesai ? '/figma/icon-check-bahan-14.svg' : '/figma/icon-clock.svg'} alt="" width={14} height={14} />
          <span className={`t-body-m ${i.selesai ? 'text-ink' : 'text-muted'}`}>{i.label}</span>
        </li>
      ))}
    </ul>
  );
}

/** Bottom Action Bar (Figma `81:76`): garis atas 2 ink, KEMBALI (Secondary) + aksi utama (Primary). */
export function BarAksi({
  onKembali,
  onLanjut,
  label = 'Lanjut',
  nonaktif = false,
  sibuk = false,
  lebarKiri = 380,
}: {
  onKembali: () => void;
  onLanjut: () => void;
  label?: string;
  nonaktif?: boolean;
  sibuk?: boolean;
  lebarKiri?: 380 | 340;
}) {
  return (
    <div
      className={`sticky bottom-0 z-30 flex items-center gap-3 border-t-2 border-ink bg-paper px-6 pt-4 pb-6 lg:static lg:justify-end lg:border-t-0 lg:pt-0 lg:pr-konten lg:pb-16 ${
        lebarKiri === 380 ? 'lg:pl-aksi-380' : 'lg:pl-aksi-340'
      }`}
    >
      <Tombol jenis="secondary" onClick={onKembali} disabled={sibuk}>
        Kembali
      </Tombol>
      <Tombol ikon onClick={onLanjut} disabled={nonaktif || sibuk} className="min-w-0 flex-1 lg:flex-none">
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
