'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CharacterIllustration, SpeechBubble } from '@/components/ui/CharacterIllustration';
import { PastelBackground } from '@/components/ui/PastelBackground';
import { Toast } from '@/components/ui/Toast';
import { cn } from '@/lib/cn';
import { loginUser, registerUser } from '@/lib/userAccount';
import Image from 'next/image';
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
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const inputClass = (field: string) =>
    cn(
      'w-full rounded-2xl border bg-white/90 px-4 py-3 text-brand-800 placeholder:text-brand-400/60',
      'focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200/60 transition-all',
      errors[field] ? 'border-red-300 bg-red-50/80' : 'border-pastel-pink/60'
    );

  return (
    <PastelBackground variant="selection">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col px-4 py-6 sm:py-10">
        <header className="mb-6 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/70 px-4 py-2 shadow-soft backdrop-blur-sm">
            <Image src="/icons/icon-192.png" alt="" width={40} height={40} className="rounded-xl" priority />
            <span className="text-xl font-bold tracking-tight text-brand-700">VocabQuest</span>
          </div>
          <CharacterIllustration variant="hearts" size="md" animate="float" />
          <SpeechBubble className="max-w-xs">
            {isLogin ? 'Welcome back! Ready to learn?' : 'Join us — your language journey starts here ✿'}
          </SpeechBubble>
        </header>

        <Card padding="md" className="border-white/80 shadow-medium">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-brand-700">
              {isLogin ? 'Sign in' : 'Create account'}
            </h1>
            <p className="mt-1.5 text-sm text-brand-600/75">
              {isLogin
                ? 'Continue your vocabulary journey'
                : 'Free — learn Korean, Japanese & French'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-brand-700">Full name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={inputClass('fullName')}
                  placeholder="Your name"
                />
                {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={inputClass('email')}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-700">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={inputClass('password')}
                placeholder="At least 6 characters"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-brand-700">Confirm password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={inputClass('confirmPassword')}
                  placeholder="Repeat password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <Button type="submit" fullWidth size="lg" className="mt-2" disabled={submitting}>
              {submitting ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
            </Button>
          </form>

          <div className="mt-6 border-t border-pastel-pink/40 pt-5 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-brand-500 transition hover:text-brand-600"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </Card>
      </div>

      {showToast && <Toast message={toastMessage} variant="success" />}
    </PastelBackground>
  );
}
