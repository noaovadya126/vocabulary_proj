'use client';

import { useEffect, useRef } from 'react';
import { playWordAudio, stopWordAudio } from './playWord';

/** Auto-plays pronunciation when the word text changes (e.g. new card / question). */
export function useAutoPlayWord(
  language: string,
  nativeText: string | undefined,
  audioFile?: string,
  enabled = true
) {
  const playedRef = useRef<string>('');

  useEffect(() => {
    if (!enabled || !nativeText?.trim()) return;

    const key = `${language}:${nativeText}`;
    if (playedRef.current === key) return;
    playedRef.current = key;

    const timer = setTimeout(() => {
      playWordAudio(language, nativeText, audioFile).catch(() => {});
    }, 350);

    return () => {
      clearTimeout(timer);
    };
  }, [language, nativeText, audioFile, enabled]);

  useEffect(() => () => stopWordAudio(), []);
}
