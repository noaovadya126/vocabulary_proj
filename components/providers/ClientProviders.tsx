'use client';

import { I18nProvider } from '@/contexts/I18nContext';
import { AmbientMusicProvider } from '@/components/providers/AmbientMusicProvider';
import { AuthSessionSync } from '@/components/providers/AuthSessionSync';
import { NativeOAuthBridge } from '@/components/providers/NativeOAuthBridge';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { PracticeGamesLauncher } from '@/components/ui/PracticeGamesLauncher';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <I18nProvider>
        <AmbientMusicProvider>
          <AuthSessionSync />
          <NativeOAuthBridge />
          {children}
          <PracticeGamesLauncher global />
        </AmbientMusicProvider>
      </I18nProvider>
    </SessionProvider>
  );
}
