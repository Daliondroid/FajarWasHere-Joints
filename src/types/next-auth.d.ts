/** Tambahan tipe NextAuth: sesi membawa id pengguna internal (bukan google_sub). */
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    pengguna_id?: string;
  }
}
