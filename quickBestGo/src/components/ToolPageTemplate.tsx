import { ReactNode } from 'react';
import { CategoryTheme } from '@/lib/tools';
import { generateFAQSchema } from '@/lib/seo';
import FavoriteButton from './FavoriteButton';
import BookmarkButton from './BookmarkButton';

interface FaqItem {
  q: string;
  a: string;
}

interface ToolPageTemplateProps {
  schemas: object | object[];
  title: string;
  toolComponent: ReactNode;
  about: {
    title: string;
    p1: string;
    p2: string;
    p3: string;
  };
  theme: CategoryTheme;
  icon: ReactNode;
  faq?: {
    title: string;
    items: FaqItem[];
  };
  slug?: string;
  favLabels?: {
    add: string;
    remove: string;
  };
  lang?: string;
}

export default function ToolPageTemplate({ schemas, title, toolComponent, about, theme, icon, faq, slug, favLabels, lang }: ToolPageTemplateProps) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      {faq && faq.items.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(faq.items)) }}
        />
      )}

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white dark:bg-[#0a0a0a] border-b dark:border-gray-800">
        {/* Subtle category-colored orb */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -top-28 -right-16 w-80 h-80 rounded-full blur-3xl opacity-50 ${theme.iconBg}`}
        />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -bottom-20 -left-12 w-64 h-64 rounded-full blur-3xl opacity-30 ${theme.iconBg}`}
        />

        <div className="relative max-w-4xl mx-auto px-6 py-12 md:py-16 text-center">
          {/* Category badge */}
          <div className={`inline-flex items-center gap-2 ${theme.badge} text-xs font-bold px-4 py-2 rounded-full mb-6 tracking-wide`}>
            <span className={`flex items-center ${theme.iconColor}`} aria-hidden="true">{icon}</span>
            <span aria-hidden="true">{theme.emoji}</span>
          </div>

          {/* Title — Space Grotesk */}
          <h1 className="font-display text-3xl md:text-5xl font-bold text-brand-text dark:text-white tracking-tight leading-tight">
            {title}
          </h1>

          {/* Action buttons: Favorite + Bookmark */}
          {(slug && favLabels || lang) && (
            <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
              {slug && favLabels && (
                <FavoriteButton slug={slug} labelAdd={favLabels.add} labelRemove={favLabels.remove} />
              )}
              {lang && <BookmarkButton lang={lang} />}
            </div>
          )}
        </div>
      </section>

      {/* ── TOOL + CONTENT ─────────────────────────────────────── */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          {/* Tool component */}
          <div className="mb-12">
            {toolComponent}
          </div>

          {/* About section */}
          <article className={`prose dark:prose-invert max-w-none bg-white dark:bg-[#111] p-8 rounded-3xl border ${theme.accentBorder} transition-colors duration-300`}>
            <h2 className="font-display text-2xl font-bold mb-4 text-brand-text dark:text-white">{about.title}</h2>
            <p>{about.p1}</p>
            <p>{about.p2}</p>
            <p>{about.p3}</p>
          </article>

          {/* FAQ section */}
          {faq && faq.items.length > 0 && (
            <section className={`mt-6 bg-white dark:bg-[#111] p-8 rounded-3xl border ${theme.accentBorder} transition-colors duration-300`}>
              <h2 className="font-display text-2xl font-bold mb-6 text-brand-text dark:text-white">{faq.title}</h2>
              <dl className="space-y-5">
                {faq.items.map((item, i) => (
                  <div key={i} className={`border-b ${theme.accentBorder} last:border-0 pb-5 last:pb-0`}>
                    <dt className="font-display font-semibold text-brand-text dark:text-white mb-2 flex items-start gap-2.5">
                      <span className={`mt-[5px] flex-none w-1.5 h-1.5 rounded-full ${theme.iconBg} ${theme.iconColor}`} aria-hidden="true" />
                      {item.q}
                    </dt>
                    <dd className="text-gray-600 dark:text-gray-400 leading-relaxed pl-4">{item.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
