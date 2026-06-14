import { verifyMobileBridgeToken } from '@/lib/mobile-oauth-token';
import { encode } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

function sessionCookieName(): string {
  return process.env.NODE_ENV === 'production'
    ? '__Secure-next-auth.session-token'
    : 'next-auth.session-token';
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')?.trim();
  if (!token) {
    return NextResponse.redirect(new URL('/auth?error=MissingToken', request.url));
  }

  const secret = process.env.NEXTAUTH_SECRET?.trim();
  if (!secret) {
    return NextResponse.redirect(new URL('/auth?error=ServerConfig', request.url));
  }

  try {
    const user = verifyMobileBridgeToken(token);
    const sessionToken = await encode({
      token: {
        sub: user.sub,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
      secret,
      maxAge: 30 * 24 * 60 * 60,
    });

    const response = NextResponse.redirect(new URL('/auth', request.url));
    response.cookies.set(sessionCookieName(), sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });
    return response;
  } catch {
    return NextResponse.redirect(new URL('/auth?error=InvalidToken', request.url));
  }
}
