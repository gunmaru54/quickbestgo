import { Metadata } from 'next';
import RandomNumberGenerator from '@/components/tools/RandomNumberGenerator';
import { getDictionary, Locale } from '@/lib/i18n';

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dict = await getDictionary(lang);
  return {
    title: dict.random_number_generator.meta_title,
    description: dict.random_number_generator.meta_description,
    alternates: {
      languages: {
        'ko': `/ko/random-number-generator`,
        'en': `/en/random-number-generator`,
        'es': `/es/random-number-generator`,
        'pt': `/pt/random-number-generator`,
        'ja': `/ja/random-number-generator`,
      }
    }
  };
}

export async function generateStaticParams() {
  return [
    { lang: 'ko' },
    { lang: 'en' },
    { lang: 'es' },
    { lang: 'ja' },
    { lang: 'pt' },
  ];
}

export default async function RandomNumberGeneratorPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-center text-gray-900 dark:text-white mb-8">
          {dict.random_number_generator.title}
        </h1>
        
        <div className="mb-12">
          <RandomNumberGenerator dict={dict.random_number_generator} />
        </div>

        <article className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-3xl border dark:border-gray-800 transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{dict.random_number_generator.about_title}</h2>
          <p>{dict.random_number_generator.about_p1}</p>
          <p>{dict.random_number_generator.about_p2}</p>
          <p>{dict.random_number_generator.about_p3}</p>
        </article>
      </div>
    </div>
  );
}
