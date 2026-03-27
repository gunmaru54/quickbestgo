import { Montserrat, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import "./globals.css";
import { siteConfig, generateOrganizationSchema } from "@/lib/seo";

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: "/favicon.svg?v=2",
    shortcut: "/favicon.svg?v=2",
    apple: "/favicon.svg?v=2",
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
        {/* Google Analytics */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-G7LSNG1GKJ" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-G7LSNG1GKJ');`,
          }}
        />
        {/* Google AdSense */}
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
      <body
        className={`${montserrat.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a] text-brand-text dark:text-[#f9fafb] transition-colors duration-300`}
      >
        {children}
      </body>
    </html>
  );
}
