import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { communities, communityBySlug } from '@/data/communities'
import ContactForm from '@/components/forms/ContactForm'
import IDXDisclaimer from '@/components/compliance/IDXDisclaimer'

interface CommunityPageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return communities.map((c) => ({ slug: c.slug }))
}

export function generateMetadata({ params }: CommunityPageProps): Metadata {
  const c = communityBySlug[params.slug]
  if (!c) return { title: 'Community Not Found' }
  return {
    title: `${c.name}, TN — Homes, Lifestyle & Market Guide`,
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
    geo: {
      '@type': 'GeoCoordinates',
      latitude: c.lat,
      longitude: c.lng,
    },
  }

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-5xl mx-auto px-4 lg:px-6 pt-8 text-xs text-househaven-text-muted"
      >
        <ol className="flex gap-2">
          <li>
            <Link href="/" className="hover:text-househaven-navy">
              Home
            </Link>
          </li>
          <li>›</li>
          <li>
            <Link href="/communities" className="hover:text-househaven-navy">
              Communities
            </Link>
          </li>
          <li>›</li>
          <li className="text-househaven-navy">{c.name}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 lg:px-6 pt-8 pb-14">
        <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
          {c.county} County · {c.zips.join(', ')}
        </p>
        <h1 className="font-serif text-5xl lg:text-6xl text-househaven-navy mt-3">
          {c.name}, Tennessee
        </h1>
        <p className="mt-4 text-xl text-househaven-text-muted">{c.tagline}</p>
        <p className="mt-6 text-sm text-househaven-text-muted">
          {c.distanceFromNashville} · Updated {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </section>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 lg:px-6 pb-16 space-y-10 text-househaven-text leading-relaxed">
        {c.content.map((section) => (
          <section key={section.heading}>
            <h2 className="font-serif text-2xl lg:text-3xl text-househaven-navy">
              {section.heading}
            </h2>
            <p className="mt-4 text-lg">{section.body}</p>
          </section>
        ))}
      </article>

      {/* Listings placeholder + IDX compliance */}
      <section className="bg-househaven-surface py-16">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
                Current listings
              </p>
              <h2 className="font-serif text-3xl text-househaven-navy mt-2">
                Homes for sale in {c.name}
              </h2>
            </div>
            <Link
              href={`/homes-for-sale?city=${encodeURIComponent(c.name)}`}
              className="text-sm font-semibold text-househaven-navy hover:text-househaven-accent"
            >
              Search all {c.name} homes →
            </Link>
          </div>
          <div className="rounded-2xl border border-dashed border-black/10 bg-white p-10 text-center text-househaven-text-muted">
            <p>
              Live MLS listings for {c.name} launch with our Phase 3 IDX integration.
              Meanwhile, reach out and we&rsquo;ll send you hand-picked active listings the
              same day.
            </p>
          </div>
          <div className="mt-6">
            <IDXDisclaimer />
          </div>
        </div>
      </section>

      {/* Nearby */}
      {nearby.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 lg:px-6 py-16">
          <h2 className="font-serif text-3xl text-househaven-navy mb-6">
            Nearby communities
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {nearby.map((n) => (
              <Link
                key={n.slug}
                href={`/communities/${n.slug}`}
                className="rounded-xl border border-black/5 bg-white p-4 hover:bg-househaven-surface transition"
              >
                <p className="font-serif text-xl text-househaven-navy">{n.name}</p>
                <p className="text-xs text-househaven-text-muted mt-1">
                  {n.county} County
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Lead capture */}
      <section className="bg-househaven-navy text-white py-20">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
              Let&rsquo;s talk {c.name}
            </p>
            <h2 className="font-serif text-4xl text-white mt-2">
              Interested in {c.name}? Let&rsquo;s find your perfect home.
            </h2>
          </div>
          <div className="bg-white rounded-3xl p-6 lg:p-10">
            <ContactForm source={`community:${c.slug}`} />
          </div>
        </div>
      </section>
    </main>
  )
}
