/** GET /api/prodi dan GET /api/prodi/[id_prodi] */
import { galatTidakDitemukan, galatValidasi } from '@/lib/api/galat';
import { validasiQueryProdi } from '@/lib/api/validasi';
import { labelKeketatan, rasioSnbt, rataRumpunPtn } from '@/lib/skoring';
import type { EstimasiUtbk, FilterProdi, Keketatan, ProdiDetail, ProdiRingkas, ResponsDaftarProdi } from '@/types';
import type { BarisAlias, BarisProdi, BarisPtn, KueriProdi, Repo } from './repo';

/** Mapel pendukung dari kolom "Biologi; Kimia". */
export const daftarMapel = (s: string | null) => (s ?? '').split(';').map((m) => m.trim()).filter(Boolean);

/**
 * Urai teks pencarian: token yang cocok alias PTN jadi pembatas PTN, alias prodi diganti artinya,
 * sisa teks dicari di nama prodi atau nama PTN.
 */
const AWALAN_PTN = [
  'universitas islam negeri ',
  'universitas ',
  'institut teknologi ',
  'institut ',
  'politeknik negeri ',
  'politeknik ',
  'sekolah tinggi ',
];
/** Inti nama PTN satu kata yang terlalu umum untuk dikenali dari teks bebas. */
const INTI_UMUM = new Set(['indonesia', 'pendidikan', 'teknologi', 'negeri', 'islam', 'terbuka', 'kesehatan', 'pertanian', 'maritim', 'nasional', 'sains', 'seni', 'budaya']);
const KATA_GENERIK = /\b(universitas|univ|institut|politeknik|kampus|di)\b/g;

const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Kenali nama PTN yang ditulis di teks bebas ("Kedokteran Hewan Universitas Syiah Kuala", "Teknik Sipil Gadjah Mada").
 * Mengembalikan id PTN dan sisa teks (dipakai sebagai nama prodi).
 */
export function pisahkanNamaPtn(teks: string, ptn: BarisPtn[]): { id_ptn: number[]; sisa: string } {
  let sisa = ` ${teks.toLowerCase()} `;
  const id: number[] = [];
  const kandidat = ptn.flatMap((p) => {
    const penuh = p.nama.toLowerCase().replace(/\s+/g, ' ').trim();
    const awalan = AWALAN_PTN.find((a) => penuh.startsWith(a));
    const inti = awalan ? penuh.slice(awalan.length) : penuh;
    const intiLayak = inti.split(' ').length >= 2 || (inti.length >= 6 && !INTI_UMUM.has(inti));
    return [penuh, ...(intiLayak && inti !== penuh ? [inti] : [])].map((frasa) => ({ frasa, id_ptn: p.id_ptn }));
  });
  // Frasa terpanjang dulu agar nama lengkap menang atas intinya.
  for (const k of kandidat.sort((a, b) => b.frasa.length - a.frasa.length)) {
    const pola = new RegExp(`\\b${esc(k.frasa)}\\b`);
    if (pola.test(sisa)) {
      id.push(k.id_ptn);
      sisa = sisa.replace(pola, ' ');
    }
  }
  return { id_ptn: [...new Set(id)], sisa: id.length ? sisa.replace(KATA_GENERIK, ' ').replace(/\s+/g, ' ').trim() : teks.trim() };
}

export function uraiKueri(q: string | undefined, alias: BarisAlias[], ptn: BarisPtn[]) {
  const peta = new Map(alias.map((a) => [a.alias.toLowerCase(), a]));
  const teksProdi: string[] = [];
  const ptnAlias: string[] = [];
  const sisa: string[] = [];
  for (const token of (q ?? '').trim().split(/\s+/).filter(Boolean)) {
    const a = peta.get(token.toLowerCase());
    if (a?.jenis === 'ptn') ptnAlias.push(a.arti);
    else if (a?.jenis === 'prodi') teksProdi.push(...a.arti.split('/').map((t) => t.trim()).filter(Boolean));
    else sisa.push(token);
  }
  // Nama PTN yang ditulis lengkap/sebagian di teks bebas diperlakukan seperti alias PTN.
  const dariTeks = sisa.length ? pisahkanNamaPtn(sisa.join(' '), ptn) : { id_ptn: [], sisa: '' };
  const bebas = dariTeks.sisa;
  if (bebas) teksProdi.push(bebas);
  const cocokPtn = (teks: string) =>
    ptn.filter((p) => p.nama.toLowerCase().includes(teks.toLowerCase())).map((p) => p.id_ptn);
  return {
    teks_prodi: teksProdi,
    id_ptn_teks: bebas && !dariTeks.id_ptn.length ? cocokPtn(bebas) : [],
    id_ptn_alias: [...new Set([...ptnAlias.flatMap(cocokPtn), ...dariTeks.id_ptn])],
    ada_alias_ptn: ptnAlias.length > 0 || dariTeks.id_ptn.length > 0,
  };
}

