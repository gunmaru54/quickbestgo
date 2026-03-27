'use client';

import { useState, useRef } from 'react';
import { Flame } from 'lucide-react';
import { CategoryTheme } from '@/lib/tools';

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
  theme: CategoryTheme;
}

const ACTIVITY_FACTORS = [1.2, 1.375, 1.55, 1.725, 1.9];

interface CalorieResult {
  bmr: number;
  maintenance: number;
  loss: number;
  gain: number;
}

export default function CalorieCalculator({ dict, theme }: CalorieCalculatorProps) {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState(0);
  const [result, setResult] = useState<CalorieResult | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const ageRef = useRef<HTMLInputElement>(null);
  const heightRef = useRef<HTMLInputElement>(null);
  const weightRef = useRef<HTMLInputElement>(null);

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

    const errors = {
      age: !a || a <= 0 || a > 120,
      height: !h || h <= 0 || h > 300,
      weight: !w || w <= 0 || w > 500,
    };
    setFieldErrors(errors);

    if (Object.values(errors).some(Boolean)) {
      const refs = { age: ageRef, height: heightRef, weight: weightRef };
      const firstKey = (Object.keys(errors) as Array<keyof typeof errors>).find(k => errors[k]);
      if (firstKey) refs[firstKey].current?.focus();
      setResult(null);
      return;
    }

    setFieldErrors({});

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
    <div className={`max-w-lg mx-auto bg-white dark:bg-[#1a1a1a] rounded-3xl border ${theme.cardBorder} shadow-sm p-6 md:p-8 transition-colors duration-300`}>
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
                    ? theme.activeSolid
                    : `bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 ${theme.hoverBorder}`
                }`}
              >
                {g === 'male' ? dict.label_male : dict.label_female}
              </button>
            ))}
          </div>
        </div>

        {/* Age / Height / Weight */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">{dict.label_age}</label>
            <input ref={ageRef} type="number" value={age}
              onChange={(e) => { setAge(e.target.value); if (fieldErrors.age) setFieldErrors(prev => ({ ...prev, age: false })); }}
              placeholder="25" min="1"
              className={`w-full px-3 py-3 bg-white dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 text-center font-bold focus:outline-none transition-all ${fieldErrors.age ? 'border border-red-400 dark:border-red-500 ring-2 ring-red-400/30' : `border dark:border-gray-700 focus:ring-2 ${theme.ring}`}`}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">{dict.label_height}</label>
            <input ref={heightRef} type="number" value={height}
              onChange={(e) => { setHeight(e.target.value); if (fieldErrors.height) setFieldErrors(prev => ({ ...prev, height: false })); }}
              placeholder="170" min="1"
              className={`w-full px-3 py-3 bg-white dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 text-center font-bold focus:outline-none transition-all ${fieldErrors.height ? 'border border-red-400 dark:border-red-500 ring-2 ring-red-400/30' : `border dark:border-gray-700 focus:ring-2 ${theme.ring}`}`}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">{dict.label_weight}</label>
            <input ref={weightRef} type="number" value={weight}
              onChange={(e) => { setWeight(e.target.value); if (fieldErrors.weight) setFieldErrors(prev => ({ ...prev, weight: false })); }}
              placeholder="70" min="1"
              className={`w-full px-3 py-3 bg-white dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 text-center font-bold focus:outline-none transition-all ${fieldErrors.weight ? 'border border-red-400 dark:border-red-500 ring-2 ring-red-400/30' : `border dark:border-gray-700 focus:ring-2 ${theme.ring}`}`}
            />
          </div>
        </div>

        {/* Activity Level */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">{dict.label_activity}</label>
          <select
            value={activity}
            onChange={(e) => setActivity(Number(e.target.value))}
            className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 ${theme.ring} focus:outline-none transition-all`}
          >
            {activityLabels.map((label, i) => (
              <option key={i} value={i}>{label}</option>
            ))}
          </select>
        </div>

        {/* Button */}
        <button
          onClick={calculate}
          className={`w-full py-4 ${theme.primaryBtn} text-white font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 text-lg shadow-lg ${theme.shadow} dark:shadow-none`}
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
            <div className={`${theme.accentBg} rounded-2xl p-4 flex justify-between items-center border ${theme.accentBorder}`}>
              <p className={`text-sm font-bold ${theme.accent}`}>{dict.label_maintenance}</p>
              <span className={`text-xl font-black ${theme.accent}`}>{result.maintenance.toLocaleString()} <span className="text-sm font-medium">{dict.label_kcal_day}</span></span>
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
