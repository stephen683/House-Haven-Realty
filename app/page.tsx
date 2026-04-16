import Image from 'next/image'
import Link from 'next/link'
import FadeIn from '@/components/ui/FadeIn'
import TestimonialCarousel from '@/components/sections/TestimonialCarousel'
import NewsletterSignup from '@/components/forms/NewsletterSignup'
import AgentCard from '@/components/team/AgentCard'
import IDXDisclaimer from '@/components/compliance/IDXDisclaimer'
import { visibleTeam } from '@/data/team'
import { communities } from '@/data/communities'

const heroStats = [
  { value: '219+', label: 'Homes closed' },
  { value: '$124M+', label: 'Volume sold' },
  { value: 'Since 2016', label: 'Licensed in TN' },
  { value: '40 mi', label: 'Radius we cover' },
]

const featuredPlaceholderListings = [
  {
    id: 'ph-1',
    image:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=70',
    address: 'Coming soon · East Nashville',
    price: '$749,000',
    beds: 4,
    baths: 3,
    sqft: 2450,
  },
  {
    id: 'ph-2',
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=70',
    address: 'Coming soon · Franklin',
    price: '$1,150,000',
    beds: 5,
    baths: 4,
    sqft: 3600,
  },
  {
    id: 'ph-3',
    image:
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=70',
    address: 'Coming soon · Germantown',
    price: '$879,000',
    beds: 3,
    baths: 2,
    sqft: 1980,
  },
  {
    id: 'ph-4',
    image:
      'https://images.unsplash.com/photo-1605276373954-0c4a0dac5b12?auto=format&fit=crop&w=1200&q=70',
    address: 'Coming soon · Thompsons Station',
    price: '$625,000',
    beds: 4,
    baths: 3,
    sqft: 2780,
  },
  {
    id: 'ph-5',
    image:
      'https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=1200&q=70',
    address: 'Coming soon · Joelton',
    price: '$515,000',
    beds: 3,
    baths: 2,
    sqft: 1840,
  },
  {
    id: 'ph-6',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=70',
    address: 'Coming soon · Brentwood',
    price: '$1,495,000',
    beds: 5,
    baths: 4,
    sqft: 4100,
  },
]

