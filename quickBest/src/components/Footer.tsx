import Link from 'next/link';
import { getDictionary, Locale } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';

const Footer = async ({ lang }: { lang: string }) => {
  const currentYear = new Date().getFullYear();
  const dict = await getDictionary(lang as Locale);
  
  return (
    <footer className="bg-gray-50 dark:bg-[#0a0a0a] border-t dark:border-gray-800 py-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4 text-gray-900 dark:text-white">QuickBest</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {dict.footer.tagline}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-900 dark:text-gray-100">{dict.tools.random_number_generator.category}</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href={`/${lang}/random-number-generator`} className="hover:text-blue-600 dark:hover:text-blue-400">{dict.tools.random_number_generator.name}</Link></li>
              <li><Link href={`/${lang}/password-generator`} className="hover:text-blue-600 dark:hover:text-blue-400">{dict.tools.password_generator.name}</Link></li>
              <li><Link href={`/${lang}/coin-flip`} className="hover:text-blue-600 dark:hover:text-blue-400">{dict.tools.coin_flip.name}</Link></li>
              <li><Link href={`/${lang}/wheel-spinner`} className="hover:text-blue-600 dark:hover:text-blue-400">{dict.tools.wheel_spinner.name}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-900 dark:text-gray-100">{dict.tools.age_calculator.category}</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href={`/${lang}/age-calculator`} className="hover:text-blue-600 dark:hover:text-blue-400">{dict.tools.age_calculator.name}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-900 dark:text-gray-100">Site</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href={`/${lang}`} className="hover:text-blue-600 dark:hover:text-blue-400">{dict.navigation.home}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400 dark:text-gray-500">
          <p>© {currentYear} QuickBest. {dict.footer.rights}</p>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Language:</span>
            <LanguageSwitcher currentLang={lang} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
