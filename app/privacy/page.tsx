import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How House Haven Realty collects, uses, and protects personal information submitted through our website and lead capture forms.',
}

export default function PrivacyPage() {
  return (
    <main className="bg-white">
      <section className="max-w-3xl mx-auto px-4 lg:px-6 py-16 lg:py-24">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            Legal
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl text-househaven-navy mt-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-househaven-text-muted mt-2">
            Last updated:{' '}
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </header>

        <div className="prose prose-neutral max-w-none text-househaven-text leading-relaxed space-y-6">
          <p>
            House Haven Realty (&ldquo;House Haven,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo;
            or &ldquo;us&rdquo;) respects the privacy of every visitor to{' '}
            <strong>househavenrealty.com</strong>. This policy explains what we collect, how we use
            it, and the choices you have.
          </p>

          <h2 className="font-serif text-2xl text-househaven-navy">Information we collect</h2>
          <p>
            We collect information you provide directly through our website — for example when you
            submit a contact form, request a home valuation, sign up for listing alerts, or schedule
            a showing. That may include your name, email, phone number, property address, buying
            or selling timeline, and any message content you share. We also automatically collect
            standard web analytics (IP address, device, pages viewed) to improve the site.
          </p>

          <h2 className="font-serif text-2xl text-househaven-navy">How we use it</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To respond to your inquiry and provide the real estate services you request.</li>
            <li>To send market updates, listings, and follow-ups related to your request.</li>
            <li>To comply with Tennessee real estate law and our broker&rsquo;s supervisory duties.</li>
            <li>To secure our website and measure its performance.</li>
          </ul>

          <h2 className="font-serif text-2xl text-househaven-navy">Consent to contact (TCPA)</h2>
          <p>
            By submitting a form on this site and checking the consent box, you agree that House
            Haven Realty may contact you by phone, text, and email — including via automated means
            — at the number and email you provide. Consent is not a condition of purchase. You can
            opt out at any time by replying <strong>STOP</strong> to text messages, clicking
            unsubscribe in any email, or contacting us directly at{' '}
            <a
              href="mailto:Stephen@househavenrealty.com"
              className="text-househaven-navy underline"
            >
              Stephen@househavenrealty.com
            </a>
            . Message and data rates may apply. Message frequency may vary.
          </p>

          <h2 className="font-serif text-2xl text-househaven-navy">Sharing</h2>
          <p>
            We do not sell your personal information. We share information only with service
            providers that help us operate the website and respond to your inquiry (for example,
            our email provider, CRM, and MLS data provider), and with licensed House Haven Realty
            agents assisting with your request. We may also disclose information when required by
            law.
          </p>

          <h2 className="font-serif text-2xl text-househaven-navy">Your choices</h2>
          <p>
            You can ask us to access, correct, or delete the personal information we hold about you
            by emailing{' '}
            <a
              href="mailto:Stephen@househavenrealty.com"
              className="text-househaven-navy underline"
            >
              Stephen@househavenrealty.com
            </a>
            . You can also opt out of marketing emails at any time using the unsubscribe link.
          </p>

          <h2 className="font-serif text-2xl text-househaven-navy">IDX listings disclaimer</h2>
          <p>
            Listings displayed on this website may include data provided by the Realtracs MLS.
            Information is deemed reliable but not guaranteed. Some or all listings displayed may
            not belong to House Haven Realty. See any page that displays listings for the full IDX
            disclaimer.
          </p>

          <h2 className="font-serif text-2xl text-househaven-navy">Contact</h2>
          <p>
            House Haven Realty
            <br />
            5016 Centennial Blvd Suite 200, Nashville, TN 37209
            <br />
            (615) 624-4766
            <br />
            <a
              href="mailto:Stephen@househavenrealty.com"
              className="text-househaven-navy underline"
            >
              Stephen@househavenrealty.com
            </a>
          </p>
        </div>
      </section>
    </main>
  )
}
