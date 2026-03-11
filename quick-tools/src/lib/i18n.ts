export const locales = ["en", "ko", "es", "pt", "ja"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export async function getDictionary(locale: Locale) {
  try {
    const dictionary = await import(`@/messages/${locale}.json`);
    return dictionary.default;
  } catch (error) {
    console.error(`Failed to load dictionary for locale: ${locale}`, error);
    const defaultDictionary = await import(`@/messages/${defaultLocale}.json`);
    return defaultDictionary.default;
  }
}
