'use client';

import VocabularyGame from '@/components/game/VocabularyGame';
import { motion } from 'framer-motion';
import { Image, Play, Star, Target, Volume2, Zap } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
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

interface WordProgress {
  status: 'not_started' | 'learning' | 'learned';
  lastSeenAt?: string;
  correctStreak: number;
  totalAttempts: number;
  totalCorrect: number;
}

const languageNames = {
  es: 'Spanish',
  ko: 'Korean', 
  fr: 'French',
  he: 'Hebrew',
  en: 'English'
};

// Sample vocabulary data - in production this would come from the database
const sampleVocabulary: Record<string, Word[]> = {
  ko: [
    {
      id: 'ko_1',
      lemma: '안녕하세요',
      phonetic: 'annyeonghaseyo',
      translation: 'Hello',
      partOfSpeech: 'INTERJECTION',
      exampleNative: '안녕하세요, 만나서 반가워요',
      exampleTranslation: 'Hello, nice to meet you',
      difficultyLevel: 1,
      category: 'Basic',
      audioFile: 'hello.mp3',
      imageFile: 'hello_korean_girl.webp'
    },
    {
      id: 'ko_2',
      lemma: '감사합니다',
      phonetic: 'kamsahamnida',
      translation: 'Thank you',
      partOfSpeech: 'INTERJECTION',
      exampleNative: '감사합니다, 정말 고마워요',
      exampleTranslation: 'Thank you, I really appreciate it',
      difficultyLevel: 1,
      category: 'Basic',
      audioFile: 'thank-you.mp3',
      imageFile: 'thank_you_korean_girl.webp'
    },
    {
      id: 'ko_3',
      lemma: '네',
      phonetic: 'ne',
      translation: 'Yes',
      partOfSpeech: 'INTERJECTION',
      exampleNative: '네, 맞습니다',
      exampleTranslation: 'Yes, that\'s correct',
      difficultyLevel: 1,
      category: 'Basic',
      audioFile: 'yes.mp3',
      imageFile: 'yes_korean_girl.webp'
    },
    {
      id: 'ko_4',
      lemma: '아니요',
      phonetic: 'aniyo',
      translation: 'No',
      partOfSpeech: 'INTERJECTION',
      exampleNative: '아니요, 그렇지 않습니다',
      exampleTranslation: 'No, that\'s not right',
      difficultyLevel: 1,
      category: 'Basic',
      audioFile: 'no.mp3',
      imageFile: 'no_korean_girl.webp'
    },
    {
      id: 'ko_5',
      lemma: '사과',
      phonetic: 'sagwa',
      translation: 'Apple',
      partOfSpeech: 'NOUN',
      exampleNative: '사과를 먹고 싶어요',
      exampleTranslation: 'I want to eat an apple',
      difficultyLevel: 2,
      category: 'Food',
      audioFile: 'apple.mp3',
      imageFile: 'apple_korean.webp'
    }
  ],
  es: [
    {
      id: 'es_1',
      lemma: 'hola',
      phonetic: 'ola',
      translation: 'Hello',
      partOfSpeech: 'INTERJECTION',
      exampleNative: '¡Hola! ¿Cómo estás?',
      exampleTranslation: 'Hello! How are you?',
      difficultyLevel: 1,
      category: 'Basic',
      audioFile: 'hola.mp3',
      imageFile: 'hola_spanish.webp'
    },
    {
      id: 'es_2',
      lemma: 'gracias',
      phonetic: 'grasias',
      translation: 'Thank you',
      partOfSpeech: 'INTERJECTION',
      exampleNative: 'Muchas gracias por tu ayuda',
      exampleTranslation: 'Thank you very much for your help',
      difficultyLevel: 1,
      category: 'Basic',
      audioFile: 'gracias.mp3',
      imageFile: 'gracias_spanish.webp'
    }
  ],
  fr: [
    {
      id: 'fr_1',
      lemma: 'bonjour',
      phonetic: 'bonzhur',
      translation: 'Hello',
      partOfSpeech: 'INTERJECTION',
      exampleNative: 'Bonjour, comment allez-vous?',
      exampleTranslation: 'Hello, how are you?',
      difficultyLevel: 1,
      category: 'Basic',
      audioFile: 'bonjour.mp3',
      imageFile: 'bonjour_french.webp'
    },
    {
      id: 'fr_2',
      lemma: 'merci',
      phonetic: 'mersi',
      translation: 'Thank you',
      partOfSpeech: 'INTERJECTION',
      exampleNative: 'Merci beaucoup pour votre aide',
      exampleTranslation: 'Thank you very much for your help',
      difficultyLevel: 1,
      category: 'Basic',
      audioFile: 'merci.mp3',
      imageFile: 'merci_french.webp'
    }
  ],
  he: [
    {
      id: 'he_1',
      lemma: 'שלום',
      phonetic: 'shalom',
      translation: 'Hello',
      partOfSpeech: 'INTERJECTION',
      exampleNative: 'שלום, מה שלומך?',
      exampleTranslation: 'Hello, how are you?',
      difficultyLevel: 1,
      category: 'Basic',
      audioFile: 'shalom.mp3',
      imageFile: 'shalom_hebrew.webp'
    },
    {
      id: 'he_2',
      lemma: 'תודה',
      phonetic: 'toda',
      translation: 'Thank you',
      partOfSpeech: 'INTERJECTION',
      exampleNative: 'תודה רבה על העזרה',
      exampleTranslation: 'Thank you very much for the help',
      difficultyLevel: 1,
      category: 'Basic',
      audioFile: 'toda.mp3',
      imageFile: 'toda_hebrew.webp'
    }
  ]
};

