import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('.');
const INPUT = path.join(ROOT, 'scripts', 'hard-korean-vocab.json');
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

const raw = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
const seen = new Set();
const words = [];

for (const item of raw) {
  const native = item.word?.trim();
  if (!native) continue;
  const key = `${native}:${item.level}`;
  if (seen.has(key)) continue;
  seen.add(key);

  const english = cleanMeaning(item.meaning || native);
  const category = inferCategory(item.pos || 'noun', english);
  const topikLevel = topikLevelFromHard(item.level ?? 1);

  words.push({
    id: words.length + 1,
    native,
    english,
    phonetic: item.romanization || native,
    category,
    topikLevel,
    image: emoji[category] || '📖',
    exampleNative: item.example_kr || `${native}을(를) 배워요.`,
    exampleEnglish: item.example_en || `Learning: ${english}.`,
    wordId: words.length + 1,
  });
}

const level1 = words.filter((w) => w.topikLevel === 1).length;
const level2 = words.filter((w) => w.topikLevel === 2).length;

const out = `// Korean vocabulary from Hard Korean (https://hard-korean-app.vercel.app) — ${words.length} words
// TOPIK levels 1–2 → difficulty 1, levels 3–6 → difficulty 2
export const KO_TOPIK_WORDS = ${JSON.stringify(words, null, 2)} as const;
`;

fs.writeFileSync(OUTPUT, out);
console.log(`Imported ${words.length} words (L1: ${level1}, L2: ${level2}) → ${OUTPUT}`);
