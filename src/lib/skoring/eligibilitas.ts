/** BR-04 (gerbang eligibilitas SNBP) dan BR-11 (validasi jalur). */
import { ATURAN, KUOTA_PER_AKREDITASI } from './parameter';

export interface InputEligibilitas {
  peringkat_paralel: number;
  /** Kuota eligible jurusan dari ak_sekolah_kuota_snbp_2026.csv (jurusan_kuota_json). */
  kuota_jurusan?: number | null;
  /** Dipakai jika kuota resmi tidak ada. */
  akreditasi_sekolah?: string | null;
  jumlah_siswa_jurusan?: number | null;
}

export interface HasilEligibilitas {
  /** null = tidak bisa ditentukan (data kurang). */
  eligible: boolean | null;
  kuota: number | null;
  sumber_kuota: 'resmi' | 'perkiraan_akreditasi' | null;
  pesan: string | null;
}

export function persenKuotaAkreditasi(akreditasi: string | null | undefined): number {
  const a = (akreditasi ?? '').trim().toUpperCase();
  return KUOTA_PER_AKREDITASI[a] ?? KUOTA_PER_AKREDITASI.lainnya;
}

export function cekEligibilitas(input: InputEligibilitas): HasilEligibilitas {
  let kuota: number | null = null;
  let sumber: HasilEligibilitas['sumber_kuota'] = null;
  if (input.kuota_jurusan != null && input.kuota_jurusan >= 0) {
    kuota = input.kuota_jurusan;
    sumber = 'resmi';
  } else if (input.jumlah_siswa_jurusan != null && input.jumlah_siswa_jurusan > 0) {
    kuota = Math.floor(input.jumlah_siswa_jurusan * persenKuotaAkreditasi(input.akreditasi_sekolah));
    sumber = 'perkiraan_akreditasi';
  }
  if (kuota === null) {
    return { eligible: null, kuota: null, sumber_kuota: null, pesan: 'Data kuota sekolah belum tersedia.' };
  }
  const eligible = input.peringkat_paralel >= 1 && input.peringkat_paralel <= kuota;
  const catatan = sumber === 'perkiraan_akreditasi' ? ' (kuota diperkirakan dari akreditasi sekolah)' : '';
  return {
    eligible,
    kuota,
    sumber_kuota: sumber,
    pesan: eligible ? (catatan ? `Masuk kuota eligible${catatan}.` : null) : `Belum masuk kuota eligible — fokus ke SNBT${catatan}.`,
  };
}

export interface InputJalur {
  tahun_lulus: number;
  /** Tahun lulus SNBP sebelumnya, jika pernah. */
  lulus_snbp_tahun?: number | null;
}

export interface HasilJalur {
  boleh_snbp: boolean;
  boleh_snbt: boolean;
  alasan: string[];
}

export function validasiJalur(input: InputJalur, tahunAcuan: number = ATURAN.tahun_acuan): HasilJalur {
  const alasan: string[] = [];
  const bolehSnbp = input.tahun_lulus === tahunAcuan;
  if (!bolehSnbp) alasan.push(`SNBP hanya untuk siswa kelas terakhir (lulus ${tahunAcuan}).`);
  const dalamRentangLulusan = input.tahun_lulus >= tahunAcuan - 2 && input.tahun_lulus <= tahunAcuan;
  if (!dalamRentangLulusan) alasan.push(`SNBT ${tahunAcuan} hanya untuk lulusan ${tahunAcuan - 2}–${tahunAcuan}.`);
  const pernahLulusSnbp =
    input.lulus_snbp_tahun != null && input.lulus_snbp_tahun >= tahunAcuan - 2 && input.lulus_snbp_tahun <= tahunAcuan;
  if (pernahLulusSnbp) alasan.push(`Lulus SNBP ${tahunAcuan - 2}–${tahunAcuan} tidak dapat ikut SNBT ${tahunAcuan}.`);
  return { boleh_snbp: bolehSnbp, boleh_snbt: dalamRentangLulusan && !pernahLulusSnbp, alasan };
}
