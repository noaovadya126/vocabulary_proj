'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Milestone {
  id: number;
  name: string;
  status: 'completed' | 'current' | 'locked';
  position: { x: number; y: number };
}

const languageNames = {
  es: 'Spanish',
  ko: 'Korean', 
  fr: 'French'
};

export default function CountryMapPage() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: 1, name: 'First', status: 'completed', position: { x: 25, y: 75 } },
    { id: 2, name: 'Second', status: 'completed', position: { x: 45, y: 55 } },
    { id: 3, name: 'Third', status: 'current', position: { x: 65, y: 35 } },
    { id: 4, name: 'Fourth', status: 'locked', position: { x: 85, y: 55 } },
    { id: 5, name: 'Fifth', status: 'locked', position: { x: 65, y: 75 } },
    { id: 6, name: 'Sixth', status: 'locked', position: { x: 45, y: 85 } }
  ]);
  
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

    // Check milestone progress and update status
    const checkMilestoneProgress = () => {
      const updatedMilestones: Milestone[] = milestones.map(milestone => {
        const progressKey = `progress_${language}_${milestone.id}`;
        const userProgress = localStorage.getItem(progressKey);
        
        if (userProgress) {
          const progress = JSON.parse(userProgress);
          const completedWords = Object.values(progress).filter(status => status === 'completed').length;
          
          if (completedWords >= 5) { // Milestone completed if 5+ words done
            return { ...milestone, status: 'completed' as const };
          } else if (completedWords > 0) { // Milestone in progress if some words done
            return { ...milestone, status: 'current' as const };
          }
        }
        
        // Check if previous milestone is completed
        if (milestone.id > 1) {
          const prevProgressKey = `progress_${language}_${milestone.id - 1}`;
          const prevProgress = localStorage.getItem(prevProgressKey);
          if (prevProgress) {
            const prevProgressData = JSON.parse(prevProgress);
            const prevCompletedWords = Object.values(prevProgressData).filter(status => status === 'completed').length;
            if (prevCompletedWords >= 5) {
              return { ...milestone, status: 'current' as const };
            }
          }
        }
        
        return milestone;
      });
      
      // Update milestones state
      setMilestones(updatedMilestones);
    };
    
    checkMilestoneProgress();
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
        return 'bg-green-500';
      case 'current':
        return 'bg-blue-500';
      case 'locked':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
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
  
  // Debug logging
  console.log('Milestones:', milestones);
  console.log('Completed milestones:', completedMilestones);
  console.log('Total milestones:', milestones.length);

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

      {/* Page Character - Main Character */}
      <div className="absolute top-8 left-8 z-10 opacity-80 animate-bounce">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-5xl">🗺️</span>
        </div>
      </div>

      {/* Background Characters */}
      <div className="absolute top-20 right-8 z-10 opacity-70 animate-float">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-4xl">😊</span>
        </div>
      </div>

      <div className="absolute bottom-20 left-8 z-10 opacity-70 animate-float-delayed">
        <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-5xl">✍️</span>
        </div>
      </div>

      <div className="absolute bottom-16 right-12 z-10 opacity-70 animate-float-slow">
        <div className="w-28 h-28 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-6xl">🏃‍♀️</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-30 pt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent break-words max-w-[600px] mx-auto">
              {languageNames[language as keyof typeof languageNames]} Country Map
            </h1>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-2xl">🌟</span>
            </div>
          </div>
          <p className="text-xl text-gray-600 break-words max-w-[500px] mx-auto">
            Progress through the milestones and learn new words
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg text-gray-600 break-words max-w-[300px] text-left">
              {completedMilestones} of {milestones.length} milestones completed
            </span>
            <h3 className="text-lg font-semibold text-gray-800 break-words max-w-[200px] text-right">Overall Progress</h3>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-pink-300 to-purple-300 h-4 rounded-full transition-all duration-1000 ease-out shadow-md"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-lg">📊</span>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 min-h-[500px] overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-blue-100"></div>
          </div>

          {/* SVG Path */}
          <div className="relative w-full h-full min-h-[450px]">
            <svg 
              className="absolute inset-0 w-full h-full" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M 25,75 Q 35,65 45,55 Q 55,45 65,35 Q 75,45 85,55 Q 75,65 65,75 Q 55,85 45,85"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeDasharray="5,5"
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
              className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-white font-bold cursor-pointer transition-all duration-300 transform hover:scale-110 ${
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

          {/* Character Avatars on Current Milestone */}
          <div
            className="absolute w-10 h-10 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-bounce"
            style={{
              left: `${milestones.find(m => m.status === 'current')?.position.x! - 3}%`,
              top: `${milestones.find(m => m.status === 'current')?.position.y! - 3}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            👧
          </div>
          <div
            className="absolute w-8 h-8 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-bounce"
            style={{
              left: `${milestones.find(m => m.status === 'current')?.position.x! + 3}%`,
              top: `${milestones.find(m => m.status === 'current')?.position.y! + 3}%`,
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
                top: `${milestone.position.y + 10}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className={`px-3 py-2 rounded-lg font-medium break-words max-w-[120px] shadow-md ${
                milestone.status === 'completed' 
                  ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                  : milestone.status === 'current'
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                  : 'bg-gray-100 text-gray-600 border-2 border-gray-300'
              } text-sm`}>
                {milestone.name}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="text-center mt-8 space-y-4">
          <div className="relative inline-block">
            <button
              onClick={() => router.push(`/vocabulary/${language}`)}
              className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 break-words text-lg mr-4"
            >
              📚 Vocabulary Learning
            </button>
            <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-lg">📚</span>
            </div>
          </div>
          
          <div className="relative inline-block">
            <button
              onClick={() => router.push('/language-selection')}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium bg-white/80 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 break-words text-lg"
            >
              ← Back to Language Selection
            </button>
            <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-lg">🔙</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-blue-300 to-purple-300 text-white p-4 rounded-xl shadow-lg max-w-[350px] break-words">
          <div className="flex items-center">
            <span className="mr-3 text-xl">ℹ️</span>
            <span className="text-base">{toastMessage}</span>
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
