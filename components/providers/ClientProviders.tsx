'use client';

import { I18nProvider } from '@/contexts/I18nContext';
import { AmbientMusicProvider } from '@/components/providers/AmbientMusicProvider';
import { AuthSessionSync } from '@/components/providers/AuthSessionSync';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { PwaRegister } from '@/components/PwaRegister';
import { PracticeGamesLauncher } from '@/components/ui/PracticeGamesLauncher';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <I18nProvider>
        <AmbientMusicProvider>
          <PwaRegister />
          <AuthSessionSync />
          {children}
          <PracticeGamesLauncher global />
        </AmbientMusicProvider>
      </I18nProvider>
    </SessionProvider>
  );
}
