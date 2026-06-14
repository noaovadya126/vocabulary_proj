import { LANGUAGE_NAMES } from './constants';

/** UI is English-only — Hebrew display mode removed. */
export function isHebrewDisplay(_displayLanguage?: string): boolean {
  return false;
}

export function getDisplayMeaning(english: string, _displayLanguage?: string): string {
  return english.split(/[/;,]/)[0].trim();
}

export function getLanguageDisplayName(languageCode: string, _displayLanguage?: string): string {
  return LANGUAGE_NAMES[languageCode] ?? languageCode;
}
