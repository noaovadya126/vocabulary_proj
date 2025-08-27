'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to auth page
    router.push('/auth');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white text-4xl font-bold">VQ</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ברוכים הבאים ל-VocabQuest! 🎯
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          אפליקציית למידת השפות האינטראקטיבית שלכם
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="text-gray-500 mt-4">מעביר אותך לדף ההתחברות...</p>
      </div>
    </div>
  );
}
