import {
  isImageRelevantEnough,
  resolveVisualTag,
  scoreWordImageTitle,
  shouldUseSemanticImageOnly,
} from '@/lib/word-media-scoring';
import {
  buildImageCacheKey,
  buildPinterestImageQuery,
  getPinterestSearchUrl,
} from '@/lib/word-media-search';
import { buildContextualImageSearchQueries, extractPrimaryEnglish } from '@/lib/word-search-context';
import { getContextualWordImageUrl } from '@/lib/word-image-library';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface ImageCandidate {
  url: string;
  title: string;
  source: string;
  score: number;
}

async function searchWikipedia(
  query: string,
  native: string,
  english: string,
  tag: string,
  category: string,
  language: string
): Promise<ImageCandidate[]> {
  try {
    const api = new URL('https://en.wikipedia.org/w/api.php');
    api.searchParams.set('action', 'query');
    api.searchParams.set('generator', 'search');
    api.searchParams.set('gsrsearch', query);
    api.searchParams.set('gsrlimit', '6');
    api.searchParams.set('prop', 'pageimages|pageterms');
    api.searchParams.set('piprop', 'thumbnail');
    api.searchParams.set('pithumbsize', '400');
    api.searchParams.set('format', 'json');

    const res = await fetch(api.toString(), { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data = await res.json();
    const pages = data.query?.pages ?? {};
    const out: ImageCandidate[] = [];

    for (const page of Object.values(pages) as Array<{
      title?: string;
      terms?: Array<{ title?: string }>;
      thumbnail?: { source?: string };
    }>) {
      const imageUrl = page.thumbnail?.source;
      const title = page.title ?? page.terms?.[0]?.title ?? '';
      if (!imageUrl || !title) continue;
      const score = scoreWordImageTitle(title, native, english, tag, category, language) + 10;
      if (score >= 20) {
        out.push({ url: imageUrl, title, source: 'wikipedia', score });
      }
    }
    return out;
  } catch {
    return [];
  }
}

async function searchOpenverse(
  query: string,
  native: string,
  english: string,
  tag: string,
  category: string,
  language: string
): Promise<ImageCandidate[]> {
  try {
    const url = `https://api.openverse.engineering/v1/images/?q=${encodeURIComponent(query)}&page_size=20&license_type=commercial,modification`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { results?: Array<{ url?: string; title?: string }> };
    return (data.results ?? [])
      .filter((r) => r.url && r.title)
      .map((r) => ({
        url: r.url!,
        title: r.title!,
        source: 'openverse',
        score: scoreWordImageTitle(r.title!, native, english, tag, category, language),
      }))
      .filter((c) => c.score >= 15);
  } catch {
    return [];
  }
}

async function searchWikimedia(
  query: string,
  native: string,
  english: string,
  tag: string,
  category: string,
  language: string
): Promise<ImageCandidate[]> {
  try {
    const api = new URL('https://commons.wikimedia.org/w/api.php');
    api.searchParams.set('action', 'query');
    api.searchParams.set('generator', 'search');
    api.searchParams.set('gsrsearch', query);
    api.searchParams.set('gsrlimit', '8');
    api.searchParams.set('prop', 'imageinfo');
    api.searchParams.set('iiprop', 'url|mime');
    api.searchParams.set('iiurlwidth', '400');
    api.searchParams.set('format', 'json');

    const res = await fetch(api.toString(), { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data = await res.json();
    const pages = data.query?.pages ?? {};
    const out: ImageCandidate[] = [];

    for (const page of Object.values(pages) as Array<{ title?: string; imageinfo?: Array<{ thumburl?: string; url?: string }> }>) {
      const info = page.imageinfo?.[0];
      const imageUrl = info?.thumburl ?? info?.url;
      if (!imageUrl || !page.title) continue;
      if (page.title.endsWith('.svg') && !/icon|logo/i.test(page.title)) continue;
      const score = scoreWordImageTitle(page.title, native, english, tag, category, language);
      if (score >= 15) {
        out.push({ url: imageUrl, title: page.title, source: 'wikimedia', score });
      }
    }
    return out;
  } catch {
    return [];
  }
}

function pickBestImage(
  candidates: ImageCandidate[],
  native: string,
  tag: string,
  english: string,
  category: string,
  language: string
): ImageCandidate | null {
  const sorted = [...candidates].sort((a, b) => b.score - a.score);
  return (
    sorted.find((c) => isImageRelevantEnough(c.score, c.title, native, tag, english, category, language)) ??
    null
  );
}

export async function GET(request: NextRequest) {
  const native = request.nextUrl.searchParams.get('native')?.trim() ?? '';
  const english = request.nextUrl.searchParams.get('english')?.trim() ?? '';
  const category = request.nextUrl.searchParams.get('category')?.trim() ?? 'Daily Life';
  const language = request.nextUrl.searchParams.get('language')?.trim() ?? 'ko';
  const wordId = request.nextUrl.searchParams.get('wordId') ?? undefined;
  const exampleNative = request.nextUrl.searchParams.get('exampleNative')?.trim() ?? '';

  if (!native) {
    return NextResponse.json({ error: 'Missing native word' }, { status: 400 });
  }

  const tag = resolveVisualTag(native, english, category, wordId);
  const pinterestUrl = getPinterestSearchUrl(native, language, english, category);
  const pinterestQuery = buildPinterestImageQuery(native, language, english, category);
  const fallbackUrl = getContextualWordImageUrl(tag, native, english, category, wordId, language);
  const searchQueries = buildContextualImageSearchQueries(
    native,
    english,
    category,
    tag,
    language,
    exampleNative
  );

  const enKeyword = extractPrimaryEnglish(english);

  const wikiBatches = await Promise.all(
    [enKeyword, `${enKeyword} ${category.split(' ')[0]}`, ...searchQueries.slice(0, 2)].map((q) =>
      searchWikipedia(q, native, english, tag, category, language)
    )
  );
  const openverseBatches = await Promise.all(
    searchQueries.map((q) => searchOpenverse(q, native, english, tag, category, language))
  );
  const commonsBatches = await Promise.all(
    searchQueries.slice(0, 3).map((q) => searchWikimedia(q, native, english, tag, category, language))
  );

  const best = pickBestImage(
    [...wikiBatches.flat(), ...openverseBatches.flat(), ...commonsBatches.flat()],
    native,
    tag,
    english,
    category,
    language
  );

  if (best) {
    return NextResponse.json({
      imageUrl: best.url,
      pinterestUrl,
      pinterestQuery,
      searchQueries,
      relevanceScore: best.score,
      verified: true,
      source: best.source,
      title: best.title,
    });
  }

  if (shouldUseSemanticImageOnly(native, english, tag, language)) {
    return NextResponse.json({
      imageUrl: fallbackUrl,
      pinterestUrl,
      pinterestQuery,
      searchQueries,
      relevanceScore: 100,
      verified: true,
      source: 'semantic',
      title: null,
    });
  }

  return NextResponse.json({
    imageUrl: fallbackUrl,
    pinterestUrl,
    pinterestQuery,
    searchQueries,
    relevanceScore: 0,
    verified: true,
    source: 'semantic-context',
    title: null,
  });
}
