import { isAiChatEnabled } from '@/lib/features';
import { NextResponse } from 'next/server';

export async function GET() {
  if (!isAiChatEnabled()) {
    return NextResponse.json({
      enabled: false,
      model: null,
      reason: 'disabled',
      message: 'AI chat is currently unavailable.',
    });
  }

  const model = process.env.OPENAI_CHAT_MODEL?.trim() || 'gpt-4o-mini';
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  return NextResponse.json({
    enabled: !!apiKey,
    model,
    message: apiKey ? 'AI chat is ready.' : 'AI chat is not configured on the server.',
  });
}
