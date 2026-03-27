'use client';

import React, { useState, useCallback } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { CategoryTheme } from '@/lib/tools';

interface UnitConverterProps {
  dict: {
    tab_length: string;
    tab_weight: string;
    tab_temperature: string;
    tab_volume: string;
    label_from: string;
    label_to: string;
    label_value: string;
    btn_swap: string;
    result_label: string;
    error_invalid: string;
  };
  theme: CategoryTheme;
}

type Category = 'length' | 'weight' | 'temperature' | 'volume';

interface UnitDef {
  key: string;
  label: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

const UNITS: Record<Category, UnitDef[]> = {
  length: [
    { key: 'km',  label: 'km',  toBase: (v) => v * 1000,        fromBase: (v) => v / 1000 },
    { key: 'mi',  label: 'mi',  toBase: (v) => v * 1609.344,     fromBase: (v) => v / 1609.344 },
    { key: 'm',   label: 'm',   toBase: (v) => v,                fromBase: (v) => v },
    { key: 'ft',  label: 'ft',  toBase: (v) => v * 0.3048,       fromBase: (v) => v / 0.3048 },
    { key: 'cm',  label: 'cm',  toBase: (v) => v * 0.01,         fromBase: (v) => v / 0.01 },
    { key: 'in',  label: 'in',  toBase: (v) => v * 0.0254,       fromBase: (v) => v / 0.0254 },
  ],
  weight: [
    { key: 'kg',  label: 'kg',  toBase: (v) => v,                fromBase: (v) => v },
    { key: 'lb',  label: 'lb',  toBase: (v) => v * 0.453592,     fromBase: (v) => v / 0.453592 },
    { key: 'g',   label: 'g',   toBase: (v) => v * 0.001,        fromBase: (v) => v / 0.001 },
    { key: 'oz',  label: 'oz',  toBase: (v) => v * 0.0283495,    fromBase: (v) => v / 0.0283495 },
  ],
  temperature: [
    { key: 'C',   label: '°C',  toBase: (v) => v,                fromBase: (v) => v },
    { key: 'F',   label: '°F',  toBase: (v) => (v - 32) * 5/9,  fromBase: (v) => v * 9/5 + 32 },
    { key: 'K',   label: 'K',   toBase: (v) => v - 273.15,       fromBase: (v) => v + 273.15 },
  ],
  volume: [
    { key: 'L',    label: 'L',      toBase: (v) => v,             fromBase: (v) => v },
    { key: 'gal',  label: 'gal',    toBase: (v) => v * 3.78541,   fromBase: (v) => v / 3.78541 },
    { key: 'mL',   label: 'mL',     toBase: (v) => v * 0.001,     fromBase: (v) => v / 0.001 },
    { key: 'floz', label: 'fl oz',  toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
  ],
};

const UnitConverter = ({ dict, theme }: UnitConverterProps) => {
  const [category, setCategory] = useState<Category>('length');
  const [fromUnit, setFromUnit] = useState('km');
  const [toUnit, setToUnit] = useState('mi');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const tabs: { key: Category; label: string }[] = [
    { key: 'length',      label: dict.tab_length },
    { key: 'weight',      label: dict.tab_weight },
    { key: 'temperature', label: dict.tab_temperature },
    { key: 'volume',      label: dict.tab_volume },
  ];

  const defaultUnits: Record<Category, [string, string]> = {
    length:      ['km', 'mi'],
    weight:      ['kg', 'lb'],
    temperature: ['C', 'F'],
    volume:      ['L', 'gal'],
  };

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setFromUnit(defaultUnits[cat][0]);
    setToUnit(defaultUnits[cat][1]);
    setValue('');
    setError('');
  };

  const convert = useCallback((): string => {
    if (!value) return '';
    const num = parseFloat(value);
    if (isNaN(num)) return '';

    const units = UNITS[category];
    const from = units.find((u) => u.key === fromUnit);
    const to = units.find((u) => u.key === toUnit);
    if (!from || !to) return '';

    const base = from.toBase(num);
    const result = to.fromBase(base);
    const formatted = parseFloat(result.toFixed(4));
    return formatted.toLocaleString(undefined, { maximumFractionDigits: 4 });
  }, [value, category, fromUnit, toUnit]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setError('');
  };

  const handleValueChange = (v: string) => {
    setValue(v);
    if (v && isNaN(parseFloat(v))) {
      setError(dict.error_invalid);
    } else {
      setError('');
    }
  };

  const result = convert();
  const units = UNITS[category];

  return (
    <div className={`max-w-lg mx-auto bg-white dark:bg-[#1a1a1a] rounded-3xl border ${theme.cardBorder} shadow-sm p-6 md:p-8 transition-colors duration-300`}>
      <div className="space-y-5">
        {/* Category Tabs */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleCategoryChange(tab.key)}
              className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                category === tab.key
                  ? `bg-white dark:bg-gray-700 ${theme.accent} shadow-sm`
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* From Row */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_from}</label>
          <div className="flex gap-2">
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className={`w-28 px-3 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 ${theme.ring} focus:outline-none transition-all`}
            >
              {units.map((u) => (
                <option key={u.key} value={u.key}>{u.label}</option>
              ))}
            </select>
            <input
              type="number"
              value={value}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder="0"
              className={`flex-1 px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 ${theme.ring} focus:outline-none transition-all`}
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold text-sm transition-all active:scale-95"
          >
            <ArrowLeftRight size={16} />
            {dict.btn_swap}
          </button>
        </div>

        {/* To Row */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_to}</label>
          <div className="flex gap-2">
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className={`w-28 px-3 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 ${theme.ring} focus:outline-none transition-all`}
            >
              {units.map((u) => (
                <option key={u.key} value={u.key}>{u.label}</option>
              ))}
            </select>
            <div className={`flex-1 px-4 py-3 ${theme.accentBg} border ${theme.accentBorder} rounded-xl`}>
              <span className={`${theme.accent} font-bold text-lg`}>
                {result || <span className="text-gray-400 dark:text-gray-600 font-normal text-base">—</span>}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}

        {result && !error && (
          <div className={`${theme.accentBg} p-4 rounded-2xl text-center border ${theme.accentBorder} animate-in fade-in zoom-in duration-300`}>
            <span className={`text-sm font-semibold ${theme.accentLight} uppercase tracking-wider`}>{dict.result_label}</span>
            <p className={`text-2xl font-black ${theme.accent} mt-1`}>
              {value} {units.find((u) => u.key === fromUnit)?.label} = {result} {units.find((u) => u.key === toUnit)?.label}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitConverter;
