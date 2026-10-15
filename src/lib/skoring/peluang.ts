/** Bagian bersama peluang SNBP & SNBT: logistik, rentang, label (BR-07). */
import { PARAM } from './parameter';

export type LabelPeluang = 'rendah' | 'sedang' | 'tinggi';

export const batas = (x: number, min: number, maks: number) => Math.min(maks, Math.max(min, x));

/** Peluang 0..100 dari selisih skor terhadap ambang. */
export function logistik(selisih: number, sebaran: number): number {
  return 100 / (1 + Math.exp((-PARAM.peluang.kemiringan * selisih) / sebaran));
}

export function labelPeluang(p: number): LabelPeluang {
  if (p >= PARAM.peluang.label.tinggi_min) return 'tinggi';
  if (p >= PARAM.peluang.label.sedang_min) return 'sedang';
  return 'rendah';
}

/** Rentang dibulatkan ke kelipatan `pembulatan_rentang`, dijamin min < maks dan di 0..100. */
export function rentang(bawah: number, atas: number): [number, number] {
  const k = PARAM.peluang.pembulatan_rentang;
  let min = batas(Math.floor(bawah / k) * k, 0, 100);
  let maks = batas(Math.ceil(atas / k) * k, 0, 100);
  if (maks - min < k) {
    if (min + k <= 100) maks = min + k;
    else min = maks - k;
  }
  return [min, maks];
}

export function rentangDariTitik(p: number): [number, number] {
  const h = PARAM.peluang.setengah_rentang;
  return rentang(p - h, p + h);
}

/** Format rasio 0..1 sebagai persen Indonesia, mis. 0.195 -> "19,5%". */
export const persen = (r: number) => `${(r * 100).toFixed(1).replace('.', ',')}%`;
