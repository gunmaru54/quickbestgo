import { Metadata } from 'next';
import RandomNumberGenerator from '@/components/tools/RandomNumberGenerator';
import ToolPageTemplate from '@/components/ToolPageTemplate';
import { getDictionary, getStaticParams, Locale } from '@/lib/i18n';
import { constructMetadata, generateWebApplicationSchema } from '@/lib/seo';
import { TOOLS, CATEGORY_THEMES } from '@/lib/tools';

export { getStaticParams as generateStaticParams };

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dict = await getDictionary(lang);
  return constructMetadata({ title: dict.random_number_generator.meta_title, description: dict.random_number_generator.meta_description, lang, slug: 'random-number-generator' });
}

export default async function RandomNumberGeneratorPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  const d = dict.random_number_generator;
  const schemas = generateWebApplicationSchema({ name: d.title, description: d.meta_description, lang, slug: 'random-number-generator', category: 'UtilityApplication' });
  const toolConfig = TOOLS.find(t => t.slug === 'random-number-generator')!;
  const theme = CATEGORY_THEMES[toolConfig.category];

  return (
    <ToolPageTemplate
      schemas={schemas}
      title={d.title}
      theme={theme}
      icon={<toolConfig.icon size={20} />}
      toolComponent={<RandomNumberGenerator dict={d} theme={theme} />}
      about={{ title: d.about_title, p1: d.about_p1, p2: d.about_p2, p3: d.about_p3 }}
    />
  );
}
