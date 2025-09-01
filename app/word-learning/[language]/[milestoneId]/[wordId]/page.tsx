'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Language-specific word sets
const wordSets = {
  es: [
    { id: 1, hebrew: 'Hola', english: 'Hello', image: '👋', audio: 'hello.mp3', video: 'hello.mp4' },
    { id: 2, hebrew: 'Gracias', english: 'Thank you', image: '🙏', audio: 'thankyou.mp3', video: 'thankyou.mp4' },
    { id: 3, hebrew: 'Por favor', english: 'Please', image: '🤲', audio: 'please.mp3', video: 'please.mp4' },
    { id: 4, hebrew: 'Lo siento', english: 'Sorry', image: '😔', audio: 'sorry.mp3', video: 'sorry.mp4' },
    { id: 5, hebrew: 'Sí', english: 'Yes', image: '👍', audio: 'yes.mp3', video: 'yes.mp4' },
    { id: 6, hebrew: 'No', english: 'No', image: '👎', audio: 'no.mp3', video: 'no.mp4' },
    { id: 7, hebrew: '¿Qué?', english: 'What?', image: '❓', audio: 'what.mp3', video: 'what.mp4' },
    { id: 8, hebrew: '¿Dónde?', english: 'Where?', image: '📍', audio: 'where.mp3', video: 'where.mp4' },
    { id: 9, hebrew: '¿Cuándo?', english: 'When?', image: '🕐', audio: 'when.mp3', video: 'when.mp4' },
    { id: 10, hebrew: '¿Cómo?', english: 'How?', image: '🤔', audio: 'how.mp3', video: 'how.mp4' }
  ],
  ko: [
    { id: 1, hebrew: '안녕하세요', english: 'Hello', image: '👋', audio: 'hello.mp3', video: 'hello.mp4' },
    { id: 2, hebrew: '감사합니다', english: 'Thank you', image: '🙏', audio: 'thankyou.mp3', video: 'thankyou.mp4' },
    { id: 3, hebrew: '부탁합니다', english: 'Please', image: '🤲', audio: 'please.mp3', video: 'please.mp4' },
    { id: 4, hebrew: '죄송합니다', english: 'Sorry', image: '😔', audio: 'sorry.mp3', video: 'sorry.mp4' },
    { id: 5, hebrew: '네', english: 'Yes', image: '👍', audio: 'yes.mp3', video: 'yes.mp4' },
    { id: 6, hebrew: '아니요', english: 'No', image: '👎', audio: 'no.mp3', video: 'no.mp4' },
    { id: 7, hebrew: '뭐?', english: 'What?', image: '❓', audio: 'what.mp3', video: 'what.mp4' },
    { id: 8, hebrew: '어디?', english: 'Where?', image: '📍', audio: 'where.mp3', video: 'where.mp4' },
    { id: 9, hebrew: '언제?', english: 'When?', image: '🕐', audio: 'when.mp3', video: 'when.mp4' },
    { id: 10, hebrew: '어떻게?', english: 'How?', image: '🤔', audio: 'how.mp3', video: 'how.mp4' }
  ],
  fr: [
    { id: 1, hebrew: 'Bonjour', english: 'Hello', image: '👋', audio: 'hello.mp3', video: 'hello.mp4' },
    { id: 2, hebrew: 'Merci', english: 'Thank you', image: '🙏', audio: 'thankyou.mp3', video: 'thankyou.mp4' },
    { id: 3, hebrew: 'S\'il vous plaît', english: 'Please', image: '🤲', audio: 'please.mp3', video: 'please.mp4' },
    { id: 4, hebrew: 'Désolé', english: 'Sorry', image: '😔', audio: 'sorry.mp3', video: 'sorry.mp4' },
    { id: 5, hebrew: 'Oui', english: 'Yes', image: '👍', audio: 'yes.mp3', video: 'yes.mp4' },
    { id: 6, hebrew: 'Non', english: 'No', image: '👎', audio: 'no.mp3', video: 'no.mp4' },
    { id: 7, hebrew: 'Quoi?', english: 'What?', image: '❓', audio: 'what.mp3', video: 'what.mp4' },
    { id: 8, hebrew: 'Où?', english: 'Where?', image: '📍', audio: 'where.mp3', video: 'where.mp4' },
    { id: 9, hebrew: 'Quand?', english: 'When?', image: '🕐', audio: 'when.mp3', video: 'when.mp4' },
    { id: 10, hebrew: 'Comment?', english: 'How?', image: '🤔', audio: 'how.mp3', video: 'how.mp4' }
  ]
};

const languageNames = {
  es: 'Spanish',
  ko: 'Korean',
  fr: 'French'
};

