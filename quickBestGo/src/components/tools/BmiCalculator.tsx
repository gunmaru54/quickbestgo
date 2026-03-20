'use client';

import { useState } from 'react';
import { Activity, RefreshCcw } from 'lucide-react';

interface BmiDict {
  label_unit_metric: string;
  label_unit_imperial: string;
  label_height_cm: string;
  label_height_ft: string;
  label_height_in: string;
  label_weight_kg: string;
  label_weight_lb: string;
  btn_calculate: string;
  tooltip_reset: string;
  result_bmi: string;
  result_category: string;
  result_underweight: string;
  result_normal: string;
  result_overweight: string;
  result_obese: string;
  result_range_label: string;
  error_invalid: string;
}

interface BmiCalculatorProps {
  dict: BmiDict;
}

type Unit = 'metric' | 'imperial';

interface BmiCategory {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  gaugePercent: number;
}

function getBmiCategory(bmi: number, dict: BmiDict): BmiCategory {
  if (bmi < 18.5) {
    return {
      label: dict.result_underweight,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      gaugePercent: Math.min((bmi / 18.5) * 20, 20),
    };
  }
  if (bmi < 25) {
    return {
      label: dict.result_normal,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      gaugePercent: 20 + ((bmi - 18.5) / 6.5) * 30,
    };
  }
  if (bmi < 30) {
    return {
      label: dict.result_overweight,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      gaugePercent: 50 + ((bmi - 25) / 5) * 25,
    };
  }
  return {
    label: dict.result_obese,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    gaugePercent: Math.min(75 + ((bmi - 30) / 10) * 25, 100),
  };
}

export default function BmiCalculator({ dict }: BmiCalculatorProps) {
  const [unit, setUnit] = useState<Unit>('metric');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    let heightM: number;
    let weightKg: number;

    if (unit === 'metric') {
      heightM = parseFloat(heightCm) / 100;
      weightKg = parseFloat(weight);
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      heightM = (ft * 12 + inches) * 0.0254;
      weightKg = parseFloat(weight) * 0.453592;
    }

    if (!heightM || !weightKg || heightM <= 0 || weightKg <= 0) {
      setError(dict.error_invalid);
      setBmi(null);
      return;
    }

    setBmi(Math.round((weightKg / (heightM * heightM)) * 10) / 10);
  };

  const reset = () => {
    setHeightCm('');
    setHeightFt('');
    setHeightIn('');
    setWeight('');
    setBmi(null);
    setError('');
  };

  const switchUnit = (next: Unit) => {
    setUnit(next);
    reset();
  };

  const category = bmi !== null ? getBmiCategory(bmi, dict) : null;

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-[#1a1a1a] rounded-3xl border dark:border-gray-800 shadow-sm p-6 md:p-8 transition-colors duration-300">
      {/* Unit toggle */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6">
        {(['metric', 'imperial'] as Unit[]).map((u) => (
          <button
            key={u}
            onClick={() => switchUnit(u)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              unit === u
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {u === 'metric' ? dict.label_unit_metric : dict.label_unit_imperial}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {/* Height inputs */}
        {unit === 'metric' ? (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {dict.label_height_cm}
            </label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="170"
              min="50"
              max="300"
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {dict.label_height_ft} / {dict.label_height_in}
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                value={heightFt}
                onChange={(e) => setHeightFt(e.target.value)}
                placeholder="5"
                min="1"
                max="9"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
              <input
                type="number"
                value={heightIn}
                onChange={(e) => setHeightIn(e.target.value)}
                placeholder="7"
                min="0"
                max="11"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>
          </div>
        )}

        {/* Weight input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {unit === 'metric' ? dict.label_weight_kg : dict.label_weight_lb}
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === 'metric' ? '65' : '143'}
            min="1"
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={calculate}
            className="flex-grow py-4 bg-blue-600 dark:bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95 transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-blue-200 dark:shadow-none"
          >
            <Activity size={20} />
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

        {/* Result */}
        {bmi !== null && category && (
          <div className={`rounded-2xl border p-6 space-y-4 animate-in fade-in zoom-in duration-300 ${category.bgColor} ${category.borderColor}`}>
            {/* BMI value + category */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {dict.result_bmi}
                </span>
                <p className={`text-5xl font-black ${category.color}`}>{bmi}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {dict.result_category}
                </span>
                <p className={`text-xl font-bold ${category.color}`}>{category.label}</p>
              </div>
            </div>

            {/* Gauge bar */}
            <div>
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-1 font-medium">
                <span>16</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>40</span>
              </div>
              <div className="relative h-3 rounded-full overflow-hidden flex">
                <div className="flex-none w-[20%] bg-blue-300 dark:bg-blue-700" />
                <div className="flex-none w-[30%] bg-green-400 dark:bg-green-600" />
                <div className="flex-none w-[25%] bg-yellow-400 dark:bg-yellow-600" />
                <div className="flex-none w-[25%] bg-red-400 dark:bg-red-600" />
                {/* Marker */}
                <div
                  className="absolute top-0 h-3 w-1 bg-gray-900 dark:bg-white rounded-full -translate-x-1/2 transition-all duration-500"
                  style={{ left: `${category.gaugePercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1 font-semibold">
                <span className="text-blue-500">{dict.result_underweight}</span>
                <span className="text-green-500">{dict.result_normal}</span>
                <span className="text-yellow-500">{dict.result_overweight}</span>
                <span className="text-red-500">{dict.result_obese}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
