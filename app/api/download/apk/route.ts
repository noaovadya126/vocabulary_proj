import { APK_FILENAME, APK_DOWNLOAD_URL, getApkDownloadUrl } from '@/lib/nativeApp';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'downloads', APK_FILENAME);
    const file = await readFile(filePath);

    return new NextResponse(new Uint8Array(file), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Disposition': `attachment; filename="${APK_FILENAME}"`,
        'Content-Length': String(file.byteLength),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return NextResponse.redirect(getApkDownloadUrl(), 302);
  }
}
