import type { Metadata } from 'next'
import AdvisoryHero from '@/components/advisory/Hero'
import DiscoveryBookingClient from '@/components/advisory/discovery/BookingClient'
import AdvisoryDisclosure from '@/components/advisory/Disclosure'

export const metadata: Metadata = {
  title: 'Free 15-min discovery call — HHR Advisory',
  description:
    'Free 15-minute call with House Haven Realty. Tell us what is in front of you and we will tell you whether the Decision Brief actually fits — and if it does not, what would.',
  alternates: { canonical: '/advisory/discovery-call' },
  robots: { index: true, follow: true },
}

export default function DiscoveryCallPage() {
  return (
    <main>
      <AdvisoryHero
        eyebrow="HHR Advisory · Free 15-min discovery call"
        headline="Talk first. Decide after."
        lede="Fifteen minutes on Google Meet. No payment, no slides, no pitch. You describe what is in front of you, and we tell you whether the Decision Brief actually fits — and if it does not, what would."
      />

      <section className="bg-white py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <DiscoveryBookingClient />

          <div className="mt-12">
            <h3 className="font-serif text-xl text-househaven-navy">
              What the discovery call covers.
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-househaven-text leading-relaxed list-disc pl-5">
              <li>The decision you are actually trying to make.</li>
              <li>Whether the Decision Brief is the right deliverable for it.</li>
              <li>What you would walk away from a paid consult with — concretely.</li>
              <li>If we are not the right fit, who in Nashville probably is.</li>
            </ul>
            <p className="mt-6 text-sm text-househaven-text-muted leading-relaxed">
              No payment. No pitch. No follow-up sequence. If the call ends with you saying
              &ldquo;I don&rsquo;t need that,&rdquo; that is a good outcome.
            </p>
          </div>

          <div className="mt-12">
            <AdvisoryDisclosure />
          </div>
        </div>
      </section>
    </main>
  )
}
