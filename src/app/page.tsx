export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 text-[#1A1A1A]">
      <div className="w-full max-w-2xl bg-white pixel-box p-6 md:p-10 text-center space-y-6">
        {/* Header / Brand */}
        <div className="space-y-3">
          <div className="inline-block bg-[#FBBC05] pixel-badge text-black mb-2">
            JOINTS UGM 2026
          </div>
          <h1 className="font-[family-name:var(--font-pixel)] text-2xl sm:text-3xl md:text-4xl text-[#4285F4] tracking-tight">
            COCOKIN!
          </h1>
          <p className="text-base sm:text-lg font-medium text-[#5F6368]">
            Jangan sampai salah jurusan. Uji dulu, baru pilih!
          </p>
        </div>

        {/* Feature Badges Showcase */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <span className="pixel-badge bg-[#4285F4] text-white">SAINTEK</span>
          <span className="pixel-badge bg-[#34A853] text-white">SOSHUM</span>
          <span className="pixel-badge bg-[#FBBC05] text-[#1A1A1A]">RIASEC / O*NET</span>
          <span className="pixel-badge bg-[#EA4335] text-white">SNBP & SNBT</span>
        </div>

        {/* Info Box */}
        <div className="bg-[#F8F9FA] pixel-box-sm p-4 text-left text-sm space-y-2">
          <p className="font-bold text-[#1A1A1A] flex items-center gap-2">
            <span>🎮</span> Mode Demo Scaffolding
          </p>
          <p className="text-[#5F6368]">
            Proyek Next.js 15 App Router, TypeScript, Tailwind CSS, dan Vitest telah siap.
            Desain mengusung tema 8-Bit Retro RPG dengan token visual resmi Cocokin!.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <button
            type="button"
            className="pixel-btn bg-[#34A853] text-white px-6 py-3 text-sm sm:text-base font-bold"
          >
            MULAI SEKARANG
          </button>
          <button
            type="button"
            className="pixel-btn bg-[#4285F4] text-white px-6 py-3 text-sm sm:text-base font-bold"
          >
            TEST DRIVE PRODI
          </button>
        </div>
      </div>

      <footer className="mt-8 text-xs text-[#5F6368] font-[family-name:var(--font-pixel)] text-center">
        Cocokin! &copy; 2026 — Dibuat untuk Siswa SMA/SMK/MA Indonesia
      </footer>
    </main>
  );
}
