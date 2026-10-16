/**
 * Alat (function calling) chatbot. Setiap alat memanggil layanan internal yang sama dengan API,
 * jadi angka yang disebut chatbot selalu dari mesin deterministik (BR-12). Hasil diringkas agar hemat token.
 */
import { ApiGalat } from '@/lib/api/galat';
import { layananPeluang } from '@/lib/layanan/peluang';
import { skorToTerbaru } from '@/lib/layanan/preferensi';
import { layananDaftarProdi, layananDetailProdi } from '@/lib/layanan/prodi';
import { layananRekomendasi, profilDariPreferensi } from '@/lib/layanan/rekomendasi';
import type { Repo } from '@/lib/layanan/repo';
import type { RepoAkun } from '@/lib/layanan/repo_akun';
import type { Keketatan, PreferensiDetail } from '@/types';
import type { DeklarasiAlat } from './model';

export interface KonteksAlat {
  penggunaId: string;
  repo: Repo;
  repoAkun: RepoAkun;
}

export const DEKLARASI_ALAT: DeklarasiAlat[] = [
  {
    nama: 'preferensi_aktif',
    deskripsi: 'Ringkasan preferensi aktif siswa: nama, jalur (SNBP/SNBT), kode Holland, skor RIASEC, ketersediaan data akademik/try out.',
    parameter: { type: 'object', properties: {} },
  },
  {
    nama: 'rekomendasi_saya',
    deskripsi: 'Tiga rekomendasi prodi dari preferensi aktif (Dream Goal, Safety Net serumpun, Alternatif) beserta kecocokan, keketatan, dan estimasi peluang.',
    parameter: { type: 'object', properties: {} },
  },
  {
    nama: 'cari_prodi',
    deskripsi: 'Cari prodi berdasarkan nama prodi dan/atau kampus (mendukung singkatan seperti "TI ITB", "FK UI"). Mengembalikan id_prodi untuk alat lain.',
    parameter: {
      type: 'object',
      properties: {
        kata_kunci: { type: 'string', description: 'Nama prodi/kampus atau singkatannya.' },
        jenjang: { type: 'string', enum: ['S1', 'D4', 'D3'] },
      },
      required: ['kata_kunci'],
    },
  },
  {
    nama: 'detail_prodi',
    deskripsi: 'Data resmi satu prodi: daya tampung 2026, keketatan SNBP/SNBT, estimasi skor UTBK, akreditasi & data PDDikti, mapel pendukung, portofolio.',
    parameter: { type: 'object', properties: { id_prodi: { type: 'integer' } }, required: ['id_prodi'] },
  },
  {
    nama: 'peluang_saya',
    deskripsi: 'Estimasi peluang siswa (memakai preferensi aktif dan jalurnya) untuk 1–4 prodi. Hasil berupa rentang, label, dan alasan.',
    parameter: {
      type: 'object',
      properties: { id_prodi: { type: 'array', items: { type: 'integer' }, minItems: 1, maxItems: 4 } },
      required: ['id_prodi'],
    },
  },
];

const keketatan = (k: Keketatan | null) => k && { rasio_persen: Math.round(k.rasio * 1000) / 10, label: k.label.replace('_', ' ') };

async function preferensiAktif(k: KonteksAlat): Promise<PreferensiDetail | null> {
  const id = await k.repoAkun.idPreferensiAktif(k.penggunaId);
  const p = id ? await k.repoAkun.ambilPreferensi(k.penggunaId, id) : null;
  return p && { ...p, skor_to_terbaru: skorToTerbaru(p.riwayat_to) };
}

const TIDAK_ADA_PREF = { tersedia: false, pesan: 'Siswa belum punya preferensi. Sarankan mengisi Preferensi dulu.' };

