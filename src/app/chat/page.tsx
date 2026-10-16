'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PesanChat, ResponsChat, ResponsRiwayatChat } from '@/types';
import { TopBar } from '@/components/ui/TopBar';
import BingkaiMobile from '@/components/ui/BingkaiMobile';
import Logo from '@/components/ui/Logo';
import PemilihPreferensi from '@/components/ui/PemilihPreferensi';
import Tag from '@/components/ui/Tag';
import LaciChat, { IsiMenuChat } from '@/components/chat/LaciChat';
import { panggilApi, pesanGalat } from '@/lib/klien/api';
import { useDaftarPreferensi } from '@/lib/klien/preferensi';

interface Pesan extends PesanChat {
  /** Hanya pada balasan baru (riwayat tidak menyimpan metadata). */
  info?: Pick<ResponsChat, 'alat_dipakai' | 'angka_terverifikasi' | 'cadangan'>;
}

/** Markdown minimal dari model: **tebal** jadi <b>, *miring* cukup dibuang tanda bintangnya. */
function TeksBalasan({ teks }: { teks: string }) {
  return (
    <>
      {teks.split(/(\*\*[^*]+\*\*)/g).map((b, i) =>
        b.startsWith('**') && b.endsWith('**') ? <b key={i}>{b.slice(2, -2)}</b> : b.replace(/\*([^*\n]+)\*/g, '$1'),
      )}
    </>
  );
}

const jam = (iso: string) => new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

/** Chat Bubble (Figma `169:259`): bot paper + avatar logo, kamu blue; label data bila angka dari API internal (BR-12, BR-13). */
function Gelembung({ p }: { p: Pesan }) {
  if (p.peran === 'pengguna') {
    return (
      <div className="flex w-full justify-end">
        <p className="max-w-[250px] border-2 border-ink bg-blue p-3 t-body-m whitespace-pre-wrap text-paper shadow-pixel-sm lg:w-[420px] lg:max-w-full lg:px-4 lg:py-3.5">
          {p.isi}
        </p>
      </div>
    );
  }
  const i = p.info;
  return (
    <div className="flex w-full items-start gap-2 lg:gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center border-[1.5px] border-ink bg-paper lg:size-9">
        <Logo ukuran={24} className="lg:hidden" />
        <Logo ukuran={26} className="hidden lg:inline-block" />
      </span>
      <div className="flex max-w-[290px] flex-col items-start gap-2 border-2 border-ink bg-paper p-3 shadow-pixel-sm lg:w-[560px] lg:max-w-full lg:gap-2.5 lg:px-4 lg:py-3.5">
        <p className="t-body-m whitespace-pre-wrap text-ink">
          <TeksBalasan teks={p.isi} />
        </p>
        {i && i.alat_dipakai.length > 0 && i.angka_terverifikasi && <Tag warna="green">DATA RESMI · SNPMB.ID</Tag>}
        {i && !i.angka_terverifikasi && <Tag warna="yellow">ANGKA BELUM TERVERIFIKASI</Tag>}
        {i?.cadangan && <Tag warna="ink">JAWABAN CADANGAN</Tag>}
      </div>
    </div>
  );
}

