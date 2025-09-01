'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Question {
  id: number;
  word: string;
  translation: string;
  options: string[];
  correctAnswer: string;
}

// Language-specific quiz questions
const quizQuestions = {
  es: [
    {
      id: 1,
      word: 'Hola',
      translation: 'Hello',
      options: ['Thank you', 'Hello', 'Please', 'Sorry'],
      correctAnswer: 'Hello'
    },
    {
      id: 2,
      word: 'Gracias',
      translation: 'Thank you',
      options: ['Hello', 'Thank you', 'Please', 'Yes'],
      correctAnswer: 'Thank you'
    },
    {
      id: 3,
      word: 'Por favor',
      translation: 'Please',
      options: ['Sorry', 'Please', 'No', 'What?'],
      correctAnswer: 'Please'
    },
    {
      id: 4,
      word: 'Lo siento',
      translation: 'Sorry',
      options: ['Yes', 'Sorry', 'Where?', 'How?'],
      correctAnswer: 'Sorry'
    },
    {
      id: 5,
      word: 'Sí',
      translation: 'Yes',
      options: ['No', 'What?', 'Yes', 'When?'],
      correctAnswer: 'Yes'
    }
  ],
  ko: [
    {
      id: 1,
      word: '안녕하세요',
      translation: 'Hello',
      options: ['Thank you', 'Hello', 'Please', 'Sorry'],
      correctAnswer: 'Hello'
    },
    {
      id: 2,
      word: '감사합니다',
      translation: 'Thank you',
      options: ['Hello', 'Thank you', 'Please', 'Yes'],
      correctAnswer: 'Thank you'
    },
    {
      id: 3,
      word: '부탁합니다',
      translation: 'Please',
      options: ['Sorry', 'Please', 'No', 'What?'],
      correctAnswer: 'Please'
    },
    {
      id: 4,
      word: '죄송합니다',
      translation: 'Sorry',
      options: ['Yes', 'Sorry', 'Where?', 'How?'],
      correctAnswer: 'Sorry'
    },
    {
      id: 5,
      word: '네',
      translation: 'Yes',
      options: ['No', 'What?', 'Yes', 'When?'],
      correctAnswer: 'Yes'
    }
  ],
  fr: [
    {
      id: 1,
      word: 'Bonjour',
      translation: 'Hello',
      options: ['Thank you', 'Hello', 'Please', 'Sorry'],
      correctAnswer: 'Hello'
    },
    {
      id: 2,
      word: 'Merci',
      translation: 'Thank you',
      options: ['Hello', 'Thank you', 'Please', 'Yes'],
      correctAnswer: 'Thank you'
    },
    {
      id: 3,
      word: 'S\'il vous plaît',
      translation: 'Please',
      options: ['Sorry', 'Please', 'No', 'What?'],
      correctAnswer: 'Please'
    },
    {
      id: 4,
      word: 'Désolé',
      translation: 'Sorry',
      options: ['Yes', 'Sorry', 'Where?', 'How?'],
      correctAnswer: 'Sorry'
    },
    {
      id: 5,
      word: 'Oui',
      translation: 'Yes',
      options: ['No', 'What?', 'Yes', 'When?'],
      correctAnswer: 'Yes'
    }
  ]
};

