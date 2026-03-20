'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { TOOLS, type ToolCategory } from '@/lib/tools';

interface ToolsGridProps {
  lang: string;
  dict: {
    tools: Record<string, { name: string; description: string; category: string }>;
    home: {
      search_placeholder: string;
      cat_all: string;
      cat_calculators: string;
      cat_developer: string;
      cat_random: string;
      cat_converters: string;
      cat_health: string;
      cat_utilities: string;
      no_results: string;
      stat_tools: string;
      stat_languages: string;
      stat_signup: string;
    };
  };
}

const CATEGORY_META: Record<ToolCategory | 'all', {
  labelKey: keyof ToolsGridProps['dict']['home'];
  color: string;
  activeColor: string;
  iconBg: string;
  iconColor: string;
  hoverBorder: string;
  badgeBg: string;
  sectionBorder: string;
  emoji: string;
}> = {
  all:         { labelKey: 'cat_all',         color: 'text-gray-600 dark:text-gray-400',   activeColor: 'bg-gray-700 text-white border-transparent',          iconBg: 'bg-gray-100 dark:bg-gray-800',          iconColor: 'text-gray-600 dark:text-gray-400', hoverBorder: 'hover:border-gray-400',   badgeBg: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',           sectionBorder: 'border-gray-200 dark:border-gray-700', emoji: '🔧' },
  calculators: { labelKey: 'cat_calculators', color: 'text-blue-600 dark:text-blue-400',   activeColor: 'bg-blue-600 text-white border-transparent',          iconBg: 'bg-blue-50 dark:bg-blue-900/20',        iconColor: 'text-blue-600 dark:text-blue-400', hoverBorder: 'hover:border-blue-400',   badgeBg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',         sectionBorder: 'border-blue-200 dark:border-blue-900', emoji: '🔢' },
  developer:   { labelKey: 'cat_developer',   color: 'text-violet-600 dark:text-violet-400', activeColor: 'bg-violet-600 text-white border-transparent',      iconBg: 'bg-violet-50 dark:bg-violet-900/20',    iconColor: 'text-violet-600 dark:text-violet-400', hoverBorder: 'hover:border-violet-400', badgeBg: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400', sectionBorder: 'border-violet-200 dark:border-violet-900', emoji: '⌨️' },
  random:      { labelKey: 'cat_random',      color: 'text-orange-600 dark:text-orange-400', activeColor: 'bg-orange-500 text-white border-transparent',      iconBg: 'bg-orange-50 dark:bg-orange-900/20',    iconColor: 'text-orange-600 dark:text-orange-400', hoverBorder: 'hover:border-orange-400', badgeBg: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400', sectionBorder: 'border-orange-200 dark:border-orange-900', emoji: '🎲' },
  converters:  { labelKey: 'cat_converters',  color: 'text-green-600 dark:text-green-400',  activeColor: 'bg-green-600 text-white border-transparent',        iconBg: 'bg-green-50 dark:bg-green-900/20',      iconColor: 'text-green-600 dark:text-green-400', hoverBorder: 'hover:border-green-400',  badgeBg: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',     sectionBorder: 'border-green-200 dark:border-green-900', emoji: '🔄' },
  health:      { labelKey: 'cat_health',      color: 'text-rose-600 dark:text-rose-400',    activeColor: 'bg-rose-600 text-white border-transparent',          iconBg: 'bg-rose-50 dark:bg-rose-900/20',        iconColor: 'text-rose-600 dark:text-rose-400', hoverBorder: 'hover:border-rose-400',   badgeBg: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',         sectionBorder: 'border-rose-200 dark:border-rose-900', emoji: '❤️' },
  utilities:   { labelKey: 'cat_utilities',   color: 'text-teal-600 dark:text-teal-400',    activeColor: 'bg-teal-600 text-white border-transparent',          iconBg: 'bg-teal-50 dark:bg-teal-900/20',        iconColor: 'text-teal-600 dark:text-teal-400', hoverBorder: 'hover:border-teal-400',   badgeBg: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',         sectionBorder: 'border-teal-200 dark:border-teal-900', emoji: '📝' },
};

const CATEGORY_ORDER: ToolCategory[] = ['calculators', 'developer', 'random', 'converters', 'health', 'utilities'];

export default function ToolsGrid({ lang, dict }: ToolsGridProps) {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');
  const [query, setQuery] = useState('');

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: TOOLS.length };
    for (const t of TOOLS) c[t.category] = (c[t.category] ?? 0) + 1;
    return c;
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return TOOLS.filter(tool => {
      const t = dict.tools[tool.dictKey];
      if (!t) return false;
      const matchCat = activeCategory === 'all' || tool.category === activeCategory;
      const matchQ = !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || tool.slug.includes(q);
      return matchCat && matchQ;
    });
  }, [activeCategory, query, dict.tools]);

  const groupedFiltered = useMemo(() => {
    const groups: Record<ToolCategory, typeof TOOLS> = { calculators: [], developer: [], random: [], converters: [], health: [], utilities: [] };
    for (const tool of filtered) groups[tool.category].push(tool);
    return groups;
  }, [filtered]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value) setActiveCategory('all');
  };

  const h = dict.home;

  return (
    <>
      {/* Search */}
      <div className="relative max-w-xl mx-auto mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder={h.search_placeholder}
          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all text-base shadow-sm"
        />
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {(['all', ...CATEGORY_ORDER] as const).map(cat => {
          const meta = CATEGORY_META[cat];
          const label = h[meta.labelKey] as string;
          const isActive = activeCategory === cat && !query;
          return (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setQuery(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${
                isActive
                  ? meta.activeColor
                  : `bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700 ${meta.color} hover:border-current`
              }`}
            >
              {cat !== 'all' && (
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white/70' : 'bg-current'}`} />
              )}
              {label}
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                {counts[cat] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tool sections */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg font-medium">{h.no_results}</p>
        </div>
      ) : (
        <div className="space-y-14">
          {CATEGORY_ORDER.map(cat => {
            const tools = groupedFiltered[cat];
            if (tools.length === 0) return null;
            const meta = CATEGORY_META[cat];
            const label = h[meta.labelKey] as string;
            return (
              <section key={cat}>
                {/* Section header */}
                <div className={`flex items-center gap-3 mb-5 pb-4 border-b-2 ${meta.sectionBorder}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${meta.iconBg}`}>
                    {meta.emoji}
                  </div>
                  <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">{label}</h2>
                  <span className="ml-auto text-sm text-gray-400 dark:text-gray-500 font-semibold">
                    {tools.length} {tools.length === 1 ? 'tool' : 'tools'}
                  </span>
                </div>

                {/* Tool cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {tools.map(tool => {
                    const t = dict.tools[tool.dictKey];
                    return (
                      <Link
                        key={tool.slug}
                        href={`/${lang}/${tool.slug}`}
                        className={`group flex flex-col p-5 bg-white dark:bg-[#1a1a1a] border-2 border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md ${meta.hoverBorder} transition-all duration-200`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-2.5 rounded-xl ${meta.iconBg} ${meta.iconColor} group-hover:scale-110 transition-transform`}>
                            <tool.icon size={22} />
                          </div>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${meta.badgeBg}`}>
                            {t.category}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5 leading-snug">
                          {t.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1">
                          {t.description}
                        </p>
                        <div className={`mt-4 text-xs font-bold flex items-center gap-1 ${meta.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                          Open tool →
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
