'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      router.push('/language-selection');
    }
  }, [router]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Simulate authentication
    const userData = {
      id: Date.now(),
      name: isLogin ? 'Default User' : formData.fullName,
      email: formData.email
    };

    localStorage.setItem('userData', JSON.stringify(userData));
    
    setToastMessage(isLogin ? 'Welcome back! Redirecting...' : 'Account created! Redirecting...');
    setShowToast(true);
    
    setTimeout(() => {
      router.push('/language-selection');
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Page Character - Main Character */}
      <div className="absolute top-8 left-8 z-10 opacity-80 animate-bounce">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-5xl">🔐</span>
        </div>
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

      <div className="relative z-30 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header with Character */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 rounded-full flex items-center justify-center shadow-2xl mb-4">
                <span className="text-white text-3xl font-bold">VQ</span>
              </div>
              {/* Character above logo */}
              <div className="absolute -top-4 -right-4 w-14 h-14 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-xl">👋</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent break-words">
              {isLogin ? 'Welcome Back!' : 'Join VocabQuest'}
            </h1>
            <p className="text-gray-600 break-words">
              {isLogin ? 'Sign in to continue your learning journey' : 'Create an account to start learning'}
            </p>
          </div>

          {/* Auth Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 relative">
            {/* Character on form */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-lg">🔐</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 break-words">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300 text-left ${
                      errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-purple-300'
                    } break-words`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 break-words">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300 text-left ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-purple-300'
                  } break-words`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 break-words">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300 text-left ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-purple-300'
                  } break-words`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 break-words">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300 text-left ${
                      errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-purple-300'
                    } break-words`}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-300 to-purple-300 text-white font-bold py-3 px-4 rounded-lg hover:from-pink-400 hover:to-purple-400 transition-all duration-300 transform hover:scale-105 shadow-lg break-words"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {/* Google Sign In */}
            <div className="mt-6">
              <button className="w-full bg-white border-2 border-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-3 break-words">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Toggle Form */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-300 break-words"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-green-300 to-blue-300 text-white p-4 rounded-xl shadow-lg break-words">
          <div className="flex items-center">
            <span className="mr-2">✅</span>
            {toastMessage}
          </div>
        </div>
      )}

      {/* Floating particles for extra charm */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-pink-300 rounded-full animate-ping opacity-60"></div>
      <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-purple-300 rounded-full animate-ping opacity-60" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-blue-300 rounded-full animate-ping opacity-60" style={{animationDelay: '2s'}}></div>
    </div>
  );
}
