/** POST /api/peluang: rakit data DB + modul skoring T-04. */
import { galatTidakDitemukan } from '@/lib/api/galat';
import { validasiPeluang } from '@/lib/api/validasi';
import {
  buatPetaProvinsi,
  cekEligibilitas,
  labelKeketatan,
  peluangSnbp,
  peluangSnbt,
  validasiJalur,
  validasiProvinsiSnbp,
  type HasilPeluangSnbp,
  type HasilPeluangSnbt,
} from '@/lib/skoring';
import type { ProfilAkademik, ResponsPeluang } from '@/types';
import { ambilSerumpun, daftarMapel, hitungFallback, type FallbackProdi } from './prodi';
import type { BarisProdi, BarisSekolah, Repo } from './repo';
import { kuotaJurusan } from './sekolah';

/** Rerata maks 2 nilai tertinggi dari mapel pendukung prodi yang diisi siswa; null jika tidak ada. */
export function nilaiMapelPendukung(mapelProdi: string | null, nilai: Record<string, number> | undefined): number | null {
  if (!nilai) return null;
  const peta = new Map(Object.entries(nilai).map(([k, v]) => [k.trim().toLowerCase(), v]));
  const cocok = daftarMapel(mapelProdi)
    .map((m) => peta.get(m.toLowerCase()))
    .filter((v): v is number => typeof v === 'number')
    .sort((a, b) => b - a)
    .slice(0, 2);
  return cocok.length ? cocok.reduce((a, b) => a + b, 0) / cocok.length : null;
}

function snbpTidakDihitung(pesan: string, rasio: number | null, dataTerbatas: boolean): HasilPeluangSnbp {
  return {
    dihitung: false,
    peluang: null,
    rentang: null,
    label: null,
    label_keketatan: rasio == null ? null : labelKeketatan(rasio),
    alasan: [],
    estimasi: true,
    data_terbatas: dataTerbatas,
    pesan,
    rincian: { skor_akademik: null, persentil_kuota: null, skor_posisi: null, ambang: null },
  };
}

function snbtTidakDihitung(pesan: string, dataTerbatas: boolean): HasilPeluangSnbt {
  return { dihitung: false, peluang: null, rentang: null, label: null, estimasi: true, data_terbatas: dataTerbatas, peringatan_skala: true, pesan };
}

export function hitungSnbp(
  b: BarisProdi,
  fb: FallbackProdi,
  profil: ProfilAkademik,
  sekolah: BarisSekolah | null,
  bolehSnbp: { boleh: boolean; alasan: string | undefined },
): HasilPeluangSnbp {
  const rasio = b.rasio_terima_snbp_2025 ?? fb.rasio_snbp ?? null;
  const terbatas = b.rasio_terima_snbp_2025 == null && rasio != null;
  if (!bolehSnbp.boleh) return snbpTidakDihitung(bolehSnbp.alasan ?? 'Tidak memenuhi syarat SNBP.', rasio, terbatas);
  if (!b.ada_snbp) return snbpTidakDihitung('Prodi ini tidak membuka jalur SNBP.', rasio, terbatas);
  if (profil.rapor_rata == null) return snbpTidakDihitung('Isi rata-rata rapor untuk estimasi SNBP.', rasio, terbatas);
  if (profil.peringkat_paralel == null) return snbpTidakDihitung('Isi peringkat paralel untuk estimasi SNBP.', rasio, terbatas);
  return peluangSnbp({
    akademik: {
      rapor: profil.rapor_rata,
      mapel_pendukung: nilaiMapelPendukung(b.mapel_pendukung_snbp, profil.nilai_mapel_pendukung),
      prestasi: profil.prestasi_skor ?? null,
      tka: profil.nilai_tka ?? null,
    },
    eligibilitas: {
      peringkat_paralel: profil.peringkat_paralel,
      kuota_jurusan: sekolah ? kuotaJurusan(sekolah, profil.jurusan_sekolah) : null,
      akreditasi_sekolah: sekolah?.akreditasi ?? null,
      jumlah_siswa_jurusan: profil.jumlah_siswa_jurusan ?? null,
    },
    reputasi_alumni: profil.reputasi_alumni ?? null,
    ptn_di_kampus_alumni: (profil.kampus_alumni ?? []).includes(b.id_ptn),
    prodi: { rasio_terima: rasio, rasio_terima_rata3th: b.rasio_terima_snbp_rata3th, data_terbatas: terbatas },
  });
}

