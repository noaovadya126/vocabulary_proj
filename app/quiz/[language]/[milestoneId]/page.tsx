'use client';



import { AppShell } from '@/components/ui/AppShell';

import { Button } from '@/components/ui/Button';

import { Card } from '@/components/ui/Card';

import { ChibiMascot } from '@/components/ui/ChibiMascot';

import { LoadingScreen } from '@/components/ui/LoadingScreen';

import { Toast } from '@/components/ui/Toast';

import { WrongAnswerFeedback } from '@/components/ui/WrongAnswerFeedback';

import { useI18nContext } from '@/contexts/I18nContext';

import { cn } from '@/lib/cn';

import { getLanguageDisplayName } from '@/lib/displayText';

import { getWordNotes, getWordNotesByNative } from '@/lib/notes';

import { getUserItem, setUserItem } from '@/lib/userStorage';

import { playWordAudio } from '@/lib/playWord';
import { playErrorSfx, playSuccessSfx } from '@/lib/sfx';

import { getMilestoneWords, getQuizQuestions } from '@/lib/vocabulary-data';

import { Volume2 } from 'lucide-react';

import { useParams, useRouter } from 'next/navigation';

import { useEffect, useMemo, useState } from 'react';



export default function QuizPage() {

  const [showToast, setShowToast] = useState(false);

  const [toastMessage, setToastMessage] = useState('');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  const [score, setScore] = useState(0);

  const [showResult, setShowResult] = useState(false);

  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);

  const [isCorrect, setIsCorrect] = useState(false);

  const [awaitingRetry, setAwaitingRetry] = useState(false);

  const [userNotes, setUserNotes] = useState('');

  const [hasSavedNotes, setHasSavedNotes] = useState(false);



  const router = useRouter();

  const params = useParams();

  const language = params.language as string;

  const milestoneId = params.milestoneId as string;

  const { t, displayLanguage } = useI18nContext();



  const milestoneWords = useMemo(

    () => getMilestoneWords(language, milestoneId),

    [language, milestoneId]

  );



  const questions = useMemo(

    () => getQuizQuestions(language, milestoneId, displayLanguage),

    [language, milestoneId, displayLanguage]

  );



  const currentQuestion = questions[currentQuestionIndex];



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



    const progressKey = `progress_${language}_${milestoneId}`;

    const userProgress = getUserItem(progressKey);



    if (userProgress) {

      const progress = JSON.parse(userProgress);

      const completedWords = Object.values(progress).filter((s) => s === 'completed').length;

      if (completedWords < milestoneWords.length) {

        setToastMessage(`${t('complete_words_quiz', 'common')} (${milestoneWords.length})`);

        setShowToast(true);

        setTimeout(() => router.push(`/milestone/${language}/${milestoneId}`), 2000);

      }

    } else {

      setToastMessage(t('no_progress', 'common'));

      setShowToast(true);

      setTimeout(() => router.push(`/milestone/${language}/${milestoneId}`), 2000);

    }

  }, [language, milestoneId, milestoneWords.length, router, t]);



  const advanceQuestion = () => {

    setShowAnswerFeedback(false);

    setSelectedAnswer('');

    setAwaitingRetry(false);

    setUserNotes('');

    setHasSavedNotes(false);



    if (currentQuestionIndex < questions.length - 1) {

      setCurrentQuestionIndex((prev) => prev + 1);

    } else {

      setShowResult(true);

    }

  };



  const handleAnswerSelect = (answer: string) => {

    if (showAnswerFeedback && !awaitingRetry) return;

    setSelectedAnswer(answer);



    const correct = answer === currentQuestion.correctAnswer;



    if (correct) {

      setScore((prev) => prev + 1);

      setIsCorrect(true);

      setShowAnswerFeedback(true);

      setAwaitingRetry(false);

      playSuccessSfx();

    } else {

      setIsCorrect(false);

      playErrorSfx();

      const notes = currentQuestion.wordId

        ? getWordNotes(language, milestoneId, String(currentQuestion.wordId))

        : getWordNotesByNative(language, milestoneId, currentQuestion.word, milestoneWords);

      setUserNotes(notes.trim());

      setHasSavedNotes(!!notes.trim());

      setAwaitingRetry(true);

      setShowAnswerFeedback(true);



      const wrongAnswersKey = `wrong_answers_${language}_${milestoneId}`;

      const existing = JSON.parse(getUserItem(wrongAnswersKey) || '[]');

      existing.push({

        word: currentQuestion.word,

        userAnswer: answer,

        correctAnswer: currentQuestion.correctAnswer,

        notes,

        questionId: currentQuestion.id,

        timestamp: new Date().toISOString(),

      });

      setUserItem(wrongAnswersKey, JSON.stringify(existing));

    }

  };



  const handleTryAgain = () => {

    setShowAnswerFeedback(false);

    setSelectedAnswer('');

    setAwaitingRetry(false);

    setUserNotes('');

    setHasSavedNotes(false);

  };



  const handleGiveUp = () => {

    setAwaitingRetry(false);

    setIsCorrect(false);

  };



  const handleFinishQuiz = () => {

    const percentage = Math.round((score / questions.length) * 100);

    setUserItem(

      `quiz_results_${language}_${milestoneId}`,

      JSON.stringify({ language, milestoneId, score, totalQuestions: questions.length, percentage, completedAt: new Date().toISOString() })

    );

    setUserItem(`score_${language}_${milestoneId}`, String(percentage));



    const milestoneProgressKey = `milestone_progress_${language}_${milestoneId}`;

    const milestoneData = JSON.parse(getUserItem(milestoneProgressKey) || '{}');

    milestoneData.quizCompleted = true;

    milestoneData.quizScore = percentage;

    milestoneData.quizCompletedAt = new Date().toISOString();

    setUserItem(milestoneProgressKey, JSON.stringify(milestoneData));



    router.push(`/winner/${language}/${milestoneId}?score=${percentage}`);

  };



  if (!currentQuestion) {

    return <LoadingScreen message={t('loading', 'common')} />;

  }



  if (showResult) {

    return (

      <AppShell

        backHref={`/milestone/${language}/${milestoneId}`}

        backLabel={t('milestone', 'common')}

        eyebrow={t('quiz_complete', 'common')}

        title={t('great_work', 'common')}

        subtitle={`You answered ${score} out of ${questions.length} correctly.`}

        maxWidth="lg"

      >

        <Card className="text-center">

          <ChibiMascot mood="cheer" size="lg" className="mx-auto mb-4" />

          <div className="text-3xl sm:text-5xl font-bold text-brand-500 mb-2">{score}/{questions.length}</div>

          <p className="text-brand-600 mb-6 text-sm sm:text-base">

            {score === questions.length

              ? t('perfect_score', 'common')

              : score >= questions.length * 0.8

              ? t('strong_performance', 'common')

              : t('good_effort', 'common')}

          </p>

          <Button onClick={handleFinishQuiz} size="lg">

            {t('view_results', 'common')}

          </Button>

        </Card>

      </AppShell>

    );

  }



  const questionLabel = `${t('question_of', 'common')} ${currentQuestionIndex + 1} ${t('of', 'common')} ${questions.length}`;



  return (

    <AppShell

      backHref={`/milestone/${language}/${milestoneId}`}

      backLabel={t('milestone', 'common')}

      eyebrow={`${t('milestone', 'common')} ${milestoneId} · ${t('quiz', 'navigation')}`}

      title={getLanguageDisplayName(language, displayLanguage)}

      subtitle={questionLabel}

      maxWidth="lg"

    >

      <Card className="mb-4 relative overflow-hidden">

        <div className="w-full bg-pastel-lavender/50 rounded-full h-2 mb-4">

          <div

            className="bg-brand-400 h-2 rounded-full transition-all duration-500"

            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}

          />

        </div>



        {showAnswerFeedback && (

          <div

            className={cn(

              'mb-4 p-3 sm:p-4 rounded-2xl text-sm',

              isCorrect

                ? 'bg-pastel-mint/60 text-success-600 border border-success-200'

                : 'bg-pastel-peach/50 text-brand-800 border border-pastel-peach'

            )}

          >

            {isCorrect ? (

              <p className="font-semibold text-center">{t('correct', 'common')} 🎉</p>

            ) : awaitingRetry ? (

              <div className="space-y-3">

                <div className="flex items-center gap-3">

                  <ChibiMascot mood="thinking" size="sm" />

                  <p className="font-semibold hebrew-text">{t('wrong_try_again', 'common')}</p>

                </div>

                <WrongAnswerFeedback

                  hasNotes={hasSavedNotes}

                  notes={userNotes}

                  language={language}

                  milestoneId={milestoneId}

                  wordId={currentQuestion.wordId}

                  onRetry={handleTryAgain}

                  onSkip={handleGiveUp}

                />

              </div>

            ) : (

              <div className="space-y-2 hebrew-text">

                <p className="font-semibold">

                  {t('correct_answer_label', 'common')}{' '}

                  <strong>{currentQuestion.correctAnswer}</strong>

                </p>

                <Button onClick={advanceQuestion} size="sm">

                  {currentQuestionIndex < questions.length - 1 ? t('next_question', 'common') : t('see_results', 'common')}

                </Button>

              </div>

            )}

          </div>

        )}



        <div className="flex flex-col items-center gap-2 sm:gap-3 mb-4 sm:mb-6">

          <button

            type="button"

            onClick={() => playWordAudio(language, currentQuestion.word, currentQuestion.audioFile)}

            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-pastel-sky/60 text-brand-700 text-xs sm:text-sm font-medium hover:bg-pastel-sky"

          >

            <Volume2 className="w-4 h-4" />

            {t('hear_word', 'common')}

          </button>

          <h2 className="text-base sm:text-xl font-semibold text-brand-800 text-center japanese-text korean-text px-2">

            {t('what_does_mean', 'common')} &ldquo;{currentQuestion.word}&rdquo;?

          </h2>

        </div>



        <div className="space-y-2">

          {currentQuestion.options.map((option, index) => (

            <button

              key={`${index}-${option}`}

              type="button"

              onClick={() => handleAnswerSelect(option)}

              disabled={showAnswerFeedback && !awaitingRetry}

              className={cn(

                'w-full p-3 sm:p-4 text-left rounded-xl border text-sm font-medium transition-colors hebrew-text',

                selectedAnswer === option && !showAnswerFeedback && 'border-brand-400 bg-pastel-lavender/50 text-brand-800',

                showAnswerFeedback && !awaitingRetry && option === currentQuestion.correctAnswer && 'border-success-300 bg-pastel-mint/50 text-success-700',

                showAnswerFeedback && !awaitingRetry && selectedAnswer === option && option !== currentQuestion.correctAnswer && 'border-red-300 bg-pastel-rose/40 text-red-700',

                !showAnswerFeedback && selectedAnswer !== option && 'border-brand-100 bg-white hover:border-brand-200 text-brand-800',

                showAnswerFeedback && awaitingRetry && selectedAnswer === option && 'border-red-300 bg-pastel-rose/40 text-red-700',

                showAnswerFeedback && awaitingRetry && selectedAnswer !== option && 'opacity-70'

              )}

            >

              {option}

            </button>

          ))}

        </div>



        {showAnswerFeedback && isCorrect && (

          <div className="mt-5 flex justify-center">

            <Button onClick={advanceQuestion}>

              {currentQuestionIndex < questions.length - 1 ? t('next_question', 'common') : t('see_results', 'common')}

            </Button>

          </div>

        )}

      </Card>



      {showToast && <Toast message={toastMessage} />}

    </AppShell>

  );

}

