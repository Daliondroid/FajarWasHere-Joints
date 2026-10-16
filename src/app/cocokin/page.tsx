'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { KartuRekomendasi, ResponsPreferensi, ResponsRekomendasi } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BingkaiMobile from '@/components/ui/BingkaiMobile';
import IlustrasiSiswa from '@/components/ui/IlustrasiSiswa';
import PemilihPreferensi from '@/components/ui/PemilihPreferensi';
import Tag from '@/components/ui/Tag';
import Tombol from '@/components/ui/Tombol';
import TiketJurusan from '@/components/rekomendasi/TiketJurusan';
import PopupDetail from '@/components/rekomendasi/PopupDetail';
import { panggilApi, pesanGalat } from '@/lib/klien/api';
import { useDaftarPreferensi } from '@/lib/klien/preferensi';
import { drafDariPreferensi, simpanDraf } from '@/lib/klien/draf_preferensi';

const NAMA_SKALA: Record<string, string> = {
  R: 'Realistik',
  I: 'Investigatif',
  A: 'Artistik',
  S: 'Sosial',
  E: 'Enterprising',
  C: 'Konvensional',
};

/** Bintang ilustrasi banner chat desktop (Figma `188:2884`), kotak 150 × 220. */
const BINTANG_DESKTOP = [
  { x: 0, y: 10, s: 18 },
  { x: 128, y: 0, s: 16 },
  { x: 132, y: 120, s: 22 },
];

/** Bintang ilustrasi ajakan chat (Figma `205:3368`). */
const BINTANG = [
  { x: 226, y: 4, s: 20 },
  { x: 30, y: 30, s: 22 },
  { x: 248, y: 50, s: 30 },
  { x: 16, y: 120, s: 36 },
  { x: 270, y: 118, s: 18 },
  { x: 262, y: 200, s: 34 },
  { x: 30, y: 214, s: 16 },
  { x: 60, y: 74, s: 14 },
];

type Data = NonNullable<ResponsRekomendasi['data']>;

