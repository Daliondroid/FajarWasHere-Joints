'use client';

import { useEffect } from 'react';
import type { JalurPreferensi, KartuRekomendasi, LabelKeketatan } from '@/types';
import Tag, { type WarnaTag } from '@/components/ui/Tag';
import Tombol from '@/components/ui/Tombol';
import { GAYA_TIKET } from './TiketJurusan';

const KETAT: Record<LabelKeketatan, { warna: WarnaTag; teks: string }> = {
  sangat_ketat: { warna: 'red', teks: 'SANGAT KETAT' },
  ketat: { warna: 'yellow', teks: 'KETAT' },
  sedang: { warna: 'blue', teks: 'SEDANG' },
  longgar: { warna: 'green', teks: 'LONGGAR' },
};

const persen = (r: number) => `${(r * 100).toFixed(1).replace('.', ',')}%`;
const rentang = (r: [number, number]) => `${Math.round(r[0])}–${Math.round(r[1])}%`;
const judulKapital = (s: string) => s.toLowerCase().replace(/\b\w/g, (h) => h.toUpperCase());

/** Ikon + label data per alasan "Kenapa?": data resmi (rasio, kuota) vs estimasi (skor). */
function gayaAlasan(teks: string): { ikon: string; tag: WarnaTag; label: string } {
  if (/rasio|diterima/i.test(teks)) return { ikon: '/figma/icon-chart-14.svg', tag: 'green', label: 'RESMI' };
  if (/peringkat|kuota/i.test(teks)) return { ikon: '/figma/icon-check-hijau-14.svg', tag: 'green', label: 'RESMI' };
  return { ikon: '/figma/icon-info-14.svg', tag: 'yellow', label: 'ESTIMASI' };
}

const Garis = () => <img src="/figma/garis-putus.svg" alt="" className="h-0.5 w-full" />;

