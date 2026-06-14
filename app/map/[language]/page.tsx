'use client';



import { AppShell } from '@/components/ui/AppShell';

import { Button } from '@/components/ui/Button';

import { Card } from '@/components/ui/Card';

import { CharacterIllustration, SpeechBubble } from '@/components/ui/CharacterIllustration';

import { HubTabBar } from '@/components/ui/HubTabBar';
import { GetTheAppBanner } from '@/components/ui/GetTheAppBanner';

import { Toast } from '@/components/ui/Toast';

import { useI18nContext } from '@/contexts/I18nContext';

import { LANGUAGE_NAMES } from '@/lib/constants';

import { cn } from '@/lib/cn';

import { getGrammarPoints } from '@/lib/grammar-data';

import { getUserItem } from '@/lib/userStorage';

import { getMilestoneCount, VOCABULARY_BY_LANGUAGE } from '@/lib/vocabulary-data';

import { CheckCircle2, ChevronRight, Lock, MapPin, Play, Sparkles } from 'lucide-react';

import { useParams, useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';



interface Milestone {

  id: number;

  name: string;

  status: 'completed' | 'current' | 'locked';

  topikLevel: 1 | 2;

}



const languageNames = LANGUAGE_NAMES;



const MILESTONE_LABELS_T1 = [

  'Greetings', 'People & family', 'Food & drink', 'Places', 'Time & numbers',

  'Verbs basics', 'Adjectives', 'Weather', 'Transport', 'Shopping',

  'Daily life', 'Feelings', 'Study', 'Review 1', 'Review 2',

  'More greetings', 'More food', 'More places', 'More verbs', 'More adjectives',

  'More weather', 'More transport', 'More shopping', 'More daily', 'More feelings',

  'More study', 'Review 3', 'Review 4', 'Review 5', 'Review 6',

  'Final review 1', 'Final review 2', 'Final review 3', 'Final review 4', 'Final review 5',

  'Final review 6', 'Final review 7', 'Final review 8', 'Final review 9', 'Final review 10',

  'Final review 11', 'Final review 12', 'Final review 13', 'Final review 14', 'Final review 15',

  'Final review 16', 'Final review 17', 'Final review 18', 'Final review 19', 'Final review 20',

  'Final review 21', 'Final review 22', 'Final review 23', 'Final review 24', 'Final review 25',

  'Final review 26', 'Final review 27', 'Final review 28', 'Final review 29', 'Final review 30',

  'Final review 31', 'Final review 32',

];



const ENCOURAGEMENT_EN = [

  "You're doing amazing! 💗",

  'Almost there — keep going! ✨',

  'Every new word is a tiny victory! 🌸',

];



function buildMilestones(count: number, wordsPerStage: number, t1Count: number): Milestone[] {

  return Array.from({ length: count }, (_, i) => {

    const wordStart = i * wordsPerStage;

    const topikLevel: 1 | 2 = wordStart < t1Count ? 1 : 2;

    return {

      id: i + 1,

      name: MILESTONE_LABELS_T1[i] ?? `Stage ${i + 1}`,

      status: i === 0 ? ('current' as const) : ('locked' as const),

      topikLevel,

    };

  });

}



export default function CountryMapPage() {

  const [showToast, setShowToast] = useState(false);

  const [toastMessage, setToastMessage] = useState('');

  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const [topikFilter, setTopikFilter] = useState<0 | 1 | 2>(0);

  const { t } = useI18nContext();



  const router = useRouter();

  const params = useParams();

  const language = params.language as string;

  const vocabulary = VOCABULARY_BY_LANGUAGE[language] || [];

  const t1Count = vocabulary.filter((w) => w.difficultyLevel === 1).length;

  const grammarCount = getGrammarPoints(language).length;



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



    const count = getMilestoneCount(language);



    setMilestones(() => {

      const base = buildMilestones(count, 5, t1Count);

      let foundCurrent = false;



      return base.map((milestone) => {

        const key = `milestone_progress_${language}_${milestone.id}`;

        const data = JSON.parse(getUserItem(key) || '{}');



        if (data.quizCompleted) return { ...milestone, status: 'completed' as const };



        if (milestone.id > 1) {

          const prev = JSON.parse(getUserItem(`milestone_progress_${language}_${milestone.id - 1}`) || '{}');

          if (!prev.quizCompleted) return { ...milestone, status: 'locked' as const };

        }



        if (!foundCurrent) {

          foundCurrent = true;

          return { ...milestone, status: 'current' as const };

        }

        return { ...milestone, status: 'locked' as const };

      });

    });

  }, [language, router, t1Count]);



  const handleMilestoneClick = (milestone: Milestone) => {

    if (milestone.status === 'locked') {

      setToastMessage(t('stage_locked', 'common'));

      setShowToast(true);

      setTimeout(() => setShowToast(false), 3000);

      return;

    }

    router.push(`/milestone/${language}/${milestone.id}`);

  };



  const filteredMilestones =

    topikFilter === 0 ? milestones : milestones.filter((m) => m.topikLevel === topikFilter);



  const completedMilestones = milestones.filter((m) => m.status === 'completed').length;

  const progressPercentage = milestones.length > 0 ? (completedMilestones / milestones.length) * 100 : 0;

  const currentMilestone = milestones.find((m) => m.status === 'current');

  const encouragement = ENCOURAGEMENT_EN;

  const cheerLine = encouragement[completedMilestones % encouragement.length];



  return (

    <AppShell

      backHref="/language-selection"

      backLabel={t('languages', 'common')}

      eyebrow={t('learning_hub', 'common')}

      title={`${languageNames[language] ?? language} ${t('journey', 'common')}`}

      subtitle={`${vocabulary.length} ${t('words', 'common')} · ${grammarCount} ${t('lessons', 'common')}`}

      maxWidth="2xl"

      backgroundVariant="hub"

    >

      {/* Hero welcome */}

      <Card padding="none" className="relative mb-6 overflow-hidden border-white/70 bg-hub-hero shadow-medium">
        <div className="relative flex flex-col items-center gap-4 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">

          <div className="flex flex-1 flex-col items-center gap-3 sm:items-start">

            <SpeechBubble className="max-w-xs text-center sm:text-left">

              {cheerLine}

            </SpeechBubble>

            {currentMilestone && (

              <p className="text-sm font-medium text-brand-600/90">

                {t('your_current_stage', 'common')}{' '}

                <span className="font-bold text-brand-700">

                  {currentMilestone.name}

                </span>

              </p>

            )}

          </div>

          <CharacterIllustration variant="hearts" size="lg" priority />

        </div>

      </Card>



      <GetTheAppBanner className="mb-6" />



      <div className="mb-6 flex justify-center">
        <HubTabBar
          tabs={[
            {
              id: 'vocabulary',
              emoji: '📚',
              label: t('vocabulary', 'common'),
              badge: String(vocabulary.length),
              onClick: () => router.push(`/vocabulary/${language}`),
            },
            {
              id: 'grammar',
              emoji: '✏️',
              label: t('grammar', 'common'),
              badge: language === 'ko' ? String(grammarCount) : undefined,
              disabled: language !== 'ko',
              onClick: () => language === 'ko' && router.push(`/grammar/${language}`),
            },
          ]}
        />
      </div>



      <Card className="mb-6 border-pastel-green/50 bg-gradient-to-r from-pastel-pink-light/80 to-pastel-green-light/80">

        <div className="mb-3 flex items-center justify-between">

          <h2 className="flex items-center gap-2 text-sm font-bold text-brand-700">

            <Sparkles className="h-4 w-4 text-brand-400" />

            {t('learning_path_progress', 'common')}

          </h2>

          <span className="rounded-full bg-white/70 px-3 py-0.5 text-sm font-semibold text-success-600">

            {completedMilestones} / {milestones.length} {t('stages', 'common')}

          </span>

        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-white/70 shadow-inner">

          <div

            className="hub-progress-shimmer h-3 rounded-full transition-all duration-700"

            style={{ width: `${Math.max(progressPercentage, 4)}%` }}

          />

        </div>

        {progressPercentage > 0 && (

          <p className="mt-2 text-center text-xs font-medium text-brand-500">

            {Math.round(progressPercentage)}% {t('complete_percent', 'common')}

          </p>

        )}

      </Card>



      {language === 'ko' && (

        <div className="mb-4 flex flex-wrap gap-2">

          {([0, 1, 2] as const).map((level) => (

            <button

              key={level}

              type="button"

              onClick={() => setTopikFilter(level)}

              className={cn(

                'rounded-2xl px-4 py-2 text-sm font-semibold transition-all',

                topikFilter === level

                  ? 'bg-gradient-to-r from-brand-400 to-success-500 text-white shadow-cute'

                  : 'border-2 border-pastel-pink/50 bg-white/80 text-brand-700 hover:border-pastel-green'

              )}

            >

              {level === 0 ? t('all_stages', 'common') : `TOPIK ${level}`}

            </button>

          ))}

        </div>

      )}



      <div className="mb-6 space-y-3">

        {filteredMilestones.map((milestone) => {

          const locked = milestone.status === 'locked';

          return (

            <button

              key={milestone.id}

              type="button"

              onClick={() => handleMilestoneClick(milestone)}

              disabled={locked}

              className={cn(

                'flex w-full items-center gap-4 rounded-3xl border p-4 text-left transition-all duration-200',

                milestone.status === 'completed' &&

                  'border-success-200/80 bg-white/80 shadow-soft',

                milestone.status === 'current' &&

                  'border-brand-200 bg-white/90 shadow-medium ring-2 ring-brand-100/60',

                milestone.status === 'locked' && 'cursor-not-allowed border-pastel-pink/25 bg-white/40 opacity-50',

                !locked && 'cursor-pointer hover:scale-[1.01] hover:shadow-soft'

              )}

            >

              <div

                className={cn(

                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',

                  milestone.status === 'completed' && 'bg-success-100',

                  milestone.status === 'current' && 'bg-pastel-pink',

                  milestone.status === 'locked' && 'bg-pastel-pink-light'

                )}

              >

                {milestone.status === 'completed' && <CheckCircle2 className="h-5 w-5 text-success-600" />}

                {milestone.status === 'current' && <MapPin className="h-5 w-5 text-brand-500" />}

                {milestone.status === 'locked' && <Lock className="h-4 w-4 text-brand-300" />}

              </div>

              <div className="min-w-0 flex-1">

                <span className="text-xs font-semibold text-brand-500">

                  {t('stage', 'common')} {milestone.id} · TOPIK{' '}

                  {milestone.topikLevel}

                </span>

                <p className="text-sm font-bold text-brand-800 sm:text-base">

                  {milestone.name}

                </p>

                <p className="text-xs text-brand-500">5 {t('words', 'common')}</p>

              </div>

              {!locked && <ChevronRight className="h-5 w-5 shrink-0 text-brand-400" />}

            </button>

          );

        })}

      </div>



      {currentMilestone && (

        <div className="mb-4 flex flex-col items-center gap-3 text-center">

          <CharacterIllustration variant="study" size="md" className="opacity-95" />

          <Button

            size="lg"

            onClick={() => {

              if (currentMilestone) handleMilestoneClick(currentMilestone);

            }}

            className="min-w-[220px]"

          >

            <Play className="h-5 w-5" />

            {t('continue_learning', 'common')}

          </Button>

        </div>

      )}



      {showToast && <Toast message={toastMessage} />}

    </AppShell>

  );

}

