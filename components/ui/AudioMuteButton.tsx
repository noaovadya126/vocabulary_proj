'use client';

import { isMusicMuted, setMusicMuted, subscribeAudioSettings } from '@/lib/audioSettings';
import { startBackgroundMusic, stopBackgroundMusic } from '@/lib/backgroundMusic';
import { cn } from '@/lib/cn';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AudioMuteButtonProps {
  className?: string;
  size?: 'sm' | 'md';
}

export function AudioMuteButton({ className, size = 'sm' }: AudioMuteButtonProps) {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(isMusicMuted());
    return subscribeAudioSettings(() => setMuted(isMusicMuted()));
  }, []);

  const toggle = () => {
    const next = !isMusicMuted();
    setMusicMuted(next);
    if (next) {
      stopBackgroundMusic();
    } else {
      startBackgroundMusic();
    }
  };

  const iconClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const btnClass = size === 'sm' ? 'p-2 rounded-lg' : 'p-2.5 rounded-xl';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={muted ? 'Unmute background music' : 'Mute background music'}
      title={muted ? 'Unmute music' : 'Mute music only'}
      className={cn(
        btnClass,
        'transition-colors',
        muted
          ? 'bg-pastel-peach/60 text-brand-700 hover:bg-pastel-peach'
          : 'bg-pastel-sky/60 text-brand-600 hover:bg-pastel-sky',
        className
      )}
    >
      {muted ? <VolumeX className={iconClass} /> : <Music className={iconClass} />}
    </button>
  );
}

/** Separate control for word pronunciation (always available) */
export function WordAudioHint() {
  return <Volume2 className="w-4 h-4 text-brand-500" aria-hidden />;
}
