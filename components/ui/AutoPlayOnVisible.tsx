'use client';

import { useAutoPlayWord } from '@/lib/useAutoPlayWord';
import { useEffect, useRef, useState } from 'react';

interface AutoPlayOnVisibleProps {
  language: string;
  nativeText: string;
  audioFile?: string;
  children: React.ReactNode;
  className?: string;
}

/** Plays pronunciation when this word cell scrolls into view. */
export function AutoPlayOnVisible({
  language,
  nativeText,
  audioFile,
  children,
  className,
}: AutoPlayOnVisibleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useAutoPlayWord(language, nativeText, audioFile, visible);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