export default function WordLearningPage() {
  const [showTranslation, setShowTranslation] = useState(false);
  const [notes, setNotes] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showGotIt, setShowGotIt] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const language = params.language as string;
  const milestoneId = params.milestoneId as string;
  const wordId = parseInt(params.wordId as string);

  const currentWord = wordSets[language as keyof typeof wordSets]?.find(w => w.id === wordId);

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

  const handleGotIt = () => {
    setShowGotIt(true);
    
    // Mark current word as completed
    const progressKey = `progress_${language}_${milestoneId}`;
    const currentProgress = localStorage.getItem(progressKey);
    const progress = currentProgress ? JSON.parse(currentProgress) : {};
    
    progress[wordId] = 'completed';
    localStorage.setItem(progressKey, JSON.stringify(progress));

    // Automatically unlock the next word in sequence
    const nextWordId = wordId + 1;
    if (nextWordId <= 10) { // Assuming max 10 words per milestone
      progress[nextWordId] = 'learning';
      localStorage.setItem(progressKey, JSON.stringify(progress));
    }

    // Update milestone progress in localStorage
    const milestoneProgressKey = `milestone_progress_${language}_${milestoneId}`;
    const milestoneProgress = localStorage.getItem(milestoneProgressKey);
    const milestoneData = milestoneProgress ? JSON.parse(milestoneProgress) : {};
    
    milestoneData.completedWords = milestoneData.completedWords || [];
    if (!milestoneData.completedWords.includes(wordId)) {
      milestoneData.completedWords.push(wordId);
    }
    milestoneData.lastUpdated = new Date().toISOString();
    localStorage.setItem(milestoneProgressKey, JSON.stringify(milestoneData));

    // Show success message
    setTimeout(() => {
      alert('Word completed! Next word unlocked! Progress saved.');
      router.push(`/milestone/${language}/${milestoneId}`);
    }, 1000);
  };

  if (!currentWord) {
    return <div>Word not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-indigo-50 p-3">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent break-words">
              Learning Word - {languageNames[language as keyof typeof languageNames]}
            </h1>
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <span className="text-lg">📖</span>
            </div>
          </div>
          <p className="text-lg md:text-xl text-gray-600 break-words">
            Milestone {milestoneId}, Word {wordId}
          </p>
        </div>

        {/* Word Display */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="text-center mb-4">
            <div className="text-5xl mb-4">{currentWord.image}</div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-800 break-words">{currentWord.english}</h2>
              {showTranslation && (
                <p className="text-xl text-purple-600 font-semibold break-words">{currentWord.hebrew}</p>
              )}
            </div>
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-pink-300 to-purple-300 text-white rounded-lg hover:from-pink-400 hover:to-purple-400 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              {showTranslation ? 'Hide Translation' : 'Show Translation'}
            </button>
          </div>
        </div>

        {/* Media Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Audio Control */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-center break-words">Audio</h3>
            <div className="text-center">
              <button
                onClick={handleAudioPlay}
                disabled={isPlaying}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${
                  isPlaying 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-300 to-cyan-300 hover:from-blue-400 hover:to-cyan-400 text-white hover:scale-110 shadow-md'
                }`}
              >
                {isPlaying ? '⏸️' : '🔊'}
              </button>
              <p className="text-sm text-gray-600 mt-3 break-words">
                {isPlaying ? 'Playing...' : 'Click to play'}
              </p>
            </div>
          </div>

          {/* Video Control */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-center break-words">Video</h3>
            <div className="text-center">
              <button
                onClick={handleVideoPlay}
                disabled={isVideoPlaying}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${
                  isVideoPlaying 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-300 to-pink-300 hover:from-purple-400 hover:to-pink-400 text-white hover:scale-110 shadow-md'
                }`}
              >
                {isVideoPlaying ? '⏸️' : '🎥'}
              </button>
              <p className="text-sm text-gray-600 mt-3 break-words">
                {isVideoPlaying ? 'Playing...' : 'Click to watch'}
              </p>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-3 text-center break-words">Personal Notes</h3>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            placeholder="Write personal notes to help remember this word..."
            className="w-full h-24 p-3 border border-gray-200 rounded-lg text-base resize-none focus:ring-2 focus:ring-purple-300 focus:border-transparent break-words"
          />
          <p className="text-xs text-gray-500 mt-2 text-center break-words">
            Notes are saved automatically
          </p>
        </div>

        {/* Got It Button */}
        <div className="text-center mb-4">
          <button
            onClick={handleGotIt}
            disabled={showGotIt}
            className={`px-8 py-3 text-lg font-bold rounded-xl transition-all duration-300 transform hover:scale-105 ${
              showGotIt 
                ? 'bg-green-300 text-green-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-300 to-emerald-300 hover:from-green-400 hover:to-emerald-400 text-white shadow-lg'
            }`}
          >
            {showGotIt ? '✅ Got it!' : '🎯 Got it!'}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-3">
          <div>
            <button
              onClick={() => router.push(`/milestone/${language}/${milestoneId}`)}
              className="px-6 py-2 text-base text-gray-600 hover:text-gray-800 font-medium bg-white/80 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 break-words"
            >
              ← Back to Milestone
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
