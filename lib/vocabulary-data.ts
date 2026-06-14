export interface MilestoneWord {
  id: number;
  native: string;
  english: string;
  phonetic: string;
  exampleNative: string;
  exampleEnglish: string;
  category: string;
  topikLevel: number;
  image: string;
  audioFile?: string;
  videoFile?: string;
  youtubeId?: string;
}

export interface VocabWord {
  id: string;
  lemma: string;
  phonetic: string;
  translation: string;
  partOfSpeech: string;
  exampleNative: string;
  exampleTranslation: string;
  difficultyLevel: number;
  category: string;
  audioFile?: string;
  videoFile?: string;
  imageEmoji?: string;
  youtubeId?: string;
  wordId?: number;
}

import { normalizeCategory } from './categories';
import { getDisplayMeaning } from './displayText';
import { KO_TOPIK_WORDS } from './data/ko-topik-words';
import { JA_WORDS } from './data/ja-words';
import { shuffleArray } from './shuffle';

const KO_LOCAL_AUDIO: Record<string, string> = {
  '안녕하세요': 'hello.mp3',
  '감사합니다': 'thank-you.mp3',
  '네': 'yes.mp3',
};

const koMilestoneWords: MilestoneWord[] = KO_TOPIK_WORDS.map((w) => ({
  ...w,
  category: normalizeCategory(w.category),
  audioFile: KO_LOCAL_AUDIO[w.native],
}));

const jaMilestoneWords: MilestoneWord[] = JA_WORDS.map((w) => ({
  ...w,
  category: normalizeCategory(w.category),
}));

const frMilestoneWords: MilestoneWord[] = [
  { id: 1, native: 'Bonjour', english: 'Hello', phonetic: 'bonzhur', exampleNative: 'Bonjour ! Comment allez-vous ?', exampleEnglish: 'Hello! How are you?', category: 'Greetings', topikLevel: 1, image: '👋', audioFile: 'hello.mp3', videoFile: 'hello.mp4' },
  { id: 2, native: 'Merci', english: 'Thank you', phonetic: 'mersi', exampleNative: 'Merci beaucoup !', exampleEnglish: 'Thank you very much!', category: 'Greetings', topikLevel: 1, image: '🙏', audioFile: 'merci.mp3', videoFile: 'merci.mp4' },
  { id: 3, native: "S'il vous plaît", english: 'Please', phonetic: 'sil vu ple', exampleNative: "S'il vous plaît, aidez-moi.", exampleEnglish: 'Please help me.', category: 'Greetings', topikLevel: 1, image: '🤲', audioFile: 'please.mp3', videoFile: 'please.mp4' },
  { id: 4, native: 'Désolé', english: 'Sorry', phonetic: 'dezole', exampleNative: 'Désolé, je suis en retard.', exampleEnglish: 'Sorry, I am late.', category: 'Greetings', topikLevel: 1, image: '😔', audioFile: 'sorry.mp3', videoFile: 'sorry.mp4' },
  { id: 5, native: 'Oui', english: 'Yes', phonetic: 'wi', exampleNative: 'Oui, je comprends.', exampleEnglish: 'Yes, I understand.', category: 'Greetings', topikLevel: 1, image: '👍', audioFile: 'yes.mp3', videoFile: 'yes.mp4' },
  { id: 6, native: 'Non', english: 'No', phonetic: 'non', exampleNative: 'Non, ça va.', exampleEnglish: 'No, I am fine.', category: 'Greetings', topikLevel: 1, image: '👎', audioFile: 'no.mp3', videoFile: 'no.mp4' },
  { id: 7, native: 'Eau', english: 'Water', phonetic: 'o', exampleNative: "De l'eau, s'il vous plaît.", exampleEnglish: 'Water, please.', category: 'Food', topikLevel: 1, image: '💧', audioFile: 'water.mp3', videoFile: 'water.mp4' },
  { id: 8, native: 'École', english: 'School', phonetic: 'ekol', exampleNative: "Je vais à l'école.", exampleEnglish: 'I go to school.', category: 'Places', topikLevel: 1, image: '🏫', audioFile: 'school.mp3', videoFile: 'school.mp4' },
  { id: 9, native: 'Ami', english: 'Friend', phonetic: 'ami', exampleNative: "J'ai rencontré un ami.", exampleEnglish: 'I met a friend.', category: 'People', topikLevel: 1, image: '👫', audioFile: 'friend.mp3', videoFile: 'friend.mp4' },
  { id: 10, native: 'Famille', english: 'Family', phonetic: 'famiy', exampleNative: 'Ma famille me manque.', exampleEnglish: 'I miss my family.', category: 'People', topikLevel: 1, image: '👨‍👩‍👧', audioFile: 'family.mp3', videoFile: 'family.mp4' },
  { id: 11, native: "Aujourd'hui", english: 'Today', phonetic: 'ozhurdui', exampleNative: "Il fait beau aujourd'hui.", exampleEnglish: 'The weather is nice today.', category: 'Time', topikLevel: 1, image: '📅', audioFile: 'today.mp3', videoFile: 'today.mp4' },
  { id: 12, native: 'Français', english: 'French', phonetic: 'franse', exampleNative: "J'étudie le français.", exampleEnglish: 'I study French.', category: 'Study', topikLevel: 1, image: '📖', audioFile: 'french.mp3', videoFile: 'french.mp4' },
];

