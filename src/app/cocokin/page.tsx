import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Rekomendasi Jurusan | Cocokin!',
  description: 'Rekomendasi jurusan terbaik berdasarkan preferensi minat, hobi, dan nilai akademik kamu.',
};

export default function RekomendasiPage() {
  const recommendations = [
    {
      id: 'informatika-1',
      rank: '#1',
      prodi: 'Informatika',
      matchScore: 80,
      slug: 'informatika',
    },
    {
      id: 'informatika-2',
      rank: '#1',
      prodi: 'Informatika',
      matchScore: 80,
      slug: 'informatika',
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-['Outfit',sans-serif]">
      {/* 8-bit Navbar with color strip & menu */}
      <Navbar />

      <main className="w-full max-w-[402px] mx-auto px-4 pt-6 pb-16 flex flex-col">
        {/* Title Section */}
        <h1 className="font-['Press_Start_2P',monospace] text-[20px] leading-tight font-black text-black">
          Rekomendasi<br />Jurusan
        </h1>
        <p className="font-['Outfit',sans-serif] text-[13px] text-black leading-snug mt-3">
          Berdasarkan pada preferesensi yang kamu kirim kami merekomendasikan jurusan berikut
        </p>

        {/* List of Recommended Cards */}
        <div className="flex flex-col gap-4 mt-5">
          {recommendations.map((item) => (
            <div
              key={item.id}
              className="bg-[#4285F4] border-[3px] border-black shadow-[4px_4px_0px_#000] flex overflow-hidden"
            >
              {/* Left Rank Column */}
              <div className="w-[74px] border-r-[2px] border-dashed border-black flex items-center justify-center p-2">
                <span className="font-['Press_Start_2P',monospace] text-[20px] font-bold text-white">
                  {item.rank}
                </span>
              </div>

              {/* Right Content Column */}
              <div className="flex-1 p-3.5 flex flex-col justify-between">
                <div>
                  <h2 className="font-['Press_Start_2P',monospace] text-[13px] font-bold text-white tracking-wide">
                    {item.prodi}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-['Outfit',sans-serif] text-[11px] text-white font-medium">
                      Kecocokan
                    </span>
                    <div className="w-[110px] h-[16px] border-[2px] border-black bg-white overflow-hidden relative">
                      <div
                        className="h-full bg-[#FBBC05]"
                        style={{ width: `${item.matchScore}%` }}
                      ></div>
                    </div>
                    <span className="font-['Outfit',sans-serif] text-[11px] text-white font-bold">
                      {item.matchScore}%
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <Link
                    href={`/test-drive/${item.slug}`}
                    className="inline-block bg-[#EA4335] hover:bg-[#D93025] text-white font-['Press_Start_2P',monospace] text-[9px] px-3 py-1.5 border-[2px] border-black shadow-[2px_2px_0px_#000] active:translate-y-0.5 transition-transform"
                  >
                    Simulation
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section 2: Simulasi Jurusan Lain */}
        <div className="mt-8">
          <h2 className="font-['Press_Start_2P',monospace] text-[14px] leading-snug font-black text-black">
            Mau tau simulasi jurusan lain?
          </h2>
          <p className="font-['Outfit',sans-serif] text-[13px] text-black leading-snug mt-2">
            Cek lebih lanjut dengan klik tombol test drive berikut
          </p>
          <div className="flex justify-center mt-4">
            <Link
              href="/katalog"
              className="bg-[#EA4335] hover:bg-[#D93025] text-white font-['Press_Start_2P',monospace] text-[11px] py-2.5 px-6 border-[3px] border-black shadow-[3px_3px_0px_#000] active:translate-y-0.5 transition-transform"
            >
              Simulation
            </Link>
          </div>
        </div>

        {/* Section 3: Incaran & Student Character */}
        <div className="mt-10">
          <h2 className="font-['Press_Start_2P',monospace] text-[14px] leading-snug font-black text-black">
            Beritahu kami jurusan apa yang<br />kamu ingin incar..
          </h2>

          {/* Student Illustration with Pixel Stars */}
          <div className="relative w-full max-w-[280px] mx-auto mt-6 flex justify-center items-center">
            {/* Pixel Stars positioned around character */}
            <div className="absolute top-2 left-6 text-[#FBBC05] text-lg select-none">✦</div>
            <div className="absolute top-10 left-12 text-[#FBBC05] text-2xl select-none">★</div>
            <div className="absolute top-18 left-4 text-[#FBBC05] text-sm select-none">✦</div>
            <div className="absolute top-0 right-14 text-[#FBBC05] text-sm select-none">✦</div>
            <div className="absolute top-8 right-16 text-[#FBBC05] text-2xl select-none">★</div>
            <div className="absolute top-16 right-6 text-[#FBBC05] text-xl select-none">✦</div>
            <div className="absolute top-36 left-4 text-[#FBBC05] text-sm select-none">★</div>
            <div className="absolute top-36 right-8 text-[#FBBC05] text-lg select-none">★</div>

            <Image
              src="/assets/student-girl-pixel.png"
              alt="Siswa Berhijab Cocokin"
              width={260}
              height={390}
              priority
              className="w-[230px] h-auto object-contain image-pixelated"
            />
          </div>

          {/* Mulai Chat Button */}
          <div className="flex justify-center mt-6">
            <Link
              href="/chat"
              className="w-full max-w-[280px] bg-[#4285F4] hover:bg-[#3367D6] text-white font-['Press_Start_2P',monospace] text-[12px] py-3.5 border-[3px] border-black shadow-[4px_4px_0px_#000] text-center active:translate-y-0.5 transition-transform"
            >
              MULAI CHAT
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
