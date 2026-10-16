'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { JenjangProdi, LabelKeketatan, ProdiRingkas, ResponsDaftarProdi, RumpunIlmu } from '@/types';
import { TopBar } from '@/components/ui/TopBar';
import BingkaiMobile from '@/components/ui/BingkaiMobile';
import PemilihPreferensi from '@/components/ui/PemilihPreferensi';
import Tag, { type WarnaTag } from '@/components/ui/Tag';
import Tombol from '@/components/ui/Tombol';
import { panggilApi, pesanGalat } from '@/lib/klien/api';
import { useDaftarPreferensi } from '@/lib/klien/preferensi';

const PER_HALAMAN = 20;
const KETAT: Record<LabelKeketatan, { warna: WarnaTag; teks: string }> = {
  sangat_ketat: { warna: 'red', teks: 'SANGAT KETAT' },
  ketat: { warna: 'yellow', teks: 'KETAT' },
  sedang: { warna: 'blue', teks: 'SEDANG' },
  longgar: { warna: 'green', teks: 'LONGGAR' },
};
const ribuan = (n: number | null | undefined) => (n == null ? '…' : n.toLocaleString('id-ID'));
const persen = (r: number) => `${(r * 100).toFixed(1).replace('.', ',')}%`;
const kapital = (s: string) => s.toLowerCase().replace(/\b\w/g, (h) => h.toUpperCase());

/** Kartu Prodi (Figma `169:260`): nama, PTN · provinsi, badge jenjang/rumpun/keketatan, tombol Simulasi. */
function KartuProdi({ p, onSimulasi }: { p: ProdiRingkas; onSimulasi: () => void }) {
  const k = p.keketatan_snbp ?? p.keketatan_snbt;
  return (
    <article className="flex flex-col gap-2.5 border-2 border-ink bg-paper p-3.5 shadow-pixel-sm">
      <div className="flex flex-col gap-0.5">
        <h3 className="t-label-m text-ink">{kapital(p.nama_prodi)}</h3>
        <p className="t-body-s text-muted">
          {kapital(p.nama_ptn)} · {kapital(p.provinsi_ptn)}
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Tag warna="ink">{p.jenjang}</Tag>
        <Tag warna="blue">{p.kelompok.toUpperCase()}</Tag>
        {k && <Tag warna={KETAT[k.label].warna}>{KETAT[k.label].teks}</Tag>}
        {p.portofolio && <Tag warna="yellow">PORTOFOLIO</Tag>}
      </div>
      <div className="flex items-center gap-2">
        <p className="min-w-0 flex-1 t-body-s text-ink-2">
          {p.keketatan_snbp
            ? `Diterima SNBP ${p.keketatan_snbp.tahun}: ${persen(p.keketatan_snbp.rasio)}`
            : p.keketatan_snbt
              ? `Rasio SNBT ${p.keketatan_snbt.tahun}: ${persen(p.keketatan_snbt.rasio)}`
              : 'Data keketatan belum ada'}
        </p>
        <Tombol ukuran="M" ikon onClick={onSimulasi}>
          Simulasi
        </Tombol>
      </div>
    </article>
  );
}

