/**
 * Konfigurasi NextAuth v4: Google, sesi JWT di cookie HttpOnly selama 30 hari (F-02).
 * Tidak memakai adapter: pengguna di-upsert sendiri ke tabel `pengguna` saat login.
 */
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { repoAkunSupabase } from '@/lib/db/repo_akun_supabase';
import { profilGoogleValid, sinkronPengguna, type ProfilGoogle } from '@/lib/layanan/akun';
import { RUTE, SESI_DETIK } from './rute';

export const opsiAuth: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: SESI_DETIK },
  jwt: { maxAge: SESI_DETIK },
  pages: { signIn: RUTE.beranda, error: RUTE.beranda },
  callbacks: {
    async signIn({ account, profile }) {
      return account?.provider === 'google' && profilGoogleValid(profile as ProfilGoogle | undefined);
    },
    async jwt({ token, account, profile }) {
      // `account` hanya ada saat login pertama di sesi ini.
      if (account?.provider === 'google') {
        token.pengguna_id = await sinkronPengguna(profile as ProfilGoogle, repoAkunSupabase);
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: { id: token.pengguna_id ?? '', name: session.user?.name ?? null, email: session.user?.email ?? null },
      };
    },
  },
};
