/**
 * GET /api/rekomendasi: 3 kartu (Dream Goal, Safety Net serumpun, Alternatif) + data popup DETAIL
 * dari preferensi aktif (T-19; F-08, K-07, K-10, BR-01, BR-16). Semua angka dari mesin deterministik.
 */
import { galatTidakLogin } from '@/lib/api/galat';
import {
  ATURAN,
  buatPetaProvinsi,
  rasioSnbt,
  skorPrestasi,
  validasiJalur,
  validasiProvinsiSnbp,
  type HasilPeluangSnbp,
  type HasilPeluangSnbt,
} from '@/lib/skoring';
import type { HasilKecocokanProdi, KartuRekomendasi, PreferensiDetail, ProfilAkademik, ResponsRekomendasi } from '@/types';
import { peringkatProdi } from './kecocokan';
import { hitungSnbp, hitungSnbt } from './peluang';
import { hitungFallback, keRingkas } from './prodi';
import type { BarisProdi, BarisSekolah, Repo } from './repo';
import type { RepoAkun } from './repo_akun';
import { skorToTerbaru } from './preferensi';

type Peluang = HasilPeluangSnbp | HasilPeluangSnbt;

/** Profil untuk mesin peluang, disusun dari preferensi tersimpan. */
export function profilDariPreferensi(p: PreferensiDetail, tahunAcuan: number = ATURAN.tahun_acuan): ProfilAkademik {
  const a = p.akademik;
  return {
    tahun_lulus: p.kelulusan.tahun_lulus ?? tahunAcuan,
    lulus_snbp_tahun: p.kelulusan.pernah_lulus_snbp ? tahunAcuan : null,
    npsn: a?.npsn ?? undefined,
    jurusan_sekolah: a?.jurusan_sekolah ?? undefined,
    peringkat_paralel: a?.peringkat_paralel ?? undefined,
    jumlah_siswa_jurusan: a?.jumlah_siswa_jurusan ?? undefined,
    rapor_rata: a?.rapor_rata ?? undefined,
    nilai_mapel_pendukung: a?.nilai_mapel_pendukung,
    prestasi_skor: a ? skorPrestasi(a.prestasi) : undefined,
    nilai_tka: a?.nilai_tka,
    reputasi_alumni: a?.reputasi_alumni ?? null,
    kampus_alumni: a?.kampus_alumni ?? [],
    skor_to: p.skor_to_terbaru ?? undefined,
  };
}

/** Rasio keterimaan (makin kecil makin ketat); null bila tidak ada data, termasuk fallback rumpun. */
export function rasioKeketatan(b: BarisProdi, jalur: 'snbp' | 'snbt', semua: BarisProdi[]): number | null {
  if (jalur === 'snbp') return b.rasio_terima_snbp_2025 ?? hitungFallback(b, semua).rasio_snbp ?? null;
  return rasioSnbt(b.dt_snbt_2025, b.peminat_snbt_2025);
}

const diProvinsi = (b: BarisProdi, kodeBps: string) => b.kode_bps_ptn === kodeBps || b.kode_bps_ptn_2 === kodeBps;
const nilaiPeluang = (p: Peluang | null) => (p?.dihitung && p.peluang !== null ? p.peluang : null);

interface KartuTerpilih {
  jenis: KartuRekomendasi['jenis'];
  b: BarisProdi;
  peluang: Peluang;
}

export interface KonteksRekomendasi {
  pref: PreferensiDetail;
  semuaProdi: BarisProdi[];
  sekolah: BarisSekolah | null;
}

