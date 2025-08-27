'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

const languageNames = {
  es: 'ספרדית',
  ko: 'קוריאנית',
  fr: 'צרפתית'
};

export default function WinnerPage() {
  const [score, setScore] = useState(0);
  const [filledStars, setFilledStars] = useState(0);
  const [showConfetti, setShowConfetti] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
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

    // Get score from URL params or localStorage
    const urlScore = searchParams.get('score');
    if (urlScore) {
      const scoreValue = parseInt(urlScore);
      setScore(scoreValue);
      setFilledStars(Math.ceil(scoreValue / 20)); // 5 stars = 100%, so 20% per star
    } else {
      // Fallback to localStorage or default
      const savedScore = localStorage.getItem(`score_${language}_${milestoneId}`);
      if (savedScore) {
        const scoreValue = parseInt(savedScore);
        setScore(scoreValue);
        setFilledStars(Math.ceil(scoreValue / 20));
      } else {
        setScore(85); // Default score
        setFilledStars(4);
      }
    }

    // Hide confetti after 5 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(confettiTimer);
  }, [language, milestoneId, router, searchParams]);

  const getEncouragingMessage = (score: number) => {
    if (score >= 95) {
      return 'את גאון אמיתי! הישג מדהים! 🌟';
    } else if (score >= 90) {
      return 'מעולה! את מתקדמת בצורה יוצאת דופן! 🚀';
    } else if (score >= 80) {
      return 'כל הכבוד! עבודה נהדרת! 💪';
    } else if (score >= 70) {
      return 'טוב מאוד! המשכי להתאמץ! 💫';
    } else {
      return 'עשית צעד טוב! המשכי ללמוד! 📚';
    }
  };

  const handleContinue = () => {
    setToastMessage('ממשיכים לשלב הבא! 🎯');
    setShowToast(true);
    
    setTimeout(() => {
      router.push(`/quiz/${language}/${milestoneId}`);
    }, 1000);
  };

  const handleReview = () => {
    setToastMessage('חוזרים לסקירה! 📖');
    setShowToast(true);
    
    setTimeout(() => {
      router.push(`/milestone/${language}/${milestoneId}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 relative overflow-hidden">
      {/* Confetti Background */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 p-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 animate-pulse">
              כל הכבוד! 🎉
            </h1>
            <p className="text-xl text-gray-600">
              השלמת את אבן הדרך {milestoneId} ב{languageNames[language as keyof typeof languageNames]}!
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 mb-12 relative">
            {/* Animated Character */}
            <div className="mb-8">
              <div className="text-8xl animate-bounce">
                🎊
              </div>
              <div className="text-6xl animate-pulse mt-4">
                🎓
              </div>
            </div>

            {/* Score Display */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                התוצאה שלך:
              </h2>
              <div className="text-6xl font-bold text-indigo-600 mb-4">
                {score}%
              </div>
            </div>

            {/* Stars */}
            <div className="mb-8">
              <div className="flex justify-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`text-4xl transition-all duration-1000 ${
                      i < filledStars 
                        ? 'text-yellow-400 animate-pulse' 
                        : 'text-gray-300'
                    }`}
                  >
                    ⭐
                  </div>
                ))}
              </div>
              <p className="text-lg text-gray-600 mt-2">
                {filledStars} מתוך 5 כוכבים
              </p>
            </div>

            {/* Encouraging Message */}
            <div className="mb-8">
              <p className="text-2xl font-semibold text-gray-800 leading-relaxed">
                {getEncouragingMessage(score)}
              </p>
            </div>

            {/* Achievement Badge */}
            <div className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
              🏆 הישג חדש!
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <button
              onClick={handleContinue}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 px-8 rounded-2xl font-bold text-xl hover:from-indigo-600 to-purple-700 focus:ring-4 focus:ring-indigo-300 transition-all transform hover:scale-105 shadow-xl"
            >
              🎯 המשך לשלב הבא
            </button>
            <button
              onClick={handleReview}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-8 rounded-2xl font-bold text-xl hover:from-cyan-600 to-blue-700 focus:ring-4 focus:ring-cyan-300 transition-all transform hover:scale-105 shadow-xl"
            >
              📖 סקירה חוזרת
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              התקדמות כללית
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${Math.min(score, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              התקדמת {score}% מהדרך שלך
            </p>
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
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center">
            <span className="mr-2">✓</span>
            {toastMessage}
          </div>
        </div>
      )}

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 text-4xl animate-bounce">
        🎈
      </div>
      <div className="absolute top-40 right-20 text-3xl animate-pulse">
        ✨
      </div>
      <div className="absolute bottom-40 left-20 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>
        🎊
      </div>
      <div className="absolute bottom-20 right-10 text-4xl animate-pulse" style={{ animationDelay: '0.5s' }}>
        🌟
      </div>
    </div>
  );
}
