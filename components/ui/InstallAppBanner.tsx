'use client';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { Download, Share2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'vq_install_dismissed';

function isIos(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function InstallAppBanner({ className }: { className?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    if (isStandalone() || sessionStorage.getItem(DISMISS_KEY) === '1') return;

    if (isIos()) {
      setIosHint(true);
      setVisible(true);
      return;
    }

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const shareLink = async () => {
    const url = window.location.origin;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'VocabQuest',
          text: 'Learn Korean, Japanese & French with VocabQuest!',
          url,
        });
        return;
      } catch {
        /* fall through to copy */
      }
    }
    await copyLink();
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

      <div className="flex flex-col gap-3 pr-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-brand-800">Install VocabQuest</p>
          <p className="mt-0.5 text-xs text-brand-600/90">
            {iosHint
              ? 'On iPhone: tap Share, then “Add to Home Screen”.'
              : 'Add the app to your home screen for quick access — works like a native app.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="secondary" onClick={shareLink}>
            <Share2 className="h-4 w-4" />
            {copied ? 'Link copied!' : 'Share link'}
          </Button>
          {!iosHint && deferredPrompt && (
            <Button type="button" size="sm" onClick={install}>
              <Download className="h-4 w-4" />
              Install app
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