/** Inti pemilihan kartu (murni). */
export function pilihKartu(k: KonteksRekomendasi) {
  const { pref, semuaProdi, sekolah } = k;
  const jalur = pref.jalur;
  const profil = profilDariPreferensi(pref);
  const syarat = validasiJalur({ tahun_lulus: profil.tahun_lulus, lulus_snbp_tahun: profil.lulus_snbp_tahun });

  const kandidat = semuaProdi.filter((b) => (jalur === 'snbp' ? b.ada_snbp : b.ada_snbt));
  const perId = new Map(kandidat.map((b) => [b.id_prodi, b]));
  const peringkat = peringkatProdi(pref.skor_riasec, pref.kode_holland, pref.minat.chip_hobi, pref.minat.mapel_favorit, kandidat);
  const kecocokanPerId = new Map(peringkat.map((h) => [h.id_prodi, h]));

  const cachePeluang = new Map<number, Peluang>();
  const peluang = (b: BarisProdi): Peluang => {
    let p = cachePeluang.get(b.id_prodi);
    if (!p) {
      const fb = hitungFallback(b, semuaProdi);
      p =
        jalur === 'snbp'
          ? hitungSnbp(b, fb, profil, sekolah, { boleh: syarat.boleh_snbp, alasan: syarat.alasan.find((x) => x.includes('SNBP hanya')) })
          : hitungSnbt(b, fb, profil, { boleh: syarat.boleh_snbt, alasan: syarat.alasan.find((x) => x.includes('SNBT')) });
      cachePeluang.set(b.id_prodi, p);
    }
    return p;
  };
  const rasio = (b: BarisProdi) => rasioKeketatan(b, jalur, semuaProdi);

  /** Di antara skor seri teratas, pilih dengan pembanding `lebihBaik`. */
  const terbaikDariSeri = (daftar: HasilKecocokanProdi[], lebihBaik: (a: BarisProdi, b: BarisProdi) => number) => {
    if (!daftar.length) return null;
    const puncak = daftar[0].skor;
    const seri = daftar.filter((h) => h.skor === puncak).map((h) => perId.get(h.id_prodi)!);
    return [...seri].sort(lebihBaik)[0] ?? null;
  };

  // #1 Dream Goal: seri -> paling ketat (rasio terkecil; tanpa data dianggap paling longgar).
  const dream = terbaikDariSeri(peringkat, (a, b) => (rasio(a) ?? 1) - (rasio(b) ?? 1));
  if (!dream) return { profil, kartu: [] as KartuTerpilih[], catatan: [], validasi: null, kecocokanPerId };

  // #2 Safety Net: serumpun, peluang tertinggi; SNBP + PTN #1 di luar provinsi -> wajib di provinsi sekolah.
  let serumpun = kandidat.filter((b) => b.rumpun_id === dream.rumpun_id && b.id_prodi !== dream.id_prodi);
  const catatan: string[] = [];
  if (jalur === 'snbp' && sekolah && !diProvinsi(dream, sekolah.kode_bps)) {
    const lokal = serumpun.filter((b) => diProvinsi(b, sekolah.kode_bps));
    if (lokal.length) serumpun = lokal;
    else catatan.push('Tidak ada prodi serumpun di provinsi sekolah; pasangan Dream Goal + Safety Net melanggar aturan satu provinsi SNBP.');
  }
  const urutAman = (a: BarisProdi, b: BarisProdi) => {
    const pa = nilaiPeluang(peluang(a));
    const pb = nilaiPeluang(peluang(b));
    if (pa !== null || pb !== null) return (pb ?? -1) - (pa ?? -1) || kecocokanPerId.get(b.id_prodi)!.skor - kecocokanPerId.get(a.id_prodi)!.skor;
    return (rasio(b) ?? 0) - (rasio(a) ?? 0) || kecocokanPerId.get(b.id_prodi)!.skor - kecocokanPerId.get(a.id_prodi)!.skor;
  };
  const safety = [...serumpun].sort(urutAman)[0] ?? null;

  // #3 Alternatif: rumpun lain, kecocokan tertinggi; seri -> paling aman.
  const alternatif = terbaikDariSeri(
    peringkat.filter((h) => perId.get(h.id_prodi)!.rumpun_id !== dream.rumpun_id),
    urutAman,
  );

  const kartu: KartuTerpilih[] = [
    { jenis: 'dream_goal' as const, b: dream },
    ...(safety ? [{ jenis: 'safety_net' as const, b: safety }] : []),
    ...(alternatif ? [{ jenis: 'alternatif' as const, b: alternatif }] : []),
  ].map((x) => ({ ...x, peluang: peluang(x.b) }));

  if (kartu.some((x) => !x.peluang.dihitung)) {
    catatan.push(
      jalur === 'snbp'
        ? 'Lengkapi rapor, peringkat paralel, dan sekolah agar peluang SNBP bisa dihitung.'
        : 'Tambahkan skor try out agar peluang SNBT bisa dihitung.',
    );
  }

  let validasi: ReturnType<typeof validasiProvinsiSnbp> | null = null;
  if (jalur === 'snbp' && sekolah && safety) {
    const pilihan = [dream, safety].map((b) => ({ provinsi: b.kode_bps_ptn, provinsi_2: b.kode_bps_ptn_2 }));
    const kode = [sekolah.kode_bps, ...pilihan.flatMap((p) => [p.provinsi, p.provinsi_2 ?? ''])].filter(Boolean);
    validasi = validasiProvinsiSnbp(sekolah.kode_bps, pilihan, buatPetaProvinsi(kode.map((x) => ({ nama_di_sumber: x, provinsi_kanonik: x }))));
  }
  return { profil, kartu, catatan: [...new Set(catatan)], validasi, kecocokanPerId };
}

