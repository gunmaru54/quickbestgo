import { Metadata } from 'next';
import PercentageCalculator from '@/components/tools/PercentageCalculator';
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
    title: dict?.percentage_calculator?.meta_title || "Percentage Calculator - Free Online Tool - QuickBestGo",
    description: dict?.percentage_calculator?.meta_description || "Calculate percentages quickly with our free online tool.",
    lang,
    slug: 'percentage-calculator',
  });
}

export default async function PercentageCalculatorPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);

  const pcDict = dict?.percentage_calculator || {
    title: "Percentage Calculator",
    meta_description: "Calculate percentages quickly with our free online tool.",
    about_title: "How to use the Percentage Calculator?",
    about_p1: "",
    about_p2: "",
    about_p3: "",
    title_mode1: "Percent of",
    title_mode2: "Increase by Percent",
    title_mode3: "Decrease by Percent",
    example_mode1: "Example: 15% of 200 = 30",
    example_mode2: "Example: 200 + 15% = 230",
    example_mode3: "Example: 200 - 15% = 170",
    label_percent: "%",
    label_of: "of",
    label_result: "Result",
  };

  const schemas = generateWebApplicationSchema({
    name: pcDict.title,
    description: pcDict.meta_description,
    lang,
    slug: 'percentage-calculator',
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
          {pcDict.title}
        </h1>

        <div className="mb-12">
          <PercentageCalculator dict={pcDict} lang={lang} />
        </div>

        <article className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-3xl border dark:border-gray-800 transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{pcDict.about_title}</h2>
          <p>{pcDict.about_p1}</p>
          <p>{pcDict.about_p2}</p>
          <p>{pcDict.about_p3}</p>
        </article>
      </div>
    </div>
  );
}
