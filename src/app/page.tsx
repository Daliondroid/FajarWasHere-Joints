import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black flex flex-col justify-between">
      <div>
        <Navbar />
        <HeroSection />
      </div>

      {/* Footer matching Figma HIFI v2 (83:39) */}
      <footer className="w-full bg-[#15191E] text-white py-8 px-6 mt-12 border-t-[3px] border-black">
        <div className="w-full max-w-[402px] mx-auto flex flex-col items-start">
          <span className="font-['Press_Start_2P',monospace] text-sm font-bold text-white tracking-wider mb-2">
            Cocokin!
          </span>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Bantu siswa SMA memilih jurusan dan kampus dengan percaya diri. © 2026
          </p>
        </div>
      </footer>
    </main>
  );
}