export default function HomePage() {
  const homepageTeam = visibleTeam.slice(0, 4)
  const homepageCommunities = communities.slice(0, 5)

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-househaven-navy text-white overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1568454537842-d933259bb258?auto=format&fit=crop&w=2400&q=70"
          alt=""
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-househaven-navy/60 via-househaven-navy/80 to-househaven-navy" />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-24 lg:py-36">
          <p className="text-xs uppercase tracking-[0.24em] text-househaven-accent mb-4">
            House Haven Realty · Nashville, TN
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] max-w-3xl">
            Your Nashville neighbor in real estate.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/80">
            Helping families buy, sell, and invest across Nashville and Middle Tennessee
            since 2016. A boutique brokerage with a 40-mile neighborhood map and the
            receipts to match.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/homes-for-sale"
              className="inline-flex items-center justify-center px-7 py-4 rounded-full bg-househaven-accent text-househaven-navy font-semibold hover:bg-white transition"
            >
              Find Your Home
            </Link>
            <Link
              href="/home-valuation"
              className="inline-flex items-center justify-center px-7 py-4 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition"
            >
              What&rsquo;s My Home Worth?
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
            {heroStats.map((s) => (
              <div key={s.label}>
                <p className="font-serif text-3xl lg:text-4xl text-white">{s.value}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-white/60 mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <FadeIn>
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
                Featured
              </p>
              <h2 className="font-serif text-4xl lg:text-5xl text-househaven-navy mt-2">
                Homes on our radar
              </h2>
              <p className="text-househaven-text-muted mt-2 max-w-xl">
                A curated look at what&rsquo;s active across the metro. Live MLS integration
                lands with our Phase 3 IDX launch — these cards are placeholders from our
                current pipeline.
              </p>
            </div>
            <Link
              href="/homes-for-sale"
              className="text-sm font-semibold text-househaven-navy hover:text-househaven-accent"
            >
              Search all homes →
            </Link>
          </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPlaceholderListings.map((l) => (
              <article
                key={l.id}
                className="group rounded-2xl overflow-hidden border border-black/5 hover:shadow-xl transition"
              >
                <div className="relative aspect-[4/3] bg-househaven-surface overflow-hidden">
                  <Image
                    src={l.image}
                    alt={l.address}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <p className="font-serif text-2xl text-househaven-navy">{l.price}</p>
                  <p className="text-sm text-househaven-text mt-1">{l.address}</p>
                  <p className="text-xs text-househaven-text-muted mt-3">
                    {l.beds} bd · {l.baths} ba · {l.sqft.toLocaleString()} sq ft
                  </p>
                  <p className="text-[11px] text-househaven-text-muted mt-3">
                    Listed by House Haven Realty
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 mt-10">
          <IDXDisclaimer />
        </div>
      </section>

      {/* Communities */}
      <section className="bg-househaven-surface py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
              40-mile radius
            </p>
            <h2 className="font-serif text-4xl lg:text-5xl text-househaven-navy mt-2">
              Explore our communities
            </h2>
            <p className="text-househaven-text-muted mt-3">
              From urban Nashville neighborhoods to peaceful Middle Tennessee towns —
              we&rsquo;re your local experts everywhere within 40 miles of downtown.
            </p>
          </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {homepageCommunities.map((c) => (
              <Link
                key={c.slug}
                href={`/communities/${c.slug}`}
                className="group relative block rounded-2xl overflow-hidden bg-white border border-black/5 hover:shadow-xl transition p-6"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
                  {c.county} County
                </p>
                <p className="font-serif text-2xl text-househaven-navy mt-2">{c.name}</p>
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

          <div className="text-center mt-10">
            <Link
              href="/communities"
              className="inline-flex items-center px-6 py-3 rounded-full border border-househaven-navy/20 text-househaven-navy font-semibold hover:bg-househaven-navy hover:text-white transition"
            >
              View all communities
            </Link>
          </div>
        </div>
      </section>

      {/* New Construction teaser */}
      <section className="bg-white py-20 lg:py-28">
        <FadeIn>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
              Exclusive tool
            </p>
            <h2 className="font-serif text-4xl lg:text-5xl text-househaven-navy mt-2">
              See what&rsquo;s being built
              <br />
              before it hits the market.
            </h2>
            <p className="mt-4 text-househaven-text-muted max-w-md">
              Our New Construction Map pulls every active residential building permit across
              the Nashville metro. It&rsquo;s the kind of intel no other Nashville real estate
              team publishes — and we built it for you.
            </p>
            <Link
              href="/new-construction"
              className="inline-flex items-center mt-8 px-7 py-4 rounded-full bg-househaven-navy text-white font-semibold hover:bg-househaven-navy-light transition"
            >
              Explore the map
            </Link>
          </div>
          <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-househaven-navy to-househaven-navy-light p-1">
            <div className="relative h-full w-full rounded-[22px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=70"
                alt="New construction homes in Nashville"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
        </FadeIn>
      </section>

      {/* Testimonials */}
      <section className="bg-househaven-surface py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <FadeIn>
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
              What clients say
            </p>
            <h2 className="font-serif text-4xl lg:text-5xl text-househaven-navy mt-2">
              Clients become friends.
            </h2>
          </div>
          </FadeIn>
          <TestimonialCarousel />
        </div>
      </section>

      {/* Meet the team */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
                Meet House Haven
              </p>
              <h2 className="font-serif text-4xl lg:text-5xl text-househaven-navy mt-2">
                A boutique team, by design.
              </h2>
            </div>
            <Link
              href="/team"
              className="text-sm font-semibold text-househaven-navy hover:text-househaven-accent"
            >
              Meet the full team →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {homepageTeam.map((agent) => (
              <AgentCard key={agent.slug} agent={agent} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-househaven-navy text-white py-20 lg:py-28">
        <div className="max-w-3xl mx-auto text-center px-4 lg:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            Stay in the know
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl text-white mt-2">
            Nashville, delivered monthly.
          </h2>
          <p className="text-white/70 mt-3">
            Market updates, new listings, and insider tips — the good stuff only.
          </p>
          <div className="mt-8">
            <NewsletterSignup />
          </div>
        </div>
      </section>
    </main>
  )
}
