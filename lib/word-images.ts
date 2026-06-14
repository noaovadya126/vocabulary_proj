import { resolveWordImageUrl } from './word-image-library';

/** Semantic image matched to word meaning (native + English + category). */
export function getWordImageUrl(
  english: string,
  category: string,
  wordId?: string,
  nativeText?: string
): string {
  return resolveWordImageUrl(english, category, wordId, nativeText);
}

export function getWordImageSeed(english: string, category: string, wordId?: string, nativeText?: string): string {
  return wordId ?? `${nativeText ?? english}-${category}`;
}
