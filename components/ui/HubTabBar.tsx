'use client';

import { cn } from '@/lib/cn';

export interface HubTabItem {
  id: string;
  label: string;
  emoji?: string;
  badge?: string;
  disabled?: boolean;
  active?: boolean;
  onClick?: () => void;
}

export function HubTabBar({ tabs, className }: { tabs: HubTabItem[]; className?: string }) {
  return (
    <div
      className={cn(
        'inline-flex w-full max-w-md rounded-xl border border-brand-200/60 bg-pastel-pink-light/40 p-0.5 shadow-soft',
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          disabled={tab.disabled && !tab.active}
          onClick={tab.active ? undefined : tab.onClick}
          className={cn(
            'flex flex-1 items-center justify-center gap-1 rounded-[10px] border px-2 py-1.5 text-xs font-semibold transition-all sm:px-3 sm:py-2 sm:text-sm',
            tab.active
              ? 'border-brand-300 bg-white text-brand-800 shadow-sm ring-1 ring-brand-200/50'
              : tab.disabled
                ? 'cursor-not-allowed border-transparent text-brand-300'
                : 'border-transparent bg-white/60 text-brand-600 hover:bg-white hover:text-brand-800 active:scale-[0.98]'
          )}
        >
          {tab.emoji && <span className="text-base leading-none sm:text-lg">{tab.emoji}</span>}
          <span>{tab.label}</span>
          {tab.badge && (
            <span className="hidden rounded-full bg-pastel-pink/80 px-1.5 py-0.5 text-[10px] font-medium text-brand-600 sm:inline">
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
