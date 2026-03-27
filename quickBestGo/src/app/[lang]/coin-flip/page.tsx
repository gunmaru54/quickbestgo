import { Metadata } from 'next';
import CoinFlip from '@/components/tools/CoinFlip';
import ToolPageTemplate from '@/components/ToolPageTemplate';
import { getDictionary, getStaticParams, Locale } from '@/lib/i18n';
import { constructMetadata, generateWebApplicationSchema } from '@/lib/seo';
import { TOOLS, CATEGORY_THEMES } from '@/lib/tools';

export { getStaticParams as generateStaticParams };

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dict = await getDictionary(lang);
  return constructMetadata({ title: dict.coin_flip.meta_title, description: dict.coin_flip.meta_description, lang, slug: 'coin-flip' });
}

export default async function CoinFlipPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  const d = dict.coin_flip;
  const schemas = generateWebApplicationSchema({ name: d.title, description: d.meta_description, lang, slug: 'coin-flip', category: 'EntertainmentApplication' });
  const toolConfig = TOOLS.find(t => t.slug === 'coin-flip')!;
  const theme = CATEGORY_THEMES[toolConfig.category];

  return (
    <ToolPageTemplate
      schemas={schemas}
      title={d.title}
      theme={theme}
      icon={<toolConfig.icon size={20} />}
      toolComponent={<CoinFlip dict={d} theme={theme} />}
      about={{ title: d.about_title, p1: d.about_p1, p2: d.about_p2, p3: d.about_p3 }}
      faq={{ title: d.faq_title, items: d.faq }}
      slug="coin-flip"
      favLabels={{ add: dict.home.fav_add, remove: dict.home.fav_remove }}
      lang={lang}
    />
  );
}
