import {
  getKnownKidsVideo,
  isKidsVideoTitle,
  isSongFallbackRelevantEnough,
  isVideoRelevantEnough,
  resolveVisualTag,
  scoreKidsVideoTitle,
  scoreSongWithEnglishSubsTitle,
} from '@/lib/word-media-scoring';
import { getYoutubeMusicSearchUrl } from '@/lib/word-media-search';
import { buildYoutubeKidsSongQuery } from '@/lib/word-youtube-search';
import { getKidsSongSuffix, getWordSearchContext } from '@/lib/word-search-context';
import { hasEnglishCaptions, titleHintsEnglishSubtitles } from '@/lib/youtube-captions';
import { NextRequest, NextResponse } from 'next/server';
import yts from 'yt-search';

export const runtime = 'nodejs';
export const maxDuration = 25;

interface RawHit {
  videoId: string;
  title: string;
}

interface ScoredHit extends RawHit {
  score: number;
  hasEnglishCaptions: boolean;
}

function buildKidsQueries(
  native: string,
  english: string,
  category: string,
  language: string,
  exampleNative = ''
): string[] {
  const word = native.trim();
  const ctx = getWordSearchContext(word, english, category, exampleNative, language);
  const primary = buildYoutubeKidsSongQuery(word, english, category, language, exampleNative);

  if (language === 'ko' || language === 'ja') {
    const suffix = getKidsSongSuffix(language);
    const queries = [
      primary,
      `${word} ${ctx.koTopic} ${ctx.enKeyword} ${suffix}`,
    ];
    if (language === 'ko') {
      queries.push(`${word} 어린이 ${ctx.koTopic} 노래`);
    } else {
      queries.push(`${word} 童謡 ${ctx.koTopic}`, `${word} こどものうた ${ctx.enKeyword}`);
    }
    if (ctx.needsDisambiguation) {
      queries.push(
        `${ctx.koTopic} ${ctx.enKeyword} ${suffix}`,
        `${ctx.enKeyword} ${word} ${language === 'ja' ? 'japanese' : 'korean'} ${suffix}`
      );
    }
    return [...new Set(queries.map((q) => q.replace(/\s+/g, ' ').trim()))];
  }
  return [primary];
}

function buildSongFallbackQueries(
  native: string,
  english: string,
  category: string,
  language: string
): string[] {
  const word = native.trim();
  const ctx = getWordSearchContext(word, english, category, '', language);
  const en = english.split(/[/;,]/)[0].trim();
  if (language === 'ko') {
    return [
      ...new Set([
        `${word} ${ctx.enKeyword} english subtitles`,
        `${word} ${ctx.koTopic} song english lyrics`,
        `${ctx.koTopic} ${word} ${en} english subtitles`,
        `${word} 노래 영어 자막`,
      ]),
    ];
  }
  if (language === 'ja') {
    return [
      ...new Set([
        `${word} ${ctx.enKeyword} english subtitles`,
        `${word} ${ctx.koTopic} 歌 英語字幕`,
        `${ctx.koTopic} ${word} ${en} english subtitles song`,
        `${word} 童謡 英語`,
      ]),
    ];
  }
  return [`${word} ${en} english subtitles song`];
}

async function collectVideos(
  queries: string[],
  filter: (title: string) => boolean,
  excludeIds: Set<string> = new Set()
): Promise<RawHit[]> {
  const hits: RawHit[] = [];
  const seen = new Set<string>();

  for (const query of queries) {
    try {
      const result = await yts(query);
      for (const v of result.videos ?? []) {
        if (!v.videoId || !v.title || seen.has(v.videoId)) continue;
        if (excludeIds.has(v.videoId)) continue;
        if ((v.seconds ?? 0) > 600) continue;
        if (!filter(v.title)) continue;
        seen.add(v.videoId);
        hits.push({ videoId: v.videoId, title: v.title });
      }
    } catch {
      /* try next query */
    }
  }
  return hits;
}

function pickFirstExcluded<T extends { videoId: string }>(
  ranked: T[],
  excludeIds: Set<string>
): T | undefined {
  return ranked.find((h) => !excludeIds.has(h.videoId));
}

async function scoreSongCandidates(
  hits: RawHit[],
  native: string,
  english: string,
  tag: string,
  category: string,
  language: string
): Promise<ScoredHit[]> {
  const top = hits.slice(0, 12);
  const captionChecks = await Promise.all(
    top.map(async (h) => ({
      ...h,
      hasEnglishCaptions:
        titleHintsEnglishSubtitles(h.title) || (await hasEnglishCaptions(h.videoId)),
    }))
  );

  return captionChecks
    .map((h) => ({
      ...h,
      score: scoreSongWithEnglishSubsTitle(h.title, native, english, tag, category, language),
    }))
    .filter((h) => h.hasEnglishCaptions && h.score > 0)
    .sort((a, b) => b.score - a.score);
}

