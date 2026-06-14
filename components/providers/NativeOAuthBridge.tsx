'use client';

import { useEffect } from 'react';
import { isNativeApp } from '@/lib/nativeApp';

/** Handles deep link return from Google OAuth in the system browser. */
export function NativeOAuthBridge() {
  useEffect(() => {
    if (!isNativeApp()) return;

    let removeAppListener: (() => void) | undefined;

    void (async () => {
      try {
        const { App } = await import('@capacitor/app');

        const handleUrl = (url: string) => {
          if (!url.startsWith('com.vocabquest.app://oauth')) return;

          const parsed = new URL(url.replace('com.vocabquest.app://', 'https://local/'));
          const token = parsed.searchParams.get('token');
          if (!token) return;

          window.location.href = `/api/auth/mobile-complete?token=${encodeURIComponent(token)}`;
        };

        const appListener = await App.addListener('appUrlOpen', (event) => {
          handleUrl(event.url);
        });
        removeAppListener = () => void appListener.remove();

        const launch = await App.getLaunchUrl();
        if (launch?.url) {
          handleUrl(launch.url);
        }
      } catch {
        /* Capacitor plugins unavailable outside native shell */
      }
    })();

    return () => {
      removeAppListener?.();
    };
  }, []);

  return null;
}
