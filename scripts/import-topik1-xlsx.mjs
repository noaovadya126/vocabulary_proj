/**
 * Import TOPIK 1 vocabulary from Excel (category sheets + All Words).
 * Usage: node scripts/import-topik1-xlsx.mjs [path-to-xlsx]
 */
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const ROOT = path.resolve('.');

const DEFAULT_XLSX = path.join(
  process.env.USERPROFILE || process.env.HOME || '',
  'Downloads',
  'TOPIK1_Full_Vocabulary (1).xlsx'
);

const EMOJI = {
  Greetings: '👋',
  'Food & Drink': '🍜',
  Places: '📍',
  'People & Family': '👨‍👩‍👧',
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

function mapCategory(raw) {
  const s = String(raw || '');
  if (/인사|Greetings/i.test(s)) return 'Greetings';
  if (/숫자|Numbers/i.test(s)) return 'Numbers';
  if (/날짜|Date|Time/i.test(s)) return 'Time & Dates';
  if (/가족|Family/i.test(s)) return 'People & Family';
  if (/사람|People|Society/i.test(s)) return 'People & Family';
  if (/신체|Body/i.test(s)) return 'People & Family';
  if (/건강|Health|Hospital/i.test(s)) return 'Daily Life';
  if (/음식|Food|Drink/i.test(s)) return 'Food & Drink';
  if (/집|Home|Daily Life/i.test(s)) return 'Daily Life';
  if (/학교|School|Studying/i.test(s)) return 'Study & Work';
  if (/직업|Work|Career/i.test(s)) return 'Study & Work';
  if (/교통|Transport|Move/i.test(s)) return 'Transport';
  if (/장소|Places|Locations/i.test(s)) return 'Places';
  if (/쇼핑|Shopping/i.test(s)) return 'Shopping';
  if (/취미|Hobbies|Leisure/i.test(s)) return 'Feelings';
  if (/자연|Nature|Weather/i.test(s)) return 'Weather & Nature';
  if (/동물|Animals/i.test(s)) return 'Daily Life';
  if (/색깔|Colors/i.test(s)) return 'Descriptions';
  if (/감정|Emotions|Personality/i.test(s)) return 'Feelings';
  if (/언어|Language|Communic/i.test(s)) return 'Study & Work';
  if (/기술|Technology|Internet/i.test(s)) return 'Daily Life';
  if (/동사|Verbs/i.test(s)) return 'Actions';
  if (/형용사|Adjectives/i.test(s)) return 'Descriptions';
  if (/부사|Adverbs|Conjunction/i.test(s)) return 'Daily Life';
  if (/대명사|Pronouns|Demonstr/i.test(s)) return 'People & Family';
  if (/조사|Particles|Grammar/i.test(s)) return 'Study & Work';
  return 'Daily Life';
}

function cleanEnglish(raw) {
  const text = String(raw || '').trim();
  if (!text) return '';
  return text.split('/')[0].split(';')[0].trim();
}

function categoryFromSheetName(sheetName) {
  return mapCategory(sheetName);
}

function importFromWorkbook(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
  }

  const wb = XLSX.readFile(filePath);
  const words = [];
  const seen = new Set();

  if (wb.SheetNames.includes('All Words')) {
    const rows = XLSX.utils.sheet_to_json(wb.Sheets['All Words'], { header: 1, defval: '' });
    for (let i = 1; i < rows.length; i += 1) {
      const [, korean, english, categoryRaw] = rows[i];
      const native = String(korean || '').trim();
      if (!native) continue;
      if (seen.has(native)) continue;
      seen.add(native);

      const englishClean = cleanEnglish(english) || native;
      const category = mapCategory(categoryRaw);

      words.push({
        native,
        english: englishClean,
        phonetic: native,
        category,
        topikLevel: 1,
        image: EMOJI[category] || '📖',
        exampleNative: `${native} — ${englishClean}`,
        exampleEnglish: `Meaning: ${englishClean}.`,
      });
    }
  } else {
    for (const sheetName of wb.SheetNames) {
      if (sheetName === 'All Words') continue;
      const category = categoryFromSheetName(sheetName);
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1, defval: '' });
      for (let i = 1; i < rows.length; i += 1) {
        const [, korean, english] = rows[i];
        const native = String(korean || '').trim();
        if (!native) continue;
        if (seen.has(native)) continue;
        seen.add(native);

        const englishClean = cleanEnglish(english) || native;
        words.push({
          native,
          english: englishClean,
          phonetic: native,
          category,
          topikLevel: 1,
          image: EMOJI[category] || '📖',
          exampleNative: `${native} — ${englishClean}`,
          exampleEnglish: `Meaning: ${englishClean}.`,
        });
      }
    }
  }

  return words.map((w, i) => ({ ...w, id: i + 1 }));
}

const xlsxPath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_XLSX;
console.log('Reading:', xlsxPath);
const all = importFromWorkbook(xlsxPath);

const out = `// TOPIK 1 — ${all.length} words from TOPIK1_Full_Vocabulary.xlsx (by category)
export const KO_TOPIK_WORDS = ${JSON.stringify(all, null, 2)} as const;
`;

fs.writeFileSync(path.join(ROOT, 'lib', 'data', 'ko-topik-words.ts'), out);
console.log('Wrote', all.length, 'Korean TOPIK 1 words to lib/data/ko-topik-words.ts');

const cats = {};
for (const w of all) cats[w.category] = (cats[w.category] || 0) + 1;
console.log('Categories:', cats);
