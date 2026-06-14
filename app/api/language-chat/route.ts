import {
  buildChatSystemPrompt,
  type ChatMessage,
  getLanguageChatConfig,
  isChatLanguage,
} from '@/lib/language-chat';
import {
  getOpenAIApiKey,
  getOpenAIChatModel,
  requestOpenAIChat,
} from '@/lib/openai-chat';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

const MAX_USER_LEN = 500;
const MAX_HISTORY = 16;

export async function POST(request: NextRequest) {
  const apiKey = getOpenAIApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: 'AI chat is not configured. Add OPENAI_API_KEY on the server.', code: 'missing_key' },
      { status: 503 }
    );
  }

  let body: { language?: string; messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const language = body.language?.trim() ?? '';
  if (!isChatLanguage(language)) {
    return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
  }

  const incoming = body.messages ?? [];
  if (!Array.isArray(incoming) || incoming.length === 0) {
    return NextResponse.json({ error: 'Missing messages' }, { status: 400 });
  }

  const history = incoming
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role,
      content: m.content.trim().slice(0, m.role === 'user' ? MAX_USER_LEN : 2000),
    }))
    .filter((m) => m.content.length > 0);

  const last = history[history.length - 1];
  if (!last || last.role !== 'user') {
    return NextResponse.json({ error: 'Last message must be from the user' }, { status: 400 });
  }

  const model = getOpenAIChatModel();
  const cfg = getLanguageChatConfig(language)!;

  const result = await requestOpenAIChat({
    apiKey,
    model,
    messages: [{ role: 'system', content: buildChatSystemPrompt(language) }, ...history],
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.message, code: result.code }, { status: 502 });
  }

  return NextResponse.json({
    reply: result.reply,
    language: cfg.code,
    languageName: cfg.name,
  });
}
