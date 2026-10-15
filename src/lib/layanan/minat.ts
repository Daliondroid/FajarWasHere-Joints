/** Hitung profil RIASEC dari jawaban kuis; dipakai /api/kecocokan dan /api/preferensi. */
import { galatValidasi } from '@/lib/api/galat';
import { kodeHolland, OPSI_HOBI, SKALA, skorMinat, type ItemMinat, type ModeMinat, type ProfilRiasec } from '@/lib/skoring';

/** Validasi item & chip hobi, lalu hitung skor 1..7. Skala tanpa jawaban -> galat VALIDASI. */
export function hitungProfilMinat(
  jawaban: Record<string, number>,
  mode: ModeMinat,
  chipHobi: string[],
  items: ItemMinat[],
): { profil: ProfilRiasec; kode: string } {
  const idItem = new Set(items.map((it) => it.item_id));
  const asing = Object.keys(jawaban).filter((k) => !idItem.has(k));
  if (asing.length) throw galatValidasi(`item_id tidak dikenal: ${asing.slice(0, 5).join(', ')}.`);
  const idHobi = new Set(OPSI_HOBI.map((o) => o.id));
  const hobiAsing = chipHobi.filter((h) => !idHobi.has(h));
  if (hobiAsing.length) throw galatValidasi(`chip_hobi tidak dikenal: ${hobiAsing.join(', ')}.`);

  const skor = skorMinat(jawaban, items, mode);
  const kosong = SKALA.filter((s) => skor[s] === null);
  if (kosong.length) throw galatValidasi(`Setiap skala RIASEC butuh minimal 1 jawaban (kosong: ${kosong.join(', ')}).`);
  const profil = skor as ProfilRiasec;
  return { profil, kode: kodeHolland(profil) };
}
