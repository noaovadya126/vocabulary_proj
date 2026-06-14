import { getWordVisualTag } from './word-visual-tags';
import { buildContextualPinterestQuery, getPinterestHost, getWordSearchContext } from './word-search-context';
import { buildYoutubeKidsSongQuery } from './word-youtube-search';
export function buildPinterestImageQuery(
  native: string,
  language = 'ko',
  english = '',
  category = ''
): string {
  return buildContextualPinterestQuery(native, english, category, language);
}

export function getPinterestSearchUrl(
  native: string,
  language = 'ko',
  english = '',
  category = ''
): string {
  const q = buildPinterestImageQuery(native, language, english, category);
  const host = getPinterestHost(language);
  return `https://${host}/search/pins/?q=${encodeURIComponent(q)}&rs=typed`;
}

export function buildImageCacheKey(
  language: string,
  native: string,
  english: string,
  category: string
): string {
  const ctx = getWordSearchContext(native, english, category, '', language);
  if (ctx.needsDisambiguation) {
    return `${language}_${native.trim()}_${ctx.enKeyword}_${ctx.koTopic}`;
  }
  return `${language}_${native.trim()}`;
}

/** YouTube music search: sp=mAEB + "{word} 동요" */export function getYoutubeMusicSearchUrl(native: string, language: string, english = '', category = '', exampleNative = ''): string {
  const query = buildYoutubeKidsSongQuery(native, english, category, language, exampleNative);
  const params = new URLSearchParams({
    search_query: query,
    sp: 'mAEB',
  });
  return `https://www.youtube.com/results?${params.toString()}`;
}

export function buildOpenverseImageQuery(native: string, english: string, language: string): string {
  const en = english.split(/[/;,]/)[0].trim();
  const tag = getWordVisualTag(native, english, 'Daily Life');
  if (language === 'ko') {
    return `${en} ${tag} korean`.trim();
  }
  return `${native} ${en}`.trim();
}

/** Score how well media metadata matches the vocabulary word (0–100). */
export function scoreMediaRelevance(
  text: string,
  native: string,
  english: string,
  tag: string
): number {
  const blob = `${text}`.toLowerCase();
  const enWord = english.split(/[/;,]/)[0].trim().toLowerCase();
  let score = 0;

  if (native && blob.includes(native.toLowerCase())) score += 40;
  if (enWord.length > 2) {
    const escaped = enWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const wordRe = new RegExp(`\\b${escaped}\\b`, 'i');
    if (wordRe.test(text)) score += 25;
    else if (enWord.length >= 6 && blob.includes(enWord)) score += 12;
  }
  if (tag && blob.includes(tag.toLowerCase())) score += 15;
  if (/동요|노래|song|nursery|kids|children|예시|example|illustration|photo/i.test(blob)) score += 10;
  if (/동요|dongyo|nursery rhymes/i.test(blob)) score += 20;

  // Penalize obvious mismatches (e.g. "yes" inside unrelated English captions)
  if (enWord.length <= 4 && score > 0 && !native && !blob.includes(tag.toLowerCase())) {
    score = Math.max(0, score - 15);
  }

  return Math.min(100, score);
}

export function isRelevantEnough(score: number, minScore = 20): boolean {
  return score >= minScore;
}
