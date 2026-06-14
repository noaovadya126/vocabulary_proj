import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

function env(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function isGoogleClientId(value: string): boolean {
  return /\.apps\.googleusercontent\.com$/i.test(value);
}

function isGoogleClientSecret(value: string): boolean {
  return /^GOCSPX-/i.test(value);
}

function resolveGoogleCredentials(): { clientId?: string; clientSecret?: string } {
  let clientId = env('GOOGLE_CLIENT_ID');
  let clientSecret = env('GOOGLE_CLIENT_SECRET');

  // Common Vercel mistake: ID and secret pasted into the wrong variables
  if (clientId && clientSecret && !isGoogleClientId(clientId) && isGoogleClientId(clientSecret)) {
    [clientId, clientSecret] = [clientSecret, clientId];
  }

  if (clientId && !isGoogleClientId(clientId)) clientId = undefined;
  if (clientSecret && !isGoogleClientSecret(clientSecret)) clientSecret = undefined;

  return { clientId, clientSecret };
}

const { clientId: googleId, clientSecret: googleSecret } = resolveGoogleCredentials();
const authSecret = env('NEXTAUTH_SECRET');

export const authOptions: NextAuthOptions = {
  providers:
    googleId && googleSecret
      ? [
          GoogleProvider({
            clientId: googleId,
            clientSecret: googleSecret,
            authorization: {
              params: {
                prompt: 'consent',
                access_type: 'offline',
                response_type: 'code',
              },
            },
          }),
        ]
      : [],
  secret: authSecret,
  pages: {
    signIn: '/auth',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

export function isGoogleAuthConfigured(): boolean {
  return !!(googleId && googleSecret && authSecret);
}
