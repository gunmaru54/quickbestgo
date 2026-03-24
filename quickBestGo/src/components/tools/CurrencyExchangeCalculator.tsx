'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeftRight, ChevronDown, Search, X, Copy, Check, RefreshCw } from 'lucide-react';
import { CategoryTheme } from '@/lib/tools';
import ExchangeRateChart from '@/components/tools/ExchangeRateChart';
import {
  fetchRates,
  convertAmount,
  formatRateTimestamp,
  CURRENCY_META,
  SUPPORTED_CURRENCIES,
  CurrencyCode,
} from '@/lib/currency';

// ── Types ─────────────────────────────────────────────────────────

interface Props {
  dict: {
    label_from: string;
    label_to: string;
    btn_swap: string;
    label_quick: string;
    label_major_rates: string;
    label_quick_table: string;
    label_quick_table_sub: string;
    label_rate_updated: string;
    label_loading: string;
    label_error: string;
    label_copied: string;
    label_copy_link: string;
    label_result_eq: string;
  };
  theme: CategoryTheme;
}

// ── Quick amount presets by currency ─────────────────────────────

const QUICK_AMOUNTS: Partial<Record<CurrencyCode, number[]>> = {
  USD: [100, 500, 1000, 5000, 10000],
  KRW: [10000, 50000, 100000, 500000, 1000000],
  JPY: [1000, 5000, 10000, 50000, 100000],
  EUR: [100, 500, 1000, 5000, 10000],
  GBP: [100, 500, 1000, 5000, 10000],
  VND: [100000, 500000, 1000000, 5000000, 10000000],
};
const DEFAULT_QUICK = [100, 500, 1000, 5000, 10000];

// ── Major pairs to show in the rates grid ────────────────────────

const MAJOR_PAIRS: [CurrencyCode, CurrencyCode][] = [
  ['USD', 'KRW'], ['USD', 'JPY'], ['USD', 'EUR'],
  ['USD', 'CNY'], ['USD', 'GBP'], ['USD', 'AUD'],
];

// ── Helpers ───────────────────────────────────────────────────────

