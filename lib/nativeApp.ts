import { ExternalBrowser } from '@/lib/externalBrowser';

/** True when running inside the Capacitor native shell (Google Play / sideload APK). */
export function isNativeApp(): boolean {
  if (typeof window === 'undefined') return false;
  const cap = (window as Window & { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  return cap?.isNativePlatform?.() === true;
}

/** Android WebView (Capacitor loads the live site inside one). */
export function isAndroidWebView(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /android/i.test(ua) && (/;\s*wv\)/i.test(ua) || /Version\/[\d.]+.*Chrome\/[\d.]+ Mobile/i.test(ua));
}

/** Google blocks OAuth inside embedded browsers — must open Chrome / system browser. */
export function shouldUseExternalGoogleSignIn(): boolean {
  return isNativeApp() || isAndroidWebView();
}

/** Google Play listing — set after publishing. */
export const GOOGLE_PLAY_URL = '';

export const APK_FILENAME = 'VocabQuest.apk';

const DEFAULT_SITE_ORIGIN =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || 'https://vocabulary-proj.vercel.app';

const DEFAULT_APK_PATH = '/downloads/VocabQuest.apk';

/** Absolute APK URL — works reliably on Android browsers and in the native WebView. */
export function getApkDownloadUrl(): string {
  const override = process.env.NEXT_PUBLIC_APK_URL?.trim();
  if (override?.startsWith('http://') || override?.startsWith('https://')) {
    return override;
  }

  const path = override
    ? override.startsWith('/')
      ? override
      : `/${override}`
    : DEFAULT_APK_PATH;

  if (typeof window !== 'undefined') {
    return `${window.location.origin}${path}`;
  }

  return `${DEFAULT_SITE_ORIGIN}${path}`;
}

/** @deprecated Prefer getApkDownloadUrl() for absolute URLs in UI links. */
export const APK_DOWNLOAD_URL = getApkDownloadUrl();

export function isAndroidBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /android/i.test(navigator.userAgent);
}

function getAppOrigin(): string {
  if (typeof window === 'undefined') return 'https://vocabulary-proj.vercel.app';
  return window.location.origin;
}

/** Launch the system browser from Android WebView (avoids Google disallowed_useragent). */
function openInSystemBrowser(url: string): void {
  if (typeof window === 'undefined') return;

  if (/android/i.test(navigator.userAgent)) {
    try {
      const parsed = new URL(url);
      const fallback = encodeURIComponent(url);
      const intentUrl =
        `intent://${parsed.host}${parsed.pathname}${parsed.search}` +
        `#Intent;scheme=https;action=android.intent.action.VIEW;` +
        `S.browser_fallback_url=${fallback};end`;
      window.location.href = intentUrl;
      return;
    } catch {
      /* fall through */
    }
  }

  window.open(url, '_blank', 'noopener,noreferrer');
}

/** Opens Google sign-in in the device browser (not WebView) and returns via deep link. */
export async function openNativeGoogleSignIn(): Promise<void> {
  const bridgeUrl = `${getAppOrigin()}/auth/native-signin-bridge`;

  if (isNativeApp()) {
    try {
      await ExternalBrowser.open({ url: bridgeUrl });
      return;
    } catch {
      /* fall through to intent URL */
    }
  }

  if (shouldUseExternalGoogleSignIn()) {
    openInSystemBrowser(bridgeUrl);
    return;
  }

  try {
    const { Browser } = await import('@capacitor/browser');
    await Browser.open({ url: bridgeUrl });
  } catch {
    openInSystemBrowser(bridgeUrl);
  }
}
