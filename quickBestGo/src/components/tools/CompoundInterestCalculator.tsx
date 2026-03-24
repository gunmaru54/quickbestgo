'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TrendingUp, RefreshCcw, Copy, Share2, Percent, TrendingDown } from 'lucide-react';
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';
import { CategoryTheme } from '@/lib/tools';
import { useCurrency } from '@/components/CurrencyProvider';
import { formatCurrency, CURRENCIES, CurrencyCode } from '@/lib/currency';

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);

// ── Types ──────────────────────────────────────────────────────────────────
interface Dict {
  label_principal: string;
  label_rate: string;
  label_frequency: string;
  label_years: string;
  label_monthly_contribution: string;
  label_inflation_rate: string;
  badge_new: string;
  freq_annually: string;
  freq_semiannually: string;
  freq_quarterly: string;
  freq_monthly: string;
  freq_daily: string;
  btn_calculate: string;
  tooltip_reset: string;
  result_final: string;
  result_principal: string;
  result_interest: string;
  result_total_principal: string;
  result_total_interest: string;
  result_final_value: string;
  chart_title: string;
  chart_label_principal: string;
  chart_label_interest: string;
  rate_comparison_title: string;
  breakdown_title: string;
  col_year: string;
  col_balance: string;
  col_annual_interest: string;
  col_total_interest: string;
  col_real_value: string;
  btn_copy_result: string;
  btn_share_link: string;
  btn_copied: string;
  related_title: string;
  error_invalid: string;
}

interface YearData {
  year: number;
  balance: number;
  annualInterest: number;
  totalInterest: number;
  totalPrincipal: number;
  realValue: number;
}

interface Result {
  finalAmount: number;
  totalPrincipal: number;
  totalInterest: number;
  realValue: number;
  yearlyData: YearData[];
}

interface Props {
  dict: Dict;
  theme: CategoryTheme;
  lang: string;
}

// ── Constants ──────────────────────────────────────────────────────────────
const FREQUENCIES: Record<string, number> = {
  annually: 1, semiannually: 2, quarterly: 4, monthly: 12, daily: 365,
};

const FREQ_PARAM: Record<string, string> = {
  '1': 'annually', '2': 'semiannually', '4': 'quarterly', '12': 'monthly', '365': 'daily',
};

const PLACEHOLDER: Partial<Record<CurrencyCode, string>> = {
  USD: '10000', KRW: '10000000', JPY: '1000000', EUR: '10000', CNY: '100000',
};

const COMPARISON_RATES = [3, 5, 7, 10];

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

// ── Calculation ────────────────────────────────────────────────────────────
function computeResult(
  P: number, r: number, n: number, t: number, PMT: number, inf: number,
): Result {
  const rMonthly = r / 12;
  const yearlyData: YearData[] = [];
  let prevBalance = P;

  for (let y = 1; y <= t; y++) {
    const months = y * 12;
    const balancePrincipal = P * Math.pow(1 + r / n, n * y);
    const balanceContributions =
      PMT > 0 && rMonthly > 0
        ? PMT * ((Math.pow(1 + rMonthly, months) - 1) / rMonthly)
        : PMT * months;

    const balance = round2(balancePrincipal + balanceContributions);
    const totalPrincipalY = round2(P + PMT * months);
    const totalInterestY = round2(balance - totalPrincipalY);
    const annualInterest = round2(balance - prevBalance - PMT * 12);
    const realValue = inf > 0 ? round2(balance / Math.pow(1 + inf, y)) : balance;

    yearlyData.push({ year: y, balance, annualInterest, totalInterest: totalInterestY, totalPrincipal: totalPrincipalY, realValue });
    prevBalance = balance;
  }

  const last = yearlyData[yearlyData.length - 1];
  return {
    finalAmount: last.balance,
    totalPrincipal: last.totalPrincipal,
    totalInterest: last.totalInterest,
    realValue: last.realValue,
    yearlyData,
  };
}

