'use client';

import {
  registerServiceWorker,
  setInstallPrompt,
  type BeforeInstallPromptEvent,
} from '@/lib/pwaInstall';
import { useEffect } from 'react';

/** Registers SW early and captures the install prompt before other components mount. */
export function PwaRegister() {
  useEffect(() => {
    void registerServiceWorker();

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  return null;
}
