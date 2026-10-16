'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ResponsSekolah, SekolahDetail } from '@/types';
import { TopBar } from '@/components/ui/TopBar';
import BingkaiMobile from '@/components/ui/BingkaiMobile';
import { BarAksi } from '@/components/preferensi/BagianWizard';
import { AKADEMIK_KOSONG, FormSnbpAlumni, FormSnbpSekolah } from '@/components/preferensi/FormSnbp';
import { FormSnbt } from '@/components/preferensi/FormSnbt';
import { panggilApi, pesanGalat } from '@/lib/klien/api';
import { kirimDraf, useDraf } from '@/lib/klien/draf_preferensi';
import { kekuranganBahan } from '@/lib/layanan/kelengkapan';

/** Langkah 2 · Bahan jalur: SNBP = M10 (+M10b) lalu M11; SNBT = M12. Tombol terakhir menyimpan preferensi. */
export default function BahanJalurPage() {
  const router = useRouter();
  const { draf, ubahIsi } = useDraf();
  const [layar, setLayar] = useState<1 | 2>(1);
  const [sekolah, setSekolah] = useState<SekolahDetail | null>(null);
  const [sibuk, setSibuk] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);

  // Mode ubah: muat detail sekolah dari NPSN yang tersimpan.
  const npsn = draf?.isi.akademik?.npsn;
  useEffect(() => {
    if (!npsn || sekolah?.npsn === npsn) return;
    panggilApi<ResponsSekolah>(`/api/school?npsn=${npsn}`)
      .then(({ data }) => !Array.isArray(data) && setSekolah(data))
      .catch(() => undefined);
  }, [npsn, sekolah?.npsn]);

  if (!draf) return null;
  const snbp = draf.isi.jalur === 'snbp';
  const a = draf.isi.akademik ?? AKADEMIK_KOSONG;
  const ubahAkademik = (baru: typeof a) => ubahIsi((isi) => ({ ...isi, akademik: baru }));
  const pilihanTka = a.nilai_tka.pilihan?.length ?? 0;
  const terakhir = !snbp || layar === 2;
  // T-30: rapor, peringkat, dan sekolah (SNBP) atau nilai TO (SNBT) wajib sebelum lanjut / dicocokkan.
  const kurang = kekuranganBahan({ jalur: draf.isi.jalur, akademik: snbp ? a : null, riwayat_to: draf.isi.riwayat_to });

  const simpan = async () => {
    setSibuk(true);
    setGalat(null);
    try {
      await kirimDraf(draf);
      router.push('/cocokin');
    } catch (e) {
      setGalat(pesanGalat(e));
      setSibuk(false);
    }
  };

  const kembali = () => {
    if (snbp && layar === 2) {
      setLayar(1);
      window.scrollTo({ top: 0 });
    } else router.push('/preferensi/minat');
  };

  const lanjut = () => {
    if (!terakhir) {
      setLayar(2);
      window.scrollTo({ top: 0 });
    } else void simpan();
  };

  return (
    <BingkaiMobile>
      <TopBar title={draf.isi.nama} onBack={kembali} />
      <main className="flex flex-col gap-5 px-6 pt-6 pb-8">
        {snbp ? (
          layar === 1 ? (
            <FormSnbpSekolah a={a} ubah={ubahAkademik} sekolah={sekolah} setSekolah={setSekolah} />
          ) : (
            <FormSnbpAlumni a={a} ubah={ubahAkademik} sekolah={sekolah} />
          )
        ) : (
          <FormSnbt riwayat={draf.isi.riwayat_to} ubah={(r) => ubahIsi((isi) => ({ ...isi, riwayat_to: r }))} />
        )}
        {snbp && layar === 1 && pilihanTka === 1 && <p className="t-body-s font-bold text-red">Pilih tepat 2 mapel pilihan TKA.</p>}
        {kurang.length > 0 && (
          <div className="flex flex-col gap-1 border-[1.5px] border-yellow bg-yellow-50 p-3" role="status">
            <p className="t-body-s font-bold text-ink">Lengkapi dulu sebelum dicocokkan:</p>
            <ul className="list-disc pl-5 t-body-s text-ink-2">
              {kurang.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </div>
        )}
        {galat && <p className="t-body-s font-bold text-red">{galat}</p>}
      </main>
      <BarAksi
        onKembali={kembali}
        onLanjut={lanjut}
        label={terakhir ? 'Cocokkan!' : 'Lanjut'}
        nonaktif={kurang.length > 0 || (snbp && layar === 1 && (!sekolah || pilihanTka === 1))}
        sibuk={sibuk}
      />
    </BingkaiMobile>
  );
}
