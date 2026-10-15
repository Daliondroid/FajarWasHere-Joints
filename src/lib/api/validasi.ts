/** Validasi input API (tanpa dependency). Setiap fungsi melempar galat VALIDASI berbahasa Indonesia. */
import type {
  FilterProdi,
  JenjangProdi,
  PermintaanJawabTestDrive,
  PermintaanKecocokan,
  PermintaanPeluang,
  PermintaanRefleksiTestDrive,
  PreferensiPengguna,
  RefleksiTestDrive,
  ProfilAkademik,
  RumpunIlmu,
} from '@/types';
import { galatValidasi } from './galat';

const JENJANG: JenjangProdi[] = ['S1', 'D4', 'D3'];
const KELOMPOK: RumpunIlmu[] = ['saintek', 'soshum'];
const MAPEL_TKA = ['bahasa_indonesia', 'matematika', 'bahasa_inggris'] as const;

const isObjek = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

function angka(v: unknown, nama: string, min: number, maks: number, bulat = false): number {
  const n = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
  if (typeof n !== 'number' || !Number.isFinite(n) || n < min || n > maks || (bulat && !Number.isInteger(n))) {
    throw galatValidasi(`${nama} harus ${bulat ? 'bilangan bulat' : 'angka'} ${min}–${maks}.`);
  }
  return n;
}

function opsional<T>(v: unknown, f: (v: unknown) => T): T | undefined {
  return v === undefined || v === null || v === '' ? undefined : f(v);
}

function pilihan<T extends string>(v: unknown, nama: string, daftar: readonly T[]): T {
  if (typeof v !== 'string' || !daftar.includes(v as T)) throw galatValidasi(`${nama} harus salah satu: ${daftar.join(', ')}.`);
  return v as T;
}

function teks(v: unknown, nama: string, maks = 100): string {
  if (typeof v !== 'string' || v.trim() === '' || v.length > maks) throw galatValidasi(`${nama} harus teks 1–${maks} karakter.`);
  return v.trim();
}

function daftarAngka(v: unknown, nama: string, min: number, maks: number): number[] {
  if (!Array.isArray(v) || v.length < min || v.length > maks) throw galatValidasi(`${nama} harus berisi ${min}–${maks} item.`);
  const hasil = v.map((x, i) => angka(x, `${nama}[${i}]`, 1, 2_147_483_647, true));
  if (new Set(hasil).size !== hasil.length) throw galatValidasi(`${nama} tidak boleh berisi duplikat.`);
  return hasil;
}

function daftarTeks(v: unknown, nama: string, maks: number): string[] {
  if (!Array.isArray(v) || v.length > maks) throw galatValidasi(`${nama} harus daftar maks ${maks} item.`);
  return v.map((x, i) => teks(x, `${nama}[${i}]`));
}

export function validasiNpsn(v: unknown): string {
  if (typeof v !== 'string' || !/^\d{8}$/.test(v.trim())) throw galatValidasi('NPSN harus 8 digit angka.');
  return v.trim();
}

/** Query string -> FilterProdi + paginasi. */
export function validasiQueryProdi(sp: URLSearchParams): { filter: FilterProdi; halaman: number; per_halaman: number } {
  const g = (k: string) => sp.get(k) ?? undefined;
  const portofolio = g('portofolio');
  if (portofolio !== undefined && portofolio !== 'true' && portofolio !== 'false') {
    throw galatValidasi('portofolio harus true atau false.');
  }
  const filter: FilterProdi = {
    q: opsional(g('q'), (v) => teks(v, 'q')),
    rumpun_id: opsional(g('rumpun_id'), (v) => teks(v, 'rumpun_id')),
    jenjang: opsional(g('jenjang'), (v) => pilihan(v, 'jenjang', JENJANG)),
    kelompok: opsional(g('kelompok'), (v) => pilihan(v, 'kelompok', KELOMPOK)),
    klaster_id: opsional(g('klaster_id'), (v) => angka(v, 'klaster_id', 1, 99, true)),
    kode_bps: opsional(g('kode_bps'), (v) => teks(v, 'kode_bps', 4)),
    id_ptn: opsional(g('id_ptn'), (v) => angka(v, 'id_ptn', 1, 2_147_483_647, true)),
    portofolio: portofolio === undefined ? undefined : portofolio === 'true',
  };
  return {
    filter,
    halaman: opsional(g('halaman'), (v) => angka(v, 'halaman', 1, 10_000, true)) ?? 1,
    per_halaman: opsional(g('per_halaman'), (v) => angka(v, 'per_halaman', 1, 50, true)) ?? 20,
  };
}

