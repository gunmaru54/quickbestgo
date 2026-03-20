import { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n';
import { siteConfig } from '@/lib/seo';
import { TOOLS } from '@/lib/tools';

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = ['', ...TOOLS.map((t) => `/${t.slug}`)];
  const entries: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    slugs.forEach((slug) => {
      entries.push({
        url: slug ? `${siteConfig.url}/${locale}${slug}/` : `${siteConfig.url}/${locale}/`,
        lastModified: new Date('2026-03-19'),
        changeFrequency: 'monthly',
        priority: slug === '' ? 1.0 : 0.8,
      });
    });
  });

  return entries;
}
