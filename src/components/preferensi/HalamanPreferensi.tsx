'use client';

import { useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { PreferensiRingkas, ResponsHapusPreferensi, ResponsPreferensi } from '@/types';
import { TopBar } from '@/components/ui/TopBar';
import Footer from '@/components/Footer';
import BingkaiMobile from '@/components/ui/BingkaiMobile';
import { RetroWindow } from '@/components/ui/RetroWindow';
import { Isian } from '@/components/ui/Isian';
import Tombol from '@/components/ui/Tombol';
import KartuPreferensi from '@/components/preferensi/KartuPreferensi';
import LembarPreferensiBaru from '@/components/preferensi/LembarPreferensiBaru';
import { panggilApi, pesanGalat } from '@/lib/klien/api';
import { drafBaru, drafDariPreferensi, simpanDraf } from '@/lib/klien/draf_preferensi';
import { useDaftarPreferensi } from '@/lib/klien/preferensi';

/** Kotak "Tambah preferensi" (Figma `168:161`). */
function TambahPreferensi({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col items-center justify-center gap-2.5 border-2 border-dashed border-ink px-4 py-7 cursor-pointer"
    >
      <span className="flex size-12 items-center justify-center border-2 border-ink bg-paper shadow-pixel-sm">
        <img src="/figma/icon-plus.svg" alt="" width={20} height={20} />
      </span>
      <span className="t-label-m text-ink">Tambah preferensi</span>
      <span className="t-body-s text-center text-muted">Buat skenario baru untuk SNBP atau SNBT</span>
    </button>
  );
}

function Dialog({ judul, warna, children, onTutup }: { judul: string; warna: 'blue' | 'red'; children: ReactNode; onTutup: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={judul}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/55 px-6"
      onClick={onTutup}
    >
      <div className="w-full max-w-[354px]" onClick={(e) => e.stopPropagation()}>
        <RetroWindow title={judul} variant={warna} contentClassName="flex flex-col gap-4 p-5">
          {children}
        </RetroWindow>
      </div>
    </div>
  );
}

/**
 * Halaman Preferensi: M05 kosong (`173:476`), M06 tersimpan (`173:518`), M07 bottom sheet baru (`173:642`).
 * Desktop: D04 grid 3 kolom (`186:2285`), D04b modal baru (`272:4935`).
 */
export default function HalamanPreferensi({ bukaBaru = false }: { bukaBaru?: boolean }) {
  const router = useRouter();
  const { daftar, galat, aktifkan, muatUlang } = useDaftarPreferensi(true);
  const [lembar, setLembar] = useState(bukaBaru);
  const [gantiNama, setGantiNama] = useState<PreferensiRingkas | null>(null);
  const [namaBaru, setNamaBaru] = useState('');
  const [hapus, setHapus] = useState<PreferensiRingkas | null>(null);
  const [sibuk, setSibuk] = useState(false);
  const [galatAksi, setGalatAksi] = useState<string | null>(null);

  const jalankan = async (aksi: () => Promise<unknown>, selesai: () => void) => {
    setSibuk(true);
    setGalatAksi(null);
    try {
      await aksi();
      selesai();
      await muatUlang();
    } catch (e) {
      setGalatAksi(pesanGalat(e));
    } finally {
      setSibuk(false);
    }
  };

  const ubah = (p: PreferensiRingkas) =>
    jalankan(
      async () => {
        const { data } = await panggilApi<ResponsPreferensi>(`/api/preferensi/${p.id}`);
        if (data) simpanDraf(drafDariPreferensi(data));
      },
      () => router.push('/preferensi/riasec'),
    );

  const jumlah = daftar?.length ?? 0;

  return (
    <BingkaiMobile>
      <TopBar title="Preferensi" onBack={() => router.push('/')} />
      <main className="flex flex-col gap-4 px-6 pt-6 pb-8 lg:flex-1 lg:gap-8 lg:px-konten lg:pt-14 lg:pb-20">
        <div className={`flex items-end gap-8 ${daftar ? '' : 'invisible'}`}>
          <div className="flex min-w-0 flex-1 flex-col gap-2 lg:gap-2.5">
            <p className="t-label-s text-blue">PREFERENSI</p>
            <h1 className="t-display-m text-ink lg:text-[28px] lg:leading-[41px]">
              {jumlah ? `Preferensimu (${jumlah})` : 'Simpan beberapa rencana sekaligus'}
            </h1>
            <p className="t-body-m text-muted lg:hidden">
              {jumlah
                ? 'Ketuk JADIKAN AKTIF untuk berganti. Rekomendasi, chat, dan Simulasi langsung mengikuti.'
                : 'Buat preferensi terpisah untuk SNBP dan SNBT. Rekomendasi, chat, dan Simulasi selalu mengikuti preferensi yang aktif.'}
            </p>
            <p className="hidden text-[17px] leading-[25px] font-body text-muted lg:block">
              Simpan rencana SNBP dan SNBT terpisah, lalu pilih mana yang aktif. Rekomendasi, chat, dan Simulasi selalu mengikuti preferensi
              aktif.
            </p>
          </div>
          {/* Header kanan desktop (Figma D04 `186:2326`): legenda + tombol preferensi baru */}
          <div className="hidden shrink-0 flex-col items-end gap-3 lg:flex">
            <div className="flex gap-4">
              <span className="flex items-center gap-2">
                <span className="size-3.5 border-[1.5px] border-ink bg-yellow" />
                <span className="t-body-s font-bold text-ink-2">SNBP · jalur prestasi</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="size-3.5 border-[1.5px] border-ink bg-blue" />
                <span className="t-body-s font-bold text-ink-2">SNBT · jalur tes</span>
              </span>
            </div>
            <Tombol onClick={() => setLembar(true)}>+ Preferensi baru</Tombol>
          </div>
        </div>

        {daftar && !jumlah && (
          <div className="flex gap-4 py-2 lg:hidden">
            <span className="flex items-center gap-2">
              <span className="size-3.5 border-[1.5px] border-ink bg-yellow" />
              <span className="t-body-s font-bold text-ink-2">SNBP · jalur prestasi</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="size-3.5 border-[1.5px] border-ink bg-blue" />
              <span className="t-body-s font-bold text-ink-2">SNBT · jalur tes</span>
            </span>
          </div>
        )}

        {galat && <p className="t-body-s font-bold text-red">{galat}</p>}
        {!daftar && !galat && <p className="t-body-s text-muted">Memuat preferensi…</p>}

        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:items-start lg:gap-6">
        {daftar?.map((p) => (
          <KartuPreferensi
            key={p.id}
            p={p}
            onAktifkan={() => aktifkan(p.id)}
            onUbah={() => ubah(p)}
            onGantiNama={() => {
              setNamaBaru(p.nama);
              setGalatAksi(null);
              setGantiNama(p);
            }}
            onHapus={() => {
              setGalatAksi(null);
              setHapus(p);
            }}
          />
        ))}
        {galatAksi && !gantiNama && !hapus && (
          <p className="t-body-s font-bold text-red lg:order-last lg:col-span-3">{galatAksi}</p>
        )}

        {daftar && <TambahPreferensi onClick={() => setLembar(true)} />}
        </div>
        {daftar && !jumlah && (
          <p className="t-body-s text-center text-muted lg:text-left">Belum ada preferensi. Mulai dari jurusan yang paling kamu incar dulu.</p>
        )}
      </main>
      <div className="hidden lg:block">
        <Footer />
      </div>

      {lembar && daftar && (
        <LembarPreferensiBaru
          namaTerpakai={daftar.map((p) => p.nama)}
          onBatal={() => {
            setLembar(false);
            if (bukaBaru) router.replace('/preferensi');
          }}
          onBuat={(i) => {
            simpanDraf(drafBaru(i.nama, i.jalur, i.tahun_lulus, i.pernah_lulus_snbp));
            router.push('/preferensi/riasec');
          }}
        />
      )}

      {gantiNama && (
        <Dialog judul="Ganti nama" warna="blue" onTutup={() => !sibuk && setGantiNama(null)}>
          <Isian label="Nama preferensi" value={namaBaru} maxLength={40} onChange={(e) => setNamaBaru(e.target.value)} autoFocus />
          {galatAksi && <p className="t-body-s font-bold text-red">{galatAksi}</p>}
          <div className="flex gap-3">
            <Tombol jenis="secondary" ukuran="M" penuh onClick={() => setGantiNama(null)} disabled={sibuk}>
              Batal
            </Tombol>
            <Tombol
              ukuran="M"
              penuh
              disabled={sibuk || !namaBaru.trim()}
              onClick={() =>
                jalankan(
                  () => panggilApi(`/api/preferensi/${gantiNama.id}`, { method: 'PATCH', body: { nama: namaBaru.trim() } }),
                  () => setGantiNama(null),
                )
              }
            >
              Simpan
            </Tombol>
          </div>
        </Dialog>
      )}

      {hapus && (
        <Dialog judul="Hapus preferensi" warna="red" onTutup={() => !sibuk && setHapus(null)}>
          <p className="t-body-m text-ink-2">
            Hapus <b>{hapus.nama}</b>? Jawaban kuis dan data jalurnya ikut terhapus.
            {hapus.aktif && ' Preferensi lain yang terakhir diperbarui akan menjadi aktif.'}
          </p>
          {galatAksi && <p className="t-body-s font-bold text-red">{galatAksi}</p>}
          <div className="flex gap-3">
            <Tombol jenis="secondary" ukuran="M" penuh onClick={() => setHapus(null)} disabled={sibuk}>
              Batal
            </Tombol>
            <Tombol
              jenis="danger"
              ukuran="M"
              penuh
              disabled={sibuk}
              onClick={() =>
                jalankan(
                  () => panggilApi<ResponsHapusPreferensi>(`/api/preferensi/${hapus.id}`, { method: 'DELETE' }),
                  () => setHapus(null),
                )
              }
            >
              Hapus
            </Tombol>
          </div>
        </Dialog>
      )}
    </BingkaiMobile>
  );
}
