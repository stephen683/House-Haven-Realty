import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchAllPermits } from '@/lib/permits'

export const metadata: Metadata = {
  title: 'Nashville Builders — NashBuilds',
  description:
    'Every builder active in Nashville new construction, ranked by permit volume, average build cost, and market presence. By House Haven Realty.',
  alternates: { canonical: '/new-builds/builders' },
}

export const revalidate = 21600

interface BuilderProfile {
  slug: string
  name: string
  permitCount: number
  totalValue: number
  avgValue: number
  avgSqft: number
  topZips: string[]
  recentCount: number
  propertyTypes: string[]
  firstPermitDate: string | null
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default async function BuildersPage() {
  const permits = await fetchAllPermits({ days: 365, limit: 2000 })

  // Aggregate by builder
  const builderMap = new Map<string, typeof permits>()
  for (const p of permits) {
    if (!p.contractor || p.contractor.trim().length < 3) continue
    const name = p.contractor.toUpperCase().trim()
    const list = builderMap.get(name) || []
    list.push(p)
    builderMap.set(name, list)
  }

  const builders: BuilderProfile[] = Array.from(builderMap.entries())
    .map(([name, bPermits]) => {
      const withCost = bPermits.filter((p) => p.constructionCost)
      const withSqft = bPermits.filter((p) => p.sqft)
      const zipCounts = new Map<string, number>()
      const typeCounts = new Map<string, number>()
      let earliest: string | null = null

      for (const p of bPermits) {
        if (p.zip) zipCounts.set(p.zip, (zipCounts.get(p.zip) || 0) + 1)
        if (p.propertyType !== 'unknown') typeCounts.set(p.propertyType, (typeCounts.get(p.propertyType) || 0) + 1)
        if (p.dateIssued && (!earliest || p.dateIssued < earliest)) earliest = p.dateIssued
      }

      return {
        slug: slugify(name),
        name,
        permitCount: bPermits.length,
        totalValue: withCost.reduce((s, p) => s + (p.constructionCost || 0), 0),
        avgValue: withCost.length
          ? Math.round(withCost.reduce((s, p) => s + (p.constructionCost || 0), 0) / withCost.length)
          : 0,
        avgSqft: withSqft.length
          ? Math.round(withSqft.reduce((s, p) => s + (p.sqft || 0), 0) / withSqft.length)
          : 0,
        topZips: Array.from(zipCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([z]) => z),
        recentCount: bPermits.filter((p) => p.daysAgo <= 90).length,
        propertyTypes: Array.from(typeCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([t]) => t),
        firstPermitDate: earliest,
      }
    })
    .filter((b) => b.permitCount >= 2) // Only show builders with 2+ permits
    .sort((a, b) => b.permitCount - a.permitCount)

  return (
    <main className="bg-white min-h-screen">
      <section className="bg-black text-white py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <Link href="/new-builds" className="text-xs text-white/50 hover:text-white transition">
            &larr; Back to NashBuilds Map
          </Link>
          <h1 className="font-serif text-4xl lg:text-5xl text-white mt-4">
            Nashville Builders
          </h1>
          <p className="mt-3 text-lg text-white/70 max-w-2xl">
            Every builder active in Nashville new construction over the past 12 months,
            ranked by permit volume. Data from Metro Nashville Codes Department.
          </p>
          <p className="mt-4 text-sm text-white/50">
            {builders.length} builders &middot; {permits.length.toLocaleString()} permits analyzed
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 lg:px-6 py-12">
        <div className="space-y-4">
          {builders.slice(0, 50).map((b, i) => (
            <Link
              key={b.slug}
              href={`/new-builds/builders/${b.slug}`}
              className="block rounded-lg border border-black/5 bg-white p-5 hover:shadow-lg hover:border-black/10 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-househaven-text-muted w-6">
                      #{i + 1}
                    </span>
                    <h2 className="font-serif text-xl text-househaven-navy truncate">
                      {b.name}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-xs text-househaven-text-muted">
                    <span>{b.permitCount} permits</span>
                    {b.avgValue > 0 && (
                      <span>Avg cost: ${b.avgValue.toLocaleString()}</span>
                    )}
                    {b.avgSqft > 0 && (
                      <span>Avg sqft: {b.avgSqft.toLocaleString()}</span>
                    )}
                    {b.recentCount > 0 && (
                      <span className="text-emerald-600">{b.recentCount} in last 90d</span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    {b.topZips.map((z) => (
                      <span key={z} className="px-2 py-0.5 rounded bg-househaven-surface text-[10px] text-househaven-navy font-medium">
                        {z}
                      </span>
                    ))}
                    {b.propertyTypes.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-black/5 text-[10px] text-househaven-text-muted capitalize">
                        {t.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-serif text-2xl text-househaven-navy">
                    ${Math.round(b.totalValue / 1_000_000 * 10) / 10}M
                  </p>
                  <p className="text-[10px] text-househaven-text-muted">total value</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
