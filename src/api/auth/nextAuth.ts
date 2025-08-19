import type { NextAuthOptions } from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: '2.0',
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      console.log('JWT Callback - Account:', account);
      console.log('JWT Callback - Profile:', profile);
      console.log('JWT Callback - Token:', token);
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session Callback - Session:', session);
      console.log('Session Callback - Token:', token);
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.twitterId = token.sub;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // console.log('Redirect Callback - URL:', url, 'BaseURL:', baseUrl);
      // if (url.startsWith(baseUrl)) return url;
      // if (url.startsWith('/')) return `${baseUrl}${url}`;
      return '/blackpink';
    },
    async signIn({ user, account, profile }) {
      console.log('SignIn Callback - User:', user);
      console.log('SignIn Callback - Account:', account);
      console.log('SignIn Callback - Profile:', profile);
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
