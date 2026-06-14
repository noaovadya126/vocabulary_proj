import { normalizeCategory, type StandardCategory } from './categories';

export interface WordSearchContext {
  native: string;
  english: string;
  category: string;
  language: string;
  enKeyword: string;
  /** Topic label in the study language (field name kept for compat). */
  koTopic: string;
  contextPhrase: string;
  needsDisambiguation: boolean;
  titleMustMatch?: RegExp;
  titleBlock?: RegExp;
}

const CATEGORY_KO_TOPIC: Record<StandardCategory, string> = {
  Greetings: '인사',
  'People & Family': '가족',
  'Food & Drink': '음식',
  Places: '장소',
  'Time & Dates': '시간 날짜',
  Numbers: '숫자',
  Actions: '동작',
  Descriptions: '형용사',
  'Weather & Nature': '날씨',
  Transport: '교통',
  Shopping: '쇼핑',
  'Daily Life': '생활',
  'Study & Work': '공부',
  Feelings: '감정',
};

const CATEGORY_JA_TOPIC: Record<StandardCategory, string> = {
  Greetings: 'あいさつ',
  'People & Family': '家族',
  'Food & Drink': '食べ物',
  Places: '場所',
  'Time & Dates': '時間',
  Numbers: '数字',
  Actions: '動作',
  Descriptions: '形容詞',
  'Weather & Nature': '天気',
  Transport: '交通',
  Shopping: '買い物',
  'Daily Life': '生活',
  'Study & Work': '勉強',
  Feelings: '気持ち',
};

const KO_HOMOGRAPH_RULES: Record<string, Pick<WordSearchContext, 'titleMustMatch' | 'titleBlock'>> = {
  '일|one': {
    titleMustMatch: /숫자|one|하나|넘버|number|count|sino|1\b/i,
    titleBlock: /일본|japan|japanese|매일|every\s*day|하루|일요일|sunday|직장|work|office|근무/i,
  },
  '일|day': {
    titleMustMatch: /날|하루|day|date|calendar|요일/i,
    titleBlock: /일본|japan|숫자|number|one\b/i,
  },
  '이|two': {
    titleMustMatch: /숫자|two|둘|number|2\b/i,
    titleBlock: /치아|tooth|teeth|이것|this|이름/i,
  },
  '사|four': {
    titleMustMatch: /숫자|four|넷|number|4\b/i,
    titleBlock: /회사|company|business|death|사망/i,
  },
  '오|five': {
    titleMustMatch: /숫자|five|다섯|number|5\b/i,
    titleBlock: /오후|afternoon|come|오다/i,
  },
  '눈|eye': {
    titleMustMatch: /눈|eye|eyes|신체|body|face/i,
    titleBlock: /snow|눈\s*오|겨울|winter/i,
  },
  '눈|snow': {
    titleMustMatch: /snow|눈|겨울|winter/i,
    titleBlock: /eye|eyes|신체|body|face/i,
  },
};

const JA_HOMOGRAPH_RULES: Record<string, Pick<WordSearchContext, 'titleMustMatch' | 'titleBlock'>> = {
  '一|one': {
    titleMustMatch: /一|one|number|数字|ひとつ|いち|1\b/i,
    titleBlock: /一月|日曜|日本|first day of/i,
  },
  '二|two': {
    titleMustMatch: /二|two|number|数字|ふたつ|2\b/i,
    titleBlock: /二月/i,
  },
  '日|day': {
    titleMustMatch: /日|day|date|calendar|ひ|曜/i,
    titleBlock: /日本|nippon|number|一/i,
  },
  '日|sun': {
    titleMustMatch: /日|sun|太陽|solar/i,
    titleBlock: /日本|number|月/i,
  },
  '目|eye': {
    titleMustMatch: /目|eye|eyes|me\b|まぶた/i,
    titleBlock: /目的|target/i,
  },
  '口|mouth': {
    titleMustMatch: /口|mouth|kuchi|くち/i,
    titleBlock: /入口|出口|gate/i,
  },
  '手|hand': {
    titleMustMatch: /手|hand|te\b|て\b/i,
    titleBlock: /手伝/i,
  },
  '足|foot': {
    titleMustMatch: /足|foot|feet|leg|ashi|あし/i,
    titleBlock: /足り|enough/i,
  },
  '足|leg': {
    titleMustMatch: /足|leg|legs|ashi|あし/i,
    titleBlock: /足り|enough/i,
  },
  '橋|bridge': {
    titleMustMatch: /橋|bridge|hashi|はし/i,
    titleBlock: /箸|chopstick/i,
  },
  '箸|chopstick': {
    titleMustMatch: /箸|chopstick|hashi|はし/i,
    titleBlock: /橋|bridge/i,
  },
};

export function getCategoryTopic(category: StandardCategory, language: string): string {
  if (language === 'ja') return CATEGORY_JA_TOPIC[category] ?? '';
  return CATEGORY_KO_TOPIC[category] ?? '';
}

