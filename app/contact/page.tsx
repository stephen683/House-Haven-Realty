import type { Metadata } from 'next'
import ContactForm from '@/components/forms/ContactForm'

export const metadata: Metadata = {
  title: 'Contact House Haven Realty',
  description:
    'Get in touch with House Haven Realty. Call (615) 624-4766 or send us a message — we respond within one business day.',
}

export default function ContactPage() {
  return (
    <main className="bg-white">
      <section className="bg-househaven-surface py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            Contact
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl text-househaven-navy mt-3">
            Let&rsquo;s talk.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-househaven-text-muted">
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
              href="tel:+16156244766"
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
          <div className="rounded-2xl overflow-hidden border border-black/5">
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

        <div className="lg:col-span-3 rounded-3xl border border-black/5 bg-white p-8 lg:p-10 shadow-sm">
          <h2 className="font-serif text-3xl text-househaven-navy mb-6">
            Send us a message
          </h2>
          <ContactForm source="contact_page" />
        </div>
      </section>
    </main>
  )
}
