import type { MetadataRoute } from 'next'
import { fetchPages } from '@/lib/notion'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchPages()

  const postEntries = posts.map(post => ({
    url: `${BASE_URL}/posts/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categories = [...new Set(posts.map(p => p.category))]
  const categoryEntries = categories.map(category => ({
    url: `${BASE_URL}/category/${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...postEntries,
    ...categoryEntries,
  ]
}
