import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import BingkaiMobile from '@/components/ui/BingkaiMobile';

export default function Home() {
  return (
    <BingkaiMobile>
      <Navbar />
      <main className="flex flex-col">
        <HeroSection />
      </main>
      <Footer />
    </BingkaiMobile>
  );
}