function formatAmount(value: number, code: CurrencyCode): string {
  const { decimals } = CURRENCY_META[code];
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function parseInput(raw: string): number {
  return parseFloat(raw.replace(/,/g, '')) || 0;
}

function toDisplayInput(raw: string): string {
  if (!raw) return '';
  const num = parseInt(raw.replace(/,/g, ''), 10);
  if (isNaN(num)) return raw;
  return num.toLocaleString();
}

// ── Currency Selector Dropdown ────────────────────────────────────

interface SelectorProps {
  value: CurrencyCode;
  onChange: (code: CurrencyCode) => void;
  label: string;
  theme: CategoryTheme;
  recentCodes: CurrencyCode[];
  align?: 'left' | 'right';
}

function CurrencySelector({ value, onChange, label, recentCodes, align = 'left' }: SelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = SUPPORTED_CURRENCIES.filter((c) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return c.toLowerCase().includes(q) || CURRENCY_META[c].name.toLowerCase().includes(q);
  });

  const recent = recentCodes.filter((c) => c !== value).slice(0, 3);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    function onOutside(e: MouseEvent | TouchEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('touchstart', onOutside);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('touchstart', onOutside);
    };
  }, []);

  const meta = CURRENCY_META[value];

  function select(code: CurrencyCode) {
    onChange(code);
    setOpen(false);
    setQuery('');
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5">
        {label}
      </label>
      {/* Trigger — fixed height so size never changes with currency name length */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`${label}: ${meta.name}`}
        aria-expanded={open}
        className="flex items-center gap-2 w-full h-[58px] px-3 rounded-xl border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
      >
        <span className="text-2xl leading-none w-8 flex-shrink-0 text-center">{meta.flag}</span>
        <span className="flex-1 min-w-0 text-left">
          <span className="block text-base font-extrabold text-gray-900 dark:text-gray-100 leading-tight truncate">{value}</span>
          <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">{meta.name}</span>
        </span>
        <ChevronDown size={16} className={`flex-shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown — absolute, aligned left or right, capped to viewport width */}
      {open && (
        <div
          className={`absolute z-50 top-full mt-1 w-72 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 dark:border-gray-800">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search currency..."
              aria-label="Search currency"
              className="flex-1 text-sm bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} aria-label="Clear search">
                <X size={14} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          <div className="overflow-y-auto max-h-64">
            {/* Recent */}
            {!query && recent.length > 0 && (
              <>
                <div className="px-3 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Recent</div>
                {recent.map((code) => (
                  <CurrencyOption key={code} code={code} selected={code === value} onSelect={select} />
                ))}
                <div className="mx-3 my-1 border-t border-gray-100 dark:border-gray-800" />
              </>
            )}
            {/* All */}
            {filtered.map((code) => (
              <CurrencyOption key={code} code={code} selected={code === value} onSelect={select} />
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-gray-400">No currencies found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CurrencyOption({ code, selected, onSelect }: { code: CurrencyCode; selected: boolean; onSelect: (c: CurrencyCode) => void }) {
  const meta = CURRENCY_META[code];
  return (
    <button
      type="button"
      onClick={() => onSelect(code)}
      className={`flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ${selected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
    >
      <span className="text-lg leading-none w-6 text-center">{meta.flag}</span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-bold text-gray-900 dark:text-gray-100">{code}</span>
        <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">{meta.name}</span>
      </span>
      {selected && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────

export default function CurrencyExchangeCalculator({ dict, theme }: Props) {
  const [fromCode, setFromCode] = useState<CurrencyCode>('USD');
  const [toCode, setToCode]     = useState<CurrencyCode>('KRW');
  const [rawAmount, setRawAmount] = useState('1000');
  const [rates, setRates]       = useState<Record<string, number> | null>(null);
  const [timestamp, setTimestamp] = useState<number | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);
  const [copied, setCopied]     = useState(false);
  const [recentCodes, setRecentCodes] = useState<CurrencyCode[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load rates on mount
  useEffect(() => {
    setLoading(true);
    fetchRates().then((data) => {
      if (data) {
        setRates(data.rates);
        setTimestamp(data.timestamp);
        setError(false);
      } else {
        setError(true);
      }
      setLoading(false);
    });

    // Load recent from localStorage
    try {
      const saved = localStorage.getItem('oxr_recent');
      if (saved) setRecentCodes(JSON.parse(saved));
    } catch { /* ignore */ }

    // Read URL params
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('from') && SUPPORTED_CURRENCIES.includes(p.get('from') as CurrencyCode)) {
        setFromCode(p.get('from') as CurrencyCode);
      }
      if (p.get('to') && SUPPORTED_CURRENCIES.includes(p.get('to') as CurrencyCode)) {
        setToCode(p.get('to') as CurrencyCode);
      }
      if (p.get('amount')) setRawAmount(p.get('amount')!);
    }
  }, []);

  // Update URL params on change (debounced)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.set('from', fromCode);
      url.searchParams.set('to', toCode);
      url.searchParams.set('amount', rawAmount);
      window.history.replaceState(null, '', url.toString());
    }, 400);
  }, [fromCode, toCode, rawAmount]);

  function trackRecent(code: CurrencyCode) {
    setRecentCodes((prev) => {
      const next = [code, ...prev.filter((c) => c !== code)].slice(0, 5);
      try { localStorage.setItem('oxr_recent', JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }

  function handleSwap() {
    setFromCode(toCode);
    setToCode(fromCode);
    trackRecent(fromCode);
  }

  function handleFromChange(code: CurrencyCode) {
    setFromCode(code);
    trackRecent(code);
  }

  function handleToChange(code: CurrencyCode) {
    setToCode(code);
    trackRecent(code);
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/,/g, '');
    if (/^\d*\.?\d*$/.test(raw)) setRawAmount(raw);
  }

  async function handleRefresh() {
    setLoading(true);
    // Force re-fetch by clearing cache
    try { localStorage.removeItem('oxr_cache_USD'); } catch { /* ignore */ }
    const data = await fetchRates();
    if (data) { setRates(data.rates); setTimestamp(data.timestamp); setError(false); }
    else { setError(true); }
    setLoading(false);
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // Computed values
  const amount = parseInput(rawAmount);
  const result = rates && amount > 0 ? convertAmount(amount, fromCode, toCode, rates) : null;
  const rate1  = rates ? convertAmount(1, fromCode, toCode, rates) : null;

  // Quick amounts
  const quickAmounts = QUICK_AMOUNTS[fromCode] ?? DEFAULT_QUICK;

  // Quick conversion table rows
  const tableAmounts = quickAmounts.concat(quickAmounts.map((a) => a * 10));

  return (
    <div className="space-y-4">

      {/* ── Main Converter Card ─────────────────────────────── */}
      <div className={`rounded-2xl border ${theme.accentBorder} bg-white dark:bg-gray-900 p-4 sm:p-6`}>

        {/* FROM / TO row */}
        <div className="grid grid-cols-[1fr_40px_1fr] gap-2 sm:gap-3 items-end mb-4">
          <CurrencySelector
            value={fromCode}
            onChange={handleFromChange}
            label={dict.label_from}
            theme={theme}
            recentCodes={recentCodes}
          />

          {/* Swap button */}
          <div className="flex items-end pb-0.5">
            <button
              type="button"
              onClick={handleSwap}
              aria-label={dict.btn_swap}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${theme.primaryBtn} text-white transition-all hover:scale-110 active:scale-95 shadow-md`}
            >
              <ArrowLeftRight size={16} />
            </button>
          </div>

          <CurrencySelector
            value={toCode}
            onChange={handleToChange}
            label={dict.label_to}
            theme={theme}
            recentCodes={recentCodes}
            align="right"
          />
        </div>

        {/* Amount input */}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5">
            {CURRENCY_META[fromCode].symbol} Amount
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={toDisplayInput(rawAmount)}
            onChange={handleAmountChange}
            aria-label={`Amount in ${fromCode}`}
            maxLength={18}
            className={`w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 text-right focus:outline-none focus:ring-2 ${theme.ring} transition-all`}
          />
        </div>

        {/* Result banner */}
        {loading && (
          <div className={`rounded-xl px-4 py-4 ${theme.accentBg} ${theme.accentBorder} border animate-pulse`}>
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl px-4 py-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium">
            {dict.label_error}
          </div>
        )}

        {result !== null && !loading && !error && (
          <div className={`rounded-xl px-4 py-4 ${theme.accentBg} border ${theme.accentBorder}`}>
            <div className={`text-2xl sm:text-3xl font-black ${theme.accent} leading-tight break-all`}>
              {formatAmount(amount, fromCode)} {fromCode} = {formatAmount(result, toCode)} {toCode}
            </div>
            {rate1 !== null && (
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                <span>1 {fromCode} = {formatAmount(rate1, toCode)} {toCode}</span>
                <span>·</span>
                <span>1 {toCode} = {formatAmount(convertAmount(1, toCode, fromCode, rates!), fromCode)} {fromCode}</span>
              </div>
            )}
            {timestamp && (
              <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-400">
                <span>{dict.label_rate_updated}: {formatRateTimestamp(timestamp)}</span>
                <button
                  onClick={handleRefresh}
                  aria-label="Refresh rates"
                  className="hover:text-blue-500 transition-colors"
                >
                  <RefreshCw size={12} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Quick chips */}
        <div className="mt-4">
          <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{dict.label_quick}</div>
          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setRawAmount(String(a))}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  parseInput(rawAmount) === a
                    ? `${theme.accentBg} ${theme.accent} border-current`
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {a.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Copy link */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            aria-label={dict.label_copy_link}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
            {copied ? dict.label_copied : dict.label_copy_link}
          </button>
        </div>
      </div>

      {/* ── Major Rates Grid ─────────────────────────────────── */}
      {rates && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-6">
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">{dict.label_major_rates}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {MAJOR_PAIRS.map(([base, target]) => {
              const r = convertAmount(1, base, target, rates);
              return (
                <button
                  key={`${base}-${target}`}
                  type="button"
                  onClick={() => { handleFromChange(base); handleToChange(target); }}
                  aria-label={`Set ${base} to ${target}`}
                  className="text-left p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                >
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-base">{CURRENCY_META[base].flag}</span>
                    <span className="text-base">{CURRENCY_META[target].flag}</span>
                  </div>
                  <div className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-0.5">{base} / {target}</div>
                  <div className="text-sm font-extrabold text-gray-900 dark:text-gray-100 tabular-nums">
                    {formatAmount(r, target)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Rate Chart ───────────────────────────────────────── */}
      <ExchangeRateChart fromCode={fromCode} toCode={toCode} />

      {/* ── Quick Conversion Table ───────────────────────────── */}
      {rates && result !== null && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-6">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">{dict.label_quick_table}</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{dict.label_quick_table_sub}</p>
          </div>
          {/* Mobile: 2-col, tablet+: 4-col */}
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm min-w-[260px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left py-2 px-2 text-xs font-bold uppercase tracking-wider text-gray-400">{fromCode}</th>
                  <th className="text-right py-2 px-2 text-xs font-bold uppercase tracking-wider text-gray-400">{toCode}</th>
                  <th className="text-left py-2 px-2 text-xs font-bold uppercase tracking-wider text-gray-400 hidden sm:table-cell">{fromCode}</th>
                  <th className="text-right py-2 px-2 text-xs font-bold uppercase tracking-wider text-gray-400 hidden sm:table-cell">{toCode}</th>
                </tr>
              </thead>
              <tbody>
                {quickAmounts.map((a, i) => {
                  const pair = tableAmounts[i + quickAmounts.length];
                  return (
                    <tr
                      key={a}
                      className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer transition-colors"
                      onClick={() => setRawAmount(String(a))}
                    >
                      <td className="py-2.5 px-2 text-gray-600 dark:text-gray-400 font-medium tabular-nums">
                        {formatAmount(a, fromCode)}
                      </td>
                      <td className={`py-2.5 px-2 text-right font-extrabold tabular-nums ${theme.accent}`}>
                        {formatAmount(convertAmount(a, fromCode, toCode, rates), toCode)}
                      </td>
                      {pair !== undefined && (
                        <>
                          <td
                            className="py-2.5 px-2 text-gray-600 dark:text-gray-400 font-medium tabular-nums hidden sm:table-cell cursor-pointer"
                            onClick={(e) => { e.stopPropagation(); setRawAmount(String(pair)); }}
                          >
                            {formatAmount(pair, fromCode)}
                          </td>
                          <td className={`py-2.5 px-2 text-right font-extrabold tabular-nums ${theme.accent} hidden sm:table-cell`}>
                            {formatAmount(convertAmount(pair, fromCode, toCode, rates), toCode)}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
