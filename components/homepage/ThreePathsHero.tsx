import {
  HOMEPAGE_EYEBROW,
  HOMEPAGE_HEADLINE,
  HOMEPAGE_SUBHEAD,
  HOMEPAGE_TRUST_LINE,
} from '@/lib/homepage-config'

// Typography-only hero per Phase 0 decision. A Nashville-location photo of
// Stephen will slot in as a data-file change once Stephen commissions the
// shoot.
export default function ThreePathsHero() {
  return (
    <section className="bg-white border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-20 lg:py-28">
        <div className="max-w-4xl">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
            {HOMEPAGE_EYEBROW}
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-househaven-navy mt-4 leading-[1.05]">
            {HOMEPAGE_HEADLINE}
          </h1>
          <p className="mt-8 text-lg lg:text-xl text-househaven-text leading-relaxed max-w-3xl">
            {HOMEPAGE_SUBHEAD}
          </p>

          <p className="mt-10 text-xs uppercase tracking-[0.16em] text-househaven-text-muted">
            {HOMEPAGE_TRUST_LINE}
          </p>
        </div>
      </div>
    </section>
  )
}
