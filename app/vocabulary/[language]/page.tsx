'use client';

import VocabularyGame from '@/components/game/VocabularyGame';
import { AppShell } from '@/components/ui/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AutoPlayOnVisible } from '@/components/ui/AutoPlayOnVisible';
import { CategoryHubCard } from '@/components/ui/CuteDecor';
import { Toast } from '@/components/ui/Toast';
import { KnownMarkButton } from '@/components/ui/KnownMarkButton';
import { KnownWordCelebration } from '@/components/ui/KnownWordCelebration';
import { WordImage } from '@/components/ui/WordImage';
import { useI18nContext } from '@/contexts/I18nContext';
import { isAuthenticated } from '@/lib/auth';
import { getUserItem, setUserItem } from '@/lib/userStorage';
import { getCategoryLabel, normalizeCategory, STANDARD_CATEGORIES } from '@/lib/categories';
import { getDisplayMeaning, getLanguageDisplayName } from '@/lib/displayText';
import { playWordAudio } from '@/lib/playWord';
import { warmUpSpeech } from '@/lib/speech';
import { markVocabWordKnown, type WordProgressEntry } from '@/lib/wordProgress';
import { VOCABULARY_BY_LANGUAGE, groupVocabularyByMilestone, getMilestoneCount, type VocabWord } from '@/lib/vocabulary-data';
import { cn } from '@/lib/cn';
import { Play, Target, Volume2, Zap } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type Word = VocabWord;

interface WordProgress extends WordProgressEntry {}