function validasiProfil(v: unknown): ProfilAkademik {
  if (!isObjek(v)) throw galatValidasi('profil wajib diisi.');
  let nilaiMapel: Record<string, number> | undefined;
  if (v.nilai_mapel_pendukung !== undefined && v.nilai_mapel_pendukung !== null) {
    if (!isObjek(v.nilai_mapel_pendukung)) throw galatValidasi('nilai_mapel_pendukung harus objek {mapel: nilai}.');
    nilaiMapel = Object.fromEntries(
      Object.entries(v.nilai_mapel_pendukung).map(([k, n]) => [k, angka(n, `nilai_mapel_pendukung.${k}`, 0, 100)]),
    );
  }
  let tka: ProfilAkademik['nilai_tka'];
  if (v.nilai_tka !== undefined && v.nilai_tka !== null) {
    if (!isObjek(v.nilai_tka)) throw galatValidasi('nilai_tka harus objek.');
    tka = {};
    for (const m of MAPEL_TKA) {
      const n = opsional(v.nilai_tka[m], (x) => angka(x, `nilai_tka.${m}`, 0, 100));
      if (n !== undefined) tka[m] = n;
    }
  }
  return {
    tahun_lulus: angka(v.tahun_lulus, 'tahun_lulus', 2000, 2100, true),
    lulus_snbp_tahun: opsional(v.lulus_snbp_tahun, (x) => angka(x, 'lulus_snbp_tahun', 2000, 2100, true)) ?? null,
    npsn: opsional(v.npsn, validasiNpsn),
    jurusan_sekolah: opsional(v.jurusan_sekolah, (x) => teks(x, 'jurusan_sekolah')),
    peringkat_paralel: opsional(v.peringkat_paralel, (x) => angka(x, 'peringkat_paralel', 1, 10_000, true)),
    jumlah_siswa_jurusan: opsional(v.jumlah_siswa_jurusan, (x) => angka(x, 'jumlah_siswa_jurusan', 1, 10_000, true)),
    rapor_rata: opsional(v.rapor_rata, (x) => angka(x, 'rapor_rata', 0, 100)),
    nilai_mapel_pendukung: nilaiMapel,
    prestasi_skor: opsional(v.prestasi_skor, (x) => angka(x, 'prestasi_skor', 0, 100)),
    nilai_tka: tka,
    alumni: opsional(v.alumni, (x) => pilihan(x, 'alumni', ['diterima', 'tidak_daftar_ulang'] as const)) ?? null,
    skor_to: opsional(v.skor_to, (x) => angka(x, 'skor_to', 0, 1000)),
  };
}

export function validasiPeluang(v: unknown): PermintaanPeluang {
  if (!isObjek(v)) throw galatValidasi('Badan request harus objek.');
  const jalur = pilihan(v.jalur, 'jalur', ['snbp', 'snbt', 'keduanya'] as const);
  const id_prodi = daftarAngka(v.id_prodi, 'id_prodi', 1, jalur === 'snbp' ? 2 : 4);
  return { jalur, id_prodi, profil: validasiProfil(v.profil) };
}

