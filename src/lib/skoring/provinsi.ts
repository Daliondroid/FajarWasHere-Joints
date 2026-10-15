/** BR-01: aturan satu provinsi SNBP. Provinsi selalu dibandingkan lewat crosswalk. */

export interface BarisCrosswalk {
  nama_di_sumber: string;
  provinsi_kanonik: string;
}

/** Peta nama provinsi (huruf kecil, tanpa spasi berlebih) -> nama kanonik. */
export type PetaProvinsi = Map<string, string>;

const kunci = (nama: string) => nama.trim().replace(/\s+/g, ' ').toLowerCase();

export function buatPetaProvinsi(baris: BarisCrosswalk[]): PetaProvinsi {
  const peta: PetaProvinsi = new Map();
  for (const b of baris) {
    peta.set(kunci(b.nama_di_sumber), b.provinsi_kanonik);
    peta.set(kunci(b.provinsi_kanonik), b.provinsi_kanonik);
  }
  return peta;
}

/** Nama kanonik, atau null jika tidak dikenal crosswalk. */
export function normalisasiProvinsi(nama: string | null | undefined, peta: PetaProvinsi): string | null {
  if (!nama) return null;
  return peta.get(kunci(nama)) ?? null;
}

export interface PilihanPtn {
  /** Provinsi PTN dari ak_ptn.csv (kolom provinsi). */
  provinsi: string;
  /** Provinsi kedua dari ak_ptn.csv (kolom provinsi_2), mis. UI dan Universitas Papua. */
  provinsi_2?: string | null;
}

export interface HasilValidasiProvinsi {
  valid: boolean;
  /** Indeks pilihan yang berada di provinsi sekolah. */
  pilihan_sama_provinsi: number[];
  /** Nama provinsi yang tidak dikenal crosswalk (perlu dicek data). */
  tidak_dikenal: string[];
  pesan: string | null;
}

export function sePtnProvinsi(ptn: PilihanPtn, provSekolah: string, peta: PetaProvinsi): boolean {
  return [ptn.provinsi, ptn.provinsi_2].some((p) => normalisasiProvinsi(p, peta) === provSekolah);
}

export function validasiProvinsiSnbp(
  provinsiSekolah: string,
  pilihan: PilihanPtn[],
  peta: PetaProvinsi,
): HasilValidasiProvinsi {
  const tidakDikenal = [provinsiSekolah, ...pilihan.flatMap((p) => [p.provinsi, p.provinsi_2])]
    .filter((p): p is string => !!p && normalisasiProvinsi(p, peta) === null);
  const provSekolah = normalisasiProvinsi(provinsiSekolah, peta);
  const sama = provSekolah
    ? pilihan.flatMap((p, i) => (sePtnProvinsi(p, provSekolah, peta) ? [i] : []))
    : [];
  const valid = pilihan.length <= 1 || sama.length > 0;
  return {
    valid,
    pilihan_sama_provinsi: sama,
    tidak_dikenal: [...new Set(tidakDikenal)],
    pesan: valid ? null : 'Melanggar aturan provinsi SNBP!',
  };
}
