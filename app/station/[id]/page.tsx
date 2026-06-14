'use client';

import StationCard from '@/components/game/StationCard';
import WordModal from '@/components/game/WordModal';
import { AppShell } from '@/components/ui/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import type { UserWordProgress, Word } from '@/types';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Mock data for demonstration
const mockWords: (Word & { progress?: UserWordProgress })[] = [
  {
    id: 'word-1',
    languageId: 'ko-kr',
    lemma: '안녕하세요',
    phonetic: 'annyeonghaseyo',
    translationHe: 'שלום',
    translationEn: 'Hello',
    partOfSpeech: 'INTERJECTION',
    exampleNative: '안녕하세요! 처음 뵙겠습니다.',
    exampleTranslationHe: 'שלום! נעים להכיר.',
    media: [
      {
        id: 'media-1',
        wordId: 'word-1',
        mediaId: 'img-1',
        role: 'IMAGE',
        media: {
          id: 'img-1',
          type: 'IMAGE',
          url: '/images/ko/hello_korean_girl.webp',
          mime: 'image/webp',
          width: 400,
          height: 300,
          alt: 'Korean girl saying hello',
          createdAt: new Date(),
        },
      },
      {
        id: 'media-2',
        wordId: 'word-1',
        mediaId: 'audio-1',
        role: 'PRONUNCIATION',
        media: {
          id: 'audio-1',
          type: 'AUDIO',
          url: '/media/ko/hello.mp3',
          mime: 'audio/mpeg',
          durationMs: 2000,
          alt: 'Pronunciation of 안녕하세요',
          createdAt: new Date(),
        },
      },
    ],
    progress: { status: 'NOT_STARTED', totalAttempts: 0, correctStreak: 0, totalCorrect: 0, updatedAt: new Date() } as UserWordProgress,
  },
  {
    id: 'word-2',
    languageId: 'ko-kr',
    lemma: '감사합니다',
    phonetic: 'gamsahamnida',
    translationHe: 'תודה',
    translationEn: 'Thank you',
    partOfSpeech: 'INTERJECTION',
    exampleNative: '정말 감사합니다.',
    exampleTranslationHe: 'תודה רבה.',
    media: [
      {
        id: 'media-3',
        wordId: 'word-2',
        mediaId: 'img-2',
        role: 'IMAGE',
        media: {
          id: 'img-2',
          type: 'IMAGE',
          url: '/images/ko/thank_you_korean_girl.webp',
          mime: 'image/webp',
          width: 400,
          height: 300,
          alt: 'Korean girl saying thank you',
          createdAt: new Date(),
        },
      },
      {
        id: 'media-4',
        wordId: 'word-2',
        mediaId: 'audio-2',
        role: 'PRONUNCIATION',
        media: {
          id: 'audio-2',
          type: 'AUDIO',
          url: '/media/ko/thank-you.mp3',
          mime: 'audio/mpeg',
          durationMs: 2500,
          alt: 'Pronunciation of 감사합니다',
          createdAt: new Date(),
        },
      },
    ],
    progress: { status: 'IN_PROGRESS', totalAttempts: 2, correctStreak: 1, totalCorrect: 1, updatedAt: new Date() } as UserWordProgress,
  },
  {
    id: 'word-3',
    languageId: 'ko-kr',
    lemma: '네',
    phonetic: 'ne',
    translationHe: 'כן',
    translationEn: 'Yes',
    partOfSpeech: 'INTERJECTION',
    exampleNative: '네, 맞습니다.',
    exampleTranslationHe: 'כן, נכון.',
    media: [
      {
        id: 'media-5',
        wordId: 'word-3',
        mediaId: 'img-3',
        role: 'IMAGE',
        media: {
          id: 'img-3',
          type: 'IMAGE',
          url: '/images/ko/yes_korean_girl.webp',
          mime: 'image/webp',
          width: 400,
          height: 300,
          alt: 'Korean girl saying yes',
          createdAt: new Date(),
        },
      },
      {
        id: 'media-6',
        wordId: 'word-3',
        mediaId: 'audio-3',
        role: 'PRONUNCIATION',
        media: {
          id: 'audio-3',
          type: 'AUDIO',
          url: '/media/ko/yes.mp3',
          mime: 'audio/mpeg',
          durationMs: 1000,
          alt: 'Pronunciation of 네',
          createdAt: new Date(),
        },
      },
    ],
    progress: { status: 'LEARNED', totalAttempts: 5, correctStreak: 3, totalCorrect: 4, updatedAt: new Date() } as UserWordProgress,
  },
  ...Array.from({ length: 7 }, (_, i) => ({
    id: `word-${i + 4}`,
    languageId: 'ko-kr',
    lemma: `Word ${i + 4}`,
    phonetic: `word${i + 4}`,
    translationHe: `תרגום ${i + 4}`,
    translationEn: `Translation ${i + 4}`,
    partOfSpeech: 'NOUN' as const,
    exampleNative: `Example ${i + 4} in Korean.`,
    exampleTranslationHe: `דוגמה ${i + 4} בעברית.`,
    media: [],
    progress: { status: 'NOT_STARTED' as const, totalAttempts: 0, correctStreak: 0, totalCorrect: 0, updatedAt: new Date() } as UserWordProgress,
  })),
];

