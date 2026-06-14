'use client';

import { AppShell } from '@/components/ui/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Toast } from '@/components/ui/Toast';
import { cn } from '@/lib/cn';
import { LANGUAGE_NAMES } from '@/lib/constants';
import { RotateCcw } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface GameWord {
  id: number;
  word: string;
  meaning: string;
  isMatched: boolean;
  position: { x: number; y: number };
}

interface TargetArea {
  id: number;
  meaning: string;
  isMatched: boolean;
  position: { x: number; y: number };
}

const mockGameWords: GameWord[] = [
  { id: 1, word: 'こんにちは', meaning: 'Hello', isMatched: false, position: { x: 20, y: 30 } },
  { id: 2, word: 'ありがとう', meaning: 'Thank you', isMatched: false, position: { x: 80, y: 20 } },
  { id: 3, word: 'お願いします', meaning: 'Please', isMatched: false, position: { x: 15, y: 70 } },
  { id: 4, word: 'おはよう', meaning: 'Good morning', isMatched: false, position: { x: 85, y: 80 } },
  { id: 5, word: 'おやすみ', meaning: 'Good night', isMatched: false, position: { x: 50, y: 15 } },
];

const mockTargetAreas: TargetArea[] = [
  { id: 1, meaning: 'Hello', isMatched: false, position: { x: 25, y: 60 } },
  { id: 2, meaning: 'Thank you', isMatched: false, position: { x: 75, y: 50 } },
  { id: 3, meaning: 'Please', isMatched: false, position: { x: 20, y: 85 } },
  { id: 4, meaning: 'Good morning', isMatched: false, position: { x: 80, y: 90 } },
  { id: 5, meaning: 'Good night', isMatched: false, position: { x: 50, y: 75 } },
];

