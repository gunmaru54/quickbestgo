'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PiggyBank, RefreshCcw, Copy, Check } from 'lucide-react';
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';
import { CategoryTheme } from '@/lib/tools';
import { useCurrency } from '@/components/CurrencyProvider';
import { formatCurrency, CURRENCIES, CurrencyCode } from '@/lib/currency';

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);

// ── Types ──────────────────────────────────────────────────────────────────
interface Dict {
  label_current_age: string;
  label_retirement_age: string;
  label_current_savings: string;
  label_monthly_contribution: string;
  label_annual_return: string;
  label_inflation_rate: string;
  btn_calculate: string;
  tooltip_reset: string;
  result_years_to_retirement: string;
  result_total_savings: string;
  result_real_value: string;
  result_monthly_income: string;
  result_total_contributions: string;
  result_investment_growth: string;
  chart_title: string;
  chart_label_contributions: string;
  chart_label_growth: string;
  table_title: string;
  col_age: string;
  col_savings: string;
  col_contributions: string;
  col_growth: string;
  col_real_value: string;
  btn_copy_result: string;
  btn_copied: string;
  disclaimer: string;
  error_age: string;
}

interface YearData {
  year: number;
  age: number;
  savings: number;
  totalContributions: number;
  totalGrowth: number;
  realValue: number;
}

interface Result {
  yearsToRetirement: number;
  totalSavings: number;
  realValue: number;
  monthlyIncome: number;
  totalContributions: number;
  investmentGrowth: number;
  yearlyData: YearData[];
}

