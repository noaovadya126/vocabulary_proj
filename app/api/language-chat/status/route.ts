import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  return NextResponse.json({
    enabled: !!apiKey,
    model: process.env.OPENAI_CHAT_MODEL?.trim() || 'gpt-4o-mini',
  });
}
