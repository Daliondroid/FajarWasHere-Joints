/**
 * /api/chat: chatbot "Cocokin!" (T-09; F-09, BR-12, BR-16).
 * Gemini menjawab lewat function calling ke layanan internal; angka di balasan diperiksa terhadap hasil alat;
 * bila model tidak tersedia/gagal, jawaban cadangan non-AI dibuat dari rekomendasi preferensi aktif.
 */
import { ApiGalat, galatTidakLogin, galatValidasi } from '@/lib/api/galat';
import { DEKLARASI_ALAT, jalankanAlat, type KonteksAlat } from '@/lib/chat/alat';
import { periksaAngka } from '@/lib/chat/grounding';
import type { Konten, ModelChat } from '@/lib/chat/model';
import type { PembatasLaju } from '@/lib/chat/pembatas';
import type { ResponsChat, ResponsHapusRiwayatChat, ResponsRiwayatChat } from '@/types';
import { layananRekomendasi } from './rekomendasi';
import type { Repo } from './repo';
import type { RepoAkun } from './repo_akun';
import type { RepoChat } from './repo_chat';

export const MAKS_PANJANG_PESAN = 1000;
export const KONTEKS_RIWAYAT = 10;
export const RIWAYAT_DITAMPILKAN = 50;
export const MAKS_PUTARAN_ALAT = 4;

export const INSTRUKSI_SISTEM = `Kamu adalah "Cocokin!", kakak tingkat yang ramah dan jujur yang membantu siswa SMA/SMK/MA kelas 12 memilih jurusan dan memahami peluang SNBP/SNBT 2026.
Aturan wajib:
1. Jawab dalam Bahasa Indonesia yang santai tapi sopan, ringkas (maksimal sekitar 150 kata).
2. JANGAN mengarang angka. Setiap angka (daya tampung, rasio/keketatan, peluang, skor, akreditasi) harus berasal dari hasil alat. Panggil alat dulu bila perlu angka.
3. Bila data tidak ada di hasil alat, katakan "datanya tidak tersedia".
4. Peluang selalu disebut sebagai estimasi berupa rentang, bukan jaminan lolos.
5. Untuk pertanyaan tentang siswa sendiri (rekomendasi, peluangku), pakai alat preferensi_aktif, rekomendasi_saya, atau peluang_saya; semuanya memakai preferensi aktif siswa.
6. Untuk prodi/kampus tertentu, cari dulu id_prodi dengan cari_prodi, lalu detail_prodi atau peluang_saya.
7. Jangan meminta data pribadi (nama lengkap, alamat, nomor telepon). Jangan membahas topik di luar pendidikan tinggi.
8. Boleh menyarankan fitur aplikasi: Simulasi (mencoba soal prodi), Preferensi (mengisi/mengganti data), Katalog prodi.`;

const PESAN_ULANG = (angka: number[]) =>
  `Periksa ulang jawabanmu: angka ${angka.join(', ')} tidak ada di hasil alat. Tulis ulang jawaban tanpa angka yang tidak berasal dari hasil alat; jika datanya tidak ada, katakan "datanya tidak tersedia".`;

export interface DepsChat {
  /** null = kunci Gemini tidak diisi; pakai jawaban cadangan. */
  model: ModelChat | null;
  repo: Repo;
  repoAkun: RepoAkun;
  repoChat: RepoChat;
  pembatas: PembatasLaju;
  sekarang?: () => Date;
}

async function wajibPengguna(idSesi: string | null, repoAkun: RepoAkun): Promise<string> {
  if (!idSesi || !(await repoAkun.ambilPengguna(idSesi))) throw galatTidakLogin();
  return idSesi;
}

export function validasiPesan(badan: unknown): string {
  const pesan = typeof badan === 'object' && badan !== null ? (badan as { pesan?: unknown }).pesan : undefined;
  if (typeof pesan !== 'string' || !pesan.trim()) throw galatValidasi('pesan wajib diisi.');
  if (pesan.length > MAKS_PANJANG_PESAN) throw galatValidasi(`pesan maksimal ${MAKS_PANJANG_PESAN} karakter.`);
  return pesan.trim();
}

/** Jawaban cadangan non-AI: ringkasan rekomendasi preferensi aktif (angka dari mesin deterministik). */
export async function jawabanCadangan(k: KonteksAlat): Promise<string> {
  const { data } = await layananRekomendasi(k.penggunaId, { repo: k.repo, repoAkun: k.repoAkun });
  const pembuka = 'Maaf, asisten AI sedang tidak tersedia.';
  if (!data) return `${pembuka} Isi Preferensi dulu supaya aku bisa memberi rekomendasi jurusan.`;
  const nama = { dream_goal: 'Dream Goal', safety_net: 'Safety Net', alternatif: 'Alternatif' } as const;
  const baris = data.kartu.map((c) => {
    const pel = c.detail.peluang_snbp ?? c.detail.peluang_snbt;
    const peluang = pel?.dihitung && pel.rentang ? `, estimasi peluang ${pel.rentang[0]}–${pel.rentang[1]}%` : '';
    return `${c.peringkat}. ${nama[c.jenis]}: ${c.prodi.nama_prodi} — ${c.prodi.nama_ptn} (kecocokan ${c.kecocokan.skor}%${peluang})`;
  });
  return `${pembuka} Ini rekomendasi dari preferensi "${data.preferensi.nama}":\n${baris.join('\n')}\nBuka halaman Rekomendasi untuk detailnya.`;
}

