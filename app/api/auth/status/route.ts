import { authOptions, isGoogleAuthConfigured } from '@/lib/auth-options';
import { isDatabaseConfigured } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  return NextResponse.json({
    googleEnabled: isGoogleAuthConfigured(),
    databaseEnabled: isDatabaseConfigured(),
    authenticated: !!session?.user?.email,
    email: session?.user?.email ?? null,
  });
}
