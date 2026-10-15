/** Implementasi RepoAkun dengan supabase-js (server saja). */
import type { RepoAkun } from '@/lib/layanan/repo_akun';
import type { PreferensiPengguna, ResponsPreferensi } from '@/types';
import { repoSupabase } from './repo_supabase';
import { supabaseServer } from './supabase';

type Baris = Record<string, unknown>;

const POLA_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function cek<T>(hasil: { data: unknown; error: { message: string } | null }): T {
  if (hasil.error) throw new Error(`Supabase: ${hasil.error.message}`);
  return hasil.data as T;
}

const angka = (v: unknown): number | null => (v === null || v === undefined ? null : Number(v));

const KOLOM_PROFIL =
  'npsn,jurusan_sekolah,rapor_rata,nilai_mapel_pendukung,peringkat_paralel,jumlah_siswa_jurusan,nilai_tka,prestasi,reputasi_alumni,kampus_alumni,alumni_tidak_daftar_ulang';

function keAkademik(r: Baris | null): PreferensiPengguna['akademik'] {
  if (!r) return null;
  return {
    npsn: r.npsn ? String(r.npsn).trim() : null,
    jurusan_sekolah: (r.jurusan_sekolah as string | null) ?? null,
    rapor_rata: angka(r.rapor_rata),
    nilai_mapel_pendukung: (r.nilai_mapel_pendukung as Record<string, number>) ?? {},
    peringkat_paralel: angka(r.peringkat_paralel),
    jumlah_siswa_jurusan: angka(r.jumlah_siswa_jurusan),
    nilai_tka: (r.nilai_tka as NonNullable<PreferensiPengguna['akademik']>['nilai_tka']) ?? {},
    prestasi: (r.prestasi as NonNullable<PreferensiPengguna['akademik']>['prestasi']) ?? [],
    reputasi_alumni: (r.reputasi_alumni as NonNullable<PreferensiPengguna['akademik']>['reputasi_alumni']) ?? null,
    kampus_alumni: ((r.kampus_alumni as number[] | null) ?? []).map(Number),
    alumni_tidak_daftar_ulang:
      (r.alumni_tidak_daftar_ulang as NonNullable<PreferensiPengguna['akademik']>['alumni_tidak_daftar_ulang']) ?? null,
  };
}

export const repoAkunSupabase: RepoAkun = {
  async upsertPengguna({ google_sub, email, nama }) {
    const data = cek<{ id: string }>(
      await supabaseServer()
        .from('pengguna')
        .upsert({ google_sub, email, nama, diperbarui_pada: new Date().toISOString() }, { onConflict: 'google_sub' })
        .select('id')
        .single(),
    );
    return data.id;
  },

  async ambilPengguna(id) {
    if (!POLA_UUID.test(id)) return null;
    const data = cek<Baris | null>(await supabaseServer().from('pengguna').select('id,email,nama').eq('id', id).maybeSingle());
    return data ? { id: String(data.id), email: String(data.email), nama: (data.nama as string | null) ?? null } : null;
  },

  async hapusPengguna(id) {
    if (!POLA_UUID.test(id)) return;
    cek(await supabaseServer().from('pengguna').delete().eq('id', id));
  },

  async sudahIsiPreferensi(id) {
    if (!POLA_UUID.test(id)) return false;
    const data = cek<Baris | null>(
      await supabaseServer().from('preferensi').select('skor_riasec').eq('pengguna_id', id).maybeSingle(),
    );
    return !!data?.skor_riasec;
  },

  async ambilPreferensi(id): Promise<ResponsPreferensi['data']> {
    if (!POLA_UUID.test(id)) return null;
    const db = supabaseServer();
    const [pref, profil] = await Promise.all([
      db.from('preferensi').select('*').eq('pengguna_id', id).maybeSingle(),
      db.from('profil_akademik').select(KOLOM_PROFIL).eq('pengguna_id', id).maybeSingle(),
    ]);
    const p = cek<Baris | null>(pref);
    if (!p || !p.skor_riasec) return null;
    return {
      minat: {
        mode: p.mode_minat as PreferensiPengguna['minat']['mode'],
        jawaban_minat: (p.jawaban_minat as Record<string, number>) ?? {},
        chip_hobi: (p.chip_hobi as string[]) ?? [],
        mapel_favorit: (p.mapel_favorit as string[]) ?? [],
      },
      jalur: {
        ikut_snbp: Boolean(p.ikut_snbp),
        ikut_snbt: Boolean(p.ikut_snbt),
        tahun_lulus: angka(p.tahun_lulus),
        pernah_lulus_snbp: Boolean(p.pernah_lulus_snbp),
      },
      akademik: keAkademik(cek<Baris | null>(profil)),
      skor_riasec: p.skor_riasec as NonNullable<ResponsPreferensi['data']>['skor_riasec'],
      kode_holland: String(p.kode_holland).trim(),
      diperbarui_pada: String(p.diperbarui_pada),
    };
  },

  async simpanPreferensi(id, d) {
    const db = supabaseServer();
    const sekarang = new Date().toISOString();
    cek(
      await db.from('preferensi').upsert(
        {
          pengguna_id: id,
          mode_minat: d.minat.mode,
          jawaban_minat: d.minat.jawaban_minat,
          skor_riasec: d.skor_riasec,
          kode_holland: d.kode_holland,
          chip_hobi: d.minat.chip_hobi,
          mapel_favorit: d.minat.mapel_favorit,
          ikut_snbp: d.jalur.ikut_snbp,
          ikut_snbt: d.jalur.ikut_snbt,
          tahun_lulus: d.jalur.tahun_lulus,
          pernah_lulus_snbp: d.jalur.pernah_lulus_snbp,
          diperbarui_pada: sekarang,
        },
        { onConflict: 'pengguna_id' },
      ),
    );
    // PUT mengganti seluruh dokumen: akademik null berarti data akademik dihapus.
    if (!d.akademik) {
      cek(await db.from('profil_akademik').delete().eq('pengguna_id', id));
      return;
    }
    const a = d.akademik;
    cek(
      await db.from('profil_akademik').upsert(
        {
          pengguna_id: id,
          npsn: a.npsn,
          jurusan_sekolah: a.jurusan_sekolah,
          kode_kab: a.kode_kab,
          rapor_rata: a.rapor_rata,
          nilai_mapel_pendukung: a.nilai_mapel_pendukung,
          peringkat_paralel: a.peringkat_paralel,
          jumlah_siswa_jurusan: a.jumlah_siswa_jurusan,
          nilai_tka: a.nilai_tka,
          prestasi: a.prestasi,
          reputasi_alumni: a.reputasi_alumni,
          kampus_alumni: a.kampus_alumni,
          alumni_tidak_daftar_ulang: a.alumni_tidak_daftar_ulang,
          diperbarui_pada: sekarang,
        },
        { onConflict: 'pengguna_id' },
      ),
    );
  },

  async kodeKabSekolah(npsn) {
    const data = cek<Baris | null>(await supabaseServer().from('sekolah').select('kode_kab').eq('npsn', npsn).maybeSingle());
    return data ? String(data.kode_kab) : null;
  },

  async idPtnAda(ids) {
    if (!ids.length) return [];
    const data = cek<Baris[]>(await supabaseServer().from('ptn').select('id_ptn').in('id_ptn', ids));
    return data.map((r) => Number(r.id_ptn));
  },

  itemMinat: () => repoSupabase.itemMinat(),
};
