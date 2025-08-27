'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem('userData');
    const selectedLanguage = localStorage.getItem('selectedLanguage');
    
    if (userData && selectedLanguage) {
      // User is logged in and has selected a language, go to map
      router.push(`/map/${selectedLanguage}`);
    } else if (userData) {
      // User is logged in but hasn't selected a language
      router.push('/language-selection');
    } else {
      // User is not logged in, go to auth
      router.push('/auth');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('selectedLanguage');
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background Characters - Positioned strategically */}
      {/* Top Left - Thoughtful Character */}
      <div className="absolute top-20 left-8 z-10 opacity-60 animate-float">
        <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-4xl">🤔</span>
        </div>
      </div>

      {/* Top Right - Happy Character */}
      <div className="absolute top-16 right-16 z-10 opacity-60 animate-float-delayed">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-3xl">😊</span>
        </div>
      </div>

      {/* Bottom Left - Writing Character */}
      <div className="absolute bottom-24 left-12 z-10 opacity-60 animate-float-slow">
        <div className="w-28 h-28 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-5xl">✍️</span>
        </div>
      </div>

      {/* Bottom Right - Running Character */}
      <div className="absolute bottom-20 right-20 z-10 opacity-60 animate-float-fast">
        <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-6xl">🏃‍♀️</span>
        </div>
      </div>

      {/* Logout Button - Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          🚪 Logout
        </button>
      </div>

      <div className="flex items-center justify-center min-h-screen relative z-30">
        <div className="text-center">
          {/* Main Logo with Character */}
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden">
              <span className="text-white text-6xl font-bold relative z-10">VQ</span>
              {/* Character overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-200 opacity-80"></div>
            </div>
            {/* Floating character above logo */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <span className="text-2xl">👋</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to VocabQuest
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your interactive language learning journey starts here
          </p>
          
          {/* Loading Animation with Character */}
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto mb-4"></div>
            {/* Character next to loading */}
            <div className="absolute -right-16 top-0 w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-xl">🎯</span>
            </div>
          </div>
          
          <p className="text-gray-500 mt-4">Loading...</p>
        </div>
      </div>

      {/* Floating particles for extra charm */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-pink-300 rounded-full animate-ping opacity-60"></div>
      <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-purple-300 rounded-full animate-ping opacity-60" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-blue-300 rounded-full animate-ping opacity-60" style={{animationDelay: '2s'}}></div>
    </div>
  );
}
