import type { MetadataRoute } from 'next'
import { communities } from '@/data/communities'
import { visibleTeam } from '@/data/team'
import { blogPosts } from '@/data/blog'

const BASE_URL = 'https://househavenrealty.com'

const staticRoutes: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/homes-for-sale', changeFrequency: 'daily', priority: 0.9 },
  { path: '/home-valuation', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/new-construction', changeFrequency: 'daily', priority: 0.9 },
  { path: '/communities', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/team', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/buyers', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/sellers', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/market-reports', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/property-management', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/terms-of-service', changeFrequency: 'yearly', priority: 0.2 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  for (const c of communities) {
    entries.push({
      url: `${BASE_URL}/communities/${c.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }

  for (const m of visibleTeam) {
    entries.push({
      url: `${BASE_URL}/team/${m.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    })
  }

  for (const p of blogPosts) {
    entries.push({
      url: `${BASE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt || p.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  return entries
}
