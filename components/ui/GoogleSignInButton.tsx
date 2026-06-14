'use client';

import { cn } from '@/lib/cn';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export function GoogleSignInButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await signIn('google', { callbackUrl: '/auth' });
    } finally {
      setLoading(false);
    }
  };

  return (
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
      {loading ? 'Connecting...' : 'Continue with Google'}
    </button>
  );
}
