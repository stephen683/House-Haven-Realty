import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchAllPermits } from '@/lib/permits'
import { computeSaturationScores } from '@/lib/saturation-score'
import { NASHBUILDS_ZIPS, ZIP_META_MAP } from '@/lib/nashbuilds-zips'
import type { NormalizedPermit } from '@/lib/permits'
import ZipMapEmbed from './ZipMapEmbed'

export const revalidate = 21600

export function generateStaticParams() {
  return NASHBUILDS_ZIPS.map((z) => ({ zip: z.zip }))
}

interface ZipPageProps {
  params: { zip: string }
}

export async function generateMetadata({ params }: ZipPageProps): Promise<Metadata> {
  const meta = ZIP_META_MAP[params.zip]
  if (!meta) return { title: 'ZIP Not Found' }
  return {
    title: `New Construction in ${params.zip} (${meta.name}) — NashBuilds`,
    description: `${meta.name} (${params.zip}) new construction activity: live building permits, saturation score, top builders, and average build costs. By House Haven Realty.`,
    alternates: { canonical: `/new-builds/${params.zip}` },
  }
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

function scoreColor(score: number) {
  if (score >= 80) return 'text-red-600 bg-red-50'
  if (score >= 60) return 'text-orange-600 bg-orange-50'
  if (score >= 40) return 'text-yellow-600 bg-yellow-50'
  if (score >= 20) return 'text-blue-600 bg-blue-50'
  return 'text-gray-600 bg-gray-50'
}

function scoreBg(score: number) {
  if (score >= 80) return 'bg-red-500'
  if (score >= 60) return 'bg-orange-500'
  if (score >= 40) return 'bg-yellow-500'
  if (score >= 20) return 'bg-blue-400'
  return 'bg-gray-400'
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function ZipPage({ params }: ZipPageProps) {
  const meta = ZIP_META_MAP[params.zip]
  if (!meta) notFound()

  const allPermits = await fetchAllPermits({ days: 365, limit: 2000 })
  const scores = computeSaturationScores(allPermits)
  const zipScore = scores.find((s) => s.zip === params.zip)
  const zipPermits = allPermits.filter((p) => p.zip === params.zip)

  // Stats
  const withCost = zipPermits.filter((p) => p.constructionCost)
  const withSqft = zipPermits.filter((p) => p.sqft)
  const totalValue = withCost.reduce((s, p) => s + (p.constructionCost || 0), 0)
  const avgCost = withCost.length ? Math.round(totalValue / withCost.length) : 0
  const avgSqft = withSqft.length
    ? Math.round(withSqft.reduce((s, p) => s + (p.sqft || 0), 0) / withSqft.length)
    : 0
  const recentCount = zipPermits.filter((p) => p.daysAgo <= 30).length
  const residentialCount = zipPermits.filter((p) =>
    ['single_family', 'townhome', 'condo', 'duplex'].includes(p.propertyType),
  ).length

  // Top builders in this ZIP
  const builderMap = new Map<string, NormalizedPermit[]>()
  for (const p of zipPermits) {
    if (!p.contractor || p.contractor.trim().length < 3) continue
    const name = p.contractor.toUpperCase().trim()
    const list = builderMap.get(name) || []
    list.push(p)
    builderMap.set(name, list)
  }
  const topBuilders = Array.from(builderMap.entries())
    .map(([name, permits]) => ({
      name,
      slug: slugify(name),
      count: permits.length,
      totalValue: permits.reduce((s, p) => s + (p.constructionCost || 0), 0),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Property type breakdown
  const typeCounts = new Map<string, number>()
  for (const p of zipPermits) {
    if (p.propertyType !== 'unknown') {
      typeCounts.set(p.propertyType, (typeCounts.get(p.propertyType) || 0) + 1)
    }
  }
  const typeBreakdown = Array.from(typeCounts.entries()).sort((a, b) => b[1] - a[1])

  // Sibling ZIPs (other NashBuilds ZIPs)
  const siblingZips = NASHBUILDS_ZIPS.filter((z) => z.zip !== params.zip)

  // Structured data
  const schemaData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://househavenrealty.com' },
        { '@type': 'ListItem', position: 2, name: 'NashBuilds', item: 'https://househavenrealty.com/new-builds' },
        { '@type': 'ListItem', position: 3, name: `${params.zip} — ${meta.name}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Place',
      name: `${meta.name}, Nashville, TN ${params.zip}`,
      description: `New construction activity in ${meta.name} (${params.zip}), Nashville, Tennessee`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: meta.name,
        addressRegion: 'TN',
        postalCode: params.zip,
        addressCountry: 'US',
      },
      geo: { '@type': 'GeoCoordinates', latitude: meta.lat, longitude: meta.lng },
    },
  ]

  return (
    <main className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Saturation score hero */}
      <section className="bg-black text-white py-14 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="flex items-center gap-2 text-xs text-white/50 mb-4">
            <Link href="/new-builds" className="hover:text-white transition">NashBuilds</Link>
            <span>/</span>
            <span className="text-white/80">{params.zip}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/50">{meta.area}</p>
              <h1 className="font-serif text-4xl lg:text-5xl text-white mt-2">
                New Construction in {params.zip}
              </h1>
              <p className="text-lg text-white/70 mt-2">{meta.name}, Nashville TN</p>
            </div>

            {/* Saturation score badge */}
            {zipScore && (
              <div className={`rounded-lg px-6 py-4 text-center ${scoreColor(zipScore.score)}`}>
                <p className="font-serif text-5xl font-bold">{zipScore.score}</p>
                <p className="text-xs uppercase tracking-wider font-bold mt-1">{zipScore.label}</p>
                <p className="text-[10px] mt-1 opacity-70">Build Saturation Score</p>
              </div>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="font-serif text-2xl text-white">{zipPermits.length}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/50">Permits (12mo)</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="font-serif text-2xl text-white">{residentialCount}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/50">Residential</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="font-serif text-2xl text-white">
                {avgCost > 0 ? `$${Math.round(avgCost / 1000)}K` : '—'}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-white/50">Avg cost</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="font-serif text-2xl text-white">
                {avgSqft > 0 ? avgSqft.toLocaleString() : '—'}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-white/50">Avg sqft</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="font-serif text-2xl text-emerald-400">{recentCount}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/50">Last 30 days</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map embed */}
      <section className="border-b border-black/5">
        <div className="h-[400px] lg:h-[500px]">
          <ZipMapEmbed zip={params.zip} lat={meta.lat} lng={meta.lng} />
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-12 grid lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-10">
          {/* Top builders */}
          <div>
            <h2 className="font-serif text-2xl text-househaven-navy mb-4">
              Top builders in {params.zip}
            </h2>
            {topBuilders.length === 0 ? (
              <p className="text-sm text-househaven-text-muted">No builders identified yet for this ZIP.</p>
            ) : (
              <div className="space-y-3">
                {topBuilders.map((b, i) => (
                  <Link
                    key={b.slug}
                    href={`/new-builds/builders/${b.slug}`}
                    className="flex items-center justify-between p-4 rounded-lg border border-black/5 hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-househaven-text-muted w-5">#{i + 1}</span>
                      <div>
                        <p className="font-medium text-househaven-navy">{b.name}</p>
                        <p className="text-xs text-househaven-text-muted">{b.count} permits in {params.zip}</p>
                      </div>
                    </div>
                    <p className="font-serif text-lg text-househaven-navy">
                      ${Math.round(b.totalValue / 1000).toLocaleString()}K
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Property type breakdown */}
          {typeBreakdown.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl text-househaven-navy mb-4">
                What&rsquo;s being built
              </h2>
              <div className="flex flex-wrap gap-3">
                {typeBreakdown.map(([type, count]) => (
                  <div key={type} className="rounded-lg bg-househaven-surface px-4 py-3 text-center">
                    <p className="font-serif text-xl text-househaven-navy">{count}</p>
                    <p className="text-[10px] uppercase tracking-wider text-househaven-text-muted capitalize">
                      {type.replace(/_/g, ' ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent permits */}
          <div>
            <h2 className="font-serif text-2xl text-househaven-navy mb-4">
              Recent permits
            </h2>
            <div className="space-y-2">
              {zipPermits.slice(0, 10).map((p) => (
                <div key={p.permitNumber} className="rounded-lg border border-black/5 p-3 text-sm">
                  <div className="flex justify-between">
                    <p className="font-medium text-househaven-navy">{p.address || 'Address withheld'}</p>
                    {p.constructionCost && (
                      <p className="font-serif text-househaven-navy">${Math.round(p.constructionCost).toLocaleString()}</p>
                    )}
                  </div>
                  <div className="flex gap-3 mt-1 text-xs text-househaven-text-muted">
                    <span>{formatDate(p.dateIssued)}</span>
                    {p.bedrooms && <span>{p.bedrooms} bed</span>}
                    {p.bathrooms && <span>{p.bathrooms} bath</span>}
                    {p.sqft && <span>{p.sqft.toLocaleString()} sqft</span>}
                    <span className="capitalize">{p.propertyType.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href={`/new-builds?zip=${params.zip}`}
              className="inline-flex items-center mt-4 text-sm font-semibold text-househaven-navy hover:text-househaven-accent transition"
            >
              View all on map →
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* CTA */}
          <div className="rounded-lg bg-black text-white p-6">
            <p className="font-serif text-xl">Interested in new builds in {params.zip}?</p>
            <p className="text-sm text-white/70 mt-2">
              Get alerts when new permits are issued in this ZIP.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center mt-4 px-4 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-househaven-accent transition"
            >
              Set up alerts
            </Link>
          </div>

          {/* Sibling ZIPs */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-househaven-text-muted mb-3">
              Other Nashville ZIPs
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {siblingZips.map((z) => {
                const zScore = scores.find((s) => s.zip === z.zip)
                return (
                  <Link
                    key={z.zip}
                    href={`/new-builds/${z.zip}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-househaven-surface text-xs hover:shadow-sm transition"
                  >
                    {zScore && (
                      <span className={`h-2 w-2 rounded-sm ${scoreBg(zScore.score)}`} />
                    )}
                    <span className="font-medium text-househaven-navy">{z.zip}</span>
                    <span className="text-househaven-text-muted truncate">{z.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <div className="bg-black text-white py-6">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 flex items-center justify-between text-xs">
          <p className="text-white/50">
            House Haven Realty &middot; (615) 624-4766 &middot; Data: Metro Nashville Codes
          </p>
          <Link href="/new-builds" className="text-white/50 hover:text-white transition">
            &larr; Back to NashBuilds
          </Link>
        </div>
      </div>
    </main>
  )
}
