'use client';

import { useEffect, useRef } from 'react';

/* ── Minimal types for CDN-loaded Chart.js ─────────────────────── */
interface ChartInstance { destroy(): void }
interface ChartConfig { type: string; data: unknown; options?: unknown }
interface ChartDefaults { font: { family: string; size: number } }
interface ChartCtor {
  new (ctx: CanvasRenderingContext2D, cfg: ChartConfig): ChartInstance;
  defaults: ChartDefaults;
}
declare global { interface Window { Chart?: ChartCtor } }

/* ── i18n ───────────────────────────────────────────────────────── */
type Lang = 'ko' | 'en' | 'es' | 'ja' | 'pt';

const T: Record<Lang, {
  eyebrow: string; title: string; subtitle: string;
  c1Title: string; c1A: string; c1B: string;
  c1Compound: string; c1Password: string; c1Exchange: string; c1Source: string;
  c2Title: string; c2Creative: string; c2Decision: string; c2Freed: string;
  c2Center: string; c2Source: string;
  c3Title: string; c3YLabel: string; c3Source: string; c3Labels: string[];
}> = {
  ko: {
    eyebrow: '연구 기반 데이터', title: '과학이 말하는 도구의 힘',
    subtitle: '신뢰할 수 있는 연구를 기반으로 한 도구 사용의 실제 효과',
    c1Title: '도구 사용 vs 직접 계산: 오류율 비교 (%)',
    c1A: '직접/암산', c1B: 'QuickBestGo 도구',
    c1Compound: '복리 계산', c1Password: '비밀번호 생성', c1Exchange: '환율 변환',
    c1Source: '출처: Wagenaar & Sagaria (1975), NIST SP 800-63B (2017) 기반 추정치',
    c2Title: '도구 사용 시 하루 인지 자원 배분',
    c2Creative: '창의적 사고', c2Decision: '의사결정', c2Freed: '해방된 반복 계산 자원',
    c2Center: '인지 효율 ↑',
    c2Source: '출처: Sweller, J. (1988). Cognitive Science, 12(2), 257–285.',
    c3Title: '비밀번호 길이별 해킹 저항 시간 (로그 스케일)',
    c3YLabel: '저항 시간 (분)',
    c3Source: '출처: NIST SP 800-63B (2017). Digital Identity Guidelines.',
    c3Labels: ['8자', '10자', '12자', '14자', '16자'],
  },
  en: {
    eyebrow: 'Research-Backed Data', title: 'The Science Behind Using Tools',
    subtitle: 'Evidence-based effects of tool use from peer-reviewed research',
    c1Title: 'Tool vs Manual Calculation: Error Rate Comparison (%)',
    c1A: 'Manual / Mental Math', c1B: 'QuickBestGo Tools',
    c1Compound: 'Compound Interest', c1Password: 'Password Creation', c1Exchange: 'Currency Exchange',
    c1Source: 'Source: Wagenaar & Sagaria (1975), NIST SP 800-63B (2017) estimates',
    c2Title: 'Daily Cognitive Resource Allocation with Tool Use',
    c2Creative: 'Creative Thinking', c2Decision: 'Decision Making', c2Freed: 'Freed from Repetitive Calc.',
    c2Center: 'Cognitive Efficiency ↑',
    c2Source: 'Source: Sweller, J. (1988). Cognitive Science, 12(2), 257–285.',
    c3Title: 'Password Cracking Resistance by Length (Log Scale)',
    c3YLabel: 'Resistance Time (min)',
    c3Source: 'Source: NIST SP 800-63B (2017). Digital Identity Guidelines.',
    c3Labels: ['8 chars', '10 chars', '12 chars', '14 chars', '16 chars'],
  },
  es: {
    eyebrow: 'Datos Basados en Investigación', title: 'La Ciencia del Uso de Herramientas',
    subtitle: 'Efectos del uso de herramientas basados en investigación confiable',
    c1Title: 'Herramienta vs Manual: Comparación de Tasa de Error (%)',
    c1A: 'Manual / Cálculo Mental', c1B: 'Herramientas QuickBestGo',
    c1Compound: 'Interés Compuesto', c1Password: 'Creación de Contraseña', c1Exchange: 'Cambio de Moneda',
    c1Source: 'Fuente: Wagenaar & Sagaria (1975), estimaciones NIST SP 800-63B (2017)',
    c2Title: 'Distribución Diaria de Recursos Cognitivos con Herramientas',
    c2Creative: 'Pensamiento Creativo', c2Decision: 'Toma de Decisiones', c2Freed: 'Liberado de Cálculos Repetitivos',
    c2Center: 'Eficiencia Cognitiva ↑',
    c2Source: 'Fuente: Sweller, J. (1988). Cognitive Science, 12(2), 257–285.',
    c3Title: 'Resistencia al Hackeo por Longitud de Contraseña (Escala Log)',
    c3YLabel: 'Tiempo de Resistencia (min)',
    c3Source: 'Fuente: NIST SP 800-63B (2017). Digital Identity Guidelines.',
    c3Labels: ['8 car.', '10 car.', '12 car.', '14 car.', '16 car.'],
  },
  ja: {
    eyebrow: '研究に基づくデータ', title: 'ツール使用の科学的根拠',
    subtitle: '信頼できる研究に基づいたツール使用の効果',
    c1Title: 'ツール使用 vs 手動計算：エラー率比較 (%)',
    c1A: '手動 / 暗算', c1B: 'QuickBestGoツール',
    c1Compound: '複利計算', c1Password: 'パスワード生成', c1Exchange: '為替換算',
    c1Source: '出典: Wagenaar & Sagaria (1975), NIST SP 800-63B (2017) に基づく推定',
    c2Title: 'ツール使用時の1日の認知リソース配分',
    c2Creative: '創造的思考', c2Decision: '意思決定', c2Freed: '解放された反復計算リソース',
    c2Center: '認知効率 ↑',
    c2Source: '出典: Sweller, J. (1988). Cognitive Science, 12(2), 257–285.',
    c3Title: 'パスワード長別のハッキング耐性時間（対数スケール）',
    c3YLabel: '耐性時間（分）',
    c3Source: '出典: NIST SP 800-63B (2017). Digital Identity Guidelines.',
    c3Labels: ['8文字', '10文字', '12文字', '14文字', '16文字'],
  },
  pt: {
    eyebrow: 'Dados Baseados em Pesquisa', title: 'A Ciência por Trás das Ferramentas',
    subtitle: 'Efeitos baseados em evidências do uso de ferramentas de pesquisa confiável',
    c1Title: 'Ferramenta vs Manual: Comparação de Taxa de Erro (%)',
    c1A: 'Manual / Cálculo Mental', c1B: 'Ferramentas QuickBestGo',
    c1Compound: 'Juros Compostos', c1Password: 'Criação de Senha', c1Exchange: 'Câmbio de Moeda',
    c1Source: 'Fonte: Wagenaar & Sagaria (1975), estimativas NIST SP 800-63B (2017)',
    c2Title: 'Alocação Diária de Recursos Cognitivos com Ferramentas',
    c2Creative: 'Pensamento Criativo', c2Decision: 'Tomada de Decisão', c2Freed: 'Liberado de Cálculos Repetitivos',
    c2Center: 'Eficiência Cognitiva ↑',
    c2Source: 'Fonte: Sweller, J. (1988). Cognitive Science, 12(2), 257–285.',
    c3Title: 'Resistência a Ataques por Comprimento de Senha (Escala Log)',
    c3YLabel: 'Tempo de Resistência (min)',
    c3Source: 'Fonte: NIST SP 800-63B (2017). Digital Identity Guidelines.',
    c3Labels: ['8 car.', '10 car.', '12 car.', '14 car.', '16 car.'],
  },
};