function calcFinalForRate(P: number, rPct: number, n: number, t: number, PMT: number): number {
  const r = rPct / 100;
  const rMonthly = r / 12;
  const months = t * 12;
  const A = P * Math.pow(1 + r / n, n * t);
  const B =
    PMT > 0 && rMonthly > 0
      ? PMT * ((Math.pow(1 + rMonthly, months) - 1) / rMonthly)
      : PMT * months;
  return round2(A + B);
}

function getTableRows(data: YearData[], t: number): YearData[] {
  if (t <= 10) return data;
  const keys = t <= 20
    ? new Set([1, 2, 3, 5, 7, 10, 15, 20, t])
    : new Set([1, 5, 10, 15, 20, 25, 30, t]);
  return data.filter(d => keys.has(d.year));
}

function getChartRows(data: YearData[], t: number): YearData[] {
  if (t <= 20) return data;
  return data.filter(d => d.year % 5 === 0 || d.year === t);
}

// ── Component ──────────────────────────────────────────────────────────────
const CompoundInterestCalculator = ({ dict, theme, lang }: Props) => {
  const { currency, setCurrency } = useCurrency();
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [years, setYears] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('0');
  const [inflationRate, setInflationRate] = useState('2.5');
  const [result, setResult] = useState<Result | null>(null);
  const [copyState, setCopyState] = useState<'result' | 'link' | null>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const principalRef = useRef<HTMLInputElement>(null);
  const rateRef = useRef<HTMLInputElement>(null);
  const yearsRef = useRef<HTMLInputElement>(null);
  const symbol = CURRENCIES[currency].symbol;

  const validate = useCallback((P: number, r: number, t: number) =>
    P > 0 && r > 0 && t > 0 && t <= 50 && Number.isFinite(P) && Number.isFinite(r) && Number.isFinite(t),
    []);

  const runCalc = useCallback((
    P: number, r: number, n: number, t: number, PMT: number, inf: number,
  ) => {
    if (!validate(P, r, t)) return null;
    return computeResult(P, r, n, t, PMT, inf);
  }, [validate]);

  // URL param restoration
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const p = params.get('p');
    const r = params.get('r');
    const n = params.get('n');
    const t = params.get('t');
    const pmt = params.get('pmt');
    const inf = params.get('inf');

    const P = p ? parseFloat(p) : NaN;
    const R = r ? parseFloat(r) : NaN;
    const N = n && FREQ_PARAM[n] ? parseInt(n) : 12;
    const T = t ? parseFloat(t) : NaN;
    const PMT = pmt ? parseFloat(pmt) : 0;
    const INF = inf ? parseFloat(inf) : 2.5;

    if (p) setPrincipal(p);
    if (r) setRate(r);
    if (n && FREQ_PARAM[n]) setFrequency(FREQ_PARAM[n]);
    if (t) setYears(t);
    if (pmt) setMonthlyContribution(pmt);
    if (inf) setInflationRate(inf);

    if (!isNaN(P) && !isNaN(R) && !isNaN(T)) {
      const res = runCalc(P, R / 100, N, T, PMT, INF / 100);
      if (res) setResult(res);
    }
  }, [runCalc]);

  // Chart
  useEffect(() => {
    if (!result || !chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const t = result.yearlyData.length;
    const rows = getChartRows(result.yearlyData, t);
    const isDark = document.documentElement.classList.contains('dark');
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
    const labelColor = isDark ? '#9ca3af' : '#6b7280';

    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: rows.map(d => `${d.year}yr`),
        datasets: [
          {
            label: dict.chart_label_principal,
            data: rows.map(d => d.totalPrincipal),
            backgroundColor: 'rgba(59,130,246,0.85)',
            borderRadius: 3,
          },
          {
            label: dict.chart_label_interest,
            data: rows.map(d => d.totalInterest),
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
  }, [result, currency, dict.chart_label_interest, dict.chart_label_principal]);

  const calculate = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const n = FREQUENCIES[frequency];
    const t = parseFloat(years);
    const PMT = parseFloat(monthlyContribution) || 0;
    const inf = parseFloat(inflationRate) / 100;

    const errors = {
      principal: !(P > 0) || !Number.isFinite(P),
      rate: !(r > 0) || !Number.isFinite(r),
      years: !(t > 0) || t > 50 || !Number.isFinite(t),
    };
    setFieldErrors(errors);

    if (Object.values(errors).some(Boolean)) {
      const refs = { principal: principalRef, rate: rateRef, years: yearsRef };
      const firstKey = (Object.keys(errors) as Array<keyof typeof errors>).find(k => errors[k]);
      if (firstKey) refs[firstKey].current?.focus();
      setResult(null);
      return;
    }

    setFieldErrors({});
    setResult(computeResult(P, r, n, t, PMT, inf));
  };

  const reset = () => {
    setPrincipal(''); setRate(''); setFrequency('monthly'); setYears('');
    setMonthlyContribution('0'); setInflationRate('2.5');
    setResult(null); setFieldErrors({});
    if (chartInstance.current) { chartInstance.current.destroy(); chartInstance.current = null; }
  };

  const copyResult = async () => {
    if (!result) return;
    const text = [
      `Compound Interest Result`,
      `Principal: ${formatCurrency(parseFloat(principal), currency)} | Rate: ${rate}% | ${years}yr`,
      `Final Value: ${formatCurrency(result.finalAmount, currency)}`,
      `Total Interest: ${formatCurrency(result.totalInterest, currency)}`,
    ].join('\n');
    await navigator.clipboard.writeText(text);
    setCopyState('result');
    setTimeout(() => setCopyState(null), 2000);
  };

  const shareLink = async () => {
    const n = FREQUENCIES[frequency];
    const url = new URL(window.location.href.split('?')[0]);
    url.searchParams.set('p', principal);
    url.searchParams.set('r', rate);
    url.searchParams.set('n', String(n));
    url.searchParams.set('t', years);
    if (parseFloat(monthlyContribution) > 0) url.searchParams.set('pmt', monthlyContribution);
    if (parseFloat(inflationRate) !== 2.5) url.searchParams.set('inf', inflationRate);
    await navigator.clipboard.writeText(url.toString());
    setCopyState('link');
    setTimeout(() => setCopyState(null), 2000);
  };

  const freqOptions = [
    { value: 'annually', label: dict.freq_annually },
    { value: 'semiannually', label: dict.freq_semiannually },
    { value: 'quarterly', label: dict.freq_quarterly },
    { value: 'monthly', label: dict.freq_monthly },
    { value: 'daily', label: dict.freq_daily },
  ];

  const inputClass = `w-full px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 ${theme.ring} focus:outline-none transition-all`;

  // Comparison rates (ensure user's rate is included)
  const userRate = parseFloat(rate);
  const compRates = [...COMPARISON_RATES];
  if (!isNaN(userRate) && !compRates.includes(userRate)) compRates.push(userRate);
  compRates.sort((a, b) => a - b);

  const relatedTools = [
    { slug: 'percentage-calculator', icon: Percent, name: 'Percentage Calculator', desc: 'Calculate percent of a number or percent change' },
    { slug: 'bmi-calculator', icon: TrendingUp, name: 'BMI Calculator', desc: 'Calculate your Body Mass Index' },
    { slug: 'days-between-dates', icon: TrendingDown, name: 'Days Between Dates', desc: 'Count days, weeks, and months between two dates' },
    { slug: 'calorie-calculator', icon: TrendingUp, name: 'Calorie Calculator', desc: 'Calculate your daily calorie needs' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Main Calculator Card */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border dark:border-gray-800 shadow-sm p-6 md:p-8 transition-colors duration-300">
        {/* Currency selector */}
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
          {/* Principal */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {dict.label_principal} ({currency})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium pointer-events-none select-none">{symbol}</span>
              <input ref={principalRef} type="text" inputMode="decimal" value={toCommaDisplay(principal)}
                onChange={(e) => { const raw = fromCommaDisplay(e.target.value); if (/^[0-9]*\.?[0-9]*$/.test(raw)) { setPrincipal(raw); if (fieldErrors.principal) setFieldErrors(prev => ({ ...prev, principal: false })); } }}
                placeholder={toCommaDisplay(PLACEHOLDER[currency] ?? '10000')} maxLength={25} aria-label={`${dict.label_principal} (${currency})`}
                className={`w-full pl-8 pr-4 py-3 bg-white dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none transition-all ${fieldErrors.principal ? 'border border-red-400 dark:border-red-500 ring-2 ring-red-400/30' : `border dark:border-gray-700 focus:ring-2 ${theme.ring}`}`}
              />
            </div>
          </div>

          {/* Rate */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_rate}</label>
            <input ref={rateRef} type="number" min="0" step="0.01" value={rate}
              onChange={(e) => { setRate(e.target.value); if (fieldErrors.rate) setFieldErrors(prev => ({ ...prev, rate: false })); }}
              placeholder="5" aria-label={dict.label_rate}
              className={`w-full px-4 py-3 bg-white dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none transition-all ${fieldErrors.rate ? 'border border-red-400 dark:border-red-500 ring-2 ring-red-400/30' : `border dark:border-gray-700 focus:ring-2 ${theme.ring}`}`} />
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_frequency}</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)}
              aria-label={dict.label_frequency} className={inputClass}>
              {freqOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          {/* Years */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dict.label_years}</label>
            <input ref={yearsRef} type="number" min="1" max="50" value={years}
              onChange={(e) => { setYears(e.target.value); if (fieldErrors.years) setFieldErrors(prev => ({ ...prev, years: false })); }}
              placeholder="10" aria-label={dict.label_years}
              className={`w-full px-4 py-3 bg-white dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none transition-all ${fieldErrors.years ? 'border border-red-400 dark:border-red-500 ring-2 ring-red-400/30' : `border dark:border-gray-700 focus:ring-2 ${theme.ring}`}`} />
          </div>

          {/* NEW: Monthly Contribution + Inflation Rate */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                {dict.label_monthly_contribution}
                <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-bold">{dict.badge_new}</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium pointer-events-none select-none text-sm">{symbol}</span>
                <input type="text" inputMode="decimal" value={toCommaDisplay(monthlyContribution)}
                  onChange={(e) => { const raw = fromCommaDisplay(e.target.value); if (/^[0-9]*\.?[0-9]*$/.test(raw)) setMonthlyContribution(raw); }}
                  placeholder="0" aria-label={dict.label_monthly_contribution}
                  className={`w-full pl-8 pr-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 ${theme.ring} focus:outline-none transition-all`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                {dict.label_inflation_rate}
                <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-bold">{dict.badge_new}</span>
              </label>
              <div className="relative">
                <input type="number" min="0" max="20" step="0.1" value={inflationRate} onChange={(e) => setInflationRate(e.target.value)}
                  placeholder="2.5" aria-label={dict.label_inflation_rate}
                  className={`w-full pl-4 pr-10 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 ${theme.ring} focus:outline-none transition-all`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium pointer-events-none select-none">%</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button onClick={calculate}
              className={`flex-grow py-4 ${theme.primaryBtn} text-white font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 text-lg shadow-lg ${theme.shadow} dark:shadow-none`}>
              <TrendingUp size={20} />
              {dict.btn_calculate}
            </button>
            <button onClick={reset}
              className="p-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={dict.tooltip_reset} aria-label={dict.tooltip_reset}>
              <RefreshCcw size={20} />
            </button>
          </div>

          {/* Result Summary Cards */}
          {result && (
            <div className="space-y-2 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider shrink-0 mr-3">{dict.result_total_principal}</span>
                <span className="text-base font-black text-gray-700 dark:text-gray-200 text-right">{formatCurrency(result.totalPrincipal, currency)}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30">
                <span className="text-xs font-bold text-green-500 dark:text-green-400 uppercase tracking-wider shrink-0 mr-3">{dict.result_total_interest}</span>
                <span className="text-base font-black text-green-600 dark:text-green-400 text-right">{formatCurrency(result.totalInterest, currency)}</span>
              </div>
              <div className={`flex items-center justify-between px-4 py-3 rounded-2xl border ${theme.accentBg} ${theme.accentBorder}`}>
                <span className={`text-xs font-bold ${theme.accentLight} uppercase tracking-wider shrink-0 mr-3`}>{dict.result_final_value}</span>
                <span className={`text-base font-black ${theme.accent} text-right`}>{formatCurrency(result.finalAmount, currency)}</span>
              </div>
              {parseFloat(inflationRate) > 0 && (
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center pt-1">
                  Real value ({inflationRate}% inflation): <strong className="text-gray-600 dark:text-gray-300">{formatCurrency(result.realValue, currency)}</strong>
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      {result && (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border dark:border-gray-800 shadow-sm p-6 md:p-8 transition-colors duration-300">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{dict.chart_title}</h2>
          <div className="h-52 md:h-64">
            <canvas ref={chartRef} />
          </div>
        </div>
      )}

      {/* Rate Comparison */}
      {result && (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border dark:border-gray-800 shadow-sm p-6 md:p-8 transition-colors duration-300">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{dict.rate_comparison_title}</h2>
            <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded font-bold">{dict.badge_new}</span>
          </div>
          <div className="space-y-3">
            {(() => {
              const P = parseFloat(principal);
              const n = FREQUENCIES[frequency];
              const t = parseFloat(years);
              const PMT = parseFloat(monthlyContribution) || 0;
              const amounts = compRates.map(rPct => ({ rPct, amount: calcFinalForRate(P, rPct, n, t, PMT) }));
              const max = Math.max(...amounts.map(a => a.amount));
              return amounts.map(({ rPct, amount }) => {
                const isUser = rPct === parseFloat(rate);
                const pct = Math.round((amount / max) * 100);
                return (
                  <div key={rPct} className={`p-3 rounded-xl border transition-all ${isUser ? `${theme.accentBorder} ${theme.accentBg}` : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-bold ${isUser ? theme.accent : 'text-gray-600 dark:text-gray-300'}`}>
                        {rPct}% {isUser && '★'}
                      </span>
                      <span className={`text-sm font-black ${isUser ? theme.accent : 'text-gray-700 dark:text-gray-200'}`}>
                        {formatCurrency(amount, currency)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isUser ? 'bg-blue-500' : 'bg-gray-400 dark:bg-gray-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* Year-by-Year Table */}
      {result && (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border dark:border-gray-800 shadow-sm p-6 md:p-8 transition-colors duration-300">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{dict.breakdown_title}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  {[dict.col_year, dict.col_balance, dict.col_annual_interest, dict.col_total_interest,
                    ...(parseFloat(inflationRate) > 0 ? [dict.col_real_value] : [])
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
                      <td className={`py-2.5 pr-4 ${isLast ? theme.accent : 'text-gray-700 dark:text-gray-300'}`}>{row.year}</td>
                      <td className={`py-2.5 pr-4 whitespace-nowrap ${isLast ? theme.accent : 'text-gray-700 dark:text-gray-300'}`}>{formatCurrency(row.balance, currency)}</td>
                      <td className="py-2.5 pr-4 whitespace-nowrap text-green-600 dark:text-green-400">{formatCurrency(row.annualInterest, currency)}</td>
                      <td className="py-2.5 pr-4 whitespace-nowrap text-gray-600 dark:text-gray-400">{formatCurrency(row.totalInterest, currency)}</td>
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

      {/* Copy / Share Buttons */}
      {result && (
        <div className="grid grid-cols-2 gap-3">
          <button onClick={copyResult}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all text-sm">
            <Copy size={16} />
            {copyState === 'result' ? dict.btn_copied : dict.btn_copy_result}
          </button>
          <button onClick={shareLink}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all text-sm">
            <Share2 size={16} />
            {copyState === 'link' ? dict.btn_copied : dict.btn_share_link}
          </button>
        </div>
      )}

      {/* Related Calculators */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border dark:border-gray-800 shadow-sm p-6 md:p-8 transition-colors duration-300">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{dict.related_title}</h2>
        <div className="grid grid-cols-2 gap-3">
          {relatedTools.map((tool) => (
            <a
              key={tool.slug}
              href={`/${lang}/${tool.slug}/`}
              className="flex flex-col gap-1.5 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group"
            >
              <span className="text-sm font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">{tool.name}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500 leading-snug">{tool.desc}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompoundInterestCalculator;
