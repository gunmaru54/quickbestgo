import { Metadata } from 'next';
import AgeCalculator from '@/components/tools/AgeCalculator';
import { getDictionary, Locale } from '@/lib/i18n';
import { constructMetadata, generateWebApplicationSchema } from '@/lib/seo';

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
    title: dict.age_calculator.meta_title,
    description: dict.age_calculator.meta_description,
    lang,
    slug: 'age-calculator',
  });
}

export default async function AgeCalculatorPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  const schemas = generateWebApplicationSchema({
    name: dict.age_calculator.title,
    description: dict.age_calculator.meta_description,
    lang,
    slug: 'age-calculator',
    category: 'UtilityApplication',
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-center text-gray-900 dark:text-white mb-8">
          {dict.age_calculator.title}
        </h1>

        <div className="mb-12">
          <AgeCalculator dict={dict.age_calculator} lang={lang} />
        </div>

        <article className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-3xl border dark:border-gray-800 transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{dict.age_calculator.about_title}</h2>
          <p>{dict.age_calculator.about_p1}</p>
          <p>{dict.age_calculator.about_p2}</p>
          <p>{dict.age_calculator.about_p3}</p>
        </article>
      </div>
    </div>
  );
}