export async function layananRekomendasi(idSesi: string | null, deps: { repo: Repo; repoAkun: RepoAkun }): Promise<ResponsRekomendasi> {
  const { repo, repoAkun } = deps;
  if (!idSesi || !(await repoAkun.ambilPengguna(idSesi))) throw galatTidakLogin();
  const idAktif = await repoAkun.idPreferensiAktif(idSesi);
  if (!idAktif) return { data: null };
  const mentah = await repoAkun.ambilPreferensi(idSesi, idAktif);
  if (!mentah) return { data: null };
  const pref: PreferensiDetail = { ...mentah, skor_to_terbaru: skorToTerbaru(mentah.riwayat_to) };

  const [semuaProdi, sekolah] = await Promise.all([
    repo.semuaProdi(),
    pref.jalur === 'snbp' && pref.akademik?.npsn ? repo.sekolahByNpsn(pref.akademik.npsn) : Promise.resolve(null),
  ]);
  const hasil = pilihKartu({ pref, semuaProdi, sekolah });
  const tambahan = await Promise.all(hasil.kartu.map((x) => repo.detailTambahan(x.b.id_prodi)));

  return {
    data: {
      preferensi: { id: pref.id, nama: pref.nama, jalur: pref.jalur },
      kode_holland: pref.kode_holland,
      kartu: hasil.kartu.map((x, i): KartuRekomendasi => {
        const ringkas = keRingkas(x.b, hitungFallback(x.b, semuaProdi));
        const k = hasil.kecocokanPerId.get(x.b.id_prodi)!;
        return {
          peringkat: (i + 1) as 1 | 2 | 3,
          jenis: x.jenis,
          prodi: {
            id_prodi: x.b.id_prodi,
            nama_prodi: x.b.nama,
            id_ptn: x.b.id_ptn,
            nama_ptn: x.b.nama_ptn,
            provinsi_ptn: x.b.provinsi_ptn,
            jenjang: x.b.jenjang,
            kelompok: x.b.kelompok,
            rumpun_id: x.b.rumpun_id,
            rumpun: x.b.rumpun,
          },
          kecocokan: { skor: k.skor, label: k.label },
          detail: {
            kode_holland: x.b.kode_holland,
            keketatan_snbp: ringkas.keketatan_snbp,
            keketatan_snbt: ringkas.keketatan_snbt,
            peluang_snbp: pref.jalur === 'snbp' ? (x.peluang as HasilPeluangSnbp) : null,
            peluang_snbt: pref.jalur === 'snbt' ? (x.peluang as HasilPeluangSnbt) : null,
            pddikti: tambahan[i].pddikti && { ...tambahan[i].pddikti!, label_data: 'resmi' },
          },
        };
      }),
      validasi_provinsi_snbp: hasil.validasi,
      catatan: hasil.catatan,
    },
  };
}
