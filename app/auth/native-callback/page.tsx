'use client';

import { useEffect, useState } from 'react';

/** Runs inside Chrome Custom Tab after Google OAuth — sends session back to the native app. */
export default function NativeAuthCallbackPage() {
  const [message, setMessage] = useState('Finishing sign-in…');

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch('/api/auth/mobile-token', { credentials: 'include' });
        if (!res.ok) {
          setMessage('Sign-in failed. Close this tab and try again in the app.');
          return;
        }

        const data = (await res.json()) as { token?: string };
        if (!data.token) {
          setMessage('Sign-in failed. Close this tab and try again in the app.');
          return;
        }

        setMessage('Returning to VocabQuest…');
        window.location.href = `com.vocabquest.app://oauth?token=${encodeURIComponent(data.token)}`;
      } catch {
        setMessage('Connection error. Close this tab and try again in the app.');
      }
    })();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fff8fb] px-6 text-center">
      <div>
        <p className="text-lg font-semibold text-[#5c4a6e]">{message}</p>
        <p className="mt-2 text-sm text-[#8b7a9e]">You can close this browser tab if nothing happens.</p>
      </div>
    </main>
  );
}
