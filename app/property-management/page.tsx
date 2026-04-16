import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Property Management — Door Collectors',
  description:
    'Looking to invest in Nashville rental property or need management for your existing rentals? House Haven Realty&rsquo;s sister company Door Collectors handles it all.',
  alternates: { canonical: '/property-management' },
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Nashville Property Management',
  description: 'Professional property management services for Nashville rental property owners, provided by Door Collectors — a sister company of House Haven Realty.',
  provider: {
    '@type': 'RealEstateAgent',
    name: 'House Haven Realty',
    url: 'https://househavenrealty.com',
  },
  areaServed: {
    '@type': 'City',
    name: 'Nashville',
    addressRegion: 'TN',
  },
  serviceType: 'Property Management',
}

export default function PropertyManagementPage() {
  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <section className="relative bg-househaven-navy text-white overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1440&q=70" alt="" fill priority className="object-cover opacity-20" sizes="(max-width: 1280px) 100vw, 1280px" />
        <div className="absolute inset-0 bg-gradient-to-b from-househaven-navy/50 via-househaven-navy/75 to-househaven-navy" />
        <div className="relative max-w-5xl mx-auto px-4 lg:px-6 py-24 lg:py-32 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            Property management
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mt-3">
            Meet our sister company,
            <br />
            Door Collectors.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-white/70">
            Whether you&rsquo;re looking to invest in Nashville rental property or need
            management for your current rentals, our sister company Door Collectors
            handles it all — tenant placement, leasing, maintenance coordination, and
            monthly reporting.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <a
              href="https://doorcollectors.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-7 py-4 rounded-lg bg-househaven-accent text-househaven-navy font-semibold hover:bg-white transition"
            >
              Visit Door Collectors
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center px-7 py-4 rounded-lg border border-white/30 text-white font-semibold hover:bg-white hover:text-househaven-navy transition"
            >
              Talk to House Haven first
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 lg:px-6 py-20 lg:py-24 space-y-8 text-househaven-text leading-relaxed text-lg">
        <h2 className="font-serif text-3xl text-househaven-navy">
          Buy with House Haven. Hold with Door Collectors.
        </h2>
        <p>
          A lot of our clients aren&rsquo;t looking for a primary home — they&rsquo;re
          looking for cash flow, equity, and a long-term Middle Tennessee footprint. When
          the deal is closed, they still need someone to screen tenants, enforce leases,
          handle the 2am water heater call, and keep accounting clean for tax season.
        </p>
        <p>
          That&rsquo;s why Stephen co-founded Door Collectors. It&rsquo;s a small,
          full-service Nashville property management company that holds itself to the
          same standard as House Haven Realty — real responsiveness, real reporting, no
          corner-cutting.
        </p>
        <p>
          If you&rsquo;re thinking about your first investment property or you have a
          portfolio of rentals that could be running better, the two teams work together
          to make it seamless.
        </p>
      </section>
    </main>
  )
}
