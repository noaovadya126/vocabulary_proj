'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Word {
  id: number;
  original: string;
  translation: string;
  status: 'completed' | 'current' | 'locked';
  progress: number;
}

const mockWords: Word[] = [
  { id: 1, original: 'Hola', translation: 'שלום', status: 'completed', progress: 100 },
  { id: 2, original: 'Gracias', translation: 'תודה', status: 'completed', progress: 100 },
  { id: 3, original: 'Por favor', translation: 'בבקשה', status: 'completed', progress: 100 },
  { id: 4, original: 'Buenos días', translation: 'בוקר טוב', status: 'completed', progress: 100 },
  { id: 5, original: 'Buenas noches', translation: 'לילה טוב', status: 'completed', progress: 100 },
  { id: 6, original: '¿Cómo estás?', translation: 'מה שלומך?', status: 'current', progress: 0 },
  { id: 7, original: 'Muy bien', translation: 'טוב מאוד', status: 'locked', progress: 0 },
  { id: 8, original: 'Adiós', translation: 'להתראות', status: 'locked', progress: 0 },
  { id: 9, original: 'Sí', translation: 'כן', status: 'locked', progress: 0 },
  { id: 10, original: 'No', translation: 'לא', status: 'locked', progress: 0 }
];

const languageNames = {
  es: 'ספרדית',
  ko: 'קוריאנית',
  fr: 'צרפתית'
};

export default function MilestonePage() {
  const [words, setWords] = useState<Word[]>(mockWords);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const router = useRouter();
  const params = useParams();
  const language = params.language as string;
  const milestoneId = params.id as string;

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

  const handleWordClick = (word: Word) => {
    if (word.status === 'locked') {
      setToastMessage('מילה זו נעולה עדיין. השלימי את המילה הנוכחית תחילה.');
      setShowToast(true);
      return;
    }

    if (word.status === 'current') {
      router.push(`/word-learning/${language}/${milestoneId}/${word.id}`);
    } else if (word.status === 'completed') {
      setToastMessage(`כבר למדת את המילה "${word.original}"!`);
      setShowToast(true);
    }
  };

  const handleQuizClick = () => {
    const completedWords = words.filter(word => word.status === 'completed').length;
    if (completedWords === words.length) {
      router.push(`/quiz/${language}/${milestoneId}`);
    } else {
      setToastMessage('עליך להשלים את כל המילים לפני שתוכלי לעבור לקוויז.');
      setShowToast(true);
    }
  };

  const getWordStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'current':
        return 'bg-cyan-500';
      case 'locked':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getWordStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'current':
        return '📚';
      case 'locked':
        return '🔒';
      default:
        return '●';
    }
  };

  const getWordCardStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50 hover:bg-green-100';
      case 'current':
        return 'border-cyan-200 bg-cyan-50 hover:bg-cyan-100';
      case 'locked':
        return 'border-gray-200 bg-gray-50 opacity-60';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  // Calculate progress percentage
  const completedWords = words.filter(word => word.status === 'completed').length;
  const progressPercentage = (completedWords / words.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            אבן דרך {milestoneId} - {languageNames[language as keyof typeof languageNames]}
          </h1>
          <p className="text-xl text-gray-600">
            למדי 10 מילים חדשות ובדקי את הידע שלך
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">התקדמות באבן הדרך</h3>
            <span className="text-sm text-gray-600">
              {completedWords} מתוך {words.length} מילים הושלמו
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Words Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {words.map((word) => (
            <div
              key={word.id}
              onClick={() => handleWordClick(word)}
              className={`relative bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 border-2 ${getWordCardStyle(word.status)} ${
                word.status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {/* Status Indicator */}
              <div className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getWordStatusColor(word.status)}`}>
                {getWordStatusIcon(word.status)}
              </div>

              {/* Word Content */}
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {word.original}
                </h3>
                <p className="text-lg text-gray-600">
                  {word.translation}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    word.status === 'completed' 
                      ? 'bg-green-500' 
                      : word.status === 'current'
                      ? 'bg-cyan-500'
                      : 'bg-gray-300'
                  }`}
                  style={{ width: `${word.progress}%` }}
                ></div>
              </div>

              {/* Status Text */}
              <div className="text-center">
                <span className={`text-sm font-medium ${
                  word.status === 'completed' 
                    ? 'text-green-600' 
                    : word.status === 'current'
                    ? 'text-cyan-600'
                    : 'text-gray-500'
                }`}>
                  {word.status === 'completed' 
                    ? 'הושלם' 
                    : word.status === 'current'
                    ? 'בתהליך'
                    : 'נעול'
                  }
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quiz Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleQuizClick}
            disabled={completedWords < words.length}
            className={`px-8 py-4 text-xl font-medium rounded-xl transition-all duration-300 transform ${
              completedWords === words.length
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 to-purple-700 hover:scale-105 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {completedWords === words.length 
              ? '🎯 התחילי קוויז!' 
              : `השלמי עוד ${words.length - completedWords} מילים לקוויז`
            }
          </button>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <button
            onClick={() => router.push(`/map/${language}`)}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
          >
            ← חזרה למפה
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-blue-500 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center">
            <span className="mr-2">ℹ️</span>
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}
