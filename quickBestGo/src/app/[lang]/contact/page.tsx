import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/i18n';
import { constructMetadata } from '@/lib/seo';
import { Clock } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

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
    title: dict.contact_page.meta_title,
    description: dict.contact_page.meta_description,
    lang,
    slug: 'contact',
  });
}

export default async function ContactPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  const p = dict.contact_page;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-center text-gray-900 dark:text-white mb-4">
          {p.title}
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-10">{p.subtitle}</p>

        {/* Response time card */}
        <div className="flex items-start gap-4 bg-gray-50 dark:bg-[#1a1a1a] p-5 rounded-2xl border dark:border-gray-800 mb-10">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white mb-0.5 text-sm">{p.response_title}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{p.response_time}</p>
          </div>
        </div>

        {/* Contact form */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border dark:border-gray-800 shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{p.form_title}</h2>
          <ContactForm dict={p} />
        </div>
      </div>
    </div>
  );
}
