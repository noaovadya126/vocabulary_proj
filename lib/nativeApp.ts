/** True when running inside the Capacitor native shell (Google Play / sideload APK). */
export function isNativeApp(): boolean {
  if (typeof window === 'undefined') return false;
  const cap = (window as Window & { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  return cap?.isNativePlatform?.() === true;
}

/** Google Play listing — set after publishing. */
export const GOOGLE_PLAY_URL = '';

/** Direct APK download (served from /public/downloads on Vercel). Override with NEXT_PUBLIC_APK_URL. */
export const APK_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_APK_URL?.trim() || '/downloads/VocabQuest.apk';

export const APK_FILENAME = 'VocabQuest.apk';

export function isAndroidBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /android/i.test(navigator.userAgent);
}