export function validasiKecocokan(v: unknown): PermintaanKecocokan {
  if (!isObjek(v)) throw galatValidasi('Badan request harus objek.');
  if (!isObjek(v.jawaban_minat)) throw galatValidasi('jawaban_minat wajib berupa objek {item_id: 0..4}.');
  const jawaban = Object.fromEntries(
    Object.entries(v.jawaban_minat).map(([k, n]) => [k, angka(n, `jawaban_minat.${k}`, 0, 4, true)]),
  );
  let filter: PermintaanKecocokan['filter'];
  if (v.filter !== undefined && v.filter !== null) {
    if (!isObjek(v.filter)) throw galatValidasi('filter harus objek.');
    const f = v.filter;
    filter = {
      rumpun_id: opsional(f.rumpun_id, (x) => teks(x, 'filter.rumpun_id')),
      jenjang: opsional(f.jenjang, (x) => pilihan(x, 'filter.jenjang', JENJANG)),
      kelompok: opsional(f.kelompok, (x) => pilihan(x, 'filter.kelompok', KELOMPOK)),
      klaster_id: opsional(f.klaster_id, (x) => angka(x, 'filter.klaster_id', 1, 99, true)),
      kode_bps: opsional(f.kode_bps, (x) => teks(x, 'filter.kode_bps', 4)),
      id_ptn: opsional(f.id_ptn, (x) => angka(x, 'filter.id_ptn', 1, 2_147_483_647, true)),
      id_prodi: opsional(f.id_prodi, (x) => daftarAngka(x, 'filter.id_prodi', 1, 500)),
    };
  }
  return {
    jawaban_minat: jawaban,
    mode: opsional(v.mode, (x) => pilihan(x, 'mode', ['mini_ip_30', 'ipsf_60'] as const)) ?? 'mini_ip_30',
    chip_hobi: opsional(v.chip_hobi, (x) => daftarTeks(x, 'chip_hobi', 30)) ?? [],
    mapel_favorit: opsional(v.mapel_favorit, (x) => daftarTeks(x, 'mapel_favorit', 3)) ?? [],
    filter,
    batas: opsional(v.batas, (x) => angka(x, 'batas', 1, 100, true)) ?? 20,
    refleksi: opsional(v.refleksi, validasiPetaRefleksi),
  };
}

const REPUTASI = ['langganan_ptn_top', 'rutin_lolos', 'satu_lima_per_tahun', 'sekolah_baru'] as const;

function boolean(v: unknown, nama: string): boolean {
  if (typeof v !== 'boolean') throw galatValidasi(`${nama} harus true atau false.`);
  return v;
}

function nilaiPerMapel(v: unknown, nama: string): Record<string, number> {
  if (v === undefined || v === null) return {};
  if (!isObjek(v) || Object.keys(v).length > 20) throw galatValidasi(`${nama} harus objek {mapel: nilai}, maks 20 mapel.`);
  return Object.fromEntries(Object.entries(v).map(([k, n]) => [teks(k, `${nama} (nama mapel)`), angka(n, `${nama}.${k}`, 0, 100)]));
}

