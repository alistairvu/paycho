import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/utils/prisma';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],

  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,

  pages: {
    signIn: '/auth/signin',
  },

  callbacks: {
    session: async ({ session, user }: any) => {
      session.user.id = user.id;
      return Promise.resolve(session);
    },
  },
});
