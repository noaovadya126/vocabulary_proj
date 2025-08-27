'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Word {
  id: number;
  hebrew: string;
  english: string;
  status: 'locked' | 'learning' | 'completed';
}

// Language-specific word sets
const wordSets = {
  es: [
    { id: 1, hebrew: 'Hola', english: 'Hello', status: 'completed' },
    { id: 2, hebrew: 'Gracias', english: 'Thank you', status: 'completed' },
    { id: 3, hebrew: 'Por favor', english: 'Please', status: 'completed' },
    { id: 4, hebrew: 'Lo siento', english: 'Sorry', status: 'completed' },
    { id: 5, hebrew: 'Sí', english: 'Yes', status: 'completed' },
    { id: 6, hebrew: 'No', english: 'No', status: 'learning' },
    { id: 7, hebrew: '¿Qué?', english: 'What?', status: 'learning' },
    { id: 8, hebrew: '¿Dónde?', english: 'Where?', status: 'learning' },
    { id: 9, hebrew: '¿Cuándo?', english: 'When?', status: 'learning' },
    { id: 10, hebrew: '¿Cómo?', english: 'How?', status: 'learning' }
  ],
  ko: [
    { id: 1, hebrew: '안녕하세요', english: 'Hello', status: 'completed' },
    { id: 2, hebrew: '감사합니다', english: 'Thank you', status: 'completed' },
    { id: 3, hebrew: '부탁합니다', english: 'Please', status: 'completed' },
    { id: 4, hebrew: '죄송합니다', english: 'Sorry', status: 'completed' },
    { id: 5, hebrew: '네', english: 'Yes', status: 'completed' },
    { id: 6, hebrew: '아니요', english: 'No', status: 'learning' },
    { id: 7, hebrew: '뭐?', english: 'What?', status: 'learning' },
    { id: 8, hebrew: '어디?', english: 'Where?', status: 'learning' },
    { id: 9, hebrew: '언제?', english: 'When?', status: 'learning' },
    { id: 10, hebrew: '어떻게?', english: 'How?', status: 'learning' }
  ],
  fr: [
    { id: 1, hebrew: 'Bonjour', english: 'Hello', status: 'completed' },
    { id: 2, hebrew: 'Merci', english: 'Thank you', status: 'completed' },
    { id: 3, hebrew: 'S\'il vous plaît', english: 'Please', status: 'completed' },
    { id: 4, hebrew: 'Désolé', english: 'Sorry', status: 'completed' },
    { id: 5, hebrew: 'Oui', english: 'Yes', status: 'completed' },
    { id: 6, hebrew: 'Non', english: 'No', status: 'learning' },
    { id: 7, hebrew: 'Quoi?', english: 'What?', status: 'learning' },
    { id: 8, hebrew: 'Où?', english: 'Where?', status: 'learning' },
    { id: 9, hebrew: 'Quand?', english: 'When?', status: 'learning' },
    { id: 10, hebrew: 'Comment?', english: 'How?', status: 'learning' }
  ]
};

const languageNames = {
  es: 'Spanish',
  ko: 'Korean',
  fr: 'French'
};

export default function MilestonePage() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [words, setWords] = useState<Word[]>([]);
  
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
      return;
    }

    // Load words for the specific language
    const languageWords = wordSets[language as keyof typeof wordSets] || wordSets.es;
    
    // Load user progress from localStorage
    const userProgress = localStorage.getItem(`progress_${language}_${milestoneId}`);
    if (userProgress) {
      const progress = JSON.parse(userProgress);
      const updatedWords = languageWords.map(word => ({
        ...word,
        status: progress[word.id] || word.status
      }));
      setWords(updatedWords);
    } else {
      setWords(languageWords);
    }
  }, [language, milestoneId, router]);

  const handleWordClick = (word: Word) => {
    if (word.status === 'locked') {
      setToastMessage('This word is locked. Complete the previous words first.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (word.status === 'learning' || word.status === 'completed') {
      router.push(`/word-learning/${language}/${milestoneId}/${word.id}`);
    }
  };

  const handleQuizClick = () => {
    const completedWords = words.filter(w => w.status === 'completed').length;
    if (completedWords === words.length) {
      router.push(`/quiz/${language}/${milestoneId}`);
    } else {
      setToastMessage(`You still need to complete ${words.length - completedWords} more words.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // Function to determine if a word should be locked
  const shouldLockWord = (word: Word, wordIndex: number) => {
    if (wordIndex === 0) return false; // First word is always accessible
    
    // Check if previous word is completed
    const previousWord = words[wordIndex - 1];
    return previousWord && previousWord.status !== 'completed';
  };

  // Update word status based on progression
  const getWordStatus = (word: Word, wordIndex: number) => {
    if (shouldLockWord(word, wordIndex)) {
      return 'locked';
    }
    return word.status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'learning':
        return '📚';
      case 'locked':
        return '🔒';
      default:
        return '●';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-200 to-emerald-200 text-green-700 border-green-300';
      case 'learning':
        return 'bg-gradient-to-r from-blue-200 to-cyan-200 text-blue-700 border-blue-300';
      case 'locked':
        return 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600 border-gray-300';
      default:
        return 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600 border-gray-300';
    }
  };

  const completedWords = words.filter(w => w.status === 'completed').length;
  const canTakeQuiz = completedWords === words.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-indigo-50 p-3">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Milestone {milestoneId} - {languageNames[language as keyof typeof languageNames]}
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Master these new words to unlock the next level
          </p>
        </div>

        {/* Progress Summary */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-800">Milestone Progress</h3>
            <span className="text-base text-gray-600 font-semibold">
              {completedWords} of {words.length} words completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 h-3 rounded-full transition-all duration-1000 ease-out shadow-md"
              style={{ width: `${(completedWords / words.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Words Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
          {words.map((word, index) => (
            <div
              key={word.id}
              onClick={() => handleWordClick(word)}
              className={`bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-3 cursor-pointer transition-all duration-300 transform hover:scale-105 border-2 hover:shadow-lg ${
                getWordStatus(word, index) === 'locked' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              } ${getStatusColor(getWordStatus(word, index))}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-bold">{word.english}</span>
                <span className="text-xl">{getStatusIcon(getWordStatus(word, index))}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{word.hebrew}</p>
              <div className="text-xs font-medium text-center">
                {getWordStatus(word, index) === 'completed' ? 'Completed' : 
                 getWordStatus(word, index) === 'learning' ? 'Learning' : 'Locked'}
              </div>
            </div>
          ))}
        </div>

        {/* Quiz Button */}
        <div className="text-center mb-6">
          <button
            onClick={handleQuizClick}
            disabled={!canTakeQuiz}
            className={`px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
              canTakeQuiz 
                ? 'bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 text-white hover:from-pink-400 hover:via-purple-400 hover:to-blue-400 shadow-lg' 
                : 'bg-gray-300 cursor-not-allowed text-gray-600'
            }`}
          >
            {canTakeQuiz ? '🎯 Start Quiz' : '🔒 Quiz Locked - Complete All Words First'}
          </button>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <button
            onClick={() => router.push(`/map/${language}`)}
            className="px-5 py-2 text-gray-600 hover:text-gray-800 font-medium bg-white/80 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            ← Back to Map
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-blue-300 to-purple-300 text-white p-3 rounded-xl shadow-lg">
          <div className="flex items-center">
            <span className="mr-2 text-lg">ℹ️</span>
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}
