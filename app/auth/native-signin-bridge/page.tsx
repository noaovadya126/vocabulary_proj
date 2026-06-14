'use client';

import { signIn } from 'next-auth/react';
import { useEffect, useRef } from 'react';

/** Loaded in Chrome (system browser) — starts Google OAuth with a valid CSRF POST. */
export default function NativeSignInBridgePage() {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void signIn('google', { callbackUrl: '/auth/native-callback' });
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fff8fb] px-6 text-center">
      <div className="space-y-2">
        <p className="text-lg font-semibold text-[#5c4a6e]">Opening Google sign-in…</p>
        <p className="text-sm text-[#8b7a9e]">
          Complete sign-in in Chrome, then you will return to VocabQuest automatically.
        </p>
      </div>
    </main>
  );
}
