import { getWordVisualTag } from './word-visual-tags';
import {
  buildContextualImageQuery,
  getWordSearchContext,
  needsDisambiguationContext,
  scoreContextBonus,
  titleMatchesWordContext,
} from './word-search-context';
import { titleHintsEnglishSubtitles } from './youtube-captions';
export const KNOWN_KO_DONGYO: Record<string, { videoId: string; title: string }> = {
  초록색: { videoId: '0IDKWSWkKp4', title: '초록색 동요' },
  빨간색: { videoId: '0IDKWSWkKp4', title: '색깔 동요' },
  파란색: { videoId: '0IDKWSWkKp4', title: '색깔 동요' },
  노란색: { videoId: '0IDKWSWkKp4', title: '색깔 동요' },
  다리: { videoId: '6ZXl0DFUTxU', title: '다리 동요' },
  머리: { videoId: 'vv39ouwSLtk', title: '팔과 다리 동요' },
  손: { videoId: 'vv39ouwSLtk', title: '팔과 다리 동요' },
  발: { videoId: 'vv39ouwSLtk', title: '팔과 다리 동요' },
  안녕하세요: { videoId: 'jM05xMs_0yA', title: '안녕하세요 동요' },
  감사합니다: { videoId: 'jM05xMs_0yA', title: '감사합니다 동요' },
};

const COLOR_TAGS = new Set([
  'green', 'red', 'blue', 'yellow', 'white', 'black', 'orange', 'purple', 'pink', 'brown', 'gray',
]);

const SEMANTIC_IMAGE_TAGS = new Set([
  ...COLOR_TAGS,
  'greeting', 'thankyou', 'yes', 'no', 'apology', 'learning', 'numbers', 'clock', 'colors',
  'cat', 'dog', 'food', 'water', 'body', 'nature',
]);

const KIDS_VIDEO_SIGNAL =
  /동요|어린이|유아|유치원|키즈|아기|뽀롱|뽀로로|핑크퐁|pinkfong|tayo|타요|cocomelon|nursery|kids'? song|children'?s song|子供|童謡|幼児|chanson.*enfant/i;

/** Curated 동요 — verified kids songs for common Korean words. */

const SONG_FALLBACK_SIGNAL =
  /song|노래|lyric|가사|ballad|cover|acoustic|learn korean|korean lesson|한국어 배우/i;

const SONG_FALLBACK_BLOCK =
  /official mv|teaser|trailer|드라마|drama|\bnews\b|뉴스|interview|강의|lecture|tutorial|minecraft|gameplay|축구|politics|성인|19\+|unboxing|vlog|브이로그|asmr|먹방|mukbang|podcast/i;

const IMAGE_NOISE =
  /cooking|recipe|teokpokki|spicy|restaurant|logo|icon|screenshot|diagram|chart|map|flag only|currency|stock photo model/i;

const TAG_IMAGE_NEGATIVES: Record<string, string[]> = {
  body: ['crane', 'stork', 'bird', 'table leg', 'chair leg', 'furniture', 'wooden leg', 'tripod'],
  green: ['traffic light only', 'green screen'],
  greeting: ['cooking', 'food', 'recipe'],
  yes: ['cooking', 'teokpokki', 'spicy'],
};

const KO_COLOR_IN_TITLE: Record<string, string[]> = {
  green: ['초록', '녹색', 'green'],
  red: ['빨강', '빨간', 'red'],
  blue: ['파랑', '파란', 'blue'],
  yellow: ['노랑', '노란', 'yellow'],
  white: ['하양', '흰', 'white'],
  black: ['검정', '까만', 'black'],
};

const JA_COLOR_IN_TITLE: Record<string, string[]> = {
  green: ['緑', 'みどり', 'green'],
  red: ['赤', 'あか', 'red'],
  blue: ['青', 'あお', 'blue'],
  yellow: ['黄', 'き', 'yellow'],
  white: ['白', 'しろ', 'white'],
  black: ['黒', 'くろ', 'black'],
};

