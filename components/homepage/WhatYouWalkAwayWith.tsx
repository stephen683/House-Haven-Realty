import Link from 'next/link'
import { SAMPLE_BRIEF_SNIPPETS } from '@/data/sample-briefs'
import {
  ADVISORY_PRICE_USD,
  ADVISORY_DURATION_LABEL,
  ADVISORY_BRIEF_TURNAROUND_LABEL,
} from '@/lib/advisory-config'

// Visual centerpiece below the fold: the Decision Brief as a tangible product.
// Three sample Brief cover snippets, each linked to its full sample page.
//
// Placeholder pattern: while status === 'placeholder', the card renders a
// "Sample Brief in production — check back soon" banner. Stephen swaps the
// status + bottomLine in data/sample-briefs.ts to publish each one. No code
// change required.

export default function WhatYouWalkAwayWith() {
  return (
    <section className="bg-black text-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">
            What you walk away with
          </p>
          <h2 className="font-serif text-3xl lg:text-5xl text-white mt-3 leading-[1.1]">
            ${ADVISORY_PRICE_USD}, {ADVISORY_DURATION_LABEL}, written Brief in{' '}
            {ADVISORY_BRIEF_TURNAROUND_LABEL}.
          </h2>
          <p className="mt-6 text-base lg:text-lg text-white/70 leading-relaxed">
            A Decision Brief is a written document — bottom line, recommendations, framework,
            action items — yours to keep, share, or hand to whoever you hire next.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {SAMPLE_BRIEF_SNIPPETS.map((snippet) => (
            <Link
              key={snippet.trackSlug}
              href={`/advisory/samples/${snippet.trackSlug}`}
              className="group flex flex-col rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/30 transition p-6 lg:p-7"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                Sample Brief
              </p>
              <p className="font-serif text-xl text-white mt-2">{snippet.trackName}</p>

              {snippet.status === 'published' && snippet.bottomLine ? (
                <>
                  <p className="text-[11px] uppercase tracking-wider text-white/40 mt-5">
                    Bottom line
                  </p>
                  <p className="mt-2 text-sm text-white/80 leading-relaxed line-clamp-5">
                    {snippet.bottomLine}
                  </p>
                </>
              ) : (
                <p className="mt-5 text-sm text-white/60 leading-relaxed">
                  Sample Brief in production — check back soon. The track page walks through
                  what is in this Brief section by section.
                </p>
              )}

              <span className="mt-auto pt-6 text-sm font-semibold text-white group-hover:translate-x-1 transition">
                Read the {snippet.trackName.toLowerCase()} sample →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
