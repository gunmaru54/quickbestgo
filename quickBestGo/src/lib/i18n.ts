export const SUPPORTED_LOCALES = ["en", "ko", "es", "pt", "ja"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const defaultLocale: Locale = "en";

// sitemap.ts 하위 호환
export const locales = SUPPORTED_LOCALES;

export function getStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export async function getDictionary(locale: Locale) {
  try {
    const dictionary = await import(`@/dictionaries/${locale}.json`);
    return dictionary.default;
  } catch (error) {
    console.error(`Failed to load dictionary for locale: ${locale}`, error);
    const defaultDictionary = await import(`@/dictionaries/${defaultLocale}.json`);
    return defaultDictionary.default;
  }
}
