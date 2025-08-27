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
  { id: 1, name: 'ראשונה', status: 'completed', position: { x: 15, y: 85 } },
  { id: 2, name: 'שנייה', status: 'completed', position: { x: 35, y: 65 } },
  { id: 3, name: 'שלישית', status: 'current', position: { x: 55, y: 45 } },
  { id: 4, name: 'רביעית', status: 'locked', position: { x: 75, y: 65 } },
  { id: 5, name: 'חמישית', status: 'locked', position: { x: 55, y: 85 } },
  { id: 6, name: 'שישית', status: 'locked', position: { x: 35, y: 95 } }
];

const languageNames = {
  es: 'ספרדית',
  ko: 'קוריאנית',
  fr: 'צרפתית'
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
      setToastMessage('אבן דרך זו נעולה עדיין. השלימי את האבן הנוכחית תחילה.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (milestone.status === 'current') {
      router.push(`/milestone/${language}/${milestone.id}`);
    } else if (milestone.status === 'completed') {
      setToastMessage(`כבר השלמת את ${milestone.name}!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const getMilestoneColor = (status: string) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2">
      <div className="max-w-3xl mx-auto">
        {/* Header - Ultra Compact */}
        <div className="text-center mb-3">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            מפת {languageNames[language as keyof typeof languageNames]}
          </h1>
          <p className="text-sm text-gray-600">
            התקדמי דרך אבני הדרך
          </p>
        </div>

        {/* Progress Bar - Ultra Compact */}
        <div className="bg-white rounded-lg shadow-md p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">התקדמות</h3>
            <span className="text-xs text-gray-600">
              {completedMilestones}/{milestones.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Map Container - Ultra Compact */}
        <div className="relative bg-white rounded-lg shadow-lg p-4 min-h-[300px] overflow-hidden">
          {/* Background Pattern - Very Light */}
          <div className="absolute inset-0 opacity-2">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-cyan-50"></div>
          </div>

          {/* Milestone Path - Very Thin */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M 15,85 Q 25,75 35,65 Q 45,55 55,45 Q 65,55 75,65 Q 65,75 55,85 Q 45,95 35,95"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="1"
              strokeDasharray="3,3"
              className="animate-pulse"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Milestones - Very Small */}
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              onClick={() => handleMilestoneClick(milestone)}
              className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs cursor-pointer transition-all duration-300 transform hover:scale-110 ${
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

          {/* Character Avatars - Very Small */}
          <div
            className="absolute w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md animate-bounce"
            style={{
              left: `${milestones.find(m => m.status === 'current')?.position.x! - 1}%`,
              top: `${milestones.find(m => m.status === 'current')?.position.y! - 1}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            👧
          </div>
          <div
            className="absolute w-5 h-5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md animate-bounce"
            style={{
              left: `${milestones.find(m => m.status === 'current')?.position.x! + 1}%`,
              top: `${milestones.find(m => m.status === 'current')?.position.y! + 1}%`,
              transform: 'translate(-50%, -50%)',
              animationDelay: '0.2s'
            }}
          >
            👦
          </div>

          {/* Milestone Labels - Very Small and Close */}
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="absolute text-center"
              style={{
                left: `${milestone.position.x}%`,
                top: `${milestone.position.y + 4}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                milestone.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : milestone.status === 'current'
                  ? 'bg-cyan-100 text-cyan-800'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {milestone.name}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation - Ultra Compact */}
        <div className="text-center mt-3">
          <button
            onClick={() => router.push('/language-selection')}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            ← חזרה לבחירת שפה
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
