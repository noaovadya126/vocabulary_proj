'use client';

import { signIn } from 'next-auth/react';
import { useEffect } from 'react';

/** Loaded inside Chrome Custom Tab — starts Google OAuth with a valid CSRF POST. */
export default function NativeSignInBridgePage() {
  useEffect(() => {
    void signIn('google', { callbackUrl: '/auth/native-callback' });
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fff8fb] px-6 text-center">
      <p className="text-lg font-semibold text-[#5c4a6e]">Opening Google sign-in…</p>
    </main>
  );
}
