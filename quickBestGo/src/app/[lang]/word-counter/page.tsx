import { Metadata } from 'next';
import WordCounter from '@/components/tools/WordCounter';
import ToolPageTemplate from '@/components/ToolPageTemplate';
import { getDictionary, getStaticParams, Locale } from '@/lib/i18n';
import { constructMetadata, generateWebApplicationSchema } from '@/lib/seo';
import { TOOLS, CATEGORY_THEMES } from '@/lib/tools';

export { getStaticParams as generateStaticParams };

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dict = await getDictionary(lang);
  return constructMetadata({ title: dict.word_counter.meta_title, description: dict.word_counter.meta_description, lang, slug: 'word-counter' });
}

export default async function WordCounterPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  const d = dict.word_counter;
  const schemas = generateWebApplicationSchema({ name: d.title, description: d.meta_description, lang, slug: 'word-counter', category: 'DeveloperApplication' });
  const toolConfig = TOOLS.find(t => t.slug === 'word-counter')!;
  const theme = CATEGORY_THEMES[toolConfig.category];

  return (
    <ToolPageTemplate
      schemas={schemas}
      title={d.title}
      theme={theme}
      icon={<toolConfig.icon size={20} />}
      toolComponent={<WordCounter dict={d} lang={lang} theme={theme} />}
      about={{ title: d.about_title, p1: d.about_p1, p2: d.about_p2, p3: d.about_p3 }}
      faq={{ title: d.faq_title, items: d.faq }}
      slug="word-counter"
      favLabels={{ add: dict.home.fav_add, remove: dict.home.fav_remove }}
      lang={lang}
    />
  );
}
