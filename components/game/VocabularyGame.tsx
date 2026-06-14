'use client';

import { motion } from 'framer-motion';
import { WordImage } from '@/components/ui/WordImage';
import { WrongAnswerFeedback } from '@/components/ui/WrongAnswerFeedback';
import { isAuthenticated } from '@/lib/auth';
import { normalizeCategory } from '@/lib/categories';
import { getDisplayMeaning } from '@/lib/displayText';
import { getVocabGameNotes } from '@/lib/notes';
import { playWordAudio } from '@/lib/playWord';
import { playErrorSfx, playSuccessSfx } from '@/lib/sfx';
import { buildQuizOptions } from '@/lib/quiz-options';
import { shuffleArray } from '@/lib/shuffle';
import { useAutoPlayWord } from '@/lib/useAutoPlayWord';
import { ArrowLeft, Brain, Clock, Ear, HelpCircle, ImageIcon, Link2, Shuffle, Trophy, Volume2, X, Zap } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const MEMORY_MISMATCH_MS = 2000;
const MEMORY_MATCH_CELEBRATION_MS = 1200;
const MEMORY_PAIR_CAP = 8;
const MATCHING_WORD_CAP = 12;

function gameTimeForWordCount(count: number): number {
  return Math.min(900, Math.max(180, 120 + count * 6));
}

function wordsDeckKey(words: Word[]): string {
  return words.map((w) => w.id).join(',');
}

interface Word {
  id: string;
  lemma: string;
  phonetic: string;
  translation: string;
  partOfSpeech: string;
  exampleNative: string;
  exampleTranslation: string;
  difficultyLevel: number;
  category: string;
  audioFile?: string;
  videoFile?: string;
  imageFile?: string;
  imageEmoji?: string;
}

interface VocabularyGameProps {
  words: Word[];
  language: string;
  onComplete: (score: number, totalWords: number) => void;
  onClose: () => void;
}

type GameType = 'memory' | 'matching' | 'listenPick' | 'quiz' | 'scramble' | 'pictureQuiz' | 'speedRound';

const GAME_META: Record<GameType, { title: string; description: string; icon: typeof Brain }> = {
  memory: { title: 'Memory Match', description: 'Match words with translations', icon: Brain },
  matching: { title: 'Word Matching', description: 'Tap word, then tap its meaning', icon: Link2 },
  listenPick: { title: 'Listen & Pick', description: 'Hear the word, choose the meaning', icon: Ear },
  quiz: { title: 'Quick Quiz', description: 'Test what you know', icon: HelpCircle },
  scramble: { title: 'Word Scramble', description: 'Unscramble letters to spell the word', icon: Shuffle },
  pictureQuiz: { title: 'Picture Quiz', description: 'See the image, pick the word', icon: ImageIcon },
  speedRound: { title: 'Speed Round', description: 'Fast tap — correct or skip!', icon: Zap },
};

