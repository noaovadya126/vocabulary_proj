'use client';

import { ChibiMascot } from '@/components/ui/ChibiMascot';
import { playSuccessSfx } from '@/lib/sfx';
import { useI18nContext } from '@/contexts/I18nContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Star } from 'lucide-react';
import { useEffect } from 'react';

interface KnownWordCelebrationProps {
  show: boolean;
  wordLabel?: string;
  onDone?: () => void;
}

const CONFETTI = ['🌸', '✨', '💗', '⭐', '💕', '🎀', '💖', '🌟'];

export function KnownWordCelebration({ show, wordLabel, onDone }: KnownWordCelebrationProps) {
  const { t } = useI18nContext();

  useEffect(() => {
    if (show) playSuccessSfx();
  }, [show]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-900/20 backdrop-blur-[2px]"
        >
          {CONFETTI.map((emoji, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1.2, 1, 0.6],
                y: [0, -40 - i * 12, -120 - i * 20],
                x: [(i - 4) * 20, (i - 4) * 35, (i - 4) * 50],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 1.4, delay: i * 0.06, ease: 'easeOut' }}
              className="pointer-events-none absolute text-2xl"
              style={{ top: '45%' }}
            >
              {emoji}
            </motion.span>
          ))}

          <motion.div
            initial={{ scale: 0.3, y: 60, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.85, y: -30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18 }}
            className="relative mx-4 flex max-w-sm flex-col items-center rounded-[2rem] border-2 border-white bg-gradient-to-b from-white via-pastel-pink-light/80 to-pastel-green-light/60 px-8 py-8 shadow-cute"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{
                  scale: [0, 1.3, 0],
                  rotate: [0, 180],
                  x: Math.cos((i / 5) * Math.PI * 2) * 90,
                  y: Math.sin((i / 5) * Math.PI * 2) * 90 - 30,
                }}
                transition={{ duration: 1, delay: 0.15 + i * 0.05 }}
                className="absolute text-amber-400"
              >
                <Star className="h-5 w-5 fill-current" />
              </motion.span>
            ))}

            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 4, -4, 0] }}
              transition={{ repeat: 2, duration: 0.45 }}
            >
              <ChibiMascot mood="cheer" size="lg" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 flex items-center gap-2 text-xl font-bold text-brand-700"
            >
              <Sparkles className="h-5 w-5 text-amber-400" />
              <span>{t('got_it', 'common')}</span>
              <Heart className="h-5 w-5 fill-pastel-pink text-brand-400" />
            </motion.div>

            {wordLabel && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-2 text-center text-lg font-semibold text-brand-600 japanese-text korean-text"
              >
                {wordLabel}
              </motion.p>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-1 text-sm text-brand-500"
            >
              {t('another_word_down', 'common')}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
