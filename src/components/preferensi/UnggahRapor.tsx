'use client';

import { useRef, useState } from 'react';
import type { AkademikSnbp, HasilEkstraksiRapor, ResponsEkstrakRapor } from '@/types';
import Tag from '@/components/ui/Tag';
import Tombol from '@/components/ui/Tombol';
import { panggilApi, pesanGalat } from '@/lib/klien/api';
import { MAKS_UKURAN_RAPOR, TIPE_RAPOR, nilaiUntukMapel } from '@/lib/rapor/ekstraksi';

const desimal = (n: number | null) => (n === null ? '–' : n.toLocaleString('id-ID', { maximumFractionDigits: 2 }));

/**
 * Upload Zone rapor (Figma `81:67`, F-13): foto/PDF dibaca AI lewat POST /api/rapor/ekstrak, lalu siswa mengecek
 * tabel nilai dan menekan "Pakai nilai ini" (BR-12). Berkas tidak disimpan (BR-14).
 */
export default function UnggahRapor({ a, ubah }: { a: AkademikSnbp; ubah: (a: AkademikSnbp) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [sibuk, setSibuk] = useState(false);
  const [hasil, setHasil] = useState<HasilEkstraksiRapor | null>(null);
  const [pesan, setPesan] = useState<string | null>(null);
  const [dipakai, setDipakai] = useState(false);

  const pilih = async (f: File | undefined) => {
    if (!f) return;
    setHasil(null);
    setDipakai(false);
    if (!(TIPE_RAPOR as readonly string[]).includes(f.type)) return setPesan('Format harus PDF, JPG, PNG, atau WEBP.');
    if (f.size > MAKS_UKURAN_RAPOR) return setPesan('Ukuran berkas maksimal 4 MB. Kompres foto atau pisah per semester.');
    setSibuk(true);
    setPesan(null);
    try {
      const body = new FormData();
      body.append('berkas', f);
      const r = await panggilApi<ResponsEkstrakRapor>('/api/rapor/ekstrak', { method: 'POST', body });
      setHasil(r.data);
      setPesan(r.pesan);
    } catch (e) {
      setPesan(pesanGalat(e));
    } finally {
      setSibuk(false);
      if (input.current) input.current.value = '';
    }
  };

  const pakai = () => {
    if (!hasil) return;
    const pendukung = Object.fromEntries(
      Object.entries(a.nilai_mapel_pendukung).map(([m, n]) => [m, nilaiUntukMapel(hasil, m) ?? n]),
    );
    ubah({
      ...a,
      rapor_rata: hasil.rata_rata,
      peringkat_paralel: hasil.peringkat_paralel ?? a.peringkat_paralel,
      jumlah_siswa_jurusan: hasil.jumlah_siswa ?? a.jumlah_siswa_jurusan,
      nilai_mapel_pendukung: pendukung,
    });
    setDipakai(true);
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => input.current?.click()}
        disabled={sibuk}
        className="flex w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-blue bg-blue-50 px-4 py-6 cursor-pointer disabled:opacity-70"
      >
        <img src="/figma/icon-upload.svg" alt="" width={32} height={32} />
        <span className="text-center t-label-m text-ink">{sibuk ? 'Membaca rapor…' : 'Unggah foto/PDF rapor semester 1–5'}</span>
        <span className="text-center t-body-s text-muted">PDF, JPG, PNG · maks. 4 MB · dibaca AI, kamu cek dulu sebelum dipakai</span>
      </button>
      <input
        ref={input}
        type="file"
        accept={TIPE_RAPOR.join(',')}
        className="hidden"
        aria-label="Pilih berkas rapor"
        onChange={(e) => void pilih(e.target.files?.[0])}
      />
      <p className="t-body-s text-muted">Versi demo: gunakan rapor contoh. Berkas tidak disimpan setelah dibaca.</p>

      {pesan && <p className="t-body-s font-bold text-red">{pesan}</p>}

      {hasil && (
        <div className="flex flex-col gap-3 border-[1.5px] border-ink bg-canvas p-3">
          <div className="flex items-center gap-2">
            <Tag warna="yellow">HASIL BACA AI · CEK DULU</Tag>
          </div>
          <table className="w-full table-fixed border-collapse t-body-s text-ink">
              <thead>
                <tr className="border-b-[1.5px] border-ink text-left">
                  <th className="py-1 pr-1 font-bold">Mapel</th>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <th key={s} className="w-7 py-1 text-right font-bold">
                      S{s}
                    </th>
                  ))}
                  <th className="w-12 py-1 text-right font-bold">Rata</th>
                </tr>
              </thead>
              <tbody>
                {hasil.mapel.map((m) => (
                  <tr key={m.mapel} className="border-b border-line">
                    <td className="truncate py-1 pr-1" title={m.mapel}>
                      {m.mapel}
                    </td>
                    {m.nilai.map((n, i) => (
                      <td key={i} className="py-1 text-right">
                        {desimal(n)}
                      </td>
                    ))}
                    <td className="py-1 text-right font-bold">{desimal(m.rata)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          <div className="flex items-center gap-2 bg-ink p-2.5">
            <span className="t-label-s text-paper">RATA-RATA SMT {hasil.semester_terbaca.join(', ')}</span>
            <span className="flex-1" />
            <span className="t-display-s text-yellow">{desimal(hasil.rata_rata)}</span>
          </div>
          {hasil.peringkat_paralel !== null && (
            <p className="t-body-s text-ink-2">
              Peringkat paralel terbaca: <b>{hasil.peringkat_paralel}</b>
              {hasil.jumlah_siswa !== null && <> dari {hasil.jumlah_siswa} siswa</>}
            </p>
          )}
          {hasil.peringatan.map((p) => (
            <p key={p} className="t-body-s text-ink">
              ⚠ {p}
            </p>
          ))}
          {dipakai ? (
            <p className="flex items-center gap-2 t-body-s font-bold text-green">
              <img src="/figma/icon-check-hijau-14.svg" alt="" width={14} height={14} />
              Nilai dipakai. Kamu masih bisa mengubahnya di bawah.
            </p>
          ) : (
            <div className="flex gap-2">
              <Tombol jenis="secondary" ukuran="M" onClick={() => setHasil(null)}>
                Buang
              </Tombol>
              <Tombol ukuran="M" onClick={pakai} className="min-w-0 flex-1">
                Pakai nilai ini
              </Tombol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
