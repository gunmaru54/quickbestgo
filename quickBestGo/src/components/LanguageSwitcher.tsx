'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales, Locale } from '@/lib/i18n';
import { Globe } from 'lucide-react';
import { ChangeEvent } from 'react';

export default function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    if (!pathname) return;
    
    const segments = pathname.split('/');
    // Check if first segment is a locale
    const firstSegment = segments[1];
    if (locales.includes(firstSegment as Locale)) {
      segments[1] = newLocale;
    } else {
      // If it's something like /sitemap.xml (though middleware should handle)
      segments.splice(1, 0, newLocale);
    }
    
    const newPathname = segments.join('/') || `/${newLocale}`;
    router.push(newPathname);
  };

  const languageNames: Record<string, string> = {
    ko: '한국어 (KO)',
    en: 'English (EN)',
    es: 'Español (ES)',
    pt: 'Português (PT)',
    ja: '日本語 (JA)',
  };

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg px-2 py-1 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
      <Globe size={16} className="text-gray-400 dark:text-gray-500" />
      <select
        value={currentLang}
        onChange={handleLanguageChange}
        className="text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 outline-none cursor-pointer pr-1"
        style={{ colorScheme: 'light dark' }}
      >
        {locales.map((locale) => (
          <option 
            key={locale} 
            value={locale}
            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          >
            {languageNames[locale]}
          </option>
        ))}
      </select>
    </div>
  );
}
