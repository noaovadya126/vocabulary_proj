import { authOptions } from '@/lib/auth-options';
import { isDatabaseConfigured, prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

type ProgressPayload = Record<string, unknown>;

function asProgressRecord(value: unknown): ProgressPayload {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as ProgressPayload;
  }
  return {};
}

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  if (!email) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const row = await prisma.userCloudState.findUnique({ where: { email } });
  return NextResponse.json({
    email,
    name: row?.name ?? session!.user?.name ?? null,
    selectedLanguage: row?.selectedLanguage ?? null,
    progress: asProgressRecord(row?.progress),
    updatedAt: row?.updatedAt?.toISOString() ?? null,
  });
}

export async function PUT(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  if (!email) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const body = (await request.json()) as {
    progress?: ProgressPayload;
    selectedLanguage?: string | null;
    name?: string | null;
  };

  const existing = await prisma.userCloudState.findUnique({ where: { email } });
  const mergedProgress = {
    ...asProgressRecord(existing?.progress),
    ...asProgressRecord(body.progress),
  } as Prisma.InputJsonValue;

  const row = await prisma.userCloudState.upsert({
    where: { email },
    create: {
      email,
      name: body.name ?? session!.user?.name ?? null,
      selectedLanguage: body.selectedLanguage ?? null,
      progress: mergedProgress,
    },
    update: {
      name: body.name ?? session!.user?.name ?? undefined,
      selectedLanguage: body.selectedLanguage ?? undefined,
      progress: mergedProgress,
    },
  });

  return NextResponse.json({
    ok: true,
    updatedAt: row.updatedAt.toISOString(),
  });
}
