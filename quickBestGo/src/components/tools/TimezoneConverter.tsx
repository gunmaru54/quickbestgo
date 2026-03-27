'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { CategoryTheme } from '@/lib/tools';

interface TimezoneConverterProps {
  dict: {
    label_from: string;
    label_to: string;
    label_time: string;
    btn_swap: string;
    btn_convert: string;
    label_world_clock: string;
    label_current_time: string;
    error_invalid: string;
  };
  lang: string;
  theme: CategoryTheme;
}

const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'New York (ET)' },
  { value: 'America/Chicago', label: 'Chicago (CT)' },
  { value: 'America/Denver', label: 'Denver (MT)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PT)' },
  { value: 'America/Toronto', label: 'Toronto (ET)' },
  { value: 'America/Vancouver', label: 'Vancouver (PT)' },
  { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)' },
  { value: 'America/Mexico_City', label: 'Mexico City (CT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)' },
  { value: 'Europe/Rome', label: 'Rome (CET/CEST)' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)' },
  { value: 'Europe/Stockholm', label: 'Stockholm (CET/CEST)' },
  { value: 'Europe/Moscow', label: 'Moscow (MSK)' },
  { value: 'Africa/Cairo', label: 'Cairo (EET)' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg (SAST)' },
  { value: 'Africa/Lagos', label: 'Lagos (WAT)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Karachi', label: 'Karachi (PKT)' },
  { value: 'Asia/Kolkata', label: 'Kolkata (IST)' },
  { value: 'Asia/Dhaka', label: 'Dhaka (BST)' },
  { value: 'Asia/Bangkok', label: 'Bangkok (ICT)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Seoul', label: 'Seoul (KST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEST/AEDT)' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)' },
  { value: 'Pacific/Honolulu', label: 'Honolulu (HST)' },
];

const WORLD_CLOCKS = [
  { city: 'New York', tz: 'America/New_York' },
  { city: 'London', tz: 'Europe/London' },
  { city: 'Paris', tz: 'Europe/Paris' },
  { city: 'Dubai', tz: 'Asia/Dubai' },
  { city: 'Tokyo', tz: 'Asia/Tokyo' },
  { city: 'Sydney', tz: 'Australia/Sydney' },
];

function formatTime(date: Date, tz: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: tz,
    }).format(date);
  } catch {
    return '--:--:--';
  }
}

function formatDate(date: Date, tz: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: tz,
    }).format(date);
  } catch {
    return '';
  }
}

function getCurrentLocalTime(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
}

