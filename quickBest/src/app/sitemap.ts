import { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://quickbest.example.com' // Replace with actual domain
  
  const tools = [
    '',
    '/random-number-generator',
    '/password-generator',
    '/age-calculator',
    '/coin-flip',
    '/wheel-spinner',
  ]

  const entries: MetadataRoute.Sitemap = []

  locales.forEach((locale) => {
    tools.forEach((tool) => {
      entries.push({
        url: `${baseUrl}/${locale}${tool}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: tool === '' ? 1 : 0.8,
      })
    })
  })
  
  return entries
}
