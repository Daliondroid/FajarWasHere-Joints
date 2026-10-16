import type { JenisKartu, KartuRekomendasi } from '@/types';
import Tombol from '@/components/ui/Tombol';

/** Warna tiket per peringkat (DESIGN_SYSTEM §2.3): #1 Dream Goal blue · #2 Safety Net green · #3 Alternatif yellow. */
export const GAYA_TIKET: Record<JenisKartu, { latar: string; teks: string; teks2: string; isi: string; kotak: string; nama: string }> = {
  dream_goal: { latar: '/figma/tiket-biru.svg', teks: 'text-paper', teks2: 'text-blue-50', isi: 'bg-yellow', kotak: 'bg-blue text-paper', nama: 'Dream Goal' },
  safety_net: { latar: '/figma/tiket-hijau.svg', teks: 'text-paper', teks2: 'text-green-50', isi: 'bg-yellow', kotak: 'bg-green text-paper', nama: 'Safety Net' },
  alternatif: { latar: '/figma/tiket-kuning.svg', teks: 'text-ink', teks2: 'text-ink-2', isi: 'bg-ink', kotak: 'bg-yellow text-ink', nama: 'Alternatif' },
};

/** Card/Major Ticket (Figma `108:608`): stub peringkat, perforasi, nama prodi, bar kecocokan, SIMULASI + DETAIL. */
export default function TiketJurusan({ k, onDetail, onSimulasi }: { k: KartuRekomendasi; onDetail: () => void; onSimulasi: () => void }) {
  const g = GAYA_TIKET[k.jenis];
  const skor = Math.round(k.kecocokan.skor);
  return (
    <article className="relative h-[152px] w-[354px] shrink-0" aria-label={`#${k.peringkat} ${g.nama}: ${k.prodi.nama_prodi}`}>
      <img src={g.latar} alt="" className="absolute top-0 left-0 h-[157px] w-[359px] max-w-none" />
      <img src="/figma/perforasi.svg" alt="" className="absolute top-4 left-[77px] h-[120px] w-0.5" />
      <div className="absolute top-0 left-0 flex h-[152px] w-[78px] flex-col items-center justify-center gap-1">
        <span className={`t-label-s ${g.teks2}`}>RANK</span>
        <span className={`t-display-l ${g.teks}`}>#{k.peringkat}</span>
      </div>
      <div className="absolute inset-y-0 right-0 left-20 flex flex-col justify-center gap-2.5 p-4">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h3 className={`truncate t-label-l capitalize ${g.teks}`}>{k.prodi.nama_prodi.toLowerCase()}</h3>
          <p className={`truncate t-body-s capitalize ${g.teks2}`}>
            {k.prodi.nama_ptn.toLowerCase()} · {k.prodi.jenjang}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`t-body-s font-bold ${g.teks}`}>Cocok</span>
          <span className="min-w-0 flex-1 border-[1.5px] border-ink bg-paper p-0.5">
            <span className={`block h-2 ${g.isi}`} style={{ width: `${skor}%` }} />
          </span>
          <span className={`t-body-s font-bold ${g.teks}`}>{skor}%</span>
        </div>
        <div className="flex gap-2">
          <Tombol jenis="danger" ukuran="M" onClick={onSimulasi}>
            Simulasi
          </Tombol>
          <Tombol jenis="secondary" ukuran="M" onClick={onDetail}>
            Detail
          </Tombol>
        </div>
      </div>
    </article>
  );
}
