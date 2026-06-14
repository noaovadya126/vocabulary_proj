import { normalizeCategory } from './categories';
import { buildContextualYoutubeQuery } from './word-search-context';
import { getWordVisualTag } from './word-visual-tags';

/** Korean body-part words (exact match). */
const KO_BODY_PARTS = new Set([
  '머리', '얼굴', '눈', '코', '입', '귀', '손', '발', '다리', '팔', '배', '가슴', '목',
  '어깨', '무릎', '치아', '이', '혀', '손가락', '발가락', '허리', '등', '몸', '신체',
  '눈썹', '손톱', '발톱', '피부', '심장', '폐', '간', '골반', '종아리', '팔꿈치', '손목', '발목',
]);

const JA_BODY_PARTS = new Set([
  '頭', '顔', '目', '鼻', '口', '耳', '手', '足', '脚', '腕', 'お腹', '胸', '首', '肩', '膝', '歯', '体', '指',
]);

const EN_BODY_WORDS = [
  'head', 'face', 'eye', 'eyes', 'nose', 'mouth', 'ear', 'ears', 'hand', 'hands', 'foot', 'feet',
  'leg', 'legs', 'arm', 'arms', 'stomach', 'chest', 'neck', 'shoulder', 'knee', 'tooth', 'teeth',
  'body', 'finger', 'toe', 'back', 'skin', 'heart', 'lung',
];

const COLOR_TAGS = new Set([
  'green', 'red', 'blue', 'yellow', 'white', 'black', 'orange', 'purple', 'pink', 'brown', 'gray', 'colors',
]);

function englishHintsBody(english: string): boolean {
  const lower = english.toLowerCase();
  return EN_BODY_WORDS.some((w) => {
    const re = new RegExp(`\\b${w}\\b`);
    return re.test(lower) || lower.includes(`${w} `) || lower.startsWith(w);
  });
}

/** Detect body-part vocabulary (handles ambiguous Korean e.g. 눈 = eye vs snow). */
export function isBodyPartWord(
  native: string,
  english: string,
  category: string,
  exampleNative = ''
): boolean {
  const n = native.trim();
  const ex = exampleNative.trim();
  const en = english.toLowerCase();

  if (ex.includes('신체') || ex.includes('身体')) return true;
  if (englishHintsBody(english)) return true;

  if (n === '눈') {
    if (en.includes('snow')) return false;
    if (en.includes('eye')) return true;
    return ex.includes('신체') || ex.includes('작다') || ex.includes('크다');
  }

  if (KO_BODY_PARTS.has(n)) return true;
  if (JA_BODY_PARTS.has(n)) return true;

  const tag = getWordVisualTag(native, english, category);
  return tag === 'body';
}

function isColorWord(native: string, english: string, category: string): boolean {
  const tag = getWordVisualTag(native, english, category);
  if (COLOR_TAGS.has(tag)) return true;
  return /색|色|color/i.test(`${native} ${english}`);
}

/** Build YouTube search query — Korean: "{word} 동요" (e.g. 초록색 동요, 다리 동요). */
export function buildYoutubeKidsSongQuery(
  native: string,
  english: string,
  category: string,
  language: string,
  exampleNative = ''
): string {
  const word = native.trim();
  const lang = language.toLowerCase();

  if (lang === 'ko' || lang === 'ja') {
    const suffix = lang === 'ko' ? '동요' : '子供の歌';
    return buildContextualYoutubeQuery(word, english, category, language, exampleNative, suffix);
  }

  if (isBodyPartWord(word, english, category, exampleNative)) {
    if (lang === 'fr') return `${word} corps chanson enfants`;
    return `${word} body parts kids song`;
  }

  if (isColorWord(word, english, category)) {
    return `${word} color kids song`;
  }
  if (lang === 'fr') return `${word} chanson enfants`;

  return `${word} ${english.split(/[,;(]/)[0].trim()} kids song`;
}

/** Direct YouTube search results URL (music filter sp=mAEB). */
export function getYoutubeSearchResultsUrl(
  query: string,
  native = '',
  language = 'ko',
  english = '',
  category = ''
): string {
  const searchQuery = native
    ? buildYoutubeKidsSongQuery(native, english, category, language)
    : query;
  const params = new URLSearchParams({
    search_query: searchQuery,
    sp: 'mAEB',
  });
  return `https://www.youtube.com/results?${params.toString()}`;
}

export function getYoutubeSearchEmbedUrl(query: string, autoplay = false): string {
  const params = new URLSearchParams({
    listType: 'search',
    list: query,
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });
  if (autoplay) params.set('autoplay', '1');
  return `https://www.youtube-nocookie.com/embed?${params.toString()}`;
}

export const KIDS_SONG_TITLE_KEYWORDS = [
  '동요', '어린이', '노래', '뽀로로', '티니핑', '로티', '핑크퐁', '만화', '배워', 'learn',
  'kids', 'children', 'song', 'nursery', '子供', '童謡', 'うた', 'chanson', 'enfants',
];
