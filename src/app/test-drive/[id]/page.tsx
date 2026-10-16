'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { ResponsJawabTestDrive, ResponsTestDrive, SoalTestDrive } from '@/types';
import { TopBar } from '@/components/ui/TopBar';
import BingkaiMobile from '@/components/ui/BingkaiMobile';
import { RetroWindow } from '@/components/ui/RetroWindow';
import IkonFigma from '@/components/ui/IkonFigma';
import Tag from '@/components/ui/Tag';
import Tombol from '@/components/ui/Tombol';
import { panggilApi, pesanGalat } from '@/lib/klien/api';

type Huruf = 'A' | 'B' | 'C' | 'D';
const HURUF: Huruf[] = ['A', 'B', 'C', 'D'];
const kapital = (s: string) => s.toLowerCase().replace(/\b\w/g, (h) => h.toUpperCase());
const persen = (r: number) => `${(r * 100).toFixed(1).replace('.', ',')}%`;

/** Banner pembuka/hasil (Figma "Intro banner"): garis putus-putus merah + aksen kiri. */
function Banner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex border-2 border-dashed border-red bg-paper">
      <span className="w-2 shrink-0 bg-red" />
      <p className="flex-1 p-4 t-label-l text-ink">{children}</p>
    </div>
  );
}

/** Opsi jawaban: belum dijawab = Option Compact; sesudah koreksi = BENAR hijau / JAWABANMU merah (K-08). */
function OpsiJawaban({
  huruf,
  teks,
  pilih,
  hasil,
  onPilih,
}: {
  huruf: Huruf;
  teks: string;
  pilih: boolean;
  hasil: ResponsJawabTestDrive | null;
  onPilih: () => void;
}) {
  const benar = hasil?.kunci === huruf;
  const salahKu = !!hasil && pilih && !benar;
  const gaya = benar
    ? 'border-[1.5px] border-green bg-green-50'
    : salahKu
      ? 'border-[1.5px] border-red bg-red-50'
      : pilih && !hasil
        ? 'bg-blue-50'
        : '';
  const kotak = benar ? 'border-green bg-green' : salahKu ? 'border-red bg-red' : pilih && !hasil ? 'border-blue bg-blue' : 'border-ink bg-paper';
  const warnaTeks = hasil ? (benar || salahKu ? 'text-ink' : 'text-muted') : pilih ? 'text-blue-700' : 'text-ink';
  return (
    <button type="button" role="radio" aria-checked={pilih} disabled={!!hasil} onClick={onPilih} className={`flex w-full items-center gap-3 p-2 text-left cursor-pointer disabled:cursor-default ${gaya}`}>
      <span className={`flex size-[22px] shrink-0 items-center justify-center border-2 ${kotak}`}>
        {(benar || (pilih && !hasil)) && <IkonFigma src="/figma/icon-check-12.svg" ukuran={12} className="text-paper" />}
        {salahKu && <img src="/figma/icon-silang-12.svg" alt="" width={12} height={12} />}
      </span>
      <span className="flex min-w-0 flex-1 items-start gap-2">
        <span className={`flex-1 t-body-m ${warnaTeks}`}>
          {huruf}. {teks}
        </span>
        {benar && <Tag warna="green">BENAR</Tag>}
        {salahKu && <Tag warna="red">JAWABANMU</Tag>}
      </span>
    </button>
  );
}

