/** Implementasi RepoAkun dengan supabase-js (server saja). Tulis preferensi lewat fungsi SQL atomik (T-18). */
import { galatValidasi } from '@/lib/api/galat';
import type { BarisPreferensiRingkas, RepoAkun } from '@/lib/layanan/repo_akun';
import type { ProfilRiasec } from '@/lib/skoring';
import type { AkademikSnbp, IsiPreferensi, PreferensiDetail, TryOut } from '@/types';
import { repoSupabase } from './repo_supabase';
import { supabaseServer } from './supabase';

type Baris = Record<string, unknown>;
type GalatSupabase = { message: string; code?: string } | null;

const POLA_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Nama preferensi bentrok dengan indeks unik -> galat VALIDASI; galat lain -> Error biasa (500). */
function cek<T>(hasil: { data: unknown; error: GalatSupabase }): T {
  if (hasil.error) {
    if (hasil.error.code === '23505' && hasil.error.message.includes('preferensi_nama_unik')) {
      throw galatValidasi('Nama preferensi sudah dipakai; pilih nama lain.');
    }
    throw new Error(`Supabase: ${hasil.error.message}`);
  }
  return hasil.data as T;
}

const angka = (v: unknown): number | null => (v === null || v === undefined ? null : Number(v));

const KOLOM_PROFIL =
  'npsn,jurusan_sekolah,rapor_rata,nilai_mapel_pendukung,peringkat_paralel,jumlah_siswa_jurusan,nilai_tka,prestasi,reputasi_alumni,kampus_alumni';
const KOLOM_TO = 'tanggal,sumber_to,skala,skor_pu,skor_ppu,skor_pbm,skor_pk,skor_lit_ind,skor_lit_ing,skor_pm';
const SUBTES = ['pu', 'ppu', 'pbm', 'pk', 'lit_ind', 'lit_ing', 'pm'] as const;

function keAkademik(r: Baris | null): AkademikSnbp | null {
  if (!r) return null;
  return {
    npsn: r.npsn ? String(r.npsn).trim() : null,
    jurusan_sekolah: (r.jurusan_sekolah as string | null) ?? null,
    rapor_rata: angka(r.rapor_rata),
    nilai_mapel_pendukung: (r.nilai_mapel_pendukung as Record<string, number>) ?? {},
    peringkat_paralel: angka(r.peringkat_paralel),
    jumlah_siswa_jurusan: angka(r.jumlah_siswa_jurusan),
    nilai_tka: (r.nilai_tka as AkademikSnbp['nilai_tka']) ?? {},
    prestasi: (r.prestasi as AkademikSnbp['prestasi']) ?? [],
    reputasi_alumni: (r.reputasi_alumni as AkademikSnbp['reputasi_alumni']) ?? null,
    kampus_alumni: ((r.kampus_alumni as number[] | null) ?? []).map(Number),
  };
}

