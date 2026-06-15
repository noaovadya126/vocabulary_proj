'use client';

import { AppShell } from '@/components/ui/AppShell';
import { Card } from '@/components/ui/Card';
import { LanguageChatPanel } from '@/components/ui/LanguageChatPanel';
import { LANGUAGE_NAMES } from '@/lib/constants';
import { isAiChatEnabled } from '@/lib/features';
import { getLanguageChatConfig } from '@/lib/language-chat';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LanguageChatPage() {
  const router = useRouter();
  const params = useParams();
  const language = params.language as string;
  const cfg = getLanguageChatConfig(language);
  const languageName = LANGUAGE_NAMES[language] ?? language;
  const aiChatEnabled = isAiChatEnabled();

  useEffect(() => {
    if (!aiChatEnabled) {
      router.replace(`/map/${language}`);
      return;
    }

    const userData = localStorage.getItem('userData');
    const selectedLanguage = localStorage.getItem('selectedLanguage');

    if (!userData) {
      router.push('/auth');
      return;
    }

    if (!selectedLanguage || selectedLanguage !== language) {
      router.push('/language-selection');
    }
  }, [aiChatEnabled, language, router]);

  if (!aiChatEnabled) {
    return null;
  }

  if (!cfg) {
    return (
      <AppShell backHref="/language-selection" backLabel="Languages" title="AI Chat">
        <Card>
          <p className="text-sm text-brand-600">AI chat is not available for this language yet.</p>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell
      backHref={`/map/${language}`}
      backLabel="Map"
      eyebrow="AI practice"
      title={`Chat in ${languageName}`}
      subtitle={`Conversation practice in ${cfg.nativeName}`}
      maxWidth="lg"
    >
      <LanguageChatPanel language={language} />
    </AppShell>
  );
}
