'use client';

import { CURRENCIES, CurrencyCode } from '@/lib/currency';
import { useCurrency } from '@/components/CurrencyProvider';

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg px-2 py-1 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
      <span className="text-sm text-gray-400 dark:text-gray-500 font-medium select-none">
        {CURRENCIES[currency].symbol}
      </span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
        className="text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 outline-none cursor-pointer pr-1"
        aria-label="Currency"
        style={{ colorScheme: 'light dark' }}
      >
        {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
          <option key={code} value={code} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200">
            {code} ({CURRENCIES[code].symbol})
          </option>
        ))}
      </select>
    </div>
  );
}
