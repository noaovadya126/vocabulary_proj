import { getUserItem, setUserItem } from './userStorage';

export function getWordNotes(language: string, milestoneId: string, wordId: string): string {
  return getUserItem(`notes_${language}_${milestoneId}_${wordId}`) ?? '';
}

export function getWordNotesByNative(
  language: string,
  milestoneId: string,
  nativeWord: string,
  milestoneWords: Array<{ id: number; native: string }>
): string {
  const match = milestoneWords.find((w) => w.native === nativeWord);
  if (match) {
    return getWordNotes(language, milestoneId, String(match.id));
  }
  return getUserItem(`notes_native_${language}_${nativeWord}`) ?? '';
}

export function setWordNotes(
  language: string,
  milestoneId: string,
  wordId: string,
  notes: string
): void {
  setUserItem(`notes_${language}_${milestoneId}_${wordId}`, notes);
}

export function setWordNotesByNative(language: string, nativeWord: string, notes: string): void {
  setUserItem(`notes_native_${language}_${nativeWord}`, notes);
}

export function getVocabGameNotes(language: string, nativeWord: string, wordId?: string): string {
  const byNative = getUserItem(`notes_native_${language}_${nativeWord}`) ?? '';
  if (byNative.trim()) return byNative;
  if (!wordId) return '';
  for (let m = 1; m <= 200; m += 1) {
    const notes = getWordNotes(language, String(m), wordId);
    if (notes.trim()) return notes;
  }
  return '';
}
