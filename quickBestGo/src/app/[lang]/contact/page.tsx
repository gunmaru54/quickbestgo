import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/i18n';
import { constructMetadata } from '@/lib/seo';
import { Mail, Clock, MessageSquare } from 'lucide-react';

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
        <p className="text-center text-gray-500 dark:text-gray-400 mb-12">{p.subtitle}</p>

        <div className="space-y-6">
          <div className="flex items-start gap-5 bg-gray-50 dark:bg-[#1a1a1a] p-6 rounded-2xl border dark:border-gray-800">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
              <Mail size={22} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white mb-1">{p.email_title}</h2>
              <a
                href={`mailto:${p.email}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {p.email}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-5 bg-gray-50 dark:bg-[#1a1a1a] p-6 rounded-2xl border dark:border-gray-800">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
              <Clock size={22} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white mb-1">{p.response_title}</h2>
              <p className="text-gray-500 dark:text-gray-400">{p.response_time}</p>
            </div>
          </div>

          <div className="flex items-start gap-5 bg-gray-50 dark:bg-[#1a1a1a] p-6 rounded-2xl border dark:border-gray-800">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
              <MessageSquare size={22} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white mb-1">{p.feedback_title}</h2>
              <p className="text-gray-500 dark:text-gray-400">{p.feedback_p1}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
