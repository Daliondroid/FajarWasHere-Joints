'use client';

import { useEffect, useState } from 'react';
import type { AkademikSnbp, ProdiRingkas, ReputasiAlumni, ResponsDaftarProdi, ResponsSekolah, SekolahDetail } from '@/types';
import { RetroWindow } from '@/components/ui/RetroWindow';
import { Isian, Pilihan } from '@/components/ui/Isian';
import Tag from '@/components/ui/Tag';
import Tombol from '@/components/ui/Tombol';
import { BarisNilai, Chip, JudulWizard, Opsi, Stepper } from '@/components/preferensi/BagianWizard';
import UnggahRapor from '@/components/preferensi/UnggahRapor';
import { cekEligibilitas } from '@/lib/skoring/eligibilitas';
import { MAPEL_PILIHAN_TKA } from '@/lib/skoring/peluang_snbp';
import { OPSI_MAPEL_FAVORIT } from '@/lib/skoring/parameter';
import { panggilApi, pesanGalat } from '@/lib/klien/api';

export const AKADEMIK_KOSONG: AkademikSnbp = {
  npsn: null,
  jurusan_sekolah: null,
  rapor_rata: null,
  nilai_mapel_pendukung: {},
  peringkat_paralel: null,
  jumlah_siswa_jurusan: null,
  nilai_tka: {},
  prestasi: [],
  reputasi_alumni: null,
  kampus_alumni: [],
};

const TKA_WAJIB = [
  { kunci: 'bahasa_indonesia', label: 'Bahasa Indonesia' },
  { kunci: 'matematika', label: 'Matematika' },
  { kunci: 'bahasa_inggris', label: 'Bahasa Inggris' },
] as const;

/** Kelompok mapel pilihan TKA di bottom sheet (Figma M10b `198:3346`). */
const KELOMPOK_TKA: { judul: string; mapel: string[] }[] = [
  { judul: 'SAINS', mapel: ['Matematika Tingkat Lanjut', 'Fisika', 'Kimia', 'Biologi'] },
  { judul: 'SOSIAL', mapel: ['Ekonomi', 'Sosiologi', 'Geografi', 'Sejarah', 'Antropologi', 'Pendidikan Pancasila dan Kewarganegaraan'] },
  {
    judul: 'BAHASA',
    mapel: [
      'Bahasa Indonesia Tingkat Lanjut',
      'Bahasa Inggris Tingkat Lanjut',
      'Bahasa Arab',
      'Bahasa Jerman',
      'Bahasa Prancis',
      'Bahasa Jepang',
      'Bahasa Korea',
      'Bahasa Mandarin',
    ],
  },
  { judul: 'KHUSUS SMK/MAK', mapel: ['Produk/Projek Kreatif dan Kewirausahaan'] },
].map((k) => ({ ...k, mapel: k.mapel.filter((m) => MAPEL_PILIHAN_TKA.includes(m)) }));

const REPUTASI: { id: ReputasiAlumni; label: string }[] = [
  { id: 'langganan_ptn_top', label: 'Langganan banjir PTN top' },
  { id: 'rutin_lolos', label: 'Rutin lolos PTN' },
  { id: 'satu_lima_per_tahun', label: '1–5 siswa per tahun' },
  { id: 'sekolah_baru', label: 'Sekolah baru / belum ada jejak' },
];

const TINGKAT = ['Sekolah', 'Kabupaten/Kota', 'Provinsi', 'Nasional', 'Internasional'];

