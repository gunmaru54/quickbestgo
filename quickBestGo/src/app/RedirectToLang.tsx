'use client';
import { useEffect } from 'react';

const SUPPORTED_LOCALES = ['ko', 'en', 'es', 'ja', 'pt'];

export default function RedirectToLang() {
  useEffect(() => {
    const languages = navigator.languages?.length
      ? navigator.languages
      : [navigator.language || 'en'];

    let target = 'en';
    for (const lang of languages) {
      const primary = lang.split('-')[0].toLowerCase();
      if (SUPPORTED_LOCALES.includes(primary)) {
        target = primary;
        break;
      }
    }
    window.location.replace(`/${target}/`);
  }, []);
  return null;
}