export default function VocabularyGame({ words, language, onComplete, onClose }: VocabularyGameProps) {
  const [authChecked, setAuthChecked] = useState(false);

  const displayWords = useMemo(
    () =>
      words.map((w) => ({
        ...w,
        translation: getDisplayMeaning(w.translation),
      })),
    [words]
  );

  useEffect(() => {
    if (!isAuthenticated()) {
      onClose();
      return;
    }
    setAuthChecked(true);
  }, [onClose]);

  const [currentGame, setCurrentGame] = useState<GameType>('memory');
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [gameWords, setGameWords] = useState<Word[]>([]);
  const scoreRef = useRef(score);
  const gameWordsRef = useRef(gameWords);

  scoreRef.current = score;
  gameWordsRef.current = gameWords;

  const endGame = useCallback(() => {
    setGameState('completed');
    onComplete(scoreRef.current, gameWordsRef.current.length);
  }, [onComplete]);

  const goBackToMenu = useCallback(() => {
    setGameState('menu');
    setScore(0);
    setTimeLeft(180);
  }, []);

  const sessionWordCount = displayWords.length;

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, endGame]);

  const startGame = (gameType: GameType) => {
    if (displayWords.length < 1) return;

    setCurrentGame(gameType);
    setGameState('playing');
    setScore(0);

    const shuffled = shuffleArray(displayWords);
    setGameWords(shuffled);
    setTimeLeft(gameTimeForWordCount(shuffled.length));
  };

  const gameWordsDisplay = useMemo(() => gameWords, [gameWords]);

  const addScore = (points: number) => {
    setScore(prev => prev + points);
  };

  const headerTitle =
    gameState === 'menu'
      ? 'Vocabulary Games'
      : gameState === 'completed'
      ? 'Results'
      : GAME_META[currentGame].title;

  const renderGameMenu = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-brand-500 uppercase tracking-wide">Practice mode</p>
        <h2 className="text-2xl font-bold text-brand-800">Choose a game</h2>
        <p className="text-brand-600">
          Practice your {language} vocabulary with interactive mini-games.
        </p>
        {sessionWordCount > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-green text-brand-700 text-sm font-medium">
            {sessionWordCount} words ready
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(Object.keys(GAME_META) as GameType[]).map((type) => {
          const meta = GAME_META[type];
          const Icon = meta.icon;
          return (
            <GameCard
              key={type}
              title={meta.title}
              description={meta.description}
              icon={Icon}
              disabled={displayWords.length < 1}
              onClick={() => startGame(type)}
            />
          );
        })}
      </div>
      {displayWords.length < 1 && (
        <p className="text-center text-sm text-brand-600">Add or filter words to play games.</p>
      )}
    </div>
  );

  const renderGame = () => {
    switch (currentGame) {
      case 'memory':
        return <MemoryGame words={gameWordsDisplay} language={language} onScore={addScore} onComplete={endGame} />;
      case 'matching':
        return <MatchingGame words={gameWordsDisplay} language={language} onScore={addScore} onComplete={endGame} />;
      case 'listenPick':
        return <ListenPickGame words={gameWordsDisplay} language={language} onScore={addScore} onComplete={endGame} />;
      case 'quiz':
        return <QuizGame words={gameWordsDisplay} language={language} onScore={addScore} onComplete={endGame} />;
      case 'scramble':
        return <ScrambleGame words={gameWordsDisplay} language={language} onScore={addScore} onComplete={endGame} />;
      case 'pictureQuiz':
        return <PictureQuizGame words={gameWordsDisplay} language={language} onScore={addScore} onComplete={endGame} />;
      case 'speedRound':
        return <SpeedRoundGame words={gameWordsDisplay} language={language} onScore={addScore} onComplete={endGame} />;
      default:
        return null;
    }
  };

  const renderGameCompleted = () => (
    <div className="text-center space-y-6 py-4">
      <div className="mx-auto w-16 h-16 rounded-full bg-pastel-green flex items-center justify-center">
        <Trophy className="w-8 h-8 text-success-600" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-brand-800">Game complete</h2>
        <p className="text-brand-600 mt-1">
          You scored {score} points across {gameWords.length} words.
        </p>
      </div>

      <div className="rounded-2xl border border-brand-200/40 bg-pastel-pink/40 cute-card-texture p-6 max-w-sm mx-auto">
        <div className="text-3xl font-bold text-brand-500">{score}</div>
        <div className="text-sm text-brand-500 mt-1">Total points</div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <button
          type="button"
          onClick={goBackToMenu}
          className="px-6 py-2.5 min-h-[44px] rounded-xl bg-brand-400 text-white font-medium hover:bg-brand-500 transition-colors touch-manipulation"
        >
          Play another game
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 min-h-[44px] rounded-xl border border-brand-200 text-brand-700 font-medium hover:bg-pastel-pink transition-colors touch-manipulation"
        >
          Back to vocabulary
        </button>
      </div>
    </div>
  );

  if (!authChecked) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/30 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Vocabulary games"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-pastel-cream cute-card-texture rounded-2xl shadow-xl border border-brand-200/30 max-w-3xl w-full max-h-[92dvh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex-shrink-0 border-b border-brand-200/40 bg-gradient-to-r from-pastel-pink/60 via-white to-pastel-green/50 px-4 py-3">
          <div className="flex items-center gap-2">
            {gameState !== 'menu' ? (
              <button
                type="button"
                onClick={gameState === 'completed' ? goBackToMenu : goBackToMenu}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-brand-700 hover:bg-pastel-pink/80 transition-colors touch-manipulation"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div className="w-[88px]" aria-hidden="true" />
            )}

            <h1 className="flex-1 text-center text-lg font-semibold text-brand-800 truncate">
              {headerTitle}
            </h1>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close games"
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-brand-500 hover:bg-pastel-pink/80 hover:text-brand-800 transition-colors touch-manipulation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {gameState === 'playing' && (
            <div className="flex items-center justify-center gap-6 mt-2 text-sm text-brand-600">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/70">
                <Clock className="w-4 h-4 text-brand-400" />
                {timeLeft}s left
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/70">
                <Trophy className="w-4 h-4 text-brand-500" />
                {score} pts
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pastel-green/80 text-brand-700 text-xs font-medium">
                {gameWords.length} words
              </span>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 cute-stripes-pink">
          {gameState === 'menu' && renderGameMenu()}
          {gameState === 'playing' && (
            <div key={currentGame} className="min-h-0">
              {renderGame()}
            </div>
          )}
          {gameState === 'completed' && renderGameCompleted()}
        </div>
      </motion.div>
    </div>
  );
}

