'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { Locale } from '@/lib/i18n';
import { ChevronDown } from 'lucide-react';

const CATEGORY_LINKS = [
  { label: 'Calculators',      slug: 'calculators',     emoji: '🔢' },
  { label: 'Developer Tools',  slug: 'developer-tools', emoji: '⌨️' },
  { label: 'Random & Fun',     slug: 'random-tools',    emoji: '🎲' },
  { label: 'Converters',       slug: 'converters',      emoji: '🔄' },
  { label: 'Health Tools',     slug: 'health-tools',    emoji: '❤️' },
];

const Header = ({ lang }: { lang: Locale }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <header className="border-b bg-white dark:bg-[#0a0a0a] dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href={`/${lang}`} className="text-2xl font-bold text-blue-600 dark:text-blue-500">
            QuickBestGo
          </Link>

          {/* Tools dropdown */}
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Tools
              <ChevronDown
                size={15}
                className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              />
            </button>

            {open && (
              <div className="absolute left-0 top-full mt-2 w-52 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden z-50">
                {CATEGORY_LINKS.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/${lang}/${cat.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <span className="text-base">{cat.emoji}</span>
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageSwitcher currentLang={lang} />
        </div>
      </div>
    </header>
  );
};

export default Header;