/** Popup DETAIL rekomendasi (Figma M14 `205:3552`, desktop D07b `272:4316`, K-07): kecocokan, peluang + keketatan, 3 alasan, PDDikti. */
export default function PopupDetail({
  k,
  jalur,
  kodeSiswa,
  onTutup,
  onSimulasi,
}: {
  k: KartuRekomendasi;
  jalur: JalurPreferensi;
  kodeSiswa: string;
  onTutup: () => void;
  onSimulasi: () => void;
}) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onTutup();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onTutup]);

  const g = GAYA_TIKET[k.jenis];
  const skor = Math.round(k.kecocokan.skor);
  const d = k.detail;
  const ketat = jalur === 'snbp' ? d.keketatan_snbp : d.keketatan_snbt;
  const peluang = jalur === 'snbp' ? d.peluang_snbp : d.peluang_snbt;
  const alasan = d.peluang_snbp?.alasan ?? [];
  const kampus = judulKapital(k.prodi.nama_ptn);

  return (
    <div role="dialog" aria-modal="true" aria-label={`Detail ${k.prodi.nama_prodi}`} className="fixed inset-0 z-[60] flex items-end justify-center lg:items-start lg:pt-[120px]">
      <div className="absolute inset-0 bg-ink/55" onClick={onTutup} />
      <div className="relative flex max-h-[88vh] w-full max-w-[402px] flex-col gap-[18px] overflow-y-auto border-t-2 border-ink bg-paper px-6 pt-3 pb-6 lg:max-h-[calc(100vh-160px)] lg:max-w-[560px] lg:border-2 lg:p-[30px] lg:shadow-pixel-md">
        <div className="flex justify-center lg:hidden">
          <span className="h-1 w-12 bg-track" />
        </div>
        <div className="flex items-center gap-3">
          <span className={`flex size-[52px] shrink-0 items-center justify-center border-2 border-ink t-display-s ${g.kotak}`}>#{k.peringkat}</span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <h2 className="t-label-l capitalize text-ink">{k.prodi.nama_prodi.toLowerCase()}</h2>
            <p className="t-body-s text-muted">
              {g.nama} · {kampus} · {k.prodi.jenjang}
            </p>
          </div>
          <button type="button" aria-label="Tutup" onClick={onTutup} className="flex size-9 shrink-0 items-center justify-center border-[1.5px] border-ink cursor-pointer">
            <img src="/figma/icon-close-14.svg" alt="" width={14} height={14} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <span className="t-body-s font-bold text-ink">Cocok</span>
            <span className="h-3.5 w-[200px] border-[1.5px] border-ink bg-canvas p-0.5 lg:w-[200px]">
              <span className="block h-2.5 bg-yellow" style={{ width: `${skor}%` }} />
            </span>
            <span className="t-label-m text-ink">{skor}%</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Tag warna="ink">{k.prodi.kelompok.toUpperCase()}</Tag>
            <Tag warna="yellow">HOLLAND {d.kode_holland}</Tag>
            <span className="t-body-s text-muted">{k.kecocokan.label.toLowerCase()} dengan {kodeSiswa}-mu</span>
          </div>
        </div>

        <Garis />

        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <h3 className="t-label-m text-ink">Peluang di kampus ini</h3>
            <span className="flex-1" />
            <Tag warna="yellow">ESTIMASI</Tag>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p className="min-w-0 flex-1 t-body-m font-semibold text-ink">{kampus}</p>
              {ketat && <Tag warna={KETAT[ketat.label].warna}>{KETAT[ketat.label].teks}</Tag>}
            </div>
            {ketat && (
              <p className="t-body-s text-muted">
                {judulKapital(k.prodi.nama_prodi)} · {jalur === 'snbp' ? `diterima SNBP ${ketat.tahun}` : `daya tampung ÷ peminat ${ketat.tahun}`}: {persen(ketat.rasio)}
                {ketat.data_terbatas && ' · data terbatas'}
              </p>
            )}
            <p className="t-body-s font-bold text-ink">
              {peluang?.dihitung && peluang.rentang ? `Peluangmu ${rentang(peluang.rentang)}` : (peluang?.pesan ?? 'Peluang belum bisa dihitung.')}
            </p>
          </div>
        </section>

        {peluang?.dihitung && peluang.rentang && (
          <>
            <Garis />
            <section className="flex flex-col gap-3">
              <h3 className="t-label-m text-ink">
                Kenapa peluangmu di {kampus} {rentang(peluang.rentang)}?
              </h3>
              {alasan.length ? (
                alasan.map((a) => {
                  const s = gayaAlasan(a);
                  return (
                    <div key={a} className="flex items-start gap-2.5">
                      <img src={s.ikon} alt="" width={14} height={14} className="mt-[3px] shrink-0" />
                      <p className="min-w-0 flex-1 t-body-s text-ink-2">{a}</p>
                      <Tag warna={s.tag}>{s.label}</Tag>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-start gap-2.5">
                  <img src="/figma/icon-info-14.svg" alt="" width={14} height={14} className="mt-[3px] shrink-0" />
                  <p className="min-w-0 flex-1 t-body-s text-ink-2">
                    Dihitung dari rata-rata skor try out terbarumu dibanding estimasi skor UTBK prodi. Skala TO tiap bimbel berbeda, jadi ini perkiraan kasar.
                  </p>
                  <Tag warna="yellow">ESTIMASI</Tag>
                </div>
              )}
            </section>
          </>
        )}

        {d.pddikti && (
          <>
            <Garis />
            <div className="flex items-center gap-2.5">
              <img src="/figma/icon-school-16.svg" alt="" width={16} height={16} className="shrink-0" />
              <p className="min-w-0 flex-1 t-body-s text-ink-2">
                Akreditasi {d.pddikti.akreditasi}
                {d.pddikti.rasio_dosen_mhs && ` · dosen:mhs ${d.pddikti.rasio_dosen_mhs}`}
                {d.pddikti.rata_masa_studi_th != null && ` · masa studi ${String(d.pddikti.rata_masa_studi_th).replace('.', ',')} th`}
              </p>
              <Tag warna="green">PDDIKTI</Tag>
            </div>
          </>
        )}

        <div className="flex gap-2.5">
          <Tombol ikon className="min-w-0 flex-1" onClick={onSimulasi}>
            Simulasi
          </Tombol>
          <Tombol jenis="secondary" onClick={onTutup}>
            Tutup
          </Tombol>
        </div>
      </div>
    </div>
  );
}
