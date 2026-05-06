'use client'

import { ADVISORY_TRACKS, type AdvisoryTrackSlug } from '@/lib/advisory-config'

interface TrackPickerProps {
  onSelect: (track: AdvisoryTrackSlug) => void
}

export default function TrackPicker({ onSelect }: TrackPickerProps) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-househaven-navy">
        Pick the track that fits.
      </h2>
      <p className="mt-2 text-sm text-househaven-text-muted">
        Each track produces a written Decision Brief tailored to that decision. $200 flat,
        one hour, Brief delivered in 48 hours.
      </p>
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {ADVISORY_TRACKS.map((t) => (
          <button
            key={t.slug}
            type="button"
            onClick={() => onSelect(t.slug)}
            className="text-left rounded-xl bg-white border border-black/10 hover:border-black/30 hover:shadow-lg transition p-5"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-househaven-text-muted">
              Track
            </p>
            <p className="font-serif text-xl text-househaven-navy mt-2">{t.name}</p>
            <p className="mt-3 text-sm text-househaven-text leading-relaxed">{t.audience}</p>
            <p className="mt-2 text-sm text-househaven-text-muted leading-relaxed">{t.promise}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
