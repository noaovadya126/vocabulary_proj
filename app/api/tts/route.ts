import { NextRequest, NextResponse } from 'next/server';

const TTS_LANG: Record<string, string> = {
  ko: 'ko',
  ja: 'ja',
  fr: 'fr',
  he: 'iw',
  en: 'en',
  es: 'es',
};

export async function GET(request: NextRequest) {
  const text = request.nextUrl.searchParams.get('text')?.trim();
  const lang = request.nextUrl.searchParams.get('lang') ?? 'ko';

  if (!text) {
    return NextResponse.json({ error: 'Missing text' }, { status: 400 });
  }

  if (text.length > 400) {
    return NextResponse.json({ error: 'Text too long' }, { status: 400 });
  }

  const tl = TTS_LANG[lang] ?? lang;
  const ttsUrl = `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=${tl}&q=${encodeURIComponent(text)}`;

  try {
    const response = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; VocabQuest/1.0)',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'TTS provider failed' }, { status: 502 });
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=604800',
      },
    });
  } catch {
    return NextResponse.json({ error: 'TTS request failed' }, { status: 500 });
  }
}
