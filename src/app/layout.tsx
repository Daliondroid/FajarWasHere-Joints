import type { Metadata } from 'next';
import { Press_Start_2P, Outfit, Pixelify_Sans, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/auth/AuthProvider';

const pressStart2P = Press_Start_2P({
  weight: '400',
  variable: '--font-pixel',
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

const pixelifySans = Pixelify_Sans({
  weight: ['400', '500', '600', '700'],
  variable: '--font-pixelify',
  subsets: ['latin'],
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cocokin! — Temukan Jurusan Kuliah Impianmu',
  description:
    'Platform uji kecocokan jurusan (RIASEC/O*NET), estimasi peluang SNBP & SNBT resmi SNPMB, dan Test Drive 60 detik per prodi.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        suppressHydrationWarning
        className={`${pressStart2P.variable} ${pixelifySans.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} ${outfit.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