export default function VocabularyPage() {
  const [showGame, setShowGame] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [wordProgress, setWordProgress] = useState<Record<string, WordProgress>>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [topikFilter, setTopikFilter] = useState<0 | 1 | 2>(0);
  const [activeMilestone, setActiveMilestone] = useState<number | 'all'>('all');

  const router = useRouter();
  const params = useParams();
  const language = params.language as string;
  const { t } = useI18nContext();
  const vocabulary = VOCABULARY_BY_LANGUAGE[language] || [];
  const milestoneCount = getMilestoneCount(language);
  const milestoneGroups = useMemo(() => groupVocabularyByMilestone(language), [language]);

  const categories = [
    'all',
    ...STANDARD_CATEGORIES.filter((c) =>
      vocabulary.some((w) => normalizeCategory(w.category) === c)
    ),
  ];

  useEffect(() => {
    warmUpSpeech();
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const selectedLanguage = localStorage.getItem('selectedLanguage');

    if (!userData) {
      router.push('/auth');
      return;
    }

    if (!selectedLanguage || selectedLanguage !== language) {
      router.push('/language-selection');
      return;
    }

    setLoggedIn(isAuthenticated());

    const progressKey = `word_progress_${language}`;
    const savedProgress = getUserItem(progressKey);
    if (savedProgress) {
      setWordProgress(JSON.parse(savedProgress));
    }
  }, [language, router]);

  const filterWord = (word: Word) => {
    if (topikFilter !== 0 && word.difficultyLevel !== topikFilter) return false;
    if (selectedCategory !== 'all' && normalizeCategory(word.category) !== selectedCategory) return false;
    return true;
  };

  const filteredVocabulary = useMemo(
    () => vocabulary.filter(filterWord),
    [vocabulary, topikFilter, selectedCategory]
  );

  const visibleGroups = useMemo(
    () =>
      milestoneGroups
        .map((g) => ({ ...g, words: g.words.filter(filterWord) }))
        .filter((g) => g.words.length > 0 && (activeMilestone === 'all' || g.milestoneId === activeMilestone)),
    [milestoneGroups, topikFilter, selectedCategory, activeMilestone]
  );

  const scrollToMilestone = (milestoneId: number) => {
    setActiveMilestone(milestoneId);
    document.getElementById(`vocab-milestone-${milestoneId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getWordProgress = (wordId: string): WordProgress => {
    return wordProgress[wordId] || {
      status: 'not_started',
      correctStreak: 0,
      totalAttempts: 0,
      totalCorrect: 0,
    };
  };

  const saveProgress = (updated: Record<string, WordProgress>) => {
    setWordProgress(updated);
    setUserItem(`word_progress_${language}`, JSON.stringify(updated));
  };

  const markAsKnown = (wordId: string) => {
    const updated = markVocabWordKnown(language, wordId);
    setWordProgress(updated);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 1400);
  };

  const handlePlayAudio = async (word: Word) => {
    try {
      await playWordAudio(language, word.lemma, word.audioFile);
    } catch {
      setToastMessage('Audio not available for this word.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleGameComplete = (score: number, totalWords: number) => {
    setToastMessage(`Great job! You scored ${score} out of ${totalWords} points!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const stats = (() => {
    const totalWords = vocabulary.length;
    const known = Object.values(wordProgress).filter((p) => p.status === 'known' || p.status === 'learned').length;
    const learning = Object.values(wordProgress).filter((p) => p.status === 'learning').length;
    return { totalWords, known, learning, notStarted: totalWords - known - learning };
  })();

  return (
    <AppShell
      backHref={`/map/${language}`}
      backLabel={t('map', 'common')}
      eyebrow={t('vocabulary', 'common')}
      title={getLanguageDisplayName(language)}
      subtitle={`${stats.totalWords} ${t('words', 'common')}`}
      maxWidth="xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <CategoryHubCard emoji="📚" title={t('vocabulary', 'common')} subtitle={`${stats.totalWords} ${t('words', 'common')}`} accent="pink" mascot="study" onClick={() => {}} disabled />
        <CategoryHubCard
          emoji="✏️"
          title={t('grammar', 'common')}
          subtitle={language === 'ko' ? 'TOPIK' : t('korean_only', 'common')}
          accent="green"
          mascot="school"
          onClick={() => language === 'ko' && router.push(`/grammar/${language}`)}
          disabled={language !== 'ko'}
        />
      </div>

      <Card className="mb-4 sm:mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-brand-800">{stats.totalWords}</div>
            <div className="text-xs sm:text-sm text-brand-500">{t('total', 'common')}</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-success-600">{stats.known}</div>
            <div className="text-xs sm:text-sm text-brand-500">{t('known', 'common')}</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-amber-600">{stats.learning}</div>
            <div className="text-xs sm:text-sm text-brand-500">{t('learning_status', 'common')}</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-brand-400">{stats.notStarted}</div>
            <div className="text-xs sm:text-sm text-brand-500">{t('new_words', 'common')}</div>
          </div>
        </div>
      </Card>

      <div className="mb-4 sm:mb-6">
        <Button
          onClick={() => {
            if (!isAuthenticated()) {
              setToastMessage(t('sign_in_games_toast', 'common'));
              setShowToast(true);
              setTimeout(() => router.push('/auth'), 1500);
              return;
            }
            setShowGame(true);
          }}
          disabled={!loggedIn}
          className="w-full sm:w-auto"
        >
          <Play className="w-4 h-4" />
          {loggedIn ? t('play_games', 'common') : t('sign_in_games', 'common')}
        </Button>
      </div>

      {(language === 'ko' || language === 'ja') && (
        <Card padding="sm" className="mb-4">
          <h3 className="text-xs sm:text-sm font-semibold text-brand-700 mb-2 sm:mb-3">{t('level', 'common')}</h3>
          <div className="flex flex-wrap gap-2">
            {([0, 1, 2] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setTopikFilter(level)}
                className={cn(
                  'px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium',
                  topikFilter === level ? 'bg-brand-400 text-white' : 'bg-pastel-lavender/50 text-brand-700'
                )}
              >
                {level === 0 ? t('all', 'common') : language === 'ko' ? `TOPIK ${level}` : `JLPT N${level === 1 ? 5 : 4}`}
              </button>
            ))}
          </div>
        </Card>
      )}

      <Card padding="sm" className="mb-4 sm:mb-6">
        <h3 className="text-xs sm:text-sm font-semibold text-brand-700 mb-2 sm:mb-3">{t('category', 'common')}</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors',
                selectedCategory === category
                  ? 'bg-brand-400 text-white'
                  : 'bg-pastel-lavender/50 text-brand-700 hover:bg-pastel-lavender'
              )}
            >
              {category === 'all' ? t('all', 'common') : getCategoryLabel(category as typeof STANDARD_CATEGORIES[number])}
            </button>
          ))}
        </div>
      </Card>

      <Card padding="sm" className="mb-4 sm:mb-6 sticky top-[4.5rem] z-20 bg-white/95 backdrop-blur-sm">
        <h3 className="text-xs sm:text-sm font-semibold text-brand-700 mb-2 sm:mb-3">Jump to stage</h3>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory">
          <button
            type="button"
            onClick={() => setActiveMilestone('all')}
            className={cn(
              'shrink-0 snap-start px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold min-h-[44px]',
              activeMilestone === 'all' ? 'bg-brand-400 text-white' : 'bg-pastel-pink-light text-brand-700 border border-pastel-pink/50'
            )}
          >
            All stages
          </button>
          {Array.from({ length: milestoneCount }, (_, i) => i + 1).map((ms) => (
            <button
              key={ms}
              type="button"
              onClick={() => scrollToMilestone(ms)}
              className={cn(
                'shrink-0 snap-start px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold min-h-[44px]',
                activeMilestone === ms ? 'bg-success-500 text-white' : 'bg-pastel-green-light text-brand-700 border border-pastel-green/50'
              )}
            >
              Stage {ms}
            </button>
          ))}
        </div>
      </Card>

      <div className="space-y-6 sm:space-y-8">
        {visibleGroups.map((group) => (
          <section key={group.milestoneId} id={`vocab-milestone-${group.milestoneId}`} className="scroll-mt-36">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-base sm:text-lg font-bold text-brand-800">
                Stage {group.milestoneId}
              </h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push(`/milestone/${language}/${group.milestoneId}`)}
              >
                Open lesson →
              </Button>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {group.words.map((word) => {
          const progress = getWordProgress(word.id);
          const isKnown = progress.status === 'known' || progress.status === 'learned';
          const statusLabel =
            progress.status === 'known' ? t('mark_known', 'common') :
            progress.status === 'learned' ? 'Learned' :
            progress.status === 'learning' ? t('learning_status', 'common') : t('new_words', 'common');
          const meaning = getDisplayMeaning(word.translation);

          return (
            <div key={word.id} className="flex gap-1.5 sm:gap-2 items-stretch">
              <KnownMarkButton isKnown={isKnown} onMark={() => markAsKnown(word.id)} />

              <AutoPlayOnVisible
                language={language}
                nativeText={word.lemma}
                audioFile={word.audioFile}
                className="flex-1 min-w-0"
              >
                <Card padding="sm" className={cn(isKnown && 'opacity-75 border-success-200')}>
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <WordImage
                      english={word.translation}
                      category={normalizeCategory(word.category)}
                      wordId={word.id}
                      nativeText={word.lemma}
                      language={language}
                      size="md"
                      className="flex-shrink-0 hidden xs:block sm:block"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                        <h4 className="text-base sm:text-lg font-semibold text-brand-800 japanese-text korean-text">{word.lemma}</h4>
                        <span className="text-xs sm:text-sm text-brand-500">{word.phonetic}</span>
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium',
                          isKnown ? 'bg-success-100 text-success-700' :
                          progress.status === 'learning' ? 'bg-amber-100 text-amber-800' :
                          'bg-pastel-lavender/60 text-brand-600'
                        )}>
                          {statusLabel}
                        </span>
                      </div>
                      <p className="text-sm text-brand-700 mb-2">{meaning}</p>
                      <div className="flex flex-wrap gap-2 sm:gap-3 text-[10px] sm:text-xs text-brand-500 mb-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pastel-lavender/40">
                          {getCategoryLabel(normalizeCategory(word.category))}
                        </span>
                        <span className="inline-flex items-center gap-1"><Target className="w-3 h-3 sm:w-3.5 sm:h-3.5" />{word.partOfSpeech}</span>
                        <span className="inline-flex items-center gap-1"><Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />{t('level', 'common')} {word.difficultyLevel}</span>
                      </div>
                      <div className="rounded-xl bg-pastel-cream/60 p-2 sm:p-3 text-xs sm:text-sm">
                        <p className="text-brand-800 japanese-text korean-text">{word.exampleNative}</p>
                        <p className="text-brand-500 mt-1">{word.exampleTranslation}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(word)}
                      className="flex-shrink-0 p-2 sm:p-2.5 rounded-xl bg-pastel-sky/60 text-brand-600 hover:bg-pastel-sky transition-colors min-h-[44px] min-w-[44px]"
                      title={t('hear_word', 'common')}
                    >
                      <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </Card>
              </AutoPlayOnVisible>
            </div>
          );
              })}
            </div>
          </section>
        ))}
      </div>

      {showToast && <Toast message={toastMessage} />}
      <KnownWordCelebration show={showCelebration} />
      {showGame && loggedIn && (
        <VocabularyGame
          words={vocabulary}
          language={language}
          onComplete={handleGameComplete}
          onClose={() => setShowGame(false)}
        />
      )}
    </AppShell>
  );
}
