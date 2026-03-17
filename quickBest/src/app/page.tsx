'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const locales = ['ko', 'en', 'es', 'ja', 'pt'];
const defaultLocale = 'en';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if window and navigator are available (client-side)
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const browserLang = navigator.language.split('-')[0];
      const matchedLocale = locales.find(locale => locale === browserLang);
      const finalLocale = matchedLocale || defaultLocale;
      
      router.replace(`/${finalLocale}/`);
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#1a1a1a]">
      <div className="animate-pulse text-gray-500 dark:text-gray-400">
        Redirecting...
      </div>
    </div>
  );
}
