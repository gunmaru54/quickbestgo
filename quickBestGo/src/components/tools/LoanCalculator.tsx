'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Landmark, RefreshCcw, Copy, Check } from 'lucide-react';
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';
import { CategoryTheme } from '@/lib/tools';
import { useCurrency } from '@/components/CurrencyProvider';
import { formatCurrency, CURRENCIES, CurrencyCode } from '@/lib/currency';

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);

// ── Types ──────────────────────────────────────────────────────────────────
interface Dict {
  label_loan_amount: string;
  label_annual_rate: string;
  label_loan_term: string;
  btn_calculate: string;
  tooltip_reset: string;
  result_monthly_payment: string;
  result_total_payment: string;
  result_total_interest: string;
  result_interest_ratio: string;
  chart_title: string;
  chart_label_principal: string;
  chart_label_interest: string;
  table_title: string;
  col_year: string;
  col_balance: string;
  col_principal: string;
  col_interest: string;
  col_cumulative_interest: string;
  btn_copy_result: string;
  btn_copied: string;
  disclaimer: string;
  error_invalid: string;
}

interface YearData {
  year: number;
  balance: number;
  annualPrincipal: number;
  annualInterest: number;
  cumulativeInterest: number;
}

interface Result {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  interestRatio: number;
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

function computeLoan(P: number, annualRate: number, termYears: number): Result {
  const n = termYears * 12;
  const r = annualRate / 100 / 12;

  const monthlyPayment = r === 0
    ? round2(P / n)
    : round2(P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));

  const totalPayment = round2(monthlyPayment * n);
  const totalInterest = round2(totalPayment - P);
  const interestRatio = round2((totalInterest / P) * 100);

  const yearlyData: YearData[] = [];
  let balance = P;
  let cumulativeInterest = 0;

  for (let y = 1; y <= termYears; y++) {
    let annualPrincipal = 0;
    let annualInterest = 0;
    for (let m = 0; m < 12 && (balance > 0); m++) {
      const interestPayment = round2(balance * r);
      const principalPayment = round2(Math.min(monthlyPayment - interestPayment, balance));
      balance = round2(Math.max(balance - principalPayment, 0));
      annualPrincipal += principalPayment;
      annualInterest += interestPayment;
    }
    cumulativeInterest = round2(cumulativeInterest + annualInterest);
    yearlyData.push({
      year: y,
      balance: round2(balance),
      annualPrincipal: round2(annualPrincipal),
      annualInterest: round2(annualInterest),
      cumulativeInterest,
    });
  }

