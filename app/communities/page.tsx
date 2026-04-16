import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { communities } from '@/data/communities'

export const metadata: Metadata = {
  title: 'Nashville & Middle Tennessee Communities',
  description:
    'Explore every neighborhood, suburb, and small town within 40 miles of Nashville. Homes, schools, commute times, and lifestyle guides from House Haven Realty.',
  alternates: { canonical: '/communities' },
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

  const counties = Object.keys(byCounty).sort()

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="relative bg-househaven-navy text-white overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1545419913-775543f3d8b4?auto=format&fit=crop&w=2400&q=70"
          alt=""
          fill
          priority
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-househaven-navy/50 via-househaven-navy/75 to-househaven-navy" />
        <div className="relative max-w-5xl mx-auto px-4 lg:px-6 py-24 lg:py-32 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            {communities.length} community guides &middot; {counties.length} counties
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mt-3 leading-tight">
            Middle Tennessee,
            <br />
            neighborhood by neighborhood.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-white/70">
            We build a real guide for every community we serve — so when you&rsquo;re
            trying to decide between Joelton and Ashland City, or Thompsons Station and
            Spring Hill, you have real answers, not filler.
          </p>
        </div>
      </section>

      {/* Quick-jump county nav */}
      <section className="border-b border-black/5 bg-white sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 flex gap-3 overflow-x-auto scrollbar-hide">
          {counties.map((county) => (
            <a
              key={county}
              href={`#county-${county.toLowerCase().replace(/[^a-z]/g, '-')}`}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-househaven-surface text-xs font-medium text-househaven-navy hover:bg-househaven-navy hover:text-white transition"
            >
              {county} ({byCounty[county].length})
            </a>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16 lg:py-20 space-y-16">
        {counties.map((county) => {
          const list = byCounty[county]
          return (
            <div
              key={county}
              id={`county-${county.toLowerCase().replace(/[^a-z]/g, '-')}`}
              className="scroll-mt-32"
            >
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {list.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/communities/${c.slug}`}
                    className="group block rounded-lg border border-black/5 bg-white p-6 hover:shadow-xl hover:border-househaven-navy/10 transition"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
                        {c.zips.join(', ')}
                      </p>
                      {c.tier === 1 && (
                        <span className="text-[9px] uppercase tracking-wider font-bold text-househaven-accent bg-househaven-accent/10 px-2 py-0.5 rounded-lg">
                          Core
                        </span>
                      )}
                    </div>
                    <p className="font-serif text-2xl text-househaven-navy mt-2">
                      {c.name}
                    </p>
                    <p className="text-sm text-househaven-text-muted mt-2 line-clamp-2">
                      {c.tagline}
                    </p>
                    <p className="text-xs text-househaven-text-muted mt-4">
                      {c.distanceFromNashville}
                    </p>
                    <span className="inline-flex mt-5 text-sm font-semibold text-househaven-navy group-hover:text-househaven-accent transition">
                      Explore {c.name} →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}

        <div className="rounded-xl bg-househaven-surface border border-black/5 p-8 text-center">
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
            className="inline-flex items-center mt-6 px-6 py-3 rounded-lg bg-househaven-navy text-white font-semibold hover:bg-househaven-navy-light transition"
          >
            Suggest a community
          </Link>
        </div>
      </section>
    </main>
  )
}
