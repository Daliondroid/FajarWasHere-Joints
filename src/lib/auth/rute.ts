/** Aturan rute login (F-02). Murni, dipakai middleware dan /api/auth/lanjut. */

export const RUTE = {
  beranda: '/',
  preferensi: '/preferensi',
  rekomendasi: '/rekomendasi',
} as const;

/** Prefix halaman yang wajib login. Samakan dengan `config.matcher` di src/middleware.ts. */
export const HALAMAN_WAJIB_LOGIN = ['/preferensi', '/rekomendasi', '/chat', '/test-drive'] as const;

export const SESI_DETIK = 30 * 24 * 60 * 60; // 30 hari

export function butuhLogin(pathname: string): boolean {
  return HALAMAN_WAJIB_LOGIN.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Smart routing: belum login -> beranda; sudah isi preferensi -> Hal. 8; belum -> wizard. */
export function tujuanSetelahLogin(login: boolean, sudahIsiPreferensi: boolean): string {
  if (!login) return RUTE.beranda;
  return sudahIsiPreferensi ? RUTE.rekomendasi : RUTE.preferensi;
}

/** URL beranda yang membuka modal login, dengan halaman asal (path relatif saja). */
export function urlGerbangLogin(asal: string): string {
  const kembali = asal.startsWith('/') && !asal.startsWith('//') ? asal : RUTE.beranda;
  return `${RUTE.beranda}?login=1&kembali=${encodeURIComponent(kembali)}`;
}
