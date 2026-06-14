'use client';

import { ChibiMascot } from '@/components/ui/ChibiMascot';
import { useI18nContext } from '@/contexts/I18nContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';

interface KnownWordCelebrationProps {
  show: boolean;
  onDone?: () => void;
}

export function KnownWordCelebration({ show, onDone }: KnownWordCelebrationProps) {
  const { t } = useI18nContext();

  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.5, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: -20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className="relative flex flex-col items-center"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, rotate: 0 }}
                animate={{
                  scale: [0, 1.2, 0],
                  rotate: [0, 180],
                  x: Math.cos((i / 5) * Math.PI * 2) * 70,
                  y: Math.sin((i / 5) * Math.PI * 2) * 70 - 20,
                }}
                transition={{ duration: 0.9, delay: i * 0.05 }}
                className="absolute text-amber-400"
              >
                <Star className="w-5 h-5 fill-current" />
              </motion.span>
            ))}

            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 3, -3, 0] }}
              transition={{ repeat: 2, duration: 0.5 }}
              className="rounded-3xl bg-white/95 border-2 border-brand-200 shadow-soft px-8 py-6 flex flex-col items-center gap-3"
            >
              <ChibiMascot mood="cheer" size="md" />
              <div className="flex items-center gap-2 text-brand-700 font-bold text-lg">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>{t('got_it', 'common')}</span>
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-sm text-brand-500">{t('another_word_down', 'common')}</p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
