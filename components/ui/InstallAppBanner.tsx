'use client';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import {
  getInstallPlatform,
  getInstallPrompt,
  isStandaloneApp,
  subscribeInstallPrompt,
  triggerInstall,
} from '@/lib/pwaInstall';
import { Download, Share2, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const DISMISS_KEY = 'vq_install_dismissed';

export function InstallAppBanner({ className }: { className?: string }) {
  const [visible, setVisible] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [copied, setCopied] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const platform = getInstallPlatform();

  const syncPrompt = useCallback(() => {
    setCanInstall(!!getInstallPrompt());
  }, []);

  useEffect(() => {
    if (isStandaloneApp() || sessionStorage.getItem(DISMISS_KEY) === '1') return;
    setVisible(true);
    syncPrompt();
    return subscribeInstallPrompt(syncPrompt);
  }, [syncPrompt]);

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  };

  const install = async () => {
    setInstalling(true);
    try {
      const outcome = await triggerInstall();
      if (outcome === 'accepted') {
        setVisible(false);
        return;
      }
      if (outcome === 'unavailable') {
        setShowManual(true);
      }
    } finally {
      setInstalling(false);
    }
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

  if (!visible) return null;

  const manualSteps =
    platform === 'ios'
      ? [
          '1. Tap the Share button (□↑) at the bottom of Safari',
          '2. Scroll and tap "Add to Home Screen"',
          '3. Tap "Add" — VocabQuest appears on your home screen',
        ]
      : platform === 'android'
        ? [
            '1. Open this site in Chrome (not an in-app browser)',
            '2. Tap the menu (⋮) at the top right',
            '3. Tap "Install app" or "Add to Home screen"',
          ]
        : [
            '1. Look for the install icon (⊕) in the address bar',
            '2. Or open Chrome menu → "Install VocabQuest"',
            '3. Or use Edge → Apps → "Install this site as an app"',
          ];

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
          <p className="text-sm font-bold text-brand-800">Install VocabQuest on your phone</p>
          <p className="mt-0.5 text-xs text-brand-600/90">
            Add to home screen — opens like a real app, full screen.
          </p>
        </div>

        {(showManual || (platform !== 'desktop' && !canInstall)) && (
          <ol className="list-decimal space-y-1 rounded-2xl bg-white/80 px-4 py-3 text-xs text-brand-700">
            {manualSteps.map((step) => (
              <li key={step} className="ml-4">
                {step}
              </li>
            ))}
          </ol>
        )}

        <div className="flex flex-wrap gap-2">
          {canInstall && (
            <Button type="button" size="sm" onClick={install} disabled={installing}>
              <Download className="h-4 w-4" />
              {installing ? 'Installing...' : 'Install now'}
            </Button>
          )}
          {!canInstall && platform !== 'ios' && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setShowManual((v) => !v)}
            >
              <Download className="h-4 w-4" />
              How to install
            </Button>
          )}
          <Button type="button" size="sm" variant="secondary" onClick={copyLink}>
            <Share2 className="h-4 w-4" />
            {copied ? 'Link copied!' : 'Copy link'}
          </Button>
        </div>
      </div>
    </div>
  );
}
