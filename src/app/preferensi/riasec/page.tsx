'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/ui/TopBar';
import BingkaiMobile from '@/components/ui/BingkaiMobile';
import IkonFigma from '@/components/ui/IkonFigma';
import { BarAksi, JudulWizard, Stepper } from '@/components/preferensi/BagianWizard';
import { ITEM_MINAT } from '@/components/preferensi/itemMinat';
import { useDraf } from '@/lib/klien/draf_preferensi';

const PER_LAYAR = 5;
const JUMLAH_LAYAR = Math.ceil(ITEM_MINAT.length / PER_LAYAR);
/** Skala jawaban 0..4 (Data/form_minat_config.json), ikon wajah 1–5. */
const SKALA = [0, 1, 2, 3, 4];
const LABEL_SKALA = ['Sangat tidak suka', 'Tidak suka', 'Ragu-ragu', 'Suka', 'Sangat suka'];

/** Kartu Minat (Figma `168:344`): nomor kotak ink, 5 kotak skala; terpilih blue + shadow. */
function KartuMinat({ nomor, teks, nilai, onPilih }: { nomor: number; teks: string; nilai: number | undefined; onPilih: (v: number) => void }) {
  const terjawab = nilai !== undefined;
  return (
    <fieldset className={`flex flex-col gap-3 border-2 bg-paper p-3.5 ${terjawab ? 'border-blue' : 'border-ink'}`}>
      <legend className="sr-only">{teks}</legend>
      <div className="flex items-center gap-3">
        <span className={`flex size-9 shrink-0 items-center justify-center t-label-s text-paper ${terjawab ? 'bg-blue' : 'bg-ink'}`}>
          {String(nomor).padStart(2, '0')}
        </span>
        <p className="flex-1 t-body-m font-semibold text-ink">{teks}</p>
      </div>
      <div className="flex gap-1.5">
        {SKALA.map((v) => {
          const pilih = nilai === v;
          return (
            <button
              key={v}
              type="button"
              aria-label={LABEL_SKALA[v]}
              aria-pressed={pilih}
              onClick={() => onPilih(v)}
              className={`flex h-11 min-w-0 flex-1 items-center justify-center border-ink cursor-pointer ${
                pilih ? 'border-2 bg-blue shadow-pixel-sm' : 'border-[1.5px] bg-paper'
              }`}
            >
              <IkonFigma src={`/figma/wajah-${v + 1}.svg`} ukuran={22} className={pilih ? 'text-paper' : 'text-ink'} />
            </button>
          );
        })}
      </div>
      <div className="flex justify-between t-body-s text-muted">
        <span>Sangat tidak suka</span>
        <span>Ragu</span>
        <span>Sangat suka</span>
      </div>
    </fieldset>
  );
}

/** M08 · Kuis minat RIASEC (Figma `173:696`): 30 kegiatan Mini-IP, 5 per layar. */
export default function KuisRiasecPage() {
  const router = useRouter();
  const { draf, ubahIsi } = useDraf();
  const [layar, setLayar] = useState(0);

  if (!draf) return null;
  const jawaban = draf.isi.minat.jawaban_minat;
  const item = ITEM_MINAT.slice(layar * PER_LAYAR, (layar + 1) * PER_LAYAR);
  const lengkap = item.every((i) => jawaban[i.id] !== undefined);
  const awal = layar * PER_LAYAR + 1;

  const pindah = (l: number) => {
    setLayar(l);
    window.scrollTo({ top: 0 });
  };

  return (
    <BingkaiMobile>
      <TopBar title={draf.isi.nama} onBack={() => router.push('/preferensi')} />
      <main className="flex flex-col gap-4 px-6 pt-6 pb-8">
        <Stepper langkah={1} />
        <JudulWizard
          label="LANGKAH 1 · KUIS MINAT"
          judul="Seberapa suka kamu dengan kegiatan ini?"
          keterangan="Bayangkan kamu melakukannya sebagai pekerjaan. Jangan pikirkan gaji atau apakah kamu sudah bisa."
        />
        <div className="flex flex-col gap-1.5">
          <div className="flex items-start gap-2">
            <span className="t-label-s text-ink">
              KEGIATAN {awal}–{awal + item.length - 1} DARI {ITEM_MINAT.length}
            </span>
            <span className="flex-1" />
            <span className="t-body-s text-muted">
              Layar {layar + 1} dari {JUMLAH_LAYAR}
            </span>
          </div>
          <div className="h-2 w-full bg-track">
            <div className="h-2 bg-blue" style={{ width: `${((layar + 1) / JUMLAH_LAYAR) * 100}%` }} />
          </div>
        </div>
        {item.map((i, k) => (
          <KartuMinat
            key={i.id}
            nomor={awal + k}
            teks={i.teks}
            nilai={jawaban[i.id]}
            onPilih={(v) =>
              ubahIsi((isi) => ({ ...isi, minat: { ...isi.minat, jawaban_minat: { ...isi.minat.jawaban_minat, [i.id]: v } } }))
            }
          />
        ))}
        {!lengkap && <p className="t-body-s text-muted">Jawab kelima kegiatan untuk lanjut.</p>}
      </main>
      <BarAksi
        onKembali={() => (layar === 0 ? router.push('/preferensi') : pindah(layar - 1))}
        onLanjut={() => (layar + 1 < JUMLAH_LAYAR ? pindah(layar + 1) : router.push('/preferensi/minat'))}
        nonaktif={!lengkap}
      />
    </BingkaiMobile>
  );
}
