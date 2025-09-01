'use client';

import { motion } from 'framer-motion';
import { Clock, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

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
  imageFile?: string;
}

interface VocabularyGameProps {
  words: Word[];
  language: string;
  onComplete: (score: number, totalWords: number) => void;
  onClose: () => void;
}

type GameType = 'memory' | 'matching' | 'wordSearch' | 'quiz';

export default function VocabularyGame({ words, language, onComplete, onClose }: VocabularyGameProps) {
  const [currentGame, setCurrentGame] = useState<GameType>('memory');
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameWords, setGameWords] = useState<Word[]>([]);

  useEffect(() => {
    if (gameState === 'playing') {
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
    }
  }, [gameState]);

  const startGame = (gameType: GameType) => {
    setCurrentGame(gameType);
    setGameState('playing');
    setScore(0);
    setTimeLeft(60);
    
    // Select random words for the game
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setGameWords(shuffled.slice(0, Math.min(10, words.length)));
  };

  const endGame = () => {
    setGameState('completed');
    onComplete(score, gameWords.length);
  };

  const addScore = (points: number) => {
    setScore(prev => prev + points);
  };

  const renderGameMenu = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="space-y-4">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          🎮
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          Choose Your Adventure!
        </h2>
        <p className="text-gray-600 text-lg">
          Select a game to practice your {language} vocabulary
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <GameCard
          title="Memory Match"
          icon="🃏"
          description="Find matching pairs"
          onClick={() => startGame('memory')}
          color="from-blue-400 to-cyan-400"
        />
        <GameCard
          title="Word Matching"
          icon="🎯"
          description="Connect words to meanings"
          onClick={() => startGame('matching')}
          color="from-green-400 to-emerald-400"
        />
        <GameCard
          title="Word Search"
          icon="🔍"
          description="Find hidden words"
          onClick={() => startGame('wordSearch')}
          color="from-purple-400 to-pink-400"
        />
        <GameCard
          title="Quick Quiz"
          icon="❓"
          description="Test your knowledge"
          onClick={() => startGame('quiz')}
          color="from-orange-400 to-red-400"
        />
      </div>
    </motion.div>
  );

  const renderGame = () => {
    switch (currentGame) {
      case 'memory':
        return <MemoryGame words={gameWords} onScore={addScore} onComplete={endGame} />;
      case 'matching':
        return <MatchingGame words={gameWords} onScore={addScore} onComplete={endGame} />;
      case 'wordSearch':
        return <WordSearchGame words={gameWords} onScore={addScore} onComplete={endGame} />;
      case 'quiz':
        return <QuizGame words={gameWords} onScore={addScore} onComplete={endGame} />;
      default:
        return null;
    }
  };

  const renderGameCompleted = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.5 }}
        className="text-8xl mb-4"
      >
        {score >= gameWords.length * 0.8 ? '🎉' : '😊'}
      </motion.div>
      
      <h2 className="text-3xl font-bold text-gray-800">
        Game Complete!
      </h2>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <span className="text-2xl font-bold text-gray-800">
            {score} / {gameWords.length}
          </span>
        </div>
        
        <div className="text-lg text-gray-600 mb-4">
          {score >= gameWords.length * 0.8 
            ? 'Excellent work! You\'re a vocabulary master!' 
            : 'Good job! Keep practicing to improve!'}
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setGameState('menu')}
            className="px-6 py-3 bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            Play Again
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-pink-400 to-purple-400 text-white p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Vocabulary Games</h1>
            <button
              onClick={onClose}
              className="text-white hover:text-pink-200 transition-colors"
            >
              ✕
            </button>
          </div>
          
          {gameState === 'playing' && (
            <div className="flex items-center justify-between mt-2 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{timeLeft}s</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4" />
                <span>{score} points</span>
              </div>
            </div>
          )}
        </div>

        {/* Game Content */}
        <div className="p-6">
          {gameState === 'menu' && renderGameMenu()}
          {gameState === 'playing' && renderGame()}
          {gameState === 'completed' && renderGameCompleted()}
        </div>
      </motion.div>
    </div>
  );
}

// Game Card Component
function GameCard({ title, icon, description, onClick, color }: {
  title: string;
  icon: string;
  description: string;
  onClick: () => void;
  color: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`bg-gradient-to-br ${color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-left`}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </motion.button>
  );
}

