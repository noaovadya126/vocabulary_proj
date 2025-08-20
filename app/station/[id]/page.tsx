'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Trophy, BookOpen, Volume2 } from 'lucide-react';
import StationCard from '@/components/game/StationCard';
import { useGameStore } from '@/lib/store';
import type { Station, Word, UserWordProgress } from '@/types';

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
          url: '/media/ko/hello.webp',
          mime: 'image/webp',
          width: 400,
          height: 300,
          alt: 'Child waving hello',
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
          url: '/media/ko/thank-you.webp',
          mime: 'image/webp',
          width: 400,
          height: 300,
          alt: 'Person saying thank you',
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
          url: '/media/ko/yes.webp',
          mime: 'image/webp',
          width: 400,
          height: 300,
          alt: 'Thumbs up gesture',
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
  // Add more words to make 10 total
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
  const { currentStation, setCurrentStation } = useGameStore();
  const [words, setWords] = useState<(Word & { progress?: UserWordProgress })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  useEffect(() => {
    // Load station data (in real app, this would be an API call)
    const loadStation = async () => {
      try {
        // Simulate API call
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
    // In a real app, this would open a modal or navigate to word detail
    console.log('Selected word:', word);
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

  const handleBackClick = () => {
    router.push('/map/ko-KR');
  };

  const handleStartQuiz = () => {
    // In a real app, this would start the quiz
    console.log('Starting quiz for station:', params.id);
  };

  const getProgressStats = () => {
    const total = words.length;
    const learned = words.filter(w => w.progress?.status === 'LEARNED').length;
    const inProgress = words.filter(w => w.progress?.status === 'IN_PROGRESS').length;
    const notStarted = words.filter(w => !w.progress || w.progress.status === 'NOT_STARTED').length;

    return { total, learned, inProgress, notStarted };
  };

  const progressStats = getProgressStats();
  const canStartQuiz = progressStats.learned >= 8; // Need 80% to start quiz

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-muted-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-16 h-16 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-muted-600">Loading Station...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-muted-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-muted-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackClick}
                className="p-2 rounded-lg hover:bg-muted-100 transition-colors"
                aria-label="Go back to map"
              >
                <ArrowLeft className="w-5 h-5 text-muted-600" />
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-muted-800">
                  Seoul Station
                </h1>
                <p className="text-muted-600">
                  Learn essential greetings and basic phrases
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Progress indicator */}
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {progressStats.learned}/{progressStats.total}
                </div>
                <div className="text-xs text-muted-500">Words Learned</div>
              </div>

              {/* Quiz button */}
              <button
                onClick={handleStartQuiz}
                disabled={!canStartQuiz}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${
                  canStartQuiz
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-muted-300 text-muted-500 cursor-not-allowed'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Start Quiz</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Progress overview */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-muted-800 mb-4">
              📚 Learning Progress
            </h2>
            
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-muted-50 rounded-lg">
                <div className="text-2xl font-bold text-muted-600">
                  {progressStats.total}
                </div>
                <div className="text-sm text-muted-500">Total Words</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {progressStats.learned}
                </div>
                <div className="text-sm text-green-600">Learned</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {progressStats.inProgress}
                </div>
                <div className="text-sm text-blue-600">In Progress</div>
              </div>
              <div className="text-center p-4 bg-muted-100 rounded-lg">
                <div className="text-2xl font-bold text-muted-500">
                  {progressStats.notStarted}
                </div>
                <div className="text-sm text-muted-500">Not Started</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-muted-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(progressStats.learned / progressStats.total) * 100}%` }}
              />
            </div>
            
            <div className="mt-2 text-sm text-muted-600 text-center">
              {progressStats.learned >= 8 
                ? '🎉 Ready for quiz! You can now test your knowledge.'
                : `${8 - progressStats.learned} more words needed to unlock the quiz.`
              }
            </div>
          </div>

          {/* Words grid */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-muted-800 mb-6">
              🎯 Learn These Words
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {words.map((word, index) => (
                <motion.div
                  key={word.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <StationCard
                    word={word}
                    onWordClick={handleWordClick}
                    onMarkLearned={handleMarkLearned}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Learning tips */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-primary-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-xl font-bold text-muted-800 mb-4">
              💡 Learning Tips
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-600">
              <div>
                <h4 className="font-semibold text-muted-800 mb-2">
                  🎧 Listen to Pronunciation
                </h4>
                <p>
                  Click the volume icon to hear how each word is pronounced by native speakers.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-muted-800 mb-2">
                  ✅ Mark as Learned
                </h4>
                <p>
                  Use the checkmark button when you feel confident with a word. 
                  This tracks your progress and unlocks the quiz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
