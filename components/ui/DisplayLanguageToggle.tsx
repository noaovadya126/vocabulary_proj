'use client';

import { useI18nContext } from '@/contexts/I18nContext';
import { cn } from '@/lib/cn';

export function DisplayLanguageToggle() {
  const { displayLanguage, setDisplayLanguage } = useI18nContext();

  return (
    <div
      className="flex rounded-xl border border-brand-100 bg-white/80 p-0.5 text-xs font-semibold"
      role="group"
      aria-label="Display language"
    >
      <button
        type="button"
        onClick={() => setDisplayLanguage('en')}
        className={cn(
          'px-2.5 py-1 rounded-lg transition-colors',
          displayLanguage === 'en'
            ? 'bg-brand-400 text-white shadow-sm'
            : 'text-brand-600 hover:bg-brand-50'
        )}
        aria-pressed={displayLanguage === 'en'}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setDisplayLanguage('he')}
        className={cn(
          'px-2.5 py-1 rounded-lg transition-colors',
          displayLanguage === 'he'
            ? 'bg-brand-400 text-white shadow-sm'
            : 'text-brand-600 hover:bg-brand-50'
        )}
        aria-pressed={displayLanguage === 'he'}
      >
        עב
      </button>
    </div>
  );
}
