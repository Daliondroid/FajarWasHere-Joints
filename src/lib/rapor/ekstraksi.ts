/**
 * Ekstraksi rapor (F-13, T-30): instruksi + skema untuk model, dan perapian hasil mentah model (murni).
 * Angka dari AI tidak dipercaya begitu saja (BR-12): tiap nilai dicek rentang 0–100, rata-rata dihitung ulang
 * dari nilai mapel, dan hasil wajib dikonfirmasi siswa sebelum dipakai.
 */
import type { HasilEkstraksiRapor, NilaiMapelRapor } from '@/types';

export const MAKS_UKURAN_RAPOR = 4 * 1024 * 1024;
export const TIPE_RAPOR = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'] as const;
export const JUMLAH_SEMESTER = 5;

export const INSTRUKSI_RAPOR = `Kamu membaca dokumen rapor SMA/SMK/MA Indonesia (foto atau PDF) untuk aplikasi persiapan SNBP.
Ambil HANYA angka yang benar-benar tertulis di dokumen. Jangan menebak, jangan mengarang, jangan menghitung sendiri.
- "mapel": setiap mata pelajaran dengan nilai pengetahuan/akhir (skala 0–100) per semester 1 sampai 5. Isi null bila semester itu tidak ada di dokumen atau tidak terbaca.
- Bila ada nilai pengetahuan dan keterampilan terpisah, pakai nilai pengetahuan.
- "rata_rata_tertulis": rata-rata keseluruhan bila tertulis di dokumen; selain itu null.
- "peringkat_paralel" dan "jumlah_siswa": hanya bila tertulis jelas (peringkat paralel/angkatan); peringkat kelas bukan peringkat paralel. Selain itu null.
- "terbaca": false bila dokumen bukan rapor atau tidak terbaca sama sekali.`;

/** JSON Schema keluaran model (responseJsonSchema Gemini). */
export const SKEMA_RAPOR = {
  type: 'object',
  properties: {
    terbaca: { type: 'boolean' },
    mapel: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          nama: { type: 'string' },
          nilai: { type: 'array', items: { type: ['number', 'null'] }, minItems: JUMLAH_SEMESTER, maxItems: JUMLAH_SEMESTER },
        },
        required: ['nama', 'nilai'],
      },
    },
    rata_rata_tertulis: { type: ['number', 'null'] },
    peringkat_paralel: { type: ['integer', 'null'] },
    jumlah_siswa: { type: ['integer', 'null'] },
  },
  required: ['terbaca', 'mapel'],
} as const;

const bulat2 = (n: number) => Math.round(n * 100) / 100;
const angka = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);

/** Nilai rapor valid 0–100; selain itu null. */
function nilaiValid(v: unknown): number | null {
  const n = angka(v);
  return n !== null && n >= 0 && n <= 100 ? bulat2(n) : null;
}

function bulatPositif(v: unknown, maks: number): number | null {
  const n = angka(v);
  return n !== null && Number.isInteger(n) && n >= 1 && n <= maks ? n : null;
}

const rata = (xs: number[]) => (xs.length ? bulat2(xs.reduce((a, b) => a + b, 0) / xs.length) : null);

/**
 * Rapikan keluaran mentah model menjadi hasil terverifikasi. null bila tidak ada satu pun nilai yang bisa dipakai.
 * Rata-rata rapor = rerata semua nilai mapel yang terbaca pada semester 1–5.
 */
export function rapikanHasil(mentah: unknown): HasilEkstraksiRapor | null {
  if (typeof mentah !== 'object' || mentah === null) return null;
  const m = mentah as Record<string, unknown>;
  if (m.terbaca === false) return null;

  const peringatan: string[] = [];
  let dibuang = 0;
  const mapel: NilaiMapelRapor[] = [];
  for (const it of Array.isArray(m.mapel) ? m.mapel : []) {
    const o = (it ?? {}) as Record<string, unknown>;
    const nama = typeof o.nama === 'string' ? o.nama.trim().slice(0, 80) : '';
    if (!nama) continue;
    const mentahNilai = Array.isArray(o.nilai) ? o.nilai : [];
    const nilai = Array.from({ length: JUMLAH_SEMESTER }, (_, i) => {
      const v = mentahNilai[i];
      const n = nilaiValid(v);
      if (n === null && v !== null && v !== undefined) dibuang++;
      return n;
    });
    const ada = nilai.filter((v): v is number => v !== null);
    if (!ada.length) continue;
    mapel.push({ mapel: nama, nilai, rata: rata(ada) });
  }
  if (!mapel.length) return null;
  if (dibuang) peringatan.push(`${dibuang} nilai di luar rentang 0–100 diabaikan.`);

  const semua = mapel.flatMap((x) => x.nilai.filter((v): v is number => v !== null));
  const rataRata = rata(semua)!;
  const semester = Array.from({ length: JUMLAH_SEMESTER }, (_, i) => i + 1).filter((s) => mapel.some((x) => x.nilai[s - 1] !== null));
  if (semester.length < JUMLAH_SEMESTER) {
    const hilang = Array.from({ length: JUMLAH_SEMESTER }, (_, i) => i + 1).filter((s) => !semester.includes(s));
    peringatan.push(`Semester ${hilang.join(', ')} tidak terbaca; rata-rata hanya dari semester ${semester.join(', ')}.`);
  }
  const tertulis = nilaiValid(m.rata_rata_tertulis);
  if (tertulis !== null && Math.abs(tertulis - rataRata) > 1) {
    peringatan.push(`Rata-rata tertulis di rapor (${tertulis}) berbeda dengan hitungan dari nilai mapel (${rataRata}). Cek lagi.`);
  }

  const jumlahSiswa = bulatPositif(m.jumlah_siswa, 10000);
  let peringkat = bulatPositif(m.peringkat_paralel, 10000);
  if (peringkat !== null && jumlahSiswa !== null && peringkat > jumlahSiswa) {
    peringatan.push('Peringkat lebih besar dari jumlah siswa; peringkat diabaikan.');
    peringkat = null;
  }

  return {
    mapel,
    rata_rata: rataRata,
    semester_terbaca: semester,
    peringkat_paralel: peringkat,
    jumlah_siswa: jumlahSiswa,
    peringatan,
  };
}

const normal = (s: string) =>
  s
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Cari nilai rata-rata mapel rapor untuk nama mapel pendukung (mis. "Biologi" cocok dengan "Biologi (Peminatan)"). */
export function nilaiUntukMapel(hasil: HasilEkstraksiRapor, nama: string): number | null {
  const n = normal(nama);
  if (!n) return null;
  const persis = hasil.mapel.find((x) => normal(x.mapel) === n);
  const mirip = persis ?? hasil.mapel.find((x) => normal(x.mapel).includes(n) || n.includes(normal(x.mapel)));
  return mirip?.rata ?? null;
}