async function jalankanMentah(nama: string, argumen: Record<string, unknown>, k: KonteksAlat): Promise<unknown> {
  switch (nama) {
    case 'preferensi_aktif': {
      const p = await preferensiAktif(k);
      if (!p) return TIDAK_ADA_PREF;
      return {
        tersedia: true,
        nama: p.nama,
        jalur: p.jalur.toUpperCase(),
        kode_holland: p.kode_holland,
        skor_riasec: p.skor_riasec,
        mapel_favorit: p.minat.mapel_favorit,
        ada_data_akademik_snbp: !!p.akademik?.rapor_rata,
        skor_to_terbaru: p.skor_to_terbaru,
      };
    }
    case 'rekomendasi_saya': {
      const { data } = await layananRekomendasi(k.penggunaId, { repo: k.repo, repoAkun: k.repoAkun });
      if (!data) return TIDAK_ADA_PREF;
      return {
        preferensi: data.preferensi.nama,
        jalur: data.preferensi.jalur.toUpperCase(),
        kartu: data.kartu.map((c) => {
          const pel = c.detail.peluang_snbp ?? c.detail.peluang_snbt;
          return {
            peringkat: c.peringkat,
            jenis: c.jenis,
            id_prodi: c.prodi.id_prodi,
            prodi: c.prodi.nama_prodi,
            kampus: c.prodi.nama_ptn,
            provinsi: c.prodi.provinsi_ptn,
            kecocokan_persen: c.kecocokan.skor,
            label_kecocokan: c.kecocokan.label,
            keketatan: keketatan(c.detail.keketatan_snbp ?? c.detail.keketatan_snbt),
            peluang: pel?.dihitung ? { rentang_persen: pel.rentang, label: pel.label, estimasi: true } : { dihitung: false, pesan: pel?.pesan },
          };
        }),
        catatan: data.catatan,
      };
    }
    case 'cari_prodi': {
      const sp = new URLSearchParams({ q: String(argumen.kata_kunci ?? ''), per_halaman: '8' });
      if (typeof argumen.jenjang === 'string') sp.set('jenjang', argumen.jenjang);
      const { data, total } = await layananDaftarProdi(sp, k.repo);
      return {
        total,
        hasil: data.map((p) => ({
          id_prodi: p.id_prodi,
          prodi: p.nama_prodi,
          kampus: p.nama_ptn,
          provinsi: p.provinsi_ptn,
          jenjang: p.jenjang,
          keketatan_snbp: keketatan(p.keketatan_snbp),
          keketatan_snbt: keketatan(p.keketatan_snbt),
        })),
      };
    }
    case 'detail_prodi': {
      const { data: p } = await layananDetailProdi(String(argumen.id_prodi ?? ''), k.repo);
      return {
        id_prodi: p.id_prodi,
        prodi: p.nama_prodi,
        kampus: p.nama_ptn,
        provinsi: p.provinsi_ptn,
        jenjang: p.jenjang,
        rumpun: p.rumpun,
        kode_holland: p.kode_holland,
        daya_tampung_2026: { snbp: p.daya_tampung_snbp_2026, snbt: p.daya_tampung_snbt_2026 },
        keketatan_snbp_2025: keketatan(p.keketatan_snbp),
        keketatan_snbt_2025: keketatan(p.keketatan_snbt),
        estimasi_skor_utbk: p.est_skor_utbk && { nilai: p.est_skor_utbk.nilai, bawah: p.est_skor_utbk.bawah, atas: p.est_skor_utbk.atas, estimasi: true },
        mapel_pendukung_snbp: p.mapel_pendukung_snbp,
        portofolio_wajib: p.portofolio,
        pddikti: p.pddikti && {
          akreditasi: p.pddikti.akreditasi,
          rasio_dosen_mahasiswa: p.pddikti.rasio_dosen_mhs,
          rata_masa_studi_tahun: p.pddikti.rata_masa_studi_th,
        },
      };
    }
    case 'peluang_saya': {
      const p = await preferensiAktif(k);
      if (!p) return TIDAK_ADA_PREF;
      const ids = (Array.isArray(argumen.id_prodi) ? argumen.id_prodi : [argumen.id_prodi]).map(Number).slice(0, 4);
      const profil = profilDariPreferensi(p);
      // Satu permintaan per prodi: SNBP dibatasi 2 prodi per permintaan, dan tiap prodi dinilai sendiri-sendiri.
      const hasil = await Promise.all(
        ids.map(async (id) => {
          const r = await layananPeluang({ jalur: p.jalur, id_prodi: [id], profil }, k.repo);
          const h = r.hasil[0];
          const pel = h.snbp ?? h.snbt;
          return {
            id_prodi: h.id_prodi,
            prodi: h.nama_prodi,
            kampus: h.nama_ptn,
            peluang: pel?.dihitung
              ? { rentang_persen: pel.rentang, label: pel.label, alasan: 'alasan' in pel ? pel.alasan : [], estimasi: true }
              : { dihitung: false, pesan: pel?.pesan },
          };
        }),
      );
      return { jalur: p.jalur.toUpperCase(), preferensi: p.nama, hasil };
    }
    default:
      return { galat: `Alat ${nama} tidak dikenal.` };
  }
}

/** Jalankan satu alat; galat layanan dikembalikan sebagai data agar model bisa menjelaskannya. */
export async function jalankanAlat(nama: string, argumen: Record<string, unknown>, k: KonteksAlat): Promise<unknown> {
  try {
    return await jalankanMentah(nama, argumen, k);
  } catch (e) {
    if (e instanceof ApiGalat) return { galat: e.message };
    throw e;
  }
}