export function getKidsSongSuffix(language: string): string {
  if (language === 'ko') return '동요';
  if (language === 'ja') return '子供の歌';
  if (language === 'fr') return 'chanson enfants';
  return 'kids song';
}

export function getLanguageSearchLabel(language: string): string {
  if (language === 'ja') return 'japanese';
  if (language === 'ko') return 'korean';
  if (language === 'fr') return 'french';
  return language;
}

export function getPinterestHost(language: string): string {
  if (language === 'ko') return 'kr.pinterest.com';
  if (language === 'ja') return 'jp.pinterest.com';
  return 'www.pinterest.com';
}

export function extractPrimaryEnglish(english: string): string {
  let text = english.split(/[/;,]/)[0].trim();
  text = text.replace(/\([^)]*\)/g, ' ').trim();
  text = text.replace(/^to\s+be\s+/i, '').trim();
  text = text.replace(/^to\s+/i, '').trim();
  const first = text.match(/\b[a-zA-Z]{2,}\b/);
  return first ? first[0].toLowerCase() : text.toLowerCase();
}

export function needsDisambiguationContext(
  native: string,
  english: string,
  language = 'ko'
): boolean {
  const n = native.trim();
  const lang = language.toLowerCase();
  const en = english.toLowerCase();

  if (lang === 'ja') {
    if (n.length === 1 && /^[\u4e00-\u9faf]$/.test(n)) return true;
    if (n.length <= 2 && /^[\u3040-\u309f\u30a0-\u30ffー]+$/.test(n)) return true;
    if (n === '橋' || n === '箸' || n === 'はし') return true;
    if (n === '目' && (en.includes('eye') || en.includes('goal'))) return true;
    return false;
  }

  if (n.length <= 2 && /^[\uAC00-\uD7A3]+$/.test(n)) return true;
  if (n === '눈' && (en.includes('eye') || en.includes('snow'))) return true;
  return false;
}

function resolveHomographRules(
  native: string,
  enKeyword: string,
  language: string
): Pick<WordSearchContext, 'titleMustMatch' | 'titleBlock'> {
  const key = `${native.trim()}|${enKeyword}`;
  const rules = language === 'ja' ? JA_HOMOGRAPH_RULES : KO_HOMOGRAPH_RULES;

  if (rules[key]) return rules[key];

  if (language === 'ko') {
    if (native === '일' && /one|sino|number/i.test(enKeyword)) return KO_HOMOGRAPH_RULES['일|one'];
    if (native === '일' && /day/i.test(enKeyword)) return KO_HOMOGRAPH_RULES['일|day'];
    if (native === '이' && /two|number/i.test(enKeyword)) return KO_HOMOGRAPH_RULES['이|two'];
    if (native === '눈' && enKeyword.includes('eye')) return KO_HOMOGRAPH_RULES['눈|eye'];
    if (native === '눈' && enKeyword.includes('snow')) return KO_HOMOGRAPH_RULES['눈|snow'];
  }

  if (language === 'ja') {
    if (native === '一' && /one|number/i.test(enKeyword)) return JA_HOMOGRAPH_RULES['一|one'];
    if (native === '日' && /day/i.test(enKeyword)) return JA_HOMOGRAPH_RULES['日|day'];
    if (native === '日' && /sun/i.test(enKeyword)) return JA_HOMOGRAPH_RULES['日|sun'];
    if (native === '目' && enKeyword.includes('eye')) return JA_HOMOGRAPH_RULES['目|eye'];
    if (native === '足' && enKeyword.includes('foot')) return JA_HOMOGRAPH_RULES['足|foot'];
    if (native === '足' && enKeyword.includes('leg')) return JA_HOMOGRAPH_RULES['足|leg'];
  }

  return {};
}

export function getWordSearchContext(
  native: string,
  english: string,
  category: string,
  exampleNative = '',
  language = 'ko'
): WordSearchContext {
  const n = native.trim();
  const lang = language.toLowerCase();
  const enKeyword = extractPrimaryEnglish(english);
  const cat = normalizeCategory(category);
  const topicLabel = getCategoryTopic(cat, lang);
  const needsDisambiguation = needsDisambiguationContext(n, english, lang);
  const homograph = resolveHomographRules(n, enKeyword, lang);
  const contextPhrase = [topicLabel, enKeyword].filter(Boolean).join(' ');

  return {
    native: n,
    english,
    category: cat,
    language: lang,
    enKeyword,
    koTopic: topicLabel,
    contextPhrase,
    needsDisambiguation,
    titleMustMatch: homograph.titleMustMatch,
    titleBlock: homograph.titleBlock,
  };
}

