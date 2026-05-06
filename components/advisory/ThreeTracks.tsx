import Link from 'next/link'
import {
  ADVISORY_TRACKS,
  ADVISORY_PRICE_USD,
  ADVISORY_BRIEF_TURNAROUND_LABEL,
} from '@/lib/advisory-config'

interface ThreeTracksProps {
  variant?: 'detailed' | 'compact'
  heading?: string
}

export default function ThreeTracks({
  variant = 'detailed',
  heading = 'Three tracks. Pick the one that matches where you are.',
}: ThreeTracksProps) {
  return (
    <section className="bg-househaven-surface py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">Tracks</p>
        <h2 className="font-serif text-3xl lg:text-4xl text-househaven-navy mt-2 max-w-3xl">
          {heading}
        </h2>

        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {ADVISORY_TRACKS.map((t) => (
            <Link
              key={t.slug}
              href={`/advisory/${t.slug}`}
              className="group flex flex-col rounded-xl bg-white border border-black/10 hover:border-black/20 hover:shadow-xl transition p-6 lg:p-7"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-househaven-text-muted">
                Track
              </p>
              <p className="font-serif text-2xl text-househaven-navy mt-2">{t.name}</p>
              <p className="mt-3 text-sm text-househaven-text leading-relaxed">{t.audience}</p>
              {variant === 'detailed' && (
                <p className="mt-2 text-sm text-househaven-text-muted leading-relaxed">
                  {t.promise}
                </p>
              )}
              <div className="mt-auto pt-6 flex items-center justify-between text-sm">
                <span className="text-househaven-text-muted">
                  ${ADVISORY_PRICE_USD} · Brief in {ADVISORY_BRIEF_TURNAROUND_LABEL}
                </span>
                <span className="font-semibold text-househaven-navy group-hover:translate-x-1 transition">
                  Learn more →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
