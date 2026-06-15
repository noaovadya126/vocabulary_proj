'use client';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import {
  getApkDownloadUrl,
  GOOGLE_PLAY_URL,
  isAndroidBrowser,
  isNativeApp,
} from '@/lib/nativeApp';
import { Download, Smartphone, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const DISMISS_KEY = 'vq_get_app_dismissed';

export function GetTheAppBanner({ className }: { className?: string }) {
  const [visible, setVisible] = useState(false);
  const [android, setAndroid] = useState(false);
  const [apkUrl, setApkUrl] = useState('https://vocabulary-proj.vercel.app/downloads/VocabQuest.apk');

  useEffect(() => {
    if (isNativeApp() || sessionStorage.getItem(DISMISS_KEY) === '1') return;
    setVisible(true);
    setAndroid(isAndroidBrowser());
    setApkUrl(getApkDownloadUrl());
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border-2 border-pastel-pink/60 bg-gradient-to-r from-white via-pastel-pink-light/70 to-pastel-green-light/60 p-4 shadow-soft',
        className
      )}
    >
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-3 top-3 rounded-full p-1 text-brand-400 hover:bg-white/70 hover:text-brand-600"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex flex-col gap-3 pr-8">
        <div>
          <p className="text-sm font-bold text-brand-800">Get the VocabQuest app</p>
          <p className="mt-0.5 text-xs text-brand-600/90">
            Download the Android app to your phone — a real app, not a browser shortcut.
          </p>
        </div>

        <div className="rounded-2xl bg-white/80 px-4 py-3 text-xs text-brand-700 space-y-1.5">
          <p className="font-semibold">Install on Android</p>
          {android ? (
            <ol className="list-decimal list-inside space-y-0.5 text-brand-600">
              <li>Tap <strong>Download app</strong> below</li>
              <li>Open the downloaded file when prompted</li>
              <li>Allow install from this source if asked, then tap Install</li>
            </ol>
          ) : (
            <p>
              Tap <strong>Download app</strong>, then copy the file to your Android phone (WhatsApp,
              Drive, or USB) and open it to install.
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={apkUrl}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-brand-300/30 bg-gradient-to-r from-brand-400 to-brand-500 px-3 py-2 text-sm font-semibold text-white shadow-cute transition-all hover:from-brand-500 hover:to-brand-600 active:scale-[0.98] min-h-[44px]"
          >
            <Download className="h-4 w-4" />
            Download app
          </a>

          {GOOGLE_PLAY_URL ? (
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-brand-200 bg-white px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-pastel-pink/30 min-h-[44px]"
            >
              <Smartphone className="h-4 w-4" />
              Google Play
            </a>
          ) : (
            <Button type="button" size="sm" variant="secondary" disabled className="min-h-[44px]">
              <Smartphone className="h-4 w-4" />
              Google Play soon
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Compact download control for headers or menus. */
export function DownloadAppButton({ className }: { className?: string }) {
  const [show, setShow] = useState(false);
  const [apkUrl, setApkUrl] = useState('https://vocabulary-proj.vercel.app/downloads/VocabQuest.apk');

  useEffect(() => {
    setShow(!isNativeApp());
    setApkUrl(getApkDownloadUrl());
  }, []);

  if (!show) return null;

  return (
    <a
      href={apkUrl}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-xl border border-brand-200 bg-white/90 px-2.5 py-1.5 text-xs font-semibold text-brand-700 hover:bg-pastel-pink/40 min-h-[36px]',
        className
      )}
      title="Download VocabQuest for Android"
    >
      <Download className="h-3.5 w-3.5" />
      App
    </a>
  );
}
