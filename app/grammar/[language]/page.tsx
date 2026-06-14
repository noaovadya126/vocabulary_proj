'use client';

import { AppShell } from '@/components/ui/AppShell';
import { Card } from '@/components/ui/Card';
import { CuteDecor } from '@/components/ui/CuteDecor';
import { HubTabBar } from '@/components/ui/HubTabBar';
import { LANGUAGE_NAMES } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { getGrammarPoints } from '@/lib/grammar-data';
import { ChevronRight } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GrammarListPage() {
  const [topikFilter, setTopikFilter] = useState<1 | 2 | 0>(0);
  const router = useRouter();
  const params = useParams();
  const language = params.language as string;

  const allGrammar = getGrammarPoints(language);
  const grammar = topikFilter === 0 ? allGrammar : allGrammar.filter((g) => g.topikLevel === topikFilter);

  useEffect(() => {
    if (!localStorage.getItem('userData')) router.push('/auth');
  }, [router]);

  if (language !== 'ko') {
    return (
      <AppShell backHref={`/map/${language}`} backLabel="Hub" title="Grammar" subtitle="Grammar lessons are available for Korean.">
        <Card><p className="text-brand-600 text-sm">Select Korean to access TOPIK grammar.</p></Card>
      </AppShell>
    );
  }

  return (
    <AppShell
      backHref={`/map/${language}`}
      backLabel="Hub"
      eyebrow="Grammar"
      title={`${LANGUAGE_NAMES[language]} grammar`}
      subtitle="TOPIK 1 & 2 patterns — learn step by step with cute examples."
      maxWidth="2xl"
    >
      <div className="mb-6 flex justify-center">
        <HubTabBar
          tabs={[
            {
              id: 'vocabulary',
              emoji: '📚',
              label: 'Vocabulary',
              onClick: () => router.push(`/vocabulary/${language}`),
            },
            {
              id: 'grammar',
              emoji: '✏️',
              label: 'Grammar',
              badge: String(allGrammar.length),
              active: true,
            },
          ]}
        />
      </div>

      <Card padding="sm" className="mb-6 relative overflow-hidden">
        <CuteDecor />
        <div className="relative flex flex-wrap gap-2">
          {([0, 1, 2] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setTopikFilter(level)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                topikFilter === level ? 'bg-brand-400 text-white' : 'bg-pastel-lavender/50 text-brand-700 hover:bg-pastel-lavender'
              )}
            >
              {level === 0 ? 'All' : `TOPIK ${level}`}
            </button>
          ))}
        </div>
      </Card>

      <div className="space-y-2">
        {grammar.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => router.push(`/grammar/${language}/${g.id}`)}
            className="w-full text-left rounded-2xl border border-brand-100 bg-white/90 p-4 hover:bg-pastel-lavender/30 hover:border-brand-200 transition-all flex items-center gap-4"
          >
            <span className="text-2xl" aria-hidden="true">{g.image}</span>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-brand-500 font-medium">TOPIK {g.topikLevel} · {g.category}</span>
              <p className="font-semibold text-brand-800 korean-text">{g.titleKo}</p>
              <p className="text-sm text-brand-600 truncate">{g.title}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-brand-300 shrink-0" />
          </button>
        ))}
      </div>

    </AppShell>
  );
}
