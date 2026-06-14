'use client';

import { Button } from '@/components/ui/Button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-pastel-cream flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/80 shadow-soft flex items-center justify-center">
        <span className="text-2xl" aria-hidden="true">
          😵
        </span>
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="text-xl font-semibold text-brand-800">Something went wrong</h1>
        <p className="text-brand-600 text-sm">
          The page hit an error. Try again, or go back to the home screen.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={reset}>Try again</Button>
        <Button variant="secondary" onClick={() => (window.location.href = '/')}>
          Go home
        </Button>
      </div>
    </div>
  );
}
