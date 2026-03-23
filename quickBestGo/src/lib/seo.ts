import { Metadata } from "next";
import { Locale } from "./i18n";

export const siteConfig = {
  name: "QuickBestGo",
  description: "Global utility tools for everyday needs. Fast, simple, and mobile-friendly.",
  url: "https://quickbestgo.com",
};

const localeToOgLocale: Record<string, string> = {
  en: "en_US",
  ko: "ko_KR",
  es: "es_ES",
  ja: "ja_JP",
  pt: "pt_BR",
};

export function getOgLocale(lang: string): string {
  return localeToOgLocale[lang] ?? "en_US";
}

export function getLanguageAlternates(slug: string) {
  const base = siteConfig.url;
  const path = slug ? `/${slug}/` : "/";
  return {
    "x-default": `${base}/en${path}`,
    en: `${base}/en${path}`,
    ko: `${base}/ko${path}`,
    es: `${base}/es${path}`,
    ja: `${base}/ja${path}`,
    pt: `${base}/pt${path}`,
  };
}

export function constructMetadata({
  title,
  description = siteConfig.description,
  image = "/og-image.png",
  lang,
  slug,
  noIndex = false,
}: {
  title: string;
  description?: string;
  image?: string;
  lang?: Locale;
  slug?: string;
  noIndex?: boolean;
}): Metadata {
  const canonicalUrl =
    lang !== undefined
      ? `${siteConfig.url}/${lang}${slug ? `/${slug}` : ""}/`
      : `${siteConfig.url}/`;

  const ogLocale = lang ? getOgLocale(lang) : "en_US";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      ...(lang && { languages: getLanguageAlternates(slug ?? "") }),
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: ogLocale,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@quickbestgo",
    },
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
      apple: "/favicon.svg",
    },
    metadataBase: new URL(siteConfig.url),
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
          },
        },
  };
}

export function generateWebApplicationSchema({
  name,
  description,
  lang,
  slug,
  category = "UtilityApplication",
}: {
  name: string;
  description: string;
  lang: string;
  slug: string;
  category?: string;
}) {
  const url = `${siteConfig.url}/${lang}/${slug}/`;
  const homeUrl = `${siteConfig.url}/${lang}/`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name,
      description,
      url,
      applicationCategory: category,
      operatingSystem: "Any",
      inLanguage: lang,
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: homeUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name,
          item: url,
        },
      ],
    },
  ];
}

export function generateWebSiteSchema(lang: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description,
    url: `${siteConfig.url}/${lang}/`,
    inLanguage: lang,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/${lang}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

export function generateFAQSchema(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}