/** Percakapan dengan alat; mengembalikan balasan, alat yang dipakai, dan status grounding. */
export async function jalankanPercakapan(
  model: ModelChat,
  riwayat: Konten[],
  pesan: string,
  k: KonteksAlat,
): Promise<{ balasan: string; alat_dipakai: string[]; angka_terverifikasi: boolean }> {
  const konten: Konten[] = [...riwayat, { peran: 'user', bagian: [{ teks: pesan }] }];
  const hasilAlat: unknown[] = [];
  const alatDipakai: string[] = [];
  let balasan: string | null = null;

  for (let putaran = 0; putaran <= MAKS_PUTARAN_ALAT && balasan === null; putaran++) {
    const habis = putaran === MAKS_PUTARAN_ALAT;
    const k1 = await model.hasilkan({ sistem: INSTRUKSI_SISTEM, konten, alat: habis ? [] : DEKLARASI_ALAT });
    if (k1.panggilan.length && !habis) {
      const hasil = await Promise.all(k1.panggilan.map((p) => jalankanAlat(p.nama, p.argumen, k)));
      hasilAlat.push(...hasil);
      alatDipakai.push(...k1.panggilan.map((p) => p.nama));
      konten.push({ peran: 'model', bagian: k1.panggilan.map((p) => ({ panggilan: p })) });
      konten.push({ peran: 'user', bagian: k1.panggilan.map((p, i) => ({ hasil: { nama: p.nama, id: p.id, isi: hasil[i] } })) });
    } else {
      balasan = k1.teks ?? '';
    }
  }
  if (!balasan) throw new Error('Model tidak memberi jawaban.');

  // BR-12: angka harus berasal dari hasil alat atau pesan siswa. Satu kali kesempatan memperbaiki.
  const sumber = [...hasilAlat, pesan];
  let cek = periksaAngka(balasan, sumber);
  if (!cek.valid) {
    konten.push({ peran: 'model', bagian: [{ teks: balasan }] }, { peran: 'user', bagian: [{ teks: PESAN_ULANG(cek.tanpa_sumber) }] });
    const ulang = await model.hasilkan({ sistem: INSTRUKSI_SISTEM, konten, alat: [] });
    if (ulang.teks) {
      balasan = ulang.teks;
      cek = periksaAngka(balasan, sumber);
    }
  }
  return { balasan, alat_dipakai: [...new Set(alatDipakai)], angka_terverifikasi: cek.valid };
}

export async function layananKirimPesan(idSesi: string | null, badan: unknown, deps: DepsChat): Promise<ResponsChat> {
  const penggunaId = await wajibPengguna(idSesi, deps.repoAkun);
  const pesan = validasiPesan(badan);
  if (!deps.pembatas.izinkan(penggunaId)) {
    throw new ApiGalat('TERLALU_SERING', 'Terlalu banyak pesan. Tunggu beberapa menit lalu coba lagi.');
  }
  const k: KonteksAlat = { penggunaId, repo: deps.repo, repoAkun: deps.repoAkun };
  const riwayat: Konten[] = (await deps.repoChat.ambilRiwayat(penggunaId, KONTEKS_RIWAYAT)).map((m) => ({
    peran: m.peran === 'pengguna' ? 'user' : 'model',
    bagian: [{ teks: m.isi }],
  }));

  let hasil: Omit<ResponsChat, 'dibuat_pada'>;
  try {
    if (!deps.model) throw new Error('GEMINI_API_KEY belum diisi.');
    hasil = { ...(await jalankanPercakapan(deps.model, riwayat, pesan, k)), cadangan: false };
  } catch (e) {
    console.error('Chatbot memakai jawaban cadangan:', e instanceof Error ? e.message : e);
    hasil = { balasan: await jawabanCadangan(k), alat_dipakai: ['rekomendasi_saya'], angka_terverifikasi: true, cadangan: true };
  }

  await deps.repoChat.simpanPesan(penggunaId, 'pengguna', pesan);
  await deps.repoChat.simpanPesan(penggunaId, 'asisten', hasil.balasan);
  return { ...hasil, dibuat_pada: (deps.sekarang?.() ?? new Date()).toISOString() };
}

export async function layananRiwayatChat(idSesi: string | null, deps: Pick<DepsChat, 'repoAkun' | 'repoChat'>): Promise<ResponsRiwayatChat> {
  const penggunaId = await wajibPengguna(idSesi, deps.repoAkun);
  return { data: await deps.repoChat.ambilRiwayat(penggunaId, RIWAYAT_DITAMPILKAN) };
}

export async function layananHapusRiwayatChat(
  idSesi: string | null,
  deps: Pick<DepsChat, 'repoAkun' | 'repoChat'>,
): Promise<ResponsHapusRiwayatChat> {
  const penggunaId = await wajibPengguna(idSesi, deps.repoAkun);
  await deps.repoChat.hapusRiwayat(penggunaId);
  return { terhapus: true };
}
