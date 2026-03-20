'use client';

import { useState } from 'react';
import { Flame } from 'lucide-react';

interface CalorieCalculatorProps {
  dict: {
    label_gender: string;
    label_male: string;
    label_female: string;
    label_age: string;
    label_height: string;
    label_weight: string;
    label_activity: string;
    activity_sedentary: string;
    activity_light: string;
    activity_moderate: string;
    activity_active: string;
    activity_very_active: string;
    btn_calculate: string;
    label_bmr: string;
    label_bmr_desc: string;
    label_maintenance: string;
    label_weight_loss: string;
    label_weight_gain: string;
    label_kcal_day: string;
    label_deficit: string;
    label_surplus: string;
    error_invalid: string;
  };
}

const ACTIVITY_FACTORS = [1.2, 1.375, 1.55, 1.725, 1.9];

interface CalorieResult {
  bmr: number;
  maintenance: number;
  loss: number;
  gain: number;
}

export default function CalorieCalculator({ dict }: CalorieCalculatorProps) {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState(0);
  const [result, setResult] = useState<CalorieResult | null>(null);
  const [error, setError] = useState('');

  const activityLabels = [
    dict.activity_sedentary,
    dict.activity_light,
    dict.activity_moderate,
    dict.activity_active,
    dict.activity_very_active,
  ];

  const calculate = () => {
    const a = parseFloat(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (!a || !h || !w || a <= 0 || h <= 0 || w <= 0 || a > 120 || h > 300 || w > 500) {
      setError(dict.error_invalid);
      setResult(null);
      return;
    }

    setError('');

    // Mifflin-St Jeor equation
    const bmr = gender === 'male'
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;

    const maintenance = Math.round(bmr * ACTIVITY_FACTORS[activity]);

    setResult({
      bmr: Math.round(bmr),
      maintenance,
      loss: maintenance - 500,
      gain: maintenance + 500,
    });
  };

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-[#1a1a1a] rounded-3xl border dark:border-gray-800 shadow-sm p-6 md:p-8 transition-colors duration-300">
      <div className="space-y-5">

        {/* Gender */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">{dict.label_gender}</label>
          <div className="grid grid-cols-2 gap-3">
            {(['male', 'female'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`py-3 rounded-xl font-semibold border transition-all ${
                  gender === g
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-400'
                }`}
              >
                {g === 'male' ? dict.label_male : dict.label_female}
              </button>
            ))}
          </div>
        </div>

        {/* Age / Height / Weight */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: dict.label_age,    value: age,    setter: setAge,    placeholder: '25' },
            { label: dict.label_height, value: height, setter: setHeight, placeholder: '170' },
            { label: dict.label_weight, value: weight, setter: setWeight, placeholder: '70' },
          ].map(({ label, value, setter, placeholder }) => (
            <div key={label}>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">{label}</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                min="1"
                className="w-full px-3 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 text-center font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>
          ))}
        </div>

        {/* Activity Level */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">{dict.label_activity}</label>
          <select
            value={activity}
            onChange={(e) => setActivity(Number(e.target.value))}
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          >
            {activityLabels.map((label, i) => (
              <option key={i} value={i}>{label}</option>
            ))}
          </select>
        </div>

        {/* Error */}
        {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}

        {/* Button */}
        <button
          onClick={calculate}
          className="w-full py-4 bg-blue-600 dark:bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95 transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-blue-200 dark:shadow-none"
        >
          <Flame size={20} />
          {dict.btn_calculate}
        </button>

        {/* Results */}
        {result && (
          <div className="space-y-3 animate-in fade-in zoom-in duration-300">
            {/* BMR */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 flex justify-between items-center border dark:border-gray-700">
              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{dict.label_bmr}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{dict.label_bmr_desc}</p>
              </div>
              <span className="text-xl font-black text-gray-700 dark:text-gray-200">{result.bmr.toLocaleString()} <span className="text-sm font-medium">{dict.label_kcal_day}</span></span>
            </div>

            {/* Maintenance */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 flex justify-between items-center border border-blue-100 dark:border-blue-900/30">
              <p className="text-sm font-bold text-blue-700 dark:text-blue-300">{dict.label_maintenance}</p>
              <span className="text-xl font-black text-blue-600 dark:text-blue-400">{result.maintenance.toLocaleString()} <span className="text-sm font-medium">{dict.label_kcal_day}</span></span>
            </div>

            {/* Loss / Gain */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 border border-green-100 dark:border-green-900/30">
                <p className="text-xs font-bold text-green-700 dark:text-green-300 mb-1">{dict.label_weight_loss}</p>
                <p className="text-xs text-green-500 dark:text-green-400 mb-2">{dict.label_deficit}</p>
                <span className="text-lg font-black text-green-600 dark:text-green-400">{result.loss.toLocaleString()}</span>
                <span className="text-xs text-green-500 dark:text-green-400 ml-1">{dict.label_kcal_day}</span>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 border border-orange-100 dark:border-orange-900/30">
                <p className="text-xs font-bold text-orange-700 dark:text-orange-300 mb-1">{dict.label_weight_gain}</p>
                <p className="text-xs text-orange-500 dark:text-orange-400 mb-2">{dict.label_surplus}</p>
                <span className="text-lg font-black text-orange-600 dark:text-orange-400">{result.gain.toLocaleString()}</span>
                <span className="text-xs text-orange-500 dark:text-orange-400 ml-1">{dict.label_kcal_day}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
