'use client';

import { useEffect, useState } from 'react';

/** Runs in Chrome after Google OAuth — sends session back to the native app. */
export default function NativeAuthCallbackPage() {
  const [message, setMessage] = useState('Finishing sign-in…');
  const [returnUrl, setReturnUrl] = useState<string | null>(null);

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

        const deepLink = `com.vocabquest.app://oauth?token=${encodeURIComponent(data.token)}`;
        setReturnUrl(deepLink);
        setMessage('Returning to VocabQuest…');
        window.location.href = deepLink;
      } catch {
        setMessage('Connection error. Close this tab and try again in the app.');
      }
    })();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fff8fb] px-6 text-center">
      <div className="space-y-4">
        <p className="text-lg font-semibold text-[#5c4a6e]">{message}</p>
        {returnUrl && (
          <a
            href={returnUrl}
            className="inline-block rounded-2xl bg-gradient-to-r from-[#e8759a] to-[#7bc89c] px-5 py-3 text-sm font-semibold text-white"
          >
            Open VocabQuest
          </a>
        )}
        <p className="text-sm text-[#8b7a9e]">
          If nothing happens, tap Open VocabQuest above or switch back to the app.
        </p>
      </div>
    </main>
  );
}
