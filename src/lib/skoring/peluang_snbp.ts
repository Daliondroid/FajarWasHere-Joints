/** BR-05, BR-06, BR-07: skor akademik dan estimasi peluang SNBP. */
import { KOMPONEN_KEDUA_MAKS, PARAM, W1_MIN } from './parameter';
import { cekEligibilitas, type InputEligibilitas } from './eligibilitas';
import { labelKeketatan, type LabelKeketatan } from './keketatan';
import { batas, labelPeluang, logistik, persen, rentangDariTitik, type LabelPeluang } from './peluang';

export type MapelTka = keyof typeof PARAM.tka.rerata_nasional;
export type NilaiTka = Partial<Record<MapelTka, number>>;

const angka = (x: number) => x.toFixed(1).replace('.', ',');

/** Rerata z nilai TKA terhadap rerata nasional; null jika tidak ada nilai. Dibatasi ±batas_z. */
export function zTka(nilai: NilaiTka | null | undefined): number | null {
  if (!nilai) return null;
  const { rerata_nasional, simpangan_baku, batas_z } = PARAM.tka;
  const z = (Object.keys(rerata_nasional) as MapelTka[])
    .filter((m) => typeof nilai[m] === 'number')
    .map((m) => ((nilai[m] as number) - rerata_nasional[m]) / simpangan_baku);
  if (z.length === 0) return null;
  return batas(z.reduce((a, b) => a + b, 0) / z.length, -batas_z, batas_z);
}

export interface BobotAkademik {
  w1_rapor: number;
  w2_mapel_pendukung: number;
  w3_prestasi: number;
}

/** Tolak bobot yang melanggar aturan resmi: w1 >= 0,5 dan w2 + w3 <= 0,5. */
export function validasiBobot(b: BobotAkademik): void {
  const eps = 1e-9;
  if (b.w1_rapor < W1_MIN - eps) throw new Error(`w1 harus >= ${W1_MIN}`);
  if (b.w2_mapel_pendukung + b.w3_prestasi > KOMPONEN_KEDUA_MAKS + eps) {
    throw new Error(`w2 + w3 harus <= ${KOMPONEN_KEDUA_MAKS}`);
  }
  if (Math.abs(b.w1_rapor + b.w2_mapel_pendukung + b.w3_prestasi - 1) > 1e-6) throw new Error('Jumlah bobot harus 1');
}

export interface InputAkademik {
  /** Rerata rapor semester 1–5, skala 0–100. */
  rapor: number;
  /** Rerata nilai maks 2 mapel pendukung prodi, 0–100. Kosong = pakai rapor. */
  mapel_pendukung?: number | null;
  /** Skor prestasi 0–100 (tabel bobot tim). Kosong = 0. */
  prestasi?: number | null;
  tka?: NilaiTka | null;
}

export interface HasilAkademik {
  skor: number;
  rapor_terkoreksi: number;
  z_tka: number | null;
}

export function skorAkademik(input: InputAkademik, bobot: BobotAkademik = PARAM.skor_akademik): HasilAkademik {
  validasiBobot(bobot);
  const z = zTka(input.tka);
  const raporTerkoreksi = batas(input.rapor + (z === null ? 0 : PARAM.tka.k * z), 0, 100);
  const mapel = batas(input.mapel_pendukung ?? input.rapor, 0, 100);
  const prestasi = batas(input.prestasi ?? 0, 0, 100);
  const skor = bobot.w1_rapor * raporTerkoreksi + bobot.w2_mapel_pendukung * mapel + bobot.w3_prestasi * prestasi;
  return { skor: batas(skor, 0, 100), rapor_terkoreksi: raporTerkoreksi, z_tka: z };
}

/** Persentil posisi di kuota eligible: peringkat 1 = 100, peringkat terakhir dalam kuota > 0. */
export function persentilKuota(peringkat: number, kuota: number): number {
  if (kuota <= 0) return 0;
  return batas((100 * (kuota - peringkat + 1)) / kuota, 0, 100);
}

export type StatusAlumni = 'diterima' | 'tidak_daftar_ulang' | null;

/** BR-06: penyesuaian akreditasi sekolah dan alumni self-report, masing-masing maks ±batas. */
export function penyesuaianPosisi(akreditasi: string | null | undefined, alumni: StatusAlumni) {
  const p = PARAM.posisi_siswa;
  const kunci = (akreditasi ?? '').trim().toUpperCase();
  const akr = (p.penyesuaian_akreditasi as Record<string, number>)[kunci] ?? p.penyesuaian_akreditasi.lainnya;
  const alm = alumni ? p.penyesuaian_alumni[alumni] : 0;
  return {
    akreditasi: batas(akr, -p.batas_penyesuaian, p.batas_penyesuaian),
    alumni: batas(alm, -p.batas_penyesuaian, p.batas_penyesuaian),
  };
}

