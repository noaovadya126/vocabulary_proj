'use client';

import VocabularyGame from '@/components/game/VocabularyGame';
import { Toast } from '@/components/ui/Toast';
import { useI18nContext } from '@/contexts/I18nContext';
import { isAuthenticated } from '@/lib/auth';
import { cn } from '@/lib/cn';
import { VOCABULARY_BY_LANGUAGE } from '@/lib/vocabulary-data';
import { Gamepad2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const LANG_PATTERN = /^\/(map|milestone|vocabulary|grammar|word-learning|quiz|winner|game)\/([a-z]{2})/;
const HIDDEN_PATHS = ['/auth', '/language-selection'];

function extractLanguage(pathname: string): string | null {
  const m = pathname.match(LANG_PATTERN);
  return m?.[2] ?? null;
}

interface PracticeGamesLauncherProps {
  language?: string;
  topikLevel?: 1 | 2;
  className?: string;
  global?: boolean;
}

export function PracticeGamesLauncher({
  language: langProp,
  topikLevel: initialLevel,
  className,
  global = false,
}: PracticeGamesLauncherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18nContext();
  const [storedLang, setStoredLang] = useState<string | null>(null);
  const [level, setLevel] = useState<0 | 1 | 2>(initialLevel ?? 0);
  const [showLevelPicker, setShowLevelPicker] = useState(false);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    setStoredLang(localStorage.getItem('selectedLanguage'));
  }, [pathname]);

  useEffect(() => {
    if (initialLevel) setLevel(initialLevel);
  }, [initialLevel]);

  const language = langProp ?? extractLanguage(pathname) ?? storedLang;

  const words = useMemo(() => {
    if (!language) return [];
    const all = VOCABULARY_BY_LANGUAGE[language] ?? [];
    if (level === 0) return all;
    return all.filter((w) => w.difficultyLevel === level);
  }, [language, level]);

  if (!language) return null;
  if (global && HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  const levelLabel =
    language === 'ko'
      ? level === 0 ? 'All TOPIK' : `TOPIK ${level}`
      : language === 'ja'
      ? level === 0 ? 'All JLPT' : level === 1 ? 'N5' : 'N4'
      : level === 0 ? 'All levels' : `Level ${level}`;

  const levelButtonLabel = (l: 0 | 1 | 2) => {
    if (language === 'ko') return l === 0 ? t('all', 'common') : `TOPIK ${l}`;
    if (language === 'ja') return l === 0 ? t('all', 'common') : l === 1 ? 'N5' : 'N4';
    return l === 0 ? t('all', 'common') : `${t('level', 'common')} ${l}`;
  };

  const handleOpen = () => {
    if (!isAuthenticated()) {
      setToast(t('sign_in_practice_toast', 'common'));
      setTimeout(() => router.push('/auth'), 1500);
      return;
    }
    setShowLevelPicker(true);
  };

  const startGame = () => {
    setShowLevelPicker(false);
    setOpen(true);
  };

  const totalWords = VOCABULARY_BY_LANGUAGE[language]?.length ?? 0;

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        aria-label={t('practice_games', 'common')}
        className={cn(
          'fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl',
          'bg-brand-400 text-white shadow-medium hover:bg-brand-500 hover:scale-105 transition-all',
          'border-2 border-white/50',
          className
        )}
      >
        <Gamepad2 className="w-5 h-5" />
        <span className="text-sm font-semibold hidden sm:inline">{t('practice_games', 'common')} 🎮</span>
        <span className="text-lg sm:hidden" aria-hidden="true">🎮</span>
      </button>

      {showLevelPicker && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-brand-900/30 backdrop-blur-sm p-4"
          onClick={() => setShowLevelPicker(false)}
        >
          <div
            className="bg-pastel-cream cute-card-texture rounded-2xl shadow-xl border border-brand-200/40 p-6 w-full max-w-sm space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-brand-800">{t('choose_level', 'common')}</h3>
            <p className="text-sm text-brand-600">
              {t('practice_games', 'common')} · {totalWords} {t('words', 'common')}
            </p>
            <div className="flex flex-wrap gap-2">
              {([0, 1, 2] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLevel(l)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium',
                    level === l ? 'bg-brand-400 text-white' : 'bg-pastel-lavender/50 text-brand-700'
                  )}
                >
                  {levelButtonLabel(l)}
                </button>
              ))}
            </div>
            <p className="text-xs text-brand-500">
              {levelLabel} · {words.length} {t('words_in_game', 'common')}
            </p>
            <button
              type="button"
              onClick={startGame}
              className="w-full py-3 rounded-xl bg-brand-400 text-white font-semibold hover:bg-brand-500"
            >
              {t('start_playing', 'common')}
            </button>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} />}

      {open && (
        <VocabularyGame
          words={words.length > 0 ? words : (VOCABULARY_BY_LANGUAGE[language] ?? [])}
          language={language}
          onComplete={() => setOpen(false)}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
