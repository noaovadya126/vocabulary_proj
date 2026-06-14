'use client';

import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const selectedLanguage = localStorage.getItem('selectedLanguage');

    if (userData && selectedLanguage) {
      router.push(`/map/${selectedLanguage}`);
    } else if (userData) {
      router.push('/language-selection');
    } else {
      router.push('/auth');
    }
  }, [router]);

  return <LoadingScreen message="Preparing your learning journey..." />;
}
