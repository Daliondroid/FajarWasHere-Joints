'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import LoginModal from '@/components/auth/LoginModal';
import PemilihPreferensi from '@/components/ui/PemilihPreferensi';
import IlustrasiSiswa from '@/components/ui/IlustrasiSiswa';
import Tag from '@/components/ui/Tag';
import Tombol from '@/components/ui/Tombol';
import { useDaftarPreferensi } from '@/lib/klien/preferensi';

const LANGKAH = [
  { no: '01', warna: 'bg-yellow text-ink', judul: 'Isi kuis minat', isi: '30 kegiatan singkat (RIASEC) menentukan kode Holland-mu.' },
  { no: '02', warna: 'bg-blue text-paper', judul: 'Lengkapi data jalurmu', isi: 'SNBP: NPSN, rapor & TKA. SNBT: nilai try out 7 subtes.' },
  {
    no: '03',
    warna: 'bg-green text-paper',
    judul: 'Lihat peluang & Simulasi',
    isi: 'Kecocokan, peluang per kampus berlabel estimasi, lalu cicipi soal kuliahnya.',
  },
];

const STATISTIK = [
  { nilai: '5.150', label: 'Program studi' },
  { nilai: '146', label: 'PTN' },
  { nilai: '1 Klik', label: 'Simulasi Kuliah' },
];

/** Posisi bintang pixel di ilustrasi (Figma `172:264`), relatif kotak 320 × 330. */
const BINTANG = [
  { x: 34, y: 24, s: 20 },
  { x: 246, y: 8, s: 22 },
  { x: 262, y: 58, s: 34 },
  { x: 22, y: 96, s: 30 },
  { x: 276, y: 142, s: 40 },
  { x: 40, y: 176, s: 16 },
  { x: 254, y: 222, s: 18 },
  { x: 18, y: 248, s: 14 },
];

function KataSorot({ children, warna }: { children: string; warna: string }) {
  return <span className={`border-2 border-ink px-2 py-1.5 shadow-pixel-sm ${warna}`}>{children}</span>;
}

function Ilustrasi({ masuk }: { masuk: boolean }) {
  return masuk ? (
    <IlustrasiSiswa gambar={['/figma/siswa-login-1.png', '/figma/siswa-login-2.png']} bintang={BINTANG} posisi="top-[-1px] left-1/2 -translate-x-1/2" />
  ) : (
    <IlustrasiSiswa gambar={['/figma/siswa-1.png', '/figma/siswa-2.png']} bintang={BINTANG} />
  );
}

