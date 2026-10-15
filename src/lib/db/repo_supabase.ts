/** Implementasi Repo dengan supabase-js (server saja). */
import type { ItemMinat, Skala } from '@/lib/skoring';
import type { BarisAlias, BarisProdi, BarisPtn, BarisSekolah, DetailTambahan, KueriProdi, Repo } from '@/lib/layanan/repo';
import type { JenjangProdi, RumpunIlmu, StatistikTahunan } from '@/types';
import { supabaseServer } from './supabase';

type Baris = Record<string, unknown>;

const PER_HALAMAN_DB = 1000; // batas max_rows bawaan PostgREST Supabase

const KOLOM_PRODI = [
  'id_prodi,id_ptn,nama,jenjang,rumpun_id,kelompok,r,i,a,s,e,c,kode_holland,mapel_pendukung_snbp,portofolio',
  'is_baru,ada_snbp,ada_snbt,dt_snbp_2026,peminat_snbp_2025,diterima_snbp_2025,rasio_terima_snbp_2025',
  'rasio_terima_snbp_rata3th,dt_snbt_2026,dt_snbt_2025,peminat_snbt_2025',
  'est_skor_utbk,est_skor_utbk_bawah,est_skor_utbk_atas,metode_est_utbk',
  'ptn!inner(nama,kode_bps,kode_bps_2,prov:provinsi!ptn_kode_bps_fkey(nama))',
  'rumpun!inner(nama,klaster_id)',
].join(',');

const KOLOM_SEKOLAH =
  'npsn,nama,jenis,akreditasi,persen_kuota,kuota_siswa,jurusan_kuota,kode_bps,kab:kabupaten_kota(nama),prov:provinsi(nama)';

const angka = (v: unknown): number | null => (v === null || v === undefined || v === '' ? null : Number(v));
const objek = (v: unknown): Baris => (v && typeof v === 'object' ? (v as Baris) : {});

function cek<T>(hasil: { data: unknown; error: { message: string } | null }): T {
  if (hasil.error) throw new Error(`Supabase: ${hasil.error.message}`);
  return hasil.data as T;
}

