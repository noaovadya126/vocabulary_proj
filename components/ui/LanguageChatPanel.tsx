'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ChibiMascot } from '@/components/ui/ChibiMascot';
import { cn } from '@/lib/cn';
import { isAuthenticated } from '@/lib/auth';
import {
  CHAT_STARTER_PROMPTS,
  CHAT_STORAGE_KEY,
  getLanguageChatConfig,
  type ChatMessage,
  type ChatLanguage,
} from '@/lib/language-chat';
import { playWordAudio } from '@/lib/playWord';
import { Loader2, MessageCircle, Send, Volume2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface LanguageChatPanelProps {
  language: string;
  className?: string;
}

export function LanguageChatPanel({ language, className }: LanguageChatPanelProps) {
  const cfg = getLanguageChatConfig(language);
  const chatLang = cfg?.code as ChatLanguage | undefined;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiEnabled, setAiEnabled] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!chatLang) return;
    try {
      const raw = sessionStorage.getItem(CHAT_STORAGE_KEY(chatLang));
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch {
      /* ignore */
    }
    setMessages([{ role: 'assistant', content: cfg!.greeting }]);
  }, [chatLang, cfg]);

  useEffect(() => {
    if (!chatLang || messages.length === 0) return;
    sessionStorage.setItem(CHAT_STORAGE_KEY(chatLang), JSON.stringify(messages));
  }, [messages, chatLang]);

  useEffect(() => {
    fetch('/api/language-chat/status')
      .then((r) => r.json())
      .then((d: { enabled?: boolean }) => setAiEnabled(!!d.enabled))
      .catch(() => setAiEnabled(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !chatLang || loading) return;

      if (!isAuthenticated()) {
        setError('Sign in to use AI chat.');
        return;
      }

      if (!aiEnabled) {
        setError('AI chat is not available yet. The server needs an OpenAI API key.');
        return;
      }

      setError(null);
      const userMsg: ChatMessage = { role: 'user', content: trimmed };
      const nextHistory = [...messages, userMsg];
      setMessages(nextHistory);
      setInput('');
      setLoading(true);

      try {
        const res = await fetch('/api/language-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language: chatLang, messages: nextHistory }),
        });
        const data = (await res.json()) as { reply?: string; error?: string };
        if (!res.ok) {
          throw new Error(data.error ?? 'Chat failed');
        }
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply! }]);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong');
        setMessages((prev) => prev.slice(0, -1));
        setInput(trimmed);
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [aiEnabled, chatLang, loading, messages]
  );

  const handlePlay = async (content: string, idx: number) => {
    if (!chatLang) return;
    setPlayingIdx(idx);
    try {
      await playWordAudio(chatLang, content);
    } finally {
      setPlayingIdx(null);
    }
  };

  const clearChat = () => {
    if (!cfg) return;
    setMessages([{ role: 'assistant', content: cfg.greeting }]);
    setError(null);
  };

  if (!cfg || !chatLang) {
    return (
      <Card className={className}>
        <p className="text-sm text-brand-600">AI chat is not available for this language yet.</p>
      </Card>
    );
  }

  const starters = CHAT_STARTER_PROMPTS[chatLang];

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <Card className="border-pastel-pink/50 bg-pastel-cream/30 p-4">
        <div className="flex gap-3">
          <ChibiMascot mood="study" size="sm" className="shrink-0" />
          <div className="min-w-0 text-sm text-brand-700 space-y-1">
            <p className="font-semibold text-brand-800 flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4 text-brand-500" />
              Practice in {cfg.name}
            </p>
            <p>
              Chat with VocabQuest Buddy — replies are mostly in <strong>{cfg.nativeName}</strong> so
              you practice real conversation. You can write in English or {cfg.name}.
            </p>
          </div>
        </div>
      </Card>

      {aiEnabled === false && (
        <Card className="border-amber-200 bg-amber-50/80 p-3 text-sm text-amber-900">
          AI chat will work once <code className="text-xs">OPENAI_API_KEY</code> is set on the server
          (Vercel → Environment Variables).
        </Card>
      )}

      {error && (
        <Card className="border-red-200 bg-pastel-rose/40 p-3 text-sm text-red-800">{error}</Card>
      )}

      <Card padding="none" className="flex flex-col overflow-hidden border-brand-100">
        <div className="flex items-center justify-between border-b border-brand-50 px-3 py-2 bg-white/80">
          <span className="text-xs font-semibold text-brand-600">{cfg.nativeName} chat</span>
          <button
            type="button"
            onClick={clearChat}
            className="text-xs text-brand-500 hover:text-brand-700 underline"
          >
            New chat
          </button>
        </div>

        <div className="flex max-h-[min(420px,55vh)] min-h-[240px] flex-col gap-3 overflow-y-auto p-3 bg-gradient-to-b from-white to-pastel-pink-light/20">
          {messages.map((msg, idx) => (
            <div
              key={`${idx}-${msg.role}`}
              className={cn(
                'flex',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'group relative max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-brand-400 text-white rounded-br-md'
                    : 'bg-white border border-brand-100 text-brand-800 rounded-bl-md shadow-sm japanese-text korean-text'
                )}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.role === 'assistant' && (
                  <button
                    type="button"
                    onClick={() => handlePlay(msg.content, idx)}
                    disabled={playingIdx === idx}
                    className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-brand-500 hover:text-brand-700"
                    title="Listen"
                  >
                    {playingIdx === idx ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Volume2 className="h-3 w-3" />
                    )}
                    Listen
                  </button>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md bg-white border border-brand-100 px-3 py-2 text-sm text-brand-500 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking…
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-brand-50 bg-white/90 p-3 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {starters.map((s) => (
              <button
                key={s.label}
                type="button"
                disabled={loading}
                onClick={() => sendMessage(s.message)}
                className="rounded-full border border-brand-200 bg-pastel-cream/80 px-2.5 py-1 text-[11px] font-medium text-brand-700 hover:bg-pastel-pink/50 disabled:opacity-50"
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void sendMessage(input);
                }
              }}
              rows={2}
              placeholder={`Type in ${cfg.name} or English…`}
              disabled={loading}
              className="flex-1 resize-none rounded-xl border border-brand-200 bg-white px-3 py-2 text-sm text-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-200 japanese-text korean-text disabled:opacity-60"
            />
            <Button
              type="button"
              size="sm"
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="min-h-[44px] shrink-0"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