export function getKnownKidsVideo(
  native: string,
  language: string
): { videoId: string; title: string } | null {
  if (language !== 'ko') return null;
  return KNOWN_KO_DONGYO[native.trim()] ?? null;
}

export function prefersSemanticImage(tag: string): boolean {
  return SEMANTIC_IMAGE_TAGS.has(tag);
}

/** Homographs always go through contextual search + contextual fallback. */
export function shouldUseSemanticImageOnly(
  native: string,
  english: string,
  tag: string,
  language = 'ko'
): boolean {
  if (needsDisambiguationContext(native, english, language)) return false;
  return prefersSemanticImage(tag);
}

export function isKidsVideoTitle(title: string): boolean {
  if (SONG_FALLBACK_BLOCK.test(title)) return false;
  return KIDS_VIDEO_SIGNAL.test(title);
}

export function isSongWithEnglishSubsTitle(title: string): boolean {
  if (SONG_FALLBACK_BLOCK.test(title)) return false;
  if (titleHintsEnglishSubtitles(title)) return true;
  return SONG_FALLBACK_SIGNAL.test(title) && /english|영어/i.test(title);
}

export function scoreSongWithEnglishSubsTitle(
  title: string,
  native: string,
  english: string,
  tag: string,
  category = '',
  language = 'ko'
): number {
  if (!isSongWithEnglishSubsTitle(title) && !titleHintsEnglishSubtitles(title)) return 0;

  const ctx = getWordSearchContext(native, english, category, '', language);
  if (!titleMatchesWordContext(title, ctx)) return 0;

  let score = 15 + scoreContextBonus(title, ctx);
  const lower = title.toLowerCase();
  const en = english.split(/[/;,]/)[0].trim().toLowerCase();

  if (titleHintsEnglishSubtitles(title)) score += 35;
  if (native && title.includes(native) && !ctx.needsDisambiguation) score += 40;
  if (/song|노래|lyric|가사/i.test(title)) score += 15;
  if (en.length > 2) {
    const escaped = en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`\\b${escaped}\\b`, 'i').test(title)) score += 20;
  }
  if (tag && lower.includes(tag)) score += 10;

  if (SONG_FALLBACK_BLOCK.test(title)) return 0;
  return Math.max(0, Math.min(100, score));
}

export function isSongFallbackRelevantEnough(
  score: number,
  title: string,
  native: string,
  hasCaptions: boolean,
  english = '',
  category = '',
  language = 'ko'
): boolean {
  const ctx = getWordSearchContext(native, english, category, '', language);
  if (!titleMatchesWordContext(title, ctx)) return false;
  if (hasCaptions && score >= 30) return true;
  if (titleHintsEnglishSubtitles(title) && score >= 35) return true;
  if (!ctx.needsDisambiguation && title.includes(native) && (titleHintsEnglishSubtitles(title) || hasCaptions)) {
    return true;
  }
  return score >= 50 && titleHintsEnglishSubtitles(title);
}

export function scoreKidsVideoTitle(
  title: string,
  native: string,
  english: string,
  tag: string,
  category = '',
  language = 'ko'
): number {
  if (!isKidsVideoTitle(title)) return 0;

  const ctx = getWordSearchContext(native, english, category, '', language);
  if (!titleMatchesWordContext(title, ctx)) return 0;

  let score = 20 + scoreContextBonus(title, ctx);
  const lower = title.toLowerCase();
  const en = english.split(/[/;,]/)[0].trim().toLowerCase();

  if (native && title.includes(native)) {
    score += ctx.needsDisambiguation ? 8 : 45;
  }
  if (/동요|dongyo/i.test(title)) score += 25;
  if (/童謡|子供の歌|douyou/i.test(title)) score += 25;
  if (/어린이|유아|유치원|nursery|kids|children|子供|幼児/i.test(title)) score += 15;
  if (/핑크퐁|pinkfong|뽀로로|pororo|타요|tayo/i.test(title)) score += 10;

  if (en.length > 2) {
    const escaped = en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`\\b${escaped}\\b`, 'i').test(title)) score += 20;
  }

  if (tag && lower.includes(tag)) score += 12;

  const colorHints = language === 'ja' ? JA_COLOR_IN_TITLE[tag] : KO_COLOR_IN_TITLE[tag];
  if (colorHints) {
    if (colorHints.some((h) => title.includes(h) || lower.includes(h.toLowerCase()))) score += 25;
    else if (COLOR_TAGS.has(tag)) score -= 35;
  }

  if (TAG_IMAGE_NEGATIVES[tag]) {
    for (const bad of TAG_IMAGE_NEGATIVES[tag]) {
      if (lower.includes(bad)) score -= 40;
    }
  }

  if (en === 'leg' || en === 'legs') {
    for (const bad of TAG_IMAGE_NEGATIVES.body) {
      if (lower.includes(bad)) score -= 50;
    }
  }

  return Math.max(0, Math.min(100, score));
}

