import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] flex justify-center">
      <div className="w-full max-w-[402px] bg-white border-x-2 border-black flex flex-col min-h-screen">
        <Navbar />
        <HeroSection />
      </div>
    </main>
  );
}
