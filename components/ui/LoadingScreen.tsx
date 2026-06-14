'use client';



import { startBackgroundMusic } from '@/lib/backgroundMusic';

import { isMusicMuted } from '@/lib/audioSettings';

import { AudioMuteButton } from '@/components/ui/AudioMuteButton';

import { CharacterIllustration } from '@/components/ui/CharacterIllustration';

import { PastelBackground } from '@/components/ui/PastelBackground';

import { useEffect } from 'react';



export function LoadingScreen({ message = 'Loading...' }: { message?: string }) {

  useEffect(() => {
    if (!isMusicMuted()) {
      startBackgroundMusic();
    }
  }, []);



  return (

    <PastelBackground variant="selection">

      <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-4">

        <div className="absolute right-4 top-4">

          <AudioMuteButton size="md" />

        </div>



        <CharacterIllustration variant="hearts" size="lg" animate="bounce" priority />



        <div className="loading-spinner" aria-hidden="true" />



        <div className="space-y-1 text-center">

          <p className="text-base font-semibold text-brand-700">{message}</p>

          <p className="text-sm text-brand-500/70">VocabQuest ✿</p>

        </div>

      </div>

    </PastelBackground>

  );

}

