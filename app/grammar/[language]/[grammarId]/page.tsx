'use client';

import { AppShell } from '@/components/ui/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ChibiMascot } from '@/components/ui/ChibiMascot';
import { CuteDecor } from '@/components/ui/CuteDecor';
import { getGrammarPoint, getGrammarPoints } from '@/lib/grammar-data';
import { playWordAudio } from '@/lib/playWord';
import { CheckCircle2, ChevronLeft, ChevronRight, Lightbulb, Volume2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GrammarLessonPage() {
  const [learned, setLearned] = useState(false);
  const router = useRouter();
  const params = useParams();
  const language = params.language as string;
  const grammarId = parseInt(params.grammarId as string, 10);

  const point = getGrammarPoint(language, grammarId);
  const all = getGrammarPoints(language);
  const idx = all.findIndex((g) => g.id === grammarId);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  useEffect(() => {
    if (!localStorage.getItem('userData')) router.push('/auth');
    const key = `grammar_learned_${language}_${grammarId}`;
    if (localStorage.getItem(key)) setLearned(true);
  }, [language, grammarId, router]);

  if (!point) {
    return (
      <AppShell backHref={`/grammar/${language}`} backLabel="Grammar" title="Not found">
        <Card><p className="text-brand-600 text-sm">This grammar point could not be loaded.</p></Card>
      </AppShell>
    );
  }

  const markLearned = () => {
    localStorage.setItem(`grammar_learned_${language}_${grammarId}`, '1');
    setLearned(true);
    if (next) {
      setTimeout(() => router.push(`/grammar/${language}/${next.id}`), 700);
    }
  };

  return (
    <AppShell
      backHref={`/grammar/${language}`}
      backLabel="Grammar"
      eyebrow={`TOPIK ${point.topikLevel} · ${point.category}`}
      title={point.titleKo}
      subtitle={point.title}
      maxWidth="lg"
    >
      <Card className="mb-6 relative overflow-hidden">
        <CuteDecor />
        <div className="relative flex flex-col items-center text-center py-4">
          <ChibiMascot mood="study" size="lg" className="mb-3" />
          <span className="text-4xl mb-2" aria-hidden="true">{point.image}</span>
          <p className="text-lg font-bold text-brand-700 korean-text bg-pastel-lavender/50 px-4 py-2 rounded-2xl">
            {point.pattern}
          </p>
          <p className="text-sm text-brand-600 mt-2">{point.meaning}</p>
        </div>
      </Card>

      <Card className="mb-4">
        <h3 className="text-sm font-semibold text-brand-700 mb-2">Explanation</h3>
        <p className="text-brand-800 text-sm leading-relaxed">{point.explanation}</p>
      </Card>

      <Card className="mb-4 bg-gradient-to-br from-pastel-sky/40 to-pastel-mint/30">
        <h3 className="text-sm font-semibold text-brand-700 mb-3">Example</h3>
        <p className="text-lg font-medium text-brand-900 korean-text mb-1">{point.exampleNative}</p>
        <p className="text-sm text-brand-600 mb-3">{point.exampleEnglish}</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => playWordAudio(language, point.exampleNative)}
        >
          <Volume2 className="w-4 h-4" />
          Hear example
        </Button>
      </Card>

      <Card className="mb-6 border-pastel-peach bg-pastel-peach/30">
        <div className="flex gap-3">
          <Lightbulb className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-brand-700 mb-1">Tip</h3>
            <p className="text-sm text-brand-800">{point.tip}</p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-between mb-6">
        {prev ? (
          <Button variant="secondary" onClick={() => router.push(`/grammar/${language}/${prev.id}`)}>
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
        ) : <div />}
        {next ? (
          <Button onClick={() => router.push(`/grammar/${language}/${next.id}`)}>
            Next lesson
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={() => router.push(`/grammar/${language}`)}>
            Back to list
          </Button>
        )}
      </div>

      <div className="text-center">
        <Button onClick={markLearned} disabled={learned} size="lg">
          {learned ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Learned
            </>
          ) : (
            'Mark as learned — next lesson'
          )}
        </Button>
      </div>

    </AppShell>
  );
}
