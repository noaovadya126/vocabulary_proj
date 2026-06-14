'use client';



import { AudioMuteButton } from '@/components/ui/AudioMuteButton';

import { Button } from '@/components/ui/Button';

import { CharacterIllustration } from '@/components/ui/CharacterIllustration';

import { PastelBackground } from '@/components/ui/PastelBackground';

import { useI18nContext } from '@/contexts/I18nContext';

import { cn } from '@/lib/cn';

import { clearUserData } from '@/lib/auth';

import { ArrowLeft, LogOut } from 'lucide-react';

import { useRouter } from 'next/navigation';

import { ReactNode } from 'react';



interface AppShellProps {

  children: ReactNode;

  title?: string;

  subtitle?: string;

  eyebrow?: string;

  backHref?: string;

  backLabel?: string;

  showLogout?: boolean;

  maxWidth?: 'md' | 'lg' | 'xl' | '2xl' | '4xl';

  headerActions?: ReactNode;

  backgroundVariant?: 'default' | 'hub' | 'selection';

}



const maxWidthClass = {

  md: 'max-w-2xl',

  lg: 'max-w-3xl',

  xl: 'max-w-4xl',

  '2xl': 'max-w-5xl',

  '4xl': 'max-w-6xl',

};



export function AppShell({

  children,

  title,

  subtitle,

  eyebrow,

  backHref,

  backLabel,

  showLogout = true,

  maxWidth = 'xl',

  headerActions,

  backgroundVariant = 'default',

}: AppShellProps) {

  const router = useRouter();

  const { t } = useI18nContext();

  const resolvedBackLabel = backLabel ?? t('back', 'common');



  const handleLogout = () => {

    clearUserData();

    localStorage.removeItem('selectedLanguage');

    router.push('/auth');

  };



  return (

    <PastelBackground variant={backgroundVariant}>

      <header className="sticky top-0 z-40 border-b border-pastel-pink/40 bg-white/85 backdrop-blur-md shadow-soft">

        <div

          className={cn(

            'mx-auto flex items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3',

            maxWidthClass[maxWidth]

          )}

        >

          <div className="flex min-w-0 items-center gap-2">

            {backHref ? (

              <Button variant="ghost" size="sm" onClick={() => router.push(backHref)} className="shrink-0">

                <ArrowLeft className="h-4 w-4" />

                {resolvedBackLabel}

              </Button>

            ) : (

              <div className="flex shrink-0 items-center gap-2">

                <CharacterIllustration variant="hearts" size="sm" />

                <span className="hidden bg-gradient-to-r from-brand-500 to-success-500 bg-clip-text font-bold text-transparent sm:inline">

                  VocabQuest

                </span>

              </div>

            )}

          </div>



          <div className="flex shrink-0 items-center gap-2">

            {headerActions}

            <AudioMuteButton />

            {showLogout && (

              <Button variant="ghost" size="sm" onClick={handleLogout}>

                <LogOut className="h-4 w-4" />

                <span className="hidden sm:inline">{t('logout', 'common')}</span>

              </Button>

            )}

          </div>

        </div>

      </header>



      <main className={cn('mx-auto px-3 py-4 sm:px-4 sm:py-6 md:py-8', maxWidthClass[maxWidth])}>

        {(eyebrow || title || subtitle) && (

          <div className="mb-4 sm:mb-6 md:mb-8">

            {eyebrow && (

              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-success-600 sm:text-sm">

                ✿ {eyebrow}

              </p>

            )}

            {title && (

              <h1 className="text-xl font-bold tracking-tight text-brand-700 sm:text-2xl md:text-3xl">{title}</h1>

            )}

            {subtitle && <p className="mt-1 text-sm text-brand-600/80 sm:mt-2 sm:text-base">{subtitle}</p>}

          </div>

        )}

        {children}

      </main>

    </PastelBackground>

  );

}

