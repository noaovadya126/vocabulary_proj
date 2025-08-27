'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Word {
  id: number;
  hebrew: string;
  english: string;
  status: 'locked' | 'learning' | 'completed';
}

const words: Word[] = [
  { id: 1, hebrew: 'שלום', english: 'Hello', status: 'completed' },
  { id: 2, hebrew: 'תודה', english: 'Thank you', status: 'completed' },
  { id: 3, hebrew: 'בבקשה', english: 'Please', status: 'completed' },
  { id: 4, hebrew: 'סליחה', english: 'Sorry', status: 'completed' },
  { id: 5, hebrew: 'כן', english: 'Yes', status: 'completed' },
  { id: 6, hebrew: 'לא', english: 'No', status: 'completed' },
  { id: 7, hebrew: 'מה', english: 'What', status: 'learning' },
  { id: 8, hebrew: 'איפה', english: 'Where', status: 'learning' },
  { id: 9, hebrew: 'מתי', english: 'When', status: 'locked' },
  { id: 10, hebrew: 'איך', english: 'How', status: 'locked' }
];

const languageNames = {
  es: 'ספרדית',
  ko: 'קוריאנית',
  fr: 'צרפתית'
};

export default function MilestonePage() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
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
  }, [language, router]);

  const handleWordClick = (word: Word) => {
    if (word.status === 'locked') {
      setToastMessage('מילה זו נעולה עדיין. השלימי את המילים הקודמות תחילה.');
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
      setToastMessage(`עדיין לא השלמת את כל המילים. השלימי ${words.length - completedWords} מילים נוספות.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'learning':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'locked':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const completedWords = words.filter(w => w.status === 'completed').length;
  const canTakeQuiz = completedWords === words.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2">
      <div className="max-w-3xl mx-auto">
        {/* Header - Ultra Compact */}
        <div className="text-center mb-3">
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            אבן דרך {milestoneId} - {languageNames[language as keyof typeof languageNames]}
          </h1>
          <p className="text-sm text-gray-600">
            למדי את המילים החדשות
          </p>
        </div>

        {/* Progress Summary - Ultra Compact */}
        <div className="bg-white rounded-lg shadow-md p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">התקדמות</h3>
            <span className="text-xs text-gray-600">
              {completedWords}/{words.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(completedWords / words.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Words Grid - Ultra Compact */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-3">
          {words.map((word) => (
            <div
              key={word.id}
              onClick={() => handleWordClick(word)}
              className={`bg-white rounded-md shadow-sm p-2 cursor-pointer transition-all duration-300 transform hover:scale-105 border ${
                word.status === 'locked' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              } ${getStatusColor(word.status)}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold">{word.hebrew}</span>
                <span className="text-lg">{getStatusIcon(word.status)}</span>
              </div>
              <p className="text-xs text-gray-600">{word.english}</p>
              <div className="mt-1 text-xs text-gray-500">
                {word.status === 'completed' ? 'הושלם' : 
                 word.status === 'learning' ? 'בלמידה' : 'נעול'}
              </div>
            </div>
          ))}
        </div>

        {/* Quiz Button - Ultra Compact */}
        <div className="text-center mb-3">
          <button
            onClick={handleQuizClick}
            disabled={!canTakeQuiz}
            className={`px-4 py-2 rounded-md font-semibold text-white text-sm transition-all duration-300 transform hover:scale-105 ${
              canTakeQuiz 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {canTakeQuiz ? '🎯 קוויז' : '🔒 נעול'}
          </button>
        </div>

        {/* Navigation - Ultra Compact */}
        <div className="text-center">
          <button
            onClick={() => router.push(`/map/${language}`)}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            ← חזרה למפה
          </button>
        </div>
      </div>

      {/* Toast Notification - Compact */}
      {showToast && (
        <div className="fixed top-2 right-2 z-50 bg-blue-500 text-white p-2 rounded-lg shadow-lg text-sm">
          <div className="flex items-center">
            <span className="mr-1">ℹ️</span>
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}