/** Beranda mobile: M01 belum login (`172:203`) dan M04 sudah login (`172:601`). */
export default function HeroSection() {
  const { status } = useSession();
  const masuk = status === 'authenticated';
  const [loginTerbuka, setLoginTerbuka] = useState(false);
  const [kembali, setKembali] = useState<string | null>(null);

  // Gerbang login dari middleware: /?login=1&kembali=/halaman-asal (src/lib/auth/rute.ts).
  useEffect(() => {
    if (status !== 'unauthenticated') return;
    const q = new URLSearchParams(window.location.search);
    if (q.get('login') !== '1') return;
    const k = q.get('kembali');
    setKembali(k && k.startsWith('/') && !k.startsWith('//') ? k : null);
    setLoginTerbuka(true);
  }, [status]);
  const { daftar, aktifkan } = useDaftarPreferensi(masuk);
  const punyaPreferensi = masuk && (daftar?.length ?? 0) > 0;

  const keCaraKerja = () => document.getElementById('cara-kerja')?.scrollIntoView({ behavior: 'smooth' });
  const mulai = masuk
    ? { href: punyaPreferensi ? '/cocokin' : '/preferensi/baru' }
    : { onClick: () => setLoginTerbuka(true) };

  return (
    <>
      {/* Hero dengan latar kampus impian + fade (Figma `172:205`) */}
      <section className="relative flex flex-col gap-5 overflow-hidden px-6 pt-8">
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-[805px] w-[402px] -translate-x-1/2">
          <Image src="/figma/kampus-impian.png" alt="" fill priority sizes="402px" className="object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[110px] bg-gradient-to-b from-white/0 via-white via-70% to-white" />

        <Tag className="relative self-start">5.150 PRODI · 146 PTN · SNBP &amp; SNBT</Tag>
        <h1 className="relative flex flex-wrap items-center gap-x-2.5 gap-y-3 t-display-l text-ink">
          <span>Temukan</span>
          <span>jurusan</span>
          <span>yang</span>
          <KataSorot warna="bg-blue text-paper">cocok</KataSorot>
          <span>&amp;</span>
          <span>tembus</span>
          <span>kampus</span>
          <KataSorot warna="bg-yellow text-ink">impian</KataSorot>
        </h1>
        <p className="relative t-body-l text-ink-2">
          Uji rasa kuliahmu lewat studi kasus singkat, cocokkan minat, dan hitung peluang tembus PTN lewat data resmi SNPMB &amp; PDDikti.
        </p>
        <div className="relative flex flex-col gap-3">
          {punyaPreferensi ? (
            <Tombol href="/cocokin" ikon penuh>
              Lihat rekomendasi
            </Tombol>
          ) : (
            <Tombol jenis="success" ikon penuh {...mulai}>
              Mulai sekarang
            </Tombol>
          )}
          <Tombol jenis="secondary" penuh onClick={keCaraKerja}>
            Lihat cara kerja
          </Tombol>
        </div>
        <div className="h-[400px]" />
        <button
          type="button"
          onClick={keCaraKerja}
          className="absolute bottom-3.5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-0.5 cursor-pointer"
        >
          <img src="/figma/icon-chevron-down.svg" alt="" width={20} height={20} />
          <span className="t-label-m text-ink">Jelajahi</span>
        </button>
      </section>

      {/* Statistik (Figma `172:228`) */}
      <section className="px-6 pt-6">
        <div className="flex gap-3">
          {STATISTIK.map((s) => (
            <div key={s.label} className="flex min-w-0 flex-1 flex-col gap-1 border-[1.5px] border-line bg-paper p-3 whitespace-nowrap">
              <span className="t-display-s text-ink">{s.nilai}</span>
              <span className="t-body-s text-muted">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Cara kerja (Figma `172:239`) */}
      <section id="cara-kerja" className="flex scroll-mt-16 flex-col gap-4 px-6 pt-10 pb-8">
        <p className="t-label-s text-blue">CARA KERJA</p>
        <h2 className="t-display-m text-ink">3 langkah menuju jurusan yang pas</h2>
        {LANGKAH.map((l) => (
          <div key={l.no} className="flex items-start gap-4 border-2 border-ink bg-paper p-4 shadow-pixel-sm">
            <span className={`flex size-11 shrink-0 items-center justify-center border-2 border-ink t-display-s ${l.warna}`}>{l.no}</span>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h3 className="t-label-m text-ink">{l.judul}</h3>
              <p className="t-body-s text-muted">{l.isi}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Ajakan preferensi (Figma `172:260` / `172:658`) */}
      <section className="px-6 pt-2 pb-8">
        <div className="flex flex-col items-center gap-4 pt-8 pb-6 text-center">
          {punyaPreferensi && daftar ? (
            <>
              <h2 className="t-display-m text-ink">
                Yuk, lihat <span className="text-blue">rekomendasi</span> jurusan untukmu!
              </h2>
              <p className="t-body-m text-muted">
                Kamu punya {daftar.length} preferensi tersimpan. Hasilnya mengikuti preferensi yang sedang aktif.
              </p>
              <PemilihPreferensi daftar={daftar} onPilih={aktifkan} className="w-[232px]" />
              <Ilustrasi masuk />
              <Tombol href="/cocokin" ikon penuh>
                Lihat rekomendasi
              </Tombol>
              <Link href="/preferensi" className="t-body-s font-bold text-blue">
                Kelola preferensi →
              </Link>
            </>
          ) : (
            <>
              <h2 className="t-display-m text-ink">
                Isi p<span className="text-green">referensi </span>dulu yuu, biar ramalan Cocokin! makin akurat!
              </h2>
              <p className="t-body-m text-muted">Kuis minat ±3 menit + data jalur SNBP/SNBT. Bisa simpan beberapa preferensi sekaligus.</p>
              <Ilustrasi masuk={false} />
              <Tombol jenis="success" ikon penuh {...mulai}>
                Mulai sekarang
              </Tombol>
            </>
          )}
        </div>
      </section>

      <LoginModal isOpen={loginTerbuka} onClose={() => setLoginTerbuka(false)} kembali={kembali} />
    </>
  );
}
