// Visual placeholder for the sample Brief. When Stephen delivers a real
// anonymized sample document, swap in the link/asset on the CTA below.
// Until then this card sets reader expectation for what the deliverable
// looks like, without fabricating sample content.

import { ADVISORY_BRIEF_TURNAROUND_LABEL } from '@/lib/advisory-config'

export default function SamplePreview() {
  return (
    <div className="rounded-xl border border-white/15 bg-white/[0.04] p-6 lg:p-8">
      <p className="text-xs uppercase tracking-[0.18em] text-white/50">Sample Brief</p>
      <p className="font-serif text-2xl lg:text-3xl text-white mt-2 leading-snug">
        See what your Brief will look like.
      </p>
      <p className="mt-4 text-sm text-white/70 leading-relaxed max-w-2xl">
        A real anonymized Decision Brief — the same four-section structure you receive when you
        book the consult. Sample document is in production now. We will not publish a fabricated
        example, so until the real one is ready this card flags the placeholder honestly.
      </p>
      <p className="mt-6 inline-flex items-center px-4 py-2 rounded-md bg-white/[0.07] text-xs uppercase tracking-wider text-white/70">
        Sample Brief in production · check back soon
      </p>
      <p className="mt-6 text-xs text-white/50">
        Your own Brief is delivered as a PDF within {ADVISORY_BRIEF_TURNAROUND_LABEL} of the
        consult.
      </p>
    </div>
  )
}
