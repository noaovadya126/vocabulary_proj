'use client';

import { I18nProvider } from '@/contexts/I18nContext';
import { AmbientMusicProvider } from '@/components/providers/AmbientMusicProvider';
import { PracticeGamesLauncher } from '@/components/ui/PracticeGamesLauncher';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <AmbientMusicProvider>
        {children}
        <PracticeGamesLauncher global />
      </AmbientMusicProvider>
    </I18nProvider>
  );
}
