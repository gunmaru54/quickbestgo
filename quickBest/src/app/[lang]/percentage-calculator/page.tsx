import { Metadata } from 'next';
import PercentageCalculator from '@/components/tools/PercentageCalculator';
import { getDictionary, Locale } from '@/lib/i18n';

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
  
  return {
    title: dict?.percentage_calculator?.meta_title || "Percentage Calculator - QuickBest",
    description: dict?.percentage_calculator?.meta_description || "Calculate percentages quickly with our free online tool.",
    alternates: {
      languages: {
        'ko': `/ko/percentage-calculator`,
        'en': `/en/percentage-calculator`,
        'es': `/es/percentage-calculator`,
        'pt': `/pt/percentage-calculator`,
        'ja': `/ja/percentage-calculator`,
      }
    }
  };
}

export default async function PercentageCalculatorPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  
  const pcDict = dict?.percentage_calculator || {
    title: "Percentage Calculator",
    about_title: "How to use the Percentage Calculator?",
    about_p1: "QuickBest's Percentage Calculator now supports three modes: percent of a number, increase by percent, and decrease by percent.",
    about_p2: "예: '200의 15%' → 30, '200에서 15% 증가' → 230, '200에서 15% 감소' → 170",
    about_p3: "모든 계산은 브라우저에서 즉시 수행됩니다.",
    title_mode1: "퍼센트 구하기",
    title_mode2: "증가 계산",
    title_mode3: "감소 계산",
    example_mode1: "예: 200의 15%는 30",
    example_mode2: "예: 200에서 15% 증가하면 230",
    example_mode3: "예: 200에서 15% 감소하면 170",
    label_percent: "%",
    label_of: "의",
    label_result: "결과"
  };

  return (
    <div className="container mx-auto px-4 py-12">
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