function keTryOut(r: Baris): TryOut {
  return {
    tanggal: String(r.tanggal),
    sumber_to: (r.sumber_to as string | null) ?? null,
    skala: r.skala as TryOut['skala'],
    skor: Object.fromEntries(SUBTES.map((s) => [s, angka(r[`skor_${s}`])])) as TryOut['skor'],
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

  async punyaPreferensi(penggunaId) {
    if (!POLA_UUID.test(penggunaId)) return false;
    const hasil = await supabaseServer()
      .from('preferensi')
      .select('id', { count: 'exact', head: true })
      .eq('pengguna_id', penggunaId);
    cek(hasil);
    return (hasil.count ?? 0) > 0;
  },

  async daftarPreferensi(penggunaId) {
    const data = cek<Baris[]>(
      await supabaseServer()
        .from('preferensi')
        .select('id,nama,jalur,aktif,kode_holland,skor_riasec,chip_hobi,mapel_favorit,diperbarui_pada')
        .eq('pengguna_id', penggunaId)
        .order('aktif', { ascending: false })
        .order('diperbarui_pada', { ascending: false }),
    );
    return data.map(
      (r): BarisPreferensiRingkas => ({
        id: String(r.id),
        nama: String(r.nama),
        jalur: r.jalur as IsiPreferensi['jalur'],
        aktif: Boolean(r.aktif),
        kode_holland: String(r.kode_holland).trim(),
        skor_riasec: r.skor_riasec as ProfilRiasec,
        chip_hobi: (r.chip_hobi as string[]) ?? [],
        mapel_favorit: (r.mapel_favorit as string[]) ?? [],
        diperbarui_pada: String(r.diperbarui_pada),
      }),
    );
  },

  async ambilPreferensi(penggunaId, id): Promise<Omit<PreferensiDetail, 'skor_to_terbaru'> | null> {
    const db = supabaseServer();
    const p = cek<Baris | null>(
      await db.from('preferensi').select('*').eq('id', id).eq('pengguna_id', penggunaId).maybeSingle(),
    );
    if (!p) return null;
    const [profil, to] = await Promise.all([
      db.from('profil_akademik').select(KOLOM_PROFIL).eq('preferensi_id', id).maybeSingle(),
      db.from('riwayat_to').select(KOLOM_TO).eq('preferensi_id', id).order('tanggal'),
    ]);
    return {
      id: String(p.id),
      nama: String(p.nama),
      jalur: p.jalur as IsiPreferensi['jalur'],
      aktif: Boolean(p.aktif),
      minat: {
        mode: p.mode_minat as IsiPreferensi['minat']['mode'],
        jawaban_minat: (p.jawaban_minat as Record<string, number>) ?? {},
        chip_hobi: (p.chip_hobi as string[]) ?? [],
        mapel_favorit: (p.mapel_favorit as string[]) ?? [],
      },
      kelulusan: { tahun_lulus: angka(p.tahun_lulus), pernah_lulus_snbp: Boolean(p.pernah_lulus_snbp) },
      akademik: keAkademik(cek<Baris | null>(profil)),
      riwayat_to: cek<Baris[]>(to).map(keTryOut),
      skor_riasec: p.skor_riasec as PreferensiDetail['skor_riasec'],
      kode_holland: String(p.kode_holland).trim(),
      dibuat_pada: String(p.dibuat_pada),
      diperbarui_pada: String(p.diperbarui_pada),
    };
  },

  async idPreferensiAktif(penggunaId) {
    if (!POLA_UUID.test(penggunaId)) return null;
    const data = cek<Baris | null>(
      await supabaseServer().from('preferensi').select('id').eq('pengguna_id', penggunaId).eq('aktif', true).maybeSingle(),
    );
    return data ? String(data.id) : null;
  },

  async simpanPreferensi(penggunaId, id, d) {
    const a = d.akademik;
    const data = cek<string | null>(
      await supabaseServer().rpc('simpan_preferensi', {
        p_pengguna: penggunaId,
        p_id: id,
        p_pref: {
          nama: d.nama,
          jalur: d.jalur,
          mode_minat: d.minat.mode,
          jawaban_minat: d.minat.jawaban_minat,
          skor_riasec: d.skor_riasec,
          kode_holland: d.kode_holland,
          chip_hobi: d.minat.chip_hobi,
          mapel_favorit: d.minat.mapel_favorit,
          tahun_lulus: d.kelulusan.tahun_lulus,
          pernah_lulus_snbp: d.kelulusan.pernah_lulus_snbp,
        },
        p_profil: a && {
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
        },
        p_to: d.riwayat_to.map((t) => ({
          tanggal: t.tanggal,
          sumber_to: t.sumber_to,
          skala: t.skala,
          ...Object.fromEntries(SUBTES.map((s) => [`skor_${s}`, t.skor[s]])),
        })),
      }),
    );
    return data ? String(data) : null;
  },

  async gantiNamaPreferensi(penggunaId, id, nama) {
    const data = cek<Baris[]>(
      await supabaseServer()
        .from('preferensi')
        .update({ nama: nama.trim(), diperbarui_pada: new Date().toISOString() })
        .eq('id', id)
        .eq('pengguna_id', penggunaId)
        .select('id'),
    );
    return data.length > 0;
  },

  async aktifkanPreferensi(penggunaId, id) {
    return Boolean(cek<boolean>(await supabaseServer().rpc('aktifkan_preferensi', { p_pengguna: penggunaId, p_preferensi: id })));
  },

  async hapusPreferensi(penggunaId, id) {
    return Boolean(cek<boolean>(await supabaseServer().rpc('hapus_preferensi', { p_pengguna: penggunaId, p_preferensi: id })));
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
