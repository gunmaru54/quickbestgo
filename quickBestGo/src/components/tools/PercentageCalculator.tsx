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

const PercentageCalculator = ({ dict, lang }: PercentageCalculatorProps) => {
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
    if (!isNaN(p) && !isNaN(b)) {
      setResultA((p / 100) * b);
    } else {
      setResultA(null);
    }
  }, [percentA, baseA]);

  useEffect(() => {
    const b = parseFloat(baseB);
    const p = parseFloat(percentB);
    if (!isNaN(b) && !isNaN(p)) {
      setResultB(b + (b * p) / 100);
    } else {
      setResultB(null);
    }
  }, [baseB, percentB]);

  useEffect(() => {
    const b = parseFloat(baseC);
    const p = parseFloat(percentC);
    if (!isNaN(b) && !isNaN(p)) {
      setResultC(b - (b * p) / 100);
    } else {
      setResultC(null);
    }
  }, [baseC, percentC]);

  const formatNumber = (num: number) => (Number.isInteger(num) ? num.toString() : num.toFixed(2));
  const cardClass = 'bg-white dark:bg-[#1a1a1a] rounded-3xl border dark:border-gray-800 shadow-sm p-6 md:p-8 transition-colors duration-300';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className={cardClass}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{dict.title_mode1 || '퍼센트 구하기'}</h3>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{dict.example_mode1 || '예: 200의 15%는 30'}</div>
        <div className="flex flex-wrap items-center gap-2">
          {lang === 'ko' || lang === 'ja' ? (
            <>
              <input type="number" value={baseA} onChange={(e) => setBaseA(e.target.value)} className="w-24 px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="200" />
              <span className="text-gray-700 dark:text-gray-300">{dict.label_of || 'of'}</span>
              <input type="number" value={percentA} onChange={(e) => setPercentA(e.target.value)} className="w-24 px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="15" />
              <span className="text-gray-700 dark:text-gray-300">{dict.label_percent || '%'}</span>
            </>
          ) : (
            <>
              <input type="number" value={percentA} onChange={(e) => setPercentA(e.target.value)} className="w-24 px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="15" />
              <span className="text-gray-700 dark:text-gray-300">{dict.label_percent || '%'} {dict.label_of || 'of'}</span>
              <input type="number" value={baseA} onChange={(e) => setBaseA(e.target.value)} className="w-24 px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="200" />
            </>
          )}
          <span className="text-gray-700 dark:text-gray-300">=</span>
          <span className="font-semibold text-gray-900 dark:text-white">{resultA !== null ? formatNumber(resultA) : '-'}</span>
        </div>
      </div>

      <div className={cardClass}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{dict.title_mode2 || '증가 계산'}</h3>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{dict.example_mode2 || '예: 200에서 15% 증가하면 230'}</div>
        <div className="flex flex-wrap items-center gap-2">
          <input type="number" value={baseB} onChange={(e) => setBaseB(e.target.value)} className="w-24 px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" placeholder="200" />
          <span className="text-gray-700 dark:text-gray-300">+</span>
          <input type="number" value={percentB} onChange={(e) => setPercentB(e.target.value)} className="w-24 px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" placeholder="15" />
          <span className="text-gray-700 dark:text-gray-300">{dict.label_percent || '%'}</span>
          <span className="text-gray-700 dark:text-gray-300">=</span>
          <span className="font-semibold text-gray-900 dark:text-white">{resultB !== null ? formatNumber(resultB) : '-'}</span>
        </div>
      </div>

      <div className={cardClass}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{dict.title_mode3 || '감소 계산'}</h3>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{dict.example_mode3 || '예: 200에서 15% 감소하면 170'}</div>
        <div className="flex flex-wrap items-center gap-2">
          <input type="number" value={baseC} onChange={(e) => setBaseC(e.target.value)} className="w-24 px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="200" />
          <span className="text-gray-700 dark:text-gray-300">-</span>
          <input type="number" value={percentC} onChange={(e) => setPercentC(e.target.value)} className="w-24 px-3 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="15" />
          <span className="text-gray-700 dark:text-gray-300">{dict.label_percent || '%'}</span>
          <span className="text-gray-700 dark:text-gray-300">=</span>
          <span className="font-semibold text-gray-900 dark:text-white">{resultC !== null ? formatNumber(resultC) : '-'}</span>
        </div>
      </div>
    </div>
  );
};

export default PercentageCalculator;
