/** AI language chat — off in production unless explicitly enabled. */
export function isAiChatEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AI_CHAT_ENABLED === 'true';
}
