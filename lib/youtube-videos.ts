/** Educational Korean lesson videos (watch on YouTube — avoids broken embeds). */
export const KO_WORD_YOUTUBE: Record<number, string> = {
  1: 'jM05xMs_0yA',
  2: 'jM05xMs_0yA',
  3: 'jM05xMs_0yA',
  4: 'jM05xMs_0yA',
  5: 'jM05xMs_0yA',
  6: 'jM05xMs_0yA',
  7: 'jM05xMs_0yA',
  8: 'FkeNaD0b6Zs',
  9: 'FkeNaD0b6Zs',
  10: 'Vfa9Fox6YlY',
  11: 'jM05xMs_0yA',
  12: 'jM05xMs_0yA',
  13: 'jM05xMs_0yA',
  14: 'jM05xMs_0yA',
  15: 'jM05xMs_0yA',
  16: 'jM05xMs_0yA',
  17: 'Vfa9Fox6YlY',
  18: 'FkeNaD0b6Zs',
  19: 'FkeNaD0b6Zs',
  20: 'FkeNaD0b6Zs',
  21: 'Vfa9Fox6YlY',
  22: 'jM05xMs_0yA',
  23: 'jM05xMs_0yA',
  24: 'jM05xMs_0yA',
  25: 'jM05xMs_0yA',
  26: 'jM05xMs_0yA',
  27: 'jM05xMs_0yA',
  28: 'jM05xMs_0yA',
  29: 'jM05xMs_0yA',
  30: 'jM05xMs_0yA',
  31: 'Vfa9Fox6YlY',
  32: 'Vfa9Fox6YlY',
  33: 'jM05xMs_0yA',
  34: 'jM05xMs_0yA',
  35: 'jM05xMs_0yA',
};

export const KO_CATEGORY_YOUTUBE: Record<string, string> = {
  Greetings: 'jM05xMs_0yA',
  'Daily life': 'jM05xMs_0yA',
  Food: 'FkeNaD0b6Zs',
  Places: 'Vfa9Fox6YlY',
  People: 'jM05xMs_0yA',
  Time: 'jM05xMs_0yA',
  Feelings: 'jM05xMs_0yA',
  Study: 'jM05xMs_0yA',
  Numbers: 'jM05xMs_0yA',
  Shopping: 'FkeNaD0b6Zs',
  Transport: 'Vfa9Fox6YlY',
  Weather: 'jM05xMs_0yA',
};

export const JA_CATEGORY_YOUTUBE: Record<string, string> = {
  Greetings: 'pSvH0zHij7M',
  Food: '9W_pZVS9Xiw',
  Places: '9W_pZVS9Xiw',
  People: 'pSvH0zHij7M',
  Time: 'pSvH0zHij7M',
  Study: 'pSvH0zHij7M',
};

export const FR_CATEGORY_YOUTUBE: Record<string, string> = {
  Greetings: 'VgWP8GtjTVY',
  Food: 'VgWP8GtjTVY',
  Places: 'VgWP8GtjTVY',
  People: 'VgWP8GtjTVY',
  Time: 'VgWP8GtjTVY',
  Study: 'VgWP8GtjTVY',
};

export function getYoutubeId(
  language: string,
  wordId: number,
  category: string,
  explicitId?: string
): string | null {
  if (explicitId) return explicitId;
  if (language === 'ko') return KO_WORD_YOUTUBE[wordId] ?? KO_CATEGORY_YOUTUBE[category] ?? null;
  if (language === 'ja') return JA_CATEGORY_YOUTUBE[category] ?? null;
  if (language === 'fr') return FR_CATEGORY_YOUTUBE[category] ?? null;
  return null;
}

export function getYoutubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function getYoutubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
