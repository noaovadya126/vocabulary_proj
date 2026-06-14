import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-pastel-cream flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/80 shadow-soft flex items-center justify-center">
        <span className="text-2xl" aria-hidden="true">
          🗺️
        </span>
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="text-xl font-semibold text-brand-800">Page not found</h1>
        <p className="text-brand-600 text-sm">This page does not exist or was moved.</p>
      </div>
      <Link href="/">
        <Button>Go home</Button>
      </Link>
    </div>
  );
}
