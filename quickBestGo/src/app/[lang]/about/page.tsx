import { Metadata } from 'next';
import Link from 'next/link';
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

  const expertise = [
    { text: p.expertise_p1 },
    { text: p.expertise_p2 },
    { text: p.expertise_p3 },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-3">
            {p.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">{p.tagline}</p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { value: p.stat_tools },
            { value: p.stat_languages },
            { value: p.stat_data },
          ].map((stat) => (
            <div
              key={stat.value}
              className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-4 text-center"
            >
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6">

          {/* Story */}
          <section className="bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-3xl border dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{p.story_title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">{p.story_p1}</p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{p.story_p2}</p>
          </section>

          {/* Mission */}
          <section className="bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-3xl border dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{p.mission_title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">{p.mission_p1}</p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{p.mission_p2}</p>
          </section>

          {/* Expertise */}
          <section className="bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-3xl border dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{p.expertise_title}</h2>
            <div className="space-y-3">
              {expertise.map((item, i) => (
                <p key={i} className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.text}</p>
              ))}
            </div>
          </section>

          {/* Tools */}
          <section className="bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-3xl border dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{p.tools_title}</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{p.tools_p1}</p>
          </section>

          {/* Transparency */}
          <section className="bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-3xl border dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{p.transparency_title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">{p.transparency_p1}</p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{p.transparency_p2}</p>
          </section>

          {/* Privacy */}
          <section className="bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-3xl border dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{p.privacy_title}</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{p.privacy_p1}</p>
          </section>

          {/* Contact CTA */}
          <section className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-8 rounded-3xl text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{p.contact_title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">{p.contact_p1}</p>
            <Link
              href={`/${lang}/contact`}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              {dict.navigation.contact} →
            </Link>
          </section>

        </div>
      </div>
    </div>
  );
}
