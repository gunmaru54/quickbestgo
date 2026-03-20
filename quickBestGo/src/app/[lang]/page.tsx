import Link from 'next/link';
import { getDictionary, getStaticParams, Locale } from '@/lib/i18n';
import { Metadata } from 'next';
import { siteConfig, getLanguageAlternates, getOgLocale, generateWebSiteSchema } from '@/lib/seo';
import { TOOLS } from '@/lib/tools';

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
    <div className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          {dict.home.title}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {dict.home.description}
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOOLS.map((tool) => {
          const t = dict.tools[tool.dictKey as keyof typeof dict.tools];
          return (
            <Link
              key={tool.slug}
              href={`/${lang}/${tool.slug}`}
              className="group p-6 bg-white dark:bg-[#1a1a1a] border dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500 transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <tool.icon size={24} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {t.category}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">{t.description}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-20 prose dark:prose-invert max-w-none border-t dark:border-gray-800 pt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{dict.home.about_title}</h2>
        <p>{dict.home.about_p1}</p>
        <p>{dict.home.about_p2}</p>
      </div>
    </div>
  );
}
