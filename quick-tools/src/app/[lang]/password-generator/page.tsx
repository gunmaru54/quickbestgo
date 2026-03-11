import { Metadata } from 'next';
import PasswordGenerator from '@/components/tools/PasswordGenerator';
import { getDictionary, Locale } from '@/lib/i18n';

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dict = await getDictionary(lang);
  
  return {
    title: dict?.password_generator?.meta_title || "Password Generator - QuickTools",
    description: dict?.password_generator?.meta_description || "Create secure and customizable passwords with our free online tool.",
    alternates: {
      languages: {
        'ko': `/ko/password-generator`,
        'en': `/en/password-generator`,
        'es': `/es/password-generator`,
        'pt': `/pt/password-generator`,
        'ja': `/ja/password-generator`,
      }
    }
  };
}

export default async function PasswordGeneratorPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  
  // Fallback structure in case dictionary is missing specific keys
  const pgDict = dict?.password_generator || {
    title: "Password Generator",
    about_title: "Strong Password Generator",
    about_p1: "",
    about_p2: "",
    about_p3: "",
    label_length: "Password Length",
    label_uppercase: "Include Uppercase",
    label_numbers: "Include Numbers",
    label_symbols: "Include Symbols",
    btn_generate: "Generate Password",
    tooltip_copy: "Copy to clipboard"
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-center text-gray-900 dark:text-white mb-8">
          {pgDict.title}
        </h1>
        
        <div className="mb-12">
          <PasswordGenerator dict={pgDict} />
        </div>

        <article className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-3xl border dark:border-gray-800 transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{pgDict.about_title}</h2>
          <p>{pgDict.about_p1}</p>
          <p>{pgDict.about_p2}</p>
          <p>{pgDict.about_p3}</p>
        </article>
      </div>
    </div>
  );
}
