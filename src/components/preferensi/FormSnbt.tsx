'use client';

import type { ReactNode } from 'react';
import type { SkalaTo, TryOut } from '@/types';
import { RetroWindow } from '@/components/ui/RetroWindow';
import { Isian, Pilihan } from '@/components/ui/Isian';
import Tag from '@/components/ui/Tag';
import Tombol from '@/components/ui/Tombol';
import { BarisNilai, GridKolom, JudulWizard, LayoutWizard, Stepper, ZonaUnggah } from '@/components/preferensi/BagianWizard';

const SUBTES: { kunci: keyof TryOut['skor']; label: string }[] = [
  { kunci: 'pu', label: 'Penalaran Umum (PU)' },
  { kunci: 'ppu', label: 'Pengetahuan & Pemahaman Umum' },
  { kunci: 'pbm', label: 'Pemahaman Bacaan & Menulis' },
  { kunci: 'pk', label: 'Pengetahuan Kuantitatif (PK)' },
  { kunci: 'lit_ind', label: 'Literasi Bahasa Indonesia' },
  { kunci: 'lit_ing', label: 'Literasi Bahasa Inggris' },
  { kunci: 'pm', label: 'Penalaran Matematika (PM)' },
];

const SKALA: { id: SkalaTo; label: string }[] = [
  { id: 'irt_200_1000', label: 'Skala IRT 200–1000 (seperti UTBK)' },
  { id: 'bimbel', label: 'Skala bimbel lain' },
  { id: 'tidak_tahu', label: 'Tidak tahu skalanya' },
];

const hariIni = () => new Date().toISOString().slice(0, 10);

export const toKosong = (): TryOut => ({
  tanggal: hariIni(),
  sumber_to: null,
  skala: 'irt_200_1000',
  skor: { pu: null, ppu: null, pbm: null, pk: null, lit_ind: null, lit_ing: null, pm: null },
});

export function rataTo(to: TryOut): number | null {
  const n = Object.values(to.skor).filter((v): v is number => typeof v === 'number');
  return n.length ? Math.round(n.reduce((a, b) => a + b, 0) / n.length) : null;
}

const tanggalPendek = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
const WARNA_BATANG = ['bg-track', 'bg-blue-200', 'bg-blue'];

/** Langkah 2 SNBT (M12 `175:1197`): skor try out 7 subtes, riwayat TO, portofolio. Yang diubah = TO terbaru. */
export function FormSnbt({
  riwayat,
  ubah,
  penanda,
  bawah,
}: {
  riwayat: TryOut[];
  ubah: (r: TryOut[]) => void;
  penanda: ReactNode;
  bawah?: ReactNode;
}) {
  const urut = [...riwayat].sort((a, b) => a.tanggal.localeCompare(b.tanggal));
  const terbaru = urut[urut.length - 1] ?? toKosong();
  const ubahTerbaru = (to: TryOut) => ubah([...urut.slice(0, -1), to]);
  const rata = rataTo(terbaru);
  const grafik = urut.slice(-3).map((t) => ({ t, r: rataTo(t) ?? 0 }));
  const maks = Math.max(1, ...grafik.map((g) => g.r));
  const selisih = grafik.length > 1 ? grafik[grafik.length - 1].r - grafik[0].r : null;

  return (
    <LayoutWizard
      lebarKiri={340}
      jarak={6}
      kiri={
        <>
          {penanda}
          <Stepper langkah={2} />
          <JudulWizard
            label="LANGKAH 2 · BAHAN SNBT"
            judul="Nilai try out terakhirmu"
            keterangan="Peluang SNBT dihitung dari skor TO dibanding estimasi skor UTBK tiap prodi."
          />
        </>
      }
    >
      <GridKolom
        a={
          <>
            <RetroWindow title="Sumber & skor try out" variant="blue" contentClassName="flex flex-col gap-3.5 px-4 pt-4 pb-[18px]">
        <Pilihan label="Sumber try out" value={terbaru.skala} onChange={(e) => ubahTerbaru({ ...terbaru, skala: e.target.value as SkalaTo })}>
          {SKALA.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </Pilihan>
        <Isian label="Tanggal try out" type="date" value={terbaru.tanggal} max={hariIni()} onChange={(e) => e.target.value && ubahTerbaru({ ...terbaru, tanggal: e.target.value })} />
        {SUBTES.map((s) => (
          <BarisNilai
            key={s.kunci}
            label={s.label}
            nilai={terbaru.skor[s.kunci]}
            onUbah={(v) => ubahTerbaru({ ...terbaru, skor: { ...terbaru.skor, [s.kunci]: v } })}
            min={0}
            maks={1000}
            langkah={1}
          />
        ))}
        <div className="flex items-center gap-2 bg-ink p-2.5">
          <span className="t-label-s text-paper">RATA-RATA 7 SUBTES</span>
          <span className="flex-1" />
          <span className="t-display-s text-yellow">{rata ?? '–'}</span>
        </div>
      </RetroWindow>
          </>
        }
        b={
          <>
            <RetroWindow title="Riwayat try out" variant="green" contentClassName="flex flex-col gap-3.5 px-4 pt-4 pb-[18px]">
        {grafik.length > 0 && (
          <div className="flex items-end gap-4 border-[1.5px] border-ink bg-canvas px-4 pt-3 pb-2" aria-label="Grafik rata-rata try out">
            {grafik.map(({ t, r }, i) => (
              <div key={`${t.tanggal}-${i}`} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                <span className="t-body-s font-bold text-ink">{r || '–'}</span>
                <span
                  className={`w-11 border-[1.5px] border-ink ${WARNA_BATANG[i + 3 - grafik.length]}`}
                  style={{ height: Math.max(8, (r / maks) * 136) }}
                />
                <span className="whitespace-nowrap text-[11px] leading-[18px] text-muted">{tanggalPendek(t.tanggal)}</span>
              </div>
            ))}
          </div>
        )}
        {selisih !== null && (
          <div className="flex items-center gap-1.5">
            <Tag warna={selisih >= 0 ? 'green' : 'red'}>
              {selisih >= 0 ? '+' : ''}
              {selisih} SEJAK {tanggalPendek(grafik[0].t.tanggal).toUpperCase()}
            </Tag>
          </div>
        )}
        <Tombol
          jenis="secondary"
          ukuran="M"
          className="self-start"
          disabled={riwayat.length >= 20}
          onClick={() => ubah([...urut, toKosong()])}
        >
          + Tambah riwayat TO
        </Tombol>
      </RetroWindow>
            <RetroWindow title="Portofolio" variant="yellow" contentClassName="flex flex-col gap-3.5 px-4 pt-4 pb-[18px]">
        <ZonaUnggah judul="Unggah portofolio (prodi seni & olahraga)" />
      </RetroWindow>
          </>
        }
      />
      {bawah}
    </LayoutWizard>
  );
}
