import NextAuth from 'next-auth';
import { opsiAuth } from '@/lib/auth/opsi';

const handler = NextAuth(opsiAuth);

export { handler as GET, handler as POST };