/** Sheet pilih 2 mapel pilihan TKA (Figma M10b). */
function LembarMapelTka({ awal, onBatal, onSimpan }: { awal: string[]; onBatal: () => void; onSimpan: (m: string[]) => void }) {
  const [pilih, setPilih] = useState<string[]>(awal);
  const alihkan = (m: string) => setPilih((p) => (p.includes(m) ? p.filter((x) => x !== m) : p.length < 2 ? [...p, m] : p));
  return (
    <div role="dialog" aria-modal="true" aria-label="Mapel pilihan TKA" className="fixed inset-0 z-[60] flex items-end justify-center">
      <div className="absolute inset-0 bg-ink/55" onClick={onBatal} />
      <div className="relative flex max-h-[90vh] w-full max-w-[402px] flex-col gap-3.5 overflow-y-auto border-t-2 border-ink bg-paper px-6 pt-3 pb-6">
        <div className="flex justify-center">
          <span className="h-1 w-12 bg-track" />
        </div>
        <div className="flex items-center gap-2">
          <h2 className="t-display-s text-ink">Mapel pilihan TKA</h2>
          <span className="flex-1" />
          <Tag warna="ink">PILIH {pilih.length}/2</Tag>
        </div>
        {KELOMPOK_TKA.map((k) => (
          <div key={k.judul} className="flex flex-col gap-2">
            <p className="t-label-s text-muted">{k.judul}</p>
            <div className="flex flex-wrap gap-1.5">
              {k.mapel.map((m) => (
                <Chip key={m} label={m} pilih={pilih.includes(m)} onClick={() => alihkan(m)} tinggi={36} />
              ))}
            </div>
          </div>
        ))}
        <div className="flex gap-3 pt-1">
          <Tombol jenis="secondary" onClick={onBatal}>
            Batal
          </Tombol>
          <Tombol ikon className="min-w-0 flex-1" disabled={pilih.length !== 2} onClick={() => onSimpan(pilih)}>
            Simpan
          </Tombol>
        </div>
      </div>
    </div>
  );
}