/** M13 · Rekomendasi (Figma `205:3349`) + M14 popup DETAIL (`205:3518`); desktop D07 (`188:2673`) + D07b. Data dari GET /api/rekomendasi. */
export default function RekomendasiPage() {
  const router = useRouter();
  const { daftar, aktifkan } = useDaftarPreferensi(true);
  const [data, setData] = useState<Data | null | undefined>(undefined);
  const [galat, setGalat] = useState<string | null>(null);
  const [detail, setDetail] = useState<KartuRekomendasi | null>(null);

  const muat = useCallback(async () => {
    setData(undefined);
    try {
      const r = await panggilApi<ResponsRekomendasi>('/api/rekomendasi');
      setData(r.data);
      setGalat(null);
    } catch (e) {
      setGalat(pesanGalat(e));
      setData(null);
    }
  }, []);

  useEffect(() => {
    void muat();
  }, [muat]);

  const ganti = async (id: string) => {
    await aktifkan(id);
    await muat();
  };

  const keSimulasi = (k: KartuRekomendasi) => router.push(`/test-drive/${k.prodi.id_prodi}`);

  /** Buka wizard langsung di langkah bahan jalur untuk preferensi aktif (T-30). */
  const lengkapi = async () => {
    if (!data) return;
    try {
      const { data: d } = await panggilApi<ResponsPreferensi>(`/api/preferensi/${data.preferensi.id}`);
      if (d) simpanDraf(drafDariPreferensi(d));
      router.push('/preferensi/akademik');
    } catch (e) {
      setGalat(pesanGalat(e));
    }
  };
  const kurang = data?.bahan_kurang ?? [];

  return (
    <BingkaiMobile>
      <Navbar />
      <main className="flex flex-col gap-6 px-6 pt-8 pb-10 lg:gap-7 lg:px-konten lg:pt-12 lg:pb-[72px]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-8">
          <div className="flex flex-col gap-3 lg:min-w-0 lg:flex-1 lg:gap-3.5">
            <Tag warna="green" className="self-start lg:hidden">
              {data ? 'ANALISIS SELESAI' : 'MENGANALISIS…'}
            </Tag>
            <div className="flex flex-col gap-2.5">
              <p className="hidden t-label-s text-blue lg:block">HASIL REKOMENDASI JURUSAN &amp; KAMPUSMU</p>
              <h1 className="t-display-m text-ink lg:text-[28px] lg:leading-[41px]">Rekomendasi jurusan untukmu</h1>
            </div>
            <p className="t-body-m text-muted lg:hidden">Berdasarkan minat, hobi, dan data akademik di preferensi aktifmu.</p>
            {data?.kode_holland && (
              <div className="hidden items-center gap-2.5 lg:flex">
                <Tag warna="ink">KODE HOLLAND-MU: {data.kode_holland}</Tag>
                <span className="t-body-s font-bold text-ink-2">{NAMA_SKALA[data.kode_holland[0]] ?? ''}</span>
              </div>
            )}
          </div>
          {daftar && daftar.length > 0 && <PemilihPreferensi daftar={daftar} onPilih={ganti} className="w-[232px] lg:shrink-0" />}
        </div>

        {galat && <p className="t-body-s font-bold text-red">{galat}</p>}
        {data === undefined && !galat && <p className="t-body-m text-muted">Menghitung kecocokan dan peluang…</p>}

        {data === null && !galat && (
          <div className="flex flex-col gap-3 border-2 border-ink bg-yellow-50 p-5 shadow-pixel-sm lg:max-w-[560px]">
            <p className="t-display-s text-ink">Belum ada preferensi</p>
            <p className="t-body-m text-ink-2">Isi kuis minat dan data jalurmu dulu supaya Cocokin! bisa memberi rekomendasi.</p>
            <Tombol href="/preferensi/baru" ikon penuh>
              Buat preferensi
            </Tombol>
          </div>
        )}

        {data && kurang.length > 0 && (
          <div className="flex flex-col gap-3 border-2 border-ink bg-yellow-50 p-5 shadow-pixel-sm lg:max-w-[560px]">
            <p className="t-display-s text-ink">Lengkapi bahanmu dulu</p>
            <p className="t-body-m text-ink-2">
              Cocokin! belum bisa menghitung rekomendasi untuk &quot;{data.preferensi.nama}&quot; karena data ini masih kosong:
            </p>
            <ul className="list-disc pl-5 t-body-m text-ink">
              {kurang.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
            <Tombol ikon penuh onClick={lengkapi}>
              Lengkapi sekarang
            </Tombol>
          </div>
        )}

        {data && kurang.length === 0 && (
          <>
            {data.catatan.length > 0 && (
              <div className="flex flex-col gap-1.5 border-[1.5px] border-yellow bg-yellow-50 p-3">
                {data.catatan.map((c) => (
                  <p key={c} className="t-body-s text-ink">
                    {c}
                  </p>
                ))}
              </div>
            )}
            {data.validasi_provinsi_snbp && !data.validasi_provinsi_snbp.valid && data.validasi_provinsi_snbp.pesan && (
              <p className="border-[1.5px] border-red bg-red-50 p-3 t-body-s text-ink">{data.validasi_provinsi_snbp.pesan}</p>
            )}
            <div className="flex flex-col gap-5 lg:flex-row lg:gap-6">
              {data.kartu.map((k) => (
                <TiketJurusan key={k.jenis} k={k} onDetail={() => setDetail(k)} onSimulasi={() => keSimulasi(k)} />
              ))}
            </div>
          </>
        )}

        <div className="contents lg:flex lg:items-stretch lg:gap-8">
        {/* Banner Simulasi desktop (Figma `188:2874`) */}
        <section className="hidden flex-1 flex-col items-start gap-3.5 border-2 border-ink bg-yellow-50 p-7 shadow-pixel-sm lg:flex">
          <Tag warna="ink">SIMULASI</Tag>
          <h2 className="font-display text-[18px] leading-[26px] text-ink">Mau rasakan studi kasusnya sebelum memilih?</h2>
          <p className="t-body-m text-ink-2">Jawab soal kompetensi asli prodi, lalu lihat pembahasan, kompetensi lulusan, dan fakta persaingannya.</p>
          {data?.kartu[0] ? (
            <Tombol jenis="secondary" ikon onClick={() => keSimulasi(data.kartu[0])}>
              Simulasi jurusan ini
            </Tombol>
          ) : (
            <Tombol jenis="secondary" ikon href="/katalog">
              Jelajahi simulasi
            </Tombol>
          )}
        </section>

        {/* Banner chat desktop (Figma `188:2883`) */}
        <section className="hidden flex-1 items-center gap-5 border-2 border-dashed border-blue bg-blue-50 py-5 pr-7 pl-5 lg:flex">
          <IlustrasiSiswa
            gambar={['/figma/siswi-1.png', '/figma/siswi-2.png']}
            bintang={BINTANG_DESKTOP}
            kotak="h-[220px] w-[150px]"
            ukuranGambar="h-[210px] w-[140px]"
            posisi="top-[5px] left-[5px]"
          />
          <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
            <h2 className="font-display text-[18px] leading-[26px] text-ink">Beri tahu kami jurusan &amp; kampus apa yang kamu incar!</h2>
            <p className="t-body-m text-muted">Cocokin AI menjawab pakai data resmi dan preferensi aktifmu.</p>
            <Tombol href="/chat" ikon>
              Di chat yuu
            </Tombol>
          </div>
        </section>
        </div>

        <section className="flex flex-col gap-3 border-2 border-ink bg-yellow-50 p-5 shadow-pixel-sm lg:hidden">
          <h2 className="t-display-s text-ink">Penasaran jurusan lain?</h2>
          <p className="t-body-m text-ink-2">Coba simulasi untuk merasakan studi kasus asli tiap jurusan.</p>
          <Tombol jenis="danger" href="/katalog" ikon penuh className="border-paper">
            Jelajahi simulasi
          </Tombol>
        </section>

        <section className="flex flex-col items-center gap-4 pt-8 pb-6 text-center lg:hidden">
          <IlustrasiSiswa gambar={['/figma/siswi-1.png', '/figma/siswi-2.png']} bintang={BINTANG} />
          <h2 className="t-display-s text-ink leading-6">
            Masih ragu?
            <br />
            Tanya Cocokin AI
          </h2>
          <p className="t-body-m text-muted">Ceritakan jurusan &amp; kampus incaranmu, kami bantu susun strategi masuknya.</p>
          <Tombol href="/chat" ikon penuh>
            Mulai chat
          </Tombol>
        </section>
      </main>
      <Footer />

      {detail && data && (
        <PopupDetail
          k={detail}
          jalur={data.preferensi.jalur}
          kodeSiswa={data.kode_holland}
          onTutup={() => setDetail(null)}
          onSimulasi={() => keSimulasi(detail)}
        />
      )}
    </BingkaiMobile>
  );
}
