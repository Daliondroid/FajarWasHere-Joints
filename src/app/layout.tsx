import type { Metadata } from 'next';
import { Pixelify_Sans, Plus_Jakarta_Sans, Press_Start_2P } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/auth/AuthProvider';

const pressStart2P = Press_Start_2P({
  weight: '400',
  variable: '--ff-press',
  subsets: ['latin'],
  display: 'swap',
});

const pixelify = Pixelify_Sans({
  weight: ['500', '600'],
  variable: '--ff-pixelify',
  subsets: ['latin'],
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  weight: ['400', '600', '700'],
  variable: '--ff-jakarta',
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
    <html lang="id" className={`${pressStart2P.variable} ${pixelify.variable} ${jakarta.variable}`}>
      <body
        suppressHydrationWarning
        className="antialiased"
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
