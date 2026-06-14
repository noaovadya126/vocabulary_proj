import {
  getOpenAIApiKey,
  getOpenAIChatModel,
  reasonToMessage,
  requestOpenAIChat,
  type OpenAIChatErrorCode,
} from '@/lib/openai-chat';
import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = getOpenAIApiKey();
  const model = getOpenAIChatModel();

  if (!apiKey) {
    return NextResponse.json({
      enabled: false,
      model,
      reason: 'missing_key' satisfies OpenAIChatErrorCode,
      message: reasonToMessage('missing_key'),
    });
  }

  const probe = await requestOpenAIChat({
    apiKey,
    model,
    maxTokens: 1,
    messages: [{ role: 'user', content: 'hi' }],
  });

  if (!probe.ok) {
    return NextResponse.json({
      enabled: false,
      model,
      reason: probe.code,
      message: probe.message,
    });
  }

  return NextResponse.json({
    enabled: true,
    model,
    message: 'AI chat is ready.',
  });
}
