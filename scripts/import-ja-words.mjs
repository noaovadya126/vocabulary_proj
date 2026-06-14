import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('.');
const OUTPUT = path.join(ROOT, 'lib', 'data', 'ja-words.ts');

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

function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQ = !inQ;
      continue;
    }
    if (ch === ',' && !inQ) {
      out.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function inferCategory(meaning) {
  const m = meaning?.toLowerCase() ?? '';
  if (m.includes('greet')) return 'Greetings';
  if (/food|eat|drink|meal/.test(m)) return 'Food & Drink';
  if (/travel|car|train|bus/.test(m)) return 'Transport';
  if (/feel|emotion|happy|sad/.test(m)) return 'Feelings';
  if (/study|school|learn/.test(m)) return 'Study & Work';
  if (/weather|rain|snow|nature|tree|flower/.test(m)) return 'Weather & Nature';
  if (/number|count|digit/.test(m)) return 'Numbers';
  if (/buy|shop|store|money/.test(m)) return 'Shopping';
  return 'Daily Life';
}

function parseJlptCsv(file, level) {
  const text = fs.readFileSync(path.join(ROOT, 'scripts', file), 'utf8');
  const lines = text.split(/\r?\n/).slice(1).filter(Boolean);
  return lines.map((line) => {
    const [expression, reading, meaning] = parseCsvLine(line);
    const english = (meaning || expression).split(',')[0].trim();
    const category = inferCategory(meaning);
    return {
      native: expression,
      english,
      phonetic: reading,
      category,
      topikLevel: level,
      exampleNative: `${expression}を例文に使います。`,
      exampleEnglish: `Example with ${english}.`,
    };
  });
}

const n5 = parseJlptCsv('ja-n5.csv', 1);
const n4 = parseJlptCsv('ja-n4.csv', 2);
const n3 = parseJlptCsv('ja-n3.csv', 2);

const level1 = [...n5];
const seen = new Set(level1.map((w) => w.native));

const level2 = [];
for (const w of [...n4, ...n3]) {
  if (seen.has(w.native)) continue;
  level2.push(w);
  seen.add(w.native);
}

const all = [...level1, ...level2].map((w, i) => ({
  ...w,
  id: i + 1,
  image: emoji[w.category] || '📖',
}));

const out = `// JLPT N5 (${level1.length}) + N4/N3 (${level2.length}) — beginner & intermediate Japanese
export const JA_WORDS = ${JSON.stringify(all, null, 2)};
`;

fs.writeFileSync(OUTPUT, out);
console.log(`Japanese: ${all.length} words (L1: ${level1.length}, L2: ${level2.length}) → ${OUTPUT}`);
