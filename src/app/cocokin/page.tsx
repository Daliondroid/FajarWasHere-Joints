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

/** M13 · Rekomendasi (Figma `205:3349`) + M14 popup DETAIL (`205:3518`). Data dari GET /api/rekomendasi (preferensi aktif). */
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
      <main className="flex flex-col gap-6 px-6 pt-8 pb-10">
        <div className="flex flex-col gap-3">
          <Tag warna="green" className="self-start">
            {data ? 'ANALISIS SELESAI' : 'MENGANALISIS…'}
          </Tag>
          <h1 className="t-display-m text-ink">Rekomendasi jurusan untukmu</h1>
          <p className="t-body-m text-muted">Berdasarkan minat, hobi, dan data akademik di preferensi aktifmu.</p>
          {daftar && daftar.length > 0 && <PemilihPreferensi daftar={daftar} onPilih={ganti} className="w-[232px]" />}
        </div>

        {galat && <p className="t-body-s font-bold text-red">{galat}</p>}
        {data === undefined && !galat && <p className="t-body-m text-muted">Menghitung kecocokan dan peluang…</p>}

        {data === null && !galat && (
          <div className="flex flex-col gap-3 border-2 border-ink bg-yellow-50 p-5 shadow-pixel-sm">
            <p className="t-display-s text-ink">Belum ada preferensi</p>
            <p className="t-body-m text-ink-2">Isi kuis minat dan data jalurmu dulu supaya Cocokin! bisa memberi rekomendasi.</p>
            <Tombol href="/preferensi/baru" ikon penuh>
              Buat preferensi
            </Tombol>
          </div>
        )}

        {data && kurang.length > 0 && (
          <div className="flex flex-col gap-3 border-2 border-ink bg-yellow-50 p-5 shadow-pixel-sm">
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
            <div className="flex flex-col gap-5">
              {data.kartu.map((k) => (
                <TiketJurusan key={k.jenis} k={k} onDetail={() => setDetail(k)} onSimulasi={() => keSimulasi(k)} />
              ))}
            </div>
          </>
        )}

        <section className="flex flex-col gap-3 border-2 border-ink bg-yellow-50 p-5 shadow-pixel-sm">
          <h2 className="t-display-s text-ink">Penasaran jurusan lain?</h2>
          <p className="t-body-m text-ink-2">Coba simulasi untuk merasakan studi kasus asli tiap jurusan.</p>
          <Tombol jenis="danger" href="/katalog" ikon penuh className="border-paper">
            Jelajahi simulasi
          </Tombol>
        </section>

        <section className="flex flex-col items-center gap-4 pt-8 pb-6 text-center">
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
