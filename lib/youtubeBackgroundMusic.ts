/** Background music track: https://www.youtube.com/watch?v=Zu_pBbCwovA */
export const BACKGROUND_MUSIC_YOUTUBE_ID = 'Zu_pBbCwovA';

let iframe: HTMLIFrameElement | null = null;
let playing = false;
let loadPromise: Promise<void> | null = null;

function sendCommand(func: 'playVideo' | 'pauseVideo' | 'setVolume', args: number | string = '') {
  iframe?.contentWindow?.postMessage(
    JSON.stringify({ event: 'command', func, args }),
    '*'
  );
}

function ensureIframe(): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve();
  if (iframe) return loadPromise ?? Promise.resolve();

  loadPromise = new Promise((resolve) => {
    const el = document.createElement('iframe');
    el.width = '0';
    el.height = '0';
    el.title = 'Background music';
    el.style.cssText = 'position:fixed;left:-9999px;width:0;height:0;border:0;pointer-events:none';
    el.allow = 'autoplay; encrypted-media';
    const params = new URLSearchParams({
      enablejsapi: '1',
      autoplay: '0',
      loop: '1',
      playlist: BACKGROUND_MUSIC_YOUTUBE_ID,
      controls: '0',
      modestbranding: '1',
      rel: '0',
    });
    if (typeof window !== 'undefined') params.set('origin', window.location.origin);
    el.src = `https://www.youtube-nocookie.com/embed/${BACKGROUND_MUSIC_YOUTUBE_ID}?${params.toString()}`;
    el.onload = () => window.setTimeout(resolve, 400);
    document.body.appendChild(el);
    iframe = el;
  });

  return loadPromise;
}

export async function startYoutubeBackgroundMusic(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    await ensureIframe();
    sendCommand('setVolume', 14);
    sendCommand('playVideo');
    playing = true;
    return true;
  } catch {
    return false;
  }
}

export function stopYoutubeBackgroundMusic(): void {
  sendCommand('pauseVideo');
  playing = false;
}

export function isYoutubeBackgroundMusicPlaying(): boolean {
  return playing;
}