export function isVideoRelevantEnough(
  score: number,
  title: string,
  native: string,
  english = '',
  category = '',
  language = 'ko'
): boolean {
  const ctx = getWordSearchContext(native, english, category, '', language);
  if (!titleMatchesWordContext(title, ctx)) return false;
  if (score < 40) return false;
  if (!ctx.needsDisambiguation && title.includes(native)) return true;
  if (ctx.needsDisambiguation && score >= 45) return true;
  return score >= 55 && /동요|dongyo|nursery|kids|children|어린이|子供|童謡|うた/i.test(title);
}

export function scoreWordImageTitle(
  title: string,
  native: string,
  english: string,
  tag: string,
  category = '',
  language = 'ko'
): number {
  const ctx = getWordSearchContext(native, english, category, '', language);
  const lower = title.toLowerCase();
  let score = scoreContextBonus(title, ctx);

  if (IMAGE_NOISE.test(lower)) score -= 30;
  if (native && title.includes(native)) {
    score += ctx.needsDisambiguation ? 5 : 45;
  }

  const en = english.split(/[/;,]/)[0].trim().toLowerCase();
  if (en.length > 2) {
    const escaped = en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`\\b${escaped}\\b`, 'i').test(title)) score += 30;
    else if (en.length >= 5 && lower.includes(en)) score += 12;
  }

  if (tag && lower.includes(tag)) score += 20;

  const colorHints = language === 'ja' ? JA_COLOR_IN_TITLE[tag] : KO_COLOR_IN_TITLE[tag];
  if (colorHints?.some((h) => title.includes(h) || lower.includes(h.toLowerCase()))) score += 25;

  if (TAG_IMAGE_NEGATIVES[tag]) {
    for (const bad of TAG_IMAGE_NEGATIVES[tag]) {
      if (lower.includes(bad)) score -= 50;
    }
  }

  if (en === 'leg' || en === 'legs') {
    for (const bad of TAG_IMAGE_NEGATIVES.body) {
      if (lower.includes(bad)) score -= 60;
    }
  }

  return Math.max(0, Math.min(100, score));
}

export function isImageRelevantEnough(
  score: number,
  title: string,
  native: string,
  tag: string,
  english = '',
  category = '',
  language = 'ko'
): boolean {
  const ctx = getWordSearchContext(native, english, category, '', language);
  if (!titleMatchesWordContext(title, ctx)) return false;
  if (score < 35) return false;
  if (!ctx.needsDisambiguation && native && title.includes(native)) return true;
  if (COLOR_TAGS.has(tag) && score >= 45) return true;
  return score >= 50;
}

export function buildImageSearchQuery(
  native: string,
  english: string,
  tag: string,
  language: string,
  category = '',
  exampleNative = ''
): string {
  if (COLOR_TAGS.has(tag)) {
    const en = english.split(/[/;,]/)[0].trim();
    return `${en || tag} color`;
  }
  return buildContextualImageQuery(native, english, category, tag, language, exampleNative);
}

export function resolveVisualTag(
  native: string,
  english: string,
  category: string,
  wordId?: string
): string {
  return getWordVisualTag(native, english, category, wordId);
}
