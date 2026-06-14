import { authOptions } from '@/lib/auth-options';
import { createMobileBridgeToken } from '@/lib/mobile-oauth-token';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const token = createMobileBridgeToken({
    sub: (user as { id?: string }).id || user.email,
    email: user.email,
    name: user.name || user.email.split('@')[0],
    picture: user.image,
  });

  return NextResponse.json({ token });
}
