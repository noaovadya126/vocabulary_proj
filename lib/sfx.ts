let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') void audioCtx.resume();
  return audioCtx;
}

function tone(freq: number, start: number, duration: number, type: OscillatorType = 'sine', gain = 0.12) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(gain, start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.05);
}

/** Cheerful "yay!" chirp */
export function playSuccessSfx(): void {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  tone(523, t, 0.12, 'triangle', 0.1);
  tone(659, t + 0.1, 0.12, 'triangle', 0.1);
  tone(784, t + 0.2, 0.18, 'triangle', 0.11);
}

/** Soft "aww" / oops */
export function playErrorSfx(): void {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  tone(330, t, 0.15, 'sine', 0.09);
  tone(262, t + 0.12, 0.22, 'sine', 0.1);
  tone(196, t + 0.28, 0.28, 'triangle', 0.08);
}
