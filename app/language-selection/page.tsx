'use client';

import { AppShell } from '@/components/ui/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CharacterIllustration, SpeechBubble } from '@/components/ui/CharacterIllustration';
import { InstallAppBanner } from '@/components/ui/InstallAppBanner';
import { Toast } from '@/components/ui/Toast';
import { cn } from '@/lib/cn';
import { Check, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const languages = [
  {
    id: 'ja',
    name: 'Japanese',
    flag: '🇯🇵',
    description: 'Hiragana basics and polite expressions',
    accent: 'pink' as const,
    emoji: '🌸',
  },
  {
    id: 'ko',
    name: 'Korean',
    flag: '🇰🇷',
    description: 'Hangul basics and polite expressions',
    accent: 'green' as const,
    emoji: '💚',
  },
  {
    id: 'fr',
    name: 'French',
    flag: '🇫🇷',
    description: 'Core vocabulary for daily conversation',
    accent: 'peach' as const,
    emoji: '🥐',
  },
];

const accentStyles = {
  pink: {
    card: 'border-pastel-pink/70 bg-gradient-to-br from-pastel-pink-light to-white hover:border-brand-300 cute-stripes-pink',
    selected: 'border-brand-400 bg-pastel-pink/40 ring-2 ring-brand-300/50 shadow-cute',
    badge: 'bg-brand-400',
  },
  green: {
    card: 'border-pastel-green/70 bg-gradient-to-br from-pastel-green-light to-white hover:border-success-300 cute-stripes-green',
    selected: 'border-success-400 bg-pastel-green/50 ring-2 ring-success-300/50 shadow-cute',
    badge: 'bg-success-500',
  },
  peach: {
    card: 'border-pastel-peach/80 bg-gradient-to-br from-pastel-peach/50 to-white hover:border-brand-200',
    selected: 'border-brand-300 bg-pastel-peach/60 ring-2 ring-brand-200/50 shadow-cute',
    badge: 'bg-brand-400',
  },
};

export default function LanguageSelectionPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('selectedLanguage') === 'es') {
      localStorage.setItem('selectedLanguage', 'ja');
    }
  }, []);

  const handleContinue = () => {
    if (!selectedLanguage) {
      setToastMessage('Please select a language to continue');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    localStorage.setItem('selectedLanguage', selectedLanguage);
    router.push(`/map/${selectedLanguage}`);
  };

  const selectedLang = languages.find((l) => l.id === selectedLanguage);

  return (
    <AppShell
      showLogout={false}
      backHref="/auth"
      backLabel="Sign in"
      maxWidth="lg"
      backgroundVariant="selection"
    >
      <div className="mb-8 flex flex-col items-center text-center">
        <CharacterIllustration variant="school" size="xl" priority />
        <SpeechBubble className="mt-4 max-w-sm">
          <span className="flex items-center justify-center gap-1.5">
            <Sparkles className="h-4 w-4 text-brand-400" />
            Which language shall we learn today?
            <Sparkles className="h-4 w-4 text-success-500" />
          </span>
        </SpeechBubble>
        <h1 className="mt-5 text-2xl font-bold text-brand-700 sm:text-3xl">Choose your language</h1>
        <p className="mt-2 text-sm text-brand-600/80 sm:text-base">
          Pick the language you want to explore — you can change it later ✿
        </p>
      </div>

      <InstallAppBanner className="mb-6" />

      <div className="mb-8 space-y-3">
        {languages.map((lang) => {
          const selected = selectedLanguage === lang.id;
          const styles = accentStyles[lang.accent];
          return (
            <button
              key={lang.id}
              type="button"
              onClick={() => setSelectedLanguage(lang.id)}
              className={cn(
                'w-full rounded-3xl border-2 p-4 text-left transition-all active:scale-[0.99]',
                selected ? styles.selected : styles.card,
                !selected && 'hover:scale-[1.01] hover:shadow-soft'
              )}
            >
              <div className="flex items-center gap-4">
                <span
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-4xl shadow-soft backdrop-blur-sm"
                  aria-hidden="true"
                >
                  {lang.flag}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-brand-800">{lang.name}</span>
                    <span className="text-base opacity-70">{lang.emoji}</span>
                  </div>
                  <div className="mt-0.5 text-sm text-brand-600/85">{lang.description}</div>
                </div>
                {selected ? (
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-soft',
                      styles.badge
                    )}
                  >
                    <Check className="h-4 w-4 text-white" />
                  </div>
                ) : (
                  <div className="h-8 w-8 shrink-0 rounded-full border-2 border-dashed border-pastel-pink/60" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <Card
        padding="sm"
        className="flex flex-col gap-4 border-pastel-green/50 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          {selectedLang ? (
            <CharacterIllustration variant="hearts" size="sm" />
          ) : (
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-pastel-pink-light text-2xl">
              🌸
            </div>
          )}
          <p className="text-sm font-medium text-brand-700">
            {selectedLang
              ? `Great choice! ${selectedLang.name} awaits you 💗`
              : 'Pick a language above to continue'}
          </p>
        </div>
        <Button onClick={handleContinue} disabled={!selectedLanguage} size="lg" className="shrink-0">
          Continue to map →
        </Button>
      </Card>

      {showToast && <Toast message={toastMessage} />}
    </AppShell>
  );
}
