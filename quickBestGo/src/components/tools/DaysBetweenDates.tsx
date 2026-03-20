'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCcw } from 'lucide-react';

interface DaysBetweenDatesProps {
  dict: {
    label_start: string;
    label_end: string;
    btn_calculate: string;
    tooltip_reset: string;
    result_days: string;
    result_weeks: string;
    result_months: string;
    result_years: string;
    result_working_days: string;
    preset_week: string;
    preset_month: string;
    preset_year: string;
    preset_100: string;
    label_weekends: string;
    error_invalid: string;
  };
  lang: string;
}

interface DateResult {
  days: number;
  weeks: number;
  months: number;
  years: number;
  workingDays: number;
  weekends: number;
}

function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function calcWorkingDays(start: Date, end: Date): number {
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const dow = cur.getDay();
    if (dow !== 0 && dow !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

function calcWeekends(start: Date, end: Date): number {
  let count = 0;
  const cur = new Date(start);
  // Count Saturday-Sunday pairs
  while (cur <= end) {
    const dow = cur.getDay();
    if (dow === 6) count++; // count full weekends as Saturday occurrences
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

function computeResult(startStr: string, endStr: string): DateResult | null {
  const start = new Date(startStr);
  const end = new Date(endStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  const startMs = start.getTime();
  const endMs = end.getTime();
  const diffMs = endMs - startMs;
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(Math.abs(days) / 7) * Math.sign(days);
  const months = Math.floor(Math.abs(days) / 30.44) * Math.sign(days);
  const years = Math.floor(Math.abs(days) / 365.25) * Math.sign(days);

  const [s, e] = days >= 0 ? [start, end] : [end, start];
  const workingDays = calcWorkingDays(s, e) * Math.sign(days);
  const weekends = calcWeekends(s, e);

  return { days, weeks, months, years, workingDays, weekends };
}

const DaysBetweenDates = ({ dict, lang }: DaysBetweenDatesProps) => {
  const today = toDateString(new Date());
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [result, setResult] = useState<DateResult | null>(null);
  const [error, setError] = useState('');

  const calculate = useCallback(() => {
    if (!startDate || !endDate) {
      setError(dict.error_invalid);
      setResult(null);
      return;
    }
    const res = computeResult(startDate, endDate);
    if (!res) {
      setError(dict.error_invalid);
      setResult(null);
    } else {
      setError('');
      setResult(res);
    }
  }, [startDate, endDate, dict.error_invalid]);

  const reset = useCallback(() => {
    setStartDate(today);
    setEndDate(today);
    setResult(null);
    setError('');
  }, [today]);

  const applyPreset = useCallback((days: number) => {
    const s = new Date();
    const e = new Date();
    e.setDate(e.getDate() + days);
    setStartDate(toDateString(s));
    setEndDate(toDateString(e));
    const res = computeResult(toDateString(s), toDateString(e));
    if (res) { setResult(res); setError(''); }
  }, []);

  const applyPresetYear = useCallback(() => {
    const s = new Date();
    const e = new Date(s);
    e.setFullYear(e.getFullYear() + 1);
    setStartDate(toDateString(s));
    setEndDate(toDateString(e));
    const res = computeResult(toDateString(s), toDateString(e));
    if (res) { setResult(res); setError(''); }
  }, []);

  const resultCards = result ? [
    { label: dict.result_days, value: Math.abs(result.days), highlight: true },
    { label: dict.result_weeks, value: Math.abs(result.weeks), highlight: false },
    { label: dict.result_months, value: Math.abs(result.months), highlight: false },
    { label: dict.result_years, value: Math.abs(result.years), highlight: false },
    { label: dict.result_working_days, value: Math.abs(result.workingDays), highlight: false },
    { label: dict.label_weekends, value: result.weekends, highlight: false },
  ] : [];

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-[#1a1a1a] rounded-3xl border dark:border-gray-800 shadow-sm p-6 md:p-8 transition-colors duration-300">
      <div className="space-y-6">
        {/* Date inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_start}</label>
            <input
              type="date"
              lang={lang}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_end}</label>
            <input
              type="date"
              lang={lang}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: dict.preset_week, action: () => applyPreset(7) },
            { label: dict.preset_month, action: () => applyPreset(30) },
            { label: dict.preset_100, action: () => applyPreset(100) },
            { label: dict.preset_year, action: applyPresetYear },
          ].map(({ label, action }) => (
            <button
              key={label}
              onClick={action}
              className="px-3 py-1.5 text-xs font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Calculate + Reset */}
        <div className="flex gap-2">
          <button
            onClick={calculate}
            className="flex-grow py-4 px-6 bg-blue-600 dark:bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95 transition-all text-lg shadow-lg shadow-blue-200 dark:shadow-none"
          >
            {dict.btn_calculate}
          </button>
          <button
            onClick={reset}
            title={dict.tooltip_reset}
            className="p-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCcw size={20} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
        )}

        {/* Results */}
        {result && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-in fade-in zoom-in duration-300">
            {resultCards.map((card) => (
              <div
                key={card.label}
                className={`p-4 rounded-2xl text-center border ${
                  card.highlight
                    ? 'bg-blue-600 dark:bg-blue-700 border-blue-700 dark:border-blue-600 col-span-2 sm:col-span-1'
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30'
                }`}
              >
                <span className={`block font-black ${card.highlight ? 'text-3xl md:text-4xl text-white' : 'text-2xl md:text-3xl text-blue-600 dark:text-blue-400'}`}>
                  {card.value}
                </span>
                <span className={`text-xs font-bold uppercase tracking-wide mt-1 block ${card.highlight ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  {card.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DaysBetweenDates;
