import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchAllPermits } from '@/lib/permits'
import { computeSaturationScores } from '@/lib/saturation-score'
import { PIPELINE_ZIPS, ZIP_META_MAP } from '@/lib/pipeline-zips'

export const revalidate = 21600

export function generateStaticParams() {
  return PIPELINE_ZIPS.map((z) => ({ zip: z.zip }))
}

interface MarketReportPageProps {
  params: { zip: string }
}

export async function generateMetadata({ params }: MarketReportPageProps): Promise<Metadata> {
  const meta = ZIP_META_MAP[params.zip]
  if (!meta) return { title: 'Not Found' }
  return {
    title: `${params.zip} ${meta.name} Market Report — Nashville Real Estate`,
    description: `Nashville ${params.zip} (${meta.name}) real estate market report: new construction pipeline, average build cost, saturation score, and builder activity. By House Haven Realty.`,
    alternates: { canonical: `/market-reports/${params.zip}` },
  }
}

function formatCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1000) return `$${Math.round(n / 1000)}K`
  return `$${n}`
}

export default async function MarketReportZipPage({ params }: MarketReportPageProps) {
  const meta = ZIP_META_MAP[params.zip]
  if (!meta) notFound()

  const allPermits = await fetchAllPermits({ days: 365, limit: 2000 })
  const scores = computeSaturationScores(allPermits)
  const zipScore = scores.find((s) => s.zip === params.zip)
  const zipPermits = allPermits.filter((p) => p.zip === params.zip)

  // Monthly trend (last 6 months)
  const monthlyTrend: { month: string; count: number; value: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const month = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    const startMs = new Date(d.getFullYear(), d.getMonth(), 1).getTime()
    const endMs = new Date(d.getFullYear(), d.getMonth() + 1, 0).getTime()
    const monthPermits = zipPermits.filter((p) => {
      if (!p.dateIssued) return false
      const ts = new Date(p.dateIssued).getTime()
      return ts >= startMs && ts <= endMs
    })
    monthlyTrend.push({
      month,
      count: monthPermits.length,
      value: monthPermits.reduce((s, p) => s + (p.constructionCost || 0), 0),
    })
  }

  const withCost = zipPermits.filter((p) => p.constructionCost)
  const withSqft = zipPermits.filter((p) => p.sqft)
  const totalValue = withCost.reduce((s, p) => s + (p.constructionCost || 0), 0)
  const avgCost = withCost.length ? Math.round(totalValue / withCost.length) : 0
  const avgSqft = withSqft.length
    ? Math.round(withSqft.reduce((s, p) => s + (p.sqft || 0), 0) / withSqft.length)
    : 0

  const maxMonthCount = Math.max(...monthlyTrend.map((m) => m.count), 1)

  const siblingZips = PIPELINE_ZIPS.filter((z) => z.zip !== params.zip)

  return (
    <main className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-black text-white py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="flex items-center gap-2 text-xs text-white/50 mb-4">
            <Link href="/market-reports" className="hover:text-white transition">Market Reports</Link>
            <span>/</span>
            <span className="text-white/80">{params.zip}</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-white">
            {params.zip} Market Report
          </h1>
          <p className="text-lg text-white/70 mt-2">{meta.name} &middot; {meta.area}</p>
        </div>
      </section>

      {/* Stats grid */}
      <section className="max-w-5xl mx-auto px-4 lg:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg bg-househaven-surface p-4">
            <p className="font-serif text-3xl text-househaven-navy">{zipPermits.length}</p>
            <p className="text-[10px] uppercase tracking-wider text-househaven-text-muted mt-1">Permits (12mo)</p>
          </div>
          <div className="rounded-lg bg-househaven-surface p-4">
            <p className="font-serif text-3xl text-househaven-navy">{formatCurrency(totalValue)}</p>
            <p className="text-[10px] uppercase tracking-wider text-househaven-text-muted mt-1">Total construction</p>
          </div>
          <div className="rounded-lg bg-househaven-surface p-4">
            <p className="font-serif text-3xl text-househaven-navy">{avgCost > 0 ? formatCurrency(avgCost) : '—'}</p>
            <p className="text-[10px] uppercase tracking-wider text-househaven-text-muted mt-1">Avg build cost</p>
          </div>
          <div className="rounded-lg bg-househaven-surface p-4">
            <p className="font-serif text-3xl text-househaven-navy">{avgSqft > 0 ? avgSqft.toLocaleString() : '—'}</p>
            <p className="text-[10px] uppercase tracking-wider text-househaven-text-muted mt-1">Avg sqft</p>
          </div>
        </div>
      </section>

      {/* Monthly trend */}
      <section className="max-w-5xl mx-auto px-4 lg:px-6 pb-10">
        <h2 className="font-serif text-2xl text-househaven-navy mb-4">
          New construction pipeline — 6 month trend
        </h2>
        <div className="flex items-end gap-2 h-40">
          {monthlyTrend.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-househaven-navy">{m.count}</span>
              <div
                className="w-full bg-househaven-navy rounded-t-sm"
                style={{ height: `${Math.max((m.count / maxMonthCount) * 100, 4)}%` }}
              />
              <span className="text-[9px] text-househaven-text-muted">{m.month.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </section>

      {zipScore && (
        <section className="max-w-5xl mx-auto px-4 lg:px-6 pb-10">
          <div className="rounded-lg bg-black text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50">Build Saturation Score</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="font-serif text-4xl font-bold">{zipScore.score}</span>
                <span className="text-sm text-white/70">{zipScore.label}</span>
              </div>
            </div>
            <Link
              href={`/pipeline/${params.zip}`}
              className="px-5 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-househaven-accent transition"
            >
              View on the Nashville Pipeline map →
            </Link>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 lg:px-6 pb-10">
        <div className="rounded-lg border border-black/5 p-6 text-center">
          <p className="font-serif text-2xl text-househaven-navy">
            Want the full market analysis for {params.zip}?
          </p>
          <p className="text-sm text-househaven-text-muted mt-2">
            Our agents prepare detailed CMAs with MLS data, comparable sales, and pricing
            strategy. Free for House Haven clients.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center mt-4 px-6 py-3 rounded-lg bg-househaven-navy text-white font-semibold hover:bg-househaven-navy-light transition"
          >
            Request a market report
          </Link>
        </div>
      </section>

      {/* Other ZIPs */}
      <section className="max-w-5xl mx-auto px-4 lg:px-6 pb-16">
        <h2 className="font-serif text-2xl text-househaven-navy mb-4">Other Nashville ZIPs</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {siblingZips.map((z) => (
            <Link
              key={z.zip}
              href={`/market-reports/${z.zip}`}
              className="px-3 py-2 rounded-lg bg-househaven-surface text-xs text-center hover:shadow-sm transition"
            >
              <span className="font-medium text-househaven-navy">{z.zip}</span>
              <span className="block text-househaven-text-muted truncate">{z.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
