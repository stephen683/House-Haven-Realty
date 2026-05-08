import type { Metadata } from 'next'
import Link from 'next/link'
import AdvisoryHero from '@/components/advisory/Hero'
import AdvisoryDisclosure from '@/components/advisory/Disclosure'

// Phase 8 placeholder — Phase 9 replaces this with the real discovery-call
// flow: slot picker (Mon/Wed/Fri 9–11 AM CT, 15-min slots), intake form
// (name/email/phone/situation/buying-or-selling/how-heard), Google Calendar
// event tagged 'discovery_call', three Resend templates (confirm + 24h + 1h
// reminder), DB write to advisory_bookings with booking_type='discovery_call'.

export const metadata: Metadata = {
  title: 'Free 15-min discovery call — HHR Advisory',
  description:
    'Free 15-minute call with House Haven Realty. Tell us what is in front of you and we will tell you whether the Decision Brief actually fits your situation. Real flow ships shortly.',
  alternates: { canonical: '/advisory/discovery-call' },
  robots: { index: true, follow: true },
}

export default function DiscoveryCallPlaceholderPage() {
  return (
    <main>
      <AdvisoryHero
        eyebrow="HHR Advisory · Free 15-min discovery call"
        headline="Talk first. Decide after."
        lede="Fifteen minutes on Google Meet. No payment, no slides, no pitch. You describe what is in front of you, and we tell you whether the Decision Brief actually fits — and if it does not, what would."
      />

      <section className="bg-white py-20 lg:py-24 border-t border-black/5">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <div className="rounded-xl border border-black/10 bg-househaven-surface p-8 lg:p-10">
            <p className="text-xs uppercase tracking-[0.16em] text-househaven-text-muted">
              Booking opens shortly
            </p>
            <h2 className="font-serif text-2xl lg:text-3xl text-househaven-navy mt-2 leading-snug">
              Real-time slot booking is in production this week.
            </h2>
            <p className="mt-4 text-base text-househaven-text leading-relaxed">
              In the meantime, two ways to start. Email Stephen and he will hand-schedule a
              fifteen-minute call this week, or skip the call and book the full Decision Brief
              consult directly.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:stephen@househavenrealty.com?subject=HHR%20Advisory%20discovery%20call&body=Hi%20Stephen%2C%0A%0AI%27d%20like%20to%20book%20a%2015-minute%20discovery%20call.%0A%0AThe%20decision%20I%27m%20trying%20to%20make%3A%0A%0A"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-black text-white text-sm font-semibold hover:bg-househaven-navy-light transition"
              >
                Email Stephen to schedule →
              </a>
              <Link
                href="/advisory/book"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-black/15 text-househaven-navy text-sm font-semibold hover:bg-white transition"
              >
                Skip the call — book a Decision Brief →
              </Link>
            </div>
          </div>

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
              {' '}&ldquo;I don&rsquo;t need that,&rdquo; that is a good outcome.
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
