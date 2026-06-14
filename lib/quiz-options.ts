import { shuffleArray } from './shuffle';

/** Build a fixed set of quiz choices — shuffle once per question, not on every render. */
export function buildQuizOptions(correct: string, pool: string[], choiceCount = 4): string[] {
  const others = shuffleArray([...new Set(pool.filter((x) => x && x !== correct))]).slice(0, choiceCount - 1);
  return shuffleArray([correct, ...others]);
}
