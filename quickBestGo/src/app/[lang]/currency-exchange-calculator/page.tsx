import { Metadata } from 'next';
import CurrencyExchangeCalculator from '@/components/tools/CurrencyExchangeCalculator';
import ToolPageTemplate from '@/components/ToolPageTemplate';
import { getDictionary, getStaticParams, Locale } from '@/lib/i18n';
import { constructMetadata, generateWebApplicationSchema } from '@/lib/seo';
import { TOOLS, CATEGORY_THEMES } from '@/lib/tools';

export { getStaticParams as generateStaticParams };

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dict = await getDictionary(lang);
  return constructMetadata({
    title: dict.currency_exchange_calculator.meta_title,
    description: dict.currency_exchange_calculator.meta_description,
    lang,
    slug: 'currency-exchange-calculator',
  });
}

export default async function CurrencyExchangeCalculatorPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  const d = dict.currency_exchange_calculator;
  const schemas = generateWebApplicationSchema({
    name: d.title,
    description: d.meta_description,
    lang,
    slug: 'currency-exchange-calculator',
    category: 'FinanceApplication',
  });
  const toolConfig = TOOLS.find(t => t.slug === 'currency-exchange-calculator')!;
  const theme = CATEGORY_THEMES[toolConfig.category];

  return (
    <ToolPageTemplate
      schemas={schemas}
      title={d.title}
      theme={theme}
      icon={<toolConfig.icon size={20} />}
      toolComponent={
        <CurrencyExchangeCalculator
          dict={{
            label_from: d.label_from,
            label_to: d.label_to,
            btn_swap: d.btn_swap,
            label_quick: d.label_quick,
            label_major_rates: d.label_major_rates,
            label_quick_table: d.label_quick_table,
            label_quick_table_sub: d.label_quick_table_sub,
            label_rate_updated: d.label_rate_updated,
            label_loading: d.label_loading,
            label_error: d.label_error,
            label_copied: d.label_copied,
            label_copy_link: d.label_copy_link,
            label_result_eq: d.label_result_eq,
          }}
          theme={theme}
        />
      }
      about={{ title: d.about_title, p1: d.about_p1, p2: d.about_p2, p3: d.about_p3 }}
      faq={{ title: d.faq_title, items: d.faq }}
      slug="currency-exchange-calculator"
      favLabels={{ add: dict.home.fav_add, remove: dict.home.fav_remove }}
      lang={lang}
    />
  );
}
