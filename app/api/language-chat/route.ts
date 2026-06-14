import {
  buildChatSystemPrompt,
  type ChatMessage,
  getLanguageChatConfig,
  isChatLanguage,
} from '@/lib/language-chat';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

const MAX_USER_LEN = 500;
const MAX_HISTORY = 16;

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: 'AI chat is not configured. Add OPENAI_API_KEY on the server.' },
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

  const model = process.env.OPENAI_CHAT_MODEL?.trim() || 'gpt-4o-mini';
  const cfg = getLanguageChatConfig(language)!;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        max_tokens: 450,
        messages: [
          { role: 'system', content: buildChatSystemPrompt(language) },
          ...history,
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error('OpenAI chat error:', res.status, errText);
      return NextResponse.json({ error: 'AI provider error' }, { status: 502 });
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json({ error: 'Empty AI response' }, { status: 502 });
    }

    return NextResponse.json({
      reply,
      language: cfg.code,
      languageName: cfg.name,
    });
  } catch (err) {
    console.error('language-chat failed:', err);
    return NextResponse.json({ error: 'Chat request failed' }, { status: 500 });
  }
}