const languageNames = {
  es: 'Spanish',
  ko: 'Korean',
  fr: 'French'
};

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  const router = useRouter();
  const params = useParams();
  const language = params.language as string;
  const milestoneId = params.milestoneId as string;

  const questions = quizQuestions[language as keyof typeof quizQuestions] || quizQuestions.es;
  const currentQuestion = questions[currentQuestionIndex];

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

    // Check if user has completed enough words to take the quiz
    const progressKey = `progress_${language}_${milestoneId}`;
    const userProgress = localStorage.getItem(progressKey);
    
    if (userProgress) {
      const progress = JSON.parse(userProgress);
      const completedWords = Object.values(progress).filter(status => status === 'completed').length;
      
      if (completedWords < 5) { // Require at least 5 words completed
        alert('You need to complete at least 5 words before taking the quiz!');
        router.push(`/milestone/${language}/${milestoneId}`);
        return;
      }
    } else {
      alert('No progress found! Please complete some words first.');
      router.push(`/milestone/${language}/${milestoneId}`);
      return;
    }
  }, [language, milestoneId, router]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      setIsCorrect(true);
      setFeedbackMessage('Correct! 🎉');
    } else {
      setIsCorrect(false);
      setFeedbackMessage(`Wrong! The correct answer is: ${currentQuestion.correctAnswer}`);
      
      // Save wrong answer for review
      const wrongAnswersKey = `wrong_answers_${language}_${milestoneId}`;
      const existingWrongAnswers = localStorage.getItem(wrongAnswersKey);
      const wrongAnswers = existingWrongAnswers ? JSON.parse(existingWrongAnswers) : [];
      
      const wrongAnswer = {
        word: currentQuestion.word,
        userAnswer: answer,
        correctAnswer: currentQuestion.correctAnswer,
        questionId: currentQuestion.id,
        timestamp: new Date().toISOString()
      };
      
      wrongAnswers.push(wrongAnswer);
      localStorage.setItem(wrongAnswersKey, JSON.stringify(wrongAnswers));
    }
    
    setShowAnswerFeedback(true);
    
    // Hide feedback after 3 seconds and move to next question
    setTimeout(() => {
      setShowAnswerFeedback(false);
      setSelectedAnswer('');
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setQuizCompleted(true);
        setShowResult(true);
      }
    }, 3000);
  };

  const handleFinishQuiz = () => {
    // Save quiz results
    const quizResults = {
      language,
      milestoneId,
      score,
      totalQuestions: questions.length,
      completedAt: new Date().toISOString()
    };
    
    localStorage.setItem(`quiz_results_${language}_${milestoneId}`, JSON.stringify(quizResults));
    
    // Mark milestone as completed
    const milestoneProgressKey = `milestone_progress_${language}_${milestoneId}`;
    const milestoneProgress = localStorage.getItem(milestoneProgressKey);
    const milestoneData = milestoneProgress ? JSON.parse(milestoneProgress) : {};
    
    milestoneData.quizCompleted = true;
    milestoneData.quizScore = score;
    milestoneData.quizCompletedAt = new Date().toISOString();
    localStorage.setItem(milestoneProgressKey, JSON.stringify(milestoneData));
    
    // Navigate to winner page
    router.push(`/winner/${language}/${milestoneId}`);
  };

  if (!currentQuestion) {
    return <div>Loading quiz...</div>;
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-indigo-50 p-3">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Quiz Complete! 🎉
            </h1>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Your Score: {score} out of {questions.length}
              </h2>
              
              <div className="text-lg text-gray-600 mb-6">
                {score === questions.length ? (
                  <span className="text-green-600 font-bold">Perfect! You're amazing! 🌟</span>
                ) : score >= questions.length * 0.8 ? (
                  <span className="text-blue-600 font-bold">Great job! Well done! 👏</span>
                ) : (
                  <span className="text-orange-600 font-bold">Good effort! Keep practicing! 💪</span>
                )}
              </div>
              
              <button
                onClick={handleFinishQuiz}
                className="px-8 py-3 bg-gradient-to-r from-pink-300 to-purple-300 text-white font-bold text-lg rounded-xl hover:from-pink-400 hover:to-purple-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Continue to Results 🚀
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-indigo-50 p-3">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent break-words">
            Quiz - {languageNames[language as keyof typeof languageNames]}
          </h1>
          <p className="text-lg text-gray-600 break-words">
            Milestone {milestoneId} - Test your knowledge
          </p>
        </div>

        {/* Progress */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-800 break-words">Quiz Progress</h3>
            <span className="text-base text-gray-600 break-words">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-pink-300 to-purple-300 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Answer Feedback */}
        {showAnswerFeedback && (
          <div className={`mb-6 p-4 rounded-xl shadow-lg ${
            isCorrect ? 'bg-green-100 border-2 border-green-300' : 'bg-red-100 border-2 border-red-300'
          }`}>
            <div className="text-center">
              <p className={`text-lg font-semibold break-words ${
                isCorrect ? 'text-green-700' : 'text-red-700'
              }`}>
                {feedbackMessage}
              </p>
            </div>
          </div>
        )}

        {/* Question Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 break-words">
              What does "{currentQuestion.word}" mean?
            </h2>
            <p className="text-sm text-gray-500 mb-4 break-words">Multiple Choice</p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showAnswerFeedback}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 break-words ${
                  selectedAnswer === option
                    ? 'border-purple-400 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                } ${
                  showAnswerFeedback ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
              >
                <span className="font-medium break-words">{option}</span>
              </button>
            ))}
          </div>

          {/* Progress Info */}
          <div className="text-center text-sm text-gray-600">
            {showAnswerFeedback ? (
              <p className="text-purple-600 font-medium break-words">
                {currentQuestionIndex < questions.length - 1 ? 'Moving to next question...' : 'Quiz complete!'}
              </p>
            ) : (
              <p className="break-words">Click on an answer to submit</p>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <button
            onClick={() => router.push(`/milestone/${language}/${milestoneId}`)}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium bg-white/80 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            ← Back to Milestone
          </button>
        </div>
      </div>
    </div>
  );
}
