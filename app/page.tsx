import Image from 'next/image'
import Link from 'next/link'
import FadeIn from '@/components/ui/FadeIn'
import TestimonialCarousel from '@/components/sections/TestimonialCarousel'
import NewsletterSignup from '@/components/forms/NewsletterSignup'
import IDXDisclaimer from '@/components/compliance/IDXDisclaimer'
import ListingCard from '@/components/listings/ListingCard'
import { searchListings } from '@/lib/mlsgrid'
import { communities } from '@/data/communities'

const FEATURED_COMMUNITY_SLUGS = [
  'east-nashville',
  'the-nations',
  '12-south',
  'germantown',
  'franklin',
  'brentwood',
  'mt-juliet',
  'hendersonville',
  'sylvan-park',
  'spring-hill',
  'nolensville',
  'thompsons-station',
]

export const revalidate = 900

export default async function HomePage() {
  const { listings: featuredListings, source: listingsSource } = await searchListings({ limit: 8 })

  const featuredCommunities = FEATURED_COMMUNITY_SLUGS
    .map((slug) => communities.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))

  return (
    <main>
      {/* Section 1 — Hero */}
      <section className="bg-white border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-20 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
              House Haven Realty · Nashville, Tennessee
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-househaven-navy mt-4 leading-[1.05]">
              Nashville real estate, for people who want to see the whole picture.
            </h1>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/homes-for-sale"
                className="inline-flex items-center justify-center px-7 py-4 rounded-lg bg-black text-white font-semibold hover:bg-househaven-navy-light transition"
              >
                Browse homes for sale →
              </Link>
              <Link
                href="/value"
                className="inline-flex items-center justify-center px-7 py-4 rounded-lg border border-black/15 text-househaven-navy font-semibold hover:bg-househaven-surface transition"
              >
                What is my home worth? →
              </Link>
            </div>

            <p className="mt-10 text-xs uppercase tracking-[0.16em] text-househaven-text-muted">
              Licensed Tennessee brokerage · 500+ homes closed · $250M+ sold · Nashville-based since 2016
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 — Featured Listings Strip */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
                Featured listings
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl text-househaven-navy mt-2">
                Just listed in Middle Tennessee
              </h2>
            </div>
            <Link
              href="/homes-for-sale"
              className="text-sm font-semibold text-househaven-navy hover:underline"
            >
              See all Nashville homes →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredListings.slice(0, 8).map((l, i) => (
              <ListingCard key={l.mlsId} listing={l} priority={i < 3} />
            ))}
          </div>

          <div className="mt-8">
            <IDXDisclaimer />
          </div>

          {listingsSource === 'mock' && (
            <p className="mt-3 text-xs text-amber-700 bg-amber-50 rounded px-3 py-2">
              Showing sample listings. Live Realtracs data activates the moment our MLS Grid feed is connected.
            </p>
          )}
        </div>
      </section>

      {/* Section 3 — The House Haven Difference */}
      <section className="bg-househaven-surface py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
                The House Haven Difference
              </p>
              <h2 className="font-serif text-4xl lg:text-5xl text-househaven-navy mt-2 leading-tight">
                We built tools most Nashville brokerages don&rsquo;t have, because buying or selling should feel informed, not overwhelming.
              </h2>
            </div>
          </FadeIn>

          <div className="mt-12 grid lg:grid-cols-3 gap-6">
            {/* Pipeline — visually weighted */}
            <Link
              href="/pipeline"
              className="lg:col-span-2 group flex flex-col rounded-xl bg-black text-white overflow-hidden hover:shadow-2xl transition"
            >
              <div className="relative aspect-[16/9] bg-black/80">
                <Image
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1440&q=70"
                  alt="Nashville new construction permit map"
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover opacity-40 group-hover:opacity-50 transition"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">Nashville Pipeline</p>
                  <p className="font-serif text-3xl lg:text-4xl text-white mt-2 leading-tight">
                    See every home being built in Nashville, before it hits the market.
                  </p>
                </div>
              </div>
              <div className="p-6 lg:p-8 flex items-center justify-between gap-4">
                <p className="text-sm text-white/70">
                  Live permit data, builder profiles, saturation scoring by ZIP.
                </p>
                <span className="font-semibold text-white group-hover:translate-x-1 transition">See the map →</span>
              </div>
            </Link>

            {/* Value */}
            <Link
              href="/value"
              className="group flex flex-col rounded-xl bg-white border border-black/10 hover:border-black/20 hover:shadow-xl transition p-6 lg:p-8"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
                House Haven Value
              </p>
              <p className="font-serif text-2xl text-househaven-navy mt-2 leading-tight">
                An honest home valuation in 60 seconds. No signup. No pressure.
              </p>
              <p className="mt-4 text-sm text-househaven-text-muted">
                Real comp data, not a Zestimate guess.
              </p>
              <span className="mt-auto pt-6 font-semibold text-househaven-navy group-hover:translate-x-1 transition">
                Get my estimate →
              </span>
            </Link>

            {/* Journey — Coming Soon */}
            <div className="lg:col-span-3 rounded-xl bg-white border border-dashed border-black/15 p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
                    House Haven Journey
                  </p>
                  <span className="px-2 py-0.5 rounded bg-househaven-surface text-[10px] uppercase tracking-widest text-househaven-text-muted">
                    Coming soon
                  </span>
                </div>
                <p className="font-serif text-2xl text-househaven-navy mt-2 leading-tight">
                  The real Nashville first-time buyer guide. THDA programs, true closing costs, no fluff.
                </p>
              </div>
              <NewsletterSignup compact label="Get notified" />
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 — Nashville Pipeline Preview */}
      <section className="bg-black text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                Nashville Pipeline
              </p>
              <h2 className="font-serif text-4xl lg:text-5xl text-white mt-2 leading-tight">
                Thousands of new homes being built in Nashville right now.
              </h2>
              <p className="mt-4 text-white/70 max-w-md">
                Updated daily from Metro Nashville Codes. Filter by ZIP, builder, beds, and price.
                Set alerts for new permits in your target neighborhood.
              </p>
              <div className="mt-8">
                <Link
                  href="/pipeline"
                  className="inline-flex items-center px-7 py-4 rounded-lg bg-white text-black font-semibold hover:bg-househaven-accent transition"
                >
                  Explore the Pipeline →
                </Link>
              </div>
            </div>
          </FadeIn>
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white/5">
            <Image
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1440&q=70"
              alt="Nashville new construction"
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover opacity-90"
            />
          </div>
        </div>
      </section>

      {/* Section 5 — Communities */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
                Communities
              </p>
              <h2 className="font-serif text-4xl lg:text-5xl text-househaven-navy mt-2">
                Where we work.
              </h2>
            </div>
            <Link
              href="/communities"
              className="text-sm font-semibold text-househaven-navy hover:underline"
            >
              Explore all {communities.length} communities →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredCommunities.map((c) => (
              <Link
                key={c.slug}
                href={`/communities/${c.slug}`}
                className="group block rounded-xl bg-househaven-surface border border-black/5 p-5 hover:bg-white hover:shadow-lg hover:border-black/10 transition"
              >
                <p className="text-[10px] uppercase tracking-[0.16em] text-househaven-text-muted">
                  {c.county} County
                </p>
                <p className="font-serif text-xl text-househaven-navy mt-2">{c.name}</p>
                <p className="text-xs text-househaven-text-muted mt-1 line-clamp-2">{c.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6 — The Stephen Moment */}
      <section className="bg-househaven-surface py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 grid md:grid-cols-5 gap-10 items-center">
          <div className="md:col-span-2">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-white">
              <Image
                src="https://media.agentaprd.com/sites/213/BQXPwDi7x8QXhtLq9sNIHxFrNatzeVTpTA.webp"
                alt="Stephen Delahoussaye, broker/owner of House Haven Realty"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
              From the broker
            </p>
            <p className="font-serif text-2xl lg:text-3xl text-househaven-navy mt-3 leading-snug">
              I&rsquo;m Stephen. I started House Haven in Nashville because I wanted to build a brokerage where buying or selling a home actually feels like someone has your back. We&rsquo;re a team of ten. We&rsquo;ve closed 500+ homes — over $250M in volume — since 2016. We volunteer in our communities once a month. If you want to talk — about buying, selling, or just figuring out what you&rsquo;d even do — call me directly.
            </p>
            <a
              data-event="phone_click"
              href="tel:+16156244766"
              className="inline-flex mt-6 font-serif text-3xl text-househaven-navy hover:underline"
            >
              (615) 624-4766
            </a>
          </div>
        </div>
      </section>

      {/* Section 7 — Testimonials */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
              Clients, in their words
            </p>
            <h2 className="font-serif text-4xl text-househaven-navy mt-2">
              Why people stay with House Haven.
            </h2>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* Section 8 — Newsletter (footer compliance is in site footer) */}
      <section className="bg-black text-white py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">
            Nashville market updates
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl text-white mt-2">
            Get monthly updates on the Nashville market.
          </h2>
          <p className="text-white/70 mt-2 text-sm">
            No spam. Easy to unsubscribe.
          </p>
          <div className="mt-8 max-w-xl mx-auto">
            <NewsletterSignup variant="dark" />
          </div>
        </div>
      </section>
    </main>
  )
}
