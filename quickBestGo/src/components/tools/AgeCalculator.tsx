'use client';

import React, { useState, useRef } from 'react';
import { Calendar, RefreshCcw } from 'lucide-react';
import { CategoryTheme } from '@/lib/tools';

interface AgeResult {
  years: number;
  months: number;
  days: number;
}

interface AgeCalculatorProps {
  dict: {
    label_birthdate: string;
    btn_calculate: string;
    label_years: string;
    label_months: string;
    label_days: string;
    tooltip_reset: string;
  };
  lang: string;
  theme: CategoryTheme;
}

const AgeCalculator = ({ dict, lang, theme }: AgeCalculatorProps) => {
  const [birthDate, setBirthDate] = useState<string>('');
  const [result, setResult] = useState<AgeResult | null>(null);
  const [dateError, setDateError] = useState(false);
  const dateRef = useRef<HTMLInputElement>(null);

  const calculateAge = () => {
    if (!birthDate) {
      setDateError(true);
      dateRef.current?.focus();
      return;
    }
    setDateError(false);

    const today = new Date();
    const birth = new Date(birthDate);

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    setResult({ years, months, days });
  };

  const reset = () => {
    setBirthDate('');
    setResult(null);
    setDateError(false);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-[#1a1a1a] rounded-3xl border dark:border-gray-800 shadow-sm p-4 sm:p-6 md:p-8 transition-colors duration-300">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_birthdate}</label>
          <input
            ref={dateRef}
            type="date"
            lang={lang}
            value={birthDate}
            onChange={(e) => { setBirthDate(e.target.value); if (dateError) setDateError(false); }}
            aria-label={dict.label_birthdate}
            style={{ colorScheme: 'light dark', fontSize: '16px' }}
            className={`w-full min-w-0 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none transition-all ${dateError ? 'border border-red-400 dark:border-red-500 ring-2 ring-red-400/30' : `border dark:border-gray-700 focus:ring-2 ${theme.ring}`}`}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={calculateAge}
            className={`flex-grow py-4 ${theme.primaryBtn} text-white font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 text-lg shadow-lg ${theme.shadow} dark:shadow-none`}
          >
            <Calendar size={20} />
            {dict.btn_calculate}
          </button>
          <button
            onClick={reset}
            className="p-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title={dict.tooltip_reset}
          >
            <RefreshCcw size={20} />
          </button>
        </div>

        {result && (
          <div className="grid grid-cols-3 gap-3 animate-in fade-in zoom-in duration-300">
            {[
              { label: dict.label_years, value: result.years },
              { label: dict.label_months, value: result.months },
              { label: dict.label_days, value: result.days },
            ].map((item) => (
              <div key={item.label} className={`${theme.accentBg} p-4 rounded-2xl text-center border ${theme.accentBorder}`}>
                <span className={`block text-2xl md:text-3xl font-black ${theme.accent}`}>{item.value}</span>
                <span className={`text-xs font-bold ${theme.accentLight} uppercase tracking-wider`}>{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgeCalculator;
