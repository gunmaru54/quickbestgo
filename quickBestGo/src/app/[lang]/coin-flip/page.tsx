import { Metadata } from 'next';
import CoinFlip from '@/components/tools/CoinFlip';
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
    title: dict.coin_flip.meta_title,
    description: dict.coin_flip.meta_description,
    lang,
    slug: 'coin-flip',
  });
}

export default async function CoinFlipPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  const schemas = generateWebApplicationSchema({
    name: dict.coin_flip.title,
    description: dict.coin_flip.meta_description,
    lang,
    slug: 'coin-flip',
    category: 'EntertainmentApplication',
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-center text-gray-900 dark:text-white mb-8">
          {dict.coin_flip.title}
        </h1>

        <div className="mb-12">
          <CoinFlip dict={dict.coin_flip} />
        </div>

        <article className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-3xl border dark:border-gray-800 transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{dict.coin_flip.about_title}</h2>
          <p>{dict.coin_flip.about_p1}</p>
          <p>{dict.coin_flip.about_p2}</p>
          <p>{dict.coin_flip.about_p3}</p>
        </article>
      </div>
    </div>
  );
}
