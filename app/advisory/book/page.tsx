import type { Metadata } from 'next'
import AdvisoryHero from '@/components/advisory/Hero'
import BookWaitlistForm from '@/components/advisory/BookWaitlistForm'
import AdvisoryDisclosure from '@/components/advisory/Disclosure'
import { ADVISORY_TRACKS, type AdvisoryTrackSlug } from '@/lib/advisory-config'

export const metadata: Metadata = {
  title: 'Book a Decision Brief — HHR Advisory',
  description:
    'Booking for HHR Advisory consultations opens shortly. Add yourself to the list and we will email you the day it goes live.',
  alternates: { canonical: '/advisory/book' },
  robots: { index: true, follow: true },
}

interface PageProps {
  searchParams: { track?: string }
}

const VALID_SLUGS = new Set(ADVISORY_TRACKS.map((t) => t.slug as string))

export default function AdvisoryBookPage({ searchParams }: PageProps) {
  const trackParam = searchParams.track
  const initialTrack: AdvisoryTrackSlug | undefined =
    trackParam && VALID_SLUGS.has(trackParam) ? (trackParam as AdvisoryTrackSlug) : undefined
  const trackData = initialTrack ? ADVISORY_TRACKS.find((t) => t.slug === initialTrack) : null

  return (
    <main>
      <AdvisoryHero
        eyebrow="Book a Decision Brief"
        headline={
          trackData
            ? `Booking opens shortly for the ${trackData.name}.`
            : 'Booking opens shortly.'
        }
        lede="We are wiring up the calendar and the Stripe checkout this month. Drop your email and we will tell you the day it goes live — no other emails, no marketing list, just the one announcement."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-2xl mx-auto px-4 lg:px-6">
          <BookWaitlistForm initialTrack={initialTrack} />

          <p className="mt-6 text-xs text-househaven-text-muted text-center">
            We will not add you to a marketing list. One email when booking opens, then nothing
            unless you book.
          </p>

          <div className="mt-12">
            <AdvisoryDisclosure />
          </div>
        </div>
      </section>
    </main>
  )
}
