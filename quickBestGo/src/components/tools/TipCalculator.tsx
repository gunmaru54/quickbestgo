'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCcw } from 'lucide-react';

interface TipCalculatorProps {
  dict: {
    label_bill: string;
    label_tip_percent: string;
    label_people: string;
    btn_calculate: string;
    tooltip_reset: string;
    result_tip: string;
    result_total: string;
    result_per_person: string;
    error_invalid: string;
  };
}

interface Result {
  tip: number;
  total: number;
  perPerson: number;
}

const PRESET_TIPS = [10, 15, 18, 20, 25];

const TipCalculator = ({ dict }: TipCalculatorProps) => {
  const [bill, setBill] = useState('');
  const [tipPercent, setTipPercent] = useState<number>(15);
  const [customTip, setCustomTip] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [people, setPeople] = useState('1');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const billVal = parseFloat(bill);
    const tipVal = isCustom ? parseFloat(customTip) : tipPercent;
    const peopleVal = parseInt(people) || 1;

    if (!bill || isNaN(billVal) || billVal <= 0) {
      setResult(null);
      setError(bill && billVal <= 0 ? dict.error_invalid : '');
      return;
    }

    if (isCustom && (isNaN(tipVal) || tipVal < 0)) {
      setResult(null);
      return;
    }

    setError('');
    const tipAmount = billVal * (tipVal / 100);
    const total = billVal + tipAmount;
    const numPeople = Math.max(1, peopleVal);

    setResult({
      tip: tipAmount,
      total,
      perPerson: total / numPeople,
    });
  }, [bill, tipPercent, customTip, isCustom, people, dict.error_invalid]);

  const reset = () => {
    setBill('');
    setTipPercent(15);
    setCustomTip('');
    setIsCustom(false);
    setPeople('1');
    setResult(null);
    setError('');
  };

  const fmt = (n: number) =>
    n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-[#1a1a1a] rounded-3xl border dark:border-gray-800 shadow-sm p-6 md:p-8 transition-colors duration-300">
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_bill}</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            placeholder="50.00"
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_tip_percent}</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_TIPS.map((pct) => (
              <button
                key={pct}
                onClick={() => { setTipPercent(pct); setIsCustom(false); }}
                className={`flex-1 min-w-[52px] py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                  !isCustom && tipPercent === pct
                    ? 'bg-blue-600 dark:bg-blue-700 text-white shadow-md shadow-blue-200 dark:shadow-none'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {pct}%
              </button>
            ))}
            <input
              type="number"
              min="0"
              value={customTip}
              onChange={(e) => { setCustomTip(e.target.value); setIsCustom(true); }}
              onFocus={() => setIsCustom(true)}
              placeholder="Custom"
              className={`flex-1 min-w-[72px] px-3 py-2.5 rounded-xl text-sm font-bold text-center border transition-all focus:outline-none ${
                isCustom
                  ? 'bg-blue-600 dark:bg-blue-700 text-white border-blue-600 dark:border-blue-700 placeholder-blue-200'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-gray-800'
              }`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_people}</label>
          <input
            type="number"
            min="1"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            placeholder="1"
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}

        <div className="flex justify-end">
          <button
            onClick={reset}
            className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title={dict.tooltip_reset}
          >
            <RefreshCcw size={18} />
          </button>
        </div>

        {result && (
          <div className="grid grid-cols-3 gap-3 animate-in fade-in zoom-in duration-300">
            {[
              { label: dict.result_tip, value: `$${fmt(result.tip)}`, color: 'blue' },
              { label: dict.result_total, value: `$${fmt(result.total)}`, color: 'blue' },
              { label: dict.result_per_person, value: `$${fmt(result.perPerson)}`, color: 'blue' },
            ].map((item) => (
              <div key={item.label} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl text-center border border-blue-100 dark:border-blue-900/30">
                <span className="block text-lg md:text-xl font-black text-blue-600 dark:text-blue-400">{item.value}</span>
                <span className="text-xs font-bold text-blue-400 dark:text-blue-300 uppercase tracking-wider leading-tight">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TipCalculator;
