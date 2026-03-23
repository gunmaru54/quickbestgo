import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { siteConfig, generateOrganizationSchema } from "@/lib/seo";

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: {
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
  openGraph: {
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@quickbestgo",
  },
  other: {
    "google-adsense-account": "ca-pub-6274863861710693",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-6274863861710693" />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6274863861710693"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationSchema()) }}
        />
      </head>
      <body className={`${GeistSans.className} min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a] text-[#171717] dark:text-[#ededed] transition-colors duration-300`}>
        {children}
      </body>
    </html>
  );
}
