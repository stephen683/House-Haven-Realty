import type { Metadata } from 'next'
import Link from 'next/link'
import HomeSearchForm from '@/components/forms/HomeSearchForm'
import { communities } from '@/data/communities'
import { PLACE_SUGGESTIONS } from '@/lib/place-suggestions'

/**
 * Only a place the site actually knows prefills the form. An unrecognised
 * value is dropped rather than echoed, so the URL cannot be used to put
 * arbitrary text in front of a visitor.
 */
const KNOWN_AREAS = new Set<string>([
  ...PLACE_SUGGESTIONS.map((p) => p.toLowerCase()),
  ...communities.map((c) => c.name.toLowerCase()),
])

/**
 * There is no listing feed, and there will not be one.
 *
 * This page used to branch on an MLS Grid key that never arrived: a listings
 * grid and a Realtracs IDX disclaimer when the feed was live, a concierge
 * layout when it was not. House Haven is not taking a Realtracs feed, so the
 * branch is gone and the concierge layout is the page.
 *
 * That is not a downgrade. This is the highest-converting page on the site —
 * every genuine buyer lead it has ever produced came through the form below,
 * with no listings displayed at any point.
 */

export const metadata: Metadata = {
  title: 'Find Your Next Home in Nashville',
  description:
    'A boutique brokerage approach to Nashville home search. Tell us what you are looking for and our team will hand-pick active listings for you the same day.',
  alternates: { canonical: '/homes-for-sale' },
}

export default async function HomesForSalePage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; city?: string }>
}) {
  const params = await searchParams
  // `city` is the parameter the community pages have always linked with, and
  // it was silently ignored once the feed branch went away. Both are accepted
  // and only prefill a text field, so an arbitrary value is inert.
  const requested = (params.area ?? params.city ?? '').toString().slice(0, 80)
  const defaultArea = KNOWN_AREAS.has(requested.toLowerCase()) ? requested : ''
  const featuredCommunities = communities.filter((c) => c.tier === 1).slice(0, 8)

  return (
    <main className="bg-white">
      <section className="bg-black text-white py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">
            House Haven Realty
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mt-3 leading-[1.05]">
            Find your next home in Nashville.
          </h1>
          <p className="mt-6 text-lg text-white/70 max-w-2xl leading-relaxed">
            We work with every active listing across Middle Tennessee. Tell us what you are
            looking for and our team will pull matches by hand and send them the same day.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 lg:px-6 py-16 lg:py-20">
        <div className="rounded-xl border border-black/5 bg-white p-6 lg:p-10 shadow-sm">
          <h2 className="font-serif text-3xl text-househaven-navy">
            Tell us what you are looking for.
          </h2>
          <p className="mt-3 text-sm text-househaven-text-muted leading-relaxed">
            We read every request personally. Expect a same-day reply from a House Haven
            agent with a curated set of active listings — and notes on what we think will
            fit. Rather talk? Call (615) 624-4766.
          </p>
          <div className="mt-8">
            <HomeSearchForm defaultArea={defaultArea} />
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-househaven-surface p-6 text-sm text-househaven-text-muted leading-relaxed">
          <p className="font-semibold text-househaven-navy">Why we work this way.</p>
          <p className="mt-2">
            Every Nashville buyer already has five search apps. The bottleneck is not more
            listings — it is knowing which ones actually fit. So we listen first, then send
            you the homes that match. New construction, resale, or pre-market — we work
            with all of it.
          </p>
        </div>
      </section>

      <section className="bg-househaven-surface py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
              Browse by area
            </p>
            <h2 className="font-serif text-3xl text-househaven-navy mt-2">
              Explore our communities
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {featuredCommunities.map((c) => (
              <Link
                key={c.slug}
                href={`/communities/${c.slug}`}
                className="block rounded-xl bg-white border border-black/5 p-4 hover:shadow-lg hover:border-househaven-navy/10 transition text-center"
              >
                <p className="font-serif text-lg text-househaven-navy">{c.name}</p>
                <p className="text-xs text-househaven-text-muted mt-1">{c.county} County</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/communities"
              className="text-sm font-semibold text-househaven-navy hover:text-househaven-accent"
            >
              View all {communities.length} communities →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
