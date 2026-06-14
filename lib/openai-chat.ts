export type OpenAIChatErrorCode =
  | 'missing_key'
  | 'invalid_api_key'
  | 'insufficient_quota'
  | 'rate_limit_exceeded'
  | 'model_not_found'
  | 'network_error'
  | 'provider_error';

export function getOpenAIApiKey(): string | undefined {
  return process.env.OPENAI_API_KEY?.trim() || undefined;
}

export function getOpenAIChatModel(): string {
  return process.env.OPENAI_CHAT_MODEL?.trim() || 'gpt-4o-mini';
}

export function parseOpenAIError(body: string): { code: OpenAIChatErrorCode; message: string } {
  try {
    const parsed = JSON.parse(body) as { error?: { code?: string; message?: string } };
    const providerCode = parsed.error?.code ?? '';
    const providerMessage = parsed.error?.message ?? '';

    switch (providerCode) {
      case 'insufficient_quota':
        return {
          code: 'insufficient_quota',
          message:
            'OpenAI credits are used up. Add billing at platform.openai.com/settings/billing or set a new API key on the server.',
        };
      case 'invalid_api_key':
        return {
          code: 'invalid_api_key',
          message: 'The OpenAI API key on the server is invalid. Update OPENAI_API_KEY in Vercel.',
        };
      case 'rate_limit_exceeded':
        return {
          code: 'rate_limit_exceeded',
          message: 'Too many AI requests right now. Please wait a moment and try again.',
        };
      case 'model_not_found':
        return {
          code: 'model_not_found',
          message: 'The configured AI model is unavailable. Check OPENAI_CHAT_MODEL on the server.',
        };
      default:
        return {
          code: 'provider_error',
          message: providerMessage || 'AI provider error. Please try again later.',
        };
    }
  } catch {
    return { code: 'provider_error', message: 'AI provider error. Please try again later.' };
  }
}

export async function requestOpenAIChat(params: {
  apiKey: string;
  model: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  maxTokens?: number;
}): Promise<{ ok: true; reply: string } | { ok: false; status: number; code: OpenAIChatErrorCode; message: string }> {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${params.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: params.model,
        temperature: 0.7,
        max_tokens: params.maxTokens ?? 450,
        messages: params.messages,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      const parsed = parseOpenAIError(errText);
      console.error('OpenAI chat error:', res.status, errText);
      return { ok: false, status: res.status, code: parsed.code, message: parsed.message };
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return {
        ok: false,
        status: 502,
        code: 'provider_error',
        message: 'The AI returned an empty response. Please try again.',
      };
    }

    return { ok: true, reply };
  } catch (err) {
    console.error('OpenAI chat request failed:', err);
    return {
      ok: false,
      status: 500,
      code: 'network_error',
      message: 'Could not reach the AI service. Check your connection and try again.',
    };
  }
}

export function reasonToMessage(reason: OpenAIChatErrorCode | 'missing_key'): string {
  switch (reason) {
    case 'missing_key':
      return 'AI chat is not configured yet. Add OPENAI_API_KEY on the server (Vercel → Environment Variables).';
    case 'insufficient_quota':
      return 'OpenAI credits are used up. Add billing at platform.openai.com/settings/billing or set a new API key on the server.';
    case 'invalid_api_key':
      return 'The OpenAI API key on the server is invalid. Update OPENAI_API_KEY in Vercel.';
    case 'rate_limit_exceeded':
      return 'Too many AI requests right now. Please wait a moment and try again.';
    case 'model_not_found':
      return 'The configured AI model is unavailable. Check OPENAI_CHAT_MODEL on the server.';
    case 'network_error':
      return 'Could not reach the AI service. Check your connection and try again.';
    default:
      return 'AI chat is temporarily unavailable. Please try again later.';
  }
}
