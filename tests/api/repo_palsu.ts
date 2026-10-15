/** Repo palsu dalam memori untuk test layanan API. */
import type { BarisProdi, BarisSekolah, Repo } from '@/lib/layanan/repo';
import type { ItemMinat, Skala } from '@/lib/skoring';

export function prodi(sebagian: Partial<BarisProdi> & { id_prodi: number }): BarisProdi {
  return {
    id_ptn: 1,
    nama: `PRODI ${sebagian.id_prodi}`,
    jenjang: 'S1',
    rumpun_id: 'teknik',
    rumpun: 'Teknik',
    kelompok: 'saintek',
    klaster_id: 1,
    nama_ptn: 'UNIVERSITAS CONTOH',
    provinsi_ptn: 'Jawa Timur',
    kode_bps_ptn: '35',
    kode_bps_ptn_2: null,
    r: 5, i: 6, a: 2, s: 2, e: 2, c: 5,
    kode_holland: 'IRC',
    mapel_pendukung_snbp: 'Fisika; Matematika Tingkat Lanjut',
    portofolio: null,
    is_baru: false,
    ada_snbp: true,
    ada_snbt: true,
    dt_snbp_2026: 50,
    peminat_snbp_2025: 500,
    diterima_snbp_2025: 100,
    rasio_terima_snbp_2025: 0.2,
    rasio_terima_snbp_rata3th: 0.18,
    dt_snbt_2026: 60,
    dt_snbt_2025: 60,
    peminat_snbt_2025: 600,
    est_skor_utbk: 600,
    est_skor_utbk_bawah: 570,
    est_skor_utbk_atas: 630,
    metode_est_utbk: 'regresi_keketatan',
    ...sebagian,
  };
}

export const SEKOLAH: BarisSekolah = {
  npsn: '20500001',
  nama: 'SMAN 1 CONTOH',
  jenis: 'SMA',
  akreditasi: 'A',
  persen_kuota: 0.4,
  kuota_siswa: 80,
  jurusan_kuota: { MIPA: '40', 'Ilmu Pengetahuan Sosial': 40 },
  kab_kota: 'Kota Surabaya',
  provinsi: 'Jawa Timur',
  kode_bps: '35',
};

/** 5 item per skala, semua mini_ip_30 (id: R1..R5, I1..I5, ...). */
export const ITEM: ItemMinat[] = (['R', 'I', 'A', 'S', 'E', 'C'] as Skala[]).flatMap((s) =>
  [1, 2, 3, 4, 5].map((n) => ({ item_id: `${s}${n}`, skala: s, mini_ip_30: true })),
);

/** Jawaban dengan nilai per skala, mis. {R: 3, I: 4, ...}. */
export const jawaban = (per: Record<Skala, number>) =>
  Object.fromEntries(ITEM.map((it) => [it.item_id, per[it.skala]]));

export function repoPalsu(daftar: BarisProdi[], sekolah: BarisSekolah[] = [SEKOLAH]): Repo {
  return {
    sekolahByNpsn: async (npsn) => sekolah.find((s) => s.npsn === npsn) ?? null,
    cariSekolah: async (q, batas) => sekolah.filter((s) => s.nama.toLowerCase().includes(q.toLowerCase())).slice(0, batas),
    daftarProdi: async (_k, offset, limit) => ({ baris: daftar.slice(offset, offset + limit), total: daftar.length }),
    prodiByIds: async (ids) => daftar.filter((p) => ids.includes(p.id_prodi)),
    prodiSerumpun: async (idPtn, rumpun) => daftar.filter((p) => idPtn.includes(p.id_ptn) && rumpun.includes(p.rumpun_id)),
    semuaProdi: async () => daftar,
    detailTambahan: async () => ({ statistik: [], pddikti: null, profil: null }),
    semuaPtn: async () => [
      { id_ptn: 1, nama: 'UNIVERSITAS CONTOH' },
      { id_ptn: 2, nama: 'UNIVERSITAS INDONESIA' },
      { id_ptn: 3, nama: 'UNIVERSITAS GADJAH MADA' },
    ],
    aliasPencarian: async () => [
      { alias: 'UI', jenis: 'ptn', arti: 'UNIVERSITAS INDONESIA' },
      { alias: 'TI', jenis: 'prodi', arti: 'Teknik Informatika / Teknologi Informasi' },
      { alias: 'ITX', jenis: 'ptn', arti: 'INSTITUT YANG TIDAK ADA' },
    ],
    itemMinat: async () => ITEM,
  };
}
