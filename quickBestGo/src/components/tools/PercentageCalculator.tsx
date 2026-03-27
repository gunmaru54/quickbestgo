'use client';

import React, { useState, useEffect } from 'react';

interface PercentageCalculatorProps {
  dict: {
    title_mode1?: string;
    title_mode2?: string;
    title_mode3?: string;
    example_mode1?: string;
    example_mode2?: string;
    example_mode3?: string;
    label_percent?: string;
    label_of?: string;
  };
  lang: string;
}

const PercentageCalculator = ({ dict }: PercentageCalculatorProps) => {
  const [percentA, setPercentA] = useState('');
  const [baseA, setBaseA] = useState('');
  const [resultA, setResultA] = useState<number | null>(null);

  const [baseB, setBaseB] = useState('');
  const [percentB, setPercentB] = useState('');
  const [resultB, setResultB] = useState<number | null>(null);

  const [baseC, setBaseC] = useState('');
  const [percentC, setPercentC] = useState('');
  const [resultC, setResultC] = useState<number | null>(null);

  useEffect(() => {
    const p = parseFloat(percentA);
    const b = parseFloat(baseA);
    setResultA(!isNaN(p) && !isNaN(b) ? (p / 100) * b : null);
  }, [percentA, baseA]);

  useEffect(() => {
    const b = parseFloat(baseB);
    const p = parseFloat(percentB);
    setResultB(!isNaN(b) && !isNaN(p) ? b + (b * p) / 100 : null);
  }, [baseB, percentB]);

  useEffect(() => {
    const b = parseFloat(baseC);
    const p = parseFloat(percentC);
    setResultC(!isNaN(b) && !isNaN(p) ? b - (b * p) / 100 : null);
  }, [baseC, percentC]);

  const fmt = (num: number) => (Number.isInteger(num) ? num.toString() : num.toFixed(2));

  const cardClass = 'bg-white dark:bg-[#1a1a1a] rounded-3xl border border-[#990FFA]/20 dark:border-[#990FFA]/15 shadow-sm p-6 md:p-8 transition-colors duration-300';
  const inputClass = 'w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:outline-none transition-all';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Mode 1: X% of Y */}
      <div className={cardClass}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{dict.title_mode1 || '퍼센트 구하기'}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{dict.example_mode1 || '예: 200의 15%는 30'}</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              {dict.label_percent || '%'}
            </label>
            <input
              type="number"
              aria-label="percentage"
              value={percentA}
              onChange={(e) => setPercentA(e.target.value)}
              placeholder="15"
              className={`${inputClass} focus:ring-blue-500`}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              {dict.label_of || 'of'}
            </label>
            <input
              type="number"
              aria-label="base value"
              value={baseA}
              onChange={(e) => setBaseA(e.target.value)}
              placeholder="200"
              className={`${inputClass} focus:ring-blue-500`}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400">=</span>
          <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {resultA !== null ? fmt(resultA) : '—'}
          </span>
        </div>
      </div>

      {/* Mode 2: Y + X% */}
      <div className={cardClass}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{dict.title_mode2 || '증가 계산'}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{dict.example_mode2 || '예: 200에서 15% 증가하면 230'}</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              값
            </label>
            <input
              type="number"
              aria-label="base value"
              value={baseB}
              onChange={(e) => setBaseB(e.target.value)}
              placeholder="200"
              className={`${inputClass} focus:ring-green-500`}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              +{dict.label_percent || '%'}
            </label>
            <input
              type="number"
              aria-label="percentage"
              value={percentB}
              onChange={(e) => setPercentB(e.target.value)}
              placeholder="15"
              className={`${inputClass} focus:ring-green-500`}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400">=</span>
          <span className="text-2xl font-black text-green-600 dark:text-green-400">
            {resultB !== null ? fmt(resultB) : '—'}
          </span>
        </div>
      </div>

      {/* Mode 3: Y - X% */}
      <div className={cardClass}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{dict.title_mode3 || '감소 계산'}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{dict.example_mode3 || '예: 200에서 15% 감소하면 170'}</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              값
            </label>
            <input
              type="number"
              aria-label="base value"
              value={baseC}
              onChange={(e) => setBaseC(e.target.value)}
              placeholder="200"
              className={`${inputClass} focus:ring-orange-500`}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              -{dict.label_percent || '%'}
            </label>
            <input
              type="number"
              aria-label="percentage"
              value={percentC}
              onChange={(e) => setPercentC(e.target.value)}
              placeholder="15"
              className={`${inputClass} focus:ring-orange-500`}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400">=</span>
          <span className="text-2xl font-black text-orange-600 dark:text-orange-400">
            {resultC !== null ? fmt(resultC) : '—'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PercentageCalculator;
