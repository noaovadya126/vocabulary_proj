'use client';

import { APK_DOWNLOAD_API_URL, APK_DOWNLOAD_URL } from '@/lib/nativeApp';
import { Download } from 'lucide-react';
import { useEffect } from 'react';

export default function DownloadAppPage() {
  useEffect(() => {
    if (/android/i.test(navigator.userAgent)) {
      window.location.href = APK_DOWNLOAD_API_URL;
    }
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#fff8fb] to-[#f0fdf4] px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-pink-200/60 bg-white/90 p-8 text-center shadow-lg">
        <h1 className="text-2xl font-bold text-[#5c4a6e]">Download VocabQuest</h1>
        <p className="mt-2 text-sm text-[#8b7a9e]">
          Android app — install the APK on your phone.
        </p>

        <div className="mt-6 space-y-3">
          <a
            href={APK_DOWNLOAD_API_URL}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#e8759a] to-[#7bc89c] px-4 py-3 text-sm font-semibold text-white"
          >
            <Download className="h-4 w-4" />
            Download app (recommended)
          </a>

          <a
            href={APK_DOWNLOAD_URL}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#e8759a]/40 bg-white px-4 py-3 text-sm font-semibold text-[#5c4a6e]"
          >
            Direct file link
          </a>
        </div>

        <ol className="mt-6 space-y-1 text-left text-xs text-[#8b7a9e]">
          <li>1. Tap Download app</li>
          <li>2. Open the downloaded APK file</li>
          <li>3. Allow install if asked, then tap Install</li>
        </ol>
      </div>
    </main>
  );
}
