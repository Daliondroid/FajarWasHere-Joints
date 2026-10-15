/**
 * Gerbang login (F-02): halaman wajib login tanpa sesi -> beranda dengan modal login.
 * Hanya mengecek token JWT (tanpa DB); API tetap memeriksa sesi sendiri.
 */
import { getToken } from 'next-auth/jwt';
import { NextResponse, type NextRequest } from 'next/server';
import { butuhLogin, urlGerbangLogin } from '@/lib/auth/rute';

export async function middleware(req: NextRequest) {
  if (!butuhLogin(req.nextUrl.pathname)) return NextResponse.next();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (token?.pengguna_id) return NextResponse.next();
  return NextResponse.redirect(new URL(urlGerbangLogin(req.nextUrl.pathname), req.url));
}

// Harus literal statis; samakan dengan HALAMAN_WAJIB_LOGIN di src/lib/auth/rute.ts.
export const config = {
  matcher: ['/preferensi/:path*', '/rekomendasi/:path*', '/chat/:path*', '/test-drive/:path*'],
};
