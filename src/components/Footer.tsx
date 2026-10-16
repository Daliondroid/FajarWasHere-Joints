'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import Logo from '@/components/ui/Logo';
import Tombol from '@/components/ui/Tombol';
import { RetroWindow } from '@/components/ui/RetroWindow';

const JELAJAHI = [
  { label: 'Beranda', href: '/' },
  { label: 'Cocokin', href: '/cocokin' },
  { label: 'Preferensi', href: '/preferensi' },
  { label: 'Simulasi Jurusan', href: '/katalog' },
];

const SUMBER_DATA = [
  'snpmb.id (daya tampung, peminat, kuota sekolah)',
  'PDDikti (akreditasi & kompetensi prodi)',
  'O*NET Interest Profiler · CC BY 4.0',
  'Kepmendikdasmen 102/M/2025',
];

/** Footer mobile (Figma `169:336`, PRD F-08, F-16 hapus akun, BR-13 sumber data). */
export default function Footer() {
  const { status } = useSession();
  const [konfirmasi, setKonfirmasi] = useState(false);
  const [menghapus, setMenghapus] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);

  const hapusAkun = async () => {
    setMenghapus(true);
    setGalat(null);
    try {
      const res = await fetch('/api/akun', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ konfirmasi: 'HAPUS' }),
      });
      if (!res.ok) {
        const isi = await res.json().catch(() => null);
        throw new Error(isi?.error?.pesan ?? 'Akun gagal dihapus. Coba lagi.');
      }
      await signOut({ callbackUrl: '/' });
    } catch (e) {
      setGalat(e instanceof Error ? e.message : 'Akun gagal dihapus. Coba lagi.');
      setMenghapus(false);
    }
  };

  return (
    <footer className="flex w-full flex-col gap-6 bg-ink px-6 pt-8 pb-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <Logo />
            <span className="t-label-l text-paper">Cocokin!</span>
          </div>
          <p className="t-body-s text-line">Cari yang cocok, uji rasanya, tembus kampus impianmu.</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="t-label-s text-yellow">JELAJAHI</p>
          {JELAJAHI.map((j) => (
            <Link key={j.href} href={j.href} className="t-body-s text-paper hover:underline">
              {j.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <p className="t-label-s text-yellow">SUMBER DATA</p>
          {SUMBER_DATA.map((s) => (
            <p key={s} className="t-body-s text-paper">
              {s}
            </p>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2.5 border-[1.5px] border-dashed border-yellow p-3">
        <img src="/figma/icon-info.svg" alt="" width={16} height={16} className="shrink-0" />
        <p className="flex-1 t-body-s text-paper">
          Semua angka peluang adalah estimasi berbasis data resmi, bukan jaminan kelulusan.
        </p>
      </div>

      <div className="flex flex-col items-start gap-2">
        <p className="t-body-s text-line">© 2026 Cocokin! · Hackathon JOINTS UGM 2026</p>
        <Link href="/syarat-ketentuan" className="t-body-s font-bold text-paper underline">
          Syarat &amp; ketentuan
        </Link>
        {status === 'authenticated' && (
          <button type="button" onClick={() => setKonfirmasi(true)} className="flex items-center gap-1.5 cursor-pointer">
            <img src="/figma/icon-trash.svg" alt="" width={12} height={12} />
            <span className="t-body-s font-bold text-red">Hapus akun &amp; data</span>
          </button>
        )}
      </div>

      {konfirmasi && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Hapus akun dan data"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/55 px-6"
          onClick={() => !menghapus && setKonfirmasi(false)}
        >
          <div className="w-full max-w-[354px]" onClick={(e) => e.stopPropagation()}>
            <RetroWindow title="Hapus akun & data" variant="red" contentClassName="flex flex-col gap-4 p-5">
              <p className="t-display-s text-ink">Yakin hapus akunmu?</p>
              <p className="t-body-m text-ink-2">
                Akun, semua preferensi, profil, dan riwayat chat dihapus permanen. Tindakan ini tidak bisa dibatalkan.
              </p>
              {galat && <p className="t-body-s font-bold text-red">{galat}</p>}
              <div className="flex gap-3">
                <Tombol jenis="secondary" ukuran="M" penuh onClick={() => setKonfirmasi(false)} disabled={menghapus}>
                  Batal
                </Tombol>
                <Tombol jenis="danger" ukuran="M" penuh onClick={hapusAkun} disabled={menghapus}>
                  {menghapus ? 'Menghapus…' : 'Hapus'}
                </Tombol>
              </div>
            </RetroWindow>
          </div>
        </div>
      )}
    </footer>
  );
}
