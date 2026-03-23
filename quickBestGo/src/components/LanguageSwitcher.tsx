'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales, Locale } from '@/lib/i18n';
import { Globe } from 'lucide-react';
import { ChangeEvent } from 'react';

export default function LanguageSwitcher({ currentLang }: { currentLang: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    if (!pathname) return;

    const segments = pathname.split('/');
    const firstSegment = segments[1];
    if (locales.includes(firstSegment as Locale)) {
      segments[1] = newLocale;
    } else {
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
    <div className="relative">
      {/* 모바일: 언어 코드만 표시하는 compact 버튼 */}
      <div className="flex sm:hidden items-center justify-center w-9 h-9 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
        <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
          {currentLang.toUpperCase()}
        </span>
      </div>

      {/* 데스크탑: Globe 아이콘 + 언어명 */}
      <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg px-2 py-1 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
        <Globe size={16} className="text-gray-400 dark:text-gray-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 pr-1 whitespace-nowrap">
          {languageNames[currentLang]}
        </span>
      </div>

      {/* select overlay — 실제 변경 동작 처리 */}
      <select
        value={currentLang}
        onChange={handleLanguageChange}
        aria-label="Language"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
