/** GET/PUT /api/preferensi untuk pengguna yang login (F-02 smart routing, Hal. 3–7). */
import { galatTidakDitemukan, galatTidakLogin, galatValidasi } from '@/lib/api/galat';
import { validasiPreferensi } from '@/lib/api/validasi';
import type { ResponsPreferensi } from '@/types';
import { hitungProfilMinat } from './minat';
import type { RepoAkun } from './repo_akun';

/** Sesi valid hanya jika penggunanya masih ada (token lama bisa tersisa setelah akun dihapus). */
async function wajibPengguna(idSesi: string | null, repo: RepoAkun): Promise<string> {
  if (!idSesi || !(await repo.ambilPengguna(idSesi))) throw galatTidakLogin();
  return idSesi;
}

export async function layananAmbilPreferensi(idSesi: string | null, repo: RepoAkun): Promise<ResponsPreferensi> {
  return { data: await repo.ambilPreferensi(await wajibPengguna(idSesi, repo)) };
}

export async function layananSimpanPreferensi(idSesi: string | null, badan: unknown, repo: RepoAkun): Promise<ResponsPreferensi> {
  const id = await wajibPengguna(idSesi, repo);
  const p = validasiPreferensi(badan);
  const { profil, kode } = hitungProfilMinat(p.minat.jawaban_minat, p.minat.mode, p.minat.chip_hobi, await repo.itemMinat());

  let kodeKab: string | null = null;
  if (p.akademik?.npsn) {
    kodeKab = await repo.kodeKabSekolah(p.akademik.npsn);
    if (kodeKab === null) throw galatTidakDitemukan(`Sekolah dengan NPSN ${p.akademik.npsn} tidak ditemukan.`);
  }
  if (p.akademik?.kampus_alumni.length) {
    const ada = new Set(await repo.idPtnAda(p.akademik.kampus_alumni));
    const asing = p.akademik.kampus_alumni.filter((id) => !ada.has(id));
    if (asing.length) throw galatValidasi(`kampus_alumni tidak dikenal: ${asing.join(', ')}.`);
  }

  await repo.simpanPreferensi(id, {
    minat: p.minat,
    jalur: p.jalur,
    skor_riasec: profil,
    kode_holland: kode,
    akademik: p.akademik && { ...p.akademik, kode_kab: kodeKab },
  });
  return { data: await repo.ambilPreferensi(id) };
}