function jsonVideo(
  hit: { videoId: string; title: string; score: number },
  query: string,
  source: string,
  verified: boolean,
  hasEnglishCaptions = false
) {
  return {
    videoId: hit.videoId,
    title: hit.title,
    query,
    watchUrl: `https://www.youtube.com/watch?v=${hit.videoId}`,
    relevanceScore: hit.score,
    verified,
    hasEnglishCaptions,
    embedUrl: `https://www.youtube-nocookie.com/embed/${hit.videoId}`,
    source,
  };
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim();
  const native = request.nextUrl.searchParams.get('native')?.trim() ?? '';
  const english = request.nextUrl.searchParams.get('english')?.trim() ?? '';
  const language = request.nextUrl.searchParams.get('language')?.trim() ?? 'ko';
  const category = request.nextUrl.searchParams.get('category')?.trim() ?? '';
  const exampleNative = request.nextUrl.searchParams.get('exampleNative')?.trim() ?? '';
  const excludeParam = request.nextUrl.searchParams.get('exclude')?.trim() ?? '';
  const excludeIds = new Set(
    excludeParam
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean)
  );

  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  const word = native || query.replace(/\s*(동요|子供の歌)\s*$/, '').trim();
  const tag = resolveVisualTag(word, english, category);
  const watchUrlSearch = getYoutubeMusicSearchUrl(word, language, english, category, exampleNative);

  const known = getKnownKidsVideo(word, language);
  if (
    known &&
    !excludeIds.has(known.videoId) &&
    !getWordSearchContext(word, english, category, exampleNative, language).needsDisambiguation
  ) {
    return NextResponse.json({
      ...jsonVideo({ ...known, score: 100 }, query, 'curated', true),
      hasEnglishCaptions: false,
    });
  }

  try {
    const kidsQueries = buildKidsQueries(word, english, category, language, exampleNative);
    const kidsRaw = await collectVideos(kidsQueries, isKidsVideoTitle, excludeIds);
    const kidsRanked = kidsRaw
      .map((h) => ({
        ...h,
        score: scoreKidsVideoTitle(h.title, word, english, tag, category, language),
      }))
      .filter((h) => h.score > 0)
      .sort((a, b) => b.score - a.score);

    const bestKids = pickFirstExcluded(
      kidsRanked.filter((h) =>
        isVideoRelevantEnough(h.score, h.title, word, english, category, language)
      ),
      excludeIds
    );
    if (bestKids) {
      return NextResponse.json(jsonVideo(bestKids, query, 'kids', true));
    }

    const kidsFallback = pickFirstExcluded(
      kidsRanked.filter((h) => h.score >= 35),
      excludeIds
    );
    if (kidsFallback) {
      return NextResponse.json(jsonVideo(kidsFallback, query, 'kids', false));
    }

    const songQueries = buildSongFallbackQueries(word, english, category, language);
    const songRaw = await collectVideos(
      songQueries,
      (title) => titleHintsEnglishSubtitles(title) || /song|노래|lyric|가사/i.test(title),
      excludeIds
    );
    const songRanked = await scoreSongCandidates(songRaw, word, english, tag, category, language);
    const bestSong = pickFirstExcluded(
      songRanked.filter((h) =>
        isSongFallbackRelevantEnough(
          h.score,
          h.title,
          word,
          h.hasEnglishCaptions,
          english,
          category,
          language
        )
      ),
      excludeIds
    );

    if (bestSong) {
      return NextResponse.json(
        jsonVideo(bestSong, query, 'song-en-subs', true, bestSong.hasEnglishCaptions)
      );
    }

    const songFallback = pickFirstExcluded(
      songRanked.filter((h) => h.score >= 30),
      excludeIds
    );
    if (songFallback) {
      return NextResponse.json(
        jsonVideo(songFallback, query, 'song-en-subs', false, songFallback.hasEnglishCaptions)
      );
    }
  } catch (err) {
    console.error('yt-search failed:', err);
  }

  return NextResponse.json({
    videoId: null,
    title: null,
    query,
    watchUrl: watchUrlSearch,
    verified: false,
    relevanceScore: 0,
    hasEnglishCaptions: false,
  });
}
