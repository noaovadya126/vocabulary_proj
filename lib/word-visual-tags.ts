import { normalizeCategory, type StandardCategory } from './categories';

/** Korean native → visual search tag (English, for image/video APIs) */
const KO_NATIVE_TAG: Record<string, string> = {
  초록색: 'green',
  녹색: 'green',
  빨간색: 'red',
  빨강: 'red',
  파란색: 'blue',
  파랑: 'blue',
  노란색: 'yellow',
  노랑: 'yellow',
  하얀색: 'white',
  흰색: 'white',
  검은색: 'black',
  검정: 'black',
  주황색: 'orange',
  보라색: 'purple',
  분홍색: 'pink',
  갈색: 'brown',
  회색: 'gray',
  안녕하세요: 'greeting',
  안녕: 'greeting',
  감사합니다: 'thankyou',
  고마워: 'thankyou',
  네: 'yes',
  그래요: 'greeting',
  아니요: 'no',
  물: 'water',
  커피: 'coffee',
  밥: 'rice',
  음식: 'food',
  사과: 'apple',
  학교: 'school',
  집: 'house',
  가족: 'family',
  친구: 'friend',
  고양이: 'cat',
  개: 'dog',
  자동차: 'car',
  버스: 'bus',
  기차: 'train',
  비: 'rain',
  눈: 'snow',
  태양: 'sun',
  책: 'book',
  꽃: 'flower',
  나무: 'tree',
  산: 'mountain',
  바다: 'sea',
  공원: 'park',
  머리: 'body',
  얼굴: 'body',
  코: 'body',
  입: 'body',
  귀: 'body',
  손: 'body',
  발: 'body',
  다리: 'body',
  팔: 'body',
  배: 'body',
  가슴: 'body',
  목: 'body',
  몸: 'body',
  신체: 'body',
};

/** Japanese native → visual tag */
const JA_NATIVE_TAG: Record<string, string> = {
  緑: 'green',
  赤: 'red',
  青: 'blue',
  黄色: 'yellow',
  白: 'white',
  黒: 'black',
  こんにちは: 'greeting',
  ありがとう: 'thankyou',
  水: 'water',
  猫: 'cat',
  犬: 'dog',
};

const EN_COLOR_WORDS: Record<string, string> = {
  green: 'green',
  red: 'red',
  blue: 'blue',
  yellow: 'yellow',
  white: 'white',
  black: 'black',
  orange: 'orange',
  purple: 'purple',
  pink: 'pink',
  brown: 'brown',
  gray: 'gray',
  grey: 'gray',
};

const EN_KEYWORD_TAG: Record<string, string> = {
  hello: 'greeting',
  greet: 'greeting',
  thank: 'thankyou',
  sorry: 'apology',
  water: 'water',
  coffee: 'coffee',
  tea: 'tea',
  food: 'food',
  eat: 'food',
  apple: 'apple',
  rice: 'rice',
  bread: 'bread',
  school: 'school',
  study: 'school',
  work: 'work',
  house: 'house',
  home: 'house',
  family: 'family',
  friend: 'friend',
  cat: 'cat',
  dog: 'dog',
  bird: 'bird',
  car: 'car',
  bus: 'bus',
  train: 'train',
  plane: 'airplane',
  rain: 'rain',
  snow: 'snow',
  sun: 'sun',
  cloud: 'cloud',
  book: 'book',
  flower: 'flower',
  tree: 'tree',
  mountain: 'mountain',
  river: 'river',
  sea: 'sea',
  ocean: 'sea',
  park: 'park',
  shop: 'shop',
  store: 'shop',
  body: 'body',
  head: 'body',
  face: 'body',
  eye: 'body',
  hand: 'body',
  foot: 'body',
  leg: 'body',
  arm: 'body',
  hospital: 'hospital',
  doctor: 'doctor',
  happy: 'happy',
  sad: 'sad',
  love: 'love',
  music: 'music',
  game: 'game',
  phone: 'phone',
  money: 'money',
  time: 'clock',
  clock: 'clock',
  wide: 'wide',
  narrow: 'narrow',
  long: 'long',
  short: 'short',
  big: 'big',
  small: 'small',
  hot: 'hot',
  cold: 'cold',
  run: 'running',
  walk: 'walking',
  swim: 'swimming',
  read: 'reading',
  write: 'writing',
};

const CATEGORY_TAG: Record<StandardCategory, string> = {
  Greetings: 'greeting',
  'People & Family': 'family',
  'Food & Drink': 'food',
  Places: 'city',
  'Time & Dates': 'clock',
  Numbers: 'numbers',
  Actions: 'running',
  Descriptions: 'colors',
  'Weather & Nature': 'nature',
  Transport: 'transport',
  Shopping: 'shop',
  'Daily Life': 'home',
  'Study & Work': 'school',
  Feelings: 'happy',
};

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function tagFromEnglish(english: string): string | null {
  const lower = english.toLowerCase().replace(/\([^)]*\)/g, ' ');

  for (const [color, tag] of Object.entries(EN_COLOR_WORDS)) {
    if (lower.includes(color)) return tag;
  }

  const toBe = lower.match(/^to be (.+?)(?:\s|$)/);
  if (toBe) {
    const adj = toBe[1].trim().split(/\s+/)[0];
    if (EN_KEYWORD_TAG[adj]) return EN_KEYWORD_TAG[adj];
    if (EN_COLOR_WORDS[adj]) return EN_COLOR_WORDS[adj];
    return adj;
  }

  for (const [key, tag] of Object.entries(EN_KEYWORD_TAG)) {
    if (lower.includes(key)) return tag;
  }

  const firstWord = lower.match(/\b([a-z]{3,})\b/);
  if (firstWord && EN_KEYWORD_TAG[firstWord[1]]) return EN_KEYWORD_TAG[firstWord[1]];

  return null;
}

/** Primary visual tag used to pick images and videos for a word. */
export function getWordVisualTag(
  native: string,
  english: string,
  category: string,
  wordId?: string
): string {
  const nativeTrim = native.trim();
  if (KO_NATIVE_TAG[nativeTrim]) return KO_NATIVE_TAG[nativeTrim];
  if (JA_NATIVE_TAG[nativeTrim]) return JA_NATIVE_TAG[nativeTrim];

  const enTag = tagFromEnglish(english);
  if (enTag) return enTag;

  const cat = normalizeCategory(category);
  return CATEGORY_TAG[cat] ?? 'learning';
}

export function getVisualTagIndex(tag: string, wordId?: string, native?: string): number {
  const key = wordId ?? native ?? tag;
  return hashString(`${tag}:${key}`);
}
