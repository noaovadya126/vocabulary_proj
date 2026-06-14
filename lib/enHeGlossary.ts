/**
 * English → Hebrew gloss for display when UI language is Hebrew.
 * Uses dictionary lookup + common patterns from vocabulary imports.
 */

const EN_HE: Record<string, string> = {
  hello: 'שלום',
  'thank you': 'תודה',
  please: 'בבקשה',
  sorry: 'סליחה',
  yes: 'כן',
  no: 'לא',
  water: 'מים',
  food: 'אוכל',
  house: 'בית',
  home: 'בית',
  car: 'מכונית',
  book: 'ספר',
  friend: 'חבר',
  family: 'משפחה',
  work: 'עבודה',
  school: 'בית ספר',
  time: 'זמן',
  day: 'יום',
  night: 'לילה',
  week: 'שבוע',
  month: 'חודש',
  year: 'שנה',
  today: 'היום',
  tomorrow: 'מחר',
  yesterday: 'אתמול',
  wide: 'רחב',
  narrow: 'צר',
  short: 'קצר',
  long: 'ארוך',
  big: 'גדול',
  small: 'קטן',
  hot: 'חם',
  cold: 'קר',
  good: 'טוב',
  bad: 'רע',
  new: 'חדש',
  old: 'ישן',
  beautiful: 'יפה',
  ugly: 'מכוער',
  happy: 'שמח',
  sad: 'עצוב',
  angry: 'כועס',
  tired: 'עייף',
  hungry: 'רעב',
  thirsty: 'צמא',
  hospital: 'בית חולים',
  method: 'שיטה',
  direction: 'כיוון',
  furniture: 'רהיטים',
  country: 'מדינה',
  number: 'מספר',
  occupation: 'מקצוע',
  body: 'גוף',
  season: 'עונה',
  color: 'צבע',
  fruit: 'פרי',
  vegetable: 'ירק',
  animal: 'חיה',
  game: 'משחק',
  bus: 'אוטובוס',
  store: 'חנות',
  shop: 'חנות',
  price: 'מחיר',
  expensive: 'יקר',
  cheap: 'זול',
  learn: 'ללמוד',
  study: 'ללמוד',
  eat: 'לאכול',
  drink: 'לשתות',
  go: 'ללכת',
  come: 'לבוא',
  see: 'לראות',
  hear: 'לשמוע',
  speak: 'לדבר',
  read: 'לקרוא',
  write: 'לכתוב',
  buy: 'לקנות',
  sell: 'למכור',
  love: 'אהבה',
  like: 'לאהוב',
  want: 'לרצות',
  need: 'צורך',
  know: 'לדעת',
  think: 'לחשוב',
  feel: 'להרגיש',
  help: 'עזרה',
  wait: 'לחכות',
  open: 'לפתוח',
  close: 'לסגור',
  start: 'להתחיל',
  stop: 'לעצור',
  run: 'לרוץ',
  walk: 'ללכת',
  sit: 'לשבת',
  stand: 'לעמוד',
  sleep: 'לישון',
  wake: 'להתעורר',
  rain: 'גשם',
  snow: 'שלג',
  sun: 'שמש',
  moon: 'ירח',
  sky: 'שמיים',
  tree: 'עץ',
  flower: 'פרח',
  mountain: 'הר',
  river: 'נהר',
  sea: 'ים',
  city: 'עיר',
  village: 'כפר',
  street: 'רחוב',
  door: 'דלת',
  window: 'חלון',
  room: 'חדר',
  kitchen: 'מטבח',
  bathroom: 'חדר אמבטיה',
  bed: 'מיטה',
  table: 'שולחן',
  chair: 'כיסא',
  phone: 'טלפון',
  computer: 'מחשב',
  money: 'כסף',
  job: 'עבודה',
  student: 'תלמיד',
  teacher: 'מורה',
  doctor: 'רופא',
  nurse: 'אחות',
  child: 'ילד',
  man: 'גבר',
  woman: 'אישה',
  boy: 'ילד',
  girl: 'ילדה',
  father: 'אב',
  mother: 'אם',
  brother: 'אח',
  sister: 'אחות',
  husband: 'בעל',
  wife: 'אישה',
  name: 'שם',
  age: 'גיל',
  morning: 'בוקר',
  afternoon: 'אחר הצהריים',
  evening: 'ערב',
  minute: 'דקה',
  hour: 'שעה',
  second: 'שנייה',
  monday: 'יום שני',
  tuesday: 'יום שלישי',
  wednesday: 'יום רביעי',
  thursday: 'יום חמישי',
  friday: 'יום שישי',
  saturday: 'שבת',
  sunday: 'יום ראשון',
  noun: 'שם עצם',
  verb: 'פועל',
  adjective: 'תואר',
  adverb: 'תואר הפועל',
  interjection: 'קריאה',
  pronoun: 'כינוי',
  numeral: 'מספר',
  suffix: 'סיומת',
  determiner: 'מגדיר',
};

