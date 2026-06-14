import jwt from 'jsonwebtoken';

export type MobileBridgePayload = {
  sub: string;
  email: string;
  name: string;
  picture?: string | null;
};

function getSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET?.trim();
  if (!secret) throw new Error('NEXTAUTH_SECRET is not configured');
  return secret;
}

export function createMobileBridgeToken(payload: MobileBridgePayload): string {
  return jwt.sign({ ...payload, purpose: 'mobile-bridge' }, getSecret(), { expiresIn: '120s' });
}

export function verifyMobileBridgeToken(token: string): MobileBridgePayload {
  const decoded = jwt.verify(token, getSecret()) as MobileBridgePayload & { purpose?: string };
  if (decoded.purpose !== 'mobile-bridge') {
    throw new Error('Invalid mobile bridge token');
  }
  return {
    sub: decoded.sub,
    email: decoded.email,
    name: decoded.name,
    picture: decoded.picture ?? null,
  };
}
