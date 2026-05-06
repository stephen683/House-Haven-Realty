import type { Metadata } from 'next'
import AdvisoryHero from '@/components/advisory/Hero'
import BookingClient from '@/components/advisory/booking/BookingClient'
import AdvisoryDisclosure from '@/components/advisory/Disclosure'
import { ADVISORY_TRACKS, type AdvisoryTrackSlug } from '@/lib/advisory-config'

export const metadata: Metadata = {
  title: 'Book a Decision Brief — HHR Advisory',
  description:
    'Pick a track, complete the intake, and book your one-hour HHR Advisory consult. $200 flat, pre-paid. Written Decision Brief delivered within 48 hours.',
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
  const trackData = initialTrack
    ? ADVISORY_TRACKS.find((t) => t.slug === initialTrack)
    : null

  return (
    <main>
      <AdvisoryHero
        eyebrow="Book a Decision Brief"
        headline={
          trackData
            ? `Book the ${trackData.name}.`
            : 'Book a Decision Brief.'
        }
        lede="One hour on Google Meet, $200 flat, pre-paid. Written Decision Brief delivered within 48 hours of the consult. Tuesday and Thursday slots in Central Time."
      />

      <section className="bg-white py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <BookingClient initialTrack={initialTrack} />

          <div className="mt-12">
            <AdvisoryDisclosure />
          </div>
        </div>
      </section>
    </main>
  )
}
