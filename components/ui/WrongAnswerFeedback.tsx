'use client';

import { Button } from '@/components/ui/Button';
import { setWordNotes, setWordNotesByNative } from '@/lib/notes';
import { cn } from '@/lib/cn';
import { BookOpen, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface WrongAnswerFeedbackProps {
  hasNotes: boolean;
  notes: string;
  language: string;
  milestoneId?: string;
  wordId?: string | number;
  nativeWord?: string;
  onRetry: () => void;
  onSkip?: () => void;
  showCorrectAnswer?: boolean;
  correctAnswer?: string;
  className?: string;
}

export function WrongAnswerFeedback({
  hasNotes,
  notes,
  language,
  milestoneId,
  wordId,
  nativeWord,
  onRetry,
  onSkip,
  showCorrectAnswer = false,
  correctAnswer,
  className,
}: WrongAnswerFeedbackProps) {
  const [draftNote, setDraftNote] = useState('');
  const [saved, setSaved] = useState(false);

  const saveNote = () => {
    const trimmed = draftNote.trim();
    if (!trimmed) return;
    if (milestoneId && wordId != null) {
      setWordNotes(language, milestoneId, String(wordId), trimmed);
    } else if (nativeWord) {
      setWordNotesByNative(language, nativeWord, trimmed);
    }
    setSaved(true);
  };

  return (
    <div className={cn('space-y-3', className)}>
      {hasNotes ? (
        <div className="rounded-xl bg-white/80 p-3 border border-brand-100">
          <p className="text-xs font-medium text-brand-500 mb-1 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            Hint from your notes
          </p>
          <p className="text-sm text-brand-800 whitespace-pre-wrap">{notes}</p>
        </div>
      ) : (
        <div className="rounded-xl bg-white/80 p-3 border border-brand-100 space-y-2">
          <p className="text-sm text-brand-700">No notes yet — add a memory hook for next time:</p>
          <textarea
            value={draftNote}
            onChange={(e) => {
              setDraftNote(e.target.value);
              setSaved(false);
            }}
            rows={2}
            placeholder="e.g. sounds like..."
            className="w-full rounded-lg border border-brand-100 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          <Button type="button" size="sm" variant="secondary" onClick={saveNote} disabled={!draftNote.trim()}>
            {saved ? 'Saved ✓' : 'Save note'}
          </Button>
        </div>
      )}

      {showCorrectAnswer && correctAnswer && (
        <p className="text-sm text-brand-700">
          Correct answer: <strong>{correctAnswer}</strong>
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Button type="button" onClick={onRetry} variant="secondary">
          <RotateCcw className="w-4 h-4" />
          Try again
        </Button>
        {onSkip && (
          <Button type="button" onClick={onSkip} variant="ghost">
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
