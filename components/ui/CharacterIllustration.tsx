'use client';

import { ChibiMascot } from '@/components/ui/ChibiMascot';
import { cn } from '@/lib/cn';
import { type MascotId } from '@/lib/chibi-images';

const SIZES = { sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' } as const;

const MOOD_BY_VARIANT: Record<MascotId, 'happy' | 'thinking' | 'cheer' | 'study' | 'school' | 'hearts'> = {
  hearts: 'hearts',
  school: 'school',
  study: 'study',
};

interface CharacterIllustrationProps {
  variant?: MascotId;
  size?: keyof typeof SIZES;
  className?: string;
  animate?: 'float' | 'bounce' | 'none';
  priority?: boolean;
  /** Sit in a soft card frame instead of floating on the page */
  framed?: boolean;
}

export function CharacterIllustration({
  variant = 'hearts',
  size = 'md',
  className,
  animate = 'none',
  framed = true,
}: CharacterIllustrationProps) {
  const mascotSize = SIZES[size];
  const px = { sm: 64, md: 96, lg: 128, xl: 168 }[mascotSize];
  const animateClass =
    animate === 'float' ? 'animate-mascot-float' : animate === 'bounce' ? 'animate-mascot-bounce' : '';

  const mascot = (
    <ChibiMascot mood={MOOD_BY_VARIANT[variant]} size={mascotSize} className="w-full h-full" />
  );

  if (!framed) {
    return (
      <div
        className={cn('relative shrink-0 select-none', animateClass, className)}
        style={{ width: px, height: px }}
        aria-hidden="true"
      >
        {mascot}
      </div>
    );
  }

  return (
    <div className={cn('relative inline-flex flex-col items-center shrink-0 select-none', animateClass, className)} aria-hidden="true">
      <div
        className="overflow-hidden rounded-[1.75rem] border-2 border-white/90 bg-gradient-to-b from-white via-pastel-pink-light/40 to-pastel-green-light/30 shadow-soft"
        style={{ width: px + 16, height: px + 8 }}
      >
        <div className="flex h-full items-end justify-center px-2 pt-2">{mascot}</div>
      </div>
      <div className="mt-1.5 h-2 w-[65%] rounded-full bg-brand-300/20" />
    </div>
  );
}

interface SpeechBubbleProps {
  children: React.ReactNode;
  className?: string;
}

export function SpeechBubble({ children, className }: SpeechBubbleProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border-2 border-pastel-pink/50 bg-white px-4 py-3 text-sm font-medium text-brand-700 shadow-soft',
        'before:absolute before:-bottom-2 before:left-8 before:h-3 before:w-3 before:rotate-45 before:border-b-2 before:border-r-2 before:border-pastel-pink/50 before:bg-white',
        className
      )}
    >
      {children}
    </div>
  );
}
