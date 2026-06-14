'use client';

import { AppShell } from '@/components/ui/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ChibiMascot } from '@/components/ui/ChibiMascot';
import { Toast } from '@/components/ui/Toast';
import { WordVideo } from '@/components/ui/WordVideo';
import { LANGUAGE_NAMES } from '@/lib/constants';
import { playWordAudio, stopWordAudio } from '@/lib/playWord';
import { warmUpSpeech } from '@/lib/speech';
import { WordImage } from '@/components/ui/WordImage';
import { getMilestoneWord, getMilestoneWords } from '@/lib/vocabulary-data';
import { getUserItem, setUserItem } from '@/lib/userStorage';
import { setWordNotes } from '@/lib/notes';
import { CheckCircle2, Volume2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function WordLearningPage() {
  const [showTranslation, setShowTranslation] = useState(false);
  const [notes, setNotes] = useState('');
  const [isPlayingWord, setIsPlayingWord] = useState(false);
  const [isPlayingSentence, setIsPlayingSentence] = useState(false);
  const [showGotIt, setShowGotIt] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const router = useRouter();
  const params = useParams();
  const language = params.language as string;
  const milestoneId = params.milestoneId as string;
  const wordId = parseInt(params.wordId as string, 10);

  const milestoneWords = getMilestoneWords(language, milestoneId);
  const currentWord = getMilestoneWord(language, wordId);
  const inMilestone = currentWord && milestoneWords.some((w) => w.id === wordId);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const selectedLanguage = localStorage.getItem('selectedLanguage');

    if (!userData) {
      router.push('/auth');
      return;
    }

    if (!selectedLanguage || selectedLanguage !== language) {
      router.push('/language-selection');
    }

    const savedNotes = getUserItem(`notes_${language}_${milestoneId}_${wordId}`);
    if (savedNotes) setNotes(savedNotes);
  }, [language, milestoneId, wordId, router]);

  useEffect(() => {
    warmUpSpeech();
    return () => stopWordAudio();
  }, []);

  const handleWordAudio = async () => {
    if (!currentWord) return;
    setIsPlayingWord(true);
    try {
      await playWordAudio(language, currentWord.native, currentWord.audioFile);
    } catch {
      setToastMessage('Audio playback failed.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsPlayingWord(false);
    }
  };

  const handleSentenceAudio = async () => {
    if (!currentWord?.exampleNative) return;
    setIsPlayingSentence(true);
    try {
      await playWordAudio(language, currentWord.exampleNative);
    } catch {
      setToastMessage('Sentence audio failed.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsPlayingSentence(false);
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    setWordNotes(language, milestoneId, String(wordId), newNotes);
  };

  const handleGotIt = () => {
    if (!currentWord) return;
    setShowGotIt(true);

    const progressKey = `progress_${language}_${milestoneId}`;
    const progress = JSON.parse(getUserItem(progressKey) || '{}');
    progress[wordId] = 'completed';

    const idx = milestoneWords.findIndex((w) => w.id === wordId);
    const nextWord = milestoneWords[idx + 1];
    if (nextWord) progress[nextWord.id] = 'learning';

    setUserItem(progressKey, JSON.stringify(progress));

    const milestoneProgressKey = `milestone_progress_${language}_${milestoneId}`;
    const milestoneData = JSON.parse(getUserItem(milestoneProgressKey) || '{}');
    milestoneData.completedWords = milestoneData.completedWords || [];
    if (!milestoneData.completedWords.includes(wordId)) {
      milestoneData.completedWords.push(wordId);
    }
    milestoneData.lastUpdated = new Date().toISOString();
    setUserItem(milestoneProgressKey, JSON.stringify(milestoneData));

    const vocabProgressKey = `word_progress_${language}`;
    const vocabProgress = JSON.parse(getUserItem(vocabProgressKey) || '{}');
    vocabProgress[`${language}_${wordId}`] = {
      ...(vocabProgress[`${language}_${wordId}`] || { correctStreak: 0, totalAttempts: 0, totalCorrect: 0 }),
      status: 'learned',
      lastSeenAt: new Date().toISOString(),
    };
    setUserItem(vocabProgressKey, JSON.stringify(vocabProgress));

    if (nextWord) {
      setToastMessage('Great! Moving to the next word...');
      setShowToast(true);
      setTimeout(
        () => router.push(`/word-learning/${language}/${milestoneId}/${nextWord.id}`),
        600
      );
    } else {
      setToastMessage('Milestone complete! All words learned.');
      setShowToast(true);
      setTimeout(() => router.push(`/milestone/${language}/${milestoneId}`), 1200);
    }
  };

  if (!currentWord || !inMilestone) {
    return (
      <AppShell backHref={`/milestone/${language}/${milestoneId}`} backLabel="Milestone" title="Word not found">
        <Card>
          <p className="text-slate-600 text-sm">This word could not be loaded. Return to the milestone and try again.</p>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell
      backHref={`/milestone/${language}/${milestoneId}`}
      backLabel="Milestone"
      eyebrow={`${currentWord.category} · TOPIK ${currentWord.topikLevel}`}
      title={currentWord.native}
      subtitle={`${LANGUAGE_NAMES[language] ?? language} · ${currentWord.english}`}
      maxWidth="lg"
    >
      <Card className="text-center mb-6 relative overflow-hidden">
        <ChibiMascot mood="happy" size="md" className="mx-auto mb-2" />
        <div className="flex justify-center mb-3">
          <WordImage english={currentWord.english} category={currentWord.category} wordId={String(currentWord.id)} nativeText={currentWord.native} language={language} size="lg" />
        </div>
        <p className="text-sm text-slate-500 font-mono mb-1">{currentWord.phonetic}</p>
        {showTranslation && (
          <p className="text-lg text-indigo-600 font-medium">{currentWord.english}</p>
        )}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <Button variant="secondary" size="sm" onClick={() => setShowTranslation(!showTranslation)}>
            {showTranslation ? 'Hide meaning' : 'Show meaning'}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleWordAudio} disabled={isPlayingWord}>
            <Volume2 className="w-4 h-4" />
            {isPlayingWord ? 'Playing...' : 'Word audio'}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleSentenceAudio} disabled={isPlayingSentence}>
            <Volume2 className="w-4 h-4" />
            {isPlayingSentence ? 'Playing...' : 'Sentence audio'}
          </Button>
        </div>
      </Card>

      <WordVideo
        className="mb-6"
        language={language}
        wordId={currentWord.id}
        nativeText={currentWord.native}
        exampleNative={currentWord.exampleNative}
        exampleEnglish={currentWord.exampleEnglish}
        category={currentWord.category}
        english={currentWord.english}
        youtubeId={currentWord.youtubeId}
        audioFile={currentWord.audioFile}
        imageEmoji={currentWord.image}
        autoPlayWord={false}
      />

      <Card className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Personal notes</label>
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Add a memory hook or example sentence..."
          className="w-full h-24 p-3 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <p className="text-xs text-slate-500 mt-2">Saved automatically</p>
      </Card>

      <div className="text-center">
        <Button onClick={handleGotIt} disabled={showGotIt} size="lg">
          {showGotIt ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Completed
            </>
          ) : (
            'Mark as learned — next word'
          )}
        </Button>
      </div>

      {showToast && <Toast message={toastMessage} variant="success" />}
    </AppShell>
  );
}