function keketatanSnbp(b: BarisProdi, fallback?: number | null): Keketatan | null {
  const rasio = b.rasio_terima_snbp_2025 ?? fallback ?? null;
  if (rasio == null) return null;
  return { rasio, label: labelKeketatan(rasio), tahun: 2025, data_terbatas: b.rasio_terima_snbp_2025 == null, label_data: 'resmi' };
}

function keketatanSnbt(b: BarisProdi): Keketatan | null {
  const rasio = rasioSnbt(b.dt_snbt_2025, b.peminat_snbt_2025);
  if (rasio == null) return null;
  return { rasio, label: labelKeketatan(rasio), tahun: 2025, data_terbatas: false, label_data: 'resmi' };
}

function estimasiUtbk(b: BarisProdi, fallback?: number | null): EstimasiUtbk | null {
  if (b.est_skor_utbk != null) {
    return { nilai: b.est_skor_utbk, bawah: b.est_skor_utbk_bawah, atas: b.est_skor_utbk_atas, metode: b.metode_est_utbk, label_data: 'estimasi' };
  }
  if (fallback == null) return null;
  return { nilai: Math.round(fallback), bawah: null, atas: null, metode: 'rata_rumpun_ptn', label_data: 'estimasi' };
}

export interface FallbackProdi {
  rasio_snbp?: number | null;
  est_utbk?: number | null;
}

export function keRingkas(b: BarisProdi, fb: FallbackProdi = {}): ProdiRingkas {
  return {
    id_prodi: b.id_prodi,
    nama_prodi: b.nama,
    jenjang: b.jenjang,
    id_ptn: b.id_ptn,
    nama_ptn: b.nama_ptn,
    provinsi_ptn: b.provinsi_ptn,
    rumpun_id: b.rumpun_id,
    rumpun: b.rumpun,
    kelompok: b.kelompok,
    klaster_id: b.klaster_id,
    kode_holland: b.kode_holland,
    portofolio: b.portofolio,
    is_baru: b.is_baru,
    ada_snbp: b.ada_snbp,
    ada_snbt: b.ada_snbt,
    daya_tampung_snbp_2026: b.dt_snbp_2026,
    daya_tampung_snbt_2026: b.dt_snbt_2026,
    keketatan_snbp: b.ada_snbp ? keketatanSnbp(b, fb.rasio_snbp) : null,
    keketatan_snbt: b.ada_snbt ? keketatanSnbt(b) : null,
    est_skor_utbk: b.ada_snbt ? estimasiUtbk(b, fb.est_utbk) : null,
  };
}

/** Nilai fallback BR-08 untuk prodi tanpa histori, dari daftar prodi serumpun. */
export function hitungFallback(b: BarisProdi, serumpun: BarisProdi[]): FallbackProdi {
  return {
    rasio_snbp: b.rasio_terima_snbp_2025 == null ? rataRumpunPtn(keRumpun(b), serumpun.map(keRumpunBaris), (p) => p.baris.rasio_terima_snbp_2025)?.nilai : undefined,
    est_utbk: b.est_skor_utbk == null ? rataRumpunPtn(keRumpun(b), serumpun.map(keRumpunBaris), (p) => p.baris.est_skor_utbk)?.nilai : undefined,
  };
}

const keRumpun = (b: BarisProdi) => ({ id_prodi: String(b.id_prodi), id_ptn: String(b.id_ptn), rumpun_id: b.rumpun_id });
const keRumpunBaris = (b: BarisProdi) => ({ ...keRumpun(b), baris: b });

