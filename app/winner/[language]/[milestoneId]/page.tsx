'use client';

import { AppShell } from '@/components/ui/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Toast } from '@/components/ui/Toast';
import { LANGUAGE_NAMES } from '@/lib/constants';
import { Star, Trophy } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function WinnerContent() {
  const [score, setScore] = useState(0);
  const [filledStars, setFilledStars] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [ready, setReady] = useState(false);

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const language = params.language as string;
  const milestoneId = params.milestoneId as string;

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

    const urlScore = searchParams.get('score');
    const quizResults = localStorage.getItem(`quiz_results_${language}_${milestoneId}`);
    const savedScore = localStorage.getItem(`score_${language}_${milestoneId}`);

    if (!urlScore && !savedScore && !quizResults) {
      router.push(`/milestone/${language}/${milestoneId}`);
      return;
    }

    let scoreValue = 0;
    if (urlScore) {
      scoreValue = parseInt(urlScore, 10);
    } else if (savedScore) {
      scoreValue = parseInt(savedScore, 10);
    } else if (quizResults) {
      const results = JSON.parse(quizResults);
      scoreValue = results.percentage ?? Math.round((results.score / results.totalQuestions) * 100);
    }

    setScore(scoreValue);
    setFilledStars(Math.ceil(scoreValue / 20));
    setReady(true);
  }, [language, milestoneId, router, searchParams]);

  const getEncouragingMessage = (value: number) => {
    if (value >= 95) return 'Outstanding work — you mastered this milestone.';
    if (value >= 90) return 'Excellent progress. You are learning quickly.';
    if (value >= 80) return 'Great job. Solid understanding of the material.';
    if (value >= 70) return 'Good effort. A bit more practice will help.';
    return 'Nice step forward. Review the words and try again.';
  };

  const handleContinue = () => {
    router.push(`/map/${language}`);
  };

  const handleReview = () => {
    router.push(`/milestone/${language}/${milestoneId}`);
  };

  if (!ready) {
    return <LoadingScreen />;
  }

  return (
    <AppShell
      backHref={`/map/${language}`}
      backLabel="Map"
      eyebrow="Milestone complete"
      title="Congratulations!"
      subtitle={`You finished ${LANGUAGE_NAMES[language] ?? language} milestone ${milestoneId}.`}
      maxWidth="lg"
    >
      <Card className="text-center mb-6">
        <div className="mx-auto w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-4">
          <Trophy className="w-7 h-7 text-amber-600" />
        </div>

        <div className="text-5xl font-bold text-indigo-600 mb-1">{score}%</div>
        <p className="text-sm text-slate-500 mb-4">Quiz score</p>

        <div className="flex justify-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              className={`w-6 h-6 ${star <= filledStars ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
            />
          ))}
        </div>

        <p className="text-slate-600">{getEncouragingMessage(score)}</p>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={handleContinue} size="lg">
          Continue to map
        </Button>
        <Button onClick={handleReview} variant="secondary" size="lg">
          Review words
        </Button>
      </div>

      {showToast && <Toast message={toastMessage} variant="success" />}
    </AppShell>
  );
}

export default function WinnerPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <WinnerContent />
    </Suspense>
  );
}
