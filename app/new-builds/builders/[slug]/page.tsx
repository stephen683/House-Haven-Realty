import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchAllPermits } from '@/lib/permits'
import type { NormalizedPermit } from '@/lib/permits'

export const revalidate = 21600

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

interface BuilderPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: BuilderPageProps): Promise<Metadata> {
  const permits = await fetchAllPermits({ days: 365, limit: 2000 })
  const builderPermits = findBuilderPermits(permits, params.slug)
  const name = builderPermits[0]?.contractor || params.slug

  return {
    title: `${name} — Nashville Builder Profile | NashBuilds`,
    description: `${name} has ${builderPermits.length} building permits in Nashville. View all projects, average build cost, and active zones.`,
  }
}

function findBuilderPermits(permits: NormalizedPermit[], slug: string): NormalizedPermit[] {
  return permits.filter((p) => {
    if (!p.contractor || p.contractor.trim().length < 3) return false
    return slugify(p.contractor.toUpperCase().trim()) === slug
  })
}

export default async function BuilderProfilePage({ params }: BuilderPageProps) {
  const permits = await fetchAllPermits({ days: 365, limit: 2000 })
  const builderPermits = findBuilderPermits(permits, params.slug)

  if (builderPermits.length === 0) notFound()

  const name = builderPermits[0].contractor.toUpperCase().trim()
  const withCost = builderPermits.filter((p) => p.constructionCost)
  const withSqft = builderPermits.filter((p) => p.sqft)
  const totalValue = withCost.reduce((s, p) => s + (p.constructionCost || 0), 0)
  const avgValue = withCost.length ? Math.round(totalValue / withCost.length) : 0
  const avgSqft = withSqft.length
    ? Math.round(withSqft.reduce((s, p) => s + (p.sqft || 0), 0) / withSqft.length)
    : 0
  const recentCount = builderPermits.filter((p) => p.daysAgo <= 90).length

  // ZIP distribution
  const zipCounts = new Map<string, number>()
  const typeCounts = new Map<string, number>()
  let earliest: string | null = null

  for (const p of builderPermits) {
    if (p.zip) zipCounts.set(p.zip, (zipCounts.get(p.zip) || 0) + 1)
    if (p.propertyType !== 'unknown') typeCounts.set(p.propertyType, (typeCounts.get(p.propertyType) || 0) + 1)
    if (p.dateIssued && (!earliest || p.dateIssued < earliest)) earliest = p.dateIssued
  }

  const topZips = Array.from(zipCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const topTypes = Array.from(typeCounts.entries()).sort((a, b) => b[1] - a[1])

  return (
    <main className="bg-white min-h-screen">
      <section className="bg-black text-white py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <Link href="/new-builds/builders" className="text-xs text-white/50 hover:text-white transition">
            &larr; All Builders
          </Link>
          <h1 className="font-serif text-4xl lg:text-5xl text-white mt-4">
            {name}
          </h1>
          <p className="mt-3 text-lg text-white/70">
            Nashville builder profile &middot; {builderPermits.length} permits in the last 12 months
          </p>
        </div>
      </section>

      {/* Stats grid */}
      <section className="max-w-5xl mx-auto px-4 lg:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg bg-househaven-surface p-4">
            <p className="font-serif text-3xl text-househaven-navy">{builderPermits.length}</p>
            <p className="text-[10px] uppercase tracking-wider text-househaven-text-muted mt-1">Permits (12 mo)</p>
          </div>
          <div className="rounded-lg bg-househaven-surface p-4">
            <p className="font-serif text-3xl text-househaven-navy">
              ${Math.round(totalValue / 1_000_000 * 10) / 10}M
            </p>
            <p className="text-[10px] uppercase tracking-wider text-househaven-text-muted mt-1">Total value</p>
          </div>
          <div className="rounded-lg bg-househaven-surface p-4">
            <p className="font-serif text-3xl text-househaven-navy">
              {avgValue > 0 ? `$${Math.round(avgValue / 1000)}K` : '—'}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-househaven-text-muted mt-1">Avg cost</p>
          </div>
          <div className="rounded-lg bg-househaven-surface p-4">
            <p className="font-serif text-3xl text-househaven-navy">
              {avgSqft > 0 ? avgSqft.toLocaleString() : '—'}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-househaven-text-muted mt-1">Avg sqft</p>
          </div>
        </div>

        {/* Reputation signals */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-black/5 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-househaven-text-muted">Active ZIPs</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {topZips.map(([zip, count]) => (
                <span key={zip} className="px-2.5 py-1 rounded-lg bg-househaven-surface text-xs font-medium text-househaven-navy">
                  {zip} ({count})
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-black/5 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-househaven-text-muted">Property types</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {topTypes.map(([type, count]) => (
                <span key={type} className="px-2.5 py-1 rounded-lg bg-black/5 text-xs text-househaven-text-muted capitalize">
                  {type.replace(/_/g, ' ')} ({count})
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-black/5 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-househaven-text-muted">Activity</p>
            <p className="text-sm text-househaven-text mt-2">
              <span className="font-semibold text-emerald-600">{recentCount}</span> permits in last 90 days
            </p>
            {earliest && (
              <p className="text-xs text-househaven-text-muted mt-1">
                Earliest permit: {formatDate(earliest)}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Permit list */}
      <section className="max-w-5xl mx-auto px-4 lg:px-6 pb-16">
        <h2 className="font-serif text-2xl text-househaven-navy mb-6">
          All permits ({builderPermits.length})
        </h2>
        <div className="space-y-3">
          {builderPermits
            .sort((a, b) => (a.dateIssued && b.dateIssued ? (b.dateIssued > a.dateIssued ? 1 : -1) : 0))
            .map((p) => (
            <div
              key={p.permitNumber}
              className="rounded-lg border border-black/5 bg-white p-4 hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-househaven-navy">{p.address || 'Address withheld'}</p>
                  <p className="text-xs text-househaven-text-muted mt-0.5">
                    {p.city} {p.zip} &middot; {formatDate(p.dateIssued)} &middot; #{p.permitNumber}
                  </p>
                  <div className="flex gap-3 mt-2 text-xs">
                    {p.bedrooms && <span>{p.bedrooms} bed</span>}
                    {p.bathrooms && <span>{p.bathrooms} bath</span>}
                    {p.sqft && <span>{p.sqft.toLocaleString()} sqft</span>}
                    {p.propertyType !== 'unknown' && (
                      <span className="text-househaven-text-muted capitalize">
                        {p.propertyType.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {p.constructionCost && (
                    <p className="font-serif text-lg text-househaven-navy">
                      ${Math.round(p.constructionCost).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-12">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center">
          <p className="text-xs uppercase tracking-wider text-white/50">
            Interested in a {name} build?
          </p>
          <h2 className="font-serif text-3xl text-white mt-2">
            We know this builder. Let us help.
          </h2>
          <Link
            href={`/contact?subject=Builder+Inquiry:+${encodeURIComponent(name)}`}
            className="inline-flex items-center mt-6 px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-househaven-accent transition"
          >
            Ask House Haven about {name}
          </Link>
        </div>
      </section>
    </main>
  )
}
