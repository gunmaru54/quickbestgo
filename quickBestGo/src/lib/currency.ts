export type CurrencyCode =
  | 'USD' | 'KRW' | 'JPY' | 'EUR' | 'GBP'
  | 'CNY' | 'CAD' | 'AUD' | 'HKD' | 'SGD'
  | 'CHF' | 'MXN' | 'BRL' | 'INR' | 'THB' | 'VND';

// ── Open Exchange Rates ────────────────────────────────────────────
// Free plan: USD base only, 1,000 req/month, hourly updates.
// Docs: https://docs.openexchangerates.org/

const APP_ID = process.env.NEXT_PUBLIC_OPEN_EXCHANGE_APP_ID ?? '';
const API_BASE = 'https://openexchangerates.org/api';
const CACHE_TTL_MS = 60 * 60 * 1000; // 60 minutes

interface OERLatestResponse {
  disclaimer: string;
  license: string;
  timestamp: number; // Unix seconds
  base: 'USD';
  rates: Record<string, number>;
}

interface RatesCache {
  rates: Record<string, number>;
  timestamp: number; // Unix seconds (from API)
  fetchedAt: number; // Date.now() when we fetched
}

function cacheKey(base: string) {
  return `oxr_cache_${base}`;
}

function readCache(base: string): RatesCache | null {
  try {
    const raw = localStorage.getItem(cacheKey(base));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed !== null &&
      typeof parsed === 'object' &&
      'rates' in parsed &&
      'fetchedAt' in parsed
    ) {
      return parsed as RatesCache;
    }
  } catch { /* ignore */ }
  return null;
}

function writeCache(base: string, data: RatesCache) {
  try {
    localStorage.setItem(cacheKey(base), JSON.stringify(data));
  } catch { /* ignore – storage full */ }
}

/**
 * Fetch latest USD-based rates.
 * Returns cached data if still within TTL, otherwise calls the API.
 * Free plan only supports USD as base.
 */
export async function fetchRates(): Promise<RatesCache | null> {
  if (typeof window === 'undefined') return null;

  const cached = readCache('USD');
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached;
  }

  if (!APP_ID) {
    console.error('[currency] NEXT_PUBLIC_OPEN_EXCHANGE_APP_ID is not set');
    return cached; // return stale cache rather than nothing
  }

  try {
    const res = await fetch(`${API_BASE}/latest.json?app_id=${APP_ID}`);
    if (!res.ok) throw new Error(`OER ${res.status}`);
    const data: OERLatestResponse = await res.json();
    const entry: RatesCache = {
      rates: data.rates,
      timestamp: data.timestamp,
      fetchedAt: Date.now(),
    };
    writeCache('USD', entry);
    return entry;
  } catch (err) {
    console.error('[currency] fetchRates failed:', err);
    return cached ?? null; // stale cache as fallback
  }
}

/**
 * Convert amount from one currency to another using USD-base rates.
 * Both from and to must exist in the rates object.
 */
export function convertAmount(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>,
): number {
  const fromRate = rates[from] ?? 1;
  const toRate = rates[to] ?? 1;
  // rates are all USD-based: convert from→USD→to
  const inUSD = amount / fromRate;
  return inUSD * toRate;
}

/**
 * Format a Unix timestamp (seconds) as a localized time string.
 */
export function formatRateTimestamp(unixSec: number): string {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(unixSec * 1000));
}

// ── Supported currencies (display metadata) ───────────────────────

export interface CurrencyMeta {
  name: string;
  flag: string;
  symbol: string;
  decimals: number;
}

export const CURRENCY_META: Record<CurrencyCode, CurrencyMeta> = {
  USD: { name: 'US Dollar',        flag: '🇺🇸', symbol: '$',    decimals: 2 },
  KRW: { name: 'Korean Won',       flag: '🇰🇷', symbol: '₩',    decimals: 0 },
  JPY: { name: 'Japanese Yen',     flag: '🇯🇵', symbol: '¥',    decimals: 0 },
  EUR: { name: 'Euro',             flag: '🇪🇺', symbol: '€',    decimals: 2 },
  GBP: { name: 'British Pound',    flag: '🇬🇧', symbol: '£',    decimals: 2 },
  CNY: { name: 'Chinese Yuan',     flag: '🇨🇳', symbol: '¥',    decimals: 2 },
  CAD: { name: 'Canadian Dollar',  flag: '🇨🇦', symbol: 'CA$',  decimals: 2 },
  AUD: { name: 'Australian Dollar',flag: '🇦🇺', symbol: 'A$',   decimals: 2 },
  HKD: { name: 'Hong Kong Dollar', flag: '🇭🇰', symbol: 'HK$',  decimals: 2 },
  SGD: { name: 'Singapore Dollar', flag: '🇸🇬', symbol: 'S$',   decimals: 2 },
  CHF: { name: 'Swiss Franc',      flag: '🇨🇭', symbol: 'CHF',  decimals: 2 },
  MXN: { name: 'Mexican Peso',     flag: '🇲🇽', symbol: 'MX$',  decimals: 2 },
  BRL: { name: 'Brazilian Real',   flag: '🇧🇷', symbol: 'R$',   decimals: 2 },
  INR: { name: 'Indian Rupee',     flag: '🇮🇳', symbol: '₹',    decimals: 2 },
  THB: { name: 'Thai Baht',        flag: '🇹🇭', symbol: '฿',    decimals: 2 },
  VND: { name: 'Vietnamese Dong',  flag: '🇻🇳', symbol: '₫',    decimals: 0 },
};

export const SUPPORTED_CURRENCIES = Object.keys(CURRENCY_META) as CurrencyCode[];

export interface CurrencyConfig {
  symbol: string;
  decimals: number;
  locale: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { symbol: '$',    decimals: 2, locale: 'en-US' },
  KRW: { symbol: '₩',   decimals: 0, locale: 'ko-KR' },
  JPY: { symbol: '¥',   decimals: 0, locale: 'ja-JP' },
  EUR: { symbol: '€',   decimals: 2, locale: 'de-DE' },
  GBP: { symbol: '£',   decimals: 2, locale: 'en-GB' },
  CNY: { symbol: '¥',   decimals: 2, locale: 'zh-CN' },
  CAD: { symbol: 'CA$', decimals: 2, locale: 'en-CA' },
  AUD: { symbol: 'A$',  decimals: 2, locale: 'en-AU' },
  HKD: { symbol: 'HK$', decimals: 2, locale: 'zh-HK' },
  SGD: { symbol: 'S$',  decimals: 2, locale: 'en-SG' },
  CHF: { symbol: 'CHF', decimals: 2, locale: 'de-CH' },
  MXN: { symbol: 'MX$', decimals: 2, locale: 'es-MX' },
  BRL: { symbol: 'R$',  decimals: 2, locale: 'pt-BR' },
  INR: { symbol: '₹',   decimals: 2, locale: 'en-IN' },
  THB: { symbol: '฿',   decimals: 2, locale: 'th-TH' },
  VND: { symbol: '₫',   decimals: 0, locale: 'vi-VN' },
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
    if (val && val in CURRENCY_META) return val as CurrencyCode;
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
