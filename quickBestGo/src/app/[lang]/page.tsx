import { getDictionary, getStaticParams, Locale } from '@/lib/i18n';
import { Metadata } from 'next';
import { siteConfig, getLanguageAlternates, getOgLocale, generateWebSiteSchema } from '@/lib/seo';
import ToolsGrid from '@/components/ToolsGrid';

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

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-violet-50 dark:from-blue-950/20 dark:via-[#0a0a0a] dark:to-violet-950/20 border-b dark:border-gray-800 py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wide">
            ✨ Free · No signup required
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
            {dict.home.title}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-8">
            {dict.home.description}
          </p>
          <div className="flex justify-center gap-8">
            {[
              { num: '20', label: dict.home.stat_tools },
              { num: '5',  label: dict.home.stat_languages },
              { num: '0',  label: dict.home.stat_signup },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-gray-900 dark:text-white">{s.num}</div>
                <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools grid with search + tabs */}
      <div className="container mx-auto px-4 py-12">
        <ToolsGrid lang={lang} dict={dict} />

        <div className="mt-20 prose dark:prose-invert max-w-none border-t dark:border-gray-800 pt-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{dict.home.about_title}</h2>
          <p>{dict.home.about_p1}</p>
          <p>{dict.home.about_p2}</p>
        </div>
      </div>
    </div>
  );
}
