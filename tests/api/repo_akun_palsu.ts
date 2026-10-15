/** RepoAkun palsu dalam memori; meniru fungsi SQL simpan/aktifkan/hapus_preferensi (T-18). */
import { galatValidasi } from '@/lib/api/galat';
import type { RepoAkun, SimpanPreferensi } from '@/lib/layanan/repo_akun';
import type { PreferensiDetail } from '@/types';
import { ITEM } from './repo_palsu';

export const ID_PENGGUNA = '11111111-2222-3333-4444-555555555555';

interface BarisPref extends SimpanPreferensi {
  id: string;
  pengguna_id: string;
  aktif: boolean;
  dibuat_pada: string;
  diperbarui_pada: string;
}

export function repoAkunPalsu() {
  const pengguna = new Map<string, { id: string; google_sub: string; email: string; nama: string | null }>();
  const pref = new Map<string, BarisPref>();
  let jam = 0;
  const waktu = () => new Date(Date.UTC(2026, 9, 15, 0, 0, jam++)).toISOString();
  const idBaru = () => `00000000-0000-4000-8000-${String(pref.size + 1).padStart(12, '0')}`;
  const milik = (pid: string) => [...pref.values()].filter((p) => p.pengguna_id === pid);

  const repo: RepoAkun = {
    async upsertPengguna(d) {
      const ada = [...pengguna.values()].find((p) => p.google_sub === d.google_sub);
      const id = ada?.id ?? (pengguna.size === 0 ? ID_PENGGUNA : `id-${pengguna.size}`);
      pengguna.set(id, { id, ...d });
      return id;
    },
    ambilPengguna: async (id) => pengguna.get(id) ?? null,
    async hapusPengguna(id) {
      pengguna.delete(id);
      for (const p of milik(id)) pref.delete(p.id); // meniru on delete cascade
    },
    punyaPreferensi: async (pid) => milik(pid).length > 0,
    daftarPreferensi: async (pid) =>
      milik(pid)
        .sort((a, b) => Number(b.aktif) - Number(a.aktif) || b.diperbarui_pada.localeCompare(a.diperbarui_pada))
        .map((p) => ({
          id: p.id,
          nama: p.nama,
          jalur: p.jalur,
          aktif: p.aktif,
          kode_holland: p.kode_holland,
          skor_riasec: p.skor_riasec,
          chip_hobi: p.minat.chip_hobi,
          mapel_favorit: p.minat.mapel_favorit,
          diperbarui_pada: p.diperbarui_pada,
        })),
    async ambilPreferensi(pid, id): Promise<Omit<PreferensiDetail, 'skor_to_terbaru'> | null> {
      const p = pref.get(id);
      if (!p || p.pengguna_id !== pid) return null;
      const akademik = p.akademik && { ...p.akademik };
      if (akademik) delete (akademik as { kode_kab?: string | null }).kode_kab;
      return {
        id: p.id,
        nama: p.nama,
        jalur: p.jalur,
        aktif: p.aktif,
        minat: p.minat,
        kelulusan: p.kelulusan,
        akademik,
        riwayat_to: p.riwayat_to,
        skor_riasec: p.skor_riasec,
        kode_holland: p.kode_holland,
        dibuat_pada: p.dibuat_pada,
        diperbarui_pada: p.diperbarui_pada,
      };
    },
    idPreferensiAktif: async (pid) => milik(pid).find((p) => p.aktif)?.id ?? null,
    async simpanPreferensi(pid, id, d) {
      const bentrok = milik(pid).find((p) => p.id !== id && p.nama.trim().toLowerCase() === d.nama.trim().toLowerCase());
      if (bentrok) throw galatValidasi('Nama preferensi sudah dipakai; pilih nama lain.');
      if (id === null) {
        const baru = idBaru();
        for (const p of milik(pid)) p.aktif = false;
        pref.set(baru, { ...d, id: baru, pengguna_id: pid, aktif: true, dibuat_pada: waktu(), diperbarui_pada: waktu() });
        return baru;
      }
      const lama = pref.get(id);
      if (!lama || lama.pengguna_id !== pid) return null;
      pref.set(id, { ...lama, ...d, jalur: lama.jalur, diperbarui_pada: waktu() });
      return id;
    },
    async gantiNamaPreferensi(pid, id, nama) {
      const p = pref.get(id);
      if (!p || p.pengguna_id !== pid) return false;
      p.nama = nama;
      p.diperbarui_pada = waktu();
      return true;
    },
    async aktifkanPreferensi(pid, id) {
      const p = pref.get(id);
      if (!p || p.pengguna_id !== pid) return false;
      for (const q of milik(pid)) q.aktif = q.id === id;
      return true;
    },
    async hapusPreferensi(pid, id) {
      const p = pref.get(id);
      if (!p || p.pengguna_id !== pid) return false;
      pref.delete(id);
      if (p.aktif) {
        const [pengganti] = milik(pid).sort((a, b) => b.diperbarui_pada.localeCompare(a.diperbarui_pada));
        if (pengganti) pengganti.aktif = true;
      }
      return true;
    },
    kodeKabSekolah: async (npsn) => (npsn === '20500001' ? '356000' : null),
    idPtnAda: async (ids) => ids.filter((i) => i < 1000),
    itemMinat: async () => ITEM,
  };
  return { repo, pengguna, pref };
}

const MINAT = { R: 2, I: 4, A: 1, S: 1, E: 0, C: 3 } as const;

/** Badan POST /api/preferensi jalur SNBP yang valid. */
export const BADAN_PREF = {
  nama: 'Impian Kedokteran',
  jalur: 'snbp',
  minat: {
    jawaban_minat: Object.fromEntries(ITEM.map((it) => [it.item_id, MINAT[it.skala]])),
    chip_hobi: ['H04'],
    mapel_favorit: ['Biologi'],
  },
  kelulusan: { tahun_lulus: 2026, pernah_lulus_snbp: false },
  akademik: {
    npsn: '20500001',
    jurusan_sekolah: 'MIPA',
    rapor_rata: 88.5,
    nilai_mapel_pendukung: { Biologi: 90 },
    peringkat_paralel: 4,
    nilai_tka: { matematika: 60, pilihan: [{ mapel: 'Biologi', nilai: 80 }, { mapel: 'Kimia', nilai: 75 }] },
    prestasi: [{ tingkat: 'provinsi', bidang: 'OSN Biologi', peringkat: 'juara 2' }],
    reputasi_alumni: 'rutin_lolos',
    kampus_alumni: [361],
  },
  riwayat_to: [],
};

/** Badan POST /api/preferensi jalur SNBT yang valid. */
export const BADAN_PREF_SNBT = {
  ...BADAN_PREF,
  nama: 'Cadangan SNBT',
  jalur: 'snbt',
  kelulusan: { tahun_lulus: 2025, pernah_lulus_snbp: false },
  akademik: null,
  riwayat_to: [
    { tanggal: '2026-09-01', sumber_to: 'Bimbel A', skala: 'bimbel', skor: { pu: 600, ppu: 600, pbm: 600, pk: 600, lit_ind: 600, lit_ing: 600, pm: 600 } },
    { tanggal: '2026-10-01', sumber_to: 'Bimbel A', skala: 'bimbel', skor: { pu: 700, ppu: 650, pbm: null, pk: 650, lit_ind: null, lit_ing: null, pm: null } },
  ],
};
