'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Volume2, CheckCircle, BookOpen } from 'lucide-react';
import type { Word, UserWordProgress } from '@/types';
import { useAudioPlayer } from '@/lib/audio';

interface StationCardProps {
  word: Word & { progress?: UserWordProgress };
  onWordClick: (word: Word) => void;
  onMarkLearned: (wordId: string) => void;
}

export default function StationCard({ word, onWordClick, onMarkLearned }: StationCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioPlayer = useAudioPlayer();

  const getStatusClass = () => {
    if (!word.progress || word.progress.status === 'NOT_STARTED') {
      return 'not-started';
    }
    if (word.progress.status === 'IN_PROGRESS') {
      return 'in-progress';
    }
    return 'learned';
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

  const getStatusText = () => {
    if (!word.progress || word.progress.status === 'NOT_STARTED') {
      return 'Not Started';
    }
    if (word.progress.status === 'IN_PROGRESS') {
      return 'In Progress';
    }
    return 'Learned';
  };

  const handleAudioPlay = async () => {
    try {
      setIsPlaying(true);
      const pronunciationMedia = word.media.find(m => m.role === 'PRONUNCIATION');
      if (pronunciationMedia) {
        await audioPlayer.play(pronunciationMedia.media.url, {
          onEnd: () => setIsPlaying(false),
          onError: () => setIsPlaying(false),
        });
      }
    } catch (error) {
      console.error('Failed to play audio:', error);
      setIsPlaying(false);
    }
  };

  const handleMarkLearned = () => {
    onMarkLearned(word.id);
  };

  const statusClass = getStatusClass();
  const statusColor = getStatusColor();
  const statusText = getStatusText();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`word-tile ${statusClass} p-6 cursor-pointer`}
      onClick={() => onWordClick(word)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onWordClick(word);
        }
      }}
      aria-label={`Learn word: ${word.lemma}`}
    >
      {/* Status indicator */}
      <div className="absolute top-3 right-3">
        <div className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor} bg-opacity-10`}>
          {statusText}
        </div>
      </div>

      {/* Word content */}
      <div className="text-center space-y-4">
        {/* Korean text */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold korean-text text-muted-800">
            {word.lemma}
          </h3>
          <p className="text-sm text-muted-600 font-mono">
            {word.phonetic}
          </p>
        </div>

        {/* Hebrew translation */}
        <div className="hebrew-text">
          <p className="text-lg font-medium text-muted-700">
            {word.translationHe}
          </p>
        </div>

        {/* English translation */}
        <p className="text-sm text-muted-500">
          {word.translationEn}
        </p>

        {/* Part of speech */}
        <div className="inline-block px-3 py-1 bg-muted-100 rounded-full">
          <span className="text-xs font-medium text-muted-600">
            {word.partOfSpeech.toLowerCase()}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center space-x-3 pt-2">
          {/* Audio button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAudioPlay();
            }}
            disabled={isPlaying}
            className="p-2 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors disabled:opacity-50"
            aria-label="Play pronunciation"
          >
            {isPlaying ? (
              <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          {/* Mark as learned button */}
          {word.progress?.status !== 'LEARNED' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMarkLearned();
              }}
              className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
              aria-label="Mark as learned"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}

          {/* Learn more button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWordClick(word);
            }}
            className="p-2 rounded-full bg-muted-100 text-muted-600 hover:bg-muted-200 transition-colors"
            aria-label="Learn more about this word"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>

        {/* Progress indicator */}
        {word.progress && (
          <div className="pt-2">
            <div className="flex items-center justify-center space-x-2 text-xs text-muted-500">
              <span>Attempts: {word.progress.totalAttempts}</span>
              <span>•</span>
              <span>Streak: {word.progress.correctStreak}</span>
            </div>
          </div>
        )}
      </div>

      {/* Visual indicator for learned words */}
      {word.progress?.status === 'LEARNED' && (
        <div className="absolute top-2 left-2">
          <CheckCircle className="w-6 h-6 text-green-500" />
        </div>
      )}
    </motion.div>
  );
}
