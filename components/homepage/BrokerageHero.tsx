import Link from 'next/link'
import {
  HOMEPAGE_EYEBROW,
  HOMEPAGE_HEADLINE,
  HOMEPAGE_SUBHEAD,
  HOMEPAGE_TRUST_LINE,
  HOMEPAGE_PRIMARY_CTA,
  HOMEPAGE_SECONDARY_CTA,
} from '@/lib/homepage-config'

// Typography-only hero — Phase 10 brokerage-first rebuild. A Nashville-location
// photo of Stephen will slot in as a data-file change once the shoot lands.

export default function BrokerageHero() {
  const primaryIsExternal =
    HOMEPAGE_PRIMARY_CTA.href.startsWith('tel:') ||
    HOMEPAGE_PRIMARY_CTA.href.startsWith('mailto:')
  const secondaryIsExternal =
    HOMEPAGE_SECONDARY_CTA.href.startsWith('tel:') ||
    HOMEPAGE_SECONDARY_CTA.href.startsWith('mailto:')

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

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            {primaryIsExternal ? (
              <a
                data-event="phone_click"
                href={HOMEPAGE_PRIMARY_CTA.href}
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-black text-white font-semibold hover:bg-househaven-navy-light transition text-base"
              >
                {HOMEPAGE_PRIMARY_CTA.label} →
              </a>
            ) : (
              <Link
                href={HOMEPAGE_PRIMARY_CTA.href}
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-black text-white font-semibold hover:bg-househaven-navy-light transition text-base"
              >
                {HOMEPAGE_PRIMARY_CTA.label} →
              </Link>
            )}
            {secondaryIsExternal ? (
              <a
                href={HOMEPAGE_SECONDARY_CTA.href}
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg border border-black/15 text-househaven-navy font-semibold hover:bg-househaven-surface transition text-base"
              >
                {HOMEPAGE_SECONDARY_CTA.label} →
              </a>
            ) : (
              <Link
                href={HOMEPAGE_SECONDARY_CTA.href}
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg border border-black/15 text-househaven-navy font-semibold hover:bg-househaven-surface transition text-base"
              >
                {HOMEPAGE_SECONDARY_CTA.label} →
              </Link>
            )}
          </div>

          <p className="mt-10 text-xs uppercase tracking-[0.16em] text-househaven-text-muted">
            {HOMEPAGE_TRUST_LINE}
          </p>
        </div>
      </div>
    </section>
  )
}
