import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { communities, communityBySlug } from '@/data/communities'
import { learnPosts } from '@/data/learn'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import IDXDisclaimer from '@/components/compliance/IDXDisclaimer'
import NeighborhoodMetrics from '@/components/communities/NeighborhoodMetrics'
import NeighborhoodRental from '@/components/communities/NeighborhoodRental'
import NeighborhoodPipeline from '@/components/communities/NeighborhoodPipeline'
import NeighborhoodAdvisoryCTAs from '@/components/communities/NeighborhoodAdvisoryCTAs'

// Hero images by county — Nashville/TN landscape photography.
const countyHeroImages: Record<string, string> = {
  Davidson: 'https://images.unsplash.com/photo-1545419913-775543f3d8b4?auto=format&fit=crop&w=1440&q=70',
  Sumner: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1440&q=70',
  Robertson: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1440&q=70',
  Cheatham: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1440&q=70',
  Dickson: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1440&q=70',
  Williamson: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1440&q=70',
  Wilson: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1440&q=70',
  Rutherford: 'https://images.unsplash.com/photo-1605276373954-0c4a0dac5b12?auto=format&fit=crop&w=1440&q=70',
  Maury: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1440&q=70',
  'Davidson/Sumner':
    'https://images.unsplash.com/photo-1545419913-775543f3d8b4?auto=format&fit=crop&w=1440&q=70',
  'Williamson/Maury':
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1440&q=70',
}
const defaultHero =
  'https://images.unsplash.com/photo-1568454537842-d933259bb258?auto=format&fit=crop&w=1440&q=70'

interface CommunityPageProps {
  params: { slug: string }
}

// 7-day ISR keeps RentCast neighborhood-rental queries inside Foundation
// tier (1,000 calls/month). 56 communities × 1 call / 7 days = 8 calls/day.
export const revalidate = 604_800

export function generateStaticParams() {
  return communities.map((c) => ({ slug: c.slug }))
}

export function generateMetadata({ params }: CommunityPageProps): Metadata {
  const c = communityBySlug[params.slug]
  if (!c) return { title: 'Community Not Found' }
  return {
    title: `${c.name}, TN — Homes & Market Data`,
    description: c.metaDescription,
    alternates: { canonical: `/communities/${c.slug}` },
  }
}

