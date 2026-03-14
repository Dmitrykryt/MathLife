import { MetadataRoute } from 'next'
import { realLifeCalculators, realLifeCategoryLabels } from '@/constants/realLifeCalculators'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mathlife.app'
  const currentDate = new Date().toISOString()

  // Главная страница
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/games`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  // Страницы категорий
  const categoryPages: MetadataRoute.Sitemap = Object.keys(realLifeCategoryLabels).map((category) => ({
    url: `${baseUrl}/categories/${category}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Страницы калькуляторов
  const calculatorPages: MetadataRoute.Sitemap = realLifeCalculators.map((calc) => ({
    url: `${baseUrl}/calculator/${calc.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...mainPages, ...categoryPages, ...calculatorPages]
}
