export type CurrencyCode = 'USD' | 'KRW' | 'JPY' | 'EUR' | 'CNY';

export interface CurrencyConfig {
  symbol: string;
  decimals: number;
  locale: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { symbol: '$',  decimals: 2, locale: 'en-US' },
  KRW: { symbol: '₩',  decimals: 0, locale: 'ko-KR' },
  JPY: { symbol: '¥',  decimals: 0, locale: 'ja-JP' },
  EUR: { symbol: '€',  decimals: 2, locale: 'de-DE' },
  CNY: { symbol: '¥',  decimals: 2, locale: 'zh-CN' },
};

export function formatCurrency(amount: number, code: CurrencyCode): string {
  const { locale, decimals } = CURRENCIES[code];
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

const LOCALE_TO_CURRENCY: Record<string, CurrencyCode> = {
  ko: 'KRW',
  ja: 'JPY',
  de: 'EUR',
  fr: 'EUR',
  zh: 'CNY',
};

const STORAGE_KEY = 'preferred_currency';

export function saveCurrency(code: CurrencyCode): void {
  try { localStorage.setItem(STORAGE_KEY, code); } catch { /* ignore */ }
}

export function loadCurrency(): CurrencyCode | null {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val && val in CURRENCIES) return val as CurrencyCode;
  } catch { /* ignore */ }
  return null;
}

export function detectDefaultCurrency(): CurrencyCode {
  if (typeof window === 'undefined') return 'USD';
  const saved = loadCurrency();
  if (saved) return saved;
  const lang = navigator.language?.split('-')[0] ?? '';
  return LOCALE_TO_CURRENCY[lang] ?? 'USD';
}