/** M15 · Cocokin AI chat (Figma `177:1569`, Hal. 10); desktop D08 (`189:2794`) sidebar + percakapan. POST/GET /api/chat. */
export default function ChatPage() {
  const router = useRouter();
  const { daftar, aktifkan } = useDaftarPreferensi(true);
  const [pesan, setPesan] = useState<Pesan[]>([]);
  const [teks, setTeks] = useState('');
  const [mengirim, setMengirim] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);
  const [laci, setLaci] = useState(false);
  const bawah = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panggilApi<ResponsRiwayatChat>('/api/chat')
      .then((r) => setPesan(r.data))
      .catch((e) => setGalat(pesanGalat(e)));
  }, []);

  useEffect(() => {
    bawah.current?.scrollIntoView({ behavior: 'smooth' });
  }, [pesan.length, mengirim]);

  const aktif = daftar?.find((p) => p.aktif);
  const top = aktif?.rekomendasi_teratas;
  const saran = [
    top ? `Peluangku di ${top.nama_prodi.toLowerCase()} ${top.nama_ptn.toLowerCase()}?` : 'Jurusan apa yang paling cocok untukku?',
    'Bandingkan rekomendasi #1 dan #2',
    'Prodi serumpun yang lebih longgar?',
  ];

  const kirim = async (isi: string) => {
    const bersih = isi.trim();
    if (!bersih || mengirim) return;
    setTeks('');
    setGalat(null);
    setPesan((p) => [...p, { peran: 'pengguna', isi: bersih, dibuat_pada: new Date().toISOString() }]);
    setMengirim(true);
    try {
      const r = await panggilApi<ResponsChat>('/api/chat', { method: 'POST', body: { pesan: bersih } });
      setPesan((p) => [
        ...p,
        { peran: 'asisten', isi: r.balasan, dibuat_pada: r.dibuat_pada, info: { alat_dipakai: r.alat_dipakai, angka_terverifikasi: r.angka_terverifikasi, cadangan: r.cadangan } },
      ]);
    } catch (e) {
      setGalat(pesanGalat(e));
    } finally {
      setMengirim(false);
    }
  };

  const pertama = pesan.find((p) => p.peran === 'pengguna');

  const chatBaru = () => {
    if (!pesan.length || window.confirm('Mulai chat baru? Riwayat percakapan ini akan dihapus.')) void hapusRiwayat();
  };

  const hapusRiwayat = async () => {
    try {
      await panggilApi('/api/chat', { method: 'DELETE' });
      setPesan([]);
      setLaci(false);
    } catch (e) {
      setGalat(pesanGalat(e));
    }
  };

  return (
    <BingkaiMobile>
      <TopBar
        title="Cocokin AI"
        onBack={() => router.push('/cocokin')}
        rightElement={
          <button type="button" aria-label="Buka menu chat" onClick={() => setLaci(true)} className="flex size-10 items-center justify-center cursor-pointer">
            <img src="/figma/icon-menu.svg" alt="" width={20} height={20} />
          </button>
        }
      />
      <div className="flex flex-1 flex-col lg:flex-row">
      {/* Sidebar desktop (Figma D08 `189:2829`) */}
      <aside className="hidden w-[340px] shrink-0 flex-col gap-4 overflow-y-auto border-r-2 border-ink bg-canvas p-6 lg:sticky lg:top-20 lg:flex lg:h-[calc(100vh-80px)]">
        <IsiMenuChat
          daftar={daftar}
          onPilih={aktifkan}
          judulPercakapan={pertama?.isi ?? null}
          tanggal={pertama ? new Date(pertama.dibuat_pada).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : null}
          onHapusRiwayat={hapusRiwayat}
          onChatBaru={chatBaru}
          ringkas
        />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex items-center border-b-[1.5px] border-line bg-canvas px-6 py-2.5 lg:hidden">
        {daftar && daftar.length > 0 ? (
          <PemilihPreferensi daftar={daftar} onPilih={aktifkan} className="flex-1" />
        ) : (
          <p className="t-body-s text-muted">Memuat preferensi…</p>
        )}
      </div>

      <main className="flex flex-1 flex-col gap-3.5 px-6 py-5 lg:gap-[18px] lg:px-[140px] lg:pt-8 lg:pb-6" aria-live="polite">
        <p className="text-center t-label-s text-muted">HARI INI · {jam(pesan[0]?.dibuat_pada ?? new Date().toISOString())}</p>
        <Gelembung
          p={{
            peran: 'asisten',
            isi: aktif
              ? `Halo! Aku menjawab berdasarkan preferensi ${aktif.nama} (${aktif.jalur.toUpperCase()}). Mau tanya apa?`
              : 'Halo! Buat preferensi dulu supaya jawabanku sesuai minat dan data jalurmu.',
            dibuat_pada: '',
          }}
        />
        {pesan.length === 0 && (
          <div className="flex flex-col items-start gap-2 pl-10 lg:flex-row lg:flex-wrap lg:gap-2.5 lg:pl-12">
            {saran.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => kirim(s)}
                className="flex items-center gap-2 border-[1.5px] border-ink bg-paper px-3 py-2 text-left shadow-pixel-sm cursor-pointer"
              >
                <img src="/figma/icon-spark-14.svg" alt="" width={14} height={14} className="shrink-0" />
                <span className="t-body-s font-bold text-ink first-letter:uppercase">{s}</span>
              </button>
            ))}
          </div>
        )}
        {pesan.map((p, i) => (
          <Gelembung key={`${p.dibuat_pada}-${i}`} p={p} />
        ))}
        {mengirim && <p className="pl-10 t-body-s text-muted lg:pl-12">Cocokin AI sedang mengetik…</p>}
        {galat && <p className="t-body-s font-bold text-red">{galat}</p>}
        <div ref={bawah} />
      </main>

      <form
        className="sticky bottom-0 flex items-center gap-2.5 border-t-2 border-ink bg-paper px-6 pt-3.5 pb-[22px] lg:gap-3 lg:px-[140px] lg:pt-4 lg:pb-6"
        onSubmit={(e) => {
          e.preventDefault();
          void kirim(teks);
        }}
      >
        <button
          type="button"
          disabled
          title="Lampiran belum tersedia"
          aria-label="Lampiran (belum tersedia)"
          className="flex size-12 shrink-0 items-center justify-center border-2 border-ink bg-paper opacity-50 lg:size-[52px]"
        >
          <img src="/figma/icon-plus.svg" alt="" width={20} height={20} />
        </button>
        <input
          value={teks}
          onChange={(e) => setTeks(e.target.value)}
          maxLength={1000}
          placeholder="Ketik pertanyaanmu…"
          aria-label="Pertanyaan"
          className="h-12 min-w-0 flex-1 border-2 border-ink bg-paper pr-3 pl-3.5 t-body-m text-ink outline-none placeholder:text-muted lg:h-[52px] lg:max-w-[400px] lg:pr-3.5 lg:pl-4"
        />
        <button
          type="submit"
          aria-label="Kirim"
          disabled={!teks.trim() || mengirim}
          className="flex size-12 shrink-0 items-center justify-center border-2 border-ink bg-blue shadow-pixel-sm disabled:opacity-50 cursor-pointer lg:size-[52px]"
        >
          <img src="/figma/icon-send.svg" alt="" width={20} height={20} />
        </button>
      </form>
      </div>
      </div>
      {laci && (
        <LaciChat
          daftar={daftar}
          onPilih={aktifkan}
          judulPercakapan={pertama?.isi ?? null}
          tanggal={pertama ? new Date(pertama.dibuat_pada).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : null}
          onHapusRiwayat={hapusRiwayat}
          onTutup={() => setLaci(false)}
        />
      )}
    </BingkaiMobile>
  );
}
