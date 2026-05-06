import { getSortedLearnPosts } from '@/data/learn'

export const runtime = 'nodejs'
export const revalidate = 3600 // 1 hour

const SITE_URL = 'https://househavenrealty.com'

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function rfc822(iso: string): string {
  return new Date(iso).toUTCString()
}

export async function GET() {
  const posts = getSortedLearnPosts()
  const lastBuild = posts[0]?.updatedAt ?? new Date().toISOString()

  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/learn/${p.slug}`
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(p.publishedAt)}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>House Haven Realty — Learn</title>
    <link>${SITE_URL}/learn</link>
    <atom:link href="${SITE_URL}/learn/feed.xml" rel="self" type="application/rss+xml" />
    <description>Long-form Nashville real estate writing from House Haven Realty. Pieces tagged by category and reader stage.</description>
    <language>en-us</language>
    <lastBuildDate>${rfc822(lastBuild)}</lastBuildDate>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600',
    },
  })
}
