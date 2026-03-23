import { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n';
import { siteConfig } from '@/lib/seo';
import { TOOLS } from '@/lib/tools';

const STATIC_SLUGS = ['about', 'contact', 'privacy-policy'];

const CATEGORY_SLUGS = [
  'calculators',
  'developer-tools',
  'random-tools',
  'converters',
  'health-tools',
  'utilities',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = ['', ...TOOLS.map((t) => `/${t.slug}`)];
  const entries: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    // Home + tool pages
    slugs.forEach((slug) => {
      entries.push({
        url: slug ? `${siteConfig.url}/${locale}${slug}/` : `${siteConfig.url}/${locale}/`,
        lastModified: new Date('2026-03-20'),
        changeFrequency: 'monthly',
        priority: slug === '' ? 1.0 : 0.8,
      });
    });

    // Static pages (about, contact, privacy-policy)
    STATIC_SLUGS.forEach((staticSlug) => {
      entries.push({
        url: `${siteConfig.url}/${locale}/${staticSlug}/`,
        lastModified: new Date('2026-03-20'),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    });

    // Category landing pages
    CATEGORY_SLUGS.forEach((catSlug) => {
      entries.push({
        url: `${siteConfig.url}/${locale}/${catSlug}/`,
        lastModified: new Date('2026-03-20'),
        changeFrequency: 'monthly',
        priority: 0.9,
      });
    });
  });

  return entries;
}
