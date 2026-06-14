'use client';

import { useI18nContext } from '@/contexts/I18nContext';
import { isMusicMuted, subscribeAudioSettings } from '@/lib/audioSettings';
import { unlockBackgroundMusic } from '@/lib/backgroundMusic';
import { Music } from 'lucide-react';
import { useEffect, useState } from 'react';

export function unlockAndPlayMusic() {
  unlockBackgroundMusic();
}

export function AmbientMusicProvider({ children }: { children: React.ReactNode }) {
  const { t } = useI18nContext();
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setShowHint(!isMusicMuted());
    return subscribeAudioSettings(() => setShowHint(!isMusicMuted()));
  }, []);

  useEffect(() => {
    const onInteract = () => {
      if (!isMusicMuted()) unlockBackgroundMusic();
      setShowHint(false);
    };
    window.addEventListener('pointerdown', onInteract, { once: true });
    window.addEventListener('keydown', onInteract, { once: true });
    return () => {
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('keydown', onInteract);
    };
  }, []);

  return (
    <>
      {children}
      {showHint && (
        <div className="fixed bottom-6 right-20 z-30 px-3 py-2 rounded-xl bg-white/95 border border-brand-100 shadow-soft text-xs text-brand-700 flex items-center gap-2 max-w-[240px] animate-pulse">
          <Music className="w-4 h-4 text-brand-500 shrink-0" />
          {t('music_hint', 'common')}
        </div>
      )}
    </>
  );
}
