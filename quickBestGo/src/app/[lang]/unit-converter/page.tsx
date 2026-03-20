import { Metadata } from 'next';
import UnitConverter from '@/components/tools/UnitConverter';
import ToolPageTemplate from '@/components/ToolPageTemplate';
import { getDictionary, getStaticParams, Locale } from '@/lib/i18n';
import { constructMetadata, generateWebApplicationSchema } from '@/lib/seo';

export { getStaticParams as generateStaticParams };

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dict = await getDictionary(lang);
  return constructMetadata({ title: dict.unit_converter.meta_title, description: dict.unit_converter.meta_description, lang, slug: 'unit-converter' });
}

export default async function UnitConverterPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  const d = dict.unit_converter;
  const schemas = generateWebApplicationSchema({ name: d.title, description: d.meta_description, lang, slug: 'unit-converter', category: 'UtilityApplication' });

  return (
    <ToolPageTemplate
      schemas={schemas}
      title={d.title}
      toolComponent={<UnitConverter dict={d} />}
      about={{ title: d.about_title, p1: d.about_p1, p2: d.about_p2, p3: d.about_p3 }}
    />
  );
}
