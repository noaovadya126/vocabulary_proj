import { audioPlayer } from './audio';
import { getAudioUrl, hasLocalAudio } from './media';
import { speakText, stopSpeech } from './speech';

const API_TTS_LANGUAGES = new Set(['ko', 'ja', 'fr', 'he', 'es']);

async function playServerTts(language: string, text: string): Promise<void> {
  const url = `/api/tts?lang=${encodeURIComponent(language)}&text=${encodeURIComponent(text)}`;
  await audioPlayer.play(url);
}

export async function playWordAudio(
  language: string,
  nativeText: string,
  audioFile?: string
): Promise<void> {
  stopSpeech();
  audioPlayer.stop();

  const text = nativeText?.trim();
  if (!text) {
    throw new Error('No text to speak');
  }

  if (audioFile && hasLocalAudio(language, audioFile)) {
    const url = getAudioUrl(language, audioFile);
    if (url) {
      try {
        await audioPlayer.play(url);
        return;
      } catch {
        // continue to server TTS
      }
    }
  }

  if (API_TTS_LANGUAGES.has(language)) {
    try {
      await playServerTts(language, text);
      return;
    } catch {
      // continue to browser speech
    }
  }

  await speakText(text, language);
}

export function stopWordAudio(): void {
  audioPlayer.stop();
  stopSpeech();
}
