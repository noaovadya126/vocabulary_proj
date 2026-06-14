'use client';



import { AppShell } from '@/components/ui/AppShell';

import { Button } from '@/components/ui/Button';

import { Card } from '@/components/ui/Card';

import { KnownMarkButton } from '@/components/ui/KnownMarkButton';

import { KnownWordCelebration } from '@/components/ui/KnownWordCelebration';

import { Toast } from '@/components/ui/Toast';

import { WordImage } from '@/components/ui/WordImage';

import { useI18nContext } from '@/contexts/I18nContext';

import { getCategoryLabel, normalizeCategory } from '@/lib/categories';

import { cn } from '@/lib/cn';

import { getLanguageDisplayName } from '@/lib/displayText';

import { getDisplayMeaning } from '@/lib/displayText';

import { playWordAudio } from '@/lib/playWord';

import { getMilestoneWords } from '@/lib/vocabulary-data';

import { isMilestoneUnitReady, preloadMilestoneUnit, type PreloadProgress } from '@/lib/preloadMilestoneUnit';

import { UnitPreloadScreen } from '@/components/ui/UnitPreloadScreen';

import { getUserItem, setUserItem } from '@/lib/userStorage';

import { markMilestoneWordKnown } from '@/lib/wordProgress';

import { PlayCircle } from 'lucide-react';

