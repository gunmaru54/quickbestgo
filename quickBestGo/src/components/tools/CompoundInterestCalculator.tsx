'use client';

import React, { useState } from 'react';
import { TrendingUp, RefreshCcw } from 'lucide-react';

interface CompoundInterestCalculatorProps {
  dict: {
    label_principal: string;
    label_rate: string;
    label_frequency: string;
    label_years: string;
    freq_annually: string;
    freq_semiannually: string;
    freq_quarterly: string;
    freq_monthly: string;
    freq_daily: string;
    btn_calculate: string;
    tooltip_reset: string;
    result_final: string;
    result_principal: string;
    result_interest: string;
    error_invalid: string;
  };
}

interface Result {
  futureValue: number;
  principal: number;
  totalInterest: number;
}

const FREQUENCIES: Record<string, number> = {
  annually: 1,
  semiannually: 2,
  quarterly: 4,
  monthly: 12,
  daily: 365,
};

const CompoundInterestCalculator = ({ dict }: CompoundInterestCalculatorProps) => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [years, setYears] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const n = FREQUENCIES[frequency];
    const t = parseFloat(years);

    if (!P || !r || !t || P <= 0 || r <= 0 || t <= 0) {
      setError(dict.error_invalid);
      setResult(null);
      return;
    }

    setError('');
    const A = P * Math.pow(1 + r / n, n * t);
    setResult({
      futureValue: A,
      principal: P,
      totalInterest: A - P,
    });
  };

  const reset = () => {
    setPrincipal('');
    setRate('');
    setFrequency('monthly');
    setYears('');
    setResult(null);
    setError('');
  };

  const freqOptions = [
    { value: 'annually', label: dict.freq_annually },
    { value: 'semiannually', label: dict.freq_semiannually },
    { value: 'quarterly', label: dict.freq_quarterly },
    { value: 'monthly', label: dict.freq_monthly },
    { value: 'daily', label: dict.freq_daily },
  ];

  const fmt = (n: number) =>
    n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-[#1a1a1a] rounded-3xl border dark:border-gray-800 shadow-sm p-6 md:p-8 transition-colors duration-300">
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_principal}</label>
          <input
            type="number"
            min="0"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="10000"
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_rate}</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="5"
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_frequency}</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          >
            {freqOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_years}</label>
          <input
            type="number"
            min="0"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder="10"
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}

        <div className="flex gap-2">
          <button
            onClick={calculate}
            className="flex-grow py-4 bg-blue-600 dark:bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95 transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-blue-200 dark:shadow-none"
          >
            <TrendingUp size={20} />
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
          <div className="space-y-3 animate-in fade-in zoom-in duration-300">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl text-center border border-blue-100 dark:border-blue-900/30">
              <span className="block text-3xl md:text-4xl font-black text-blue-600 dark:text-blue-400">
                ${fmt(result.futureValue)}
              </span>
              <span className="text-sm font-bold text-blue-400 dark:text-blue-300 uppercase tracking-wider">{dict.result_final}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl text-center border border-gray-100 dark:border-gray-700">
                <span className="block text-xl font-black text-gray-700 dark:text-gray-200">${fmt(result.principal)}</span>
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{dict.result_principal}</span>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl text-center border border-green-100 dark:border-green-900/30">
                <span className="block text-xl font-black text-green-600 dark:text-green-400">${fmt(result.totalInterest)}</span>
                <span className="text-xs font-bold text-green-400 dark:text-green-300 uppercase tracking-wider">{dict.result_interest}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompoundInterestCalculator;
