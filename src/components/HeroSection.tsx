import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center text-center w-full max-w-[402px] mx-auto pt-8 pb-12 px-4">
      {/* Headline Title persis Figma: Baris 1 teks, Baris 2 [cocok] & tembus kampus, Baris 3 [impian] */}
      <div className="flex flex-col items-center mb-3">
        {/* Baris 1: Temukan jurusan yang */}
        <h1 className="font-['Press_Start_2P',monospace] text-sm sm:text-base font-bold text-black mb-3 tracking-tight">
          Temukan jurusan yang
        </h1>

        {/* Baris 2: [cocok] & tembus kampus */}
        <div className="flex items-center justify-center gap-4 mb-3">
          <span className="inline-block bg-[#277EFD] text-white px-2.5 py-1 border-[3px] border-black shadow-[3px_3px_0px_#000000] font-['Press_Start_2P',monospace] text-xs sm:text-sm">
            cocok
          </span>
          <span className="font-['Press_Start_2P',monospace] text-xs sm:text-sm font-bold text-black whitespace-nowrap pl-1">
            & tembus kampus
          </span>
        </div>

        {/* Baris 3: [impian] */}
        <div>
          <span className="inline-block bg-[#277EFD] text-white px-3 py-1 border-[3px] border-black shadow-[3px_3px_0px_#000000] font-['Press_Start_2P',monospace] text-xs sm:text-sm">
            impian
          </span>
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-[11.5px] leading-relaxed text-[#151D21] max-w-[340px] mt-4 mb-4 font-normal">
        Cocokkan minatmu dengan 5.000+ prodi se-Indonesia, rasakan studi kasusnya, dan ketahui peluang masuk PTN-mu.
      </p>

      {/* Hero Campus Illustration Frame (Cropped tightly without white space on top) */}
      <div className="w-full relative overflow-hidden flex flex-col items-center">
        <div className="w-full max-w-[390px] h-[340px] relative overflow-hidden flex items-end justify-center">
          <Image
            src="/assets/hero-campus.png"
            alt="Kampus Pixel di Bawah Langit Putih"
            width={402}
            height={805}
            priority
            className="w-full object-cover object-bottom"
          />
        </div>

        {/* Scroll indicator with Chevron Down icon */}
        <div className="flex flex-col items-center justify-center pt-2 pb-6">
          <svg
            className="w-5 h-5 text-black mb-1 animate-bounce"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          <p className="text-[11px] font-medium text-black">
            Scroll kebawah untuk info lebih lanjut
          </p>
        </div>
      </div>

      {/* Section Preferensi & Karakter Siswa */}
      <div className="w-full mt-4 flex flex-col items-center">
        <h2 className="font-['Press_Start_2P',monospace] text-base sm:text-[17px] font-black text-black leading-relaxed mb-4">
          Isi <span className="text-[#22A94F]">preferensi</span> dulu<br />yuu. .
        </h2>

        {/* Karakter Siswa Pixel Ceria Memegang Ponsel */}
        <div className="relative w-[280px] h-[400px] flex items-center justify-center my-2">
          <Image
            src="/assets/student-character.png"
            alt="Siswa Pixel Ceria Memegang Ponsel"
            width={309}
            height={463}
            priority
            className="w-full h-full object-contain"
          />
          {/* Bintang kecil sparkle kuning */}
          <span className="absolute right-4 top-1/2 text-base text-[#FEBD01] animate-pulse">
            ★
          </span>
        </div>

        {/* Tombol MULAI Pixel Biru persis Figma */}
        <div className="w-full flex justify-center mt-4">
          <Link
            href="/preferensi"
            className="w-[224px] h-[44px] pixel-btn-blue flex items-center justify-center"
          >
            MULAI
          </Link>
        </div>
      </div>
    </section>
  );
}
