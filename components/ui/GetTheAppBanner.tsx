'use client';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { GOOGLE_PLAY_URL, isNativeApp } from '@/lib/nativeApp';
import { Smartphone, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const DISMISS_KEY = 'vq_get_app_dismissed';

export function GetTheAppBanner({ className }: { className?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isNativeApp() || sessionStorage.getItem(DISMISS_KEY) === '1') return;
    setVisible(true);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border-2 border-pastel-pink/60 bg-gradient-to-r from-white via-pastel-pink-light/70 to-pastel-green-light/60 p-4 shadow-soft',
        className
      )}
    >
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-3 top-3 rounded-full p-1 text-brand-400 hover:bg-white/70 hover:text-brand-600"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex flex-col gap-3 pr-8">
        <div>
          <p className="text-sm font-bold text-brand-800">Get the VocabQuest app</p>
          <p className="mt-0.5 text-xs text-brand-600/90">
            Install the real Android app from Google Play — not a browser shortcut.
          </p>
        </div>

        <div className="rounded-2xl bg-white/80 px-4 py-3 text-xs text-brand-700">
          <p className="font-semibold">Android (Google Play)</p>
          {GOOGLE_PLAY_URL ? (
            <p className="mt-1">Search &quot;VocabQuest&quot; on Google Play or tap the button below.</p>
          ) : (
            <p className="mt-1">
              The app is being prepared for Google Play. For now, ask the developer for the APK or
              build it from the project (see <code className="text-[10px]">NATIVE-APP-HE.md</code>).
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {GOOGLE_PLAY_URL ? (
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-brand-300/30 bg-gradient-to-r from-brand-400 to-brand-500 px-3 py-1.5 text-sm font-semibold text-white shadow-cute transition-all hover:from-brand-500 hover:to-brand-600 active:scale-[0.98]"
            >
              <Smartphone className="h-4 w-4" />
              Get on Google Play
            </a>
          ) : (
            <Button type="button" size="sm" variant="secondary" disabled>
              <Smartphone className="h-4 w-4" />
              Coming to Google Play
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