const ADJ_HE: Record<string, string> = {
  wide: 'רחב',
  narrow: 'צר',
  short: 'קצר',
  long: 'ארוך',
  big: 'גדול',
  small: 'קטן',
  hot: 'חם',
  cold: 'קר',
  good: 'טוב',
  bad: 'רע',
  new: 'חדש',
  old: 'ישן',
  beautiful: 'יפה',
  ugly: 'מכוער',
  happy: 'שמח',
  sad: 'עצוב',
  expensive: 'יקר',
  cheap: 'זול',
  fast: 'מהיר',
  slow: 'איטי',
  heavy: 'כבד',
  light: 'קל',
  high: 'גבוה',
  low: 'נמוך',
  young: 'צעיר',
  clean: 'נקי',
  dirty: 'מלוכלך',
  easy: 'קל',
  difficult: 'קשה',
  hard: 'קשה',
  soft: 'רך',
  loud: 'רועש',
  quiet: 'שקט',
  full: 'מלא',
  empty: 'ריק',
  right: 'נכון',
  wrong: 'שגוי',
  same: 'זהה',
  different: 'שונה',
};

function normalizeKey(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

function lookupWord(word: string): string | null {
  const key = normalizeKey(word);
  if (EN_HE[key]) return EN_HE[key];
  if (ADJ_HE[key]) return ADJ_HE[key];
  return null;
}

function translatePhrase(text: string): string | null {
  const normalized = normalizeKey(text);

  const direct = lookupWord(normalized);
  if (direct) return direct;

  const toBe = normalized.match(/^to be (.+)$/);
  if (toBe) {
    const adj = lookupWord(toBe[1]) ?? ADJ_HE[toBe[1]];
    if (adj) return adj;
    return 'תיאור — ראי/י בהערות';
  }

  const paren = normalized.match(/^(.+?) \((noun|verb|adjective|adverb)\)$/);
  if (paren) {
    const base = lookupWord(paren[1]);
    if (base) return base;
  }

  const words = normalized.split(/[,;/]+/)[0].trim().split(/\s+/);
  if (words.length === 1) {
    return lookupWord(words[0]);
  }

  if (words.length <= 4) {
    const translated = words.map((w) => lookupWord(w.replace(/[^a-z-]/g, ''))).filter(Boolean);
    if (translated.length === words.length) return translated.join(' ');
  }

  return null;
}

/** Translate English gloss to Hebrew for Hebrew UI mode. */
export function translateToHebrew(english: string): string {
  if (!english?.trim()) return '';
  const result = translatePhrase(english);
  if (result) return result;

  const firstPart = english.split(/[,;]/)[0].trim();
  const partial = translatePhrase(firstPart);
  if (partial) return partial;

  return 'משמעות — ראי/י בהערות או בשמע';
}
