import { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://quickbestgo.com'

  const tools = [
    '',
    '/random-number-generator',
    '/password-generator',
    '/age-calculator',
    '/coin-flip',
    '/wheel-spinner',
    '/qr-code-generator',
    '/percentage-calculator',
  ]

  const entries: MetadataRoute.Sitemap = []

  locales.forEach((locale) => {
    tools.forEach((tool) => {
      const url = tool
        ? `${baseUrl}/${locale}${tool}/`
        : `${baseUrl}/${locale}/`

      entries.push({
        url,
        lastModified: new Date('2026-03-19'),
        changeFrequency: 'monthly',
        priority: tool === '' ? 1.0 : 0.8,
      })
    })
  })

  return entries
}
