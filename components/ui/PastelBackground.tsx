'use client';

import { cn } from '@/lib/cn';
import { ReactNode } from 'react';

interface PastelBackgroundProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'hub' | 'selection';
}

export function PastelBackground({ children, className, variant = 'default' }: PastelBackgroundProps) {
  return (
    <div className={cn('relative min-h-screen cute-page-bg overflow-x-hidden', className)}>
      <div className="cute-pattern-overlay pointer-events-none absolute inset-0" aria-hidden="true" />
      {variant === 'hub' && (
        <>
          <span className="cute-deco cute-deco-heart absolute top-24 left-[8%] text-2xl opacity-40">💗</span>
          <span className="cute-deco cute-deco-star absolute top-40 right-[12%] text-xl opacity-35">✨</span>
          <span className="cute-deco cute-deco-spark absolute bottom-32 left-[15%] text-lg opacity-30">🌸</span>
          <span className="cute-deco cute-deco-float absolute top-1/2 right-[6%] text-2xl opacity-25">⭐</span>
        </>
      )}
      {variant === 'selection' && (
        <>
          <span className="cute-deco cute-deco-float absolute top-16 right-[10%] text-3xl opacity-35">🌸</span>
          <span className="cute-deco cute-deco-bounce absolute bottom-24 left-[8%] text-2xl opacity-30">💫</span>
          <span className="cute-deco cute-deco-heart absolute top-1/3 left-[5%] text-xl opacity-25">💕</span>
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
