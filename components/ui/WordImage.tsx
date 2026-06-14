'use client';

import { getWordImageFallbacks } from '@/lib/word-image-library';
import { buildImageCacheKey } from '@/lib/word-media-search';
import { getWordVisualTag } from '@/lib/word-visual-tags';
import { cn } from '@/lib/cn';
import { useEffect, useMemo, useState } from 'react';

interface WordImageProps {
  english: string;
  category: string;
  wordId?: string;
  nativeText?: string;
  language?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showPinterestLink?: boolean;
}

const sizes = { sm: 56, md: 72, lg: 96 };
const IMG_CACHE = 'vq_img_v5_';

export function WordImage({
  english,
  category,
  wordId,
  nativeText,
  language = 'ko',
  size = 'md',
  className,
  showPinterestLink = false,
}: WordImageProps) {
  const [srcIndex, setSrcIndex] = useState(0);
  const [remoteUrl, setRemoteUrl] = useState<string | null>(null);
  const [pinterestUrl, setPinterestUrl] = useState<string | null>(null);

  const px = sizes[size];
  const alt = nativeText || english;

  const tag = useMemo(
    () => getWordVisualTag(nativeText ?? '', english, category, wordId),
    [nativeText, english, category, wordId]
  );

  const fallbacks = useMemo(
    () => getWordImageFallbacks(tag, wordId, nativeText, english, category, language),
    [tag, wordId, nativeText, english, category, language]
  );

  useEffect(() => {
    setSrcIndex(0);
    setRemoteUrl(null);
    setPinterestUrl(null);

    if (!nativeText?.trim()) return;

    const cacheKey = `${IMG_CACHE}${buildImageCacheKey(language, nativeText.trim(), english, category)}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached) as { imageUrl?: string; pinterestUrl?: string };
        if (parsed.imageUrl) setRemoteUrl(parsed.imageUrl);
        if (parsed.pinterestUrl) setPinterestUrl(parsed.pinterestUrl);
        return;
      }
    } catch {
      /* ignore */
    }

    const params = new URLSearchParams({
      native: nativeText.trim(),
      english,
      category,
      language,
    });
    if (wordId) params.set('wordId', wordId);

    const controller = new AbortController();
    fetch(`/api/word-image?${params}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data: { imageUrl?: string; pinterestUrl?: string }) => {
        if (data.imageUrl) {
          setRemoteUrl(data.imageUrl);
          setSrcIndex(0);
        }
        if (data.pinterestUrl) setPinterestUrl(data.pinterestUrl);
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      })
      .catch(() => {});

    return () => controller.abort();
  }, [nativeText, english, category, language, wordId]);

  const sources = remoteUrl ? [remoteUrl, ...fallbacks.filter((u) => u !== remoteUrl)] : fallbacks;
  const src = sources[srcIndex];
  const failed = !src || srcIndex >= sources.length;

  if (failed) {
    return (
      <div
        className={cn('rounded-xl bg-pastel-lavender/60 flex items-center justify-center shrink-0', className)}
        style={{ width: px, height: px }}
      >
        <span className="text-lg japanese-text korean-text">{nativeText?.slice(0, 2) ?? '📖'}</span>
      </div>
    );
  }

  const imgBlock = (
    <div
      className={cn('relative rounded-xl overflow-hidden shrink-0 border border-brand-100 shadow-soft bg-white', className)}
      style={{ width: px, height: px }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={px}
        height={px}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={() => setSrcIndex((i) => i + 1)}
      />
    </div>
  );

  if (showPinterestLink && pinterestUrl) {
    return (
      <a href={pinterestUrl} target="_blank" rel="noopener noreferrer" title="Pinterest KR">
        {imgBlock}
      </a>
    );
  }

  return imgBlock;
}
