'use client';

import React, { useState, useEffect, useRef } from 'react';
import { fetchChartData, chartStats, ChartPoint, ChartPeriod } from '@/lib/exchangeChart';
import { CURRENCY_META, CurrencyCode } from '@/lib/currency';

const PERIODS: ChartPeriod[] = ['1D', '5D', '1M', '1Y'];

interface Props {
  fromCode: CurrencyCode;
  toCode: CurrencyCode;
}

export default function ExchangeRateChart({ fromCode, toCode }: Props) {
  const [period, setPeriod]   = useState<ChartPeriod>('1M');
  const [points, setPoints]   = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setLoading(true);
    setPoints([]);
    fetchChartData(fromCode, toCode, period).then((data) => {
      setPoints(data);
      setLoading(false);
    });
  }, [fromCode, toCode, period]);

  const stats = chartStats(points);
  const isUp = stats ? stats.changePct >= 0 : true;
  const lineColor = isUp ? '#22c55e' : '#ef4444';
  const fillColor = isUp ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)';

  // ── SVG path calculation ────────────────────────────────────────
  const W = 600;
  const H = 120;
  const PAD = { top: 10, bottom: 20, left: 8, right: 8 };

  function buildPath(pts: ChartPoint[]) {
    if (pts.length < 2) return { line: '', area: '' };
    const closes = pts.map((p) => p.close);
    const minV = Math.min(...closes);
    const maxV = Math.max(...closes);
    const range = maxV - minV || 1;

    const xStep = (W - PAD.left - PAD.right) / (pts.length - 1);
    const yScale = (H - PAD.top - PAD.bottom) / range;

    const coords = pts.map((p, i) => ({
      x: PAD.left + i * xStep,
      y: PAD.top + (maxV - p.close) * yScale,
    }));

    const line = coords
      .map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
      .join(' ');

    const area =
      line +
      ` L${coords[coords.length - 1].x.toFixed(1)},${H - PAD.bottom}` +
      ` L${coords[0].x.toFixed(1)},${H - PAD.bottom} Z`;

    return { line, area, coords };
  }

  const { line, area, coords } = buildPath(points) as {
    line: string;
    area: string;
    coords?: Array<{ x: number; y: number }>;
  };

  // Mouse hover: find closest x index
  function onMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!svgRef.current || !coords || coords.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * W;
    const xStep = (W - PAD.left - PAD.right) / (coords.length - 1);
    const idx = Math.round((svgX - PAD.left) / xStep);
    setHoverIdx(Math.max(0, Math.min(idx, coords.length - 1)));
  }

  const hoveredPoint = hoverIdx !== null && points[hoverIdx] ? points[hoverIdx] : null;
  const hoveredCoord = hoverIdx !== null && coords?.[hoverIdx] ? coords[hoverIdx] : null;

  // X-axis label thinning
  function xLabels(): { label: string; x: number }[] {
    if (!coords || !points.length) return [];
    const total = points.length;
    const maxLabels = 5;
    const step = Math.ceil(total / maxLabels);
    return points
      .filter((_, i) => i % step === 0 || i === total - 1)
      .map((p, _, arr) => {
        const origIdx = points.indexOf(p);
        const c = coords[origIdx];
        let label = '';
        const d = new Date(p.datetime.replace(' ', 'T'));
        if (period === '1D') {
          label = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        } else if (period === '5D') {
          label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        } else if (period === '1M') {
          label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        } else {
          label = d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
        }
        void arr;
        return { label, x: c.x };
      });
  }

  const fromMeta = CURRENCY_META[fromCode];
  const toMeta   = CURRENCY_META[toCode];

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700 dark:text-gray-300">
            <span>{fromMeta.flag}</span>
            <span>{fromCode}</span>
            <span className="text-gray-400 mx-0.5">/</span>
            <span>{toMeta.flag}</span>
            <span>{toCode}</span>
            <span className="ml-1 text-xs font-normal text-gray-400">환율 추이</span>
          </div>
          {stats && (
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-extrabold text-gray-900 dark:text-gray-100 tabular-nums">
                {stats.last.toPrecision(6)}
              </span>
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${isUp ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                {isUp ? '▲' : '▼'} {Math.abs(stats.changePct).toFixed(2)}%
              </span>
            </div>
          )}
        </div>

        {/* Period tabs */}
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              aria-label={`${p} chart`}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                period === p
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chart area */}
      {loading && (
        <div className="h-32 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
      )}

      {!loading && points.length === 0 && (
        <div className="h-32 flex items-center justify-center text-sm text-gray-400">
          데이터를 불러올 수 없습니다.
        </div>
      )}

      {!loading && points.length > 1 && (
        <div className="relative">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto cursor-crosshair"
            onMouseMove={onMouseMove}
            onMouseLeave={() => setHoverIdx(null)}
            aria-label={`${fromCode}/${toCode} ${period} chart`}
          >
            {/* Area fill */}
            <path d={area} fill={fillColor} />
            {/* Line */}
            <path d={line} fill="none" stroke={lineColor} strokeWidth="2" strokeLinejoin="round" />

            {/* X-axis labels */}
            {xLabels().map(({ label, x }, i) => (
              <text
                key={i}
                x={x}
                y={H - 2}
                textAnchor="middle"
                fontSize="9"
                fill="currentColor"
                className="text-gray-400 fill-gray-400 dark:fill-gray-500"
              >
                {label}
              </text>
            ))}

            {/* Hover crosshair */}
            {hoveredCoord && (
              <>
                <line
                  x1={hoveredCoord.x} y1={PAD.top}
                  x2={hoveredCoord.x} y2={H - PAD.bottom}
                  stroke="currentColor" strokeWidth="1" strokeDasharray="3,3"
                  className="stroke-gray-400 dark:stroke-gray-500"
                />
                <circle
                  cx={hoveredCoord.x} cy={hoveredCoord.y}
                  r="4" fill={lineColor} stroke="white" strokeWidth="2"
                />
              </>
            )}
          </svg>

          {/* Hover tooltip */}
          {hoveredPoint && hoveredCoord && (
            <div
              className="absolute pointer-events-none bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap"
              style={{
                left: `${Math.min(Math.max((hoveredCoord.x / W) * 100, 5), 80)}%`,
                top: '0',
                transform: 'translateX(-50%)',
              }}
            >
              <div>{hoveredPoint.datetime.slice(0, period === '1D' ? 16 : 10)}</div>
              <div className={isUp ? 'text-green-400 dark:text-green-600' : 'text-red-400 dark:text-red-600'}>
                {hoveredPoint.close.toPrecision(6)}
              </div>
            </div>
          )}

          {/* Min/Max labels */}
          {stats && (
            <div className="flex justify-between mt-1 px-1 text-xs text-gray-400 tabular-nums">
              <span>최저 {stats.min.toPrecision(5)}</span>
              <span>최고 {stats.max.toPrecision(5)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
