'use client';

import React, { useState } from 'react';
import { CircleDot, RotateCcw } from 'lucide-react';
import { CategoryTheme } from '@/lib/tools';

type Side = 'HEADS' | 'TAILS';

interface CoinFlipProps {
  dict: {
    label_heads: string;
    label_tails: string;
    label_flip: string;
    btn_flipping: string;
    btn_flip: string;
    label_history: string;
  };
  theme: CategoryTheme;
}

const CoinFlip = ({ dict, theme }: CoinFlipProps) => {
  const [result, setResult] = useState<Side | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [history, setHistory] = useState<Side[]>([]);

  const flipCoin = () => {
    setIsFlipping(true);
    setResult(null);

    setTimeout(() => {
      const newResult: Side = Math.random() > 0.5 ? 'HEADS' : 'TAILS';
      setResult(newResult);
      setHistory((prev) => [newResult, ...prev].slice(0, 10));
      setIsFlipping(false);
    }, 600);
  };

  const reset = () => {
    setResult(null);
    setHistory([]);
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-[#1a1a1a] rounded-3xl border dark:border-gray-800 shadow-sm p-6 md:p-8 text-center transition-colors duration-300">
      <div className="flex flex-col items-center gap-8">
        <div className={`
          w-40 h-40 rounded-full border-8 flex items-center justify-center text-3xl font-black transition-all duration-500
          ${isFlipping ? 'animate-bounce scale-90 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-transparent' :
            result === 'HEADS' ? 'border-yellow-400 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' :
            result === 'TAILS' ? 'border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
            'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-500'}
        `}>
          {isFlipping ? '?' : result === 'HEADS' ? dict.label_heads : result === 'TAILS' ? dict.label_tails : dict.label_flip}
        </div>

        <button
          onClick={flipCoin}
          disabled={isFlipping}
          className={`w-full py-4 ${theme.primaryBtn} text-white font-bold rounded-xl active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all flex items-center justify-center gap-2 text-lg shadow-lg ${theme.shadow} dark:shadow-none`}
        >
          <CircleDot size={20} className={isFlipping ? 'animate-spin' : ''} />
          {isFlipping ? dict.btn_flipping : dict.btn_flip}
        </button>

        {history.length > 0 && (
          <div className="w-full border-t dark:border-gray-800 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{dict.label_history}</h3>
              <button
                onClick={reset}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <RotateCcw size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {history.map((h, i) => (
                <div
                  key={i}
                  className={`
                    px-3 py-1 rounded-full text-xs font-bold border
                    ${h === 'HEADS' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900/30 text-yellow-600 dark:text-yellow-400' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/30 text-blue-600 dark:text-blue-400'}
                  `}
                >
                  {h === 'HEADS' ? dict.label_heads[0] : dict.label_tails[0]}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinFlip;
