import { normalizeCategory } from './categories';
import { getVisualTagIndex, getWordVisualTag } from './word-visual-tags';
import { getYoutubeSearchQuery } from './word-youtube-library';

/** Tag-matched stock MP4 fallbacks when YouTube search fails */
const MP4_BY_TAG: Record<string, string[]> = {
  green: [
    'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
  ],
  red: ['https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-red-apple-1084-large.mp4'],
  blue: ['https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beach-and-the-sea-427-large.mp4'],
  yellow: ['https://assets.mixkit.co/videos/preview/mixkit-sun-over-hills-1183-large.mp4'],
  food: ['https://assets.mixkit.co/videos/preview/mixkit-plate-of-healthy-food-1040-large.mp4'],
  water: ['https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4'],
  body: ['https://assets.mixkit.co/videos/preview/mixkit-little-girl-drawing-4636-large.mp4'],
  greeting: ['https://assets.mixkit.co/videos/preview/mixkit-group-of-friends-partying-happily-4640-large.mp4'],
  nature: ['https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4'],
};

const VIDEO_POOL: string[] = [
  'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-young-woman-studying-online-4635-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-plate-of-healthy-food-1040-large.mp4',
];

export interface WordVideoSource {
  type: 'youtube' | 'mp4';
  youtubeId?: string;
  youtubeSearchQuery: string;
  mp4Url?: string;
  fallbacks: string[];
}

function pickMp4ForTag(tag: string, wordId?: string, native?: string): string {
  const pool = MP4_BY_TAG[tag] ?? VIDEO_POOL;
  const idx = getVisualTagIndex(tag, wordId, native) % pool.length;
  return pool[idx];
}

export function getWordVideoSource(
  native: string,
  english: string,
  category: string,
  language: string,
  wordId?: string,
  explicitYoutubeId?: string,
  exampleNative = ''
): WordVideoSource {
  const tag = getWordVisualTag(native, english, category, wordId);
  const primaryMp4 = pickMp4ForTag(tag, wordId, native);
  const searchQuery = getYoutubeSearchQuery(native, english, category, language, exampleNative);
  const tagPool = MP4_BY_TAG[tag] ?? VIDEO_POOL;
  const fallbacks = [primaryMp4, ...tagPool.filter((u) => u !== primaryMp4), ...VIDEO_POOL];

  return {
    type: 'youtube',
    youtubeId: explicitYoutubeId?.trim() || undefined,
    youtubeSearchQuery: searchQuery,
    mp4Url: primaryMp4,
    fallbacks: [...new Set(fallbacks)],
  };
}

export function getWordVideoUrl(
  english: string,
  category: string,
  wordId?: string,
  nativeText?: string,
  language = 'ko'
): string {
  const source = getWordVideoSource(nativeText ?? '', english, category, language, wordId);
  return source.mp4Url ?? source.fallbacks[0] ?? VIDEO_POOL[0];
}

export function getWordVideoFallbacks(
  english: string,
  category: string,
  wordId?: string,
  nativeText?: string,
  language = 'ko'
): string[] {
  const source = getWordVideoSource(nativeText ?? '', english, category, language, wordId);
  return source.fallbacks;
}

export function getWordVideoUrlLegacy(category: string): string {
  const cat = normalizeCategory(category);
  const tagMap: Record<string, string> = {
    Greetings: 'greeting',
    'Food & Drink': 'food',
    'Weather & Nature': 'nature',
    Transport: 'transport',
  };
  return pickMp4ForTag(tagMap[cat] ?? 'nature');
}
