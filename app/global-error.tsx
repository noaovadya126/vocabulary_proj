'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-pastel-cream flex flex-col items-center justify-center gap-6 px-4 text-center font-sans text-brand-800">
        <div className="space-y-2 max-w-md">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="text-sm text-brand-600">A critical error occurred. Please refresh the page.</p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2.5 text-sm rounded-lg bg-brand-400 text-white hover:bg-brand-500 shadow-sm"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
