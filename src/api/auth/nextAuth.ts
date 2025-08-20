import type { NextAuthOptions } from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: '2.0',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        token: { label: 'Token', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.token) return null;
        // Attach token on the user object; will be propagated in jwt callback
        return { id: 'custom-credentials', token: credentials.token } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // From Twitter OAuth
      if (account) {
        token.accessToken = account.access_token || token.accessToken;
        token.refreshToken = account.refresh_token || token.refreshToken;
      }
      // From Credentials sign-in
      if (user && (user as any).token) {
        token.accessToken = (user as any).token;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session Callback - Session:', session);
      console.log('Session Callback - Token:', token);
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.twitterId = token.sub;
      // Add the username to the session with @ prefix
      (session as any).accessToken = token.accessToken as string | undefined;
      (session as any).refreshToken = token.refreshToken as string | undefined;
      (session as any).twitterId = token.sub as string | undefined;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return '/blackpink';
    },
    async signIn({ user, account, profile }) {
      return true;
    },
  },
  pages: {
    signIn: '/auth',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      console.error('NextAuth Error:', code, metadata);
    },
    warn(code) {
      console.warn('NextAuth Warning:', code);
    },
  },
};
