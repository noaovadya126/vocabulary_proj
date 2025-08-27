'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Question {
  id: number;
  type: 'multiple-choice' | 'fill-in-blank';
  question: string;
  options?: string[];
  correctAnswer: string;
  word: string;
  translation: string;
}

const mockQuestions: Question[] = [
  {
    id: 1,
    type: 'multiple-choice',
    question: 'מה המשמעות של המילה "Hola"?',
    options: ['תודה', 'שלום', 'בבקשה', 'בוקר טוב'],
    correctAnswer: 'שלום',
    word: 'Hola',
    translation: 'שלום'
  },
  {
    id: 2,
    type: 'fill-in-blank',
    question: 'השלימי את המילה: "___" פירושו "תודה"',
    correctAnswer: 'Gracias',
    word: 'Gracias',
    translation: 'תודה'
  },
  {
    id: 3,
    type: 'multiple-choice',
    question: 'איך אומרים "בבקשה" בספרדית?',
    options: ['Hola', 'Gracias', 'Por favor', 'Buenos días'],
    correctAnswer: 'Por favor',
    word: 'Por favor',
    translation: 'בבקשה'
  },
  {
    id: 4,
    type: 'fill-in-blank',
    question: 'השלימי את המילה: "___" פירושו "בוקר טוב"',
    correctAnswer: 'Buenos días',
    word: 'Buenos días',
    translation: 'בוקר טוב'
  },
  {
    id: 5,
    type: 'multiple-choice',
    question: 'מה המשמעות של "Buenas noches"?',
    options: ['בוקר טוב', 'צהריים טובים', 'לילה טוב', 'להתראות'],
    correctAnswer: 'לילה טוב',
    word: 'Buenas noches',
    translation: 'לילה טוב'
  }
];

const languageNames = {
  es: 'ספרדית',
  ko: 'קוריאנית',
  fr: 'צרפתית'
};

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{[key: number]: string}>({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  
  const router = useRouter();
  const params = useParams();
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
  }, [language, router]);

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const totalQuestions = mockQuestions.length;
  const answeredQuestions = Object.keys(userAnswers).length;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  const handleAnswerSelect = (answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const handleSubmit = () => {
    if (!userAnswers[currentQuestion.id]) {
      setToastMessage('עליך לבחור תשובה לפני ההגשה');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Check if answer is correct
      const isCorrect = userAnswers[currentQuestion.id] === currentQuestion.correctAnswer;
      
      if (isCorrect) {
        setToastMessage('נכון! תשובה מצוינת! 🎉');
        setToastType('success');
      } else {
        setToastMessage(`לא נכון. התשובה הנכונה היא: ${currentQuestion.correctAnswer}`);
        setToastType('error');
      }
      
      setShowToast(true);
      
      // Move to next question or show results
      if (currentQuestionIndex < totalQuestions - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex(prev => prev + 1);
        }, 1500);
      } else {
        setTimeout(() => {
          setShowResults(true);
        }, 1500);
      }
    }, 1000);
  };

  const handleSkip = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    let total = 0;
    
    mockQuestions.forEach(question => {
      if (userAnswers[question.id]) {
        total++;
        if (userAnswers[question.id] === question.correctAnswer) {
          correct++;
        }
      }
    });
    
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  };

  const handleFinish = () => {
    const score = calculateScore();
    localStorage.setItem(`quiz_score_${language}_${milestoneId}`, score.toString());
    
    // Redirect to winner page
    router.push(`/winner/${language}/${milestoneId}?score=${score}`);
  };

  const handleReview = () => {
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
  };

  if (showResults) {
    const score = calculateScore();
    const correctAnswers = mockQuestions.filter(q => 
      userAnswers[q.id] === q.correctAnswer
    ).length;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              תוצאות הקוויז! 🎯
            </h1>
            <p className="text-xl text-gray-600">
              אבן דרך {milestoneId} - {languageNames[language as keyof typeof languageNames]}
            </p>
          </div>

          {/* Results Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">
                {score >= 80 ? '🎉' : score >= 60 ? '👍' : '💪'}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                התוצאה שלך: {score}%
              </h2>
              <p className="text-xl text-gray-600">
                {correctAnswers} מתוך {totalQuestions} תשובות נכונות
              </p>
            </div>

            {/* Score Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
              <div 
                className={`h-4 rounded-full transition-all duration-1000 ${
                  score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${score}%` }}
              ></div>
            </div>

            {/* Performance Message */}
            <div className="text-center mb-8">
              <p className="text-lg text-gray-700">
                {score >= 90 ? 'מעולה! את מוכנה לשלב הבא!' :
                 score >= 80 ? 'טוב מאוד! עבודה נהדרת!' :
                 score >= 60 ? 'לא רע! המשכי להתאמץ!' :
                 'עליך לתרגל יותר לפני שתמשיכי'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleReview}
                className="px-6 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors"
              >
                📖 סקירה חוזרת
              </button>
              {score >= 80 && (
                <button
                  onClick={handleFinish}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 to-purple-700 transition-colors"
                >
                  🎯 המשך לשלב הבא
                </button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="text-center">
            <button
              onClick={() => router.push(`/milestone/${language}/${milestoneId}`)}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
            >
              ← חזרה לאבן הדרך
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            קוויז - {languageNames[language as keyof typeof languageNames]}
          </h1>
          <p className="text-xl text-gray-600">
            אבן דרך {milestoneId} - שאלה {currentQuestionIndex + 1} מתוך {totalQuestions}
          </p>
        </div>

        {/* Progress Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">התקדמות בקוויז</h3>
            <span className="text-sm text-gray-600">
              {answeredQuestions} מתוך {totalQuestions} שאלות נענו
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {currentQuestion.question}
            </h2>

            {/* Question Type Indicator */}
            <div className="text-center mb-6">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                currentQuestion.type === 'multiple-choice' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {currentQuestion.type === 'multiple-choice' ? 'בחירה מרובה' : 'השלמת מילה'}
              </span>
            </div>

            {/* Multiple Choice Options */}
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full p-4 text-right rounded-xl border-2 transition-all duration-200 ${
                      userAnswers[currentQuestion.id] === option
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {/* Fill in the Blank Input */}
            {currentQuestion.type === 'fill-in-blank' && (
              <div className="text-center">
                <input
                  type="text"
                  value={userAnswers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerSelect(e.target.value)}
                  placeholder="הקלדי את התשובה שלך..."
                  className="w-full max-w-md px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-center text-lg"
                  dir="ltr"
                />
                <p className="text-sm text-gray-500 mt-2">
                  הקלדי את המילה בשפת המקור
                </p>
              </div>
            )}
          </div>

          {/* Question Controls */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleSkip}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
            >
              ⏭️ דלג
            </button>
            <button
              onClick={handleSubmit}
              disabled={!userAnswers[currentQuestion.id] || isSubmitting}
              className={`px-6 py-3 rounded-xl transition-all ${
                userAnswers[currentQuestion.id] && !isSubmitting
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 to-purple-700 hover:scale-105 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'שולח...' : '✅ שלח תשובה'}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <button
            onClick={() => router.push(`/milestone/${language}/${milestoneId}`)}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
          >
            ← חזרה לאבן הדרך
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          toastType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center">
            <span className="mr-2">
              {toastType === 'success' ? '✓' : '✗'}
            </span>
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}