// Memory Game Component
function MemoryGame({ words, onScore, onComplete }: {
  words: Word[];
  onScore: (points: number) => void;
  onComplete: () => void;
}) {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [gameWords, setGameWords] = useState<Array<{ word: Word; id: number }>>([]);

  useEffect(() => {
    // Create pairs of cards
    const pairs = words.flatMap((word, index) => [
      { word, id: index * 2 },
      { word, id: index * 2 + 1 }
    ]);
    setGameWords(pairs.sort(() => Math.random() - 0.5));
  }, [words]);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(id) || matchedPairs.has(gameWords[id].word.id)) {
      return;
    }

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards;
      if (gameWords[first].word.id === gameWords[second].word.id) {
        // Match found
        setMatchedPairs(prev => new Set([...prev, gameWords[first].word.id]));
        onScore(10);
        
        if (matchedPairs.size + 1 === words.length) {
          setTimeout(onComplete, 1000);
        }
      }
      
      setTimeout(() => setFlippedCards([]), 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Memory Match</h3>
        <p className="text-gray-600">Find matching pairs of words and translations</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {gameWords.map(({ word, id }) => {
          const isFlipped = flippedCards.includes(id) || matchedPairs.has(word.id);
          const isMatched = matchedPairs.has(word.id);

          return (
            <motion.div
              key={id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(id)}
              className={`aspect-square rounded-xl shadow-lg cursor-pointer transition-all duration-300 ${
                isMatched ? 'bg-green-400' : isFlipped ? 'bg-white' : 'bg-gradient-to-br from-pink-400 to-purple-400'
              } flex items-center justify-center text-center p-2`}
            >
              {isFlipped ? (
                <div className="text-sm font-medium text-gray-800">
                  {id % 2 === 0 ? word.lemma : word.translation}
                </div>
              ) : (
                <div className="text-2xl">🃏</div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Matching Game Component
function MatchingGame({ words, onScore, onComplete }: {
  words: Word[];
  onScore: (points: number) => void;
  onComplete: () => void;
}) {
  const [draggedWord, setDraggedWord] = useState<Word | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const [shuffledTranslations, setShuffledTranslations] = useState<string[]>([]);

  useEffect(() => {
    setShuffledWords([...words].sort(() => Math.random() - 0.5));
    setShuffledTranslations([...words].map(w => w.translation).sort(() => Math.random() - 0.5));
  }, [words]);

  const handleDragStart = (word: Word) => {
    setDraggedWord(word);
  };

  const handleDrop = (translation: string) => {
    if (draggedWord && draggedWord.translation === translation) {
      setMatchedPairs(prev => new Set([...prev, draggedWord.id]));
      onScore(10);
      
      if (matchedPairs.size + 1 === words.length) {
        setTimeout(onComplete, 1000);
      }
    }
    setDraggedWord(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Word Matching</h3>
        <p className="text-gray-600">Drag words to their correct translations</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Words */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-700 text-center">Words</h4>
          {shuffledWords.map((word) => {
            const isMatched = matchedPairs.has(word.id);
            return (
              <motion.div
                key={word.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                draggable={!isMatched}
                onDragStart={() => !isMatched && handleDragStart(word)}
                className={`p-4 rounded-lg shadow-md cursor-grab active:cursor-grabbing ${
                  isMatched ? 'bg-green-400 text-white' : 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white'
                } text-center font-medium`}
              >
                {word.lemma}
              </motion.div>
            );
          })}
        </div>

        {/* Translations */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-700 text-center">Translations</h4>
          {shuffledTranslations.map((translation, index) => (
            <motion.div
              key={index}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(translation);
              }}
              onDragOver={(e) => e.preventDefault()}
              className="p-4 rounded-lg shadow-md border-2 border-dashed border-gray-300 text-center font-medium text-gray-700 min-h-[60px] flex items-center justify-center"
            >
              {translation}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Word Search Game Component
function WordSearchGame({ words, onScore, onComplete }: {
  words: Word[];
  onScore: (points: number) => void;
  onComplete: () => void;
}) {
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [grid, setGrid] = useState<string[][]>([]);
  const [gameWords, setGameWords] = useState<Word[]>([]);

  useEffect(() => {
    // Create a word search grid
    const gridSize = 15;
    const newGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    
    // Place words in the grid
    const wordsToPlace = words.slice(0, 5); // Limit to 5 words for simplicity
    setGameWords(wordsToPlace);
    
    wordsToPlace.forEach(word => {
      let placed = false;
      while (!placed) {
        const x = Math.floor(Math.random() * gridSize);
        const y = Math.floor(Math.random() * gridSize);
        const direction = Math.floor(Math.random() * 8); // 8 directions
        
        if (canPlaceWord(grid, word.lemma, x, y, direction)) {
          placeWord(grid, word.lemma, x, y, direction);
          placed = true;
        }
      }
    });
    
    // Fill remaining cells with random letters
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (grid[i][j] === '') {
          grid[i][j] = String.fromCharCode(97 + Math.floor(Math.random() * 26));
        }
      }
    }
    
    setGrid([...grid]);
  }, [words]);

  const canPlaceWord = (grid: string[][], word: string, x: number, y: number, direction: number): boolean => {
    const dx = [0, 1, 1, 1, 0, -1, -1, -1];
    const dy = [-1, -1, 0, 1, 1, 1, 0, -1];
    
    for (let i = 0; i < word.length; i++) {
      const newX = x + i * dx[direction];
      const newY = y + i * dy[direction];
      
      if (newX < 0 || newX >= grid.length || newY < 0 || newY >= grid[0].length) {
        return false;
      }
      
      if (grid[newX][newY] !== '' && grid[newX][newY] !== word[i]) {
        return false;
      }
    }
    
    return true;
  };

  const placeWord = (grid: string[][], word: string, x: number, y: number, direction: number) => {
    const dx = [0, 1, 1, 1, 0, -1, -1, -1];
    const dy = [-1, -1, 0, 1, 1, 1, 0, -1];
    
    for (let i = 0; i < word.length; i++) {
      const newX = x + i * dx[direction];
      const newY = y + i * dy[direction];
      grid[newX][newY] = word[i];
    }
  };

  const handleCellClick = (x: number, y: number) => {
    // Simple word finding logic - check if clicked cell is part of a word
    gameWords.forEach(word => {
      if (grid[x][y] === word.lemma[0] && !foundWords.has(word.id)) {
        setFoundWords(prev => new Set([...prev, word.id]));
        onScore(10);
        
        if (foundWords.size + 1 === gameWords.length) {
          setTimeout(onComplete, 1000);
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Word Search</h3>
        <p className="text-gray-600">Find the hidden words in the grid</p>
      </div>

      <div className="flex justify-center">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${grid.length}, 1fr)` }}>
          {grid.map((row, x) =>
            row.map((cell, y) => (
              <button
                key={`${x}-${y}`}
                onClick={() => handleCellClick(x, y)}
                className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 border border-gray-200 rounded text-sm font-medium hover:bg-gradient-to-br hover:from-purple-200 hover:to-pink-200 transition-colors"
              >
                {cell}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">Words to Find:</h4>
        <div className="flex flex-wrap justify-center gap-2">
          {gameWords.map(word => (
            <span
              key={word.id}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                foundWords.has(word.id)
                  ? 'bg-green-400 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {word.lemma}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Quiz Game Component
function QuizGame({ words, onScore, onComplete }: {
  words: Word[];
  onScore: (points: number) => void;
  onComplete: () => void;
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const generateOptions = (correctWord: Word, allWords: Word[]): string[] => {
    const correctAnswer = correctWord.translation;
    const otherAnswers = allWords
      .filter(w => w.id !== correctWord.id)
      .map(w => w.translation)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const allOptions = [correctAnswer, ...otherAnswers];
    return allOptions.sort(() => Math.random() - 0.5);
  };

  const currentWord = words[currentQuestionIndex];
  const options = generateOptions(currentWord, words);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === currentWord.translation) {
      setCorrectAnswers(prev => prev + 1);
      onScore(10);
    }
    
    setTimeout(() => {
      setShowResult(false);
      setSelectedAnswer(null);
      
      if (currentQuestionIndex < words.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        onComplete();
      }
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Quick Quiz</h3>
        <p className="text-gray-600">Question {currentQuestionIndex + 1} of {words.length}</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-lg">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">❓</div>
          <h4 className="text-xl font-semibold text-gray-800 mb-2">
            What does "{currentWord.lemma}" mean?
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            {currentWord.phonetic && `(${currentWord.phonetic})`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswerSelect(option)}
              disabled={showResult}
              className={`p-4 rounded-lg shadow-md text-center font-medium transition-all duration-300 ${
                showResult
                  ? option === currentWord.translation
                    ? 'bg-green-400 text-white'
                    : option === selectedAnswer && option !== currentWord.translation
                    ? 'bg-red-400 text-white'
                    : 'bg-gray-200 text-gray-600'
                  : 'bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-blue-300'
              }`}
            >
              {option}
            </motion.button>
          ))}
        </div>

        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-4"
          >
            <div className="text-2xl mb-2">
              {selectedAnswer === currentWord.translation ? '✅' : '❌'}
            </div>
            <p className="text-gray-700">
              {selectedAnswer === currentWord.translation 
                ? 'Correct!' 
                : `The correct answer is "${currentWord.translation}"`}
            </p>
          </motion.div>
        )}
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="text-lg font-semibold text-gray-700">
            {correctAnswers} / {currentQuestionIndex + 1} correct
          </span>
        </div>
      </div>
    </div>
  );
}