export default function CommunityPage({ params }: CommunityPageProps) {
  const c = communityBySlug[params.slug]
  if (!c) notFound()

  const nearby = c.nearby
    .map((slug) => communityBySlug[slug])
    .filter(Boolean)
    .slice(0, 3)

  // Tier 1 = full editorial; Tier 2 = first 3 sections; Tier 3 = first 1
  const editorialSections =
    c.tier === 1 ? c.content : c.tier === 2 ? c.content.slice(0, 3) : c.content.slice(0, 1)

  const relatedPosts = learnPosts
    .filter((p) => p.relatedCommunitySlugs?.includes(c.slug))
    .slice(0, 3)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: `${c.name}, Tennessee`,
    description: c.metaDescription,
    address: {
      '@type': 'PostalAddress',
      addressLocality: c.name,
      addressRegion: 'TN',
      postalCode: c.zips[0],
      addressCountry: 'US',
    },
    geo: { '@type': 'GeoCoordinates', latitude: c.lat, longitude: c.lng },
  }

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Communities', href: '/communities' },
          { label: c.name },
        ]}
        className="max-w-5xl mx-auto px-4 lg:px-6 pt-8"
      />

      {/* Section 1 — Hero */}
      <section className="relative bg-househaven-navy text-white overflow-hidden">
        <Image
          src={countyHeroImages[c.county] || defaultHero}
          alt={`${c.name}, Tennessee landscape`}
          fill
          priority
          className="object-cover opacity-30"
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-househaven-navy/40 via-househaven-navy/70 to-househaven-navy" />
        <div className="relative max-w-5xl mx-auto px-4 lg:px-6 pt-20 pb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">
            {c.county} County · {c.zips.join(', ')}
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mt-3">
            {c.name}, Tennessee
          </h1>
          <p className="mt-4 text-xl text-white/80">{c.tagline}</p>
          <p className="mt-6 text-sm text-white/80">
            {c.distanceFromNashville} · Updated{' '}
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href={`/homes-for-sale?city=${encodeURIComponent(c.name)}`}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-househaven-navy font-semibold hover:bg-househaven-accent transition text-sm"
            >
              Search {c.name} homes
            </Link>
            <Link
              href="/value"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white/30 text-white font-semibold hover:bg-white/10 transition text-sm"
            >
              What&rsquo;s my home worth?
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2 — What's different about buying or selling here */}
      {editorialSections.length > 0 && (
        <article className="max-w-3xl mx-auto px-4 lg:px-6 py-16 space-y-10 text-househaven-text leading-relaxed">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
              What&rsquo;s different about buying or selling here
            </p>
          </div>
          {editorialSections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-serif text-2xl lg:text-3xl text-househaven-navy">
                {section.heading}
              </h2>
              <p className="mt-4 text-lg">{section.body}</p>
            </section>
          ))}
        </article>
      )}

      {/* Section 3 — Sale market data (Realtracs IDX, awaits MLS Grid) */}
      <NeighborhoodMetrics communityName={c.name} zips={c.zips} />

      {/* Section 4 — Rental market (RentCast) */}
      <NeighborhoodRental communityName={c.name} zips={c.zips} />

      {/* Section 5 — Pipeline data scoped to neighborhood ZIPs */}
      <NeighborhoodPipeline communityName={c.name} zips={c.zips} />

      {/* Section 6 — Active homes for sale (IDX feed scoped to neighborhood) */}
      <section className="bg-househaven-surface py-16">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
                Current listings
              </p>
              <h2 className="font-serif text-3xl text-househaven-navy mt-2">
                Homes for sale in {c.name}
              </h2>
            </div>
            <Link
              href={`/homes-for-sale?city=${encodeURIComponent(c.name)}`}
              className="text-sm font-semibold text-househaven-navy hover:underline"
            >
              Search all {c.name} homes →
            </Link>
          </div>
          <div className="rounded-lg border border-dashed border-black/10 bg-white p-10 text-center text-househaven-text-muted">
            <p>
              Live MLS listings for {c.name} activate when the Realtracs IDX feed lands.
              Meanwhile, reach out and we&rsquo;ll send hand-picked active listings the same
              day.
            </p>
          </div>
          <div className="mt-6">
            <IDXDisclaimer />
          </div>
        </div>
      </section>

      {/* Sections 7 + 8 — Advisory CTAs (FSBO + Sell-or-Rent) */}
      <NeighborhoodAdvisoryCTAs communityName={c.name} />

      {/* Section 9 — Related neighborhoods + Articles */}
      {(nearby.length > 0 || relatedPosts.length > 0) && (
        <section className="max-w-5xl mx-auto px-4 lg:px-6 py-16 space-y-12">
          {nearby.length > 0 && (
            <div>
              <h2 className="font-serif text-3xl text-househaven-navy mb-6">
                Three nearby communities
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {nearby.map((n) => (
                  <Link
                    key={n.slug}
                    href={`/communities/${n.slug}`}
                    className="rounded-xl border border-black/10 bg-white p-5 hover:bg-househaven-surface transition"
                  >
                    <p className="font-serif text-xl text-househaven-navy">{n.name}</p>
                    <p className="text-xs text-househaven-text-muted mt-1">{n.county} County</p>
                    <p className="text-sm text-househaven-text-muted mt-3 line-clamp-2">
                      {n.tagline}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {relatedPosts.length > 0 && (
            <div>
              <h2 className="font-serif text-3xl text-househaven-navy mb-6">
                Articles about {c.name}
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {relatedPosts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/learn/${p.slug}`}
                    className="block rounded-lg border border-black/10 bg-white p-5 hover:shadow-lg transition"
                  >
                    <p className="text-xs uppercase tracking-wider text-househaven-text-muted">
                      {p.category}
                    </p>
                    <p className="font-serif text-lg text-househaven-navy mt-2 leading-tight">
                      {p.title}
                    </p>
                    <p className="text-xs text-househaven-text-muted mt-3">
                      {p.readTimeMinutes} min read
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Section 10 — Bottom CTA: personalized read */}
      <section className="bg-black text-white py-20">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">
            Need a personalized read on {c.name}?
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl text-white mt-3 leading-snug">
            Looking for a personalized read on whether {c.name} is right for your situation?
          </h2>
          <p className="mt-6 text-base lg:text-lg text-white/75 leading-relaxed">
            Book an HHR Advisory consult. One hour with a Nashville broker, written Decision
            Brief in 48 hours, $200 flat. The fee is for the advice, not for a transaction.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/advisory"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-househaven-accent transition text-sm"
            >
              See HHR Advisory
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white/30 text-white font-semibold hover:bg-white/10 transition text-sm"
            >
              Or just call us
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
