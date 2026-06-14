const MUSIC_MUTED_KEY = 'vq_music_muted';
/** @deprecated Use isMusicMuted — kept so old keys don't break word audio */
const LEGACY_AUDIO_KEY = 'vq_audio_muted';

type Listener = () => void;
const listeners = new Set<Listener>();

export function isMusicMuted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(MUSIC_MUTED_KEY) === '1';
}

export function setMusicMuted(muted: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MUSIC_MUTED_KEY, muted ? '1' : '0');
  listeners.forEach((cb) => cb());
}

export function toggleMusicMuted(): boolean {
  const next = !isMusicMuted();
  setMusicMuted(next);
  return next;
}

/** Word pronunciation / TTS is never blocked by the music mute button. */
export function isAudioMuted(): boolean {
  return false;
}

export function setAudioMuted(_muted: boolean): void {
  // Music-only mute — word audio stays enabled.
}

export function toggleAudioMuted(): boolean {
  return toggleMusicMuted();
}

export function subscribeAudioSettings(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

if (typeof window !== 'undefined') {
  const legacy = localStorage.getItem(LEGACY_AUDIO_KEY);
  if (legacy === '1' && localStorage.getItem(MUSIC_MUTED_KEY) === null) {
    localStorage.setItem(MUSIC_MUTED_KEY, '1');
  }
}
