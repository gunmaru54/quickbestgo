import Link from 'next/link';
import { 
  Hash, 
  Lock, 
  Calendar, 
  CircleDot, 
  RotateCw,
  QrCode
} from 'lucide-react';
import { getDictionary, Locale } from '@/lib/i18n';
import { Metadata } from 'next';

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dict = await getDictionary(lang);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      languages: {
        'ko': '/ko',
        'en': '/en',
        'es': '/es',
        'pt': '/pt',
        'ja': '/ja',
      }
    }
  };
}

export default async function Home({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);

  const tools = [
    {
      name: dict.tools.random_number_generator.name,
      description: dict.tools.random_number_generator.description,
      href: `/${lang}/random-number-generator`,
      icon: Hash,
      category: dict.tools.random_number_generator.category,
    },
    {
      name: dict.tools.password_generator.name,
      description: dict.tools.password_generator.description,
      href: `/${lang}/password-generator`,
      icon: Lock,
      category: dict.tools.password_generator.category,
    },
    {
      name: dict.tools.coin_flip.name,
      description: dict.tools.coin_flip.description,
      href: `/${lang}/coin-flip`,
      icon: CircleDot,
      category: dict.tools.coin_flip.category,
    },
    {
      name: dict.tools.wheel_spinner.name,
      description: dict.tools.wheel_spinner.description,
      href: `/${lang}/wheel-spinner`,
      icon: RotateCw,
      category: dict.tools.wheel_spinner.category,
    },
    {
      name: dict.tools.age_calculator.name,
      description: dict.tools.age_calculator.description,
      href: `/${lang}/age-calculator`,
      icon: Calendar,
      category: dict.tools.age_calculator.category,
    },
    {
      name: dict.tools.qr_code_generator.name,
      description: dict.tools.qr_code_generator.description,
      href: `/${lang}/qr-code-generator`,
      icon: QrCode,
      category: dict.tools.qr_code_generator.category,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          {dict.home.title}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {dict.home.description}
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link 
            key={tool.href} 
            href={tool.href}
            className="group p-6 bg-white dark:bg-[#1a1a1a] border dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500 transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <tool.icon size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {tool.category}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tool.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{tool.description}</p>
          </Link>
        ))}
      </div>
      
      <div className="mt-20 prose dark:prose-invert max-w-none border-t dark:border-gray-800 pt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{dict.home.about_title}</h2>
        <p>{dict.home.about_p1}</p>
        <p>{dict.home.about_p2}</p>
      </div>
    </div>
  );
}
