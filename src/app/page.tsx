import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import HeroSectionDesktop from '@/components/home/HeroSectionDesktop';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFBF7]">
      {/* ── MOBILE CONTAINER (<1024px) ── */}
      <div className="lg:hidden flex justify-center">
        <div className="w-full max-w-[402px] bg-white border-x-2 border-black flex flex-col min-h-screen">
          <Navbar />
          <HeroSection />
        </div>
      </div>

      {/* ── DESKTOP CONTAINER (≥1024px, Figma D01/D03) ── */}
      <div className="hidden lg:flex flex-col w-full min-h-screen bg-white">
        <Navbar />
        <HeroSectionDesktop />
      </div>
    </main>
  );
}