export function hitungSnbt(
  b: BarisProdi,
  fb: FallbackProdi,
  profil: ProfilAkademik,
  bolehSnbt: { boleh: boolean; alasan: string | undefined },
): HasilPeluangSnbt {
  const est = b.est_skor_utbk ?? fb.est_utbk ?? null;
  const terbatas = b.est_skor_utbk == null && est != null;
  if (!bolehSnbt.boleh) return snbtTidakDihitung(bolehSnbt.alasan ?? 'Tidak memenuhi syarat SNBT.', terbatas);
  if (!b.ada_snbt) return snbtTidakDihitung('Prodi ini tidak membuka jalur SNBT.', terbatas);
  if (profil.skor_to == null) return snbtTidakDihitung('Isi skor try out untuk estimasi SNBT.', terbatas);
  return peluangSnbt({
    skor_to: profil.skor_to,
    est_skor_utbk: est,
    est_skor_utbk_bawah: terbatas ? null : b.est_skor_utbk_bawah,
    est_skor_utbk_atas: terbatas ? null : b.est_skor_utbk_atas,
    data_terbatas: terbatas,
  });
}

export async function layananPeluang(badan: unknown, repo: Repo): Promise<ResponsPeluang> {
  const req = validasiPeluang(badan);
  const { profil } = req;

  const baris = await repo.prodiByIds(req.id_prodi);
  const perId = new Map(baris.map((b) => [b.id_prodi, b]));
  const hilang = req.id_prodi.filter((id) => !perId.has(id));
  if (hilang.length) throw galatTidakDitemukan(`Prodi tidak ditemukan: ${hilang.join(', ')}.`);
  const prodi = req.id_prodi.map((id) => perId.get(id)!);

  const pakaiSnbp = req.jalur !== 'snbt';
  const pakaiSnbt = req.jalur !== 'snbp';
  const jalur = validasiJalur({ tahun_lulus: profil.tahun_lulus, lulus_snbp_tahun: profil.lulus_snbp_tahun });
  const alasanSnbp = jalur.alasan.find((a) => a.includes('SNBP hanya'));
  const alasanSnbt = jalur.alasan.find((a) => a.includes('SNBT'));

  let sekolah: BarisSekolah | null = null;
  if (pakaiSnbp && profil.npsn) {
    sekolah = await repo.sekolahByNpsn(profil.npsn);
    if (!sekolah) throw galatTidakDitemukan(`Sekolah dengan NPSN ${profil.npsn} tidak ditemukan.`);
  }

  // Data di DB sudah memakai kode BPS kanonik, jadi crosswalk cukup identitas kode.
  let validasiProvinsi: ResponsPeluang['validasi_provinsi_snbp'] = null;
  if (pakaiSnbp && sekolah) {
    const pilihan = prodi.slice(0, 2).map((b) => ({ provinsi: b.kode_bps_ptn, provinsi_2: b.kode_bps_ptn_2 }));
    const kode = [sekolah.kode_bps, ...pilihan.flatMap((p) => [p.provinsi, p.provinsi_2 ?? ''])].filter(Boolean);
    const peta = buatPetaProvinsi(kode.map((k) => ({ nama_di_sumber: k, provinsi_kanonik: k })));
    validasiProvinsi = validasiProvinsiSnbp(sekolah.kode_bps, pilihan, peta);
  }

  const serumpun = await ambilSerumpun(prodi, repo);
  let kuota: { nilai: number | null; sumber: 'resmi' | 'perkiraan_akreditasi' | null } = { nilai: null, sumber: null };
  if (sekolah) {
    const e = cekEligibilitas({
      peringkat_paralel: profil.peringkat_paralel ?? 1,
      kuota_jurusan: kuotaJurusan(sekolah, profil.jurusan_sekolah),
      akreditasi_sekolah: sekolah.akreditasi,
      jumlah_siswa_jurusan: profil.jumlah_siswa_jurusan ?? null,
    });
    kuota = { nilai: e.kuota, sumber: e.sumber_kuota };
  }

  return {
    validasi_jalur: jalur,
    validasi_provinsi_snbp: validasiProvinsi,
    sekolah: sekolah && {
      npsn: sekolah.npsn,
      nama: sekolah.nama,
      akreditasi: sekolah.akreditasi,
      kuota_jurusan: kuota.nilai,
      sumber_kuota: kuota.sumber,
    },
    hasil: prodi.map((b) => {
      const fb = hitungFallback(b, serumpun);
      return {
        id_prodi: b.id_prodi,
        nama_prodi: b.nama,
        nama_ptn: b.nama_ptn,
        snbp: pakaiSnbp ? hitungSnbp(b, fb, profil, sekolah, { boleh: jalur.boleh_snbp, alasan: alasanSnbp }) : null,
        snbt: pakaiSnbt ? hitungSnbt(b, fb, profil, { boleh: jalur.boleh_snbt, alasan: alasanSnbt }) : null,
      };
    }),
    label_data: 'estimasi',
  };
}