/** PUT /api/preferensi. Kelengkapan skala RIASEC dicek di layanan (butuh daftar item). */
export function validasiPreferensi(v: unknown): PreferensiPengguna {
  if (!isObjek(v)) throw galatValidasi('Badan request harus objek.');
  const { minat, jalur, akademik } = v;
  if (!isObjek(minat)) throw galatValidasi('minat wajib diisi.');
  if (!isObjek(jalur)) throw galatValidasi('jalur wajib diisi.');
  if (!isObjek(minat.jawaban_minat)) throw galatValidasi('minat.jawaban_minat wajib berupa objek {item_id: 0..4}.');

  let ak: PreferensiPengguna['akademik'] = null;
  if (akademik !== undefined && akademik !== null) {
    if (!isObjek(akademik)) throw galatValidasi('akademik harus objek atau null.');
    let tka: NonNullable<PreferensiPengguna['akademik']>['nilai_tka'] = {};
    if (akademik.nilai_tka !== undefined && akademik.nilai_tka !== null) {
      if (!isObjek(akademik.nilai_tka)) throw galatValidasi('akademik.nilai_tka harus objek.');
      tka = {};
      for (const m of MAPEL_TKA) {
        const n = opsional(akademik.nilai_tka[m], (x) => angka(x, `nilai_tka.${m}`, 0, 100));
        if (n !== undefined) tka[m] = n;
      }
    }
    const prestasi = akademik.prestasi ?? [];
    if (!Array.isArray(prestasi) || prestasi.length > 3) throw galatValidasi('akademik.prestasi harus daftar maks 3 item.');
    ak = {
      npsn: opsional(akademik.npsn, validasiNpsn) ?? null,
      jurusan_sekolah: opsional(akademik.jurusan_sekolah, (x) => teks(x, 'jurusan_sekolah')) ?? null,
      rapor_rata: opsional(akademik.rapor_rata, (x) => angka(x, 'rapor_rata', 0, 100)) ?? null,
      nilai_mapel_pendukung: nilaiPerMapel(akademik.nilai_mapel_pendukung, 'nilai_mapel_pendukung'),
      peringkat_paralel: opsional(akademik.peringkat_paralel, (x) => angka(x, 'peringkat_paralel', 1, 10_000, true)) ?? null,
      jumlah_siswa_jurusan:
        opsional(akademik.jumlah_siswa_jurusan, (x) => angka(x, 'jumlah_siswa_jurusan', 1, 10_000, true)) ?? null,
      nilai_tka: tka,
      prestasi: prestasi.map((p, i) => {
        if (!isObjek(p)) throw galatValidasi(`prestasi[${i}] harus objek.`);
        return {
          tingkat: teks(p.tingkat, `prestasi[${i}].tingkat`, 50),
          bidang: teks(p.bidang, `prestasi[${i}].bidang`),
          peringkat: teks(p.peringkat, `prestasi[${i}].peringkat`, 50),
        };
      }),
      reputasi_alumni: opsional(akademik.reputasi_alumni, (x) => pilihan(x, 'reputasi_alumni', REPUTASI)) ?? null,
      kampus_alumni: opsional(akademik.kampus_alumni, (x) => daftarAngka(x, 'kampus_alumni', 0, 10)) ?? [],
      alumni_tidak_daftar_ulang:
        opsional(akademik.alumni_tidak_daftar_ulang, (x) =>
          pilihan(x, 'alumni_tidak_daftar_ulang', ['tidak_tahu', 'pernah'] as const),
        ) ?? null,
    };
  }

  return {
    minat: {
      mode: opsional(minat.mode, (x) => pilihan(x, 'minat.mode', ['mini_ip_30', 'ipsf_60'] as const)) ?? 'mini_ip_30',
      jawaban_minat: Object.fromEntries(
        Object.entries(minat.jawaban_minat).map(([k, n]) => [k, angka(n, `jawaban_minat.${k}`, 0, 4, true)]),
      ),
      chip_hobi: opsional(minat.chip_hobi, (x) => daftarTeks(x, 'minat.chip_hobi', 30)) ?? [],
      mapel_favorit: opsional(minat.mapel_favorit, (x) => daftarTeks(x, 'minat.mapel_favorit', 3)) ?? [],
    },
    jalur: {
      ikut_snbp: boolean(jalur.ikut_snbp, 'jalur.ikut_snbp'),
      ikut_snbt: boolean(jalur.ikut_snbt, 'jalur.ikut_snbt'),
      tahun_lulus: opsional(jalur.tahun_lulus, (x) => angka(x, 'jalur.tahun_lulus', 2000, 2100, true)) ?? null,
      pernah_lulus_snbp: opsional(jalur.pernah_lulus_snbp, (x) => boolean(x, 'jalur.pernah_lulus_snbp')) ?? false,
    },
    akademik: ak,
  };
}

const REFLEKSI = ['seru', 'melelahkan'] as const;
const OPSI = ['A', 'B', 'C', 'D'] as const;

export function validasiIdProdi(v: unknown): number {
  return angka(v, 'id_prodi', 1, 2_147_483_647, true);
}

export function validasiJawabTestDrive(v: unknown): PermintaanJawabTestDrive {
  if (!isObjek(v)) throw galatValidasi('Badan request harus objek.');
  return {
    id_prodi: validasiIdProdi(v.id_prodi),
    id_soal: teks(v.id_soal, 'id_soal'),
    jawaban: pilihan(v.jawaban, 'jawaban', OPSI),
  };
}

export function validasiRefleksi(v: unknown): PermintaanRefleksiTestDrive {
  if (!isObjek(v)) throw galatValidasi('Badan request harus objek.');
  return { id_prodi: validasiIdProdi(v.id_prodi), refleksi: pilihan(v.refleksi, 'refleksi', REFLEKSI) };
}

/** {"361036": "seru"} -> sama, dengan kunci id_prodi angka; maks 500 entri. */
export function validasiPetaRefleksi(v: unknown): Record<string, RefleksiTestDrive> {
  if (!isObjek(v) || Object.keys(v).length > 500) throw galatValidasi('refleksi harus objek {id_prodi: seru|melelahkan}, maks 500.');
  return Object.fromEntries(
    Object.entries(v).map(([k, r]) => {
      if (!/^\d{1,9}$/.test(k)) throw galatValidasi(`refleksi: kunci ${k} harus id_prodi angka.`);
      return [k, pilihan(r, `refleksi.${k}`, REFLEKSI)];
    }),
  );
}