export default function StationPage() {
  const params = useParams();
  const router = useRouter();
  const [words, setWords] = useState<(Word & { progress?: UserWordProgress })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadStation = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setWords(mockWords);
      } catch (error) {
        console.error('Failed to load station:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStation();
  }, [params.id]);

  const handleWordClick = (word: Word) => {
    setSelectedWord(word);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWord(null);
  };

  const handleMarkLearned = (wordId: string) => {
    setWords(prevWords =>
      prevWords.map(word =>
        word.id === wordId
          ? {
              ...word,
              progress: {
                ...word.progress!,
                status: 'LEARNED',
                updatedAt: new Date(),
              },
            }
          : word
      )
    );
  };

  const handleStartQuiz = () => {
    router.push('/quiz/ko/1');
  };

  const getProgressStats = () => {
    const total = words.length;
    const learned = words.filter(w => w.progress?.status === 'LEARNED').length;
    const inProgress = words.filter(w => w.progress?.status === 'IN_PROGRESS').length;
    const notStarted = words.filter(w => !w.progress || w.progress.status === 'NOT_STARTED').length;

    return { total, learned, inProgress, notStarted };
  };

  const progressStats = getProgressStats();
  const canStartQuiz = progressStats.learned >= 8;
  const progressPercent = progressStats.total > 0
    ? Math.round((progressStats.learned / progressStats.total) * 100)
    : 0;

  if (isLoading) {
    return <LoadingScreen message="Loading station..." />;
  }

  return (
    <AppShell
      backHref="/map/ko"
      backLabel="Map"
      eyebrow="Station"
      title="Seoul Station"
      subtitle="Learn essential greetings and basic phrases"
      maxWidth="4xl"
      headerActions={
        <Button
          size="sm"
          onClick={handleStartQuiz}
          disabled={!canStartQuiz}
        >
          <Trophy className="w-4 h-4" />
          Start quiz
        </Button>
      }
    >
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Learning progress</h2>
          <span className="text-sm font-medium text-indigo-600">
            {progressStats.learned}/{progressStats.total} learned
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-slate-50">
            <div className="text-xl font-bold text-slate-900">{progressStats.total}</div>
            <div className="text-xs text-slate-500">Total</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-emerald-50">
            <div className="text-xl font-bold text-emerald-600">{progressStats.learned}</div>
            <div className="text-xs text-emerald-600">Learned</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-indigo-50">
            <div className="text-xl font-bold text-indigo-600">{progressStats.inProgress}</div>
            <div className="text-xs text-indigo-600">In progress</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-slate-100">
            <div className="text-xl font-bold text-slate-500">{progressStats.notStarted}</div>
            <div className="text-xs text-slate-500">Not started</div>
          </div>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-slate-600 text-center">
          {canStartQuiz
            ? 'Ready for the quiz. Test your knowledge when you feel confident.'
            : `${8 - progressStats.learned} more words needed to unlock the quiz.`}
        </p>
      </Card>

      <Card className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Words to learn</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {words.map((word, index) => (
            <motion.div
              key={word.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <StationCard
                word={word}
                onWordClick={handleWordClick}
                onMarkLearned={handleMarkLearned}
              />
            </motion.div>
          ))}
        </div>
      </Card>

      <Card padding="sm" className="bg-indigo-50/50 border-indigo-100">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Learning tips</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
          <div>
            <p className="font-medium text-slate-800 mb-1">Listen to pronunciation</p>
            <p>Use the audio button to hear native pronunciation for each word.</p>
          </div>
          <div>
            <p className="font-medium text-slate-800 mb-1">Mark as learned</p>
            <p>Track your progress and unlock the quiz once you know enough words.</p>
          </div>
        </div>
      </Card>

      {selectedWord && (
        <WordModal
          word={selectedWord}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onMarkLearned={handleMarkLearned}
        />
      )}
    </AppShell>
  );
}
