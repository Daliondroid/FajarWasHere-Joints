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

/** Statistik desktop (Figma D01 `184:1983`). */
const STATISTIK_DESKTOP = [
  { nilai: '5.150', label: 'Program studi (snpmb.id)' },
  { nilai: '146', label: 'PTN · akademik, politeknik, PTKIN' },
  { nilai: '1 soal', label: 'Studi kasus per prodi' },
  { nilai: '30', label: 'Kegiatan kuis minat RIASEC' },
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

/** Bintang ilustrasi desktop (Figma `184:2016`), relatif kotak 460 × 460. */
const BINTANG_DESKTOP = [
  { x: 40, y: 40, s: 28 },
  { x: 380, y: 20, s: 24 },
  { x: 400, y: 100, s: 44 },
  { x: 20, y: 190, s: 40 },
  { x: 390, y: 260, s: 26 },
  { x: 50, y: 330, s: 22 },
  { x: 350, y: 380, s: 34 },
];

function KataSorot({ children, warna }: { children: string; warna: string }) {
  return (
    <span className={`border-2 border-ink px-2 py-1.5 shadow-pixel-sm lg:px-2.5 lg:py-2 lg:shadow-pixel-md ${warna}`}>{children}</span>
  );
}

function Ilustrasi({ masuk }: { masuk: boolean }) {
  return masuk ? (
    <IlustrasiSiswa
      gambar={['/figma/siswa-login-1.png', '/figma/siswa-login-2.png']}
      bintang={BINTANG}
      posisi="top-[-1px] left-1/2 -translate-x-1/2"
      className="lg:hidden"
    />
  ) : (
    <IlustrasiSiswa gambar={['/figma/siswa-1.png', '/figma/siswa-2.png']} bintang={BINTANG} className="lg:hidden" />
  );
}

/** Ilustrasi desktop: siswa (belum login, D01) atau siswi (sudah login, D03), kotak 460. */
function IlustrasiDesktop({ masuk }: { masuk: boolean }) {
  return (
    <IlustrasiSiswa
      gambar={masuk ? ['/figma/siswi-1.png', '/figma/siswi-2.png'] : ['/figma/siswa-1.png', '/figma/siswa-2.png']}
      bintang={BINTANG_DESKTOP}
      kotak="size-[460px]"
      ukuranGambar="h-[435px] w-[290px]"
      posisi="top-3 left-[85px]"
      className="hidden lg:block"
    />
  );
}

/** Beranda: mobile M01 belum login (`172:203`) / M04 sudah login (`172:601`); desktop D01 (`184:1919`) / D03 (`184:2164`). */
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
      {/* Hero dengan latar kampus impian + fade (Figma `172:205`, desktop `184:1952`) */}
      <section className="relative flex flex-col gap-5 overflow-hidden px-6 pt-8 lg:h-[920px] lg:px-konten lg:pt-10">
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-[805px] w-[402px] -translate-x-1/2 lg:hidden">
          <Image src="/figma/kampus-impian.png" alt="" fill priority sizes="402px" className="object-cover" />
        </div>
        <div className="pointer-events-none absolute top-[110px] left-1/2 hidden h-[825px] w-[1469px] -translate-x-1/2 lg:block">
          <Image src="/figma/kampus-panorama.png" alt="" fill priority sizes="1469px" className="object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[110px] bg-gradient-to-b from-white/0 via-white via-70% to-white lg:h-[140px] lg:via-75%" />

        <Tag className="relative self-start">5.150 PRODI · 146 PTN · SNBP &amp; SNBT</Tag>
        <h1 className="relative flex flex-wrap items-center gap-x-2.5 gap-y-3 t-display-l text-ink lg:max-w-[820px] lg:gap-3.5 lg:text-[32px] lg:leading-[46px]">
          <span>Temukan</span>
          <span>jurusan</span>
          <span>yang</span>
          <KataSorot warna="bg-blue text-paper">cocok</KataSorot>
          <span>&amp;</span>
          <span>tembus</span>
          <span>kampus</span>
          <KataSorot warna="bg-yellow text-ink">impian</KataSorot>
        </h1>
        <p className="relative t-body-l text-ink-2 lg:w-[560px] lg:text-[18px]">
          Uji rasa kuliahmu lewat studi kasus singkat, cocokkan minat, dan hitung peluang tembus PTN lewat data resmi SNPMB &amp; PDDikti.
        </p>
        <div className="relative flex flex-col gap-3 lg:flex-row lg:gap-3.5">
          {punyaPreferensi ? (
            <Tombol href="/cocokin" ikon penuh className="lg:w-auto">
              Lihat rekomendasi
            </Tombol>
          ) : (
            <Tombol jenis="success" ikon penuh className="lg:w-auto" {...mulai}>
              Mulai sekarang
            </Tombol>
          )}
          <Tombol jenis="secondary" penuh className="lg:w-auto" onClick={keCaraKerja}>
            Lihat cara kerja
          </Tombol>
        </div>
        <div className="h-[400px] lg:hidden" />
        <button
          type="button"
          onClick={keCaraKerja}
          className="absolute bottom-3.5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-0.5 cursor-pointer lg:bottom-[18px]"
        >
          <img src="/figma/icon-chevron-down.svg" alt="" width={20} height={20} className="lg:hidden" />
          <img src="/figma/icon-chevron-down-22.svg" alt="" width={22} height={22} className="hidden lg:block" />
          <span className="t-label-m text-ink">Jelajahi</span>
        </button>
      </section>

      {/* Statistik (Figma `172:228`, desktop `184:1983`) */}
      <section className="px-6 pt-6 lg:px-konten lg:pt-8">
        <div className="flex gap-3 lg:hidden">
          {STATISTIK.map((s) => (
            <div key={s.label} className="flex min-w-0 flex-1 flex-col gap-1 border-[1.5px] border-line bg-paper p-3 whitespace-nowrap">
              <span className="t-display-s text-ink">{s.nilai}</span>
              <span className="t-body-s text-muted">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="hidden gap-5 lg:flex">
          {STATISTIK_DESKTOP.map((s) => (
            <div key={s.label} className="flex min-w-0 flex-1 flex-col gap-1.5 border-[1.5px] border-line bg-paper p-[18px] whitespace-nowrap">
              <span className="font-display text-[22px] leading-8 text-ink">{s.nilai}</span>
              <span className="t-body-s text-muted">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Cara kerja (Figma `172:239`, desktop `184:1996`) */}
      <section
        id="cara-kerja"
        className="flex scroll-mt-16 flex-col gap-4 px-6 pt-10 pb-8 lg:scroll-mt-20 lg:gap-6 lg:px-konten lg:pt-20 lg:pb-10"
      >
        <p className="t-label-s text-blue">CARA KERJA</p>
        <h2 className="t-display-m text-ink lg:text-[26px] lg:leading-[38px]">3 langkah menuju jurusan yang pas</h2>
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
          {LANGKAH.map((l) => (
            <div
              key={l.no}
              className="flex items-start gap-4 border-2 border-ink bg-paper p-4 shadow-pixel-sm lg:flex-1 lg:flex-col lg:gap-3.5 lg:p-6 lg:shadow-pixel-md"
            >
              <span className={`flex size-11 shrink-0 items-center justify-center border-2 border-ink t-display-s lg:size-[52px] ${l.warna}`}>
                {l.no}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1 lg:gap-3.5">
                <h3 className="t-label-m text-ink lg:t-label-l">{l.judul}</h3>
                <p className="t-body-s text-muted lg:t-body-m">{l.isi}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ajakan preferensi (Figma `172:260` / `172:658`, desktop `184:2015` / `184:2221`) */}
      <section className="px-6 pt-2 pb-8 lg:px-konten lg:pt-[60px] lg:pb-20">
        <div className="flex items-center gap-16">
          <IlustrasiDesktop masuk={!!punyaPreferensi} />
          <div className="flex flex-1 flex-col items-center gap-4 pt-8 pb-6 text-center lg:items-start lg:gap-5 lg:p-0 lg:text-left">
            {punyaPreferensi && daftar ? (
              <>
                <h2 className="t-display-m text-ink lg:text-[28px] lg:leading-[41px]">
                  Yuk, lihat <span className="text-blue">rekomendasi</span> jurusan untukmu!
                </h2>
                <p className="t-body-m text-muted lg:text-[18px] lg:leading-[26px]">
                  Kamu punya {daftar.length} preferensi tersimpan. <span className="lg:hidden">Hasilnya</span>
                  <span className="hidden lg:inline">Hasil rekomendasi</span> mengikuti preferensi yang sedang aktif.
                </p>
                <PemilihPreferensi daftar={daftar} onPilih={aktifkan} className="w-[232px]" />
                <Ilustrasi masuk />
                <Tombol href="/cocokin" ikon penuh className="lg:w-auto">
                  Lihat rekomendasi
                </Tombol>
                <Link href="/preferensi" className="t-body-s font-bold text-blue">
                  Kelola preferensi →
                </Link>
              </>
            ) : (
              <>
                <h2 className="t-display-m text-ink lg:text-[28px] lg:leading-[41px]">
                  Isi p<span className="text-green">referensi </span>dulu yuu, biar ramalan Cocokin! makin akurat!
                </h2>
                <p className="t-body-m text-muted lg:text-[18px] lg:leading-[26px]">
                  Kuis minat ±3 menit + data jalur SNBP/SNBT.{' '}
                  <span className="lg:hidden">Bisa simpan beberapa preferensi sekaligus.</span>
                  <span className="hidden lg:inline">Kamu bisa menyimpan beberapa preferensi sekaligus dan memilih mana yang aktif.</span>
                </p>
                <Ilustrasi masuk={false} />
                <Tombol jenis="success" ikon penuh className="lg:w-auto" {...mulai}>
                  Mulai sekarang
                </Tombol>
              </>
            )}
          </div>
        </div>
      </section>

      <LoginModal isOpen={loginTerbuka} onClose={() => setLoginTerbuka(false)} kembali={kembali} />
    </>
  );
}
