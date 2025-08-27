'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const languageNames = {
  es: 'Spanish',
  ko: 'Korean',
  fr: 'French'
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
      return 'You are a true genius! Amazing achievement! 🌟';
    } else if (score >= 90) {
      return 'Excellent! You are progressing exceptionally! 🚀';
    } else if (score >= 80) {
      return 'Great job! Wonderful work! 💪';
    } else if (score >= 70) {
      return 'Very good! Keep up the effort! 💫';
    } else {
      return 'You made a good step! Keep learning! 📚';
    }
  };

  const handleContinue = () => {
    setToastMessage('Continuing to the next stage! 🎯');
    setShowToast(true);
    
    setTimeout(() => {
      router.push(`/map/${language}`);
    }, 1000);
  };

  const handleReview = () => {
    setToastMessage('Going back to review! 📖');
    setShowToast(true);
    
    setTimeout(() => {
      router.push(`/milestone/${language}/${milestoneId}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 relative overflow-hidden">
      {/* Background Characters - Positioned strategically */}
      {/* Top Left - Happy Character */}
      <div className="absolute top-16 left-6 z-10 opacity-70 animate-float">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-3xl">🎉</span>
        </div>
      </div>

      {/* Top Right - Celebrating Character */}
      <div className="absolute top-20 right-8 z-10 opacity-70 animate-float-delayed">
        <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-4xl">🎊</span>
        </div>
      </div>

      {/* Bottom Left - Star Character */}
      <div className="absolute bottom-20 left-8 z-10 opacity-70 animate-float-slow">
        <div className="w-28 h-28 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-5xl">⭐</span>
        </div>
      </div>

      {/* Bottom Right - Trophy Character */}
      <div className="absolute bottom-16 right-12 z-10 opacity-70 animate-float-fast">
        <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-6xl">🏆</span>
        </div>
      </div>

      <div className="relative z-30 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          {/* Header with Character */}
          <div className="mb-8">
            <div className="relative inline-block mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Congratulations! 🎉
              </h1>
              {/* Character above title */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
            <p className="text-lg md:text-xl text-gray-600">
              You completed the {languageNames[language as keyof typeof languageNames]} milestone!
            </p>
          </div>

          {/* Score Display */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 relative">
            {/* Character on score card */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-lg">📊</span>
            </div>

            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Your Score: {score}%
            </h2>
            
            {/* Stars */}
            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-4xl ${
                    star <= filledStars ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  {star <= filledStars ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            
            <div className="text-lg text-gray-600 mb-6">
              {getEncouragingMessage(score)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleContinue}
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-yellow-300 to-orange-300 text-white font-bold text-lg rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Continue to Next Milestone 🚀
            </button>
            
            <button
              onClick={handleReview}
              className="w-full md:w-auto px-8 py-4 bg-white/80 border-2 border-gray-200 text-gray-700 font-bold text-lg rounded-xl hover:bg-white hover:border-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Review Words 📖
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-green-300 to-blue-300 text-white p-4 rounded-xl shadow-lg">
          <div className="flex items-center">
            <span className="mr-2">✅</span>
            {toastMessage}
          </div>
        </div>
      )}

      {/* Floating particles for extra charm */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-300 rounded-full animate-ping opacity-60"></div>
      <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-orange-300 rounded-full animate-ping opacity-60" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-pink-300 rounded-full animate-ping opacity-60" style={{animationDelay: '2s'}}></div>
    </div>
  );
}
