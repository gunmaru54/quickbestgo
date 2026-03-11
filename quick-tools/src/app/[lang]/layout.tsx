import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Locale } from "@/lib/i18n";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  return (
    <ThemeProvider>
      <Header lang={params.lang} />
      <main className="flex-grow bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
        {children}
      </main>
      <Footer lang={params.lang} />
    </ThemeProvider>
  );
}
