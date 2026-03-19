import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/i18n';
import { constructMetadata } from '@/lib/seo';

export async function generateStaticParams() {
  return [
    { lang: 'ko' },
    { lang: 'en' },
    { lang: 'es' },
    { lang: 'ja' },
    { lang: 'pt' },
  ];
}

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dict = await getDictionary(lang);
  return constructMetadata({
    title: dict.privacy_policy_page.meta_title,
    description: dict.privacy_policy_page.meta_description,
    lang,
    slug: 'privacy-policy',
  });
}

export default async function PrivacyPolicyPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  const p = dict.privacy_policy_page;

  const sections = [
    { title: p.s1_title, content: p.s1_content },
    { title: p.s2_title, content: p.s2_content },
    { title: p.s3_title, content: p.s3_content },
    { title: p.s4_title, content: p.s4_content },
    { title: p.s5_title, content: p.s5_content },
    { title: p.s6_title, content: p.s6_content },
    { title: p.contact_title, content: p.contact_content },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-center text-gray-900 dark:text-white mb-3">
          {p.title}
        </h1>
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 mb-10">{p.last_updated}</p>

        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6 mb-8">
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{p.intro}</p>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <section
              key={section.title}
              className="bg-gray-50 dark:bg-[#1a1a1a] p-6 rounded-2xl border dark:border-gray-800"
            >
              <h2 className="font-bold text-gray-900 dark:text-white mb-3">{section.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