import { useParams, useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';



interface Word {

  id: number;

  native: string;

  english: string;

  phonetic: string;

  category: string;

  status: 'locked' | 'learning' | 'completed';

}



export default function MilestonePage() {

  const [showToast, setShowToast] = useState(false);

  const [toastMessage, setToastMessage] = useState('');

  const [words, setWords] = useState<Word[]>([]);

  const [showCelebration, setShowCelebration] = useState(false);

  const [unitReady, setUnitReady] = useState(false);

  const [preloadProgress, setPreloadProgress] = useState<PreloadProgress>({ done: 0, total: 1, label: '' });



  const router = useRouter();

  const params = useParams();

  const language = params.language as string;

  const milestoneId = params.milestoneId as string;

  const { t, displayLanguage } = useI18nContext();



  const milestoneWordIds = words.map((w) => w.id);



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



    const languageWords = getMilestoneWords(language, milestoneId).map((w) => ({

      id: w.id,

      native: w.native,

      english: w.english,

      phonetic: w.phonetic,

      category: w.category,

      status: 'locked' as const,

    }));



    const userProgress = getUserItem(`progress_${language}_${milestoneId}`);

    if (userProgress) {

      const progress = JSON.parse(userProgress);

      const updatedWords = languageWords.map((word) => ({

        ...word,

        status: (progress[word.id] as Word['status']) || word.status,

      }));

      setWords(updatedWords);

    } else {

      const initialWords: Word[] = languageWords.map((word, index) => {

        const status: 'learning' | 'locked' = index === 0 ? 'learning' : 'locked';

        return { ...word, status };

      });

      setWords(initialWords);



      const initialProgress: Record<number, 'learning' | 'locked' | 'completed'> = {};

      initialWords.forEach((word) => {

        initialProgress[word.id] = word.status;

      });

      setUserItem(`progress_${language}_${milestoneId}`, JSON.stringify(initialProgress));

    }

  }, [language, milestoneId, router]);

  useEffect(() => {
    const unitWords = getMilestoneWords(language, milestoneId);
    if (!unitWords.length || isMilestoneUnitReady(language, milestoneId)) {
      setUnitReady(true);
      return;
    }

    setPreloadProgress({ done: 0, total: unitWords.length * 3, label: unitWords[0]?.native ?? '' });
    preloadMilestoneUnit(language, milestoneId, unitWords, setPreloadProgress)
      .then(() => setUnitReady(true))
      .catch(() => setUnitReady(true));
  }, [language, milestoneId]);

  const handleWordClick = (word: Word, wordIndex: number) => {

    if (word.status === 'locked') {

      setToastMessage(t('word_locked', 'common'));

      setShowToast(true);

      setTimeout(() => setShowToast(false), 3000);

      return;

    }



    if (word.status === 'learning' || word.status === 'completed') {

      const fullWord = getMilestoneWords(language, milestoneId).find((w) => w.id === word.id);

      playWordAudio(language, word.native, fullWord?.audioFile).catch(() => {});

      router.push(`/word-learning/${language}/${milestoneId}/${word.id}`);

    }

  };



  const handleMarkKnown = (word: Word, e?: React.MouseEvent) => {

    e?.stopPropagation();

    if (word.status === 'locked') {

      setToastMessage(t('word_locked', 'common'));

      setShowToast(true);

      setTimeout(() => setShowToast(false), 2500);

      return;

    }

    if (word.status === 'completed') return;



    markMilestoneWordKnown(language, milestoneId, word.id, milestoneWordIds);

    setWords((prev) =>

      prev.map((w) => {

        if (w.id === word.id) return { ...w, status: 'completed' as const };

        const idx = prev.findIndex((x) => x.id === w.id);

        const wordIdx = prev.findIndex((x) => x.id === word.id);

        if (idx === wordIdx + 1 && w.status === 'locked') return { ...w, status: 'learning' as const };

        return w;

      })

    );

    setShowCelebration(true);

    setTimeout(() => setShowCelebration(false), 1400);

  };



  const handleStartQuiz = () => {

    const completedWords = words.filter((w) => w.status === 'completed').length;

    if (completedWords === words.length) {

      router.push(`/quiz/${language}/${milestoneId}`);

    } else {

      setToastMessage(`${t('complete_all_first', 'common')} (${words.length - completedWords})`);

      setShowToast(true);

      setTimeout(() => setShowToast(false), 3000);

    }

  };



  const shouldLockWord = (word: Word, wordIndex: number) => {

    if (wordIndex === 0) return false;

    const previousWord = words[wordIndex - 1];

    return previousWord && previousWord.status !== 'completed';

  };



  const getWordStatus = (word: Word, wordIndex: number) => {

    if (shouldLockWord(word, wordIndex)) return 'locked';

    return word.status;

  };



  useEffect(() => {

    if (words.length > 0) {

      let hasChanges = false;

      const updatedWords: Word[] = words.map((word, index) => {

        if (index === 0) return word;



        const previousWord = words[index - 1];

        if (previousWord && previousWord.status === 'completed' && word.status === 'locked') {

          hasChanges = true;

          const progressKey = `progress_${language}_${milestoneId}`;

          const currentProgress = getUserItem(progressKey);

          const progress = currentProgress ? JSON.parse(currentProgress) : {};

          progress[word.id] = 'learning';

          setUserItem(progressKey, JSON.stringify(progress));

          return { ...word, status: 'learning' as const };

        }

        return word;

      });



      if (hasChanges) setWords(updatedWords);

    }

  }, [words, language, milestoneId]);



  const getStatusStyles = (status: string) => {

    switch (status) {

      case 'completed':

        return 'border-emerald-200 bg-emerald-50';

      case 'learning':

        return 'border-indigo-200 bg-indigo-50';

      case 'locked':

        return 'border-slate-200 bg-slate-50 opacity-60';

      default:

        return 'border-slate-200 bg-white';

    }

  };



  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Completed', className: 'text-emerald-700 bg-emerald-100' };
      case 'learning':
        return { label: 'Learning', className: 'text-indigo-700 bg-indigo-100' };
      default:
        return { label: 'Locked', className: 'text-slate-600 bg-slate-100' };
    }
  };



  const completedWords = words.filter((w) => w.status === 'completed').length;

  const canTakeQuiz = completedWords === words.length;



  if (!unitReady) {
    return (
      <UnitPreloadScreen
        done={preloadProgress.done}
        total={preloadProgress.total}
        currentWord={preloadProgress.label}
      />
    );
  }



  return (

    <AppShell

      backHref={`/map/${language}`}

      backLabel={t('map', 'common')}

      eyebrow={`${t('milestone', 'common')} ${milestoneId}`}

      title={getLanguageDisplayName(language, displayLanguage)}

      subtitle={t('learn_order', 'common')}

      maxWidth="2xl"

    >

      <Card className="mb-4 sm:mb-6">

        <div className="flex items-center justify-between mb-2 sm:mb-3">

          <span className="text-xs sm:text-sm font-medium text-slate-700">{t('progress_label', 'common')}</span>

          <span className="text-xs sm:text-sm text-slate-600">

            {completedWords} / {words.length} {t('words', 'common')}

          </span>

        </div>

        <div className="w-full bg-slate-200 rounded-full h-2">

          <div

            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"

            style={{ width: `${words.length > 0 ? (completedWords / words.length) * 100 : 0}%` }}

          />

        </div>

      </Card>



      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-6 sm:mb-8">

        {words.map((word, index) => {

          const status = getWordStatus(word, index);

          const badge = getStatusBadge(status);

          const locked = status === 'locked';

          const isKnown = status === 'completed';

          const meaning = getDisplayMeaning(word.english, displayLanguage);



          return (

            <div key={word.id} className="flex gap-1.5 sm:gap-2 items-stretch">

              <KnownMarkButton

                isKnown={isKnown}

                onMark={() => handleMarkKnown(word)}

                compact

              />

              <button

                type="button"

                onClick={() => handleWordClick(word, index)}

                disabled={locked}

                className={cn(

                  'flex-1 min-w-0 text-left rounded-xl border p-3 sm:p-4 transition-all',

                  getStatusStyles(status),

                  !locked && 'hover:shadow-sm cursor-pointer',

                  locked && 'cursor-not-allowed'

                )}

              >

                <div className="flex items-start gap-2 sm:gap-3">

                  <WordImage english={word.english} category={word.category} wordId={String(word.id)} nativeText={word.native} language={language} size="sm" />

                  <div className="flex-1 min-w-0">

                    <div className="flex items-start justify-between gap-2">

                      <span className="text-sm sm:text-base font-semibold text-slate-900 japanese-text korean-text">{word.native}</span>

                      <span className={cn('text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium shrink-0', badge.className)}>

                        {badge.label}

                      </span>

                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 hebrew-text">{meaning}</p>

                    <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">

                      {word.phonetic} · {getCategoryLabel(normalizeCategory(word.category), displayLanguage)}

                    </p>

                  </div>

                </div>

              </button>

            </div>

          );

        })}

      </div>



      <div className="flex flex-col sm:flex-row gap-3 justify-center">

        <Button onClick={handleStartQuiz} disabled={!canTakeQuiz} size="lg" className="w-full sm:w-auto sm:min-w-[200px]">

          <PlayCircle className="w-5 h-5" />

          {canTakeQuiz ? t('start_quiz', 'navigation') : t('complete_all_first', 'common')}

        </Button>

      </div>



      {showToast && <Toast message={toastMessage} />}

      <KnownWordCelebration show={showCelebration} />

    </AppShell>

  );

}

