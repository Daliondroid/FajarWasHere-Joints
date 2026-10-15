/** Implementasi RepoTestDrive dengan supabase-js (server saja). */
import type { BarisSoal, RepoTestDrive } from '@/lib/layanan/repo_test_drive';
import type { RefleksiTestDrive } from '@/types';
import { supabaseServer } from './supabase';

type Baris = Record<string, unknown>;

const KOLOM_SOAL = 'id_soal,lapisan,id_prodi,rumpun_id,soal,opsi_a,opsi_b,opsi_c,opsi_d,kunci,pembahasan,sumber,status';
const RIWAYAT = 'riwayat_test_drive';

function cek<T>(hasil: { data: unknown; error: { message: string } | null }): T {
  if (hasil.error) throw new Error(`Supabase: ${hasil.error.message}`);
  return hasil.data as T;
}

function keBarisSoal(r: Baris): BarisSoal {
  return {
    id_soal: String(r.id_soal),
    lapisan: r.lapisan as BarisSoal['lapisan'],
    id_prodi: r.id_prodi == null ? null : Number(r.id_prodi),
    rumpun_id: (r.rumpun_id as string | null) ?? null,
    soal: String(r.soal),
    opsi_a: String(r.opsi_a),
    opsi_b: String(r.opsi_b),
    opsi_c: String(r.opsi_c),
    opsi_d: String(r.opsi_d),
    kunci: String(r.kunci).trim() as BarisSoal['kunci'],
    pembahasan: (r.pembahasan as string | null) ?? null,
    sumber: (r.sumber as string | null) ?? null,
    status: (r.status as string | null) ?? null,
  };
}

export const repoTestDriveSupabase: RepoTestDrive = {
  async soalUntukProdi(idProdi, rumpunId) {
    const db = supabaseServer();
    const [prodi, rumpun] = await Promise.all([
      db.from('soal').select(KOLOM_SOAL).eq('id_prodi', idProdi).in('lapisan', ['spesifik', 'umum']),
      db.from('soal').select(KOLOM_SOAL).eq('lapisan', 'rumpun').eq('rumpun_id', rumpunId),
    ]);
    return [...cek<Baris[]>(prodi), ...cek<Baris[]>(rumpun)].map(keBarisSoal);
  },

  async soalById(idSoal) {
    const data = cek<Baris | null>(
      await supabaseServer().from('soal').select(KOLOM_SOAL).eq('id_soal', idSoal).in('lapisan', ['spesifik', 'umum', 'rumpun']).maybeSingle(),
    );
    return data ? keBarisSoal(data) : null;
  },

  async simpanJawaban(penggunaId, d) {
    cek(
      await supabaseServer()
        .from(RIWAYAT)
        .insert({ pengguna_id: penggunaId, id_prodi: d.id_prodi, id_soal: d.id_soal, jawaban: d.jawaban, benar: d.benar }),
    );
  },

  async simpanRefleksi(penggunaId, idProdi, refleksi) {
    const db = supabaseServer();
    const terakhir = cek<Baris | null>(
      await db
        .from(RIWAYAT)
        .select('id')
        .eq('pengguna_id', penggunaId)
        .eq('id_prodi', idProdi)
        .is('refleksi', null)
        .order('dibuat_pada', { ascending: false })
        .limit(1)
        .maybeSingle(),
    );
    if (terakhir) {
      cek(await db.from(RIWAYAT).update({ refleksi }).eq('id', terakhir.id));
    } else {
      cek(await db.from(RIWAYAT).insert({ pengguna_id: penggunaId, id_prodi: idProdi, refleksi }));
    }
  },

  async refleksiPengguna(penggunaId) {
    const data = cek<Baris[]>(
      await supabaseServer()
        .from(RIWAYAT)
        .select('id_prodi,refleksi')
        .eq('pengguna_id', penggunaId)
        .not('refleksi', 'is', null)
        .order('dibuat_pada', { ascending: false })
        .limit(1000),
    );
    const hasil: Record<string, RefleksiTestDrive> = {};
    for (const r of data) {
      const k = String(r.id_prodi);
      if (!(k in hasil)) hasil[k] = r.refleksi as RefleksiTestDrive; // baris terbaru menang
    }
    return hasil;
  },
};
