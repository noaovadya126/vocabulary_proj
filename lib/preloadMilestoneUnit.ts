import { normalizeCategory } from './categories';
import type { MilestoneWord } from './vocabulary-data';
import { buildImageCacheKey } from './word-media-search';
import { getYoutubeSearchQuery } from './word-youtube-library';

const IMG_CACHE = 'vq_img_v5_';
const YT_CACHE = 'vq_yt_v8_';
const UNIT_READY = 'vq_unit_ready_v6_';

export type PreloadProgress = {
  done: number;
  total: number;
  label: string;
};

function safeGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* ignore quota */
  }
}

export function isMilestoneUnitReady(language: string, milestoneId: string): boolean {
  return safeGet(`${UNIT_READY}${language}_${milestoneId}`) === '1';
}

export function markMilestoneUnitReady(language: string, milestoneId: string): void {
  safeSet(`${UNIT_READY}${language}_${milestoneId}`, '1');
}

async function preloadWordImage(word: MilestoneWord, language: string): Promise<void> {
  const native = word.native.trim();
  const category = normalizeCategory(word.category);
  const cacheKey = `${IMG_CACHE}${buildImageCacheKey(language, native, word.english, category)}`;
  if (safeGet(cacheKey)) return;

  const params = new URLSearchParams({
    native,
    english: word.english,
    category,
    language,
    wordId: String(word.id),
    exampleNative: word.exampleNative ?? '',
  });

  const res = await fetch(`/api/word-image?${params}`);
  if (!res.ok) return;
  const data = await res.json();
  safeSet(cacheKey, JSON.stringify(data));
}

async function preloadWordVideo(word: MilestoneWord, language: string): Promise<void> {
  if (word.youtubeId?.trim()) return;

  const native = word.native.trim();
  const cacheKey = `${YT_CACHE}${language}_${native}`;
  if (safeGet(cacheKey)) return;

  const category = normalizeCategory(word.category);
  const query = getYoutubeSearchQuery(
    native,
    word.english,
    category,
    language,
    word.exampleNative
  );
  const params = new URLSearchParams({
    q: query,
    native,
    english: word.english,
    language,
    category,
    exampleNative: word.exampleNative ?? '',
  });

  const res = await fetch(`/api/youtube-search?${params}`);
  if (!res.ok) return;
  const data = await res.json();
  if (data.videoId) safeSet(cacheKey, JSON.stringify(data));
}

async function preloadWordTts(word: MilestoneWord, language: string): Promise<void> {
  const native = word.native.trim();
  if (!native || word.audioFile) return;

  const params = new URLSearchParams({ lang: language, text: native });
  await fetch(`/api/tts?${params}`).catch(() => {});
}

/** Preload images, 동요 videos, and TTS for every word in a milestone unit. */
export async function preloadMilestoneUnit(
  language: string,
  milestoneId: string,
  words: MilestoneWord[],
  onProgress?: (progress: PreloadProgress) => void
): Promise<void> {
  if (isMilestoneUnitReady(language, milestoneId)) return;

  const tasks: Array<{ run: () => Promise<void>; label: string }> = [];
  for (const word of words) {
    const label = word.native.trim();
    tasks.push({ run: () => preloadWordImage(word, language), label });
    tasks.push({ run: () => preloadWordVideo(word, language), label });
    tasks.push({ run: () => preloadWordTts(word, language), label });
  }

  const total = tasks.length;
  let done = 0;
  onProgress?.({ done, total, label: words[0]?.native ?? '' });

  const concurrency = 5;
  let index = 0;

  async function worker() {
    while (index < tasks.length) {
      const i = index++;
      const task = tasks[i];
      try {
        await task.run();
      } catch {
        /* best-effort preload */
      }
      done += 1;
      onProgress?.({ done, total, label: task.label });
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, tasks.length || 1) }, () => worker())
  );
  markMilestoneUnitReady(language, milestoneId);
}