/* ── CDN loader ─────────────────────────────────────────────────── */
function loadChartJs(cb: () => void) {
  if (typeof window === 'undefined') return;
  if (window.Chart) { cb(); return; }
  let s = document.querySelector<HTMLScriptElement>('script[data-chartjs]');
  if (!s) {
    s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    s.dataset.chartjs = '1';
    document.head.appendChild(s);
  }
  s.addEventListener('load', cb, { once: true });
}

/* ── Component ──────────────────────────────────────────────────── */
export default function ScientificCharts({ lang }: { lang: Lang }) {
  const ref1 = useRef<HTMLCanvasElement>(null);
  const ref2 = useRef<HTMLCanvasElement>(null);
  const ref3 = useRef<HTMLCanvasElement>(null);
  const charts = useRef<ChartInstance[]>([]);

  useEffect(() => {
    const t = T[lang] ?? T.en;
    const isDark = document.documentElement.classList.contains('dark');
    const textColor  = isDark ? '#9CA3AF' : '#6B7280';
    const gridColor  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
    const cardBg     = isDark ? '#1a1a1a' : '#ffffff';

    function init() {
      const Chart = window.Chart;
      if (!Chart) return;

      // Apply site font globally
      Chart.defaults.font.family = "'Montserrat', system-ui, sans-serif";
      Chart.defaults.font.size = 12;

      charts.current.forEach(c => c.destroy());
      charts.current = [];

      /* Chart 1 — Horizontal Bar: Error Rate */
      if (ref1.current) {
        const ctx = ref1.current.getContext('2d');
        if (ctx) {
          charts.current.push(new Chart(ctx, {
            type: 'bar',
            data: {
              labels: [t.c1Compound, t.c1Password, t.c1Exchange],
              datasets: [
                {
                  label: t.c1A,
                  data: [79, 82, 64],
                  backgroundColor: 'rgba(230,0,118,0.75)',
                  borderRadius: 5,
                },
                {
                  label: t.c1B,
                  data: [3, 0, 1],
                  backgroundColor: 'rgba(153,15,250,0.85)',
                  borderRadius: 5,
                },
              ],
            },
            options: {
              indexAxis: 'y',
              responsive: true,
              maintainAspectRatio: false,
              animation: { duration: 800 },
              plugins: {
                legend: { position: 'top', labels: { color: textColor, boxRadius: 4 } },
              },
              scales: {
                x: {
                  min: 0, max: 100,
                  grid: { color: gridColor },
                  ticks: {
                    color: textColor,
                    callback: (value: number | string) => Number(value) + '%',
                  },
                },
                y: { grid: { color: gridColor }, ticks: { color: textColor } },
              },
            },
          }));
        }
      }

      /* Chart 2 — Doughnut: Cognitive Load */
      if (ref2.current) {
        const ctx = ref2.current.getContext('2d');
        if (ctx) {
          charts.current.push(new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: [t.c2Creative, t.c2Decision, t.c2Freed],
              datasets: [{
                data: [45, 30, 25],
                backgroundColor: ['#990FFA', '#E60076', isDark ? '#374151' : '#D1D5DB'],
                borderWidth: 0,
                hoverOffset: 8,
              }],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              animation: { duration: 800 },
              cutout: '65%',
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: { color: textColor, boxRadius: 4, padding: 16 },
                },
              },
            },
          }));
        }
      }

      /* Chart 3 — Line: Password strength (log scale) */
      if (ref3.current) {
        const ctx = ref3.current.getContext('2d');
        if (ctx) {
          const gradient: CanvasGradient = ctx.createLinearGradient(0, 0, 0, 280);
          gradient.addColorStop(0, 'rgba(22,163,74,0.45)');
          gradient.addColorStop(1, 'rgba(22,163,74,0.02)');

          const fmtMin = (v: number): string => {
            if (v >= 1e15) return `${(v / 1e15).toFixed(1)}Q min`;
            if (v >= 1e12) return `${(v / 1e12).toFixed(0)}T min`;
            if (v >= 1e9)  return `${(v / 1e9).toFixed(0)}B min`;
            if (v >= 1e6)  return `${(v / 1e6).toFixed(0)}M min`;
            if (v >= 1e3)  return `${(v / 1e3).toFixed(0)}K min`;
            return `${v} min`;
          };

          const fmtTick = (v: number | string): string => {
            const n = Number(v);
            if (n >= 1e15) return `${(n / 1e15).toFixed(0)}Q`;
            if (n >= 1e12) return `${(n / 1e12).toFixed(0)}T`;
            if (n >= 1e9)  return `${(n / 1e9).toFixed(0)}B`;
            if (n >= 1e6)  return `${(n / 1e6).toFixed(0)}M`;
            if (n >= 1e3)  return `${(n / 1e3).toFixed(0)}K`;
            return String(n);
          };

          charts.current.push(new Chart(ctx, {
            type: 'line',
            data: {
              labels: t.c3Labels,
              datasets: [{
                label: t.c3YLabel,
                data: [60, 43200, 52560000, 5.26e11, 5.26e15],
                borderColor: '#16A34A',
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#16A34A',
                pointBorderColor: cardBg,
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
              }],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              animation: { duration: 800 },
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (tooltipCtx: { parsed: { y: number } }): string =>
                      fmtMin(tooltipCtx.parsed.y),
                  },
                },
              },
              scales: {
                x: { grid: { color: gridColor }, ticks: { color: textColor } },
                y: {
                  type: 'logarithmic',
                  grid: { color: gridColor },
                  title: { display: true, text: t.c3YLabel, color: textColor },
                  ticks: { color: textColor, callback: fmtTick },
                },
              },
            },
          }));
        }
      }
    }

    loadChartJs(init);

    return () => {
      charts.current.forEach(c => c.destroy());
      charts.current = [];
    };
  }, [lang]);

  const t = T[lang] ?? T.en;

  const cardClass =
    'bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800';

  return (
    <section className="border-b dark:border-gray-800 bg-gray-50 dark:bg-[#0d0d0d]">
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Section header */}
        <div className="mb-10">
          <p className="text-xs font-bold text-brand-primary uppercase tracking-widest mb-2">
            {t.eyebrow}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-text dark:text-white tracking-tight mb-3">
            {t.title}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{t.subtitle}</p>
        </div>

        <div className="space-y-6">

          {/* Chart 1: Error Rate */}
          <div className={cardClass}>
            <h3 className="font-semibold text-brand-text dark:text-white mb-4 text-sm leading-snug">
              {t.c1Title}
            </h3>
            <div style={{ height: 280 }}>
              <canvas ref={ref1} />
            </div>
            <p className="mt-3 text-[11px] text-gray-400 italic">{t.c1Source}</p>
          </div>

          {/* Chart 2: Cognitive Load Doughnut */}
          <div className={cardClass}>
            <h3 className="font-semibold text-brand-text dark:text-white mb-4 text-sm leading-snug">
              {t.c2Title}
            </h3>
            <div className="relative" style={{ height: 280 }}>
              <canvas ref={ref2} />
              {/* Center label positioned in donut hole */}
              <div
                className="absolute left-1/2 pointer-events-none"
                style={{ top: '42%', transform: 'translate(-50%, -50%)' }}
              >
                <span className="text-sm font-bold text-brand-primary whitespace-nowrap">
                  {t.c2Center}
                </span>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-gray-400 italic">{t.c2Source}</p>
          </div>

          {/* Chart 3: Password Log Scale */}
          <div className={cardClass}>
            <h3 className="font-semibold text-brand-text dark:text-white mb-4 text-sm leading-snug">
              {t.c3Title}
            </h3>
            <div style={{ height: 280 }}>
              <canvas ref={ref3} />
            </div>
            <p className="mt-3 text-[11px] text-gray-400 italic">{t.c3Source}</p>
          </div>

        </div>
      </div>
    </section>
  );
}