/** M17 · Katalog Simulasi (Figma `180:1706`, Hal. 12): cari + filter rumpun/jenjang lewat GET /api/prodi. */
export default function KatalogPage() {
  const router = useRouter();
  const { status } = useSession();
  const { daftar, aktifkan } = useDaftarPreferensi(status === 'authenticated');
  const [q, setQ] = useState('');
  const [kelompok, setKelompok] = useState<RumpunIlmu | ''>('');
  const [jenjang, setJenjang] = useState<JenjangProdi | ''>('');
  const [hasil, setHasil] = useState<ProdiRingkas[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [halaman, setHalaman] = useState(1);
  const [memuat, setMemuat] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);
  const [hitung, setHitung] = useState<Record<string, number>>({});

  // Jumlah prodi per rumpun & jenjang (total dari /api/prodi, 1 baris per permintaan).
  useEffect(() => {
    const kunci: [string, string][] = [
      ['semua', ''],
      ['saintek', 'kelompok=saintek'],
      ['soshum', 'kelompok=soshum'],
      ['S1', 'jenjang=S1'],
      ['D4', 'jenjang=D4'],
      ['D3', 'jenjang=D3'],
    ];
    Promise.all(
      kunci.map(([k, qs]) => panggilApi<ResponsDaftarProdi>(`/api/prodi?per_halaman=1&${qs}`).then((r) => [k, r.total] as const)),
    )
      .then((p) => setHitung(Object.fromEntries(p)))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const t = setTimeout(async () => {
      setMemuat(true);
      try {
        const sp = new URLSearchParams({ halaman: String(halaman), per_halaman: String(PER_HALAMAN) });
        if (q.trim()) sp.set('q', q.trim());
        if (kelompok) sp.set('kelompok', kelompok);
        if (jenjang) sp.set('jenjang', jenjang);
        const r = await panggilApi<ResponsDaftarProdi>(`/api/prodi?${sp}`);
        setHasil((h) => (halaman === 1 ? r.data : [...h, ...r.data]));
        setTotal(r.total);
        setGalat(null);
      } catch (e) {
        setGalat(pesanGalat(e));
      } finally {
        setMemuat(false);
      }
    }, q ? 350 : 0);
    return () => clearTimeout(t);
  }, [q, kelompok, jenjang, halaman]);

  const saring = (ubah: () => void) => {
    setHalaman(1);
    ubah();
  };

  const RUMPUN: { id: RumpunIlmu | ''; label: string; n?: number }[] = [
    { id: '', label: 'SEMUA', n: hitung.semua },
    { id: 'saintek', label: 'SAINTEK', n: hitung.saintek },
    { id: 'soshum', label: 'SOSHUM', n: hitung.soshum },
  ];
  const JENJANG: (JenjangProdi | '')[] = ['', 'S1', 'D4', 'D3'];

  return (
    <BingkaiMobile>
      <TopBar title="Simulasi" onBack={() => router.back()} />
      {daftar && daftar.length > 0 && (
        <div className="border-b-[1.5px] border-line bg-canvas px-6 py-2.5">
          <PemilihPreferensi daftar={daftar} onPilih={aktifkan} className="w-full" />
        </div>
      )}
      <main className="flex flex-col gap-4 px-6 pt-5 pb-8">
        <div className="flex flex-col gap-1.5">
          <p className="t-label-s text-blue">SIMULASI JURUSAN</p>
          <h1 className="t-display-m text-ink">{ribuan(hitung.semua)} prodi dari 146 PTN</h1>
        </div>
        <label className="flex h-[52px] items-center gap-2.5 border-2 border-ink bg-paper px-3.5 shadow-pixel-sm">
          <img src="/figma/icon-search-18.svg" alt="" width={18} height={18} />
          <input
            value={q}
            onChange={(e) => saring(() => setQ(e.target.value))}
            placeholder='Cari prodi/kampus · coba "TI", "DKV", "POLBAN"'
            aria-label="Cari prodi atau kampus"
            className="min-w-0 flex-1 bg-transparent t-body-s text-ink outline-none placeholder:text-muted"
          />
        </label>
        <div className="flex border-2 border-ink bg-paper" role="tablist" aria-label="Rumpun ilmu">
          {RUMPUN.map((r) => {
            const pilih = kelompok === r.id;
            return (
              <button
                key={r.label}
                type="button"
                role="tab"
                aria-selected={pilih}
                onClick={() => saring(() => setKelompok(r.id))}
                className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 py-2 cursor-pointer ${pilih ? 'bg-blue text-paper' : 'text-ink'}`}
              >
                <span className="t-button">{r.label}</span>
                <span className={`t-body-s ${pilih ? 'text-paper' : 'text-muted'}`}>{ribuan(r.n)}</span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          {JENJANG.map((j) => {
            const pilih = jenjang === j;
            return (
              <button
                key={j || 'semua'}
                type="button"
                aria-pressed={pilih}
                onClick={() => saring(() => setJenjang(j))}
                className={`border-[1.5px] px-2.5 py-2 t-label-s cursor-pointer ${pilih ? 'border-ink bg-ink text-paper' : 'border-blue bg-blue-50 text-blue-700'}`}
              >
                {j ? `${j} · ${ribuan(hitung[j])}` : 'SEMUA'}
              </button>
            );
          })}
        </div>
        <p className="t-label-s text-ink">{total === null ? 'MEMUAT…' : `${ribuan(total)} PRODI`}</p>
        {galat && <p className="t-body-s font-bold text-red">{galat}</p>}
        {hasil.map((p) => (
          <KartuProdi key={p.id_prodi} p={p} onSimulasi={() => router.push(`/test-drive/${p.id_prodi}`)} />
        ))}
        {total !== null && hasil.length === 0 && !memuat && <p className="t-body-m text-muted">Tidak ada prodi yang cocok dengan pencarianmu.</p>}
        {total !== null && hasil.length < total && (
          <Tombol jenis="secondary" penuh disabled={memuat} onClick={() => setHalaman((h) => h + 1)}>
            {memuat ? 'Memuat…' : 'Muat lagi'}
          </Tombol>
        )}
      </main>
    </BingkaiMobile>
  );
}
