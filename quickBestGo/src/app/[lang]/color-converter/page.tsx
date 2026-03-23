import { Metadata } from 'next';
import ColorConverterTool from '@/components/tools/ColorConverterTool';
import ToolPageTemplate from '@/components/ToolPageTemplate';
import { getDictionary, getStaticParams, Locale } from '@/lib/i18n';
import { constructMetadata, generateWebApplicationSchema } from '@/lib/seo';
import { TOOLS, CATEGORY_THEMES } from '@/lib/tools';

export { getStaticParams as generateStaticParams };

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dict = await getDictionary(lang);
  return constructMetadata({ title: dict.color_converter.meta_title, description: dict.color_converter.meta_description, lang, slug: 'color-converter' });
}

export default async function ColorConverterPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  const d = dict.color_converter;
  const schemas = generateWebApplicationSchema({ name: d.title, description: d.meta_description, lang, slug: 'color-converter', category: 'DeveloperApplication' });
  const toolConfig = TOOLS.find(t => t.slug === 'color-converter')!;
  const theme = CATEGORY_THEMES[toolConfig.category];

  return (
    <ToolPageTemplate
      schemas={schemas}
      title={d.title}
      theme={theme}
      icon={<toolConfig.icon size={20} />}
      toolComponent={<ColorConverterTool dict={d} theme={theme} />}
      about={{ title: d.about_title, p1: d.about_p1, p2: d.about_p2, p3: d.about_p3 }}
      faq={{ title: d.faq_title, items: d.faq }}
    />
  );
}
