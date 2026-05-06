import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SampleBanner from '@/components/advisory/SampleBanner'
import AdvisoryDisclosure from '@/components/advisory/Disclosure'
import { ADVISORY_TRACKS, getTrack, type AdvisoryTrackSlug } from '@/lib/advisory-config'

interface PageProps {
  params: { track: string }
}

export function generateStaticParams() {
  return ADVISORY_TRACKS.map((t) => ({ track: t.slug }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const track = getTrack(params.track)
  if (!track) return { title: 'Sample not found' }
  return {
    title: `Sample ${track.name} Decision Brief — HHR Advisory`,
    description: `Anonymized excerpt of an HHR Advisory ${track.name} Decision Brief. Same structure you receive when you book the consult.`,
    alternates: { canonical: `/advisory/samples/${track.slug}` },
    robots: { index: true, follow: true },
  }
}

export default function SamplePage({ params }: PageProps) {
  const track = getTrack(params.track)
  if (!track) notFound()
  const trackSlug = track.slug as AdvisoryTrackSlug

  return (
    <main>
      <SampleBanner />

      <section className="bg-white py-16 lg:py-20 border-b border-black/5">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
            Decision Brief — sample
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl text-househaven-navy mt-3 leading-tight">
            {track.name}
          </h1>
          <p className="mt-6 text-lg text-househaven-text leading-relaxed">
            {track.audience} {track.promise}
          </p>
        </div>
      </section>

      <section className="bg-househaven-surface py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <div className="rounded-xl border border-black/10 bg-white p-8 lg:p-12">
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
              In production
            </p>
            <p className="font-serif text-2xl lg:text-3xl text-househaven-navy mt-2 leading-snug">
              Sample Brief in production — check back soon.
            </p>
            <p className="mt-6 text-base text-househaven-text leading-relaxed">
              Stephen is writing the anonymized {track.name} sample now. We will not publish a
              fabricated example — when the real anonymized Brief is ready, it will appear here
              in full. Until then, the{' '}
              <Link
                href={`/advisory/${track.slug}`}
                className="underline hover:text-househaven-navy font-semibold"
              >
                {track.name} track page
              </Link>{' '}
              walks through what is in the Brief section by section.
            </p>
            <p className="mt-4 text-base text-househaven-text leading-relaxed">
              If you want yours next, book the consult and we will write your Brief — your
              situation, your decision, in 48 hours.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center">
          <Link
            href={`/advisory/book?track=${trackSlug}`}
            className="inline-flex items-center px-8 py-4 rounded-lg bg-black text-white font-semibold hover:bg-househaven-navy-light transition text-base"
          >
            Book the {track.name} →
          </Link>
          <p className="mt-4 text-xs text-househaven-text-muted">
            Booking opens shortly. Add yourself to the list and we will email when it is live.
          </p>

          <div className="mt-12 text-left">
            <AdvisoryDisclosure />
          </div>
        </div>
      </section>
    </main>
  )
}
