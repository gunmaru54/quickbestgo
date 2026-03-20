import { Metadata } from 'next';
import { getDictionary, getStaticParams, Locale } from '@/lib/i18n';
import { constructMetadata } from '@/lib/seo';
import { TOOLS, type ToolCategory } from '@/lib/tools';
import CategoryPageTemplate from '@/components/CategoryPageTemplate';

export { getStaticParams as generateStaticParams };

const CATEGORY: ToolCategory = 'calculators';
const categoryTools = TOOLS.filter((t) => t.category === CATEGORY);

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(lang);
  const cat = dict.categories.calculators;
  return constructMetadata({
    title: cat.meta_title,
    description: cat.meta_description,
    lang,
    slug: cat.slug,
  });
}

export default async function CalculatorsPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dict = await getDictionary(lang);
  return (
    <CategoryPageTemplate
      tools={categoryTools}
      dict={dict}
      lang={lang}
      catKey="calculators"
    />
  );
}
