import { getUserItem, setUserItem } from './userStorage';

export interface WordProgressEntry {
  status: 'not_started' | 'learning' | 'learned' | 'known';
  lastSeenAt?: string;
  correctStreak: number;
  totalAttempts: number;
  totalCorrect: number;
}

export function getWordProgressMap(language: string): Record<string, WordProgressEntry> {
  const raw = getUserItem(`word_progress_${language}`);
  return raw ? JSON.parse(raw) : {};
}

export function saveWordProgressMap(language: string, map: Record<string, WordProgressEntry>): void {
  setUserItem(`word_progress_${language}`, JSON.stringify(map));
}

export function markVocabWordKnown(language: string, wordId: string): Record<string, WordProgressEntry> {
  const map = getWordProgressMap(language);
  const existing = map[wordId] ?? {
    status: 'not_started' as const,
    correctStreak: 0,
    totalAttempts: 0,
    totalCorrect: 0,
  };
  map[wordId] = {
    ...existing,
    status: 'known',
    lastSeenAt: new Date().toISOString(),
  };
  saveWordProgressMap(language, map);
  return map;
}

/** Mark a milestone word as completed without opening the word page. */
export function markMilestoneWordKnown(
  language: string,
  milestoneId: string,
  wordId: number,
  milestoneWordIds: number[]
): void {
  const progressKey = `progress_${language}_${milestoneId}`;
  const progress = JSON.parse(getUserItem(progressKey) || '{}');
  progress[wordId] = 'completed';

  const idx = milestoneWordIds.indexOf(wordId);
  const nextId = milestoneWordIds[idx + 1];
  if (nextId != null && progress[nextId] === 'locked') {
    progress[nextId] = 'learning';
  }

  setUserItem(progressKey, JSON.stringify(progress));

  const milestoneProgressKey = `milestone_progress_${language}_${milestoneId}`;
  const milestoneData = JSON.parse(getUserItem(milestoneProgressKey) || '{}');
  milestoneData.completedWords = milestoneData.completedWords || [];
  if (!milestoneData.completedWords.includes(wordId)) {
    milestoneData.completedWords.push(wordId);
  }
  setUserItem(milestoneProgressKey, JSON.stringify(milestoneData));

  markVocabWordKnown(language, String(wordId));
}
