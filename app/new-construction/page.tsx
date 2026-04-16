import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchRecentPermits } from '@/lib/permits'
import PermitMap from '@/components/permits/PermitMap'

export const metadata: Metadata = {
  title: 'New Construction Homes in Nashville — Live Permit Map',
  description:
    "See every active residential building permit across the Nashville metro. House Haven Realty's exclusive new construction map pulls live data from Metro Nashville's open data portal.",
}

export const revalidate = 21600 // 6 hours

export default async function NewConstructionPage() {
  const permits = await fetchRecentPermits({ days: 90, limit: 250 })
  const totalCost = permits.reduce(
    (sum, p) => sum + (p.constructionCost || 0),
    0,
  )
  const avgCost = permits.length ? totalCost / permits.length : 0
  const topZips = Object.entries(
    permits.reduce<Record<string, number>>((acc, p) => {
      if (!p.zip) return acc
      acc[p.zip] = (acc[p.zip] || 0) + 1
      return acc
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <main className="bg-white">
      <section className="bg-househaven-navy text-white py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            Exclusive · Nashville metro
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mt-3 leading-[1.05]">
            See what&rsquo;s being built
            <br />
            before it hits the market.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/80">
            We pull every active residential building permit from Metro Nashville&rsquo;s
            open data portal — so you can scout new construction, spot up-and-coming
            streets, and beat the MLS to the punch.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-black/5">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-househaven-accent">
              Permits (last 90 days)
            </p>
            <p className="font-serif text-4xl text-househaven-navy mt-2">
              {permits.length.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-househaven-accent">
              Avg. construction cost
            </p>
            <p className="font-serif text-4xl text-househaven-navy mt-2">
              {avgCost
                ? `$${Math.round(avgCost).toLocaleString()}`
                : '—'}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-xs uppercase tracking-[0.18em] text-househaven-accent">
              Most active ZIPs
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {topZips.length === 0 && (
                <span className="text-sm text-househaven-text-muted">
                  No permit data available right now.
                </span>
              )}
              {topZips.map(([zip, count]) => (
                <span
                  key={zip}
                  className="px-3 py-1.5 rounded-full bg-househaven-surface text-sm font-medium text-househaven-navy"
                >
                  {zip} · {count}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6 pt-16">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
              Interactive map
            </p>
            <h2 className="font-serif text-3xl text-househaven-navy mt-2">
              Every permit, plotted.
            </h2>
          </div>
          <p className="text-xs text-househaven-text-muted">
            Source: Metro Nashville Open Data Portal · Updated every 6 hours
          </p>
        </div>
        <PermitMap permits={permits} />
      </section>

      {/* Permit list */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6 py-16 lg:py-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
              Live data
            </p>
            <h2 className="font-serif text-3xl text-househaven-navy mt-2">
              Recent residential permits
            </h2>
          </div>
        </div>

        {permits.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 bg-househaven-surface p-10 text-center">
            <p className="font-serif text-2xl text-househaven-navy">
              Permit data temporarily unavailable.
            </p>
            <p className="text-househaven-text-muted mt-2 max-w-xl mx-auto">
              Metro Nashville&rsquo;s open data portal is not returning results right now.
              Check back shortly, or reach out and we&rsquo;ll send you the latest report
              directly.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {permits.slice(0, 24).map((p) => (
              <article
                key={p.permitNumber}
                className="rounded-2xl border border-black/5 bg-white p-5 hover:shadow-lg transition"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-househaven-accent">
                  {p.dateIssued
                    ? new Date(p.dateIssued).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Date unknown'}
                </p>
                <p className="font-serif text-lg text-househaven-navy mt-2 leading-tight">
                  {p.address || 'Address withheld'}
                </p>
                <p className="text-xs text-househaven-text-muted mt-1">
                  {p.city || 'Nashville'} · {p.zip}
                </p>
                <p className="text-sm text-househaven-text mt-3 line-clamp-2">
                  {p.description || p.type}
                </p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/5 text-xs">
                  <span className="text-househaven-text-muted">{p.contractor || '—'}</span>
                  <span className="font-semibold text-househaven-navy">
                    {p.constructionCost
                      ? `$${Math.round(p.constructionCost).toLocaleString()}`
                      : ''}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="mt-10 text-xs text-househaven-text-muted">
          Data courtesy of Metro Nashville&rsquo;s open data portal. Information is
          deemed reliable but not guaranteed. Permit status may change between
          publication and delivery.
        </p>
      </section>

      {/* Lead capture */}
      <section className="bg-househaven-surface py-20">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            Stay ahead
          </p>
          <h2 className="font-serif text-4xl text-househaven-navy mt-2">
            Be the first to hear about new construction in your zip.
          </h2>
          <p className="text-househaven-text-muted mt-3">
            Tell us where you&rsquo;re looking and we&rsquo;ll loop you in as permits hit
            in your target neighborhoods.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center mt-8 px-6 py-3 rounded-full bg-househaven-navy text-white font-semibold hover:bg-househaven-navy-light transition"
          >
            Set up permit alerts
          </Link>
        </div>
      </section>
    </main>
  )
}
