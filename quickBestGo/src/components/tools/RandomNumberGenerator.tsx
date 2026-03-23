'use client';

import React, { useState, useCallback } from 'react';
import { Hash, RotateCcw } from 'lucide-react';
import { CategoryTheme } from '@/lib/tools';

interface RandomNumberGeneratorProps {
  dict: {
    label_min: string;
    label_max: string;
    btn_generate: string;
    label_result: string;
    label_history: string;
    error_min_max: string;
  };
  theme: CategoryTheme;
}

const RandomNumberGenerator = ({ dict, theme }: RandomNumberGeneratorProps) => {
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);

  const generateRandom = useCallback(() => {
    if (min >= max) {
      alert(dict.error_min_max);
      return;
    }
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    setResult(num);
    setHistory((prev) => [num, ...prev].slice(0, 5));
  }, [min, max, dict.error_min_max]);

  const reset = () => {
    setMin(1);
    setMax(100);
    setResult(null);
    setHistory([]);
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-[#1a1a1a] rounded-3xl border dark:border-gray-800 shadow-sm p-6 md:p-8 transition-colors duration-300">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_min}</label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(Number(e.target.value))}
              className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 ${theme.ring} focus:outline-none transition-all`}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_max}</label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
              className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 ${theme.ring} focus:outline-none transition-all`}
            />
          </div>
        </div>

        <button
          onClick={generateRandom}
          className={`w-full py-4 ${theme.primaryBtn} text-white font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 text-lg shadow-lg ${theme.shadow} dark:shadow-none`}
        >
          <Hash size={20} />
          {dict.btn_generate}
        </button>

        {result !== null && (
          <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
            <span className="text-sm text-gray-500 dark:text-gray-400 block mb-2 font-medium">{dict.label_result}</span>
            <div className={`text-7xl font-black ${theme.accent} tabular-nums`}>
              {result}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="border-t dark:border-gray-800 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{dict.label_history}</h3>
              <button 
                onClick={reset}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <RotateCcw size={16} />
              </button>
            </div>
            <div className="flex gap-2">
              {history.map((h, i) => (
                <div 
                  key={i} 
                  className="flex-1 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center font-bold text-gray-600 dark:text-gray-400 border dark:border-gray-700 animate-in slide-in-from-top-2 duration-300"
                >
                  {h}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RandomNumberGenerator;
