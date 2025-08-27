'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const languages = [
  { code: 'es', name: 'ספרדית', flag: '🇪🇸', description: 'שפה רומנטית מדוברת ב-20 מדינות' },
  { code: 'ko', name: 'קוריאנית', flag: '🇰🇷', description: 'שפה מזרח אסייתית עם כתב ייחודי' },
  { code: 'fr', name: 'צרפתית', flag: '🇫🇷', description: 'שפה רומנטית של התרבות והאמנות' }
];

export default function LanguageSelectionPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      router.push('/auth');
      return;
    }
  }, [router]);

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
  };

  const handleContinue = () => {
    if (!selectedLanguage) {
      setToastMessage('בחרי שפה תחילה');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    localStorage.setItem('selectedLanguage', selectedLanguage);
    router.push(`/map/${selectedLanguage}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2">
      <div className="max-w-3xl mx-auto">
        {/* Header - Ultra Compact */}
        <div className="text-center mb-3">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            בחרי את שפת הלמידה שלך
          </h1>
          <p className="text-sm text-gray-600">
            בחרי שפה להתחיל את המסע שלך
          </p>
        </div>

        {/* Language Cards - Ultra Compact */}
        <div className="space-y-2 mb-3">
          {languages.map((language) => (
            <div
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className={`bg-white rounded-lg shadow-md p-3 cursor-pointer transition-all duration-300 transform hover:scale-105 border-2 ${
                selectedLanguage === language.code
                  ? 'border-cyan-500 bg-cyan-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{language.flag}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{language.name}</h3>
                  <p className="text-xs text-gray-600">{language.description}</p>
                </div>
                {selectedLanguage === language.code && (
                  <div className="text-cyan-500 text-xl">✓</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button - Ultra Compact */}
        <div className="text-center mb-3">
          <button
            onClick={handleContinue}
            disabled={!selectedLanguage}
            className={`px-6 py-2 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
              selectedLanguage 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            המשכי
          </button>
        </div>

        {/* Navigation - Ultra Compact */}
        <div className="text-center">
          <button
            onClick={() => router.push('/auth')}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            ← חזרה להתחברות
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
