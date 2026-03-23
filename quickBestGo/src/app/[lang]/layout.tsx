import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Locale } from "@/lib/i18n";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CurrencyProvider } from "@/components/CurrencyProvider";

export async function generateStaticParams() {
  return [
    { lang: 'ko' },
    { lang: 'en' },
    { lang: 'es' },
    { lang: 'ja' },
    { lang: 'pt' },
  ];
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  return (
    <ThemeProvider>
      <CurrencyProvider>
      <Header lang={params.lang} />
      <main className="flex-grow bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
        {children}
      </main>
      <Footer lang={params.lang} />
      </CurrencyProvider>
    </ThemeProvider>
  );
}
