'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Heart } from 'lucide-react';
import { TOOLS, type ToolCategory } from '@/lib/tools';
import RecentTools, { saveRecentTool } from './RecentTools';

const FAVORITES_KEY = 'qbg_favorites';

function loadFavorites(): Set<string> {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? new Set(JSON.parse(stored) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveFavorites(favs: Set<string>): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favs)));
  } catch { /* ignore */ }
}

type ActiveTab = ToolCategory | 'all' | 'favorites';

interface ToolsGridProps {
  lang: string;
  dict: {
    tools: Record<string, { name: string; description: string; category: string }>;
    home: {
      search_placeholder: string;
      cat_favorites: string;
      fav_empty_title: string;
      fav_empty_desc: string;
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
  textColor: string;
  activeColor: string;
  iconBg: string;
  iconColor: string;
  hoverBorder: string;
  badgeBg: string;
  sectionBorder: string;
  accentBar: string;
  countBg: string;
  emoji: string;
}> = {
  all: {
    labelKey: 'cat_all',
    textColor:     'text-gray-600 dark:text-gray-400',
    activeColor:   'bg-[#111827] dark:bg-gray-700 text-white border-transparent',
    iconBg:        'bg-gray-100 dark:bg-gray-800',
    iconColor:     'text-gray-600 dark:text-gray-400',
    hoverBorder:   'hover:border-gray-400',
    badgeBg:       'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
    sectionBorder: 'border-gray-200 dark:border-gray-700',
    accentBar:     'bg-gray-400',
    countBg:       'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
    emoji: '🔧',
  },
  calculators: {
    labelKey: 'cat_calculators',
    textColor:     'text-[#990FFA]',
    activeColor:   'bg-[#990FFA] text-white border-transparent',
    iconBg:        'bg-[#990FFA]/10 dark:bg-[#990FFA]/10',
    iconColor:     'text-[#990FFA]',
    hoverBorder:   'hover:border-[#990FFA]/40',
    badgeBg:       'bg-[#990FFA]/10 text-[#990FFA]',
    sectionBorder: 'border-[#990FFA]/25 dark:border-[#990FFA]/20',
    accentBar:     'bg-[#990FFA]',
    countBg:       'bg-[#990FFA]/10 text-[#990FFA]',
    emoji: '🔢',
  },
  developer: {
    labelKey: 'cat_developer',
    textColor:     'text-[#E60076]',
    activeColor:   'bg-[#E60076] text-white border-transparent',
    iconBg:        'bg-[#E60076]/10 dark:bg-[#E60076]/10',
    iconColor:     'text-[#E60076]',
    hoverBorder:   'hover:border-[#E60076]/40',
    badgeBg:       'bg-[#E60076]/10 text-[#E60076]',
    sectionBorder: 'border-[#E60076]/25 dark:border-[#E60076]/20',
    accentBar:     'bg-[#E60076]',
    countBg:       'bg-[#E60076]/10 text-[#E60076]',
    emoji: '⌨️',
  },
  random: {
    labelKey: 'cat_random',
    textColor:     'text-[#D97706] dark:text-[#F59E0B]',
    activeColor:   'bg-[#D97706] text-white border-transparent',
    iconBg:        'bg-[#D97706]/10 dark:bg-[#D97706]/10',
    iconColor:     'text-[#D97706] dark:text-[#F59E0B]',
    hoverBorder:   'hover:border-[#D97706]/40',
    badgeBg:       'bg-[#D97706]/10 text-[#D97706] dark:text-[#F59E0B]',
    sectionBorder: 'border-[#D97706]/25 dark:border-[#D97706]/20',
    accentBar:     'bg-[#D97706]',
    countBg:       'bg-[#D97706]/10 text-[#D97706] dark:text-[#F59E0B]',
    emoji: '🎲',
  },
  converters: {
    labelKey: 'cat_converters',
    textColor:     'text-[#16A34A] dark:text-[#22C55E]',
    activeColor:   'bg-[#16A34A] text-white border-transparent',
    iconBg:        'bg-[#16A34A]/10 dark:bg-[#16A34A]/10',
    iconColor:     'text-[#16A34A] dark:text-[#22C55E]',
    hoverBorder:   'hover:border-[#16A34A]/40',
    badgeBg:       'bg-[#16A34A]/10 text-[#16A34A] dark:text-[#22C55E]',
    sectionBorder: 'border-[#16A34A]/25 dark:border-[#16A34A]/20',
    accentBar:     'bg-[#16A34A]',
    countBg:       'bg-[#16A34A]/10 text-[#16A34A] dark:text-[#22C55E]',
    emoji: '🔄',
  },
  health: {
    labelKey: 'cat_health',
    textColor:     'text-[#DC2626] dark:text-[#EF4444]',
    activeColor:   'bg-[#DC2626] text-white border-transparent',
    iconBg:        'bg-[#DC2626]/10 dark:bg-[#DC2626]/10',
    iconColor:     'text-[#DC2626] dark:text-[#EF4444]',
    hoverBorder:   'hover:border-[#DC2626]/40',
    badgeBg:       'bg-[#DC2626]/10 text-[#DC2626] dark:text-[#EF4444]',
    sectionBorder: 'border-[#DC2626]/25 dark:border-[#DC2626]/20',
    accentBar:     'bg-[#DC2626]',
    countBg:       'bg-[#DC2626]/10 text-[#DC2626] dark:text-[#EF4444]',
    emoji: '❤️',
  },
  utilities: {
    labelKey: 'cat_utilities',
    textColor:     'text-[#7C3AED] dark:text-[#8B5CF6]',
    activeColor:   'bg-[#7C3AED] text-white border-transparent',
    iconBg:        'bg-[#7C3AED]/10 dark:bg-[#7C3AED]/10',
    iconColor:     'text-[#7C3AED] dark:text-[#8B5CF6]',
    hoverBorder:   'hover:border-[#7C3AED]/40',
    badgeBg:       'bg-[#7C3AED]/10 text-[#7C3AED] dark:text-[#8B5CF6]',
    sectionBorder: 'border-[#7C3AED]/25 dark:border-[#7C3AED]/20',
    accentBar:     'bg-[#7C3AED]',
    countBg:       'bg-[#7C3AED]/10 text-[#7C3AED] dark:text-[#8B5CF6]',
    emoji: '📝',
  },
};

const CATEGORY_ORDER: ToolCategory[] = ['calculators', 'developer', 'random', 'converters', 'health', 'utilities'];

export default function ToolsGrid({ lang, dict }: ToolsGridProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load favorites from localStorage after mount
  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  const toggleFavorite = useCallback((e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      saveFavorites(next);
      return next;
    });
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: TOOLS.length };
    for (const t of TOOLS) c[t.category] = (c[t.category] ?? 0) + 1;
    return c;
  }, []);

  const filtered = useMemo(() => {
    if (activeTab === 'favorites') {
      return TOOLS.filter(tool => favorites.has(tool.slug) && !!dict.tools[tool.dictKey]);
    }
    const q = query.toLowerCase().trim();
    return TOOLS.filter(tool => {
      const t = dict.tools[tool.dictKey];
      if (!t) return false;
      const matchCat = activeTab === 'all' || tool.category === activeTab;
      const matchQ = !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || tool.slug.includes(q);
      return matchCat && matchQ;
    });
  }, [activeTab, query, dict.tools, favorites]);

  const groupedFiltered = useMemo(() => {
    const groups: Record<ToolCategory, typeof TOOLS> = { calculators: [], developer: [], random: [], converters: [], health: [], utilities: [] };
    for (const tool of filtered) groups[tool.category].push(tool);
    return groups;
  }, [filtered]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value) setActiveTab('all');
  };

  const handleToolClick = useCallback((slug: string, name: string, category: ToolCategory) => {
    saveRecentTool(slug, name, CATEGORY_META[category].emoji);
  }, []);

  const h = dict.home;
  const isFavTab = activeTab === 'favorites';

  return (
    <>
      {/* Personalization: recently used tools */}
      <RecentTools lang={lang} />

      {/* Search */}
      <div className="relative max-w-xl mx-auto mb-10">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          size={20}
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder={h.search_placeholder}
          aria-label={h.search_placeholder}
          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-brand-text dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-brand-primary dark:focus:border-brand-primary transition-all text-base shadow-sm font-sans"
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Tool categories">

        {/* Favorites tab — special */}
        <button
          role="tab"
          aria-selected={isFavTab}
          onClick={() => { setActiveTab('favorites'); setQuery(''); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 transition-all duration-150 ${
            isFavTab
              ? 'bg-[#E60076] text-white border-transparent'
              : 'bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700 text-[#E60076] hover:border-[#E60076]/40 hover:scale-[1.02]'
          }`}
        >
          <Heart
            size={13}
            className={isFavTab ? 'fill-white' : ''}
            aria-hidden="true"
          />
          {h.cat_favorites}
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isFavTab ? 'bg-white/20 text-white' : 'bg-[#E60076]/10 text-[#E60076]'}`}>
            {favorites.size}
          </span>
        </button>

        {/* Category tabs */}
        {(['all', ...CATEGORY_ORDER] as const).map(cat => {
          const meta = CATEGORY_META[cat];
          const label = h[meta.labelKey] as string;
          const isActive = activeTab === cat && !query && !isFavTab;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isActive}
              onClick={() => { setActiveTab(cat); setQuery(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 transition-all duration-150 ${
                isActive
                  ? meta.activeColor
                  : `bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700 ${meta.textColor} ${meta.hoverBorder} hover:scale-[1.02]`
              }`}
            >
              {cat !== 'all' && (
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white/70' : 'bg-current'}`} aria-hidden="true" />
              )}
              {label}
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : meta.countBg}`}>
                {counts[cat] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Favorites empty state */}
      {isFavTab && favorites.size === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#E60076]/10 flex items-center justify-center">
            <Heart size={28} className="text-[#E60076]" aria-hidden="true" />
          </div>
          <p className="text-lg font-bold text-brand-text dark:text-white mb-2">{h.fav_empty_title}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">{h.fav_empty_desc}</p>
        </div>
      )}

      {/* Search empty state */}
      {!isFavTab && filtered.length === 0 && query && (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500">
          <p className="text-5xl mb-4" aria-hidden="true">🔍</p>
          <p className="text-lg font-medium">{h.no_results}</p>
        </div>
      )}

      {/* Tool sections */}
      {(!isFavTab || favorites.size > 0) && filtered.length > 0 && (
        <div className="space-y-14">
          {CATEGORY_ORDER.map(cat => {
            const tools = groupedFiltered[cat];
            if (tools.length === 0) return null;
            const meta = CATEGORY_META[cat];
            const label = h[meta.labelKey] as string;
            return (
              <section key={cat} aria-labelledby={`cat-${cat}`}>
                <div className={`flex items-center gap-3 mb-6 pb-4 border-b-2 ${meta.sectionBorder}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${meta.iconBg}`} aria-hidden="true">
                    {meta.emoji}
                  </div>
                  <h2 id={`cat-${cat}`} className="font-display text-lg font-bold text-brand-text dark:text-white">{label}</h2>
                  <span className="ml-auto text-sm text-gray-400 dark:text-gray-500 font-semibold">
                    {tools.length} {tools.length === 1 ? 'tool' : 'tools'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {tools.map(tool => {
                    const t = dict.tools[tool.dictKey];
                    const isFav = favorites.has(tool.slug);
                    return (
                      <Link
                        key={tool.slug}
                        href={`/${lang}/${tool.slug}`}
                        onClick={() => handleToolClick(tool.slug, t.name, tool.category)}
                        className={`group relative flex flex-col p-5 bg-white dark:bg-[#1a1a1a] border-2 border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md ${meta.hoverBorder} transition-all duration-200 hover:-translate-y-0.5`}
                      >
                        {/* Top accent bar on hover */}
                        <div
                          className={`absolute top-0 left-6 right-6 h-[2px] ${meta.accentBar} rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                          aria-hidden="true"
                        />

                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-2.5 rounded-xl ${meta.iconBg} ${meta.iconColor} group-hover:scale-110 transition-transform duration-200`} aria-hidden="true">
                            <tool.icon size={22} />
                          </div>

                          {/* Badge + Favorite button */}
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${meta.badgeBg}`}>
                              {t.category}
                            </span>
                            <button
                              onClick={(e) => toggleFavorite(e, tool.slug)}
                              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                              aria-pressed={isFav}
                              className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-150 hover:scale-110 ${
                                isFav
                                  ? 'text-[#E60076] bg-[#E60076]/10 hover:bg-[#E60076]/20'
                                  : 'text-gray-300 dark:text-gray-600 hover:text-[#E60076] hover:bg-[#E60076]/10 opacity-0 group-hover:opacity-100'
                              }`}
                            >
                              <Heart size={14} className={isFav ? 'fill-current' : ''} aria-hidden="true" />
                            </button>
                          </div>
                        </div>

                        <h3 className="font-display text-base font-bold text-brand-text dark:text-white mb-1.5 leading-snug">
                          {t.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1">
                          {t.description}
                        </p>

                        <div className={`mt-4 text-xs font-bold flex items-center gap-1 ${meta.textColor} opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200`}>
                          Open tool <ArrowRight size={12} aria-hidden="true" />
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