export function buildContextualYoutubeQuery(
  native: string,
  english: string,
  category: string,
  language: string,
  exampleNative = '',
  suffix?: string
): string {
  const word = native.trim();
  const lang = language.toLowerCase();
  const ctx = getWordSearchContext(word, english, category, exampleNative, lang);
  const songSuffix = suffix ?? getKidsSongSuffix(lang);

  if (lang === 'ko' || lang === 'ja') {
    if (ctx.needsDisambiguation && ctx.contextPhrase) {
      return `${word} ${ctx.koTopic} ${ctx.enKeyword} ${songSuffix}`.replace(/\s+/g, ' ').trim();
    }
    return `${word} ${songSuffix}`.trim();
  }

  if (ctx.needsDisambiguation) {
    return `${word} ${ctx.enKeyword} ${ctx.koTopic} ${songSuffix}`.replace(/\s+/g, ' ').trim();
  }
  return `${word} ${ctx.enKeyword} ${songSuffix}`.trim();
}

export function buildContextualImageQuery(
  native: string,
  english: string,
  category: string,
  tag: string,
  language: string,
  exampleNative = ''
): string {
  const lang = language.toLowerCase();
  const ctx = getWordSearchContext(native, english, category, exampleNative, lang);
  const langLabel = getLanguageSearchLabel(lang);

  if (ctx.needsDisambiguation) {
    if (ctx.enKeyword && ctx.koTopic) return `${ctx.enKeyword} ${ctx.koTopic} ${langLabel}`;
    if (ctx.enKeyword) return `${ctx.enKeyword} ${langLabel} vocabulary`;
    return `${ctx.koTopic} ${native} ${langLabel}`;
  }

  if ((lang === 'ko' || lang === 'ja') && native.trim()) {
    return `${native} ${ctx.enKeyword}`.trim();
  }
  return `${native.trim()} ${ctx.enKeyword || tag}`.trim();
}

export function buildContextualImageSearchQueries(
  native: string,
  english: string,
  category: string,
  tag: string,
  language: string,
  exampleNative = ''
): string[] {
  const lang = language.toLowerCase();
  const ctx = getWordSearchContext(native, english, category, exampleNative, lang);
  const langLabel = getLanguageSearchLabel(lang);
  const queries = new Set<string>();

  if (ctx.needsDisambiguation) {
    queries.add(`${ctx.enKeyword} ${ctx.koTopic} ${langLabel}`);
    queries.add(`${native.trim()} ${ctx.koTopic} ${ctx.enKeyword}`);
    queries.add(`${ctx.koTopic} ${ctx.enKeyword} illustration`);
    if (ctx.category === 'Numbers') {
      queries.add(`number ${ctx.enKeyword} counting ${langLabel}`);
      queries.add(`${langLabel} number ${ctx.enKeyword}`);
    }
    if (ctx.category === 'Time & Dates') {
      queries.add(`${ctx.enKeyword} time ${langLabel}`);
    }
    if (ctx.category === 'Food & Drink') {
      queries.add(`${ctx.enKeyword} ${langLabel} food`);
    }
  } else {
    queries.add(buildContextualImageQuery(native, english, category, tag, lang, exampleNative));
    if ((lang === 'ko' || lang === 'ja') && native.trim()) {
      queries.add(`${native.trim()} ${ctx.enKeyword}`.trim());
    }
    queries.add(`${ctx.enKeyword} ${tag}`.trim());
  }

  return [...queries].map((q) => q.replace(/\s+/g, ' ').trim()).filter(Boolean);
}

export function buildContextualPinterestQuery(
  native: string,
  english: string,
  category: string,
  language: string
): string {
  const lang = language.toLowerCase();
  const ctx = getWordSearchContext(native, english, category, '', lang);
  if ((lang === 'ko' || lang === 'ja') && ctx.needsDisambiguation && ctx.contextPhrase) {
    return `${native.trim()} ${ctx.koTopic} ${ctx.enKeyword}`.replace(/\s+/g, ' ').trim();
  }
  return native.trim();
}

export function titleMatchesWordContext(title: string, ctx: WordSearchContext): boolean {
  if (ctx.titleBlock?.test(title)) return false;
  if (!ctx.needsDisambiguation) return true;
  if (ctx.titleMustMatch?.test(title)) return true;
  if (ctx.enKeyword.length > 2 && new RegExp(`\\b${ctx.enKeyword}\\b`, 'i').test(title)) return true;
  if (ctx.koTopic && title.includes(ctx.koTopic)) return true;
  if (ctx.native.length <= 2 && title.includes(ctx.native)) return false;
  return false;
}

export function scoreContextBonus(title: string, ctx: WordSearchContext): number {
  if (ctx.titleBlock?.test(title)) return -80;
  if (!titleMatchesWordContext(title, ctx)) return -40;
  let bonus = 0;
  if (ctx.enKeyword && new RegExp(`\\b${ctx.enKeyword}\\b`, 'i').test(title)) bonus += 25;
  if (ctx.koTopic && title.includes(ctx.koTopic)) bonus += 20;
  if (ctx.native.length > 2 && title.includes(ctx.native)) bonus += 15;
  if (ctx.language === 'ja' && ctx.native && title.includes(ctx.native)) bonus += 10;
  return bonus;
}
