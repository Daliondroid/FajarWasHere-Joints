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
import Footer from '@/components/Footer';
import { Opsi } from '@/components/preferensi/BagianWizard';
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

/** 9 klaster keilmuan (tabel `klaster`, PRD v2.1 bagian 5); filter desktop D09 lewat `klaster_id`. */
const KLASTER = [
  { id: 1, nama: 'Rekayasa & Teknik' },
  { id: 2, nama: 'Sosial, Humaniora & Hukum' },
  { id: 3, nama: 'Sains & MIPA' },
  { id: 4, nama: 'Ekonomi, Bisnis & Manajemen' },
  { id: 5, nama: 'Pertanian, Peternakan & Kelautan' },
  { id: 6, nama: 'Kesehatan & Medis' },
  { id: 7, nama: 'Teknologi & Komputer' },
  { id: 8, nama: 'Pendidikan & Keguruan' },
  { id: 9, nama: 'Seni & Desain' },
];

/** Kartu Prodi (Figma `169:260`): nama, PTN · provinsi, badge jenjang/rumpun/keketatan, tombol Simulasi. */
function KartuProdi({ p, onSimulasi }: { p: ProdiRingkas; onSimulasi: () => void }) {
  const k = p.keketatan_snbp ?? p.keketatan_snbt;
  return (
    <article className="flex min-w-0 flex-col gap-2.5 border-2 border-ink bg-paper p-3.5 shadow-pixel-sm">
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

/** M17 · Katalog Simulasi (Figma `180:1706`, Hal. 12); desktop D09 (`189:2937`) dengan panel filter. Data GET /api/prodi. */
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
  const [klaster, setKlaster] = useState<number | null>(null);
  const [portofolio, setPortofolio] = useState(false);

  // Jumlah prodi per rumpun & jenjang (total dari /api/prodi, 1 baris per permintaan).
  useEffect(() => {
    const kunci: [string, string][] = [
      ['semua', ''],
      ['saintek', 'kelompok=saintek'],
      ['soshum', 'kelompok=soshum'],
      ['S1', 'jenjang=S1'],
      ['D4', 'jenjang=D4'],
      ['D3', 'jenjang=D3'],
      ...KLASTER.map((k): [string, string] => [`k${k.id}`, `klaster_id=${k.id}`]),
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
        if (klaster) sp.set('klaster_id', String(klaster));
        if (portofolio) sp.set('portofolio', 'true');
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
  }, [q, kelompok, jenjang, klaster, portofolio, halaman]);

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
  const reset = () =>
    saring(() => {
      setKelompok('');
      setJenjang('');
      setKlaster(null);
      setPortofolio(false);
    });
  const ringkasFilter = [
    kelompok && kelompok.toUpperCase(),
    klaster && KLASTER.find((k) => k.id === klaster)?.nama,
    jenjang,
    portofolio && 'Wajib portofolio',
  ].filter(Boolean);

  return (
    <BingkaiMobile>
      <TopBar title="Simulasi" onBack={() => router.back()} />
      {daftar && daftar.length > 0 && (
        <div className="border-b-[1.5px] border-line bg-canvas px-6 py-2.5 lg:hidden">
          <PemilihPreferensi daftar={daftar} onPilih={aktifkan} className="w-full" />
        </div>
      )}
      <div className="flex flex-1 flex-col lg:flex-row lg:items-start lg:gap-10 lg:px-konten lg:pt-12 lg:pb-16">
      {/* Panel filter desktop (Figma D09 `189:2972`) */}
      <aside className="hidden w-[300px] shrink-0 flex-col gap-5 border-[1.5px] border-ink bg-canvas p-5 lg:flex" aria-label="Filter prodi">
        <div className="flex items-center gap-2">
          <img src="/figma/icon-filter.svg" alt="" width={16} height={16} />
          <p className="t-label-m text-ink">FILTER</p>
          <span className="flex-1" />
          <button type="button" onClick={reset} className="t-body-s font-bold text-blue cursor-pointer">
            Reset
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <p className="t-label-s text-muted">RUMPUN</p>
          <div className="flex border-[1.5px] border-ink bg-paper" role="tablist" aria-label="Rumpun ilmu">
            {RUMPUN.slice(1).map((r) => {
              const pilih = kelompok === r.id;
              return (
                <button
                  key={r.label}
                  type="button"
                  role="tab"
                  aria-selected={pilih}
                  onClick={() => saring(() => setKelompok(pilih ? '' : r.id))}
                  className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 py-2 cursor-pointer ${pilih ? 'bg-blue text-paper' : 'text-ink'}`}
                >
                  <span className="t-button">{r.label}</span>
                  <span className={`t-body-s ${pilih ? 'text-paper' : 'text-muted'}`}>{ribuan(r.n)}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="t-label-s text-muted">JENJANG</p>
          <div className="flex flex-wrap gap-1.5">
            {JENJANG.slice(1).map((j) => {
              const pilih = jenjang === j;
              return (
                <button
                  key={j}
                  type="button"
                  aria-pressed={pilih}
                  onClick={() => saring(() => setJenjang(pilih ? '' : j))}
                  className={`border-[1.5px] px-2 py-1 t-label-s cursor-pointer ${pilih ? 'border-ink bg-ink text-paper' : 'border-blue bg-blue-50 text-blue-700'}`}
                >
                  {j} · {ribuan(hitung[j])}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="t-label-s text-muted">KLASTER KEILMUAN</p>
          <div className="flex flex-col" role="radiogroup" aria-label="Klaster keilmuan">
            {KLASTER.map((k) => (
              <Opsi
                key={k.id}
                label={`${k.nama} · ${ribuan(hitung[`k${k.id}`])}`}
                pilih={klaster === k.id}
                onClick={() => saring(() => setKlaster(klaster === k.id ? null : k.id))}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="t-label-s text-muted">LAINNYA</p>
          <Opsi label="Hanya prodi wajib portofolio" pilih={portofolio} onClick={() => saring(() => setPortofolio((v) => !v))} />
        </div>
      </aside>
      <main className="flex flex-col gap-4 px-6 pt-5 pb-8 lg:min-w-0 lg:flex-1 lg:gap-5 lg:p-0">
        <div className="flex flex-col gap-1.5 lg:flex-row lg:items-end lg:gap-6">
          <div className="flex flex-col gap-1.5 lg:min-w-0 lg:flex-1 lg:gap-2.5">
            <p className="t-label-s text-blue">SIMULASI JURUSAN</p>
            <h1 className="t-display-m text-ink lg:text-[26px] lg:leading-[38px]">{ribuan(hitung.semua)} prodi dari 146 PTN</h1>
          </div>
          {daftar && daftar.length > 0 && (
            <PemilihPreferensi daftar={daftar} onPilih={aktifkan} className="hidden w-[232px] shrink-0 lg:block" />
          )}
        </div>
        <label className="flex h-[52px] items-center gap-2.5 border-2 border-ink bg-paper px-3.5 shadow-pixel-sm lg:h-14 lg:px-4">
          <img src="/figma/icon-search-18.svg" alt="" width={18} height={18} />
          <input
            value={q}
            onChange={(e) => saring(() => setQ(e.target.value))}
            placeholder='Cari prodi/kampus · coba "TI", "DKV", "POLBAN"'
            aria-label="Cari prodi atau kampus"
            className="min-w-0 flex-1 bg-transparent t-body-s text-ink outline-none placeholder:text-muted lg:t-body-m"
          />
        </label>
        <div className="flex border-2 border-ink bg-paper lg:hidden" role="tablist" aria-label="Rumpun ilmu">
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
        <div className="flex flex-wrap gap-2 lg:hidden">
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
        <p className="t-label-s text-ink lg:hidden">{total === null ? 'MEMUAT…' : `${ribuan(total)} PRODI`}</p>
        <p className="hidden t-body-s font-bold text-ink lg:block">
          {total === null ? 'Memuat…' : `Menampilkan ${ribuan(total)} prodi`}
          {ringkasFilter.length > 0 && ` · ${ringkasFilter.join(' · ')}`}
        </p>
        {galat && <p className="t-body-s font-bold text-red">{galat}</p>}
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-5">
          {hasil.map((p) => (
            <KartuProdi key={p.id_prodi} p={p} onSimulasi={() => router.push(`/test-drive/${p.id_prodi}`)} />
          ))}
        </div>
        {total !== null && hasil.length === 0 && !memuat && <p className="t-body-m text-muted">Tidak ada prodi yang cocok dengan pencarianmu.</p>}
        {total !== null && hasil.length < total && (
          <Tombol jenis="secondary" penuh disabled={memuat} onClick={() => setHalaman((h) => h + 1)}>
            {memuat ? 'Memuat…' : 'Muat lagi'}
          </Tombol>
        )}
      </main>
      </div>
      <div className="hidden lg:block">
        <Footer />
      </div>
    </BingkaiMobile>
  );
}
