import { isMusicMuted, subscribeAudioSettings } from './audioSettings';
import { startAmbientMusic, stopAmbientMusic } from './ambientMusic';

/** Mixkit "Piano Reflections" — full calm romantic piano (~3 min), royalty-free */
const CALM_TRACKS = [
  '/audio/calm-piano-full.mp3',
  '/audio/spring-piano.mp3',
  'https://assets.mixkit.co/music/22/22.mp3',
  'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
];

const MUSIC_VOLUME = 0.06;

let audioEl: HTMLAudioElement | null = null;
let trackIndex = 0;
let unlocked = false;
let playing = false;

function tryPlayTrack(idx: number): void {
  if (typeof window === 'undefined' || isMusicMuted()) return;

  if (idx >= CALM_TRACKS.length) {
    startAmbientMusic();
    playing = true;
    return;
  }

  try {
    if (!audioEl) {
      audioEl = new Audio();
      audioEl.loop = true;
      audioEl.volume = MUSIC_VOLUME;
    }
    audioEl.volume = MUSIC_VOLUME;
    audioEl.src = CALM_TRACKS[idx];
    void audioEl.play().then(() => {
      playing = true;
    }).catch(() => tryPlayTrack(idx + 1));
  } catch {
    tryPlayTrack(idx + 1);
  }
}

export function startBackgroundMusic(): void {
  if (typeof window === 'undefined' || isMusicMuted() || playing) return;
  unlocked = true;
  tryPlayTrack(trackIndex);
}

export function stopBackgroundMusic(): void {
  playing = false;
  if (audioEl) {
    audioEl.pause();
    audioEl.currentTime = 0;
  }
  stopAmbientMusic();
}

export function unlockBackgroundMusic(): void {
  if (unlocked || isMusicMuted()) return;
  unlocked = true;
  startBackgroundMusic();
}

export function isBackgroundMusicPlaying(): boolean {
  return playing;
}

if (typeof window !== 'undefined') {
  subscribeAudioSettings(() => {
    if (isMusicMuted()) stopBackgroundMusic();
    else if (unlocked) startBackgroundMusic();
  });
}
