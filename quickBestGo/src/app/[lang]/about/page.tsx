import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/i18n';
import { constructMetadata } from '@/lib/seo';

export async function generateStaticParams() {
  return [
    { lang: 'ko' },
    { lang: 'en' },
    { lang: 'es' },
    { lang: 'ja' },
    { lang: 'pt' },
  ];
}

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dict = await getDictionary(lang);
  return constructMetadata({
    title: dict.about_page.meta_title,
    description: dict.about_page.meta_description,
    lang,
    slug: 'about',
  });
}

export default async function AboutPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  const p = dict.about_page;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-center text-gray-900 dark:text-white mb-12">
          {p.title}
        </h1>

        <div className="space-y-10">
          <section className="bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-3xl border dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{p.mission_title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-3">{p.mission_p1}</p>
            <p className="text-gray-600 dark:text-gray-400">{p.mission_p2}</p>
          </section>

          <section className="bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-3xl border dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{p.tools_title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{p.tools_p1}</p>
          </section>

          <section className="bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-3xl border dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{p.privacy_title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{p.privacy_p1}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
