/** Check if a YouTube video likely has English captions (auto or manual). */
export async function hasEnglishCaptions(videoId: string): Promise<boolean> {
  const langs = ['en', 'en-US', 'en-GB', 'a.en'];
  for (const lang of langs) {
    try {
      const url = `https://www.youtube.com/api/timedtext?v=${encodeURIComponent(videoId)}&lang=${encodeURIComponent(lang)}&fmt=srv3`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' },
        signal: AbortSignal.timeout(4000),
        next: { revalidate: 86400 },
      });
      if (!res.ok) continue;
      const body = await res.text();
      if (body.length > 30 && /<text|WEBVTT/i.test(body)) return true;
    } catch {
      /* try next */
    }
  }
  return false;
}

export const ENGLISH_SUBTITLE_TITLE =
  /english subtitles?|english lyric|lyrics in english|eng(?:lish)? subs?|with english|english translation|bilingual|가사.*영어|영어.*가사|영어.*자막|영어자막|english ver|english version/i;

export function titleHintsEnglishSubtitles(title: string): boolean {
  return ENGLISH_SUBTITLE_TITLE.test(title);
}