function GameCard({
  title,
  description,
  icon: Icon,
  onClick,
  disabled,
}: {
  title: string;
  description: string;
  icon: typeof Brain;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group text-left rounded-2xl border border-brand-200/50 bg-white/90 cute-card-texture p-5 shadow-sm hover:border-brand-300 hover:shadow-md transition-all disabled:opacity-50 disabled:pointer-events-none min-h-[88px] touch-manipulation"
    >
      <div className="w-10 h-10 rounded-xl bg-pastel-pink text-brand-500 flex items-center justify-center mb-3 group-hover:bg-pastel-green group-hover:text-success-600 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-semibold text-brand-800 mb-1">{title}</h3>
      <p className="text-sm text-brand-600">{description}</p>
    </button>
  );
}

interface MemoryCard {
  wordId: string;
  text: string;
  face: 'lemma' | 'translation';
}

function MemoryGame({ words, language, onScore, onComplete }: {
  words: Word[];
  language: string;
  onScore: (points: number) => void;
  onComplete: () => void;
}) {
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const deckKey = useMemo(() => wordsDeckKey(words), [words]);
  const pairCount = Math.min(MEMORY_PAIR_CAP, words.length);

  useEffect(() => {
    const selectedWords = shuffleArray(words).slice(0, pairCount);
    const deck: MemoryCard[] = selectedWords.flatMap((word) => [
      { wordId: word.id, text: word.lemma, face: 'lemma' as const },
      { wordId: word.id, text: word.translation, face: 'translation' as const },
    ]);
    setCards(shuffleArray(deck));
    setFlippedIndices([]);
    setMatchedPairs(new Set());
    setIsChecking(false);
  }, [deckKey, pairCount]);

  useEffect(() => {
    if (flippedIndices.length === 0) return;
    const lastIdx = flippedIndices[flippedIndices.length - 1];
    const card = cards[lastIdx];
    if (!card || card.face !== 'lemma') return;
    const word = words.find((w) => w.id === card.wordId);
    playWordAudio(language, card.text, word?.audioFile).catch(() => {});
  }, [flippedIndices, cards, words, language]);

  const handleCardClick = (index: number) => {
    const card = cards[index];
    if (
      isChecking ||
      flippedIndices.length >= 2 ||
      flippedIndices.includes(index) ||
      matchedPairs.has(card.wordId)
    ) {
      return;
    }

    const nextFlipped = [...flippedIndices, index];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setIsChecking(true);
      const [firstIdx, secondIdx] = nextFlipped;
      const first = cards[firstIdx];
      const second = cards[secondIdx];
      const isMatch = first.wordId === second.wordId && first.face !== second.face;

      if (isMatch) {
        onScore(10);
        setTimeout(() => {
          setMatchedPairs((prev) => {
            const next = new Set([...prev, first.wordId]);
            if (next.size === pairCount) {
              setTimeout(onComplete, MEMORY_MATCH_CELEBRATION_MS);
            }
            return next;
          });
          setFlippedIndices([]);
          setIsChecking(false);
        }, MEMORY_MATCH_CELEBRATION_MS);
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
          setIsChecking(false);
        }, MEMORY_MISMATCH_MS);
      }
    }
  };

  if (cards.length === 0) {
    return (
      <div className="text-center text-brand-600 py-8">
        Need at least one word to play Memory Match.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-center text-sm text-brand-600">
        Match each word with its translation — {matchedPairs.size}/{pairCount} pairs found
        {words.length > MEMORY_PAIR_CAP && (
          <span className="block text-xs text-brand-500 mt-0.5">
            Random {pairCount} pairs from {words.length} words
          </span>
        )}
      </p>

      <div className="rounded-2xl border border-brand-200/40 bg-white/80 cute-card-texture p-4 sm:p-5">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
        {cards.map((card, index) => {
          const isFlipped = flippedIndices.includes(index) || matchedPairs.has(card.wordId);
          const isMatched = matchedPairs.has(card.wordId);

          return (
            <button
              type="button"
              key={`${card.wordId}-${card.face}-${index}`}
              onClick={() => handleCardClick(index)}
              disabled={isMatched || isChecking}
              className={`aspect-square rounded-xl transition-all duration-200 touch-manipulation min-h-[72px] ${
                isMatched
                  ? 'bg-success-500 text-white shadow-sm'
                  : isFlipped
                  ? 'bg-white border-2 border-brand-200 text-brand-800 shadow-sm'
                  : 'bg-brand-400 text-white hover:bg-brand-500 shadow-md'
              } flex items-center justify-center text-center p-2 disabled:cursor-default`}
            >
              {isFlipped ? (
                <span className="text-xs sm:text-sm font-medium break-words leading-tight">
                  {card.text}
                </span>
              ) : (
                <span className="text-sm font-semibold tracking-wide opacity-80">?</span>
              )}
            </button>
          );
        })}
      </div>
      </div>
    </div>
  );
}

