'use client';

import { useAudioPlayer } from '@/lib/audio';
import type { UserWordProgress, Word } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, CheckCircle, Volume2, X } from 'lucide-react';
import { useState } from 'react';

interface WordModalProps {
  word: Word & { progress?: UserWordProgress };
  isOpen: boolean;
  onClose: () => void;
  onMarkLearned: (wordId: string) => void;
}

export default function WordModal({ word, isOpen, onClose, onMarkLearned }: WordModalProps) {
  const audioPlayer = useAudioPlayer();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAudioPlay = async () => {
    try {
      setIsPlaying(true);
      const pronunciationMedia = word.media.find(m => m.role === 'PRONUNCIATION');
      if (pronunciationMedia) {
        // Check if this is a placeholder file
        if (pronunciationMedia.media.url.includes('#')) {
          console.info('Audio placeholder detected. Replace with real MP3 files for pronunciation playback.');
          alert('🎵 Audio pronunciation coming soon! This is a placeholder file.');
          setIsPlaying(false);
          return;
        }
        
        await audioPlayer.play(pronunciationMedia.media.url, {
          onEnd: () => setIsPlaying(false),
          onError: (error) => {
            console.error('Audio playback failed:', error);
            setIsPlaying(false);
            alert('🎵 Audio playback failed. Please check your audio files.');
          },
        });
      } else {
        alert('🎵 No pronunciation audio available for this word yet.');
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Failed to play audio:', error);
      setIsPlaying(false);
      alert('🎵 Audio playback error. Please check your audio files.');
    }
  };

  const handleMarkLearned = () => {
    onMarkLearned(word.id);
    onClose();
  };

  const getStatusClass = () => {
    if (!word.progress || word.progress.status === 'NOT_STARTED') {
      return 'border-muted-300 bg-muted-100';
    }
    if (word.progress.status === 'IN_PROGRESS') {
      return 'border-blue-300 bg-blue-50';
    }
    return 'border-green-300 bg-green-50';
  };

  const getStatusText = () => {
    if (!word.progress || word.progress.status === 'NOT_STARTED') {
      return 'Not Started';
    }
    if (word.progress.status === 'IN_PROGRESS') {
      return 'In Progress';
    }
    return 'Learned';
  };

  const getStatusColor = () => {
    if (!word.progress || word.progress.status === 'NOT_STARTED') {
      return 'text-muted-500';
    }
    if (word.progress.status === 'IN_PROGRESS') {
      return 'text-blue-600';
    }
    return 'text-green-600';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-muted-200">
              <div>
                <h2 className="text-2xl font-bold text-muted-800">
                  {word.lemma}
                </h2>
                <p className="text-muted-600">
                  {word.phonetic}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6 text-muted-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Main Image */}
              <div className="text-center">
                {word.media.find(m => m.role === 'IMAGE') ? (
                  <img
                    src={word.media.find(m => m.role === 'IMAGE')!.media.url}
                    alt={word.media.find(m => m.role === 'IMAGE')!.media.alt}
                    className="w-full max-w-md h-auto rounded-xl shadow-lg mx-auto"
                  />
                ) : (
                  <div className="w-full max-w-md h-64 bg-muted-100 rounded-xl flex items-center justify-center mx-auto">
                    <BookOpen className="w-16 h-16 text-muted-400" />
                  </div>
                )}
              </div>

              {/* Word Details */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-muted-700 mb-2">Hebrew Translation</h3>
                    <p className="text-xl hebrew-text text-muted-800">
                      {word.translationHe}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-muted-700 mb-2">English Translation</h3>
                    <p className="text-lg text-muted-800">
                      {word.translationEn}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-muted-700 mb-2">Part of Speech</h3>
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                      {word.partOfSpeech.toLowerCase()}
                    </span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-muted-700 mb-2">Example (Korean)</h3>
                    <p className="text-lg korean-text text-muted-800">
                      {word.exampleNative}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-muted-700 mb-2">Example (Hebrew)</h3>
                    <p className="text-lg hebrew-text text-muted-800">
                      {word.exampleTranslationHe}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-muted-700 mb-2">Learning Status</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusClass()}`}>
                      <span className={getStatusColor()}>
                        {getStatusText()}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Information */}
              {word.progress && (
                <div className="bg-muted-50 rounded-lg p-4">
                  <h3 className="font-semibold text-muted-700 mb-3">Learning Progress</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-600">Total Attempts:</span>
                      <span className="ml-2 font-semibold text-muted-800">
                        {word.progress.totalAttempts}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-600">Correct Streak:</span>
                      <span className="ml-2 font-semibold text-muted-800">
                        {word.progress.correctStreak}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-600">Total Correct:</span>
                      <span className="ml-2 font-semibold text-muted-800">
                        {word.progress.totalCorrect}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-600">Last Updated:</span>
                      <span className="ml-2 font-semibold text-muted-800">
                        {new Date(word.progress.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between p-6 border-t border-muted-200 bg-muted-50">
              <div className="flex items-center space-x-3">
                {/* Audio Button */}
                <button
                  onClick={handleAudioPlay}
                  disabled={isPlaying}
                  className="p-3 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors disabled:opacity-50"
                  aria-label="Play pronunciation"
                >
                  {isPlaying ? (
                    <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>

                {/* Mark as Learned Button */}
                {word.progress?.status !== 'LEARNED' && (
                  <button
                    onClick={handleMarkLearned}
                    className="p-3 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                    aria-label="Mark as learned"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
              </div>

              <button
                onClick={onClose}
                className="px-6 py-2 bg-muted-200 text-muted-700 rounded-lg hover:bg-muted-300 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
