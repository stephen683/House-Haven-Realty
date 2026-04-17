import type { Metadata } from 'next'
import Link from 'next/link'
import ValueClient from './ValueClient'
import CommissionDisclosure from '@/components/compliance/CommissionDisclosure'

export const metadata: Metadata = {
  title: "What's My Home Worth? Free Nashville Home Valuation | House Haven Realty",
  description:
    "Get an honest estimate of your Nashville home's value in 60 seconds. No signup required. Free, no-obligation home valuations from House Haven Realty — Nashville's boutique brokerage.",
  alternates: { canonical: '/value' },
  openGraph: {
    title: "House Haven Value — an honest home valuation. No signup.",
    description: 'Get an honest estimate of your Nashville home in 60 seconds. By House Haven Realty.',
    url: 'https://househavenrealty.com/value',
    type: 'website',
  },
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'House Haven Value — Free Nashville Home Valuation',
  serviceType: 'Home valuation',
  provider: {
    '@type': 'RealEstateAgent',
    name: 'House Haven Realty',
    url: 'https://househavenrealty.com',
    telephone: '+1-615-624-4766',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '5016 Centennial Blvd Suite 200',
      addressLocality: 'Nashville',
      addressRegion: 'TN',
      postalCode: '37209',
      addressCountry: 'US',
    },
  },
  areaServed: { '@type': 'City', name: 'Nashville', addressRegion: 'TN' },
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function ValuePage() {
  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <section className="bg-black text-white py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">
            House Haven Value
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mt-3 leading-[1.05]">
            What is your Nashville home worth?
          </h1>
          <p className="mt-6 text-lg text-white/70">
            An honest estimate in 60 seconds. No signup. No email wall. No pressure.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 lg:px-6 py-16 lg:py-20">
        <ValueClient />
      </section>

      <section className="max-w-3xl mx-auto px-4 lg:px-6 pb-20">
        <div className="rounded-lg bg-househaven-surface p-6 text-sm text-househaven-text-muted leading-relaxed">
          <p className="font-semibold text-househaven-navy">Why this is different.</p>
          <p className="mt-2">
            Most online valuation tools want your email before they tell you anything. We
            built this the other way around: see your estimate first, and only ask us for the
            full Comparative Market Analysis if you want one. Stephen prepares every CMA
            personally — the same analysis we&rsquo;d prepare for a listing appointment.
          </p>
        </div>

        <div className="mt-6">
          <CommissionDisclosure variant="card" />
        </div>

        <p className="mt-6 text-xs text-househaven-text-muted text-center">
          Need to talk to a person?{' '}
          <Link href="/contact" className="underline hover:text-househaven-navy">
            Reach the team
          </Link>{' '}
          or call (615) 624-4766.
        </p>
      </section>
    </main>
  )
}
