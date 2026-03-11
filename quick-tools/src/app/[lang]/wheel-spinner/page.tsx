import { Metadata } from 'next';
import WheelSpinner from '@/components/tools/WheelSpinner';
import { getDictionary, Locale } from '@/lib/i18n';

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dict = await getDictionary(lang);
  return {
    title: dict.wheel_spinner.meta_title,
    description: dict.wheel_spinner.meta_description,
    alternates: {
      languages: {
        'ko': `/ko/wheel-spinner`,
        'en': `/en/wheel-spinner`,
        'es': `/es/wheel-spinner`,
        'pt': `/pt/wheel-spinner`,
        'ja': `/ja/wheel-spinner`,
      }
    }
  };
}

export default async function WheelSpinnerPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-center text-gray-900 dark:text-white mb-8">
          {dict.wheel_spinner.title}
        </h1>
        
        <div className="mb-12">
          <WheelSpinner dict={dict.wheel_spinner} />
        </div>

        <article className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-3xl border dark:border-gray-800 transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{dict.wheel_spinner.about_title}</h2>
          <p>{dict.wheel_spinner.about_p1}</p>
          <p>{dict.wheel_spinner.about_p2}</p>
          <p>{dict.wheel_spinner.about_p3}</p>
        </article>
      </div>
    </div>
  );
}
