/** Local MP3 overrides (files that exist under public/media/) */
const LOCAL_AUDIO: Record<string, Record<string, string>> = {
  ko: {
    'hello.mp3': '/media/ko/hello.mp3',
    'thank-you.mp3': '/media/ko/thank-you.mp3',
    'thankyou.mp3': '/media/ko/thank-you.mp3',
    'yes.mp3': '/media/ko/yes.mp3',
  },
};

export function getAudioUrl(language: string, filename?: string): string | null {
  if (!filename) return null;
  const mapped = LOCAL_AUDIO[language]?.[filename];
  if (mapped) return mapped;
  return `/media/${language}/${filename}`;
}

export function getVideoUrl(language: string, filename?: string): string | null {
  if (!filename) return null;
  return `/media/${language}/${filename}`;
}

export function hasLocalAudio(language: string, filename?: string): boolean {
  if (!filename) return false;
  return Boolean(LOCAL_AUDIO[language]?.[filename]);
}

/** Video files on disk (add paths here when MP4s are available) */
const LOCAL_VIDEO: Record<string, Record<string, string>> = {};

export function hasLocalVideo(language: string, filename?: string): boolean {
  if (!filename) return false;
  return Boolean(LOCAL_VIDEO[language]?.[filename]);
}
