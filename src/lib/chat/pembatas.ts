/** Pembatas laju pesan per pengguna (melindungi kuota Gemini). Status di memori per instance server. */

export const BATAS_PESAN = 20;
export const JENDELA_MS = 5 * 60 * 1000;

export class PembatasLaju {
  private readonly catatan = new Map<string, number[]>();

  constructor(
    private readonly batas = BATAS_PESAN,
    private readonly jendelaMs = JENDELA_MS,
  ) {}

  /** true bila masih boleh; sekaligus mencatat pesan ini. */
  izinkan(kunci: string, sekarang: number = Date.now()): boolean {
    const baru = (this.catatan.get(kunci) ?? []).filter((t) => sekarang - t < this.jendelaMs);
    if (baru.length >= this.batas) {
      this.catatan.set(kunci, baru);
      return false;
    }
    baru.push(sekarang);
    this.catatan.set(kunci, baru);
    return true;
  }
}