export interface ProdiSnbp {
  /** Rasio diterima ÷ peminat 2025 (atau fallback rumpun, BR-08). */
  rasio_terima: number | null;
  rasio_terima_rata3th?: number | null;
  /** true jika rasio berasal dari fallback rumpun (BR-08). */
  data_terbatas?: boolean;
}

export interface InputPeluangSnbp {
  akademik: InputAkademik;
  eligibilitas: InputEligibilitas;
  alumni?: StatusAlumni;
  prodi: ProdiSnbp;
}

export interface HasilPeluangSnbp {
  dihitung: boolean;
  peluang: number | null;
  rentang: [number, number] | null;
  label: LabelPeluang | null;
  label_keketatan: LabelKeketatan | null;
  alasan: string[];
  estimasi: true;
  data_terbatas: boolean;
  pesan: string | null;
  rincian: {
    /** null jika peluang tidak dihitung karena data siswa belum lengkap. */
    skor_akademik: number | null;
    persentil_kuota: number | null;
    skor_posisi: number | null;
    ambang: number | null;
  };
}

export function peluangSnbp(input: InputPeluangSnbp): HasilPeluangSnbp {
  const akad = skorAkademik(input.akademik);
  const elig = cekEligibilitas(input.eligibilitas);
  const r = input.prodi.rasio_terima;
  const dataTerbatas = !!input.prodi.data_terbatas;

  const tidakDihitung = (pesan: string | null, alasan: string[]): HasilPeluangSnbp => ({
    dihitung: false,
    peluang: null,
    rentang: null,
    label: null,
    label_keketatan: r == null ? null : labelKeketatan(r),
    alasan,
    estimasi: true,
    data_terbatas: dataTerbatas,
    pesan,
    rincian: { skor_akademik: akad.skor, persentil_kuota: null, skor_posisi: null, ambang: null },
  });

  if (elig.eligible !== true || elig.kuota === null) {
    const alasan =
      elig.eligible === false
        ? [`Peringkat paralel ${input.eligibilitas.peringkat_paralel} di luar kuota eligible ${elig.kuota} siswa.`]
        : [];
    return tidakDihitung(elig.pesan, alasan);
  }
  if (r == null) return tidakDihitung('Data keketatan prodi belum tersedia.', []);

  const p = PARAM.posisi_siswa;
  const persentil = persentilKuota(input.eligibilitas.peringkat_paralel, elig.kuota);
  const adj = penyesuaianPosisi(input.eligibilitas.akreditasi_sekolah, input.alumni ?? null);
  const posisi = batas(
    p.bobot_skor_akademik * akad.skor + p.bobot_persentil_kuota * persentil + adj.akreditasi + adj.alumni,
    0,
    100,
  );
  const ambang = 100 * (1 - r);
  const peluang = logistik(posisi - ambang, PARAM.peluang.sebaran_snbp);
  const lk = labelKeketatan(r);

  const rata3 = input.prodi.rasio_terima_rata3th;
  const catatanKuota = elig.sumber_kuota === 'perkiraan_akreditasi' ? ', kuota diperkirakan dari akreditasi' : '';
  const catatanRata3 = rata3 != null ? ` (rata-rata 3 tahun ${persen(rata3)})` : '';
  const catatanTerbatas = dataTerbatas ? ', data terbatas (rata-rata rumpun di PTN yang sama)' : '';
  const catatanTka = akad.z_tka !== null ? ` (rapor dikoreksi TKA menjadi ${angka(akad.rapor_terkoreksi)})` : '';
  const alasan = [
    `Peringkat paralel ${input.eligibilitas.peringkat_paralel} dari kuota eligible ${elig.kuota} siswa (persentil ${Math.round(persentil)})${catatanKuota}.`,
    `Rasio diterima prodi ${persen(r)}${catatanRata3}, tergolong ${lk.replace('_', ' ')}${catatanTerbatas}.`,
    `Skor akademik ${angka(akad.skor)}${catatanTka}.`,
  ];

  return {
    dihitung: true,
    peluang: Math.round(peluang * 10) / 10,
    rentang: rentangDariTitik(peluang),
    label: labelPeluang(peluang),
    label_keketatan: lk,
    alasan,
    estimasi: true,
    data_terbatas: dataTerbatas,
    pesan: elig.pesan,
    rincian: { skor_akademik: akad.skor, persentil_kuota: persentil, skor_posisi: posisi, ambang },
  };
}
