'use client';



import { CharacterIllustration } from '@/components/ui/CharacterIllustration';

import { cn } from '@/lib/cn';

import { type MascotId } from '@/lib/chibi-images';



export function CuteDecor({ className }: { className?: string }) {

  return (

    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">

      <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-pastel-pink/50 blur-2xl" />

      <div className="absolute -left-8 top-1/3 h-24 w-24 rounded-full bg-pastel-green/45 blur-2xl" />

      <div className="absolute bottom-0 right-1/4 h-20 w-20 rounded-full bg-pastel-mint/40 blur-xl" />

      <span className="cute-deco-bounce absolute left-4 top-3 text-lg opacity-50">🌸</span>

      <span className="cute-deco-star absolute right-8 top-6 text-sm opacity-40">✨</span>

      <span className="cute-deco-float absolute bottom-6 left-10 text-base opacity-35">💗</span>

    </div>

  );

}



export function CategoryHubCard({

  title,

  subtitle,

  emoji,

  accent,

  mascot,

  onClick,

  disabled,

}: {

  title: string;

  subtitle: string;

  emoji: string;

  accent: 'pink' | 'green' | 'peach' | 'sky';

  mascot?: MascotId;

  onClick?: () => void;

  disabled?: boolean;

}) {

  const accents = {

    pink: 'from-white/90 to-pastel-pink-light/80 border-pastel-pink/50 hover:border-brand-200 hover:shadow-medium',

    green: 'from-white/90 to-pastel-green-light/80 border-pastel-green/50 hover:border-success-200 hover:shadow-medium',

    peach: 'from-white/90 to-pastel-peach/60 border-pastel-peach/50 hover:border-brand-200',

    sky: 'from-white/90 to-pastel-sky/60 border-pastel-green/40 hover:border-success-200',

  };



  return (

    <button

      type="button"

      onClick={onClick}

      disabled={disabled}

      className={cn(

        'group relative min-h-[112px] w-full overflow-hidden rounded-3xl border bg-gradient-to-br p-5 text-left transition-all duration-200',

        accents[accent],

        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-[1.02] hover:shadow-cute'

      )}

    >

      <CuteDecor />

      {mascot && (

        <div className="absolute -bottom-2 -right-1 opacity-90 transition-transform group-hover:scale-105">

          <CharacterIllustration variant={mascot} size="sm" framed={false} />

        </div>

      )}

      <div className="relative flex items-center gap-4 pr-16">

        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/70 text-3xl shadow-soft backdrop-blur-sm">

          {emoji}

        </span>

        <div>

          <h3 className="text-lg font-bold text-brand-800">{title}</h3>

          <p className="mt-0.5 text-sm text-brand-600/85">{subtitle}</p>

        </div>

      </div>

    </button>

  );

}