function MatchingGame({ words, language, onScore, onComplete }: {
  words: Word[];
  language: string;
  onScore: (points: number) => void;
  onComplete: () => void;
}) {
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const [translationSlots, setTranslationSlots] = useState<Array<{ id: string; text: string }>>([]);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);

  const deckKey = useMemo(() => wordsDeckKey(words), [words]);

  useEffect(() => {
    const sessionWords = shuffleArray(words).slice(0, Math.min(MATCHING_WORD_CAP, words.length));
    setShuffledWords(sessionWords);
    setTranslationSlots(shuffleArray(sessionWords.map((w) => ({ id: w.id, text: w.translation }))));
    setSelectedWordId(null);
    setMatchedPairs(new Set());
    setWrongFlash(null);
  }, [deckKey]);

  const sessionSize = shuffledWords.length;

  const tryMatch = (targetWordId: string) => {
    if (!selectedWordId) return;
    if (selectedWordId === targetWordId) {
      setMatchedPairs((prev) => {
        const next = new Set([...prev, targetWordId]);
        if (next.size === sessionSize) {
          setTimeout(onComplete, 1000);
        }
        return next;
      });
      onScore(10);
      setSelectedWordId(null);
      setWrongFlash(null);
      playSuccessSfx();
    } else {
      setWrongFlash(targetWordId);
      playErrorSfx();
      window.setTimeout(() => setWrongFlash(null), 600);
      setSelectedWordId(null);
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-center text-sm text-brand-600">
        Tap a word, then tap its translation ({matchedPairs.size}/{sessionSize} matched)
        {words.length > MATCHING_WORD_CAP && (
          <span className="block text-xs text-brand-500 mt-0.5">
            Random {sessionSize} from {words.length} words
          </span>
        )}
      </p>

      <div className="rounded-2xl border border-brand-200/40 bg-white/80 cute-card-texture p-4 sm:p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-brand-700 text-center">Words</h4>
          {shuffledWords.map((word) => {
            const isMatched = matchedPairs.has(word.id);
            const isSelected = selectedWordId === word.id;
            return (
              <button
                key={word.id}
                type="button"
                disabled={isMatched}
                onClick={() => {
                  if (isMatched) return;
                  setSelectedWordId(word.id);
                  setWrongFlash(null);
                  playWordAudio(language, word.lemma, word.audioFile).catch(() => {});
                }}
                className={`w-full p-3 min-h-[48px] rounded-lg text-center font-medium text-sm touch-manipulation japanese-text korean-text ${
                  isMatched
                    ? 'bg-pastel-green text-success-600 border border-success-200'
                    : isSelected
                    ? 'bg-brand-500 text-white ring-2 ring-brand-300'
                    : 'bg-brand-400 text-white hover:bg-brand-500'
                }`}
              >
                {word.lemma}
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-brand-700 text-center">Translations</h4>
          {translationSlots.map((slot) => {
            const isMatched = matchedPairs.has(slot.id);
            const isWrong = wrongFlash === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                disabled={isMatched || !selectedWordId}
                onClick={() => tryMatch(slot.id)}
                className={`w-full p-3 min-h-[48px] rounded-lg border-2 text-center font-medium text-sm touch-manipulation ${
                  isMatched
                    ? 'border-success-200 bg-pastel-green/60 text-success-600'
                    : isWrong
                    ? 'border-red-400 bg-red-50 text-red-800'
                    : selectedWordId
                    ? 'border-brand-300 bg-pastel-pink/50 text-brand-800 hover:bg-pastel-pink'
                    : 'border-dashed border-brand-200 text-brand-700 bg-pastel-cream/80'
                }`}
              >
                {slot.text}
              </button>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
}

function ListenPickGame({ words, language, onScore, onComplete }: {
  words: Word[];
  language: string;
  onScore: (points: number) => void;
  onComplete: () => void;
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [awaitingRetry, setAwaitingRetry] = useState(false);
  const [userNotes, setUserNotes] = useState('');
  const [hasSavedNotes, setHasSavedNotes] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const currentWord = words[currentQuestionIndex];
  useAutoPlayWord(language, currentWord?.lemma, currentWord?.audioFile, !!currentWord && !showResult);

  const deckKey = useMemo(() => wordsDeckKey(words), [words]);
  const [options, setOptions] = useState<string[]>([]);
  useEffect(() => {
    if (!currentWord) return;
    const pool = words.filter((w) => w.id !== currentWord.id).map((w) => w.translation);
    setOptions(buildQuizOptions(currentWord.translation, pool));
  }, [currentQuestionIndex, deckKey, currentWord?.id, currentWord?.translation]);

  const handleAnswerSelect = (answer: string) => {
    if ((showResult && !awaitingRetry) || !currentWord) return;

    setSelectedAnswer(answer);

    if (answer === currentWord.translation) {
      setCorrectAnswers((prev) => prev + 1);
      onScore(10);
      setShowResult(true);
      setAwaitingRetry(false);
      playSuccessSfx();
    } else {
      const notes = getVocabGameNotes(language, currentWord.lemma, currentWord.id);
      setUserNotes(notes.trim());
      setHasSavedNotes(!!notes.trim());
      setShowResult(true);
      setAwaitingRetry(true);
      playErrorSfx();
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    setAwaitingRetry(false);
    setUserNotes('');
    setHasSavedNotes(false);
  };

  const handleGiveUp = () => {
    setAwaitingRetry(false);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < words.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowResult(false);
      setSelectedAnswer(null);
      setAwaitingRetry(false);
      setUserNotes('');
      setHasSavedNotes(false);
    } else {
      onComplete();
    }
  };

  if (!currentWord) {
    return null;
  }

  return (
    <div className="space-y-5">
      <p className="text-center text-sm text-brand-600">
        Round {currentQuestionIndex + 1} of {words.length} — listen and pick the meaning
      </p>

      <div className="rounded-2xl border border-brand-200/40 bg-white/80 cute-card-texture p-5 sm:p-6">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-pastel-pink flex items-center justify-center mb-4">
            <Volume2 className="w-8 h-8 text-brand-500 animate-pulse" />
          </div>
          <button
            type="button"
            onClick={() => playWordAudio(language, currentWord.lemma, currentWord.audioFile)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-3 rounded-full bg-white border border-brand-200 text-brand-700 text-xs font-medium hover:bg-pastel-pink"
          >
            <Volume2 className="w-3.5 h-3.5" />
            Play again
          </button>
          {showResult ? (
            <>
              <p className="text-2xl font-semibold text-brand-800 japanese-text korean-text mb-1">
                {currentWord.lemma}
              </p>
              {currentWord.phonetic && (
                <p className="text-sm text-brand-500">{currentWord.phonetic}</p>
              )}
            </>
          ) : (
            <p className="text-sm text-brand-500">What did you hear?</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {options.map((option, optionIndex) => (
            <button
              type="button"
              key={`listen-${currentQuestionIndex}-${optionIndex}`}
              onClick={() => handleAnswerSelect(option)}
              disabled={showResult && !awaitingRetry}
              className={`p-3 sm:p-4 min-h-[48px] rounded-lg text-center font-medium text-sm transition-colors touch-manipulation ${
                showResult && !awaitingRetry
                  ? option === currentWord.translation
                    ? 'bg-success-500 text-white'
                    : option === selectedAnswer
                    ? 'bg-red-400 text-white'
                    : 'bg-white text-brand-500 border border-brand-200/50'
                  : showResult && awaitingRetry && option === selectedAnswer
                  ? 'bg-red-400 text-white'
                  : 'bg-white text-brand-800 border border-brand-200/50 hover:border-brand-300 hover:bg-pastel-pink'
              } disabled:cursor-default`}
            >
              {option}
            </button>
          ))}
        </div>

        {showResult && (
          <div className="text-center mt-5 space-y-3">
            {selectedAnswer === currentWord.translation ? (
              <>
                <p className="font-medium text-success-600">Correct!</p>
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-5 py-2 min-h-[44px] rounded-lg bg-brand-400 text-white text-sm font-medium hover:bg-brand-500 transition-colors touch-manipulation"
                >
                  {currentQuestionIndex < words.length - 1 ? 'Next' : 'Finish'}
                </button>
              </>
            ) : awaitingRetry ? (
              <WrongAnswerFeedback
                hasNotes={hasSavedNotes}
                notes={userNotes}
                language={language}
                nativeWord={currentWord.lemma}
                wordId={currentWord.id}
                onRetry={handleTryAgain}
                onSkip={handleGiveUp}
              />
            ) : (
              <>
                <p className="font-medium text-red-700">
                  Answer: <strong>{currentWord.translation}</strong>
                </p>
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-5 py-2 min-h-[44px] rounded-lg bg-brand-400 text-white text-sm font-medium hover:bg-brand-500 transition-colors touch-manipulation"
                >
                  {currentQuestionIndex < words.length - 1 ? 'Next' : 'Finish'}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <p className="text-center text-sm text-brand-600">
        {correctAnswers} correct so far
      </p>
    </div>
  );
}

function QuizGame({ words, language, onScore, onComplete }: {
  words: Word[];
  language: string;
  onScore: (points: number) => void;
  onComplete: () => void;
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [awaitingRetry, setAwaitingRetry] = useState(false);
  const [userNotes, setUserNotes] = useState('');
  const [hasSavedNotes, setHasSavedNotes] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const currentWord = words[currentQuestionIndex];
  useAutoPlayWord(language, currentWord?.lemma, currentWord?.audioFile, !!currentWord && !showResult);

  const deckKey = useMemo(() => wordsDeckKey(words), [words]);
  const [options, setOptions] = useState<string[]>([]);
  useEffect(() => {
    if (!currentWord) return;
    const pool = words.filter((w) => w.id !== currentWord.id).map((w) => w.translation);
    setOptions(buildQuizOptions(currentWord.translation, pool));
  }, [currentQuestionIndex, deckKey, currentWord?.id, currentWord?.translation]);

  const handleAnswerSelect = (answer: string) => {
    if ((showResult && !awaitingRetry) || !currentWord) return;

    setSelectedAnswer(answer);

    if (answer === currentWord.translation) {
      setCorrectAnswers((prev) => prev + 1);
      onScore(10);
      setShowResult(true);
      setAwaitingRetry(false);
      playSuccessSfx();
    } else {
      const notes = getVocabGameNotes(language, currentWord.lemma, currentWord.id);
      setUserNotes(notes.trim());
      setHasSavedNotes(!!notes.trim());
      setShowResult(true);
      setAwaitingRetry(true);
      playErrorSfx();
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    setAwaitingRetry(false);
    setUserNotes('');
    setHasSavedNotes(false);
  };

  const handleGiveUp = () => {
    setAwaitingRetry(false);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < words.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowResult(false);
      setSelectedAnswer(null);
      setAwaitingRetry(false);
      setUserNotes('');
      setHasSavedNotes(false);
    } else {
      onComplete();
    }
  };

  if (!currentWord) {
    return null;
  }

  return (
    <div className="space-y-5">
      <p className="text-center text-sm text-brand-600">
        Question {currentQuestionIndex + 1} of {words.length}
      </p>

      <div className="rounded-2xl border border-brand-200/40 bg-white/80 cute-card-texture p-5 sm:p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <WordImage
              english={currentWord.translation}
              category={normalizeCategory(currentWord.category)}
              wordId={currentWord.id}
              nativeText={currentWord.lemma}
              language={language}
              size="md"
            />
          </div>
          <button
            type="button"
            onClick={() => playWordAudio(language, currentWord.lemma, currentWord.audioFile)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-2 rounded-full bg-pastel-pink text-brand-700 text-xs font-medium hover:bg-pastel-green/60"
          >
            <Volume2 className="w-3.5 h-3.5" />
            Listen
          </button>
          <h4 className="text-xl font-semibold text-brand-800 mb-1 japanese-text korean-text">
            What does &ldquo;{currentWord.lemma}&rdquo; mean?
          </h4>
          {currentWord.phonetic && (
            <p className="text-sm text-brand-500">{currentWord.phonetic}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {options.map((option, optionIndex) => (
            <button
              type="button"
              key={`quiz-${currentQuestionIndex}-${optionIndex}`}
              onClick={() => handleAnswerSelect(option)}
              disabled={showResult && !awaitingRetry}
              className={`p-3 sm:p-4 min-h-[48px] rounded-lg text-center font-medium text-sm transition-colors touch-manipulation ${
                showResult && !awaitingRetry
                  ? option === currentWord.translation
                    ? 'bg-success-500 text-white'
                    : option === selectedAnswer
                    ? 'bg-red-400 text-white'
                    : 'bg-white text-brand-500 border border-brand-200/50'
                  : showResult && awaitingRetry && option === selectedAnswer
                  ? 'bg-red-400 text-white'
                  : 'bg-white text-brand-800 border border-brand-200/50 hover:border-brand-300 hover:bg-pastel-pink'
              } disabled:cursor-default`}
            >
              {option}
            </button>
          ))}
        </div>

        {showResult && (
          <div className="text-center mt-5 space-y-3">
            {selectedAnswer === currentWord.translation ? (
              <>
                <p className="font-medium text-success-600">Correct!</p>
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-5 py-2 min-h-[44px] rounded-lg bg-brand-400 text-white text-sm font-medium hover:bg-brand-500 transition-colors touch-manipulation"
                >
                  {currentQuestionIndex < words.length - 1 ? 'Next question' : 'Finish quiz'}
                </button>
              </>
            ) : awaitingRetry ? (
              <WrongAnswerFeedback
                hasNotes={hasSavedNotes}
                notes={userNotes}
                language={language}
                nativeWord={currentWord.lemma}
                wordId={currentWord.id}
                onRetry={handleTryAgain}
                onSkip={handleGiveUp}
              />
            ) : (
              <>
                <p className="font-medium text-red-700">
                  Answer: <strong>{currentWord.translation}</strong>
                </p>
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-5 py-2 min-h-[44px] rounded-lg bg-brand-400 text-white text-sm font-medium hover:bg-brand-500 transition-colors touch-manipulation"
                >
                  {currentQuestionIndex < words.length - 1 ? 'Next question' : 'Finish quiz'}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <p className="text-center text-sm text-brand-600">
        {correctAnswers} correct so far
      </p>
    </div>
  );
}

function scrambleWord(text: string): string {
  const chars = [...text];
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  const scrambled = chars.join('');
  return scrambled === text && text.length > 1 ? scrambleWord(text) : scrambled;
}

function ScrambleGame({ words, language, onScore, onComplete }: {
  words: Word[];
  language: string;
  onScore: (points: number) => void;
  onComplete: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [scrambled, setScrambled] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const current = words[index];

  const deckKey = useMemo(() => wordsDeckKey(words), [words]);

  useEffect(() => {
    const word = words[index];
    if (!word) return;
    setScrambled(scrambleWord(word.lemma));
    setGuess('');
    setFeedback(null);
    playWordAudio(language, word.lemma, word.audioFile).catch(() => {});
  }, [index, deckKey, language]);

  if (!current) return null;

  const checkAnswer = () => {
    if (guess.trim() === current.lemma) {
      onScore(15);
      setFeedback('Correct!');
      playSuccessSfx();
      setTimeout(() => {
        if (index < words.length - 1) setIndex((i) => i + 1);
        else onComplete();
      }, 800);
    } else {
      setFeedback(`Try again! Hint: ${current.translation}`);
      playErrorSfx();
    }
  };

  return (
    <div className="space-y-5 max-w-md mx-auto">
      <p className="text-center text-sm text-brand-600">
        Word {index + 1} of {words.length} — unscramble the letters
      </p>
      <div className="rounded-2xl border border-brand-200/40 bg-white/80 cute-card-texture p-5 sm:p-6 text-center space-y-4">
        <p className="text-2xl font-bold tracking-widest text-brand-700 japanese-text korean-text">{scrambled}</p>
        <p className="text-sm text-brand-500">Meaning: {current.translation}</p>
        <input
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
          className="w-full px-4 py-3 rounded-xl border border-brand-200 bg-white text-center japanese-text korean-text focus:outline-none focus:ring-2 focus:ring-brand-300"
          placeholder="Type the word..."
        />
        <button
          type="button"
          onClick={checkAnswer}
          className="px-5 py-2 min-h-[44px] rounded-lg bg-brand-400 text-white text-sm font-medium hover:bg-brand-500 touch-manipulation"
        >
          Check
        </button>
        {feedback && <p className="text-sm font-medium text-success-600">{feedback}</p>}
      </div>
    </div>
  );
}

function PictureQuizGame({ words, language, onScore, onComplete }: {
  words: Word[];
  language: string;
  onScore: (points: number) => void;
  onComplete: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const current = words[index];
  const deckKey = useMemo(() => wordsDeckKey(words), [words]);
  const [options, setOptions] = useState<string[]>([]);
  useEffect(() => {
    if (!current) return;
    const pool = words.filter((w) => w.id !== current.id).map((w) => w.lemma);
    setOptions(buildQuizOptions(current.lemma, pool));
  }, [index, deckKey, current?.id, current?.lemma]);

  if (!current) return null;

  const pick = (lemma: string) => {
    if (showResult) return;
    setSelected(lemma);
    setShowResult(true);
    if (lemma === current.lemma) {
      onScore(12);
      playSuccessSfx();
    } else {
      playErrorSfx();
    }
  };

  const next = () => {
    if (index < words.length - 1) {
      setIndex((i) => i + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      onComplete();
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-center text-sm text-brand-600">Round {index + 1} of {words.length}</p>
      <div className="rounded-2xl border border-brand-200/40 bg-white/80 cute-card-texture p-5 sm:p-6">
        <div className="flex flex-col items-center gap-3 mb-5">
          <WordImage english={current.translation} category={normalizeCategory(current.category)} wordId={current.id} nativeText={current.lemma} language={language} size="lg" />
          <p className="text-lg font-semibold text-brand-800">What is this word?</p>
          <p className="text-sm text-brand-500">{current.translation}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt, optionIndex) => (
            <button
              key={`pic-${index}-${optionIndex}`}
              type="button"
              onClick={() => pick(opt)}
              disabled={showResult}
              className={`p-4 min-h-[48px] rounded-lg text-sm font-medium touch-manipulation japanese-text korean-text ${
                showResult
                  ? opt === current.lemma ? 'bg-success-500 text-white' : opt === selected ? 'bg-red-400 text-white' : 'bg-white border border-brand-200/50 text-brand-500'
                  : 'bg-white border border-brand-200/50 hover:border-brand-300 hover:bg-pastel-pink'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {showResult && (
          <div className="text-center mt-4">
            <button type="button" onClick={next} className="px-5 py-2 rounded-lg bg-brand-400 text-white text-sm font-medium">
              {index < words.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SpeedRoundGame({ words, language, onScore, onComplete }: {
  words: Word[];
  language: string;
  onScore: (points: number) => void;
  onComplete: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8);
  const [options, setOptions] = useState<string[]>([]);
  const advancingRef = useRef(false);

  const current = words[index];
  useAutoPlayWord(language, current?.lemma, current?.audioFile, !!current);

  const deckKey = useMemo(() => wordsDeckKey(words), [words]);

  useEffect(() => {
    if (!current) return;
    const pool = words.filter((w) => w.id !== current.id).map((w) => w.translation);
    setOptions(buildQuizOptions(current.translation, pool));
    setTimeLeft(8);
    advancingRef.current = false;
  }, [index, deckKey, current?.id, current?.translation]);

  useEffect(() => {
    if (!current) return;
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [index, current?.id]);

  useEffect(() => {
    if (timeLeft !== 0 || !current || advancingRef.current) return;
    advancingRef.current = true;
    if (index < words.length - 1) {
      setIndex((i) => i + 1);
    } else {
      onComplete();
    }
  }, [timeLeft, index, words.length, onComplete, current]);

  if (!current) return null;

  const answer = (translation: string) => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    if (translation === current.translation) {
      onScore(8);
      setRoundScore((s) => s + 1);
      playSuccessSfx();
    } else {
      playErrorSfx();
    }
    if (index < words.length - 1) {
      setIndex((i) => i + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="space-y-5 max-w-md mx-auto">
      <p className="text-center text-sm text-brand-600">
        Speed round · {index + 1}/{words.length} · {roundScore} correct · {timeLeft}s
      </p>
      <div className="rounded-2xl border border-brand-200/40 bg-white/80 cute-card-texture p-5 sm:p-6 text-center">
        <p className="text-3xl font-bold text-brand-700 japanese-text korean-text mb-2">{current.lemma}</p>
        <button
          type="button"
          onClick={() => playWordAudio(language, current.lemma, current.audioFile)}
          className="inline-flex items-center gap-1 text-xs text-brand-500 mb-4 min-h-[44px] px-3 touch-manipulation"
        >
          <Volume2 className="w-3.5 h-3.5" /> Replay
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {options.map((opt, optionIndex) => (
            <button
              key={`speed-${index}-${optionIndex}`}
              type="button"
              onClick={() => answer(opt)}
              className="p-3 min-h-[48px] rounded-lg bg-white border border-brand-200/50 text-sm font-medium hover:bg-pastel-pink hover:border-brand-300 touch-manipulation"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
