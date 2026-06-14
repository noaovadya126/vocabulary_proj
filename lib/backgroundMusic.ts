import { isMusicMuted, subscribeAudioSettings } from './audioSettings';
import { startAmbientMusic, stopAmbientMusic } from './ambientMusic';

const CALM_TRACKS = [
  '/audio/calm-piano-full.mp3',
  '/audio/spring-piano.mp3',
];

const MUSIC_VOLUME = 0.14;

let audioEl: HTMLAudioElement | null = null;
let trackIndex = 0;
let unlocked = false;
let playing = false;
let autoplayBlocked = false;

function getAudio(): HTMLAudioElement {
  if (!audioEl) {
    audioEl = new Audio();
    audioEl.loop = true;
    audioEl.volume = MUSIC_VOLUME;
    audioEl.preload = 'auto';
  }
  return audioEl;
}

function tryPlayTrack(idx: number): void {
  if (typeof window === 'undefined' || isMusicMuted()) return;

  if (idx >= CALM_TRACKS.length) {
    startAmbientMusic();
    playing = true;
    autoplayBlocked = false;
    return;
  }

  const el = getAudio();
  el.volume = MUSIC_VOLUME;
  el.src = CALM_TRACKS[idx];

  const finishPlay = () => {
    playing = true;
    autoplayBlocked = false;
  };

  const tryMutedAutoplay = () => {
    el.muted = true;
    return el
      .play()
      .then(() => {
        el.muted = false;
        finishPlay();
      })
      .catch(() => {
        el.muted = false;
        throw new Error('autoplay blocked');
      });
  };

  void tryMutedAutoplay().catch(() => {
    void el
      .play()
      .then(finishPlay)
      .catch(() => {
        autoplayBlocked = true;
        tryPlayTrack(idx + 1);
      });
  });
}

export function startBackgroundMusic(): void {
  if (typeof window === 'undefined' || isMusicMuted()) return;
  unlocked = true;
  if (!playing) tryPlayTrack(trackIndex);
}

export function stopBackgroundMusic(): void {
  playing = false;
  autoplayBlocked = false;
  if (audioEl) {
    audioEl.pause();
    audioEl.currentTime = 0;
  }
  stopAmbientMusic();
}

export function unlockBackgroundMusic(): void {
  if (isMusicMuted()) return;
  unlocked = true;
  playing = false;
  autoplayBlocked = false;
  startBackgroundMusic();
}

export function isBackgroundMusicPlaying(): boolean {
  return playing;
}

export function isBackgroundMusicBlocked(): boolean {
  return autoplayBlocked && !playing;
}

if (typeof window !== 'undefined') {
  subscribeAudioSettings(() => {
    if (isMusicMuted()) stopBackgroundMusic();
    else if (unlocked) startBackgroundMusic();
  });
}
