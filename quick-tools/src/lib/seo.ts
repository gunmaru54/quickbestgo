import { Metadata } from "next";

export const siteConfig = {
  name: "QuickTools",
  description: "Global utility tools for everyday needs. Fast, simple, and mobile-friendly.",
  url: "https://quicktools.example.com",
};

export function constructMetadata({
  title,
  description = siteConfig.description,
  image = "/og-image.png",
  noIndex = false,
}: {
  title: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  return {
    title: `${title} | ${siteConfig.name}`,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@quicktools",
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    metadataBase: new URL(siteConfig.url),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
