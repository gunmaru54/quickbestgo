// Twelve Data — forex time series for chart display
// Free plan: 800 credits/day
// Docs: https://twelvedata.com/docs#time-series

const API_KEY = process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY ?? '';
const API_BASE = 'https://api.twelvedata.com';

export type ChartPeriod = '1D' | '5D' | '1M' | '1Y';

export interface ChartPoint {
  datetime: string; // e.g. "2024-03-24 14:00:00" or "2024-03-24"
  close: number;
}

interface TwelveDataResponse {
  meta: { symbol: string; interval: string };
  values: Array<{ datetime: string; close: string }>;
  status: string;
}

interface CacheEntry {
  points: ChartPoint[];
  fetchedAt: number;
}

// Cache TTL per period
const TTL: Record<ChartPeriod, number> = {
  '1D': 60 * 60 * 1000,       // 1 hour
  '5D': 4 * 60 * 60 * 1000,   // 4 hours
  '1M': 24 * 60 * 60 * 1000,  // 24 hours
  '1Y': 24 * 60 * 60 * 1000,  // 24 hours
};

// Twelve Data params per period
const PERIOD_CONFIG: Record<ChartPeriod, { interval: string; outputsize: number }> = {
  '1D': { interval: '1h',    outputsize: 24  },
  '5D': { interval: '4h',    outputsize: 30  },
  '1M': { interval: '1day',  outputsize: 30  },
  '1Y': { interval: '1week', outputsize: 52  },
};

function cacheKey(from: string, to: string, period: ChartPeriod) {
  return `td_chart_${from}_${to}_${period}`;
}

function readCache(key: string, ttl: number): ChartPoint[] | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.fetchedAt < ttl) return entry.points;
  } catch { /* ignore */ }
  return null;
}

function writeCache(key: string, points: ChartPoint[]) {
  try {
    const entry: CacheEntry = { points, fetchedAt: Date.now() };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch { /* storage full — ignore */ }
}

/**
 * Fetch exchange rate time series for charting.
 * Returns data points sorted oldest → newest.
 */
export async function fetchChartData(
  from: string,
  to: string,
  period: ChartPeriod,
): Promise<ChartPoint[]> {
  if (typeof window === 'undefined') return [];

  const key = cacheKey(from, to, period);
  const cached = readCache(key, TTL[period]);
  if (cached) return cached;

  if (!API_KEY) {
    console.error('[exchangeChart] NEXT_PUBLIC_TWELVE_DATA_API_KEY is not set');
    return [];
  }

  const { interval, outputsize } = PERIOD_CONFIG[period];
  const symbol = `${from}/${to}`;
  const url = `${API_BASE}/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${API_KEY}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Twelve Data ${res.status}`);
    const data: TwelveDataResponse = await res.json();

    if (data.status === 'error' || !Array.isArray(data.values)) {
      console.error('[exchangeChart] API error:', data);
      return [];
    }

    // API returns newest-first → reverse to oldest-first
    const points: ChartPoint[] = data.values
      .map((v) => ({ datetime: v.datetime, close: parseFloat(v.close) }))
      .reverse();

    writeCache(key, points);
    return points;
  } catch (err) {
    console.error('[exchangeChart] fetchChartData failed:', err);
    return [];
  }
}

/** Min, max, first, last values from a points array */
export function chartStats(points: ChartPoint[]) {
  if (!points.length) return null;
  const closes = points.map((p) => p.close);
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const first = closes[0];
  const last  = closes[closes.length - 1];
  const change = last - first;
  const changePct = first !== 0 ? (change / first) * 100 : 0;
  return { min, max, first, last, change, changePct };
}
