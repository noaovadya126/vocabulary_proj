'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

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
  { id: 1, word: 'Hola', meaning: 'שלום', isMatched: false, position: { x: 20, y: 30 } },
  { id: 2, word: 'Gracias', meaning: 'תודה', isMatched: false, position: { x: 80, y: 20 } },
  { id: 3, word: 'Por favor', meaning: 'בבקשה', isMatched: false, position: { x: 15, y: 70 } },
  { id: 4, word: 'Buenos días', meaning: 'בוקר טוב', isMatched: false, position: { x: 85, y: 80 } },
  { id: 5, word: 'Buenas noches', meaning: 'לילה טוב', isMatched: false, position: { x: 50, y: 15 } }
];

const mockTargetAreas: TargetArea[] = [
  { id: 1, meaning: 'שלום', isMatched: false, position: { x: 25, y: 60 } },
  { id: 2, meaning: 'תודה', isMatched: false, position: { x: 75, y: 50 } },
  { id: 3, meaning: 'בבקשה', isMatched: false, position: { x: 20, y: 85 } },
  { id: 4, meaning: 'בוקר טוב', isMatched: false, position: { x: 80, y: 90 } },
  { id: 5, meaning: 'לילה טוב', isMatched: false, position: { x: 50, y: 75 } }
];

const languageNames = {
  es: 'ספרדית',
  ko: 'קוריאנית',
  fr: 'צרפתית'
};

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

  // Check if user is authenticated and has selected a language
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

    // Check if the match is correct
    const isCorrect = selectedWord.meaning === target.meaning;

    if (isCorrect) {
      // Correct match
      setCorrectMatches(prev => prev + 1);
      setGameWords(prev => prev.map(w => 
        w.id === selectedWord.id ? { ...w, isMatched: true } : w
      ));
      setTargetAreas(prev => prev.map(t => 
        t.id === target.id ? { ...t, isMatched: true } : t
      ));
      
      setToastMessage('נכון! התאמה מושלמת! 🎉');
      setToastType('success');
      setShowToast(true);
    } else {
      // Incorrect match
      setIncorrectMatches(prev => prev + 1);
      setToastMessage('לא נכון. נסי שוב! 💪');
      setToastType('error');
      setShowToast(true);
    }

    setSelectedWord(null);

    // Check if game is complete
    const newCorrectMatches = isCorrect ? correctMatches + 1 : correctMatches;
    if (newCorrectMatches === gameWords.length) {
      setTimeout(() => {
        setShowGameOver(true);
      }, 1000);
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
      setToastMessage('עליך להגיע ל-90% דיוק לפחות כדי להמשיך.');
      setToastType('error');
      setShowToast(true);
    }
  };

  const getWordStyle = (word: GameWord) => {
    const baseStyle = "absolute w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center text-center font-bold text-lg cursor-pointer transition-all duration-300 transform hover:scale-110 border-2";
    
    if (word.isMatched) {
      return `${baseStyle} bg-green-100 border-green-500 text-green-700 opacity-60`;
    }
    
    if (selectedWord?.id === word.id) {
      return `${baseStyle} bg-cyan-100 border-cyan-500 text-cyan-700 ring-4 ring-cyan-300`;
    }
    
    return `${baseStyle} border-gray-300 text-gray-700 hover:border-cyan-400`;
  };

  const getTargetStyle = (target: TargetArea) => {
    const baseStyle = "absolute w-32 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-center font-medium text-gray-700 border-2 transition-all duration-300";
    
    if (target.isMatched) {
      return `${baseStyle} bg-green-100 border-green-500 text-green-700`;
    }
    
    if (selectedWord && selectedWord.meaning === target.meaning) {
      return `${baseStyle} bg-cyan-100 border-cyan-500 text-cyan-700 ring-2 ring-cyan-300`;
    }
    
    return `${baseStyle} border-gray-300 hover:border-cyan-400 hover:bg-cyan-50`;
  };

  const accuracy = calculateAccuracy();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            משחק למידה - {languageNames[language as keyof typeof languageNames]}
          </h1>
          <p className="text-xl text-gray-600">
            התאימי מילים למשמעויות שלהן
          </p>
        </div>

        {/* Progress Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{correctMatches}</div>
              <div className="text-sm text-gray-600">תשובות נכונות</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{incorrectMatches}</div>
              <div className="text-sm text-gray-600">תשובות שגויות</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">{accuracy}%</div>
              <div className="text-sm text-gray-600">דיוק</div>
            </div>
          </div>
          
          {/* Accuracy Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${
                  accuracy >= 90 ? 'bg-green-500' : accuracy >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${accuracy}%` }}
              ></div>
            </div>
            <div className="text-center mt-2">
              <span className="text-sm text-gray-600">
                {accuracy >= 90 ? 'מעולה! את יכולה להמשיך!' : 'המשיכי לנסות להגיע ל-90%'}
              </span>
            </div>
          </div>
        </div>

        {/* Game Container */}
        <div className="relative bg-white rounded-2xl shadow-xl p-8 min-h-[600px] mb-8">
          {/* Floating Words */}
          {gameWords.map((word) => (
            <div
              key={word.id}
              onClick={() => handleWordClick(word)}
              className={getWordStyle(word)}
              style={{
                left: `${word.position.x}%`,
                top: `${word.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {word.word}
            </div>
          ))}

          {/* Target Areas */}
          {targetAreas.map((target) => (
            <div
              key={target.id}
              onClick={() => handleTargetClick(target)}
              className={getTargetStyle(target)}
              style={{
                left: `${target.position.x}%`,
                top: `${target.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {target.meaning}
            </div>
          ))}

          {/* Instructions */}
          <div className="absolute bottom-4 left-4 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm">
            💡 לחיצה על מילה ואז על משמעות
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
          >
            🔄 טעינה מחדש
          </button>
          <button
            onClick={handleNext}
            disabled={accuracy < 90}
            className={`px-6 py-3 rounded-xl transition-all ${
              accuracy >= 90
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 to-purple-700 hover:scale-105 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {accuracy >= 90 ? '🎯 המשך לשלב הבא!' : 'השיגי 90% דיוק תחילה'}
          </button>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <button
            onClick={() => router.push(`/milestone/${language}/${milestoneId}`)}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
          >
            ← חזרה לאבן הדרך
          </button>
        </div>
      </div>

      {/* Game Over Modal */}
      {showGameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">כל הכבוד!</h2>
            <p className="text-gray-600 mb-6">
              השלמת את המשחק עם {accuracy}% דיוק!
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
              >
                נסי שוב
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 to-purple-700 transition-colors"
              >
                המשך
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          toastType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center">
            <span className="mr-2">
              {toastType === 'success' ? '✓' : '✗'}
            </span>
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}
