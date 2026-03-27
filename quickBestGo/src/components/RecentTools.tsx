'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';

const STORAGE_KEY = 'qbg_recent';
const MAX_ITEMS = 6;

export interface RecentToolEntry {
  slug: string;
  name: string;
  emoji: string;
}

export function saveRecentTool(slug: string, name: string, emoji: string): void {
  if (typeof window === 'undefined') return;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const items: RecentToolEntry[] = stored ? (JSON.parse(stored) as RecentToolEntry[]) : [];
    const filtered = items.filter(i => i.slug !== slug);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ slug, name, emoji }, ...filtered].slice(0, MAX_ITEMS))
    );
  } catch {
    // localStorage unavailable
  }
}

export default function RecentTools({ lang }: { lang: string }) {
  const [tools, setTools] = useState<RecentToolEntry[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setTools(JSON.parse(stored) as RecentToolEntry[]);
    } catch {
      // ignore
    }
  }, []);

  if (tools.length === 0) return null;

  return (
    <div className="mb-8 p-5 bg-brand-primary/5 dark:bg-brand-primary/5 border border-brand-primary/15 dark:border-brand-primary/15 rounded-2xl">
      <div className="flex items-center gap-2 mb-3">
        <Clock size={13} className="text-brand-primary" aria-hidden="true" />
        <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">
          Recently Used
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {tools.map(tool => (
          <Link
            key={tool.slug}
            href={`/${lang}/${tool.slug}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1a1a1a] border border-brand-primary/20 dark:border-brand-primary/20 rounded-xl text-sm font-medium text-brand-text dark:text-gray-300 hover:border-brand-primary hover:text-brand-primary dark:hover:text-brand-primary transition-all duration-150 hover:scale-[1.02]"
          >
            <span className="text-sm leading-none" aria-hidden="true">{tool.emoji}</span>
            {tool.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
