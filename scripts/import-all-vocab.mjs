import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('.');

const CAT_NORM = {
  Greetings: 'Greetings', Food: 'Food & Drink', Places: 'Places', People: 'People & Family',
  Time: 'Time & Dates', Numbers: 'Numbers', Verbs: 'Actions', Adjectives: 'Descriptions',
  Weather: 'Weather & Nature', Transport: 'Transport', Shopping: 'Shopping',
  'Daily life': 'Daily Life', Study: 'Study & Work', Feelings: 'Feelings',
  명사: 'Daily Life', 동사: 'Actions', 형용사: 'Descriptions', 부사: 'Daily Life',
  수사: 'Numbers', 감탄사: 'Greetings', 관형사: 'Descriptions', 대명사: 'People & Family',
};

const POS_EN = {
  명사: 'noun', 동사: 'verb', 형용사: 'adjective', 부사: 'adverb', 수사: 'numeral',
  감탄사: 'interjection', 관형사: 'determiner', 대명사: 'pronoun', 접사: 'suffix',
};

const TOPIC_EN = {
  병원: 'hospital', 방법: 'method', 방향: 'direction', 가구: 'furniture', 나라: 'country',
  숫자: 'number', 직업: 'occupation', 신체: 'body', 계절: 'season', 색깔: 'color',
  과일: 'fruit', 채소: 'vegetable', 가족: 'family', 동물: 'animal', 음식: 'food',
  시간: 'time', 식물: 'plant', 꽃: 'flower', game: 'game', bus: 'bus',
};

const emoji = {
  Greetings: '👋', 'Food & Drink': '🍜', Places: '📍', 'People & Family': '🧑',
  'Time & Dates': '⏰', Numbers: '🔢', Actions: '🏃', Descriptions: '🌈',
  'Weather & Nature': '🌤️', Transport: '🚌', Shopping: '🛍️',
  'Daily Life': '🏠', 'Study & Work': '📚', Feelings: '💕',
};

function cleanWord(w) {
  return w.replace(/\d+$/, '').trim();
}

function parseEnglishFromExplanation(exp) {
  if (!exp) return null;
  const trimmed = exp.trim();
  const latin = trimmed.match(/^([a-zA-Z][a-zA-Z0-9 ,\-/]{0,40})/);
  if (latin) return latin[1].split(';')[0].trim();
  if (trimmed.includes(';')) {
    const part = trimmed.split(';')[0].trim();
    if (/^[a-zA-Z]/.test(part)) return part;
  }
  for (const [ko, en] of Object.entries(TOPIC_EN)) {
    if (trimmed.includes(ko)) return en;
  }
  return null;
}

function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQ = !inQ; continue; }
    if (ch === ',' && !inQ) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function parseJlptCsv(file, level) {
  const text = fs.readFileSync(path.join(ROOT, 'scripts', file), 'utf8');
  const lines = text.split(/\r?\n/).slice(1).filter(Boolean);
  return lines.map((line) => {
    const [expression, reading, meaning] = parseCsvLine(line);
    const cat = meaning?.toLowerCase().includes('greet') ? 'Greetings'
      : meaning?.match(/food|eat|drink|meal/i) ? 'Food & Drink'
      : meaning?.match(/travel|car|train|bus/i) ? 'Transport'
      : meaning?.match(/feel|emotion|happy|sad/i) ? 'Feelings'
      : meaning?.match(/study|school|learn/i) ? 'Study & Work'
      : 'Daily Life';
    return {
      native: expression,
      english: (meaning || expression).split(',')[0].trim(),
      phonetic: reading,
      category: cat,
      topikLevel: level,
      exampleNative: `${expression}を例文に使います。`,
      exampleEnglish: `Example with ${(meaning || expression).split(',')[0].trim()}.`,
    };
  });
}

