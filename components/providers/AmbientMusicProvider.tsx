'use client';

import { isMusicMuted, subscribeAudioSettings } from '@/lib/audioSettings';
import {
  isBackgroundMusicBlocked,
  isBackgroundMusicPlaying,
  startBackgroundMusic,
  unlockBackgroundMusic,
} from '@/lib/backgroundMusic';
import { Music } from 'lucide-react';
import { useEffect, useState } from 'react';

export function unlockAndPlayMusic() {
  unlockBackgroundMusic();
}

export function AmbientMusicProvider({ children }: { children: React.ReactNode }) {
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    const sync = () => {
      if (isMusicMuted()) {
        setNeedsTap(false);
        return;
      }
      setNeedsTap(isBackgroundMusicBlocked() && !isBackgroundMusicPlaying());
    };

    if (!isMusicMuted()) startBackgroundMusic();

    const t1 = window.setTimeout(sync, 400);
    const t2 = window.setTimeout(sync, 1200);
    const unsub = subscribeAudioSettings(sync);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      unsub();
    };
  }, []);

  useEffect(() => {
    const resume = () => {
      if (!isMusicMuted()) unlockBackgroundMusic();
      setNeedsTap(false);
    };

    window.addEventListener('pointerdown', resume, { once: true });
    window.addEventListener('keydown', resume, { once: true });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && !isMusicMuted()) startBackgroundMusic();
    });

    return () => {
      window.removeEventListener('pointerdown', resume);
      window.removeEventListener('keydown', resume);
    };
  }, []);

  return (
    <>
      {children}
      {needsTap && (
        <button
          type="button"
          onClick={() => unlockBackgroundMusic()}
          className="fixed bottom-6 right-20 z-30 flex max-w-[240px] items-center gap-2 rounded-2xl border border-brand-100 bg-white/95 px-3 py-2 text-xs font-medium text-brand-700 shadow-soft transition hover:scale-[1.02]"
        >
          <Music className="h-4 w-4 shrink-0 text-brand-500" />
          Tap to play music
        </button>
      )}
    </>
  );
}
