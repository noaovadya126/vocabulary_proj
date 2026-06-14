'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Toast } from '@/components/ui/Toast';
import { loginUser, registerUser } from '@/lib/userAccount';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const selectedLanguage = localStorage.getItem('selectedLanguage');
      router.push(selectedLanguage ? `/map/${selectedLanguage}` : '/language-selection');
    }
  }, [router]);

  const redirectAfterAuth = () => {
    const selectedLanguage = localStorage.getItem('selectedLanguage');
    router.push(selectedLanguage ? `/map/${selectedLanguage}` : '/language-selection');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

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
      if (!formData.fullName) newErrors.fullName = 'Full name is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const result = isLogin
        ? await loginUser(formData.email, formData.password)
        : await registerUser(formData.email, formData.password, formData.fullName);

      if (!result.ok) {
        setErrors({ password: result.error });
        return;
      }

      setToastMessage(isLogin ? 'Welcome back! Redirecting...' : 'Account created! Redirecting...');
      setShowToast(true);
      setTimeout(redirectAfterAuth, 1200);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-2.5 rounded-lg border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow ${
      errors[field] ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'
    }`;

  return (
    <div className="min-h-screen bg-pastel-cream flex flex-col">
      <header className="px-4 py-6 flex justify-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-400 flex items-center justify-center shadow-soft">
            <span className="text-white font-bold text-sm">VQ</span>
          </div>
          <span className="text-xl font-bold text-brand-800">VocabQuest</span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-brand-800">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-slate-600 mt-2">
              {isLogin
                ? 'Sign in to continue your language journey'
                : 'Start learning vocabulary with structured milestones'}
            </p>
          </div>

          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={e => handleInputChange('fullName', e.target.value)}
                    className={inputClass('fullName')}
                    placeholder="Your name"
                  />
                  {errors.fullName && (
                    <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  className={inputClass('email')}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => handleInputChange('password', e.target.value)}
                  className={inputClass('password')}
                  placeholder="At least 6 characters"
                />
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={e => handleInputChange('confirmPassword', e.target.value)}
                    className={inputClass('confirmPassword')}
                    placeholder="Repeat password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              <Button type="submit" fullWidth size="lg" className="mt-2" disabled={submitting}>
                {submitting ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-brand-500 hover:text-brand-600 font-medium"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </Card>
        </div>
      </div>

      {showToast && <Toast message={toastMessage} variant="success" />}
    </div>
  );
}