  return { monthlyPayment, totalPayment, totalInterest, interestRatio, yearlyData };
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

const PLACEHOLDER: Partial<Record<CurrencyCode, string>> = {
  USD: '300000', KRW: '300000000', JPY: '30000000', EUR: '300000',
};

// ── Component ──────────────────────────────────────────────────────────────
const LoanCalculator = ({ dict, theme }: Props) => {
  const { currency, setCurrency } = useCurrency();
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [term, setTerm] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const rateRef = useRef<HTMLInputElement>(null);
  const termRef = useRef<HTMLInputElement>(null);
  const symbol = CURRENCIES[currency].symbol;

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
        labels: rows.map(d => `${d.year}yr`),
        datasets: [
          {
            label: dict.chart_label_principal,
            data: rows.map(d => round2(parseFloat(fromCommaDisplay(amount)) - d.balance)),
            backgroundColor: 'rgba(59,130,246,0.85)',
            borderRadius: 3,
          },
          {
            label: dict.chart_label_interest,
            data: rows.map(d => d.cumulativeInterest),
            backgroundColor: 'rgba(239,68,68,0.75)',
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
  }, [result, currency, dict.chart_label_principal, dict.chart_label_interest, amount]);

  const calculate = () => {
    const P = parseFloat(fromCommaDisplay(amount));
    const r = parseFloat(rate);
    const t = parseFloat(term);

    const errors = {
      amount: !(P > 0) || !Number.isFinite(P),
      rate: !(r >= 0) || !Number.isFinite(r),
      term: !(t >= 1) || t > 50 || !Number.isFinite(t),
    };
    setFieldErrors(errors);

    if (Object.values(errors).some(Boolean)) {
      if (errors.amount) amountRef.current?.focus();
      else if (errors.rate) rateRef.current?.focus();
      else if (errors.term) termRef.current?.focus();
      setResult(null);
      return;
    }

    setFieldErrors({});
    setResult(computeLoan(P, r, Math.round(t)));
  };

  const reset = () => {
    setAmount(''); setRate(''); setTerm('');
    setResult(null); setFieldErrors({});
    if (chartInstance.current) { chartInstance.current.destroy(); chartInstance.current = null; }
  };

  const copyResult = async () => {
    if (!result) return;
    const text = [
      `Loan Calculator Result`,
      `Amount: ${formatCurrency(parseFloat(fromCommaDisplay(amount)), currency)} | Rate: ${rate}% | Term: ${term}yr`,
      `Monthly Payment: ${formatCurrency(result.monthlyPayment, currency)}`,
      `Total Payment: ${formatCurrency(result.totalPayment, currency)}`,
      `Total Interest: ${formatCurrency(result.totalInterest, currency)}`,
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
          {/* Loan Amount */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {dict.label_loan_amount} ({currency})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium pointer-events-none select-none">{symbol}</span>
              <input
                ref={amountRef}
                type="text"
                inputMode="decimal"
                value={toCommaDisplay(amount)}
                onChange={(e) => {
                  const raw = fromCommaDisplay(e.target.value);
                  if (/^[0-9]*\.?[0-9]*$/.test(raw)) {
                    setAmount(raw);
                    if (fieldErrors.amount) setFieldErrors(prev => ({ ...prev, amount: false }));
                  }
                }}
                placeholder={toCommaDisplay(PLACEHOLDER[currency] ?? '300000')}
                maxLength={25}
                aria-label={`${dict.label_loan_amount} (${currency})`}
                className={`w-full pl-8 pr-4 py-3 bg-white dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none transition-all ${
                  fieldErrors.amount
                    ? 'border border-red-400 dark:border-red-500 ring-2 ring-red-400/30'
                    : `border dark:border-gray-700 focus:ring-2 ${theme.ring}`
                }`}
              />
            </div>
          </div>

          {/* Annual Rate */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {dict.label_annual_rate}
            </label>
            <div className="relative">
              <input
                ref={rateRef}
                type="number"
                min="0"
                max="50"
                step="0.01"
                value={rate}
                onChange={(e) => {
                  setRate(e.target.value);
                  if (fieldErrors.rate) setFieldErrors(prev => ({ ...prev, rate: false }));
                }}
                placeholder="5.5"
                aria-label={dict.label_annual_rate}
                className={`w-full pl-4 pr-10 py-3 bg-white dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none transition-all ${
                  fieldErrors.rate
                    ? 'border border-red-400 dark:border-red-500 ring-2 ring-red-400/30'
                    : `border dark:border-gray-700 focus:ring-2 ${theme.ring}`
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium pointer-events-none select-none">%</span>
            </div>
          </div>

          {/* Loan Term */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {dict.label_loan_term}
            </label>
            <input
              ref={termRef}
              type="number"
              min="1"
              max="50"
              value={term}
              onChange={(e) => {
                setTerm(e.target.value);
                if (fieldErrors.term) setFieldErrors(prev => ({ ...prev, term: false }));
              }}
              placeholder="30"
              aria-label={dict.label_loan_term}
              className={inputClass('term')}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={calculate}
              className={`flex-grow py-4 ${theme.primaryBtn} text-white font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 text-lg shadow-lg ${theme.shadow} dark:shadow-none`}
            >
              <Landmark size={20} />
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
              <div className={`flex items-center justify-between px-4 py-3 rounded-2xl border ${theme.accentBg} ${theme.accentBorder}`}>
                <span className={`text-xs font-bold ${theme.accentLight} uppercase tracking-wider shrink-0 mr-3`}>{dict.result_monthly_payment}</span>
                <span className={`text-xl font-black ${theme.accent} text-right`}>{formatCurrency(result.monthlyPayment, currency)}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider shrink-0 mr-3">{dict.result_total_payment}</span>
                <span className="text-base font-black text-gray-700 dark:text-gray-200 text-right">{formatCurrency(result.totalPayment, currency)}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
                <span className="text-xs font-bold text-red-500 dark:text-red-400 uppercase tracking-wider shrink-0 mr-3">{dict.result_total_interest}</span>
                <span className="text-base font-black text-red-600 dark:text-red-400 text-right">{formatCurrency(result.totalInterest, currency)}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30">
                <span className="text-xs font-bold text-orange-500 dark:text-orange-400 uppercase tracking-wider shrink-0 mr-3">{dict.result_interest_ratio}</span>
                <span className="text-base font-black text-orange-600 dark:text-orange-400 text-right">{result.interestRatio}%</span>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center pt-1">{dict.disclaimer}</p>
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

      {/* Amortization Table */}
      {result && (
        <div className={`bg-white dark:bg-[#1a1a1a] rounded-3xl border ${theme.cardBorder} shadow-sm p-6 md:p-8 transition-colors duration-300`}>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{dict.table_title}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  {[dict.col_year, dict.col_balance, dict.col_principal, dict.col_interest, dict.col_cumulative_interest].map(col => (
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
                      <td className="py-2.5 pr-4 whitespace-nowrap text-blue-600 dark:text-blue-400">{formatCurrency(row.annualPrincipal, currency)}</td>
                      <td className="py-2.5 pr-4 whitespace-nowrap text-red-600 dark:text-red-400">{formatCurrency(row.annualInterest, currency)}</td>
                      <td className="py-2.5 pr-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{formatCurrency(row.cumulativeInterest, currency)}</td>
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

export default LoanCalculator;