export const MILESTONE_WORDS: Record<string, MilestoneWord[]> = {
  ko: koMilestoneWords,
  ja: jaMilestoneWords,
  fr: frMilestoneWords,
};

export function getMilestoneWords(language: string, milestoneId?: string): MilestoneWord[] {
  const all = MILESTONE_WORDS[language] ?? MILESTONE_WORDS.ko;
  if (!milestoneId) return all;
  const mid = parseInt(milestoneId, 10) || 1;
  const start = (mid - 1) * WORDS_PER_MILESTONE;
  return all.slice(start, start + WORDS_PER_MILESTONE);
}

export function getMilestoneWord(language: string, wordId: number): MilestoneWord | undefined {
  return (MILESTONE_WORDS[language] ?? MILESTONE_WORDS.ko).find((w) => w.id === wordId);
}

export function getMaxWordId(language: string): number {
  return (MILESTONE_WORDS[language] ?? MILESTONE_WORDS.ko).length;
}

const WORDS_PER_MILESTONE = 5;

export function getMilestoneCount(language: string): number {
  const total = (MILESTONE_WORDS[language] ?? MILESTONE_WORDS.ko).length;
  return Math.max(1, Math.ceil(total / WORDS_PER_MILESTONE));
}

export function groupVocabularyByMilestone(language: string): { milestoneId: number; words: VocabWord[] }[] {
  const all = VOCABULARY_BY_LANGUAGE[language] ?? [];
  const count = getMilestoneCount(language);
  return Array.from({ length: count }, (_, i) => ({
    milestoneId: i + 1,
    words: all.slice(i * WORDS_PER_MILESTONE, i * WORDS_PER_MILESTONE + WORDS_PER_MILESTONE),
  }));
}

function inferPartOfSpeech(category: string): string {
  const cat = normalizeCategory(category);
  if (cat === 'Actions') return 'VERB';
  if (cat === 'Descriptions') return 'ADJ';
  if (cat === 'Numbers') return 'NUM';
  if (cat === 'Greetings') return 'EXPR';
  if (cat === 'Feelings') return 'ADJ';
  return 'NOUN';
}

function toVocabWord(w: MilestoneWord, lang: string): VocabWord {
  return {
    id: `${lang}_${w.id}`,
    lemma: w.native,
    phonetic: w.phonetic,
    translation: w.english,
    partOfSpeech: inferPartOfSpeech(w.category),
    exampleNative: w.exampleNative,
    exampleTranslation: w.exampleEnglish,
    difficultyLevel: w.topikLevel,
    category: normalizeCategory(w.category),
    audioFile: w.audioFile,
    videoFile: w.videoFile,
    imageEmoji: w.image,
    youtubeId: w.youtubeId,
    wordId: w.id,
  };
}

export const VOCABULARY_BY_LANGUAGE: Record<string, VocabWord[]> = {
  ko: koMilestoneWords.map((w) => toVocabWord(w, 'ko')),
  ja: jaMilestoneWords.map((w) => toVocabWord(w, 'ja')),
  fr: frMilestoneWords.map((w) => toVocabWord(w, 'fr')),
};

export function getWordsByTopikLevel(language: string, level: number): MilestoneWord[] {
  const all = MILESTONE_WORDS[language] ?? MILESTONE_WORDS.ko;
  return all.filter((w) => w.topikLevel === level);
}

export function getQuizQuestions(language: string, milestoneId?: string, displayLanguage = 'en') {
  const words = milestoneId
    ? getMilestoneWords(language, milestoneId)
    : (MILESTONE_WORDS[language] ?? MILESTONE_WORDS.ko).slice(0, 5);
  const pool = MILESTONE_WORDS[language] ?? MILESTONE_WORDS.ko;
  const toMeaning = (english: string) => getDisplayMeaning(english, displayLanguage);

  return words.map((w, i) => {
    const correctAnswer = toMeaning(w.english);
    const distractorPool = shuffleArray(pool.filter((x) => x.id !== w.id));
    const distractors: string[] = [];

    for (const candidate of distractorPool) {
      const meaning = toMeaning(candidate.english);
      if (meaning !== correctAnswer && !distractors.includes(meaning)) {
        distractors.push(meaning);
      }
      if (distractors.length >= 3) break;
    }

    const options = shuffleArray([correctAnswer, ...distractors].slice(0, 4));
    return {
      id: i + 1,
      wordId: w.id,
      word: w.native,
      translation: correctAnswer,
      options,
      correctAnswer,
      audioFile: w.audioFile,
    };
  });
}
