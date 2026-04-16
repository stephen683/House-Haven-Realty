import type { Metadata } from 'next'
import Image from 'next/image'
import ContactForm from '@/components/forms/ContactForm'

export const metadata: Metadata = {
  title: 'Contact House Haven Realty',
  description:
    'Get in touch with House Haven Realty. Call (615) 624-4766 or send us a message — we respond within one business day.',
  alternates: { canonical: '/contact' },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'House Haven Realty',
  telephone: '+1-615-624-4766',
  email: 'Stephen@househavenrealty.com',
  url: 'https://househavenrealty.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '5016 Centennial Blvd Suite 200',
    addressLocality: 'Nashville',
    addressRegion: 'TN',
    postalCode: '37209',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 36.1447,
    longitude: -86.8487,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '10:00',
      closes: '16:00',
    },
  ],
}

export default function ContactPage() {
  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <section className="relative bg-househaven-navy text-white overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1545419913-775543f3d8b4?auto=format&fit=crop&w=2400&q=70"
          alt=""
          fill
          priority
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-househaven-navy/50 via-househaven-navy/75 to-househaven-navy" />
        <div className="relative max-w-5xl mx-auto px-4 lg:px-6 py-24 lg:py-32 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            Contact
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mt-3">
            Let&rsquo;s talk.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-white/70">
            Buying, selling, investing, or just thinking about it — we&rsquo;d love to help
            you figure out what&rsquo;s next.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 lg:px-6 py-20 lg:py-28 grid lg:grid-cols-5 gap-12">
        <aside className="lg:col-span-2 space-y-8 text-househaven-text">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
              Office
            </p>
            <p className="font-serif text-2xl text-househaven-navy mt-2">
              House Haven Realty
            </p>
            <address className="not-italic mt-2 leading-relaxed text-househaven-text-muted">
              5016 Centennial Blvd Suite 200
              <br />
              Nashville, TN 37209
            </address>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
              Phone
            </p>
            <a
              data-event="phone_click" href="tel:+16156244766"
              className="mt-2 block font-serif text-2xl text-househaven-navy hover:text-househaven-accent"
            >
              (615) 624-4766
            </a>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
              Email
            </p>
            <a
              href="mailto:Stephen@househavenrealty.com"
              className="mt-2 block font-serif text-2xl text-househaven-navy hover:text-househaven-accent break-all"
            >
              Stephen@househavenrealty.com
            </a>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
              Follow
            </p>
            <div className="flex gap-4 mt-3 text-sm font-medium">
              <a
                href="https://www.instagram.com/househavenrealty/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-househaven-navy hover:text-househaven-accent"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/stephen.delahoussaye"
                target="_blank"
                rel="noopener noreferrer"
                className="text-househaven-navy hover:text-househaven-accent"
              >
                Facebook
              </a>
              <a
                href="https://www.linkedin.com/company/house-haven-realty-nashville"
                target="_blank"
                rel="noopener noreferrer"
                className="text-househaven-navy hover:text-househaven-accent"
              >
                LinkedIn
              </a>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden border border-black/5">
            <iframe
              title="House Haven Realty office"
              aria-label="Map of the House Haven Realty office"
              src="https://www.google.com/maps?q=5016+Centennial+Blvd+Nashville+TN+37209&output=embed"
              width="100%"
              height="260"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </aside>

        <div className="lg:col-span-3 rounded-xl border border-black/5 bg-white p-8 lg:p-10 shadow-sm">
          <h2 className="font-serif text-3xl text-househaven-navy mb-6">
            Send us a message
          </h2>
          <ContactForm source="contact_page" />
        </div>
      </section>
    </main>
  )
}
