import { getVisualTagIndex, getWordVisualTag } from './word-visual-tags';
import { extractPrimaryEnglish, getWordSearchContext } from './word-search-context';

const NUMBER_DIGIT: Record<string, string> = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  ten: '10',
  hundred: '100',
  thousand: '1000',
};

const COLOR_HEX: Record<string, string> = {
  green: '16a34a',
  red: 'dc2626',
  blue: '2563eb',
  yellow: 'ca8a04',
  white: 'e5e7eb',
  black: '1f2937',
  orange: 'ea580c',
  purple: '9333ea',
  pink: 'db2777',
  brown: '92400e',
  gray: '6b7280',
};

const UNSPLASH_BY_TAG: Record<string, string[]> = {
  green: ['https://images.unsplash.com/photo-1519331379826-f10fd89433fb?w=400&h=400&fit=crop&q=80'],
  red: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop&q=80'],
  blue: ['https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=400&fit=crop&q=80'],
  yellow: ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop&q=80'],
  food: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&q=80'],
  water: ['https://images.unsplash.com/photo-1548839140-5a941f994e83?w=400&h=400&fit=crop&q=80'],
  cat: ['https://images.unsplash.com/photo-1514888286974-6c03e2a1cfb9?w=400&h=400&fit=crop&q=80'],
  dog: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop&q=80'],
  body: ['https://images.unsplash.com/photo-1579684385127-1ef15d558a9a?w=400&h=400&fit=crop&q=80'],
  greeting: ['https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop&q=80'],
  nature: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop&q=80'],
  learning: ['https://images.unsplash.com/photo-1524995994136-a04041a10794?w=400&h=400&fit=crop&q=80'],
  numbers: ['https://images.unsplash.com/photo-1509228468518-180dd4862744?w=400&h=400&fit=crop&q=80'],
  transport: ['https://images.unsplash.com/photo-1544627661-7574a3c2a2b5?w=400&h=400&fit=crop&q=80'],
  shopping: ['https://images.unsplash.com/photo-1472851294607-062d12411534?w=400&h=400&fit=crop&q=80'],
  weather: ['https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=400&fit=crop&q=80'],
};

function placeholdCard(native: string, english: string, tag: string): string {
  const en = extractPrimaryEnglish(english).slice(0, 18);
  const nat = native.trim().slice(0, 10);
  const label = encodeURIComponent(`${nat}\n${en || tag}`);
  return `https://placehold.co/400x400/8f74b5/ffffff?text=${label}`;
}

export function getContextualWordImageUrl(
  tag: string,
  native: string,
  english: string,
  category: string,
  wordId?: string,
  language = 'ko'
): string {
  const ctx = getWordSearchContext(native, english, category, '', language);
  const lock = getVisualTagIndex(tag, wordId, native);

  if (ctx.category === 'Numbers') {
    const digit = NUMBER_DIGIT[ctx.enKeyword] ?? ctx.enKeyword;
    const label = encodeURIComponent(`${native}\n${digit}`);
    return `https://placehold.co/400x400/6366f1/ffffff?text=${label}`;
  }

  if (COLOR_HEX[tag]) {
    const pool = UNSPLASH_BY_TAG[tag];
    if (pool?.length) return pool[lock % pool.length];
    const text = encodeURIComponent(native.trim() || tag);
    const fg = tag === 'white' || tag === 'yellow' ? '1f2937' : 'ffffff';
    return `https://placehold.co/400x400/${COLOR_HEX[tag]}/${fg}?text=${text}`;
  }

  const pool = UNSPLASH_BY_TAG[tag];
  if (pool?.length && ctx.enKeyword.length <= 20) {
    return pool[lock % pool.length];
  }

  return placeholdCard(native, english, tag);
}

export function getWordImageForTag(tag: string, wordId?: string, native?: string): string {
  const lock = getVisualTagIndex(tag, wordId, native);
  const pool = UNSPLASH_BY_TAG[tag] ?? UNSPLASH_BY_TAG.learning ?? [];
  if (pool.length) return pool[lock % pool.length];
  const label = encodeURIComponent(native?.trim().slice(0, 12) || tag);
  return `https://placehold.co/400x400/8f74b5/ffffff?text=${label}`;
}

export function getWordImageFallbacks(
  tag: string,
  wordId?: string,
  native?: string,
  english = '',
  category = 'Daily Life',
  language = 'ko'
): string[] {
  const labeled = english
    ? placeholdCard(native ?? '', english, tag)
    : getWordImageForTag(tag, wordId, native);
  const semantic = english
    ? getContextualWordImageUrl(tag, native ?? '', english, category, wordId, language)
    : getWordImageForTag(tag, wordId, native);
  const lock = getVisualTagIndex(tag, wordId, native);
  const unsplashPool = UNSPLASH_BY_TAG[tag] ?? UNSPLASH_BY_TAG.learning ?? [];
  const altUnsplash = unsplashPool[(lock + 1) % unsplashPool.length];

  return [labeled, semantic, altUnsplash].filter((url, i, arr) => url && arr.indexOf(url) === i);
}

export function resolveWordImageUrl(
  english: string,
  category: string,
  wordId?: string,
  nativeText?: string
): string {
  const tag = getWordVisualTag(nativeText ?? '', english, category, wordId);
  return getContextualWordImageUrl(tag, nativeText ?? '', english, category, wordId);
}
