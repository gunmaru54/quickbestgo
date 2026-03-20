import { Metadata } from 'next';
import Base64Tool from '@/components/tools/Base64Tool';
import ToolPageTemplate from '@/components/ToolPageTemplate';
import { getDictionary, getStaticParams, Locale } from '@/lib/i18n';
import { constructMetadata, generateWebApplicationSchema } from '@/lib/seo';

export { getStaticParams as generateStaticParams };

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dict = await getDictionary(lang);
  return constructMetadata({ title: dict.base64.meta_title, description: dict.base64.meta_description, lang, slug: 'base64' });
}

export default async function Base64Page({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  const d = dict.base64;
  const schemas = generateWebApplicationSchema({ name: d.title, description: d.meta_description, lang, slug: 'base64', category: 'DeveloperApplication' });

  return (
    <ToolPageTemplate
      schemas={schemas}
      title={d.title}
      toolComponent={<Base64Tool dict={d} />}
      about={{ title: d.about_title, p1: d.about_p1, p2: d.about_p2, p3: d.about_p3 }}
    />
  );
}
