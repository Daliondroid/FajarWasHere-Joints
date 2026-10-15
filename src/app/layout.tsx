import type { Metadata } from 'next';
import { Press_Start_2P, Outfit } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/auth/AuthProvider';

const pressStart2P = Press_Start_2P({
  weight: '400',
  variable: '--font-pixel',
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-body',
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
        className={`${pressStart2P.variable} ${outfit.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
