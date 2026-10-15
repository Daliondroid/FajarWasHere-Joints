/** BR-10: skor minat RIASEC, kode Holland, dan kecocokan siswa–prodi. */
import { LABEL_KECOCOKAN, OPSI_HOBI, PARAM, type OpsiHobi } from './parameter';

export const SKALA = ['R', 'I', 'A', 'S', 'E', 'C'] as const;
export type Skala = (typeof SKALA)[number];
export type ProfilRiasec = Record<Skala, number>;

export interface ItemMinat {
  item_id: string;
  skala: Skala;
  mini_ip_30: boolean;
}

export type ModeMinat = 'mini_ip_30' | 'ipsf_60';

const nol = (): ProfilRiasec => ({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });

/** Skor per skala 1..7 (sebanding O*NET OI); null jika skala tanpa jawaban. */
export function skorMinat(
  jawaban: Record<string, number>,
  items: ItemMinat[],
  mode: ModeMinat = 'mini_ip_30',
): Record<Skala, number | null> {
  const tot = nol();
  const n = nol();
  for (const it of items) {
    if (mode === 'mini_ip_30' && !it.mini_ip_30) continue;
    const v = jawaban[it.item_id];
    if (typeof v !== 'number' || v < 0 || v > 4) continue;
    tot[it.skala] += v;
    n[it.skala] += 1;
  }
  const hasil = {} as Record<Skala, number | null>;
  for (const a of SKALA) hasil[a] = n[a] ? Math.round(((tot[a] / (4 * n[a])) * 6 + 1) * 100) / 100 : null;
  return hasil;
}

/** k skala tertinggi; seri diurutkan menurut urutan RIASEC. */
export function kodeHolland(profil: ProfilRiasec, k = 3): string {
  return [...SKALA].sort((a, b) => profil[b] - profil[a]).slice(0, k).join('');
}

/** Ada skor seri yang memengaruhi k huruf teratas (siswa perlu memilih, sesuai petunjuk O*NET). */
export function kodeHollandSeri(profil: ProfilRiasec, k = 3): boolean {
  const urut = SKALA.map((a) => profil[a]).sort((x, y) => y - x);
  return urut.slice(0, k).some((v, i) => urut[i + 1] === v);
}

/** Profil datar: selisih skor tertinggi dan terendah < batas (skala 1..7). */
export function profilDatar(profil: ProfilRiasec): boolean {
  const v = SKALA.map((a) => profil[a]);
  return Math.max(...v) - Math.min(...v) < PARAM.kecocokan.batas_profil_datar;
}

export function pearson(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length === 0) throw new Error('Panjang vektor harus sama dan > 0');
  const mx = x.reduce((a, b) => a + b, 0) / x.length;
  const my = y.reduce((a, b) => a + b, 0) / y.length;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < x.length; i++) {
    sxy += (x[i] - mx) * (y[i] - my);
    sxx += (x[i] - mx) ** 2;
    syy += (y[i] - my) ** 2;
  }
  return sxx === 0 || syy === 0 ? 0 : sxy / Math.sqrt(sxx * syy);
}

/** C-index Brown & Gore (1994), rentang 0..18. */
export function cIndex(kodeSiswa: string, kodeProdi: string): number {
  const jarak = (a: string, b: string) => {
    const ia = SKALA.indexOf(a as Skala);
    const ib = SKALA.indexOf(b as Skala);
    if (ia < 0 || ib < 0) throw new Error(`Huruf Holland tidak dikenal: ${a}${b}`);
    const k = Math.abs(ia - ib);
    return 3 - Math.min(k, 6 - k);
  };
  return [3, 2, 1].reduce(
    (s, w, i) => (kodeSiswa[i] && kodeProdi[i] ? s + w * jarak(kodeSiswa[i], kodeProdi[i]) : s),
    0,
  );
}

const keVektor = (p: ProfilRiasec) => SKALA.map((a) => p[a]);

/** Jumlah bobot RIASEC dari chip hobi terpilih. */
export function vektorHobi(idHobi: string[], opsi: OpsiHobi[] = OPSI_HOBI): ProfilRiasec {
  const v = nol();
  const terpilih = new Set(idHobi);
  for (const o of opsi) {
    if (!terpilih.has(o.id)) continue;
    for (const a of SKALA) v[a] += o.riasec[a] ?? 0;
  }
  return v;
}

/** Skor hobi 0..100 = (r_Pearson(vektor hobi, profil prodi) + 1) / 2 × 100; null jika tidak ada hobi. */
export function skorHobi(idHobi: string[], profilProdi: ProfilRiasec, opsi: OpsiHobi[] = OPSI_HOBI): number | null {
  const v = vektorHobi(idHobi, opsi);
  if (SKALA.every((a) => v[a] === 0)) return null;
  return ((pearson(keVektor(v), keVektor(profilProdi)) + 1) / 2) * 100;
}

export function labelKecocokan(skor: number): string {
  const urut = [...LABEL_KECOCOKAN].sort((a, b) => b.min - a.min);
  return (urut.find((l) => skor >= l.min) ?? urut[urut.length - 1]).label;
}

export interface HasilKecocokan {
  skor: number;
  label: string;
  skor_profil: number;
  skor_hobi: number | null;
}

/** Kecocokan = 0,8 × skor profil + 0,2 × skor hobi; tanpa hobi = skor profil saja. */
export function kecocokan(
  profilSiswa: ProfilRiasec,
  profilProdi: ProfilRiasec,
  skorHobiSiswa?: number | null,
): HasilKecocokan {
  const skorProfil = ((pearson(keVektor(profilSiswa), keVektor(profilProdi)) + 1) / 2) * 100;
  const { bobot_profil, bobot_hobi } = PARAM.kecocokan;
  const skor = skorHobiSiswa == null ? skorProfil : bobot_profil * skorProfil + bobot_hobi * skorHobiSiswa;
  const bulat = Math.round(skor * 10) / 10;
  return { skor: bulat, label: labelKecocokan(bulat), skor_profil: skorProfil, skor_hobi: skorHobiSiswa ?? null };
}