interface Props {
  dict: Dict;
  theme: CategoryTheme;
  lang: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const round2 = (n: number) => Math.round(n * 100) / 100;

function toCommaDisplay(raw: string): string {
  if (!raw) return '';
  const [intPart, decPart] = raw.split('.');
  const formatted = parseInt(intPart || '0', 10).toLocaleString();
  return decPart !== undefined ? `${formatted}.${decPart}` : formatted;
}

function fromCommaDisplay(display: string): string {
  return display.replace(/,/g, '');
}

function computeRetirement(
  currentAge: number,
  retirementAge: number,
  currentSavings: number,
  monthlyContribution: number,
  annualReturn: number,
  inflationRate: number,
): Result {
  const yearsToRetirement = retirementAge - currentAge;
  const rm = annualReturn / 100 / 12;
  const n = yearsToRetirement * 12;

  const fv = rm === 0
    ? currentSavings + monthlyContribution * n
    : currentSavings * Math.pow(1 + rm, n) + monthlyContribution * ((Math.pow(1 + rm, n) - 1) / rm);

  const totalSavings = round2(fv);
  const totalContributions = round2(currentSavings + monthlyContribution * n);
  const investmentGrowth = round2(totalSavings - totalContributions);
  const realValue = inflationRate > 0
    ? round2(totalSavings / Math.pow(1 + inflationRate / 100, yearsToRetirement))
    : totalSavings;
  const monthlyIncome = round2(totalSavings / 240); // 20-year withdrawal

  const yearlyData: YearData[] = [];
  for (let y = 1; y <= yearsToRetirement; y++) {
    const months = y * 12;
    const savingsY = rm === 0
      ? currentSavings + monthlyContribution * months
      : currentSavings * Math.pow(1 + rm, months) + monthlyContribution * ((Math.pow(1 + rm, months) - 1) / rm);
    const savingsRounded = round2(savingsY);
    const contribY = round2(currentSavings + monthlyContribution * months);
    const growthY = round2(savingsRounded - contribY);
    const realY = inflationRate > 0 ? round2(savingsRounded / Math.pow(1 + inflationRate / 100, y)) : savingsRounded;
    yearlyData.push({ year: y, age: currentAge + y, savings: savingsRounded, totalContributions: contribY, totalGrowth: growthY, realValue: realY });
  }

  return { yearsToRetirement, totalSavings, realValue, monthlyIncome, totalContributions, investmentGrowth, yearlyData };
}

function getTableRows(data: YearData[], t: number): YearData[] {
  if (t <= 10) return data;
  const keys = t <= 20
    ? new Set([1, 2, 3, 5, 7, 10, 15, 20, t])
    : new Set([1, 5, 10, 15, 20, 25, 30, 35, 40, t]);
  return data.filter(d => keys.has(d.year));
}

function getChartRows(data: YearData[], t: number): YearData[] {
  if (t <= 20) return data;
  return data.filter(d => d.year % 5 === 0 || d.year === t);
}

const PLACEHOLDER: Partial<Record<CurrencyCode, string>> = {
  USD: '50000', KRW: '50000000', JPY: '5000000', EUR: '50000',
};

const CONTRIBUTION_PLACEHOLDER: Partial<Record<CurrencyCode, string>> = {
  USD: '500', KRW: '500000', JPY: '50000', EUR: '500',
};

// ── Component ──────────────────────────────────────────────────────────────
const RetirementCalculator = ({ dict, theme }: Props) => {
  const { currency, setCurrency } = useCurrency();
  const [currentAge, setCurrentAge] = useState('');
  const [retirementAge, setRetirementAge] = useState('65');
  const [currentSavings, setCurrentSavings] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [annualReturn, setAnnualReturn] = useState('7');
  const [inflationRate, setInflationRate] = useState('2.5');
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const currentAgeRef = useRef<HTMLInputElement>(null);
  const retirementAgeRef = useRef<HTMLInputElement>(null);
  const symbol = CURRENCIES[currency].symbol;
  const symbolPl = symbol.length === 1 ? 'pl-8' : symbol.length === 2 ? 'pl-10' : 'pl-14';

  useEffect(() => {
    if (!result || !chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const rows = getChartRows(result.yearlyData, result.yearlyData.length);
    const isDark = document.documentElement.classList.contains('dark');
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
    const labelColor = isDark ? '#9ca3af' : '#6b7280';

    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: rows.map(d => `${d.age}`),
        datasets: [
          {
            label: dict.chart_label_contributions,
            data: rows.map(d => d.totalContributions),
            backgroundColor: 'rgba(59,130,246,0.85)',
            borderRadius: 3,
          },
          {
            label: dict.chart_label_growth,
            data: rows.map(d => d.totalGrowth),
            backgroundColor: 'rgba(34,197,94,0.75)',
            borderRadius: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: labelColor, font: { size: 12 } } },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y ?? 0, currency)}`,
            },
          },
        },
        scales: {
          x: { stacked: true, grid: { color: gridColor }, ticks: { color: labelColor } },
          y: { stacked: true, grid: { color: gridColor }, ticks: { color: labelColor, callback: (v) => formatCurrency(Number(v), currency) } },
        },
      },
    });
  }, [result, currency, dict.chart_label_contributions, dict.chart_label_growth]);

  const calculate = () => {
    const ca = parseInt(currentAge);
    const ra = parseInt(retirementAge);
    const cs = parseFloat(fromCommaDisplay(currentSavings)) || 0;
    const mc = parseFloat(fromCommaDisplay(monthlyContribution)) || 0;
    const ar = parseFloat(annualReturn) || 0;
    const ir = parseFloat(inflationRate) || 0;

    const errors = {
      currentAge: !(ca > 0 && ca < 100) || !Number.isFinite(ca),
      retirementAge: !(ra > ca) || !(ra <= 100) || !Number.isFinite(ra),
    };
    setFieldErrors(errors);

    if (Object.values(errors).some(Boolean)) {
      if (errors.currentAge) currentAgeRef.current?.focus();
      else retirementAgeRef.current?.focus();
      setResult(null);
      return;
    }

    setFieldErrors({});
    setResult(computeRetirement(ca, ra, cs, mc, ar, ir));
  };

  const reset = () => {
    setCurrentAge(''); setRetirementAge('65');
    setCurrentSavings(''); setMonthlyContribution('');
    setAnnualReturn('7'); setInflationRate('2.5');
    setResult(null); setFieldErrors({});
    if (chartInstance.current) { chartInstance.current.destroy(); chartInstance.current = null; }
  };

  const copyResult = async () => {
    if (!result) return;
    const text = [
      `Retirement Calculator Result`,
      `Age: ${currentAge} → ${retirementAge} (${result.yearsToRetirement} years)`,
      `Total Savings: ${formatCurrency(result.totalSavings, currency)}`,
      `Real Value: ${formatCurrency(result.realValue, currency)}`,
      `Monthly Income (20yr): ${formatCurrency(result.monthlyIncome, currency)}`,
    ].join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 bg-white dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none transition-all ${
      fieldErrors[field]
        ? 'border border-red-400 dark:border-red-500 ring-2 ring-red-400/30'
        : `border dark:border-gray-700 focus:ring-2 ${theme.ring}`
    }`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className={`bg-white dark:bg-[#1a1a1a] rounded-3xl border ${theme.cardBorder} shadow-sm p-6 md:p-8 transition-colors duration-300`}>
        {/* Currency Selector */}
        <div className="flex items-center gap-1.5 mb-6 flex-wrap">
          {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
            <button
              key={code}
              onClick={() => setCurrency(code)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                currency === code
                  ? `${theme.primaryBtn} text-white`
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {code} <span className="opacity-75">{CURRENCIES[code].symbol}</span>
            </button>
          ))}
        </div>

        <div className="space-y-5">
          {/* Age Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_current_age}</label>
              <input
                ref={currentAgeRef}
                type="number"
                min="1"
                max="99"
                value={currentAge}
                onChange={(e) => {
                  setCurrentAge(e.target.value);
                  if (fieldErrors.currentAge) setFieldErrors(prev => ({ ...prev, currentAge: false }));
                }}
                placeholder="30"
                aria-label={dict.label_current_age}
                className={inputClass('currentAge')}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_retirement_age}</label>
              <input
                ref={retirementAgeRef}
                type="number"
                min="1"
                max="100"
                value={retirementAge}
                onChange={(e) => {
                  setRetirementAge(e.target.value);
                  if (fieldErrors.retirementAge) setFieldErrors(prev => ({ ...prev, retirementAge: false }));
                }}
                placeholder="65"
                aria-label={dict.label_retirement_age}
                className={inputClass('retirementAge')}
              />
            </div>
          </div>

          {/* Current Savings */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {dict.label_current_savings} ({currency})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium pointer-events-none select-none">{symbol}</span>
              <input
                type="text"
                inputMode="decimal"
                value={toCommaDisplay(currentSavings)}
                onChange={(e) => {
                  const raw = fromCommaDisplay(e.target.value);
                  if (/^[0-9]*\.?[0-9]*$/.test(raw)) setCurrentSavings(raw);
                }}
                placeholder={toCommaDisplay(PLACEHOLDER[currency] ?? '50000')}
                maxLength={25}
                aria-label={`${dict.label_current_savings} (${currency})`}
                className={`w-full ${symbolPl} pr-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 ${theme.ring} focus:outline-none transition-all`}
              />
            </div>
          </div>

          {/* Monthly Contribution */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {dict.label_monthly_contribution} ({currency})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium pointer-events-none select-none">{symbol}</span>
              <input
                type="text"
                inputMode="decimal"
                value={toCommaDisplay(monthlyContribution)}
                onChange={(e) => {
                  const raw = fromCommaDisplay(e.target.value);
                  if (/^[0-9]*\.?[0-9]*$/.test(raw)) setMonthlyContribution(raw);
                }}
                placeholder={toCommaDisplay(CONTRIBUTION_PLACEHOLDER[currency] ?? '500')}
                maxLength={25}
                aria-label={`${dict.label_monthly_contribution} (${currency})`}
                className={`w-full ${symbolPl} pr-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 ${theme.ring} focus:outline-none transition-all`}
              />
            </div>
          </div>

          {/* Return Rate & Inflation */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_annual_return}</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="0.1"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(e.target.value)}
                  placeholder="7"
                  aria-label={dict.label_annual_return}
                  className={`w-full pl-4 pr-10 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 ${theme.ring} focus:outline-none transition-all`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium pointer-events-none select-none">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_inflation_rate}</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.1"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(e.target.value)}
                  placeholder="2.5"
                  aria-label={dict.label_inflation_rate}
                  className={`w-full pl-4 pr-10 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 ${theme.ring} focus:outline-none transition-all`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium pointer-events-none select-none">%</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={calculate}
              className={`flex-grow py-4 ${theme.primaryBtn} text-white font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 text-lg shadow-lg ${theme.shadow} dark:shadow-none`}
            >
              <PiggyBank size={20} />
              {dict.btn_calculate}
            </button>
            <button
              onClick={reset}
              className="p-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={dict.tooltip_reset}
              aria-label={dict.tooltip_reset}
            >
              <RefreshCcw size={20} />
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-2 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider shrink-0 mr-3">{dict.result_years_to_retirement}</span>
                <span className="text-base font-black text-gray-700 dark:text-gray-200 text-right">{result.yearsToRetirement} yrs</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider shrink-0 mr-3">{dict.result_total_contributions}</span>
                <span className="text-base font-black text-gray-700 dark:text-gray-200 text-right">{formatCurrency(result.totalContributions, currency)}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30">
                <span className="text-xs font-bold text-green-500 dark:text-green-400 uppercase tracking-wider shrink-0 mr-3">{dict.result_investment_growth}</span>
                <span className="text-base font-black text-green-600 dark:text-green-400 text-right">{formatCurrency(result.investmentGrowth, currency)}</span>
              </div>
              <div className={`flex items-center justify-between px-4 py-3 rounded-2xl border ${theme.accentBg} ${theme.accentBorder}`}>
                <span className={`text-xs font-bold ${theme.accentLight} uppercase tracking-wider shrink-0 mr-3`}>{dict.result_total_savings}</span>
                <span className={`text-xl font-black ${theme.accent} text-right`}>{formatCurrency(result.totalSavings, currency)}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30">
                <span className="text-xs font-bold text-purple-500 dark:text-purple-400 uppercase tracking-wider shrink-0 mr-3">{dict.result_monthly_income}</span>
                <span className="text-base font-black text-purple-600 dark:text-purple-400 text-right">{formatCurrency(result.monthlyIncome, currency)}</span>
              </div>
              {parseFloat(inflationRate) > 0 && (
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center pt-1">
                  {dict.result_real_value} ({inflationRate}% inflation): <strong className="text-gray-600 dark:text-gray-300">{formatCurrency(result.realValue, currency)}</strong>
                </p>
              )}
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center">{dict.disclaimer}</p>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      {result && (
        <div className={`bg-white dark:bg-[#1a1a1a] rounded-3xl border ${theme.cardBorder} shadow-sm p-6 md:p-8 transition-colors duration-300`}>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{dict.chart_title}</h2>
          <div className="h-52 md:h-64">
            <canvas ref={chartRef} />
          </div>
        </div>
      )}

      {/* Projection Table */}
      {result && (
        <div className={`bg-white dark:bg-[#1a1a1a] rounded-3xl border ${theme.cardBorder} shadow-sm p-6 md:p-8 transition-colors duration-300`}>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{dict.table_title}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  {[
                    dict.col_age, dict.col_savings, dict.col_contributions, dict.col_growth,
                    ...(parseFloat(inflationRate) > 0 ? [dict.col_real_value] : []),
                  ].map(col => (
                    <th key={col} className="py-2 pr-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getTableRows(result.yearlyData, result.yearlyData.length).map((row, i, arr) => {
                  const isLast = i === arr.length - 1;
                  return (
                    <tr key={row.year} className={`border-b dark:border-gray-800/50 ${isLast ? `${theme.accentBg} font-bold` : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'}`}>
                      <td className={`py-2.5 pr-4 ${isLast ? theme.accent : 'text-gray-700 dark:text-gray-300'}`}>{row.age}</td>
                      <td className={`py-2.5 pr-4 whitespace-nowrap ${isLast ? theme.accent : 'text-gray-700 dark:text-gray-300'}`}>{formatCurrency(row.savings, currency)}</td>
                      <td className="py-2.5 pr-4 whitespace-nowrap text-blue-600 dark:text-blue-400">{formatCurrency(row.totalContributions, currency)}</td>
                      <td className="py-2.5 pr-4 whitespace-nowrap text-green-600 dark:text-green-400">{formatCurrency(row.totalGrowth, currency)}</td>
                      {parseFloat(inflationRate) > 0 && (
                        <td className="py-2.5 pr-4 whitespace-nowrap text-gray-500 dark:text-gray-400 hidden sm:table-cell">{formatCurrency(row.realValue, currency)}</td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Copy Button */}
      {result && (
        <button
          onClick={copyResult}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all text-sm"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? dict.btn_copied : dict.btn_copy_result}
        </button>
      )}
    </div>
  );
};

export default RetirementCalculator;