function convertTime(timeStr: string, fromTz: string, toTz: string): string {
  try {
    const [h, m] = timeStr.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return '';

    // Build a date for today in the source timezone
    const now = new Date();
    const dateStr = new Intl.DateTimeFormat('en-CA', { timeZone: fromTz }).format(now);
    const localDate = new Date(`${dateStr}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);

    // Offset trick: get source timezone offset
    const srcFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: fromTz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const srcParts = srcFormatter.formatToParts(localDate);
    const srcH = Number(srcParts.find(p => p.type === 'hour')?.value ?? '0');
    const srcM = Number(srcParts.find(p => p.type === 'minute')?.value ?? '0');

    // Calculate offset between desired time and what formatter gives us
    const inputMinutes = h * 60 + m;
    const fmtMinutes = srcH * 60 + srcM;
    const diffMinutes = inputMinutes - fmtMinutes;

    const adjusted = new Date(localDate.getTime() + diffMinutes * 60 * 1000);

    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: toTz,
    }).format(adjusted);
  } catch {
    return '';
  }
}

const TimezoneConverter = ({ dict, theme }: TimezoneConverterProps) => {
  const [fromTz, setFromTz] = useState(getUserTimezone());
  const [toTz, setToTz] = useState('UTC');
  const [inputTime, setInputTime] = useState(getCurrentLocalTime());
  const [convertedTime, setConvertedTime] = useState('');
  const [now, setNow] = useState(new Date());
  const [error, setError] = useState('');

  // Update world clocks every second
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleConvert = useCallback(() => {
    if (!fromTz || !toTz) {
      setError(dict.error_invalid);
      return;
    }
    const result = convertTime(inputTime, fromTz, toTz);
    if (!result) {
      setError(dict.error_invalid);
      setConvertedTime('');
    } else {
      setError('');
      setConvertedTime(result);
    }
  }, [inputTime, fromTz, toTz, dict.error_invalid]);

  const handleSwap = useCallback(() => {
    setFromTz(toTz);
    setToTz(fromTz);
    setConvertedTime('');
    setError('');
  }, [fromTz, toTz]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Main converter card */}
      <div className={`bg-white dark:bg-[#1a1a1a] rounded-3xl border ${theme.cardBorder} shadow-sm p-4 sm:p-6 md:p-8 transition-colors duration-300`}>
        <div className="space-y-6">
          {/* Current time display */}
          <div className="text-center">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
              {dict.label_current_time}
            </p>
            <p className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tabular-nums">
              {formatTime(now, fromTz)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatDate(now, fromTz)}</p>
          </div>

          {/* From timezone */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_from}</label>
            <select
              value={fromTz}
              onChange={(e) => { setFromTz(e.target.value); setConvertedTime(''); }}
              style={{ fontSize: '16px' }}
              className={`w-full min-w-0 px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 ${theme.ring} focus:outline-none transition-all`}
            >
              {TIMEZONE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Time input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_time}</label>
            <input
              type="time"
              value={inputTime}
              onChange={(e) => { setInputTime(e.target.value); setConvertedTime(''); }}
              style={{ fontSize: '16px' }}
              className={`w-full min-w-0 px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 ${theme.ring} focus:outline-none transition-all`}
            />
          </div>

          {/* Swap button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              title={dict.btn_swap}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-semibold text-sm"
            >
              <ArrowLeftRight size={16} />
              {dict.btn_swap}
            </button>
          </div>

          {/* To timezone */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_to}</label>
            <select
              value={toTz}
              onChange={(e) => { setToTz(e.target.value); setConvertedTime(''); }}
              style={{ fontSize: '16px' }}
              className={`w-full min-w-0 px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 ${theme.ring} focus:outline-none transition-all`}
            >
              {TIMEZONE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Convert button */}
          <button
            onClick={handleConvert}
            className={`w-full py-4 px-6 ${theme.primaryBtn} text-white font-bold rounded-xl active:scale-95 transition-all text-lg shadow-lg ${theme.shadow} dark:shadow-none`}
          >
            {dict.btn_convert}
          </button>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 font-medium text-center">{error}</p>
          )}

          {/* Result */}
          {convertedTime && !error && (
            <div className={`${theme.accentBg} border ${theme.accentBorder} rounded-2xl p-4 sm:p-6 text-center animate-in fade-in zoom-in duration-300`}>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 truncate">
                {inputTime} ({TIMEZONE_OPTIONS.find(o => o.value === fromTz)?.label ?? fromTz})
              </p>
              <p className={`text-3xl sm:text-4xl font-black ${theme.accent} tabular-nums`}>{convertedTime}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                {TIMEZONE_OPTIONS.find(o => o.value === toTz)?.label ?? toTz}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* World clock */}
      <div className={`bg-white dark:bg-[#1a1a1a] rounded-3xl border ${theme.cardBorder} shadow-sm p-6 md:p-8 transition-colors duration-300`}>
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
          {dict.label_world_clock}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {WORLD_CLOCKS.map(({ city, tz }) => (
            <div
              key={tz}
              className={`${theme.accentBg} p-4 rounded-2xl text-center border ${theme.accentBorder}`}
            >
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{city}</p>
              <p className={`text-xl font-black ${theme.accent} tabular-nums`}>{formatTime(now, tz)}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{formatDate(now, tz)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimezoneConverter;
