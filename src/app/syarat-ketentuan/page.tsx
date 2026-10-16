'use client';

import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/ui/TopBar';
import Footer from '@/components/Footer';
import BingkaiMobile from '@/components/ui/BingkaiMobile';

/** Isi Halaman Syarat & Ketentuan (Figma M20 `215:3198`, desktop D11 `215:3387`, PRD F-20). */
const BAGIAN = [
  {
    judul: 'Angka peluang & estimasi',
    ikon: '/figma/icon-chart.svg',
    poin: [
      'Semua angka peluang adalah estimasi dari data resmi tahun sebelumnya, bukan jaminan kelulusan.',
      'Peluang selalu tampil sebagai rentang. Akreditasi sekolah dan reputasi alumni masing-masing menggeser hasil paling banyak ±5 poin persentil.',
      'Prodi tanpa data histori memakai rata-rata rumpun yang sama di PTN itu dan diberi label "data terbatas".',
      'Skala skor Try Out tiap bimbel berbeda dan bukan IRT, jadi peluang SNBT hanya perkiraan kasar.',
    ],
  },
  {
    judul: 'Aturan SNBP & SNBT',
    ikon: '/figma/icon-check.svg',
    poin: [
      'Dua pilihan prodi SNBP sah hanya jika salah satu PTN berada di provinsi sekolahmu.',
      'Lulusan 2024 dan 2025 hanya bisa ikut SNBT. Yang sudah lulus SNBP 2024–2026 tidak bisa ikut SNBT 2026.',
      'Nilai TKA dipakai untuk memvalidasi nilai rapor. Dua mapel pilihan TKA bebas kamu pilih; menyamakannya dengan mapel pendukung prodi incaran hanya anjuran.',
      'Mapel pendukung paling banyak 2, mengikuti Kepmendikdasmen 102/M/2025.',
      '267 prodi seni dan olahraga mewajibkan portofolio.',
    ],
  },
  {
    judul: 'Kecocokan & preferensi',
    ikon: '/figma/icon-spark.svg',
    poin: [
      'Skor kecocokan dihitung otomatis, bukan oleh AI: 80% dari profil minat RIASEC dan 20% dari hobi. Mapel favorit (maks. 3) hanya penentu urutan saat skor sama.',
      'Satu preferensi punya satu jalur, SNBP atau SNBT, yang tidak bisa diubah. Untuk jalur lain, buat preferensi baru.',
      'Hanya satu preferensi yang aktif. Jika preferensi aktif dihapus, preferensi yang terakhir diperbarui menjadi aktif.',
    ],
  },
  {
    judul: 'Data sekolah & alumni',
    ikon: '/figma/icon-school.svg',
    poin: [
      'Kuota eligible sekolah diambil dari data resmi SNPMB berdasarkan NPSN.',
      'Data alumni per sekolah tidak tersedia publik. Reputasi alumni berasal dari isianmu sendiri, dan data alumni di versi demo ini bersifat sintetis.',
    ],
  },
  {
    judul: 'Privasi',
    ikon: '/figma/icon-lock-24.svg',
    poin: [
      'Kami hanya menyimpan nama dan email dari akun Google-mu.',
      'Alamat cukup provinsi dan kabupaten/kota, terisi otomatis dari NPSN.',
      'Foto atau PDF rapor dihapus setelah nilainya diekstrak. Cek ulang hasil ekstraksi sebelum disimpan.',
      'Akun dan semua datamu bisa dihapus kapan saja lewat "Hapus akun & data" di footer.',
    ],
  },
  {
    judul: 'AI & sumber data',
    ikon: '/figma/icon-info-24.svg',
    poin: [
      'AI hanya dipakai untuk membaca rapor dan teks hobi, serta menjawab chatbot. Angka di jawaban chatbot diambil dari data internal, bukan dikarang AI.',
      'Soal Simulasi disusun dari kompetensi lulusan resmi (PDDikti) dan ditinjau tim. Soal buatan AI diberi label.',
      'Kuis minat memakai O*NET Interest Profiler, lisensi CC BY 4.0.',
    ],
  },
];

const idBagian = (judul: string) =>
  judul
    .toLowerCase()
    .replace(/&/g, 'dan')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const Pemisah = () => <img src="/figma/pemisah.svg" alt="" width={354} height={1.5} className="h-[1.5px] w-full" />;

export default function SyaratKetentuanPage() {
  const router = useRouter();
  const [aktif, setAktif] = useState(idBagian(BAGIAN[0].judul));

  // Daftar isi desktop (D11 `215:3422`): sorot bagian yang sedang terbaca.
  useEffect(() => {
    const pantau = () => {
      const lewat = BAGIAN.map((b) => idBagian(b.judul)).filter((id) => {
        const el = document.getElementById(id);
        return el && el.getBoundingClientRect().top < 160;
      });
      setAktif(lewat[lewat.length - 1] ?? idBagian(BAGIAN[0].judul));
    };
    window.addEventListener('scroll', pantau, { passive: true });
    pantau();
    return () => window.removeEventListener('scroll', pantau);
  }, []);

  return (
    <BingkaiMobile>
      <TopBar title="Syarat & Ketentuan" onBack={() => (window.history.length > 1 ? router.back() : router.push('/'))} />
      <div className="lg:flex lg:items-start lg:gap-20 lg:px-konten lg:pt-14 lg:pb-20">
      <nav className="hidden w-[260px] shrink-0 flex-col gap-1 lg:sticky lg:top-24 lg:flex" aria-label="Di halaman ini">
        <p className="mb-2 t-label-s text-muted">Di halaman ini</p>
        {BAGIAN.map((b) => {
          const id = idBagian(b.judul);
          const pilih = aktif === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              aria-current={pilih ? 'true' : undefined}
              className={`px-3 py-2 font-body text-[14px] leading-5 ${pilih ? 'border-l-[3px] border-blue bg-blue-50 font-semibold text-blue-700' : 'text-ink-2 hover:text-ink'}`}
            >
              {b.judul}
            </a>
          );
        })}
      </nav>
      <main className="flex flex-col gap-5 px-6 pt-6 pb-10 lg:w-[760px] lg:min-w-0 lg:gap-7 lg:p-0">
        <div className="flex flex-col gap-2.5">
          <h1 className="font-[family-name:var(--font-display)] text-[16px] leading-6 text-ink lg:text-[24px] lg:leading-[34px]">Syarat &amp; Ketentuan</h1>
          <p className="t-body-m text-ink-2">
            Rincian kecil di balik angka, aturan, dan datamu, dikumpulkan di satu tempat supaya halaman lain tetap ringkas.
          </p>
          <p className="t-body-s text-muted">Diperbarui 15 Oktober 2026</p>
        </div>
        {BAGIAN.map((b) => (
          <Fragment key={b.judul}>
            <Pemisah />
            <section id={idBagian(b.judul)} className="flex scroll-mt-24 flex-col gap-3">
              <h2 className="flex items-center gap-2.5">
                <img src={b.ikon} alt="" width={18} height={18} />
                <span className="font-[family-name:var(--font-label)] text-[17px] font-semibold text-ink">{b.judul}</span>
              </h2>
              <ul className="flex flex-col gap-2.5">
                {b.poin.map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <span className="mt-[7px] size-1.5 shrink-0 bg-ink" />
                    <span className="flex-1 font-[family-name:var(--font-body)] text-[13px] leading-5 text-ink-2">{p}</span>
                  </li>
                ))}
              </ul>
            </section>
          </Fragment>
        ))}
      </main>
      </div>
      <Footer />
    </BingkaiMobile>
  );
}
