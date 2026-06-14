import { buildYoutubeKidsSongQuery, getYoutubeSearchEmbedUrl, getYoutubeSearchResultsUrl } from './word-youtube-search';

export function getYoutubeEmbedUrl(videoId: string, autoplay = false): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    enablejsapi: '1',
  });
  if (typeof window !== 'undefined') {
    params.set('origin', window.location.origin);
  }
  if (autoplay) params.set('autoplay', '1');
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function getYoutubeSearchQuery(
  native: string,
  english: string,
  category: string,
  language: string,
  exampleNative = ''
): string {
  return buildYoutubeKidsSongQuery(native, english, category, language, exampleNative);
}

export { getYoutubeSearchEmbedUrl, getYoutubeSearchResultsUrl };

export function getYoutubeThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function getYoutubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
