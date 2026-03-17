'use client';

import React, { useState } from 'react';
import { Calendar, RefreshCcw } from 'lucide-react';

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
}

const AgeCalculator = ({ dict, lang }: AgeCalculatorProps) => {
  const [birthDate, setBirthDate] = useState<string>('');
  const [result, setResult] = useState<AgeResult | null>(null);

  const calculateAge = () => {
    if (!birthDate) return;

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
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-[#1a1a1a] rounded-3xl border dark:border-gray-800 shadow-sm p-6 md:p-8 transition-colors duration-300">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_birthdate}</label>
          <input
            type="date"
            lang={lang}
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={calculateAge}
            className="flex-grow py-4 bg-blue-600 dark:bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95 transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-blue-200 dark:shadow-none"
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
              <div key={item.label} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl text-center border border-blue-100 dark:border-blue-900/30">
                <span className="block text-2xl md:text-3xl font-black text-blue-600 dark:text-blue-400">{item.value}</span>
                <span className="text-xs font-bold text-blue-400 dark:text-blue-300 uppercase tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgeCalculator;
