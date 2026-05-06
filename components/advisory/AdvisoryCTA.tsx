// Reusable cross-link surface used across /advisory/* pages and (in later phases)
// community pages, listing details, and /learn articles. Takes context props so
// the messaging fits the surrounding page without hardcoding per-page links.

import Link from 'next/link'
import { ADVISORY_TRACKS, type AdvisoryTrackSlug } from '@/lib/advisory-config'

interface AdvisoryCTAProps {
  track?: AdvisoryTrackSlug
  context?: string
  variant?: 'card' | 'inline'
  className?: string
}

export default function AdvisoryCTA({
  track,
  context,
  variant = 'card',
  className = '',
}: AdvisoryCTAProps) {
  const trackData = track ? ADVISORY_TRACKS.find((t) => t.slug === track) ?? null : null
  const href = track ? `/advisory/book?track=${track}` : '/advisory/book'
  const label = trackData ? `Book the ${trackData.name}` : 'Book a Decision Brief'

  if (variant === 'inline') {
    return (
      <Link
        href={href}
        className={`inline-flex items-center text-sm font-semibold text-househaven-navy underline-offset-2 hover:underline ${className}`}
      >
        {label} →
      </Link>
    )
  }

  return (
    <div className={`rounded-xl bg-black text-white p-6 lg:p-8 ${className}`}>
      <p className="text-xs uppercase tracking-[0.2em] text-white/50">HHR Advisory</p>
      {trackData ? (
        <p className="font-serif text-2xl lg:text-3xl text-white mt-2 leading-tight">
          {trackData.audience} {trackData.promise}
        </p>
      ) : (
        <p className="font-serif text-2xl lg:text-3xl text-white mt-2 leading-tight">
          Want a personalized read on your situation? Book a Decision Brief.
        </p>
      )}
      {context && <p className="mt-3 text-sm text-white/70">For {context}.</p>}
      <Link
        href={href}
        className="inline-flex items-center mt-6 px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-househaven-accent transition"
      >
        {label} →
      </Link>
    </div>
  )
}
