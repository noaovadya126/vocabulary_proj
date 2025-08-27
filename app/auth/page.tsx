'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = 'אימייל נדרש';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'אימייל לא תקין';
    }

    if (!formData.password) {
      newErrors.password = 'סיסמה נדרשת';
    } else if (formData.password.length < 6) {
      newErrors.password = 'סיסמה חייבת להיות לפחות 6 תווים';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'שם נדרש';
      } else if (formData.name.length < 2) {
        newErrors.name = 'שם חייב להיות לפחות 2 תווים';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'סיסמאות לא תואמות';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save user data to localStorage
      localStorage.setItem('userData', JSON.stringify({
        name: formData.name || 'משתמש',
        email: formData.email
      }));

      setToastMessage(isLogin ? 'התחברת בהצלחה!' : 'נרשמת בהצלחה!');
      setShowToast(true);

      setTimeout(() => {
        router.push('/language-selection');
      }, 1000);

    } catch (error) {
      setToastMessage('שגיאה. נסי שוב.');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setToastMessage('התחברות עם Google תגיע בקרוב!');
    setShowToast(true);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2">
      <div className="max-w-sm mx-auto">
        {/* Header - Ultra Compact */}
        <div className="text-center mb-3">
          <div className="text-4xl mb-1">🎓</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {isLogin ? 'התחברות' : 'הרשמה'}
          </h1>
          <p className="text-sm text-gray-600">
            {isLogin ? 'ברוכים הבאים בחזרה!' : 'התחילי את המסע שלך'}
          </p>
        </div>

        {/* Form - Ultra Compact */}
        <div className="bg-white rounded-lg shadow-md p-3 mb-3">
          <form onSubmit={handleSubmit} className="space-y-2">
            {!isLogin && (
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="שם מלא"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded text-sm ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>
            )}

            <div>
              <input
                type="email"
                name="email"
                placeholder="אימייל"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded text-sm ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="סיסמה"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded text-sm ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {!isLogin && (
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="אימות סיסמה"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded text-sm ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-500 text-white py-2 rounded font-semibold text-sm hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'טוען...' : (isLogin ? 'התחבר' : 'הירשם')}
            </button>
          </form>
        </div>

        {/* Google Login - Ultra Compact */}
        <div className="bg-white rounded-lg shadow-md p-3 mb-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded font-semibold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <span className="mr-2">🔍</span>
            התחברות עם Google
          </button>
        </div>

        {/* Toggle Mode - Ultra Compact */}
        <div className="text-center">
          <button
            onClick={toggleMode}
            className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
          >
            {isLogin ? 'אין לך חשבון? הירשמי כאן' : 'יש לך כבר חשבון? התחברי כאן'}
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
