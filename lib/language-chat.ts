import { LANGUAGE_NAMES } from '@/lib/constants';

export type ChatLanguage = 'ko' | 'ja' | 'fr' | 'he' | 'en';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LanguageChatConfig {
  code: ChatLanguage;
  name: string;
  nativeName: string;
  greeting: string;
}

export const SUPPORTED_CHAT_LANGUAGES: ChatLanguage[] = ['ko', 'ja', 'fr', 'he', 'en'];

export function isChatLanguage(code: string): code is ChatLanguage {
  return SUPPORTED_CHAT_LANGUAGES.includes(code as ChatLanguage);
}

const NATIVE_NAMES: Record<ChatLanguage, string> = {
  ko: '한국어',
  ja: '日本語',
  fr: 'français',
  he: 'עברית',
  en: 'English',
};

const GREETINGS: Record<ChatLanguage, string> = {
  ko: '안녕하세요! 오늘은 어떤 주제로 한국어를 연습해 볼까요?',
  ja: 'こんにちは！今日はどんなテーマで日本語を練習しましょうか？',
  fr: 'Bonjour ! Quel sujet voulez-vous pratiquer en français aujourd’hui ?',
  he: 'שלום! באיזה נושא נתרגל עברית היום?',
  en: 'Hello! What would you like to practice in English today?',
};

export function getLanguageChatConfig(code: string): LanguageChatConfig | null {
  if (!isChatLanguage(code)) return null;
  return {
    code,
    name: LANGUAGE_NAMES[code] ?? code,
    nativeName: NATIVE_NAMES[code],
    greeting: GREETINGS[code],
  };
}

export function buildChatSystemPrompt(code: ChatLanguage): string {
  const cfg = getLanguageChatConfig(code)!;
  return [
    `You are VocabQuest Buddy, a friendly tutor helping the student practice ${cfg.name} (${cfg.nativeName}).`,
    `Rules:`,
    `- Write almost all of your replies in ${cfg.name} (${cfg.nativeName}).`,
    `- Use simple, natural sentences suitable for beginner to intermediate learners.`,
    `- If the student writes in English or another language, still reply primarily in ${cfg.name}; you may add one short English gloss in parentheses only when they seem stuck.`,
    `- Keep each reply to 2–5 sentences. End with one easy follow-up question in ${cfg.name} to keep the conversation going.`,
    `- Gently correct important mistakes inside your ${cfg.name} reply when helpful.`,
    `- Topics: daily life, food, travel, hobbies, school, feelings, shopping, weather.`,
    `- Do not use markdown headings or bullet lists. Plain conversational text only.`,
  ].join('\n');
}

export const CHAT_STARTER_PROMPTS: Record<ChatLanguage, { label: string; message: string }[]> = {
  ko: [
    { label: 'Introduce yourself', message: 'Please chat with me in Korean. Ask me to introduce myself.' },
    { label: 'Order at a café', message: 'Let\'s practice ordering drinks at a café in Korean.' },
    { label: 'Talk about hobbies', message: 'Ask me about my hobbies in Korean.' },
  ],
  ja: [
    { label: 'Introduce yourself', message: 'Please chat with me in Japanese. Ask me to introduce myself.' },
    { label: 'Order at a café', message: 'Let\'s practice ordering at a café in Japanese.' },
    { label: 'Talk about hobbies', message: 'Ask me about my hobbies in Japanese.' },
  ],
  fr: [
    { label: 'Introduce yourself', message: 'Please chat with me in French. Ask me to introduce myself.' },
    { label: 'At a restaurant', message: 'Let\'s practice ordering food in French.' },
    { label: 'Talk about hobbies', message: 'Ask me about my hobbies in French.' },
  ],
  he: [
    { label: 'Introduce yourself', message: 'Please chat with me in Hebrew. Ask me to introduce myself.' },
    { label: 'At a café', message: 'Let\'s practice ordering at a café in Hebrew.' },
    { label: 'Talk about hobbies', message: 'Ask me about my hobbies in Hebrew.' },
  ],
  en: [
    { label: 'Introduce yourself', message: 'Ask me to introduce myself in English.' },
    { label: 'Small talk', message: 'Let\'s practice casual small talk in English.' },
    { label: 'Talk about hobbies', message: 'Ask me about my hobbies in English.' },
  ],
};

export const CHAT_STORAGE_KEY = (language: string) => `vq_chat_${language}`;
