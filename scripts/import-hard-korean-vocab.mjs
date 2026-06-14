import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('.');
const INPUT = path.join(ROOT, 'scripts', 'hard-korean-vocab.json');
const TSV = path.join(ROOT, 'scripts', 'ko-combined.tsv');
const OUTPUT = path.join(ROOT, 'lib', 'data', 'ko-topik-words.ts');

const POS_CATEGORY = {
  verb: 'Actions',
  adjective: 'Descriptions',
  adverb: 'Daily Life',
  noun: 'Daily Life',
  pronoun: 'People & Family',
  numeral: 'Numbers',
  interjection: 'Greetings',
  determiner: 'Descriptions',
  particle: 'Study & Work',
  suffix: 'Study & Work',
};

const POS_EN = {
  명사: 'noun',
  동사: 'verb',
  형용사: 'adjective',
  부사: 'adverb',
  수사: 'numeral',
  감탄사: 'interjection',
  관형사: 'determiner',
  대명사: 'pronoun',
  접사: 'suffix',
};

const CAT_NORM = {
  Greetings: 'Greetings',
  Food: 'Food & Drink',
  Places: 'Places',
  People: 'People & Family',
  Time: 'Time & Dates',
  Numbers: 'Numbers',
  Verbs: 'Actions',
  Adjectives: 'Descriptions',
  Weather: 'Weather & Nature',
  Transport: 'Transport',
  Shopping: 'Shopping',
  'Daily life': 'Daily Life',
  Study: 'Study & Work',
  Feelings: 'Feelings',
  명사: 'Daily Life',
  동사: 'Actions',
  형용사: 'Descriptions',
  부사: 'Daily Life',
  수사: 'Numbers',
  감탄사: 'Greetings',
  관형사: 'Descriptions',
  대명사: 'People & Family',
};

const KEYWORD_CATEGORY = [
  [/food|eat|drink|meal|rice|meat|fish|fruit|coffee|tea|restaurant|kitchen/i, 'Food & Drink'],
  [/school|study|learn|exam|homework|book|teacher|student|university|class/i, 'Study & Work'],
  [/family|father|mother|brother|sister|friend|person|man|woman|child|people/i, 'People & Family'],
  [/hello|goodbye|thank|sorry|please|greet/i, 'Greetings'],
  [/happy|sad|angry|love|feel|emotion|worry|stress/i, 'Feelings'],
  [/weather|rain|snow|wind|hot|cold|season|spring|summer|winter/i, 'Weather & Nature'],
  [/bus|train|taxi|car|subway|airport|station|transport|drive|walk/i, 'Transport'],
  [/shop|store|buy|sell|money|price|cheap|expensive|market|card|cash/i, 'Shopping'],
  [/hospital|bank|park|library|home|house|school|place|city|country|room/i, 'Places'],
  [/time|day|week|month|year|hour|minute|morning|night|today|tomorrow|yesterday/i, 'Time & Dates'],
  [/number|one|two|three|four|five|six|seven|eight|nine|ten|hundred|thousand/i, 'Numbers'],
];

const emoji = {
  Greetings: '👋',
  'Food & Drink': '🍜',
  Places: '📍',
  'People & Family': '🧑',
  'Time & Dates': '⏰',
  Numbers: '🔢',
  Actions: '🏃',
  Descriptions: '🌈',
  'Weather & Nature': '🌤️',
  Transport: '🚌',
  Shopping: '🛍️',
  'Daily Life': '🏠',
  'Study & Work': '📚',
  Feelings: '💕',
};

function inferCategory(pos, meaning) {
  for (const [re, cat] of KEYWORD_CATEGORY) {
    if (re.test(meaning)) return cat;
  }
  return POS_CATEGORY[pos] || 'Daily Life';
}

function topikLevelFromHard(level) {
  return level <= 2 ? 1 : 2;
}

function cleanMeaning(meaning) {
  return meaning.split(/[;]/)[0].trim();
}

function cleanWord(w) {
  return w.replace(/\d+$/, '').trim();
}

function parseEnglishFromExplanation(exp) {
  if (!exp) return null;
  const trimmed = exp.trim();
  const latin = trimmed.match(/^([a-zA-Z][a-zA-Z0-9 ,\-/]{0,60})/);
  if (latin) return latin[1].split(';')[0].trim();
  if (trimmed.includes(';')) {
    const part = trimmed.split(';')[0].trim();
    if (/^[a-zA-Z]/.test(part)) return part;
  }
  return null;
}

const raw = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
const seen = new Set();
const words = [];

for (const item of raw) {
  const native = item.word?.trim();
  if (!native) continue;
  const key = native;
  if (seen.has(key)) continue;
  seen.add(key);

  const english = cleanMeaning(item.meaning || native);
  const category = inferCategory(item.pos || 'noun', english);
  const topikLevel = topikLevelFromHard(item.level ?? 1);

  words.push({
    native,
    english,
    phonetic: item.romanization || native,
    category,
    topikLevel,
    image: emoji[category] || '📖',
    exampleNative: item.example_kr || `${native}을(를) 배워요.`,
    exampleEnglish: item.example_en || `Learning: ${english}.`,
  });
}

let mergedFromTsv = 0;
if (fs.existsSync(TSV)) {
  const rows = fs.readFileSync(TSV, 'utf8').split(/\r?\n/).slice(1).filter(Boolean);
  for (const line of rows) {
    const [, word, pos, hanja, explanation, , topik] = line.split('\t');
    if (!word || !topik) continue;
    const topikLevel = topik === 'A' ? 1 : topik === 'B' ? 2 : null;
    if (!topikLevel) continue;

    const native = cleanWord(word);
    if (seen.has(native)) continue;
    seen.add(native);

    let english =
      parseEnglishFromExplanation(explanation) ||
      parseEnglishFromExplanation(hanja);
    if (!english) {
      const posLabel = POS_EN[pos?.split('/')[0]] || 'word';
      english = `${native} (${posLabel})`;
    }

    const rawCat = Object.keys(CAT_NORM).find((k) => pos?.includes(k)) || 'Daily life';
    const category = CAT_NORM[rawCat] || 'Daily Life';

    words.push({
      native,
      english,
      phonetic: native,
      category,
      topikLevel,
      image: emoji[category] || '📖',
      exampleNative: explanation ? `${native} — ${explanation}` : `${native}을(를) 배워요.`,
      exampleEnglish: `Learning: ${english}.`,
    });
    mergedFromTsv += 1;
  }
}

const numbered = words.map((w, i) => ({
  ...w,
  id: i + 1,
  wordId: i + 1,
}));

const level1 = numbered.filter((w) => w.topikLevel === 1).length;
const level2 = numbered.filter((w) => w.topikLevel === 2).length;

const out = `// Korean TOPIK 1–2 vocabulary — Hard Korean + official TOPIK word list (${numbered.length} words)
// Hard Korean levels 1–2 → TOPIK 1, levels 3–6 → TOPIK 2; + ${mergedFromTsv} extra words from ko-combined.tsv
export const KO_TOPIK_WORDS = ${JSON.stringify(numbered, null, 2)} as const;
`;

fs.writeFileSync(OUTPUT, out);
console.log(`Imported ${numbered.length} words (L1: ${level1}, L2: ${level2}, +${mergedFromTsv} from TSV) → ${OUTPUT}`);