export default function GamePage() {
  const [gameWords, setGameWords] = useState<GameWord[]>(mockGameWords);
  const [targetAreas, setTargetAreas] = useState<TargetArea[]>(mockTargetAreas);
  const [selectedWord, setSelectedWord] = useState<GameWord | null>(null);
  const [correctMatches, setCorrectMatches] = useState(0);
  const [incorrectMatches, setIncorrectMatches] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const router = useRouter();
  const params = useParams();
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
    }
  }, [language, router]);

  const calculateAccuracy = () => {
    const totalAttempts = correctMatches + incorrectMatches;
    if (totalAttempts === 0) return 0;
    return Math.round((correctMatches / totalAttempts) * 100);
  };

  const handleWordClick = (word: GameWord) => {
    if (word.isMatched) return;
    setSelectedWord(word);
  };

  const handleTargetClick = (target: TargetArea) => {
    if (!selectedWord || target.isMatched) return;

    const isCorrect = selectedWord.meaning === target.meaning;

    if (isCorrect) {
      setCorrectMatches(prev => prev + 1);
      setGameWords(prev => prev.map(w =>
        w.id === selectedWord.id ? { ...w, isMatched: true } : w
      ));
      setTargetAreas(prev => prev.map(t =>
        t.id === target.id ? { ...t, isMatched: true } : t
      ));
      setToastMessage('Correct match!');
      setToastType('success');
      setShowToast(true);
    } else {
      setIncorrectMatches(prev => prev + 1);
      setToastMessage('Not quite — try again.');
      setToastType('error');
      setShowToast(true);
    }

    setSelectedWord(null);

    const newCorrectMatches = isCorrect ? correctMatches + 1 : correctMatches;
    if (newCorrectMatches === gameWords.length) {
      setTimeout(() => setShowGameOver(true), 1000);
    }
  };

  const handleReset = () => {
    setGameWords(mockGameWords);
    setTargetAreas(mockTargetAreas);
    setSelectedWord(null);
    setCorrectMatches(0);
    setIncorrectMatches(0);
    setShowGameOver(false);
  };

  const handleNext = () => {
    if (calculateAccuracy() >= 90) {
      router.push(`/winner/${language}/${milestoneId}?score=${calculateAccuracy()}`);
    } else {
      setToastMessage('Reach at least 90% accuracy to continue.');
      setToastType('error');
      setShowToast(true);
    }
  };

  const getWordStyle = (word: GameWord) => cn(
    'absolute w-24 h-24 rounded-xl shadow-sm flex items-center justify-center text-center font-semibold text-sm cursor-pointer transition-all border-2 p-2',
    word.isMatched && 'bg-emerald-50 border-emerald-400 text-emerald-800 opacity-60',
    !word.isMatched && selectedWord?.id === word.id && 'bg-indigo-50 border-indigo-500 text-indigo-800 ring-2 ring-indigo-200',
    !word.isMatched && selectedWord?.id !== word.id && 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300'
  );

  const getTargetStyle = (target: TargetArea) => cn(
    'absolute w-32 h-16 rounded-lg flex items-center justify-center text-center font-medium text-sm border-2 transition-all p-2',
    target.isMatched && 'bg-emerald-50 border-emerald-400 text-emerald-800',
    !target.isMatched && selectedWord && selectedWord.meaning === target.meaning && 'bg-indigo-50 border-indigo-400 text-indigo-800 ring-2 ring-indigo-200',
    !target.isMatched && (!selectedWord || selectedWord.meaning !== target.meaning) && 'bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-300'
  );

  const accuracy = calculateAccuracy();

  return (
    <AppShell
      backHref={`/milestone/${language}/${milestoneId}`}
      backLabel="Milestone"
      eyebrow="Matching game"
      title={LANGUAGE_NAMES[language] ?? language}
      subtitle="Match each word to its meaning"
      maxWidth="4xl"
    >
      <Card className="mb-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{correctMatches}</div>
            <div className="text-xs text-slate-500">Correct</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{incorrectMatches}</div>
            <div className="text-xs text-slate-500">Incorrect</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{accuracy}%</div>
            <div className="text-xs text-slate-500">Accuracy</div>
          </div>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className={cn(
              'h-2 rounded-full transition-all duration-500',
              accuracy >= 90 ? 'bg-emerald-500' : accuracy >= 70 ? 'bg-amber-400' : 'bg-red-400'
            )}
            style={{ width: `${accuracy}%` }}
          />
        </div>
        <p className="text-center text-sm text-slate-600 mt-2">
          {accuracy >= 90 ? 'Great work — you can continue.' : 'Aim for 90% accuracy to unlock the next step.'}
        </p>
      </Card>

      <Card padding="lg" className="relative min-h-[500px] mb-6">
        {gameWords.map((word) => (
          <button
            key={word.id}
            type="button"
            onClick={() => handleWordClick(word)}
            className={getWordStyle(word)}
            style={{ left: `${word.position.x}%`, top: `${word.position.y}%`, transform: 'translate(-50%, -50%)' }}
            disabled={word.isMatched}
          >
            {word.word}
          </button>
        ))}

        {targetAreas.map((target) => (
          <button
            key={target.id}
            type="button"
            onClick={() => handleTargetClick(target)}
            className={getTargetStyle(target)}
            style={{ left: `${target.position.x}%`, top: `${target.position.y}%`, transform: 'translate(-50%, -50%)' }}
            disabled={target.isMatched}
          >
            {target.meaning}
          </button>
        ))}

        <p className="absolute bottom-4 left-4 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
          Tap a word, then tap its meaning
        </p>
      </Card>

      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="secondary" onClick={handleReset}>
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
        <Button onClick={handleNext} disabled={accuracy < 90}>
          {accuracy >= 90 ? 'Continue' : 'Need 90% accuracy'}
        </Button>
      </div>

      {showGameOver && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full text-center">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Well done!</h2>
            <p className="text-slate-600 mb-6">
              You finished with {accuracy}% accuracy.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={handleReset}>Try again</Button>
              <Button onClick={handleNext}>Continue</Button>
            </div>
          </Card>
        </div>
      )}

      {showToast && (
        <Toast message={toastMessage} variant={toastType === 'success' ? 'success' : 'error'} />
      )}
    </AppShell>
  );
}