/** Buang karakter yang bermakna khusus di filter PostgREST. */
const aman = (t: string) => t.replace(/[,()%*"\\]/g, ' ').trim();

export function keBarisProdi(b: Baris): BarisProdi {
  const ptn = objek(b.ptn);
  const rumpun = objek(b.rumpun);
  return {
    id_prodi: Number(b.id_prodi),
    id_ptn: Number(b.id_ptn),
    nama: String(b.nama),
    jenjang: b.jenjang as JenjangProdi,
    rumpun_id: String(b.rumpun_id),
    rumpun: String(rumpun.nama ?? ''),
    kelompok: b.kelompok as RumpunIlmu,
    klaster_id: Number(rumpun.klaster_id),
    nama_ptn: String(ptn.nama ?? ''),
    provinsi_ptn: String(objek(ptn.prov).nama ?? ''),
    kode_bps_ptn: String(ptn.kode_bps ?? ''),
    kode_bps_ptn_2: (ptn.kode_bps_2 as string | null) ?? null,
    r: Number(b.r),
    i: Number(b.i),
    a: Number(b.a),
    s: Number(b.s),
    e: Number(b.e),
    c: Number(b.c),
    kode_holland: String(b.kode_holland).trim(),
    mapel_pendukung_snbp: (b.mapel_pendukung_snbp as string | null) ?? null,
    portofolio: (b.portofolio as string | null) ?? null,
    is_baru: Boolean(b.is_baru),
    ada_snbp: Boolean(b.ada_snbp),
    ada_snbt: Boolean(b.ada_snbt),
    dt_snbp_2026: angka(b.dt_snbp_2026),
    peminat_snbp_2025: angka(b.peminat_snbp_2025),
    diterima_snbp_2025: angka(b.diterima_snbp_2025),
    rasio_terima_snbp_2025: angka(b.rasio_terima_snbp_2025),
    rasio_terima_snbp_rata3th: angka(b.rasio_terima_snbp_rata3th),
    dt_snbt_2026: angka(b.dt_snbt_2026),
    dt_snbt_2025: angka(b.dt_snbt_2025),
    peminat_snbt_2025: angka(b.peminat_snbt_2025),
    est_skor_utbk: angka(b.est_skor_utbk),
    est_skor_utbk_bawah: angka(b.est_skor_utbk_bawah),
    est_skor_utbk_atas: angka(b.est_skor_utbk_atas),
    metode_est_utbk: (b.metode_est_utbk as string | null) ?? null,
  };
}

function keBarisSekolah(b: Baris): BarisSekolah {
  return {
    npsn: String(b.npsn),
    nama: String(b.nama),
    jenis: String(b.jenis),
    akreditasi: (b.akreditasi as string | null) ?? null,
    persen_kuota: Number(b.persen_kuota),
    kuota_siswa: Number(b.kuota_siswa),
    jurusan_kuota: objek(b.jurusan_kuota) as Record<string, number | string>,
    kab_kota: String(objek(b.kab).nama ?? ''),
    provinsi: String(objek(b.prov).nama ?? ''),
    kode_bps: String(b.kode_bps),
  };
}

// Data referensi statis: dimuat sekali per instance server.
let cacheProdi: Promise<BarisProdi[]> | null = null;
let cachePtn: Promise<BarisPtn[]> | null = null;
let cacheAlias: Promise<BarisAlias[]> | null = null;
let cacheItem: Promise<ItemMinat[]> | null = null;

function simpan<T>(ambil: () => Promise<T>, set: (p: Promise<T> | null) => void): Promise<T> {
  const p = ambil();
  set(p);
  p.catch(() => set(null)); // gagal -> coba lagi di request berikutnya
  return p;
}

async function muatSemuaProdi(): Promise<BarisProdi[]> {
  const db = supabaseServer();
  const hasil: BarisProdi[] = [];
  for (let dari = 0; ; dari += PER_HALAMAN_DB) {
    const data = cek<Baris[]>(
      await db.from('prodi').select(KOLOM_PRODI).order('id_prodi').range(dari, dari + PER_HALAMAN_DB - 1),
    );
    hasil.push(...data.map(keBarisProdi));
    if (data.length < PER_HALAMAN_DB) return hasil;
  }
}

export const repoSupabase: Repo = {
  async sekolahByNpsn(npsn) {
    const data = cek<Baris | null>(await supabaseServer().from('sekolah').select(KOLOM_SEKOLAH).eq('npsn', npsn).maybeSingle());
    return data ? keBarisSekolah(data) : null;
  },

  async cariSekolah(q, batas) {
    const data = cek<Baris[]>(
      await supabaseServer().from('sekolah').select(KOLOM_SEKOLAH).ilike('nama', `%${aman(q)}%`).order('nama').limit(batas),
    );
    return data.map(keBarisSekolah);
  },

  async daftarProdi(k: KueriProdi, offset, limit) {
    let kueri = supabaseServer().from('prodi').select(KOLOM_PRODI, { count: 'exact' });
    if (k.rumpun_id) kueri = kueri.eq('rumpun_id', k.rumpun_id);
    if (k.jenjang) kueri = kueri.eq('jenjang', k.jenjang);
    if (k.kelompok) kueri = kueri.eq('kelompok', k.kelompok);
    if (k.id_ptn) kueri = kueri.eq('id_ptn', k.id_ptn);
    if (k.klaster_id) kueri = kueri.eq('rumpun.klaster_id', k.klaster_id);
    if (k.kode_bps) {
      const kode = aman(k.kode_bps);
      kueri = kueri.or(`kode_bps.eq.${kode},kode_bps_2.eq.${kode}`, { referencedTable: 'ptn' });
    }
    if (k.portofolio === true) kueri = kueri.not('portofolio', 'is', null);
    if (k.portofolio === false) kueri = kueri.is('portofolio', null);
    if (k.id_ptn_alias.length) kueri = kueri.in('id_ptn', k.id_ptn_alias);
    const syarat = [
      ...k.teks_prodi.map(aman).filter(Boolean).map((t) => `nama.ilike."*${t}*"`),
      ...(k.id_ptn_teks.length ? [`id_ptn.in.(${k.id_ptn_teks.join(',')})`] : []),
    ];
    if (syarat.length) kueri = kueri.or(syarat.join(','));
    const hasil = await kueri.order('nama').order('id_prodi').range(offset, offset + limit - 1);
    const data = cek<Baris[]>(hasil);
    return { baris: data.map(keBarisProdi), total: hasil.count ?? data.length };
  },

  async prodiByIds(ids) {
    const data = cek<Baris[]>(await supabaseServer().from('prodi').select(KOLOM_PRODI).in('id_prodi', ids));
    return data.map(keBarisProdi);
  },

  async prodiSerumpun(idPtn, rumpunId) {
    const data = cek<Baris[]>(
      await supabaseServer().from('prodi').select(KOLOM_PRODI).in('id_ptn', idPtn).in('rumpun_id', rumpunId),
    );
    return data.map(keBarisProdi);
  },

  semuaProdi() {
    return cacheProdi ?? simpan(muatSemuaProdi, (p) => (cacheProdi = p));
  },

  async detailTambahan(idProdi): Promise<DetailTambahan> {
    const db = supabaseServer();
    const [stat, pddikti, profil] = await Promise.all([
      db.from('prodi_statistik_tahunan').select('jalur,tahun,daya_tampung,peminat,diterima').eq('id_prodi', idProdi).order('jalur').order('tahun'),
      db
        .from('prodi_pddikti')
        .select('akreditasi_kanonik,akreditasi_internasional,jumlah_dosen,jumlah_mahasiswa,rasio_dosen_mhs,rata_masa_studi_th,website')
        .eq('id_prodi', idProdi)
        .maybeSingle(),
      db.from('prodi_profil').select('deskripsi,visi,misi,kompetensi,capaian_belajar').eq('id_prodi', idProdi).maybeSingle(),
    ]);
    const s = cek<Baris[]>(stat);
    const p = cek<Baris | null>(pddikti);
    const f = cek<Baris | null>(profil);
    return {
      statistik: s.map(
        (r): StatistikTahunan => ({
          jalur: r.jalur as 'snbp' | 'snbt',
          tahun: Number(r.tahun),
          daya_tampung: angka(r.daya_tampung),
          peminat: angka(r.peminat),
          diterima: angka(r.diterima),
        }),
      ),
      pddikti: p && {
        akreditasi: String(p.akreditasi_kanonik),
        akreditasi_internasional: (p.akreditasi_internasional as string | null) ?? null,
        jumlah_dosen: angka(p.jumlah_dosen),
        jumlah_mahasiswa: angka(p.jumlah_mahasiswa),
        rasio_dosen_mhs: (p.rasio_dosen_mhs as string | null) ?? null,
        rata_masa_studi_th: angka(p.rata_masa_studi_th),
        website: (p.website as string | null) ?? null,
      },
      profil: f && {
        deskripsi: (f.deskripsi as string | null) ?? null,
        visi: (f.visi as string | null) ?? null,
        misi: (f.misi as string | null) ?? null,
        kompetensi: (f.kompetensi as string[] | null) ?? [],
        capaian_belajar: (f.capaian_belajar as string[] | null) ?? [],
      },
    };
  },

  semuaPtn() {
    return (
      cachePtn ??
      simpan(
        async () => cek<Baris[]>(await supabaseServer().from('ptn').select('id_ptn,nama')).map((r) => ({ id_ptn: Number(r.id_ptn), nama: String(r.nama) })),
        (p) => (cachePtn = p),
      )
    );
  },

  aliasPencarian() {
    return (
      cacheAlias ??
      simpan(
        async () => cek<BarisAlias[]>(await supabaseServer().from('alias_pencarian').select('alias,jenis,arti')),
        (p) => (cacheAlias = p),
      )
    );
  },

  itemMinat() {
    return (
      cacheItem ??
      simpan(
        async () =>
          cek<Baris[]>(await supabaseServer().from('minat_item').select('item_id,skala,mini_ip_30')).map((r) => ({
            item_id: String(r.item_id),
            skala: String(r.skala) as Skala,
            mini_ip_30: Boolean(r.mini_ip_30),
          })),
        (p) => (cacheItem = p),
      )
    );
  },
};
