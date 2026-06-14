'use client';

import { ChibiMascot } from '@/components/ui/ChibiMascot';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { WordImage } from '@/components/ui/WordImage';
import { playWordAudio } from '@/lib/playWord';
import { getWordVideoSource } from '@/lib/word-videos';
import {
  getYoutubeEmbedUrl,
  getYoutubeThumbnail,
  getYoutubeWatchUrl,
} from '@/lib/word-youtube-library';
import { cn } from '@/lib/cn';
import { useAutoPlayWord } from '@/lib/useAutoPlayWord';
import { ExternalLink, Pause, Play, Volume2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface WordVideoProps {
  language: string;
  wordId?: number | string;
  nativeText: string;
  exampleNative: string;
  exampleEnglish: string;
  category?: string;
  youtubeId?: string;
  audioFile?: string;
  imageEmoji?: string;
  english?: string;
  className?: string;
  autoPlayWord?: boolean;
}

const CACHE_PREFIX = 'vq_yt_v8_';

function sendYoutubeCommand(iframe: HTMLIFrameElement | null, func: 'playVideo' | 'pauseVideo') {
  iframe?.contentWindow?.postMessage(
    JSON.stringify({ event: 'command', func, args: '' }),
    '*'
  );
}

export function WordVideo({
  language,
  wordId,
  nativeText,
  exampleNative,
  exampleEnglish,
  category = 'Greetings',
  youtubeId: explicitYoutubeId,
  english = '',
  audioFile,
  className,
  autoPlayWord = false,
}: WordVideoProps) {
  const label = english || exampleEnglish;
  const wordKey = String(wordId ?? nativeText);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoSource = useMemo(
    () => getWordVideoSource(nativeText, label, category, language, wordKey, explicitYoutubeId, exampleNative),
    [nativeText, label, category, language, wordKey, explicitYoutubeId, exampleNative]
  );

  const searchQuery = videoSource.youtubeSearchQuery;
  const mp4Sources = videoSource.fallbacks;

  const [resolvedVideoId, setResolvedVideoId] = useState<string | null>(explicitYoutubeId?.trim() || null);
  const [videoTitle, setVideoTitle] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [hasEnglishCaptions, setHasEnglishCaptions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(() => {
    if (explicitYoutubeId?.trim()) return false;
    try {
      const cached = sessionStorage.getItem(`${CACHE_PREFIX}${language}_${nativeText.trim()}`);
      return !cached;
    } catch {
      return true;
    }
  });
  const [useMp4, setUseMp4] = useState(false);
  const [mp4Index, setMp4Index] = useState(0);
  const [playingLesson, setPlayingLesson] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [embedStarted, setEmbedStarted] = useState(!!explicitYoutubeId?.trim());
  const [embedError, setEmbedError] = useState(false);

  const mp4Url = mp4Sources[mp4Index] ?? mp4Sources[0];
  const showYoutube = !!resolvedVideoId && !useMp4 && !embedError;
  const youtubeWatchUrl = resolvedVideoId ? getYoutubeWatchUrl(resolvedVideoId) : '';
  const youtubeEmbedUrl = resolvedVideoId
    ? getYoutubeEmbedUrl(resolvedVideoId, embedStarted)
    : '';
  const thumbnailUrl = resolvedVideoId ? getYoutubeThumbnail(resolvedVideoId) : '';

  useAutoPlayWord(language, nativeText, audioFile, autoPlayWord);

  useEffect(() => {
    if (explicitYoutubeId?.trim()) {
      setResolvedVideoId(explicitYoutubeId.trim());
      setEmbedStarted(true);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    setUseMp4(false);
    setEmbedError(false);
    setEmbedStarted(false);
    setResolvedVideoId(null);

    const cacheKey = `${CACHE_PREFIX}${language}_${nativeText.trim()}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached) as {
          videoId?: string;
          title?: string;
          verified?: boolean;
          hasEnglishCaptions?: boolean;
        };
        if (parsed.videoId) {
          setResolvedVideoId(parsed.videoId);
          setVideoTitle(parsed.title ?? null);
          setVerified(!!parsed.verified);
          setHasEnglishCaptions(!!parsed.hasEnglishCaptions);
          setSearchLoading(false);
          return;
        }
      }
    } catch {
      /* ignore */
    }

    const params = new URLSearchParams({
      q: searchQuery,
      native: nativeText.trim(),
      english: label,
      language,
      category,
      exampleNative,
    });

    const controller = new AbortController();
    fetch(`/api/youtube-search?${params}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data: {
        videoId?: string | null;
        title?: string;
        verified?: boolean;
        hasEnglishCaptions?: boolean;
      }) => {
        if (data.videoId) {
          setResolvedVideoId(data.videoId);
          setVideoTitle(data.title ?? null);
          setVerified(!!data.verified);
          setHasEnglishCaptions(!!data.hasEnglishCaptions);
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
        } else {
          setUseMp4(true);
        }
      })
      .catch(() => setUseMp4(true))
      .finally(() => setSearchLoading(false));

    return () => controller.abort();
  }, [explicitYoutubeId, language, nativeText, searchQuery, label, category, exampleNative]);

  const startYoutube = useCallback(() => {
    if (!resolvedVideoId) return;
    setEmbedStarted(true);
    setVideoPlaying(true);
    window.setTimeout(() => sendYoutubeCommand(iframeRef.current, 'playVideo'), 600);
  }, [resolvedVideoId]);

  const toggleVideo = useCallback(() => {
    if (showYoutube) {
      if (!embedStarted) {
        startYoutube();
        return;
      }
      if (videoPlaying) {
        sendYoutubeCommand(iframeRef.current, 'pauseVideo');
        setVideoPlaying(false);
      } else {
        sendYoutubeCommand(iframeRef.current, 'playVideo');
        setVideoPlaying(true);
      }
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setVideoPlaying(true));
    } else {
      v.pause();
      setVideoPlaying(false);
    }
  }, [showYoutube, embedStarted, videoPlaying, startYoutube]);

  const playSentenceAudio = async () => {
    if (!exampleNative?.trim()) return;
    setPlayingLesson(true);
    try {
      await playWordAudio(language, exampleNative);
    } finally {
      setPlayingLesson(false);
    }
  };

  if (searchLoading) {
    return (
      <div className={cn('rounded-2xl border border-brand-100 bg-white overflow-hidden min-h-[200px]', className)}>
        <LoadingScreen message="Loading song video..." />
      </div>
    );
  }

  return (
    <div className={cn('rounded-2xl border border-brand-100 bg-white overflow-hidden shadow-soft', className)}>
      <div className="relative aspect-video bg-black">
        {showYoutube ? (
          embedStarted ? (
            <iframe
              ref={iframeRef}
              key={resolvedVideoId}
              src={youtubeEmbedUrl}
              title={videoTitle ?? nativeText}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={() => sendYoutubeCommand(iframeRef.current, 'playVideo')}
            />
          ) : (
            <button
              type="button"
              onClick={startYoutube}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/35 hover:bg-black/45 transition-colors w-full h-full"
              aria-label="Play video"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnailUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover -z-10"
              />
              <span className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg ring-4 ring-white/30">
                <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
              </span>
              <span className="text-white text-sm font-semibold drop-shadow">
                ▶ Play song video
              </span>
            </button>
          )
        ) : (
          <video
            ref={videoRef}
            data-word-video-mp4
            key={mp4Url}
            src={mp4Url}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            preload="metadata"
            controls
            onPlay={() => setVideoPlaying(true)}
            onPause={() => setVideoPlaying(false)}
            onError={() => {
              if (mp4Index + 1 < mp4Sources.length) setMp4Index((i) => i + 1);
              else setEmbedError(true);
            }}
          />
        )}
      </div>

      <div className="px-3 py-2 border-b border-brand-50 bg-pastel-cream/30 flex flex-wrap items-center gap-2">
        <span className="text-[10px] text-brand-600 flex-1 min-w-0 truncate">
          🎵 {searchQuery}
          {verified && <span className="text-green-600 ml-1">✓</span>}
          {hasEnglishCaptions && (
            <span className="text-blue-600 ml-1" title="English subtitles">
              CC EN
            </span>
          )}
        </span>
        <button
          type="button"
          onClick={toggleVideo}
          className="inline-flex items-center gap-1 px-3 py-2 min-h-[44px] rounded-xl bg-brand-400 text-white text-xs font-semibold shadow-sm"
        >
          {videoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" fill="currentColor" />}
          {videoPlaying ? 'Pause video' : 'Play video'}
        </button>
        <button
          type="button"
          onClick={playSentenceAudio}
          disabled={playingLesson || !exampleNative?.trim()}
          className="inline-flex items-center gap-1 px-3 py-2 min-h-[44px] rounded-xl bg-white border border-brand-200 text-brand-700 text-xs font-semibold disabled:opacity-70"
        >
          <Volume2 className="w-3.5 h-3.5" />
          Sentence audio
        </button>
        {showYoutube && youtubeWatchUrl && (
          <a
            href={youtubeWatchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl text-brand-600 text-xs hover:bg-brand-50"
            title="Open on YouTube"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            YouTube
          </a>
        )}
        <ChibiMascot mood={videoPlaying ? 'cheer' : 'study'} size="sm" />
      </div>

      {videoTitle && (
        <p className="px-3 pt-2 text-[11px] text-brand-500 truncate" title={videoTitle}>
          ▶ {videoTitle}
        </p>
      )}

      <div className="px-3 py-2 border-t border-brand-50 bg-pastel-cream/40 flex gap-3 items-center">
        <WordImage
          english={label}
          category={category}
          wordId={wordKey}
          nativeText={nativeText}
          language={language}
          size="sm"
          showPinterestLink
        />
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-brand-800 japanese-text korean-text">{nativeText}</p>
          <p className="text-xs text-brand-600 truncate">{label}</p>
        </div>
      </div>

      <div className="px-3 pb-2 text-xs">
        <p className="text-brand-800 japanese-text korean-text">{exampleNative}</p>
        <p className="text-brand-500 mt-0.5">{exampleEnglish}</p>
      </div>
    </div>
  );
}
