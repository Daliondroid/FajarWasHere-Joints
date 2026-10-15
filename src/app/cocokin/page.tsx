import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Icon } from '@/components/ui/Icon';

export const metadata = {
  title: 'Rekomendasi Jurusan | Cocokin!',
  description: 'Rekomendasi jurusan terbaik berdasarkan preferensi minat, hobi, dan nilai akademik kamu.',
};

interface RecommendationItem {
  id: string;
  rank: string;
  prodi: string;
  campus: string;
  matchScore: number;
  slug: string;
}

const RECOMMENDATIONS: RecommendationItem[] = [
  {
    id: 'informatika-ugm',
    rank: '#1',
    prodi: 'Informatika',
    campus: 'Universitas Gadjah Mada · S1',
    matchScore: 92,
    slug: 'informatika',
  },
  {
    id: 'si-ui',
    rank: '#2',
    prodi: 'Sistem Informasi',
    campus: 'Universitas Indonesia · S1',
    matchScore: 85,
    slug: 'sistem-informasi',
  },
  {
    id: 'el-itb',
    rank: '#3',
    prodi: 'Teknik Elektro',
    campus: 'Institut Teknologi Bandung · S1',
    matchScore: 78,
    slug: 'teknik-elektro',
  },
];

export default function RekomendasiPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-['Outfit',sans-serif]">
      {/* 8-bit Navbar with color strip & menu */}
      <Navbar />

      <main className="w-full max-w-[402px] mx-auto px-4 pt-6 pb-16 flex flex-col">
        {/* 1. Tag Analisis Selesai */}
        <div className="mb-3">
          <span className="inline-block px-2.5 py-1 border-2 border-[#22A94F] bg-white font-['Press_Start_2P',monospace] text-[9px] text-[#22A94F] tracking-wider uppercase">
            ANALISIS SELESAI
          </span>
        </div>

        {/* 2. Headline & Subtitle */}
        <h1 className="font-['Press_Start_2P',monospace] text-[16px] sm:text-[18px] leading-[1.6] font-bold text-black">
          Rekomendasi jurusan untukmu
        </h1>
        <p className="text-xs text-[#4B5563] leading-relaxed mt-2 mb-6">
          Berdasarkan minat, gaya belajar, dan data akademik yang kamu kirim.
        </p>

        {/* 3. Ticket Cards (Figma Card/Major Ticket 108:608) */}
        <div className="flex flex-col gap-4">
          {RECOMMENDATIONS.map((item) => (
            <div
              key={item.id}
              className="relative bg-[#277EFD] border-[3px] border-black shadow-[4px_4px_0px_#000] flex overflow-hidden"
            >
              {/* Left Perforated Stub */}
              <div className="w-[78px] shrink-0 border-r-2 border-dashed border-black/40 flex flex-col items-center justify-center p-2 text-white">
                <span className="font-['Press_Start_2P',monospace] text-[8px] uppercase tracking-wider mb-1 opacity-90">
                  RANK
                </span>
                <span className="font-['Press_Start_2P',monospace] text-base sm:text-lg font-black">
                  {item.rank}
                </span>
              </div>

              {/* Right Ticket Body */}
              <div className="flex-1 p-3.5 flex flex-col justify-between">
                <div>
                  <h2 className="font-['Press_Start_2P',monospace] text-xs sm:text-[13px] font-bold text-white tracking-wide">
                    {item.prodi}
                  </h2>
                  <p className="text-[11px] text-blue-100 font-medium mt-1">
                    {item.campus}
                  </p>

                  {/* Match Progress Bar */}
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className="font-['Press_Start_2P',monospace] text-[9px] text-white">
                      Cocok
                    </span>
                    <div className="w-[120px] h-[14px] border-2 border-black bg-white overflow-hidden relative">
                      <div
                        className="h-full bg-[#FEBD01]"
                        style={{ width: `${item.matchScore}%` }}
                      />
                    </div>
                    <span className="font-['Press_Start_2P',monospace] text-[10px] text-white">
                      {item.matchScore}%
                    </span>
                  </div>
                </div>

                {/* Action Buttons: SIMULASI & DETAIL */}
                <div className="flex items-center gap-2 mt-4">
                  <Link
                    href={`/test-drive/${item.slug}`}
                    className="pixel-btn-red py-1.5 px-3 text-[10px] tracking-wider"
                  >
                    SIMULASI
                  </Link>
                  <button
                    type="button"
                    className="pixel-btn-white py-1.5 px-3 text-[10px] tracking-wider"
                  >
                    DETAIL
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4. Note Box ("Why") */}
        <div className="w-full my-6 p-3.5 border-2 border-[#277EFD] bg-[#EEF5FF] flex items-start gap-2.5">
          <Icon name="spark" className="w-5 h-5 text-[#277EFD] shrink-0 mt-0.5" />
          <p className="text-xs text-black leading-relaxed">
            Skor kecocokan dihitung dari minat (40%), gaya belajar (25%), dan peluang akademik (35%).
          </p>
        </div>

        {/* 5. Explore Card ("Penasaran jurusan lain?") */}
        <div className="w-full bg-[#FEF9E7] border-[3px] border-black shadow-[4px_4px_0px_#000] p-4 flex flex-col mb-8">
          <h3 className="font-['Press_Start_2P',monospace] text-xs sm:text-[13px] font-bold text-black mb-2 leading-snug">
            Penasaran jurusan lain?
          </h3>
          <p className="text-xs text-gray-700 leading-relaxed mb-4">
            Coba test drive 60 detik untuk merasakan studi kasus asli tiap jurusan.
          </p>
          <Link
            href="/katalog"
            className="w-full pixel-btn-red py-3 text-xs tracking-wider flex items-center justify-center gap-2"
          >
            <span>JELAJAHI SIMULASI</span>
            <Icon name="arrow-right" className="w-4 h-4 text-white" />
          </Link>
        </div>

        {/* 6. Illustration Section (Siswi Hijab + Chat AI) */}
        <div className="w-full flex flex-col items-center text-center mt-2">
          {/* Karakter Siswi Hijab dengan Bintang */}
          <div className="relative w-[220px] h-[300px] flex items-center justify-center mb-3">
            <Image
              src="/assets/student-girl-pixel.png"
              alt="Siswi Berhijab Ceria"
              width={220}
              height={300}
              className="w-full h-full object-contain"
            />
            {/* Pixel Stars matching Figma */}
            <span className="absolute top-8 left-4 text-base text-[#FEBD01] animate-pulse">★</span>
            <span className="absolute top-16 right-4 text-base text-[#FEBD01] animate-pulse">★</span>
            <span className="absolute top-2 left-24 text-xs text-[#FEBD01] animate-pulse">★</span>
            <span className="absolute bottom-24 left-2 text-xl text-[#FEBD01] animate-pulse">★</span>
            <span className="absolute bottom-12 right-2 text-xl text-[#FEBD01] animate-pulse">★</span>
            <span className="absolute bottom-36 right-8 text-xs text-[#FEBD01] animate-pulse">★</span>
            <span className="absolute bottom-16 left-12 text-xs text-[#FEBD01] animate-pulse">★</span>
          </div>

          <h3 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm font-bold text-black mb-2 leading-relaxed">
            Masih ragu? Tanya Cocokin AI
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed max-w-[320px] mb-5">
            Ceritakan jurusan & kampus incaranmu, kami bantu susun strategi masuknya.
          </p>

          <Link
            href="/chat"
            className="w-full max-w-[340px] pixel-btn-blue py-3.5 text-xs tracking-wider flex items-center justify-center gap-2"
          >
            <span>MULAI CHAT</span>
            <Icon name="arrow-right" className="w-4 h-4 text-white" />
          </Link>
        </div>
      </main>
    </div>
  );
}
