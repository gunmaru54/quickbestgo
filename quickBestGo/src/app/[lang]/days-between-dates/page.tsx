import { Metadata } from 'next';
import DaysBetweenDates from '@/components/tools/DaysBetweenDates';
import ToolPageTemplate from '@/components/ToolPageTemplate';
import { getDictionary, getStaticParams, Locale } from '@/lib/i18n';
import { constructMetadata, generateWebApplicationSchema } from '@/lib/seo';
import { TOOLS, CATEGORY_THEMES } from '@/lib/tools';

export { getStaticParams as generateStaticParams };

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dict = await getDictionary(lang);
  return constructMetadata({ title: dict.days_between_dates.meta_title, description: dict.days_between_dates.meta_description, lang, slug: 'days-between-dates' });
}

export default async function DaysBetweenDatesPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  const d = dict.days_between_dates;
  const schemas = generateWebApplicationSchema({ name: d.title, description: d.meta_description, lang, slug: 'days-between-dates', category: 'UtilityApplication' });
  const toolConfig = TOOLS.find(t => t.slug === 'days-between-dates')!;
  const theme = CATEGORY_THEMES[toolConfig.category];

  return (
    <ToolPageTemplate
      schemas={schemas}
      title={d.title}
      theme={theme}
      icon={<toolConfig.icon size={20} />}
      toolComponent={<DaysBetweenDates dict={d} lang={lang} theme={theme} />}
      about={{ title: d.about_title, p1: d.about_p1, p2: d.about_p2, p3: d.about_p3 }}
    />
  );
}
