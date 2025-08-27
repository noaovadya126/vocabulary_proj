'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Milestone {
  id: number;
  name: string;
  status: 'completed' | 'current' | 'locked';
  position: { x: number; y: number };
}

const milestones: Milestone[] = [
  { id: 1, name: 'First', status: 'completed', position: { x: 20, y: 80 } },
  { id: 2, name: 'Second', status: 'completed', position: { x: 40, y: 60 } },
  { id: 3, name: 'Third', status: 'current', position: { x: 60, y: 40 } },
  { id: 4, name: 'Fourth', status: 'locked', position: { x: 80, y: 60 } },
  { id: 5, name: 'Fifth', status: 'locked', position: { x: 60, y: 80 } },
  { id: 6, name: 'Sixth', status: 'locked', position: { x: 40, y: 90 } }
];

const languageNames = {
  es: 'Spanish',
  ko: 'Korean', 
  fr: 'French'
};

export default function CountryMapPage() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const router = useRouter();
  const params = useParams();
  const language = params.language as string;

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

  const handleMilestoneClick = (milestone: Milestone) => {
    if (milestone.status === 'locked') {
      setToastMessage('This milestone is locked. Complete the current one first.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (milestone.status === 'current' || milestone.status === 'completed') {
      router.push(`/milestone/${language}/${milestone.id}`);
    }
  };

  const getMilestoneColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-400';
      case 'current':
        return 'bg-cyan-400';
      case 'locked':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getMilestoneIcon = (status: string) => {
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

  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const progressPercentage = (completedMilestones / milestones.length) * 100;

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

      <div className="max-w-5xl mx-auto relative z-30 pt-16">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent break-words">
              {languageNames[language as keyof typeof languageNames]} Country Map
            </h1>
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <span className="text-lg">🗺️</span>
            </div>
          </div>
          <p className="text-lg text-gray-600 break-words">
            Progress through the milestones and learn new words
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-6 relative">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800 break-words">Overall Progress</h3>
            <span className="text-sm text-gray-600 break-words">
              {completedMilestones} of {milestones.length} milestones completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-pink-300 to-purple-300 h-3 rounded-full transition-all duration-1000 ease-out shadow-md"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-sm">📊</span>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 min-h-[400px] overflow-hidden">
          <div className="absolute inset-0 opacity-3">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-blue-100"></div>
          </div>

          <div className="relative w-full h-full min-h-[350px]">
            <svg 
              className="absolute inset-0 w-full h-full" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M 20,80 Q 30,70 40,60 Q 50,50 60,40 Q 70,50 80,60 Q 70,70 60,80 Q 50,90 40,90"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="2"
                strokeDasharray="4,4"
                className="animate-pulse"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F472B6" />
                  <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Milestones */}
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              onClick={() => handleMilestoneClick(milestone)}
              className={`absolute w-10 h-10 rounded-full flex items-center justify-center text-white font-bold cursor-pointer transition-all duration-300 transform hover:scale-110 ${
                milestone.status === 'locked' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              } ${getMilestoneColor(milestone.status)}`}
              style={{
                left: `${milestone.position.x}%`,
                top: `${milestone.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {getMilestoneIcon(milestone.status)}
            </div>
          ))}

          {/* Character Avatars */}
          <div
            className="absolute w-8 h-8 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-bounce"
            style={{
              left: `${milestones.find(m => m.status === 'current')?.position.x! - 2}%`,
              top: `${milestones.find(m => m.status === 'current')?.position.y! - 2}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            👧
          </div>
          <div
            className="absolute w-6 h-6 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-bounce"
            style={{
              left: `${milestones.find(m => m.status === 'current')?.position.x! + 2}%`,
              top: `${milestones.find(m => m.status === 'current')?.position.y! + 2}%`,
              transform: 'translate(-50%, -50%)',
              animationDelay: '0.2s'
            }}
          >
            👦
          </div>

          {/* Milestone Labels */}
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="absolute text-center"
              style={{
                left: `${milestone.position.x}%`,
                top: `${milestone.position.y + 8}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className={`px-2 py-1 rounded font-medium break-words max-w-[100px] ${
                milestone.status === 'completed' 
                  ? 'bg-green-100 text-green-700' 
                  : milestone.status === 'current'
                  ? 'bg-cyan-100 text-cyan-700'
                  : 'bg-gray-100 text-gray-600'
              } text-sm`}>
                {milestone.name}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="text-center mt-6">
          <div className="relative inline-block">
            <button
              onClick={() => router.push('/language-selection')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium bg-white/80 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 break-words"
            >
              ← Back to Language Selection
            </button>
            <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-sm">🔙</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-blue-300 to-purple-300 text-white p-3 rounded-xl shadow-lg max-w-[300px] break-words">
          <div className="flex items-center">
            <span className="mr-2">ℹ️</span>
            <span className="text-sm">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-pink-300 rounded-full animate-ping opacity-60"></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-purple-300 rounded-full animate-ping opacity-60" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-blue-300 rounded-full animate-ping opacity-60" style={{animationDelay: '2s'}}></div>
    </div>
  );
}
