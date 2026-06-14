const SPEECH_LANG: Record<string, string> = {
  ko: 'ko-KR',
  ja: 'ja-JP',
  fr: 'fr-FR',
  he: 'he-IL',
  en: 'en-US',
};

function waitForVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve([]);
      return;
    }

    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    const onVoicesChanged = () => {
      synth.removeEventListener('voiceschanged', onVoicesChanged);
      resolve(synth.getVoices());
    };
    synth.addEventListener('voiceschanged', onVoicesChanged);
    setTimeout(() => resolve(synth.getVoices()), 300);
  });
}

function pickVoice(voices: SpeechSynthesisVoice[], language: string): SpeechSynthesisVoice | undefined {
  const langCode = SPEECH_LANG[language] ?? 'en-US';
  const prefix = langCode.split('-')[0];

  return (
    voices.find((v) => v.lang === langCode) ??
    voices.find((v) => v.lang.replace('_', '-').startsWith(prefix)) ??
    voices.find((v) => v.lang.toLowerCase().includes(prefix))
  );
}

export async function speakText(text: string, language: string): Promise<void> {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    throw new Error('Speech not supported');
  }

  const synth = window.speechSynthesis;
  synth.cancel();

  // Chrome needs a brief pause after cancel before speak works reliably
  await new Promise((r) => setTimeout(r, 50));

  const voices = await waitForVoices();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = SPEECH_LANG[language] ?? 'en-US';
  utterance.rate = 0.9;
  utterance.volume = 1;

  const voice = pickVoice(voices, language);
  if (voice) utterance.voice = voice;

  await new Promise<void>((resolve, reject) => {
    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e.error ?? new Error('Speech failed'));
    synth.speak(utterance);
    if (synth.paused) synth.resume();
  });
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/** Call once on app load so voices are ready before first tap */
export function warmUpSpeech(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.getVoices();
  }
}
