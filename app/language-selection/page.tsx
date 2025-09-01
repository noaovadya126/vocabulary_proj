'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const languages = [
  {
    id: 'es',
    name: 'Spanish',
    flag: '🇪🇸',
    description: 'Learn Spanish vocabulary and culture',
    color: 'from-red-100 to-yellow-100'
  },
  {
    id: 'ko',
    name: 'Korean',
    flag: '🇰🇷',
    description: 'Master Korean language skills',
    color: 'from-blue-100 to-red-100'
  },
  {
    id: 'fr',
    name: 'French',
    flag: '🇫🇷',
    description: 'Discover French expressions',
    color: 'from-blue-100 to-white'
  }
];

export default function LanguageSelectionPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const router = useRouter();

  const handleLanguageSelect = (languageId: string) => {
    setSelectedLanguage(languageId);
  };

  const handleContinue = () => {
    if (!selectedLanguage) {
      setToastMessage('Please select a language first');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    localStorage.setItem('selectedLanguage', selectedLanguage);
    router.push(`/map/${selectedLanguage}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Page Character - Main Character */}
      <div className="absolute top-8 left-8 z-10 opacity-80 animate-bounce">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-5xl">🌍</span>
        </div>
      </div>

      {/* Background Characters */}
      <div className="absolute top-16 left-6 z-10 opacity-70 animate-float">
        <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-3xl">🤔</span>
        </div>
      </div>

      <div className="absolute top-20 right-8 z-10 opacity-70 animate-float-delayed">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-4xl">😊</span>
        </div>
      </div>

      <div className="absolute bottom-20 left-8 z-10 opacity-70 animate-float-slow">
        <div className="w-28 h-28 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-5xl">✍️</span>
        </div>
      </div>

      <div className="absolute bottom-16 right-12 z-10 opacity-70 animate-float-fast">
        <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-6xl">🏃‍♀️</span>
        </div>
      </div>

      <div className="relative z-30 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Header with Character */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent break-words max-w-[600px] mx-auto leading-tight">
                Choose Your Learning Language
              </h1>
              {/* Character above title */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto break-words leading-relaxed">
              Select the language you want to learn and start your vocabulary journey
            </p>
          </div>

          {/* Language Cards with Characters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {languages.map((language) => (
              <div
                key={language.id}
                onClick={() => handleLanguageSelect(language.id)}
                className={`relative cursor-pointer transition-all duration-300 ${
                  selectedLanguage === language.id
                    ? 'ring-4 ring-cyan-400 ring-offset-4 ring-offset-pink-50'
                    : ''
                }`}
              >
                {/* Character on each card */}
                <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br ${language.color} rounded-full flex items-center justify-center shadow-lg z-20`}>
                  <span className="text-lg">👧</span>
                </div>

                <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                  selectedLanguage === language.id
                    ? 'border-cyan-400 bg-gradient-to-br from-cyan-50 to-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
                }`}>
                  <div className="text-center">
                    <div className="text-6xl mb-4">{language.flag}</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 break-words">{language.name}</h3>
                    <p className="text-gray-600 mb-4 break-words">{language.description}</p>
                    
                    {/* Selection indicator */}
                    {selectedLanguage === language.id && (
                      <div className="inline-flex items-center justify-center w-8 h-8 bg-cyan-400 text-white rounded-full">
                        <span className="text-sm">✓</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Button with Character */}
          <div className="text-center">
            <div className="relative inline-block">
              <button
                onClick={handleContinue}
                disabled={!selectedLanguage}
                className={`px-8 py-4 text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  selectedLanguage
                    ? 'bg-gradient-to-r from-pink-300 to-purple-300 text-white hover:from-pink-400 hover:to-purple-400'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue to Learning Journey 🚀
              </button>
              {/* Character next to button */}
              <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-xl">🎉</span>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center mt-6">
            <button
              onClick={() => router.push('/auth')}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium bg-white/80 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 break-words"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg max-w-md break-words ${
          toastMessage.includes('Please select') 
            ? 'bg-gradient-to-r from-red-300 to-pink-300 text-white' 
            : 'bg-gradient-to-r from-blue-300 to-purple-300 text-white'
        }`}>
          <div className="flex items-center">
            <span className="mr-2">{toastMessage.includes('Please select') ? '❌' : 'ℹ️'}</span>
            <span className="text-base break-words">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-pink-300 rounded-full animate-ping opacity-60"></div>
      <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-300 rounded-full animate-ping opacity-60" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-blue-300 rounded-full animate-ping opacity-60" style={{animationDelay: '2s'}}></div>
    </div>
  );
}
