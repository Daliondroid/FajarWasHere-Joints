'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ResponsKecocokan } from '@/types';
import { TopBar } from '@/components/ui/TopBar';
import BingkaiMobile from '@/components/ui/BingkaiMobile';
import { BarAksi, Chip, GridKolom, JudulWizard, LayoutWizard, PenandaPreferensi, Stepper } from '@/components/preferensi/BagianWizard';
import { OPSI_HOBI, OPSI_MAPEL_FAVORIT } from '@/lib/skoring/parameter';
import { panggilApi, pesanGalat } from '@/lib/klien/api';
import { useDraf } from '@/lib/klien/draf_preferensi';

const MAKS_MAPEL = 3;
const SKALA = ['R', 'I', 'A', 'S', 'E', 'C'] as const;
const NAMA_EN: Record<string, string> = { R: 'Realistic', I: 'Investigative', A: 'Artistic', S: 'Social', E: 'Enterprising', C: 'Conventional' };
const NAMA_ID: Record<string, string> = { R: 'Realistik', I: 'Investigatif', A: 'Artistik', S: 'Sosial', E: 'Enterprising', C: 'Konvensional' };
/** Warna batang 3 huruf teratas: #1 blue, #2 green, #3 yellow; lainnya track (Figma `174:901`). */
const WARNA_PERINGKAT = ['bg-blue', 'bg-green', 'bg-yellow'];

const desimal = (n: number) => n.toFixed(1).replace('.', ',');

/** M09 · Hasil minat, hobi & mapel (Figma `174:852`). Skor RIASEC dihitung server (POST /api/kecocokan). */
export default function HasilMinatPage() {
  const router = useRouter();
  const { draf, ubahIsi } = useDraf();
  const [hasil, setHasil] = useState<ResponsKecocokan | null>(null);
  const [galat, setGalat] = useState<string | null>(null);

  const jawaban = draf?.isi.minat.jawaban_minat;
  useEffect(() => {
    if (!jawaban) return;
    panggilApi<ResponsKecocokan>('/api/kecocokan', { method: 'POST', body: { jawaban_minat: jawaban, mode: 'mini_ip_30', batas: 1 } })
      .then(setHasil)
      .catch((e) => setGalat(pesanGalat(e)));
  }, [jawaban]);

  if (!draf) return null;
  const { chip_hobi, mapel_favorit } = draf.isi.minat;
  const kode = hasil?.kode_holland ?? '';

  const alihkan = (daftar: string[], nilai: string, maks = Infinity) =>
    daftar.includes(nilai) ? daftar.filter((x) => x !== nilai) : daftar.length < maks ? [...daftar, nilai] : daftar;

  return (
    <BingkaiMobile>
      <TopBar title={draf.isi.nama} onBack={() => router.push('/preferensi/riasec')} />
      <LayoutWizard
        gap="gap-5"
        kiri={
          <>
            <PenandaPreferensi jalur={draf.isi.jalur} nama={draf.isi.nama} />
            <Stepper langkah={1} />
            <JudulWizard label="HASIL KUIS MINAT" judul={hasil ? `Kelas karaktermu: ${kode}` : 'Menghitung kelas karaktermu…'} />
          </>
        }
      >
        {galat && <p className="t-body-s font-bold text-red">{galat}</p>}

        {/* Desktop (D05b `272:5207`): Kolom A = profil RIASEC + mapel favorit, Kolom B = hobi; mobile tetap berurutan lewat order */}
        <GridKolom
          a={
            <>
              {hasil && (
                <section
                  className="flex flex-col gap-3.5 border-2 border-ink bg-ink p-4 shadow-pixel-md order-1"
                  aria-label="Profil RIASEC"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="border-2 border-yellow px-3 py-2.5 t-display-l text-yellow">{kode}</span>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <p className="t-label-l text-paper">{NAMA_ID[kode[0]]}</p>
                      <p className="t-body-s text-line">{kode.split('').map((h) => NAMA_EN[h]).join(' · ')}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {SKALA.map((h) => {
                      const skor = hasil.skor_riasec[h];
                      const peringkat = kode.indexOf(h);
                      return (
                        <div key={h} className="flex items-center gap-2.5">
                          <span className="w-3 t-label-s text-paper">{h}</span>
                          <span className="h-2.5 w-[200px] bg-ink-2">
                            <span
                              className={`block h-2.5 ${peringkat >= 0 ? WARNA_PERINGKAT[peringkat] : 'bg-track'}`}
                              style={{ width: `${(skor / 7) * 100}%` }}
                            />
                          </span>
                          <span className="t-body-s font-bold text-paper">{desimal(skor)}</span>
                        </div>
                      );
                    })}
                  </div>
                  {hasil.peringatan.map((p) => (
                    <p key={p} className="t-body-s text-yellow">
                      {p}
                    </p>
                  ))}
                </section>
              )}
              <section className="flex flex-col gap-2.5 order-3">
                <h2 className="t-label-m text-ink">
                  Mapel favorit · {mapel_favorit.length}/{MAKS_MAPEL}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {OPSI_MAPEL_FAVORIT.map((m) => (
                    <Chip
                      key={m}
                      label={m}
                      pilih={mapel_favorit.includes(m)}
                      onClick={() =>
                        ubahIsi((isi) => ({ ...isi, minat: { ...isi.minat, mapel_favorit: alihkan(isi.minat.mapel_favorit, m, MAKS_MAPEL) } }))
                      }
                    />
                  ))}
                </div>
              </section>
            </>
          }
          b={
            <section className="flex flex-col gap-2.5 order-2">
              <h2 className="t-label-m text-ink">Hobi pelengkap</h2>
              <div className="flex flex-wrap gap-2">
                {OPSI_HOBI.map((h) => (
                  <Chip
                    key={h.id}
                    label={h.label}
                    pilih={chip_hobi.includes(h.id)}
                    onClick={() => ubahIsi((isi) => ({ ...isi, minat: { ...isi.minat, chip_hobi: alihkan(isi.minat.chip_hobi, h.id) } }))}
                  />
                ))}
              </div>
            </section>
          }
        />
      </LayoutWizard>
      <BarAksi onKembali={() => router.push('/preferensi/riasec')} onLanjut={() => router.push('/preferensi/akademik')} nonaktif={!hasil} />
    </BingkaiMobile>
  );
}
