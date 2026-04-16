import type { Metadata } from 'next'
import Link from 'next/link'
import { communities } from '@/data/communities'

export const metadata: Metadata = {
  title: 'Nashville & Middle Tennessee Communities',
  description:
    'Explore every neighborhood, suburb, and small town within 40 miles of Nashville. Homes, schools, commute times, and lifestyle guides from House Haven Realty.',
}

export default function CommunitiesIndexPage() {
  const byCounty = communities.reduce<Record<string, typeof communities>>(
    (acc, c) => {
      acc[c.county] = acc[c.county] || []
      acc[c.county].push(c)
      return acc
    },
    {},
  )

  return (
    <main className="bg-white">
      <section className="bg-househaven-surface py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            Communities
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl text-househaven-navy mt-3">
            Middle Tennessee,
            <br />
            neighborhood by neighborhood.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-househaven-text-muted">
            We build a real guide for every community we serve — so when you&rsquo;re
            trying to decide between Joelton and Ashland City, or Thompsons Station and
            Spring Hill, you have real answers, not filler.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-20 lg:py-24 space-y-16">
        {Object.entries(byCounty).map(([county, list]) => (
          <div key={county}>
            <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
                  County
                </p>
                <h2 className="font-serif text-3xl text-househaven-navy mt-1">
                  {county} County
                </h2>
              </div>
              <p className="text-sm text-househaven-text-muted">
                {list.length} community guide{list.length === 1 ? '' : 's'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((c) => (
                <Link
                  key={c.slug}
                  href={`/communities/${c.slug}`}
                  className="group block rounded-2xl border border-black/5 bg-white p-6 hover:shadow-xl transition"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
                    {c.zips.join(', ')}
                  </p>
                  <p className="font-serif text-2xl text-househaven-navy mt-2">
                    {c.name}
                  </p>
                  <p className="text-sm text-househaven-text-muted mt-2">{c.tagline}</p>
                  <p className="text-xs text-househaven-text-muted mt-4">
                    {c.distanceFromNashville}
                  </p>
                  <span className="inline-flex mt-5 text-sm font-semibold text-househaven-navy group-hover:text-househaven-accent">
                    Explore {c.name} →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className="rounded-3xl bg-househaven-surface border border-black/5 p-8 text-center">
          <p className="font-serif text-2xl text-househaven-navy">
            More communities on the way.
          </p>
          <p className="text-househaven-text-muted mt-2 max-w-xl mx-auto">
            We&rsquo;re publishing a guide for every neighborhood inside a 40-mile radius
            of Nashville — 65+ total. If there&rsquo;s a town you want us to cover next,
            tell us.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center mt-6 px-6 py-3 rounded-full bg-househaven-navy text-white font-semibold hover:bg-househaven-navy-light transition"
          >
            Suggest a community
          </Link>
        </div>
      </section>
    </main>
  )
}
