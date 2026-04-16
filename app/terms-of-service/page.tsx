import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of service governing use of the House Haven Realty website, including property data, lead submissions, and general website use.',
  alternates: { canonical: '/terms-of-service' },
}

export default function TermsPage() {
  return (
    <main className="bg-white">
      <section className="relative bg-househaven-navy text-white overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=70" alt="" fill priority className="object-cover opacity-20" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-househaven-navy/50 via-househaven-navy/75 to-househaven-navy" />
        <div className="relative max-w-5xl mx-auto px-4 lg:px-6 py-24 lg:py-32 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">Legal</p>
          <h1 className="font-serif text-4xl lg:text-5xl text-white mt-2">
            Terms of Service
          </h1>
          <p className="text-sm text-white/70 mt-2">
            Last updated:{' '}
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 lg:px-6 py-16 lg:py-24">

        <div className="text-househaven-text leading-relaxed space-y-6">
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your use of{' '}
            <strong>househavenrealty.com</strong> (the &ldquo;Site&rdquo;) and any services
            provided by House Haven Realty, a Tennessee real estate firm licensed by the
            Tennessee Real Estate Commission (&ldquo;House Haven,&rdquo; &ldquo;we,&rdquo;
            or &ldquo;us&rdquo;). By accessing or using the Site you agree to these Terms.
            If you do not agree, please do not use the Site.
          </p>

          <h2 className="font-serif text-2xl text-househaven-navy">Use of the Site</h2>
          <p>
            The Site is provided for informational purposes only. Nothing on the Site
            constitutes legal, financial, tax, or investment advice. Real estate
            transactions are regulated at the state and federal level — we strongly
            recommend consulting a licensed REALTOR®, attorney, and lender before making
            any purchase, sale, or investment decision.
          </p>

          <h2 className="font-serif text-2xl text-househaven-navy">Property listings & MLS data</h2>
          <p>
            Property listings displayed on this Site may include IDX data provided by
            the Realtracs MLS. Information is deemed reliable but not guaranteed and is
            subject to change at any time. Some or all listings displayed may not belong
            to House Haven Realty. Prices, availability, and property details are
            provided by the listing broker and should be independently verified.
          </p>

          <h2 className="font-serif text-2xl text-househaven-navy">Home valuation tool</h2>
          <p>
            Any automated home value estimate provided on the Site is based on public
            records and general market data. It is <strong>not</strong> an appraisal,
            should not be relied upon as one, and should not be used for lending,
            insurance, or tax purposes. For an accurate assessment of a property&rsquo;s
            market value, request a free Comparative Market Analysis (CMA) prepared by a
            licensed House Haven REALTOR®.
          </p>

          <h2 className="font-serif text-2xl text-househaven-navy">Lead capture & contact consent</h2>
          <p>
            By submitting any form on the Site and acknowledging the TCPA consent
            language, you agree that House Haven Realty may contact you by phone, text,
            and email regarding your inquiry, including via automated means. Message and
            data rates may apply. Consent is not a condition of any purchase. You may
            opt out at any time by replying &ldquo;STOP&rdquo; to texts, clicking
            unsubscribe in emails, or emailing us directly.
          </p>

          <h2 className="font-serif text-2xl text-househaven-navy">Fair Housing</h2>
          <p>
            House Haven Realty is pledged to the letter and spirit of U.S. policy for the
            achievement of equal housing opportunity throughout the nation. We do not
            discriminate on the basis of race, color, religion, sex, national origin,
            familial status, or disability, and we will not knowingly facilitate any
            transaction that violates the Fair Housing Act.
          </p>

          <h2 className="font-serif text-2xl text-househaven-navy">Intellectual property</h2>
          <p>
            All content on the Site — including text, images, branding, and structured
            data — is owned by House Haven Realty or its licensors and is protected by
            U.S. copyright and trademark law. You may not reproduce, republish, or
            commercially redistribute Site content without written permission, except for
            personal non-commercial use.
          </p>

          <h2 className="font-serif text-2xl text-househaven-navy">Disclaimer</h2>
          <p>
            The Site is provided &ldquo;as is&rdquo; without warranties of any kind. To
            the fullest extent permitted by law, House Haven Realty disclaims all
            warranties, express or implied, including warranties of merchantability,
            fitness for a particular purpose, and non-infringement. House Haven Realty is
            not liable for any indirect, incidental, special, consequential, or punitive
            damages arising from your use of the Site.
          </p>

          <h2 className="font-serif text-2xl text-househaven-navy">Governing law</h2>
          <p>
            These Terms are governed by the laws of the State of Tennessee, without
            regard to its conflict of laws principles. Any dispute arising out of these
            Terms or your use of the Site will be resolved in the state or federal
            courts located in Davidson County, Tennessee.
          </p>

          <h2 className="font-serif text-2xl text-househaven-navy">Contact</h2>
          <p>
            House Haven Realty
            <br />
            5016 Centennial Blvd Suite 200, Nashville, TN 37209
            <br />
            (615) 624-4766
            <br />
            Stephen@househavenrealty.com
          </p>
        </div>
      </section>
    </main>
  )
}