function importKorean() {
  const curatedPath = path.join(ROOT, 'lib', 'data', 'ko-topik-words.ts');
  let curated = [];
  if (fs.existsSync(curatedPath)) {
    const mod = fs.readFileSync(curatedPath, 'utf8');
    const match = mod.match(/export const KO_TOPIK_WORDS = (\[[\s\S]*?\]) as const;/);
    if (match) curated = JSON.parse(match[1]);
  }

  const englishMap = new Map();
  for (const w of curated) englishMap.set(cleanWord(w.native), w.english);

  const tsv = fs.readFileSync(path.join(ROOT, 'scripts', 'ko-combined.tsv'), 'utf8');
  const rows = tsv.split(/\r?\n/).slice(1).filter(Boolean);

  const byLevel = { 1: [], 2: [], 3: [] };
  const seen = new Set();

  for (const line of rows) {
    const [, word, pos, hanja, explanation, , topik] = line.split('\t');
    if (!word || !topik) continue;
    const level = topik === 'A' ? 1 : topik === 'B' ? 2 : topik === 'C' ? 3 : null;
    if (!level) continue;

    const native = cleanWord(word);
    const key = `${native}:${pos}:${level}`;
    if (seen.has(key)) continue;
    seen.add(key);

    let english = englishMap.get(native)
      || parseEnglishFromExplanation(explanation)
      || parseEnglishFromExplanation(hanja)
      || englishMap.get(native.replace(/[^가-힣]/g, ''));

    if (!english) {
      const posLabel = POS_EN[pos?.split('/')[0]] || 'word';
      english = `${native} (${posLabel})`;
    }

    const rawCat = Object.keys(CAT_NORM).find((k) => pos?.includes(k)) || 'Daily life';
    const category = CAT_NORM[rawCat] || 'Daily Life';

    byLevel[level].push({
      native,
      english,
      phonetic: native,
      category,
      topikLevel: level,
      image: emoji[category] || '📖',
      exampleNative: explanation ? `${native} — ${explanation}` : `${native}을(를) 배워요.`,
      exampleEnglish: `Learning: ${english}.`,
    });
  }

  for (const w of curated) {
    const native = cleanWord(w.native);
    const key = `${native}:${w.category}:${w.topikLevel}`;
    if (seen.has(key)) continue;
    seen.add(key);
    byLevel[w.topikLevel]?.unshift(w);
  }

  function fillToMinimum(list, pool, targetLevel, minCount) {
    const out = [...list];
    const natives = new Set(out.map((w) => w.native));
    for (const w of pool) {
      if (out.length >= minCount) break;
      if (natives.has(w.native)) continue;
      out.push({ ...w, topikLevel: targetLevel });
      natives.add(w.native);
    }
    return out;
  }

  let level1 = fillToMinimum(byLevel[1], [...byLevel[2], ...byLevel[3]], 1, 1000);
  let level2 = fillToMinimum(byLevel[2], byLevel[3], 2, 1000);
  const all = [...level1, ...level2].map((w, i) => ({ ...w, id: i + 1 }));

  const out = `// TOPIK 1 (${level1.length}) + TOPIK 2 (${level2.length}) — imported vocabulary
export const KO_TOPIK_WORDS = ${JSON.stringify(all, null, 2)} as const;
`;
  fs.writeFileSync(path.join(ROOT, 'lib', 'data', 'ko-topik-words.ts'), out);
  console.log('Korean:', all.length, 'L1:', level1.length, 'L2:', level2.length);
}

function importJapanese() {
  const n5 = parseJlptCsv('ja-n5.csv', 1);
  const n4 = parseJlptCsv('ja-n4.csv', 2);
  const n3 = parseJlptCsv('ja-n3.csv', 2);

  const level1 = [...n5];
  for (const w of n4) {
    if (level1.length >= 1000) break;
    level1.push({ ...w, topikLevel: 1 });
  }

  const used = new Set(level1.map((w) => w.native));
  const level2 = [];
  for (const w of [...n4, ...n3]) {
    if (used.has(w.native)) continue;
    level2.push(w);
    used.add(w.native);
    if (level2.length >= 1000) break;
  }

  const all = [...level1, ...level2].map((w, i) => ({
    ...w,
    id: i + 1,
    image: emoji[w.category] || '📖',
  }));

  const out = `// JLPT N5→N4 (${level1.length}) + N4/N3 (${level2.length}) Japanese vocabulary
export const JA_WORDS = ${JSON.stringify(all, null, 2)};
`;
  fs.writeFileSync(path.join(ROOT, 'lib', 'data', 'ja-words.ts'), out);
  console.log('Japanese:', all.length, 'L1:', level1.length, 'L2:', level2.length);
}

importKorean();
importJapanese();
