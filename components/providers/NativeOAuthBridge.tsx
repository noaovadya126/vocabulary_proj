'use client';

import { useEffect } from 'react';
import { isNativeApp } from '@/lib/nativeApp';

/** Handles deep link return from Google OAuth in the system browser. */
export function NativeOAuthBridge() {
  useEffect(() => {
    if (!isNativeApp()) return;

    let removeAppListener: (() => void) | undefined;
    let removeBrowserListener: (() => void) | undefined;

    void (async () => {
      try {
        const { App } = await import('@capacitor/app');
        const { Browser } = await import('@capacitor/browser');

        const handleUrl = async (url: string) => {
          if (!url.startsWith('com.vocabquest.app://oauth')) return;

          const parsed = new URL(url.replace('com.vocabquest.app://', 'https://local/'));
          const token = parsed.searchParams.get('token');
          if (!token) return;

          try {
            await Browser.close();
          } catch {
            /* tab may already be closed */
          }

          window.location.href = `/api/auth/mobile-complete?token=${encodeURIComponent(token)}`;
        };

        const appListener = await App.addListener('appUrlOpen', (event) => {
          void handleUrl(event.url);
        });
        removeAppListener = () => void appListener.remove();

        const browserListener = await Browser.addListener('browserFinished', () => {
          /* user closed browser without completing — no-op */
        });
        removeBrowserListener = () => void browserListener.remove();

        const launch = await App.getLaunchUrl();
        if (launch?.url) {
          void handleUrl(launch.url);
        }
      } catch {
        /* Capacitor plugins unavailable outside native shell */
      }
    })();

    return () => {
      removeAppListener?.();
      removeBrowserListener?.();
    };
  }, []);

  return null;
}
