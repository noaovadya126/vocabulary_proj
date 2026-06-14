'use client';

import { cn } from '@/lib/cn';

interface ChibiMascotProps {
  mood?: 'happy' | 'thinking' | 'cheer' | 'study' | 'school' | 'hearts';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = { sm: 64, md: 96, lg: 128, xl: 168 };

/** Cute chibi mascot — inline SVG, no external images needed */
export function ChibiMascot({ mood = 'happy', size = 'md', className }: ChibiMascotProps) {
  const px = sizes[size];

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 120 120"
      className={cn('drop-shadow-sm', className)}
      aria-hidden="true"
    >
      <ellipse cx="60" cy="108" rx="28" ry="6" fill="#e8dff5" opacity="0.6" />
      <circle cx="60" cy="62" r="38" fill="#ffe8dc" />
      <ellipse cx="60" cy="58" rx="34" ry="32" fill="#fff5f0" />
      <circle cx="44" cy="54" r="5" fill="#5c4a78" />
      <circle cx="76" cy="54" r="5" fill="#5c4a78" />
      <circle cx="45" cy="52" r="1.5" fill="white" />
      <circle cx="77" cy="52" r="1.5" fill="white" />
      {mood === 'thinking' ? (
        <path d="M52 72 Q60 68 68 72" stroke="#c4b0dc" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : mood === 'cheer' ? (
        <path d="M48 70 Q60 82 72 70" stroke="#e8919a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M50 72 Q60 78 70 72" stroke="#e8919a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
      <ellipse cx="38" cy="64" rx="7" ry="4" fill="#fce8ef" opacity="0.7" />
      <ellipse cx="82" cy="64" rx="7" ry="4" fill="#fce8ef" opacity="0.7" />
      <ellipse cx="60" cy="28" rx="36" ry="14" fill="#8f74b5" />
      <ellipse cx="48" cy="22" rx="10" ry="8" fill="#a890c8" />
      <ellipse cx="72" cy="22" rx="10" ry="8" fill="#a890c8" />
      {mood === 'study' && (
        <rect x="78" y="78" width="22" height="16" rx="3" fill="#d8f0e4" stroke="#6db89a" strokeWidth="1.5" />
      )}
      {mood === 'school' && (
        <>
          <rect x="74" y="76" width="26" height="18" rx="3" fill="#fff8e8" stroke="#d4a574" strokeWidth="1.5" />
          <path d="M87 76 L87 70 L93 73 L87 76" fill="#d4a574" />
        </>
      )}
      {(mood === 'cheer' || mood === 'hearts') && (
        <>
          <text x="18" y="30" fontSize="14">✨</text>
          <text x="92" y="28" fontSize="12">⭐</text>
        </>
      )}
      {mood === 'hearts' && (
        <>
          <text x="8" y="52" fontSize="12">💗</text>
          <text x="98" y="48" fontSize="11">💕</text>
        </>
      )}
    </svg>
  );
}