/** M18 soal (`206:3221`) + M19 hasil koreksi (`207:3189`). GET /api/test-drive, POST /api/test-drive/jawab. Tanpa timer (K-06). */
export default function SimulasiPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const idProdi = Number(params.id);
  const [data, setData] = useState<ResponsTestDrive | null>(null);
  const [galat, setGalat] = useState<string | null>(null);
  const [nomor, setNomor] = useState(0);
  const [pilihan, setPilihan] = useState<Huruf | null>(null);
  const [hasil, setHasil] = useState<ResponsJawabTestDrive | null>(null);
  const [sibuk, setSibuk] = useState(false);

  useEffect(() => {
    if (!Number.isInteger(idProdi) || idProdi <= 0) {
      setGalat('Prodi tidak valid.');
      return;
    }
    panggilApi<ResponsTestDrive>(`/api/test-drive?id_prodi=${idProdi}`)
      .then(setData)
      .catch((e) => setGalat(pesanGalat(e)));
  }, [idProdi]);

  const soal: SoalTestDrive | undefined = data?.soal[nomor];
  const terakhir = !!data && nomor >= data.soal.length - 1;

  const kunci = async () => {
    if (!soal || !pilihan) return;
    setSibuk(true);
    try {
      setHasil(await panggilApi<ResponsJawabTestDrive>('/api/test-drive/jawab', { method: 'POST', body: { id_prodi: idProdi, id_soal: soal.id_soal, jawaban: pilihan } }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setGalat(pesanGalat(e));
    } finally {
      setSibuk(false);
    }
  };

  const berikutnya = () => {
    setNomor((n) => n + 1);
    setPilihan(null);
    setHasil(null);
    window.scrollTo({ top: 0 });
  };

  const namaProdi = data ? kapital(data.prodi.nama_prodi) : 'Simulasi';
  const rc = data?.reality_check;
  const kampus = data ? kapital(data.prodi.nama_ptn) : '';
  const ketat = rc?.fakta_persaingan.keketatan_snbp ?? rc?.fakta_persaingan.keketatan_snbt ?? null;

  return (
    <BingkaiMobile>
      <TopBar title={namaProdi} onBack={() => router.back()} />
      <main className="flex flex-col gap-6 px-6 pt-6 pb-8">
        {galat && <p className="t-body-s font-bold text-red">{galat}</p>}
        {!data && !galat && <p className="t-body-m text-muted">Menyiapkan soal…</p>}
        {data && data.soal.length === 0 && <Banner>Belum ada soal simulasi untuk prodi ini.</Banner>}

        {soal && (
          <>
            <Banner>
              {hasil
                ? hasil.benar
                  ? `Mantap, jawabanmu ${pilihan} tepat!`
                  : `Jawabanmu ${pilihan} belum tepat. Jawaban yang benar ditandai hijau.`
                : `Yuk, rasakan cara berpikir anak ${namaProdi}!`}
            </Banner>

            <RetroWindow title={`Skenario · soal ${nomor + 1}/${data!.soal.length}`} variant="yellow" contentClassName="flex flex-col gap-4 px-4 pt-4 pb-5">
              {soal.status?.startsWith('otomatis') && (
                <Tag warna="ink" className="self-start">
                  DIBANTU AI · PERLU TINJAUAN
                </Tag>
              )}
              <p className="t-label-m whitespace-pre-wrap text-ink">{soal.pertanyaan}</p>
              <div className="flex flex-col gap-2" role="radiogroup" aria-label="Pilihan jawaban">
                {HURUF.map((h) => (
                  <OpsiJawaban key={h} huruf={h} teks={soal.opsi[h]} pilih={pilihan === h} hasil={hasil} onPilih={() => setPilihan(h)} />
                ))}
              </div>
              {soal.sumber && <p className="t-body-s text-muted">Sumber: {soal.sumber}</p>}
            </RetroWindow>

            {hasil && (
              <RetroWindow title="Pembahasan" variant="green" contentClassName="flex flex-col gap-4 px-4 pt-4 pb-5">
                <p className="flex items-center gap-2 t-label-l text-green">
                  <img src="/figma/icon-check-hijau-18.svg" alt="" width={18} height={18} />
                  Jawaban benar: {hasil.kunci}
                </p>
                <p className="t-body-m whitespace-pre-wrap text-ink-2">{hasil.pembahasan ?? 'Pembahasan untuk soal ini belum tersedia.'}</p>
              </RetroWindow>
            )}

            {hasil && terakhir && rc && (
              <RetroWindow title={`Kenyataan kuliah · ${namaProdi}`} variant="blue" contentClassName="flex flex-col gap-4 px-4 pt-4 pb-5">
                {rc.kompetensi_lulusan.length > 0 && (
                  <p className="flex items-start gap-3 t-body-m text-ink-2">
                    <img src="/figma/icon-panah-biru.svg" alt="" width={14} height={14} className="mt-1 shrink-0" />
                    <span>
                      <b className="text-ink">Kompetensi lulusan:</b> {rc.kompetensi_lulusan.join(', ')} (PDDikti).
                    </span>
                  </p>
                )}
                {rc.fakta_kampus && (
                  <p className="flex items-start gap-3 t-body-m text-ink-2">
                    <img src="/figma/icon-panah-biru.svg" alt="" width={14} height={14} className="mt-1 shrink-0" />
                    <span>
                      <b className="text-ink">Kampus {kampus}:</b> akreditasi {rc.fakta_kampus.akreditasi}
                      {rc.fakta_kampus.rasio_dosen_mhs && ` · dosen:mhs ${rc.fakta_kampus.rasio_dosen_mhs}`}
                      {rc.fakta_kampus.rata_masa_studi_th != null && ` · masa studi ${String(rc.fakta_kampus.rata_masa_studi_th).replace('.', ',')} tahun`} (PDDikti).
                    </span>
                  </p>
                )}
                <p className="flex items-start gap-3 t-body-m text-ink-2">
                  <img src="/figma/icon-panah-biru.svg" alt="" width={14} height={14} className="mt-1 shrink-0" />
                  <span>
                    <b className="text-ink">Persaingan:</b>{' '}
                    {rc.fakta_persaingan.daya_tampung_snbp_2026 != null && `daya tampung SNBP 2026 ${rc.fakta_persaingan.daya_tampung_snbp_2026} kursi`}
                    {rc.fakta_persaingan.daya_tampung_snbp_2026 == null && rc.fakta_persaingan.daya_tampung_snbt_2026 != null && `daya tampung SNBT 2026 ${rc.fakta_persaingan.daya_tampung_snbt_2026} kursi`}
                    {ketat && ` · rasio ${ketat.tahun} ${persen(ketat.rasio)}`} (snpmb.id).
                  </span>
                </p>
              </RetroWindow>
            )}

            <div className="flex flex-col gap-3">
              {!hasil ? (
                <Tombol ikon penuh disabled={!pilihan || sibuk} onClick={kunci}>
                  {sibuk ? 'Memeriksa…' : 'Kunci jawaban'}
                </Tombol>
              ) : terakhir ? (
                <>
                  <Tombol href="/katalog" ikon penuh>
                    Coba jurusan lain
                  </Tombol>
                  <Tombol href="/cocokin" jenis="secondary" penuh>
                    Kembali ke Cocokin
                  </Tombol>
                </>
              ) : (
                <Tombol ikon penuh onClick={berikutnya}>
                  Soal berikutnya
                </Tombol>
              )}
            </div>
          </>
        )}
      </main>
    </BingkaiMobile>
  );
}
