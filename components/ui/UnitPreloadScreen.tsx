'use client';

import { CharacterIllustration } from '@/components/ui/CharacterIllustration';
import { cn } from '@/lib/cn';
import { getYoutubeEmbedUrl } from '@/lib/word-youtube-library';
import { useEffect, useMemo, useState } from 'react';

/** Cute loader clip shown while the lesson unit preloads. */
export const UNIT_PRELOAD_YOUTUBE_ID = 'v0xi4VPUkp0';

const CAPTIONS = [
  { text: 'One moment… finding your song! 🎵', emoji: '🎵' },
  { text: 'Collecting pretty pictures 📸', emoji: '✨' },
  { text: 'Almost time to start! 🚀', emoji: '🌟' },
  { text: 'Loading words… stay here! 💜', emoji: '💜' },
  { text: 'Almost there — promise! 🎀', emoji: '🎀' },
  { text: 'Fetching cute videos 🎬', emoji: '🎬' },
];

const FLOATERS = ['⭐', '✨', '💫', '🎵', '💖', '🌸'];

interface UnitPreloadScreenProps {
  done: number;
  total: number;
  currentWord?: string;
  className?: string;
}

export function UnitPreloadScreen({ done, total, currentWord, className }: UnitPreloadScreenProps) {
  const [captionIndex, setCaptionIndex] = useState(0);
  const [captionVisible, setCaptionVisible] = useState(true);

  useEffect(() => {
    const id = window.setInterval(() => {
      setCaptionVisible(false);
      window.setTimeout(() => {
        setCaptionIndex((i) => (i + 1) % CAPTIONS.length);
        setCaptionVisible(true);
      }, 280);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  const pct = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
  const headline = useMemo(() => 'Preparing your lesson unit', []);
  const caption = CAPTIONS[captionIndex];

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center cute-page-bg px-4 py-8 overflow-hidden',
        className
      )}
    >
      <div className="cute-pattern-overlay pointer-events-none absolute inset-0" aria-hidden="true" />
      {FLOATERS.map((f, i) => (
        <span
          key={i}
          className={cn(
            'pointer-events-none absolute text-xl opacity-30',
            i % 2 === 0 ? 'cute-deco-float' : 'cute-deco-bounce'
          )}
          style={{ top: `${12 + i * 14}%`, left: `${8 + i * 15}%` }}
        >
          {f}
        </span>
      ))}

      <div className="relative z-10 w-full max-w-lg text-center space-y-5">
        <CharacterIllustration variant="study" size="lg" animate="bounce" priority framed />

        <h1 className="text-xl sm:text-2xl font-bold text-brand-700">{headline}</h1>

        <div
          className={cn(
            'rounded-2xl border-2 border-pastel-pink/50 bg-white/90 px-4 py-3 text-sm font-medium text-brand-700 shadow-soft transition-opacity duration-300',
            captionVisible ? 'opacity-100' : 'opacity-0'
          )}
        >
          {caption.text}
        </div>

        <div className="rounded-2xl overflow-hidden border-2 border-pastel-green/40 bg-black/5 shadow-soft aspect-video max-h-[180px] w-full">
          <iframe
            title="Loading video"
            src={getYoutubeEmbedUrl(UNIT_PRELOAD_YOUTUBE_ID, true)}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="space-y-2">
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/80 shadow-inner">
            <div
              className="hub-progress-shimmer h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(pct, 4)}%` }}
            />
          </div>
          <p className="text-sm font-semibold text-brand-600">{pct}%</p>
          {currentWord && (
            <p className="text-xs text-brand-500">
              Loading: <span className="japanese-text korean-text font-medium">{currentWord}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
