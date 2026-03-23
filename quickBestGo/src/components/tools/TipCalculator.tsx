'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RefreshCcw } from 'lucide-react';
import { CategoryTheme } from '@/lib/tools';
import { useCurrency } from '@/components/CurrencyProvider';
import { formatCurrency, CURRENCIES, CurrencyCode } from '@/lib/currency';

interface TipCalculatorProps {
  dict: {
    label_bill: string;
    label_tip_percent: string;
    label_people: string;
    btn_calculate: string;
    tooltip_reset: string;
    result_tip: string;
    result_total: string;
    result_per_person: string;
    error_invalid: string;
    no_tip_culture: string;
  };
  theme: CategoryTheme;
}

interface Result {
  tip: number;
  total: number;
  perPerson: number;
}

const PRESET_TIPS: Record<CurrencyCode, number[]> = {
  USD: [10, 15, 18, 20, 25],
  KRW: [0, 5, 10],
  JPY: [0, 5, 10],
  EUR: [5, 10, 15, 20],
  CNY: [0, 5, 10],
};

const DEFAULT_TIP: Record<CurrencyCode, number> = {
  USD: 15,
  KRW: 0,
  JPY: 0,
  EUR: 10,
  CNY: 0,
};

const NO_TIP_CURRENCIES: CurrencyCode[] = ['KRW', 'JPY'];

function toCommaDisplay(raw: string): string {
  if (!raw) return '';
  const [intPart, decPart] = raw.split('.');
  const formatted = parseInt(intPart || '0', 10).toLocaleString();
  return decPart !== undefined ? `${formatted}.${decPart}` : formatted;
}

function fromCommaDisplay(display: string): string {
  return display.replace(/,/g, '');
}

const TipCalculator = ({ dict, theme }: TipCalculatorProps) => {
  const { currency, setCurrency } = useCurrency();
  const [bill, setBill] = useState('');
  const [tipPercent, setTipPercent] = useState<number>(15);
  const [customTip, setCustomTip] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [people, setPeople] = useState('1');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const billRef = useRef<HTMLInputElement>(null);

  const presetTips = PRESET_TIPS[currency];
  const symbol = CURRENCIES[currency].symbol;
  const showNoTipNotice = NO_TIP_CURRENCIES.includes(currency);

  // When currency changes, reset tip to default if current value is not in new presets
  useEffect(() => {
    if (isCustom) return;
    if (!presetTips.includes(tipPercent)) {
      setTipPercent(DEFAULT_TIP[currency]);
    }
  }, [currency]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const billVal = parseFloat(bill);
    const tipVal = isCustom ? parseFloat(customTip) : tipPercent;
    const peopleVal = parseInt(people) || 1;

    if (!bill || isNaN(billVal) || billVal <= 0) {
      setResult(null);
      setError(bill && billVal <= 0 ? dict.error_invalid : '');
      return;
    }

    if (isCustom && (isNaN(tipVal) || tipVal < 0)) {
      setResult(null);
      return;
    }

    setError('');
    const tipAmount = billVal * (tipVal / 100);
    const total = billVal + tipAmount;
    const numPeople = Math.max(1, peopleVal);

    setResult({
      tip: tipAmount,
      total,
      perPerson: total / numPeople,
    });
  }, [bill, tipPercent, customTip, isCustom, people, dict.error_invalid]);

  const reset = () => {
    setBill('');
    setTipPercent(DEFAULT_TIP[currency]);
    setCustomTip('');
    setIsCustom(false);
    setPeople('1');
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-[#1a1a1a] rounded-3xl border dark:border-gray-800 shadow-sm p-6 md:p-8 transition-colors duration-300">
      {/* Currency selector */}
      <div className="flex items-center gap-1.5 mb-5 flex-wrap">
        {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
          <button
            key={code}
            onClick={() => setCurrency(code)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              currency === code
                ? `${theme.primaryBtn} text-white`
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {code} <span className="opacity-75">{CURRENCIES[code].symbol}</span>
          </button>
        ))}
      </div>
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {dict.label_bill} ({currency})
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium pointer-events-none select-none">
              {symbol}
            </span>
            <input
              ref={billRef}
              type="text"
              inputMode="decimal"
              value={toCommaDisplay(bill)}
              onChange={(e) => { const raw = fromCommaDisplay(e.target.value); if (/^[0-9]*\.?[0-9]*$/.test(raw)) setBill(raw); }}
              placeholder="50.00"
              maxLength={20}
              aria-label={`${dict.label_bill} (${currency})`}
              className={`w-full pl-8 pr-4 py-3 bg-white dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none transition-all ${error ? 'border border-red-400 dark:border-red-500 ring-2 ring-red-400/30' : `border dark:border-gray-700 focus:ring-2 ${theme.ring}`}`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_tip_percent}</label>
          {showNoTipNotice && (
            <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg border border-amber-100 dark:border-amber-900/30">
              {dict.no_tip_culture}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {presetTips.map((pct) => (
              <button
                key={pct}
                onClick={() => { setTipPercent(pct); setIsCustom(false); }}
                className={`flex-1 min-w-[52px] py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                  !isCustom && tipPercent === pct
                    ? `${theme.primaryBtn} text-white shadow-md ${theme.shadow} dark:shadow-none`
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {pct}%
              </button>
            ))}
            <input
              type="number"
              min="0"
              value={customTip}
              onChange={(e) => { setCustomTip(e.target.value); setIsCustom(true); }}
              onFocus={() => setIsCustom(true)}
              placeholder="Custom"
              aria-label="Custom tip percentage"
              className={`flex-1 min-w-[72px] px-3 py-2.5 rounded-xl text-sm font-bold text-center border transition-all focus:outline-none ${
                isCustom
                  ? `${theme.primaryBtn} text-white border-transparent placeholder-white/50`
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-gray-800'
              }`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_people}</label>
          <input
            type="number"
            min="1"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            placeholder="1"
            aria-label={dict.label_people}
            className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 ${theme.ring} focus:outline-none transition-all`}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={reset}
            className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title={dict.tooltip_reset}
            aria-label={dict.tooltip_reset}
          >
            <RefreshCcw size={18} />
          </button>
        </div>

        {result && (
          <div className="grid grid-cols-3 gap-3 animate-in fade-in zoom-in duration-300">
            {[
              { label: dict.result_tip,       value: formatCurrency(result.tip,       currency) },
              { label: dict.result_total,      value: formatCurrency(result.total,     currency) },
              { label: dict.result_per_person, value: formatCurrency(result.perPerson, currency) },
            ].map((item) => (
              <div key={item.label} className={`${theme.accentBg} p-4 rounded-2xl text-center border ${theme.accentBorder}`}>
                <span className={`block text-lg md:text-xl font-black ${theme.accent}`}>{item.value}</span>
                <span className={`text-xs font-bold ${theme.accentLight} uppercase tracking-wider leading-tight`}>{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TipCalculator;