/** Ambil prodi serumpun hanya bila ada prodi yang butuh fallback. */
export async function ambilSerumpun(daftar: BarisProdi[], repo: Repo): Promise<BarisProdi[]> {
  const perlu = daftar.filter((b) => b.rasio_terima_snbp_2025 == null || b.est_skor_utbk == null);
  if (perlu.length === 0) return [];
  return repo.prodiSerumpun([...new Set(perlu.map((b) => b.id_ptn))], [...new Set(perlu.map((b) => b.rumpun_id))]);
}

/** id rumpun yang namanya mengandung salah satu teks pencarian (min. 4 huruf). */
export function rumpunCocok(teks: string[], rumpun: Map<string, string>): string[] {
  const kunci = teks.map((t) => t.trim().toLowerCase()).filter((t) => t.length >= 4);
  return [...rumpun].filter(([, nama]) => kunci.some((t) => nama.toLowerCase().includes(t))).map(([id]) => id);
}

export async function layananDaftarProdi(sp: URLSearchParams, repo: Repo): Promise<ResponsDaftarProdi> {
  const { filter, halaman, per_halaman } = validasiQueryProdi(sp);
  const kueri = await bangunKueri(filter, repo);
  if (kueri === null) return { data: [], total: 0, halaman, per_halaman };
  const offset = (halaman - 1) * per_halaman;
  // Cocokkan nama prodi dulu; nama rumpun hanya cadangan bila tidak ada yang cocok (mis. "Kedokteran Hewan" -> "PENDIDIKAN DOKTER HEWAN").
  let hasil = await repo.daftarProdi({ ...kueri, rumpun_teks: [] }, offset, per_halaman);
  if (hasil.total === 0 && kueri.rumpun_teks.length) hasil = await repo.daftarProdi(kueri, offset, per_halaman);
  return { data: hasil.baris.map((b) => keRingkas(b)), total: hasil.total, halaman, per_halaman };
}

/** null = alias PTN dikenali tetapi tidak ada PTN yang cocok (hasil pasti kosong). */
async function bangunKueri(filter: FilterProdi, repo: Repo): Promise<KueriProdi | null> {
  const { q, ...sisa } = filter;
  if (!q) return { ...sisa, teks_prodi: [], id_ptn_teks: [], id_ptn_alias: [], rumpun_teks: [] };
  const [alias, ptn, semua] = await Promise.all([repo.aliasPencarian(), repo.semuaPtn(), repo.semuaProdi()]);
  const u = uraiKueri(q, alias, ptn);
  if (u.ada_alias_ptn && u.id_ptn_alias.length === 0) return null;
  const rumpun = new Map(semua.map((b) => [b.rumpun_id, b.rumpun]));
  return {
    ...sisa,
    teks_prodi: u.teks_prodi,
    id_ptn_teks: u.id_ptn_teks,
    id_ptn_alias: u.id_ptn_alias,
    rumpun_teks: rumpunCocok(u.teks_prodi, rumpun),
  };
}

export async function layananDetailProdi(idTeks: string, repo: Repo): Promise<{ data: ProdiDetail }> {
  if (!/^\d{1,9}$/.test(idTeks)) throw galatValidasi('id_prodi harus angka.');
  const id = Number(idTeks);
  const [b] = await repo.prodiByIds([id]);
  if (!b) throw galatTidakDitemukan(`Prodi ${id} tidak ditemukan.`);
  const [serumpun, tambahan] = await Promise.all([ambilSerumpun([b], repo), repo.detailTambahan(id)]);
  return {
    data: {
      ...keRingkas(b, hitungFallback(b, serumpun)),
      riasec: { R: b.r, I: b.i, A: b.a, S: b.s, E: b.e, C: b.c },
      mapel_pendukung_snbp: daftarMapel(b.mapel_pendukung_snbp),
      rasio_terima_snbp_rata3th: b.rasio_terima_snbp_rata3th,
      statistik: tambahan.statistik,
      pddikti: tambahan.pddikti && { ...tambahan.pddikti, label_data: 'resmi' },
      profil: tambahan.profil && { ...tambahan.profil, label_data: 'resmi' },
    },
  };
}