export default function VocabularyPage() {
  const [showGame, setShowGame] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [wordProgress, setWordProgress] = useState<Record<string, WordProgress>>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const router = useRouter();
  const params = useParams();
  const language = params.language as string;

  const vocabulary = sampleVocabulary[language] || [];
  const categories = ['all', ...new Set(vocabulary.map(word => word.category))];

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

    // Load word progress from localStorage
    const progressKey = `word_progress_${language}`;
    const savedProgress = localStorage.getItem(progressKey);
    if (savedProgress) {
      setWordProgress(JSON.parse(savedProgress));
    }
  }, [language, router]);

  const filteredVocabulary = selectedCategory === 'all' 
    ? vocabulary 
    : vocabulary.filter(word => word.category === selectedCategory);

  const getWordProgress = (wordId: string): WordProgress => {
    return wordProgress[wordId] || {
      status: 'not_started',
      correctStreak: 0,
      totalAttempts: 0,
      totalCorrect: 0
    };
  };

  const updateWordProgress = (wordId: string, isCorrect: boolean) => {
    const currentProgress = getWordProgress(wordId);
    const newProgress: WordProgress = {
      status: currentProgress.status,
      lastSeenAt: new Date().toISOString(),
      correctStreak: isCorrect ? currentProgress.correctStreak + 1 : 0,
      totalAttempts: currentProgress.totalAttempts + 1,
      totalCorrect: currentProgress.totalCorrect + (isCorrect ? 1 : 0)
    };

    // Update status based on performance
    if (newProgress.correctStreak >= 3) {
      newProgress.status = 'learned';
    } else if (newProgress.totalAttempts >= 2) {
      newProgress.status = 'learning';
    }

    const updatedProgress = { ...wordProgress, [wordId]: newProgress };
    setWordProgress(updatedProgress);
    
    // Save to localStorage
    const progressKey = `word_progress_${language}`;
    localStorage.setItem(progressKey, JSON.stringify(updatedProgress));
  };

  const handlePlayAudio = (audioFile: string) => {
    // In a real app, this would play the audio file
    console.log('Playing audio:', audioFile);
    setToastMessage('Audio playback not implemented in demo');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleGameComplete = (score: number, totalWords: number) => {
    setToastMessage(`Great job! You scored ${score} out of ${totalWords} points!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getProgressStats = () => {
    const totalWords = vocabulary.length;
    const learnedWords = Object.values(wordProgress).filter(p => p.status === 'learned').length;
    const learningWords = Object.values(wordProgress).filter(p => p.status === 'learning').length;
    const notStartedWords = totalWords - learnedWords - learningWords;
    
    return { totalWords, learnedWords, learningWords, notStartedWords };
  };

  const stats = getProgressStats();

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('selectedLanguage');
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-indigo-50 p-4">
      {/* Logout Button */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="px-3 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm font-medium"
        >
          Logout
        </button>
      </div>

      {/* Page Character - Main Character */}
      <div className="absolute top-8 left-8 z-10 opacity-80 animate-bounce">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-5xl">📚</span>
        </div>
      </div>

      {/* Background Characters */}
      <div className="absolute top-20 right-8 z-10 opacity-70 animate-float">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-4xl">🎨</span>
        </div>
      </div>

      <div className="absolute bottom-20 left-8 z-10 opacity-70 animate-float-delayed">
        <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-5xl">🎭</span>
        </div>
      </div>

      <div className="absolute bottom-16 right-12 z-10 opacity-70 animate-float-slow">
        <div className="w-28 h-28 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-6xl">🎪</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-30 pt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent break-words max-w-[600px] mx-auto">
              {languageNames[language as keyof typeof languageNames]} Vocabulary
            </h1>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
          <p className="text-xl text-gray-600 break-words max-w-[500px] mx-auto">
            Learn and practice {languageNames[language as keyof typeof languageNames]} words through interactive games
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.totalWords}</div>
              <div className="text-sm text-gray-600">Total Words</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.learnedWords}</div>
              <div className="text-sm text-gray-600">Learned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{stats.learningWords}</div>
              <div className="text-sm text-gray-600">Learning</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">{stats.notStartedWords}</div>
              <div className="text-sm text-gray-600">Not Started</div>
            </div>
          </div>
        </div>

        {/* Game Button */}
        <div className="text-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowGame(true)}
            className="px-8 py-4 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-bold flex items-center justify-center mx-auto space-x-2"
          >
            <Play className="w-6 h-6" />
            <span>Play Vocabulary Games</span>
          </motion.button>
        </div>

        {/* Category Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Vocabulary List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Vocabulary Words</h3>
          <div className="grid gap-4">
            {filteredVocabulary.map((word) => {
              const progress = getWordProgress(word.id);
              const progressColor = progress.status === 'learned' ? 'green' : 
                                  progress.status === 'learning' ? 'yellow' : 'gray';
              
              return (
                <motion.div
                  key={word.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-200 hover:shadow-lg transition-all duration-300"
                  style={{ borderLeftColor: progressColor === 'green' ? '#10B981' : 
                                         progressColor === 'yellow' ? '#F59E0B' : '#6B7280' }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-xl font-bold text-gray-800">{word.lemma}</h4>
                        <span className="text-sm text-gray-500">({word.phonetic})</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          progressColor === 'green' ? 'bg-green-100 text-green-800' :
                          progressColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {progress.status === 'learned' ? 'Learned' :
                           progress.status === 'learning' ? 'Learning' : 'Not Started'}
                        </span>
                      </div>
                      
                      <div className="text-lg text-gray-700 mb-2">{word.translation}</div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center space-x-1">
                          <Target className="w-4 h-4" />
                          <span>{word.partOfSpeech}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Zap className="w-4 h-4" />
                          <span>Level {word.difficultyLevel}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>{word.category}</span>
                        </span>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="text-sm text-gray-600 mb-1">Example:</div>
                        <div className="text-gray-800 mb-1">{word.exampleNative}</div>
                        <div className="text-gray-600 italic">{word.exampleTranslation}</div>
                      </div>

                      {progress.totalAttempts > 0 && (
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Attempts: {progress.totalAttempts}</span>
                          <span>Correct: {progress.totalCorrect}</span>
                          <span>Streak: {progress.correctStreak}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      {word.audioFile && (
                        <button
                          onClick={() => handlePlayAudio(word.audioFile!)}
                          className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                          title="Play pronunciation"
                        >
                          <Volume2 className="w-5 h-5 text-blue-600" />
                        </button>
                      )}
                      
                      {word.imageFile && (
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Image className="w-5 h-5 text-green-600" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <div className="relative inline-block">
            <button
              onClick={() => router.push(`/map/${language}`)}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium bg-white/80 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 break-words text-lg"
            >
              ← Back to Map
            </button>
            <div className="absolute -right-16 top-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-lg">🔙</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-blue-300 to-purple-300 text-white p-4 rounded-xl shadow-lg max-w-[350px] break-words">
          <div className="flex items-center">
            <span className="mr-3 text-xl">ℹ️</span>
            <span className="text-base">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Vocabulary Game Modal */}
      {showGame && (
        <VocabularyGame
          words={filteredVocabulary}
          language={language}
          onComplete={handleGameComplete}
          onClose={() => setShowGame(false)}
        />
      )}

      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-pink-300 rounded-full animate-ping opacity-60"></div>
      <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-300 rounded-full animate-ping opacity-60" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-blue-300 rounded-full animate-ping opacity-60" style={{animationDelay: '2s'}}></div>
    </div>
  );
}
