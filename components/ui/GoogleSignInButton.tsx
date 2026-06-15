'use client';

import { cn } from '@/lib/cn';
import { openNativeGoogleSignIn, shouldUseExternalGoogleSignIn } from '@/lib/nativeApp';
import { signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface AuthStatus {
  googleEnabled: boolean;
  databaseEnabled: boolean;
}

export function GoogleSignInButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<AuthStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/status')
      .then((r) => r.json())
      .then((data: AuthStatus) => setStatus(data))
      .catch(() => setStatus({ googleEnabled: false, databaseEnabled: false }));
  }, []);

  const handleClick = async () => {
    if (!status?.googleEnabled) return;
    setLoading(true);
    setError(null);
    try {
      if (shouldUseExternalGoogleSignIn()) {
        const result = await openNativeGoogleSignIn();
        if (!result.ok) {
          setError(result.message);
        }
        return;
      }
      await signIn('google', { callbackUrl: '/auth' });
    } finally {
      setLoading(false);
    }
  };

  if (!status) {
    return (
      <div className={cn('h-12 w-full animate-pulse rounded-2xl bg-pastel-pink/40', className)} />
    );
  }

  if (!status.googleEnabled) {
    return (
      <div
        className={cn(
          'rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-xs text-amber-900',
          className
        )}
      >
        Google sign-in is not set up on the live server yet. In{' '}
        <a
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Vercel
        </a>{' '}
        → your project → Settings → Environment Variables, add:{' '}
        <strong>GOOGLE_CLIENT_ID</strong>, <strong>GOOGLE_CLIENT_SECRET</strong>,{' '}
        <strong>NEXTAUTH_SECRET</strong>, and <strong>NEXTAUTH_URL</strong> (
        <code className="text-[10px]">https://vocabulary-proj.vercel.app</code>
        ). Then Redeploy. See <strong>SETUP-HE.md</strong> in the repo for step-by-step.
      </div>
    );
  }

  const label = loading
    ? shouldUseExternalGoogleSignIn()
      ? 'Opening Chrome…'
      : 'Connecting...'
    : 'Continue with Google';

  return (
    <div className={cn('space-y-3', className)}>
      <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={cn(
        'flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3',
        'text-sm font-semibold text-slate-700 shadow-soft transition hover:bg-slate-50 hover:shadow-medium',
        'disabled:cursor-wait disabled:opacity-70',
        className
      )}
    >
      <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.083 36 24 36c-7.632 0-14-6.368-14-14s6.368-14 14-14c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.64 6.053 29.082 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.64 6.053 29.082 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.048 0-9.449-3.317-10.964-7.963l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.05 12.05 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
      </svg>
      {label}
      {!status.databaseEnabled && (
        <span className="sr-only">Cloud save unavailable until database is configured.</span>
      )}
    </button>
      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50/90 px-3 py-2 text-xs text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}