/** Langkah 2 SNBP layar 1 (M10 `174:1038`): sekolah, rapor & peringkat (unggah rapor F-13 di atas isian manual), TKA, prestasi. */
export function FormSnbpSekolah({ a, ubah, sekolah, setSekolah }: { a: AkademikSnbp; ubah: (a: AkademikSnbp) => void; sekolah: SekolahDetail | null; setSekolah: (s: SekolahDetail | null) => void }) {
  const [cari, setCari] = useState(a.npsn ?? '');
  const [hasilCari, setHasilCari] = useState<SekolahDetail[]>([]);
  const [galat, setGalat] = useState<string | null>(null);
  const [lembarTka, setLembarTka] = useState(false);
  const [mapelBaru, setMapelBaru] = useState('');
  const [prestasiBaru, setPrestasiBaru] = useState<{ bidang: string; tingkat: string; peringkat: string } | null>(null);

  // Cari sekolah: 8 digit = NPSN, selain itu nama (min 3 huruf).
  useEffect(() => {
    const q = cari.trim();
    if (sekolah && (q === sekolah.npsn || q === sekolah.nama)) return;
    if (!/^\d{8}$/.test(q) && q.length < 3) {
      setHasilCari([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const url = /^\d{8}$/.test(q) ? `/api/school?npsn=${q}` : `/api/school?q=${encodeURIComponent(q)}`;
        const { data } = await panggilApi<ResponsSekolah>(url);
        setGalat(null);
        if (Array.isArray(data)) setHasilCari(data);
        else pilihSekolah(data);
      } catch (e) {
        setHasilCari([]);
        setGalat(pesanGalat(e));
      }
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cari]);

  const pilihSekolah = (s: SekolahDetail) => {
    setSekolah(s);
    setHasilCari([]);
    setCari(s.npsn);
    const jurusan = s.jurusan_kuota.length === 1 ? s.jurusan_kuota[0].jurusan : a.jurusan_sekolah;
    ubah({ ...a, npsn: s.npsn, jurusan_sekolah: jurusan });
  };

  const kuotaJurusan = sekolah?.jurusan_kuota.find((j) => j.jurusan === a.jurusan_sekolah)?.kuota ?? null;
  const elig =
    sekolah && a.peringkat_paralel
      ? cekEligibilitas({
          peringkat_paralel: a.peringkat_paralel,
          kuota_jurusan: sekolah.ada_data_pdss ? kuotaJurusan : null,
          akreditasi_sekolah: sekolah.akreditasi,
          jumlah_siswa_jurusan: a.jumlah_siswa_jurusan,
        })
      : null;
  const totalSiswa = sekolah && sekolah.persen_kuota > 0 ? Math.round(sekolah.kuota_siswa / sekolah.persen_kuota) : null;
  const pilihan = a.nilai_tka.pilihan ?? [];
  const mapelPendukung = Object.entries(a.nilai_mapel_pendukung);

  return (
    <>
      <Stepper langkah={2} />
      <JudulWizard
        label="LANGKAH 2 · BAHAN SNBP"
        judul="Sekolah, rapor & TKA"
        keterangan="Dipakai untuk cek kuota eligible sekolah dan menghitung peluang SNBP."
      />

      <RetroWindow title="1 · Sekolah" variant="yellow" contentClassName="flex flex-col gap-3.5 px-4 pt-4 pb-[18px]">
        <Isian label="NPSN atau nama sekolah" placeholder="Contoh: 20403161" value={cari} onChange={(e) => setCari(e.target.value)} />
        {galat && <p className="t-body-s font-bold text-red">{galat}</p>}
        {hasilCari.length > 0 && (
          <ul className="flex max-h-56 flex-col overflow-y-auto border-2 border-ink">
            {hasilCari.map((s) => (
              <li key={s.npsn}>
                <button type="button" onClick={() => pilihSekolah(s)} className="w-full px-3 py-2 text-left hover:bg-canvas cursor-pointer">
                  <span className="block t-body-m font-semibold text-ink">{s.nama}</span>
                  <span className="block t-body-s text-muted">
                    {s.npsn} · {s.kab_kota}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {sekolah && (
          <div className="flex flex-col gap-2 border-[1.5px] border-green bg-green-50 p-3">
            <p className="flex items-center gap-2 t-label-m text-ink">
              <img src="/figma/icon-school-16.svg" alt="" width={16} height={16} />
              {sekolah.nama}
            </p>
            <p className="t-body-s text-muted">
              {sekolah.kab_kota} · {sekolah.provinsi}
            </p>
            <div className="flex items-center gap-2">
              <Tag warna="ink">AKREDITASI {sekolah.akreditasi ?? '–'}</Tag>
              <img src="/figma/icon-lock-12.svg" alt="" width={12} height={12} />
              <span className="t-body-s text-muted">terkunci dari data resmi</span>
            </div>
            {sekolah.ada_data_pdss ? (
              <p className="t-body-s font-bold text-ink">
                Kuota eligible: {sekolah.kuota_siswa} dari {totalSiswa} siswa ({Math.round(sekolah.persen_kuota * 100)}%)
              </p>
            ) : (
              <p className="t-body-s font-bold text-ink">Sekolah belum mengisi PDSS: kuota diperkirakan dari akreditasi.</p>
            )}
            <Tag warna="green" className="self-start">
              RESMI · SNPMB 2026
            </Tag>
          </div>
        )}
        {sekolah && sekolah.jurusan_kuota.length > 1 && (
          <Pilihan label="Jurusan di sekolah" value={a.jurusan_sekolah ?? ''} onChange={(e) => ubah({ ...a, jurusan_sekolah: e.target.value || null })}>
            <option value="">Pilih jurusan</option>
            {sekolah.jurusan_kuota.map((j) => (
              <option key={j.jurusan} value={j.jurusan}>
                {j.jurusan} · kuota {j.kuota}
              </option>
            ))}
          </Pilihan>
        )}
      </RetroWindow>

      <RetroWindow title="2 · Rapor & peringkat" variant="blue" contentClassName="flex flex-col gap-3.5 px-4 pt-4 pb-[18px]">
        <UnggahRapor a={a} ubah={ubah} />
        <BarisNilai label="Rata-rata rapor smt 1–5" nilai={a.rapor_rata} onUbah={(v) => ubah({ ...a, rapor_rata: v })} />
        {sekolah && !sekolah.ada_data_pdss && (
          <BarisNilai
            label="Jumlah siswa jurusanmu"
            nilai={a.jumlah_siswa_jurusan}
            onUbah={(v) => ubah({ ...a, jumlah_siswa_jurusan: v })}
            min={1}
            maks={10000}
            langkah={1}
          />
        )}
        <BarisNilai
          label={`Peringkat paralel${totalSiswa && sekolah?.ada_data_pdss ? ` (dari ${totalSiswa})` : ''}`}
          nilai={a.peringkat_paralel}
          onUbah={(v) => ubah({ ...a, peringkat_paralel: v })}
          min={1}
          maks={10000}
          langkah={1}
        />
        {elig?.kuota != null && (
          <div className={`flex items-center gap-2 border-[1.5px] p-2.5 ${elig.eligible ? 'border-green bg-green-50' : 'border-red bg-red-50'}`}>
            {elig.eligible && <img src="/figma/icon-check-hijau-14.svg" alt="" width={14} height={14} />}
            <p className="flex-1 t-body-s font-bold text-ink">
              {elig.eligible
                ? `Masuk kuota eligible sekolah (${a.peringkat_paralel} ≤ ${elig.kuota})`
                : `Di luar kuota eligible (${a.peringkat_paralel} > ${elig.kuota}) — fokus ke SNBT`}
            </p>
          </div>
        )}
        <div className="flex flex-col gap-2.5">
          <p className="t-label-m text-ink">Mapel pendukung</p>
          {mapelPendukung.map(([m, n]) => (
            <div key={m} className="flex items-center gap-2">
              <BarisNilai label={m} nilai={n} onUbah={(v) => ubah({ ...a, nilai_mapel_pendukung: { ...a.nilai_mapel_pendukung, [m]: v ?? 0 } })} />
              <button
                type="button"
                aria-label={`Hapus ${m}`}
                onClick={() => {
                  const sisa = { ...a.nilai_mapel_pendukung };
                  delete sisa[m];
                  ubah({ ...a, nilai_mapel_pendukung: sisa });
                }}
                className="t-body-s font-bold text-red cursor-pointer"
              >
                ×
              </button>
            </div>
          ))}
          {mapelPendukung.length < 2 && (
            <div className="flex items-center gap-2">
              <select
                aria-label="Tambah mapel pendukung"
                value={mapelBaru}
                onChange={(e) => {
                  const m = e.target.value;
                  setMapelBaru('');
                  if (m) ubah({ ...a, nilai_mapel_pendukung: { ...a.nilai_mapel_pendukung, [m]: a.rapor_rata ?? 0 } });
                }}
                className="t-body-s font-bold text-blue bg-transparent cursor-pointer outline-none"
              >
                <option value="">+ Tambah mapel pendukung</option>
                {OPSI_MAPEL_FAVORIT.filter((m) => !(m in a.nilai_mapel_pendukung)).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </RetroWindow>

      <RetroWindow title="3 · Nilai TKA (wajib)" variant="red" contentClassName="flex flex-col gap-3.5 px-4 pt-4 pb-[18px]">
        <p className="t-label-s text-muted">MAPEL WAJIB</p>
        {TKA_WAJIB.map((m) => (
          <BarisNilai
            key={m.kunci}
            label={m.label}
            nilai={a.nilai_tka[m.kunci] ?? null}
            onUbah={(v) => {
              const tka = { ...a.nilai_tka };
              if (v === null) delete tka[m.kunci];
              else tka[m.kunci] = v;
              ubah({ ...a, nilai_tka: tka });
            }}
          />
        ))}
        <img src="/figma/garis-putus-318.svg" alt="" className="h-0.5 w-full" />
        <div className="flex items-center gap-2">
          <p className="t-label-s text-muted">MAPEL PILIHAN</p>
          <span className="flex-1" />
          <Tag warna="ink">PILIH 2</Tag>
        </div>
        {pilihan.length === 0 ? (
          <Tombol jenis="secondary" ukuran="M" onClick={() => setLembarTka(true)}>
            Pilih 2 mapel
          </Tombol>
        ) : (
          pilihan.map((p, i) => (
            <div key={p.mapel} className="flex flex-col gap-1.5">
              <p className="t-body-s font-bold text-ink-2">Mapel pilihan {i + 1}</p>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setLembarTka(true)}
                  className="flex h-12 w-[200px] items-center gap-2 border-2 border-ink bg-paper px-3 text-left cursor-pointer"
                >
                  <span className="min-w-0 flex-1 truncate t-body-m text-ink">{p.mapel}</span>
                  <img src="/figma/icon-chevron-down-14.svg" alt="" width={14} height={14} />
                </button>
                <input
                  type="number"
                  aria-label={`Nilai ${p.mapel}`}
                  min={0}
                  max={100}
                  step={0.01}
                  value={p.nilai}
                  onChange={(e) =>
                    ubah({
                      ...a,
                      nilai_tka: { ...a.nilai_tka, pilihan: pilihan.map((q, k) => (k === i ? { ...q, nilai: Number(e.target.value) } : q)) },
                    })
                  }
                  className="h-12 w-20 border-2 border-ink bg-paper px-3 text-right t-body-m font-semibold text-ink outline-none"
                />
              </div>
            </div>
          ))
        )}
      </RetroWindow>

      <RetroWindow title="4 · Prestasi" variant="green" contentClassName="flex flex-col gap-3.5 px-4 pt-4 pb-[18px]">
        {a.prestasi.map((p, i) => (
          <div key={`${p.bidang}-${i}`} className="flex flex-col gap-2 border-[1.5px] border-ink bg-canvas p-3">
            <div className="flex items-start gap-2">
              <p className="flex-1 t-label-m text-ink">{p.bidang}</p>
              <button
                type="button"
                aria-label={`Hapus prestasi ${p.bidang}`}
                onClick={() => ubah({ ...a, prestasi: a.prestasi.filter((_, k) => k !== i) })}
                className="t-body-s font-bold text-red cursor-pointer"
              >
                ×
              </button>
            </div>
            <div className="flex gap-1.5">
              <Tag warna="yellow">{p.tingkat}</Tag>
              <Tag warna="ink">{p.peringkat}</Tag>
            </div>
          </div>
        ))}
        {prestasiBaru ? (
          <div className="flex flex-col gap-3 border-[1.5px] border-dashed border-ink p-3">
            <Isian label="Nama lomba & bidang" placeholder="Contoh: Olimpiade Sains · Informatika" value={prestasiBaru.bidang} maxLength={100} onChange={(e) => setPrestasiBaru({ ...prestasiBaru, bidang: e.target.value })} />
            <Pilihan label="Tingkat" value={prestasiBaru.tingkat} onChange={(e) => setPrestasiBaru({ ...prestasiBaru, tingkat: e.target.value })}>
              {TINGKAT.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </Pilihan>
            <Isian label="Peringkat" placeholder="Contoh: Juara 2" value={prestasiBaru.peringkat} maxLength={50} onChange={(e) => setPrestasiBaru({ ...prestasiBaru, peringkat: e.target.value })} />
            <div className="flex gap-2">
              <Tombol jenis="secondary" ukuran="M" onClick={() => setPrestasiBaru(null)}>
                Batal
              </Tombol>
              <Tombol
                ukuran="M"
                disabled={!prestasiBaru.bidang.trim() || !prestasiBaru.peringkat.trim()}
                onClick={() => {
                  ubah({ ...a, prestasi: [...a.prestasi, { bidang: prestasiBaru.bidang.trim(), tingkat: prestasiBaru.tingkat, peringkat: prestasiBaru.peringkat.trim() }] });
                  setPrestasiBaru(null);
                }}
              >
                Simpan
              </Tombol>
            </div>
          </div>
        ) : (
          a.prestasi.length < 3 && (
            <button
              type="button"
              onClick={() => setPrestasiBaru({ bidang: '', tingkat: 'Provinsi', peringkat: '' })}
              className="self-start t-body-s font-bold text-blue cursor-pointer"
            >
              + Tambah prestasi (maks 3)
            </button>
          )
        )}
      </RetroWindow>

      {lembarTka && (
        <LembarMapelTka
          awal={pilihan.map((p) => p.mapel)}
          onBatal={() => setLembarTka(false)}
          onSimpan={(m) => {
            const lama = new Map(pilihan.map((p) => [p.mapel, p.nilai]));
            ubah({ ...a, nilai_tka: { ...a.nilai_tka, pilihan: m.map((mapel) => ({ mapel, nilai: lama.get(mapel) ?? 0 })) } });
            setLembarTka(false);
          }}
        />
      )}
    </>
  );
}

/** Langkah 2 SNBP layar 2 (M11 `175:1016`): wilayah sekolah (otomatis dari NPSN) dan reputasi alumni. */
export function FormSnbpAlumni({ a, ubah, sekolah }: { a: AkademikSnbp; ubah: (a: AkademikSnbp) => void; sekolah: SekolahDetail | null }) {
  const [namaPtn, setNamaPtn] = useState<Record<number, string>>({});
  const [cari, setCari] = useState('');
  const [hasil, setHasil] = useState<{ id_ptn: number; nama_ptn: string }[]>([]);

  // Nama kampus alumni yang sudah tersimpan (mode ubah) diambil dari /api/prodi?id_ptn=.
  useEffect(() => {
    const kurang = a.kampus_alumni.filter((id) => !(id in namaPtn));
    if (!kurang.length) return;
    Promise.all(
      kurang.map((id) =>
        panggilApi<ResponsDaftarProdi>(`/api/prodi?id_ptn=${id}&per_halaman=1`).then((r) => [id, r.data[0]?.nama_ptn ?? `PTN ${id}`] as const),
      ),
    ).then((pasangan) => setNamaPtn((n) => ({ ...n, ...Object.fromEntries(pasangan) })));
  }, [a.kampus_alumni, namaPtn]);

  useEffect(() => {
    const q = cari.trim();
    if (q.length < 2) {
      setHasil([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const { data } = await panggilApi<ResponsDaftarProdi>(`/api/prodi?q=${encodeURIComponent(q)}&per_halaman=50`);
        const unik = new Map<number, string>();
        data.forEach((p: ProdiRingkas) => unik.set(p.id_ptn, p.nama_ptn));
        setHasil([...unik].map(([id_ptn, nama_ptn]) => ({ id_ptn, nama_ptn })).slice(0, 8));
      } catch {
        setHasil([]);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [cari]);

  return (
    <>
      <Stepper langkah={2} />
      <JudulWizard label="LANGKAH 2 · WILAYAH & ALUMNI" judul="Wilayah & reputasi alumni" />
      <RetroWindow title="Wilayah sekolah" variant="blue" contentClassName="flex flex-col gap-3.5 px-4 pt-4 pb-[18px]">
        <Isian label="Provinsi" value={sekolah?.provinsi ?? ''} placeholder="Terisi otomatis dari NPSN" readOnly />
        <Isian label="Kabupaten/Kota" value={sekolah?.kab_kota ?? ''} placeholder="Terisi otomatis dari NPSN" readOnly />
      </RetroWindow>
      <RetroWindow title="Reputasi alumni · self-report" variant="yellow" contentClassName="flex flex-col gap-3.5 px-4 pt-4 pb-[18px]">
        <div className="flex flex-col gap-1" role="radiogroup" aria-label="Reputasi alumni">
          {REPUTASI.map((r) => (
            <Opsi key={r.id} label={r.label} pilih={a.reputasi_alumni === r.id} onClick={() => ubah({ ...a, reputasi_alumni: r.id })} />
          ))}
        </div>
        <div className="flex flex-col gap-2.5">
          <p className="t-label-m text-ink">Kampus basis alumni</p>
          <label className="flex h-11 w-full items-center gap-2 border-2 border-ink bg-paper px-3">
            <img src="/figma/icon-search-16.svg" alt="" width={16} height={16} />
            <input
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              placeholder="Cari dari 146 PTN"
              aria-label="Cari kampus"
              className="min-w-0 flex-1 bg-transparent t-body-m text-ink outline-none placeholder:text-muted"
            />
          </label>
          {hasil.length > 0 && (
            <ul className="flex flex-col border-2 border-ink">
              {hasil.map((p) => (
                <li key={p.id_ptn}>
                  <button
                    type="button"
                    disabled={a.kampus_alumni.includes(p.id_ptn) || a.kampus_alumni.length >= 10}
                    onClick={() => {
                      setNamaPtn((n) => ({ ...n, [p.id_ptn]: p.nama_ptn }));
                      ubah({ ...a, kampus_alumni: [...a.kampus_alumni, p.id_ptn] });
                      setCari('');
                    }}
                    className="w-full px-3 py-2 text-left t-body-m text-ink hover:bg-canvas disabled:text-muted cursor-pointer"
                  >
                    {p.nama_ptn}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-2">
            {a.kampus_alumni.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => ubah({ ...a, kampus_alumni: a.kampus_alumni.filter((x) => x !== id) })}
                className="border-[1.5px] border-blue bg-blue-50 px-2.5 py-2 t-label-s uppercase text-blue-700 cursor-pointer"
              >
                {namaPtn[id] ?? '…'} ×
              </button>
            ))}
          </div>
        </div>
      </RetroWindow>
    </>
  );
}
