import { isMusicMuted } from './audioSettings';

let ctx: AudioContext | null = null;
let timer: ReturnType<typeof setInterval> | null = null;
let noteIndex = 0;
let isRunning = false;

// Japanese yo scale (calm pentatonic fallback)
const MELODY = [261.63, 293.66, 349.23, 392.0, 440.0, 392.0, 349.23, 293.66];
const NOTE_MS = 1100;

function playTone(frequency: number, duration: number) {
  if (!ctx || isMusicMuted()) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function startAmbientMusic(): void {
  if (typeof window === 'undefined' || isRunning || isMusicMuted()) return;

  try {
    ctx = ctx ?? new AudioContext();
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }
  } catch {
    return;
  }

  isRunning = true;
  noteIndex = 0;

  const tick = () => {
    if (isMusicMuted()) {
      stopAmbientMusic();
      return;
    }
    playTone(MELODY[noteIndex % MELODY.length], 0.75);
    noteIndex += 1;
  };

  tick();
  timer = setInterval(tick, NOTE_MS);
}

export function stopAmbientMusic(): void {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  isRunning = false;
}

export function isAmbientMusicPlaying(): boolean {
  return isRunning;
}
