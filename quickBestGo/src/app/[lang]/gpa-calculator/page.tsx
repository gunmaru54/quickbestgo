import { Metadata } from 'next';
import GpaCalculator from '@/components/tools/GpaCalculator';
import ToolPageTemplate from '@/components/ToolPageTemplate';
import { getDictionary, getStaticParams, Locale } from '@/lib/i18n';
import { constructMetadata, generateWebApplicationSchema } from '@/lib/seo';

export { getStaticParams as generateStaticParams };

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dict = await getDictionary(lang);
  return constructMetadata({ title: dict.gpa_calculator.meta_title, description: dict.gpa_calculator.meta_description, lang, slug: 'gpa-calculator' });
}

export default async function GpaCalculatorPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  const d = dict.gpa_calculator;
  const schemas = generateWebApplicationSchema({ name: d.title, description: d.meta_description, lang, slug: 'gpa-calculator', category: 'EducationApplication' });

  return (
    <ToolPageTemplate
      schemas={schemas}
      title={d.title}
      toolComponent={<GpaCalculator dict={d} />}
      about={{ title: d.about_title, p1: d.about_p1, p2: d.about_p2, p3: d.about_p3 }}
    />
  );
}
