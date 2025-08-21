import type { NextAuthOptions } from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: '2.0',
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }

      // Cast profile to expected structure for Twitter v2
      const twitterProfile = profile as {
        data?: {
          username?: string;
        };
      };

      if (twitterProfile?.data?.username) {
        token.username = twitterProfile.data.username;
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.twitterId = token.sub;
      // Add the username to the session with @ prefix
      session.username = token.username ? `@${token.username}` : undefined;
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      return `${baseUrl}/`;
    },
    async signIn({ user, account, profile }) {
      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
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
