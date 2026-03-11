'use client';

import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

const Header = ({ lang }: { lang: string }) => {
  return (
    <header className="border-b bg-white dark:bg-[#0a0a0a] dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={`/${lang}`} className="text-2xl font-bold text-blue-600 dark:text-blue-500">
          QuickTools
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageSwitcher currentLang={lang} />
        </div>
      </div>
    </header>
  );
};

export default Header;
