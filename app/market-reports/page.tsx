import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Nashville Market Reports — House Haven Realty',
  description:
    'Monthly Nashville and Middle Tennessee market reports: median price, inventory, days on market, and what it means for buyers and sellers — from House Haven Realty.',
  alternates: { canonical: '/market-reports' },
}

const counties = [
  { name: 'Davidson', median: '—', inventory: '—', dom: '—' },
  { name: 'Sumner', median: '—', inventory: '—', dom: '—' },
  { name: 'Robertson', median: '—', inventory: '—', dom: '—' },
  { name: 'Williamson', median: '—', inventory: '—', dom: '—' },
  { name: 'Wilson', median: '—', inventory: '—', dom: '—' },
  { name: 'Rutherford', median: '—', inventory: '—', dom: '—' },
  { name: 'Dickson', median: '—', inventory: '—', dom: '—' },
  { name: 'Cheatham', median: '—', inventory: '—', dom: '—' },
]

export default function MarketReportsPage() {
  return (
    <main className="bg-white">
      <section className="relative bg-househaven-navy text-white overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1440&q=70" alt="" fill priority className="object-cover opacity-20" sizes="(max-width: 1280px) 100vw, 1280px" />
        <div className="absolute inset-0 bg-gradient-to-b from-househaven-navy/50 via-househaven-navy/75 to-househaven-navy" />
        <div className="relative max-w-5xl mx-auto px-4 lg:px-6 py-24 lg:py-32 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            Market reports
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mt-3">
            Nashville housing,
            <br />
            by the numbers.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-white/70">
            Median sale price, days on market, inventory, and trendlines across Nashville
            and every Middle Tennessee county we serve. Updated monthly.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 lg:px-6 py-20 lg:py-24">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
              This month
            </p>
            <h2 className="font-serif text-3xl text-househaven-navy mt-2">
              County-by-county snapshot
            </h2>
          </div>
          <p className="text-xs text-househaven-text-muted">
            Data source: Realtracs MLS (integration in progress)
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-black/5">
          <table className="w-full text-sm">
            <thead className="bg-househaven-surface">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-househaven-navy">
                  County
                </th>
                <th className="text-left px-6 py-4 font-semibold text-househaven-navy">
                  Median sale price
                </th>
                <th className="text-left px-6 py-4 font-semibold text-househaven-navy">
                  Active inventory
                </th>
                <th className="text-left px-6 py-4 font-semibold text-househaven-navy">
                  Avg. days on market
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {counties.map((c) => (
                <tr key={c.name} className="bg-white">
                  <td className="px-6 py-4 font-medium text-househaven-navy">
                    {c.name}
                  </td>
                  <td className="px-6 py-4 text-househaven-text-muted">{c.median}</td>
                  <td className="px-6 py-4 text-househaven-text-muted">
                    {c.inventory}
                  </td>
                  <td className="px-6 py-4 text-househaven-text-muted">{c.dom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 rounded-xl border border-dashed border-black/10 bg-househaven-surface p-10 text-center">
          <p className="font-serif text-2xl text-househaven-navy">
            Live market data wires in with our MLS integration.
          </p>
          <p className="text-househaven-text-muted mt-3 max-w-xl mx-auto">
            In the meantime, Stephen pulls fresh monthly stats by hand — reach out and
            we&rsquo;ll send you the current report for the counties you care about.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center mt-6 px-6 py-3 rounded-lg bg-househaven-navy text-white font-semibold hover:bg-househaven-navy-light transition"
          >
            Get this month&rsquo;s report
          </Link>
        </div>
      </section>

      <section className="bg-househaven-navy text-white py-20">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            Subscribe
          </p>
          <h2 className="font-serif text-4xl text-white mt-2">
            Get the market report delivered monthly.
          </h2>
          <p className="text-white/70 mt-3">
            One email a month, straight from the team closing deals in these exact
            neighborhoods.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center mt-8 px-6 py-3 rounded-lg bg-househaven-accent text-househaven-navy font-semibold hover:bg-white transition"
          >
            Subscribe to the report
          </Link>
        </div>
      </section>
    </main>
  )
}
