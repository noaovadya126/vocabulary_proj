'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const words = [
  { id: 1, hebrew: 'שלום', english: 'Hello', image: '👋', audio: 'hello.mp3', video: 'hello.mp4' },
  { id: 2, hebrew: 'תודה', english: 'Thank you', image: '🙏', audio: 'thankyou.mp3', video: 'thankyou.mp4' },
  { id: 3, hebrew: 'בבקשה', english: 'Please', image: '🤲', audio: 'please.mp3', video: 'please.mp4' },
  { id: 4, hebrew: 'סליחה', english: 'Sorry', image: '😔', audio: 'sorry.mp3', video: 'sorry.mp4' },
  { id: 5, hebrew: 'כן', english: 'Yes', image: '👍', audio: 'yes.mp3', video: 'yes.mp4' },
  { id: 6, hebrew: 'לא', english: 'No', image: '👎', audio: 'no.mp3', video: 'no.mp4' },
  { id: 7, hebrew: 'מה', english: 'What', image: '❓', audio: 'what.mp3', video: 'what.mp4' },
  { id: 8, hebrew: 'איפה', english: 'Where', image: '📍', audio: 'where.mp3', video: 'where.mp4' },
  { id: 9, hebrew: 'מתי', english: 'When', image: '🕐', audio: 'when.mp3', video: 'when.mp4' },
  { id: 10, hebrew: 'איך', english: 'How', image: '🤔', audio: 'how.mp3', video: 'how.mp4' }
];

const languageNames = {
  es: 'ספרדית',
  ko: 'קוריאנית',
  fr: 'צרפתית'
};

export default function WordLearningPage() {
  const [showTranslation, setShowTranslation] = useState(false);
  const [notes, setNotes] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const language = params.language as string;
  const milestoneId = params.milestoneId as string;
  const wordId = parseInt(params.wordId as string);

  const currentWord = words.find(w => w.id === wordId);

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

    // Load saved notes
    const savedNotes = localStorage.getItem(`notes_${language}_${milestoneId}_${wordId}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [language, milestoneId, wordId, router]);

  const handleAudioPlay = () => {
    setIsPlaying(true);
    // Simulate audio playback
    setTimeout(() => setIsPlaying(false), 2000);
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
    // Simulate video playback
    setTimeout(() => setIsVideoPlaying(false), 3000);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    localStorage.setItem(`notes_${language}_${milestoneId}_${wordId}`, newNotes);
  };

  const handleContinue = () => {
    // Mark word as completed
    router.push(`/milestone/${language}/${milestoneId}`);
  };

  if (!currentWord) {
    return <div>מילה לא נמצאה</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2">
      <div className="max-w-3xl mx-auto">
        {/* Header - Ultra Compact */}
        <div className="text-center mb-3">
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            למידת מילה - {languageNames[language as keyof typeof languageNames]}
          </h1>
          <p className="text-sm text-gray-600">
            אבן דרך {milestoneId}, מילה {wordId}
          </p>
        </div>

        {/* Word Display - Ultra Compact */}
        <div className="bg-white rounded-lg shadow-md p-3 mb-3">
          <div className="text-center mb-2">
            <div className="text-4xl mb-2">{currentWord.image}</div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-gray-900">{currentWord.hebrew}</h2>
              {showTranslation && (
                <p className="text-lg text-indigo-600 font-semibold">{currentWord.english}</p>
              )}
            </div>
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="mt-2 px-3 py-1 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600 transition-colors"
            >
              {showTranslation ? 'הסתירי תרגום' : 'הראי תרגום'}
            </button>
          </div>
        </div>

        {/* Media Controls - Ultra Compact */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Audio Control */}
          <div className="bg-white rounded-lg shadow-md p-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-2 text-center">השמע</h3>
            <div className="text-center">
              <button
                onClick={handleAudioPlay}
                disabled={isPlaying}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                  isPlaying 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-110'
                }`}
              >
                {isPlaying ? '⏸️' : '🔊'}
              </button>
              <p className="text-xs text-gray-600 mt-1">
                {isPlaying ? 'מנגן...' : 'לחצי להשמעה'}
              </p>
            </div>
          </div>

          {/* Video Control */}
          <div className="bg-white rounded-lg shadow-md p-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-2 text-center">וידאו</h3>
            <div className="text-center">
              <button
                onClick={handleVideoPlay}
                disabled={isVideoPlaying}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                  isVideoPlaying 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-purple-500 hover:bg-purple-600 text-white hover:scale-110'
                }`}
              >
                {isVideoPlaying ? '⏸️' : '🎥'}
              </button>
              <p className="text-xs text-gray-600 mt-1">
                {isVideoPlaying ? 'מנגן...' : 'לחצי לצפייה'}
              </p>
            </div>
          </div>
        </div>

        {/* Notes Section - Ultra Compact */}
        <div className="bg-white rounded-lg shadow-md p-2 mb-3">
          <h3 className="text-sm font-semibold text-gray-900 mb-2 text-center">הערות אישיות</h3>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            placeholder="כתבי לעצמך הערות שיעזרו לזכור את המילה..."
            className="w-full h-16 p-2 border border-gray-300 rounded text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1 text-center">
            הערות נשמרות אוטומטית
          </p>
        </div>

        {/* Action Buttons - Ultra Compact */}
        <div className="text-center space-y-2">
          <button
            onClick={handleContinue}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded text-sm hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            ✅ המשכי למילה הבאה
          </button>
          
          <div>
            <button
              onClick={() => router.push(`/milestone/${language}/${milestoneId}`)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 font-medium"
            >
              ← חזרה לאבן דרך
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
