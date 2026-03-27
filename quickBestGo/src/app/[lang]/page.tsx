import { getDictionary, getStaticParams, Locale } from '@/lib/i18n';
import { Metadata } from 'next';
import { siteConfig, getLanguageAlternates, getOgLocale, generateWebSiteSchema, generateFAQSchema } from '@/lib/seo';
import ToolsGrid from '@/components/ToolsGrid';
import ScientificCharts from '@/components/ScientificCharts';
import { Zap, Shield, CheckCircle, ArrowDown } from 'lucide-react';

export { getStaticParams as generateStaticParams };

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dict = await getDictionary(lang);
  const canonicalUrl = `${siteConfig.url}/${lang}/`;

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: canonicalUrl,
      languages: getLanguageAlternates(''),
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: getOgLocale(lang),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.meta.title,
      description: dict.meta.description,
      creator: '@quickbestgo',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
    },
  };
}


export default async function Home({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  const schema = generateWebSiteSchema(lang, dict.meta.description);
  const homeFaq = dict.home.faq as Array<{ q: string; a: string }>;
  const h = dict.home;

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {homeFaq && homeFaq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(homeFaq)) }}
        />
      )}

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white dark:bg-[#0a0a0a] border-b dark:border-gray-800">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-16 w-[500px] h-[500px] rounded-full bg-brand-primary/8 dark:bg-brand-primary/5 blur-3xl" />
          <div className="absolute top-20 -left-24 w-80 h-80 rounded-full bg-brand-secondary/6 dark:bg-brand-secondary/4 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-14 md:pt-24 md:pb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            <div>
              <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold px-4 py-2 rounded-full mb-8 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" aria-hidden="true" />
                {h.hero_badge}
              </div>

              <h1 className="font-display text-[2.6rem] md:text-6xl font-bold text-brand-text dark:text-white tracking-tight leading-[1.05] mb-5">
                {h.title}
              </h1>

              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-xs">
                {h.description}
              </p>

              <a
                href="#tools"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold px-6 py-3 rounded-xl transition-all duration-150 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand-primary/20"
              >
                {h.hero_cta}
                <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { num: '20+', label: h.stat_tools,     borderColor: 'border-brand-primary/25',   bgColor: 'bg-brand-primary/8 dark:bg-brand-primary/8',   numColor: 'text-brand-primary'   },
                { num: '5',   label: h.stat_languages,  borderColor: 'border-brand-secondary/25', bgColor: 'bg-brand-secondary/8 dark:bg-brand-secondary/8', numColor: 'text-brand-secondary' },
                { num: '0',   label: h.stat_signup,     borderColor: 'border-brand-success/25',   bgColor: 'bg-brand-success/8 dark:bg-brand-success/8',   numColor: 'text-brand-success'   },
              ].map(s => (
                <div
                  key={s.label}
                  className={`flex items-center gap-4 p-5 border rounded-2xl ${s.bgColor} ${s.borderColor}`}
                >
                  <div className={`font-display text-4xl font-bold tabular-nums ${s.numColor}`}>{s.num}</div>
                  <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS STRIP ─────────────────────────────────────── */}
      <section className="border-b dark:border-gray-800 bg-gray-50 dark:bg-[#0d0d0d]">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap size={18} aria-hidden="true" />,
                title: h.benefit_speed_title,
                desc:  h.benefit_speed_desc,
                iconColor: 'text-brand-warning',
                iconBg:    'bg-brand-warning/10',
                border:    'border-brand-warning/20',
                bg:        'bg-brand-warning-50 dark:bg-brand-warning/5',
              },
              {
                icon: <Shield size={18} aria-hidden="true" />,
                title: h.benefit_privacy_title,
                desc:  h.benefit_privacy_desc,
                iconColor: 'text-brand-primary',
                iconBg:    'bg-brand-primary/10',
                border:    'border-brand-primary/20',
                bg:        'bg-brand-primary-50 dark:bg-brand-primary/5',
              },
              {
                icon: <CheckCircle size={18} aria-hidden="true" />,
                title: h.benefit_free_title,
                desc:  h.benefit_free_desc,
                iconColor: 'text-brand-success',
                iconBg:    'bg-brand-success/10',
                border:    'border-brand-success/20',
                bg:        'bg-brand-success-50 dark:bg-brand-success/5',
              },
            ].map(b => (
              <div key={b.title} className={`flex flex-col gap-3 p-6 rounded-2xl border ${b.bg} ${b.border}`}>
                <div className={`w-9 h-9 flex items-center justify-center rounded-xl ${b.iconBg} ${b.iconColor}`}>
                  {b.icon}
                </div>
                <h2 className="font-display font-semibold text-brand-text dark:text-white">{b.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCIENTIFIC CHARTS ──────────────────────────────────── */}
      <ScientificCharts lang={lang} />

      {/* ── TOOLS GRID ─────────────────────────────────────────── */}
      <div id="tools" className="max-w-5xl mx-auto px-6 py-12">
        <ToolsGrid lang={lang} dict={dict} />

        <div className="mt-20 prose dark:prose-invert max-w-none border-t dark:border-gray-800 pt-12">
          <h2 className="font-display text-2xl font-bold mb-6 text-brand-text dark:text-white">{h.about_title}</h2>
          <p>{h.about_p1}</p>
          <p>{h.about_p2}</p>
        </div>

        {homeFaq && homeFaq.length > 0 && (
          <section className="mt-8 bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-3xl border dark:border-gray-800 transition-colors duration-300">
            <h2 className="font-display text-2xl font-bold mb-6 text-brand-text dark:text-white">{h.faq_title}</h2>
            <dl className="space-y-6">
              {homeFaq.map((item, i) => (
                <div key={i} className="border-b dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                  <dt className="font-semibold text-brand-text dark:text-white mb-2">{item.q}</dt>
                  <dd className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>
    </div>
  );
}
