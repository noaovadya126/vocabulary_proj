'use client';

import { cn } from '@/lib/cn';
import { Check } from 'lucide-react';

interface KnownMarkButtonProps {
  isKnown: boolean;
  onMark: () => void;
  compact?: boolean;
  className?: string;
}

export function KnownMarkButton({ isKnown, onMark, compact, className }: KnownMarkButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (!isKnown) onMark();
      }}
      disabled={isKnown}
      title="I know this word"
      className={cn(
        'flex-shrink-0 rounded-xl border-2 flex flex-col items-center justify-center gap-0.5 transition-all font-semibold leading-tight',
        compact ? 'w-11 h-11 text-[8px] px-0.5' : 'w-12 sm:w-14 min-h-[3rem] text-[9px] px-1',
        isKnown
          ? 'border-success-300 bg-pastel-mint/60 text-success-700 cursor-default'
          : 'border-brand-200 bg-white hover:bg-pastel-mint/40 hover:border-success-300 text-brand-600 active:scale-95',
        className
      )}
    >
      <Check className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      <span>I know</span>
    </button>
  );
}
