import Link from 'next/link'
import {
  ADVISORY_PRICE_USD,
  ADVISORY_BRIEF_TURNAROUND_LABEL,
} from '@/lib/advisory-config'

// Four service-line cards per the Phase 10 brief. Brokerage representation
// (buyer + seller) is the headline architecturally; Advisory and Door
// Collectors are the other two ways the brokerage gets paid. Equal visual
// weight — no card is featured.

interface ServiceLine {
  eyebrow: string
  title: string
  body: string
  meta: string
  cta: string
  href: string
  external?: boolean
}

const LINES: ServiceLine[] = [
  {
    eyebrow: 'Buyer representation',
    title: 'Buy a Nashville home with us.',
    body: 'Full-representation buyer agency. We tour, negotiate, manage the process from pre-approval through closing. Standard buyer-agency commission, paid as part of the transaction.',
    meta: 'Standard commission',
    cta: 'How buying with House Haven works',
    href: '/buyers',
  },
  {
    eyebrow: 'Seller representation',
    title: 'List your Nashville home with us.',
    body: 'Full-representation listing agency. Pricing strategy, photography, marketing, showings, negotiation, closing. Standard listing-agent commission, fully negotiable per the NAR disclosure below.',
    meta: 'Negotiable commission',
    cta: 'How selling with House Haven works',
    href: '/sellers',
  },
  {
    eyebrow: 'HHR Advisory',
    title: 'Hire us by the hour.',
    body: `$${ADVISORY_PRICE_USD} flat, pre-paid. One hour with a Nashville broker. Written Decision Brief delivered within ${ADVISORY_BRIEF_TURNAROUND_LABEL}. The fee covers the advice; it never converts into a credit on a future transaction.`,
    meta: `$${ADVISORY_PRICE_USD} · Brief in ${ADVISORY_BRIEF_TURNAROUND_LABEL}`,
    cta: 'How HHR Advisory works',
    href: '/advisory',
  },
  {
    eyebrow: 'Property management · Door Collectors',
    title: 'Hold the property after.',
    body: "Door Collectors is our sister company — Nashville-only property management for owners who want a small, accountable shop instead of a national franchise. Buy with House Haven, hold with Door Collectors.",
    meta: 'Sister company',
    cta: 'How Door Collectors works',
    href: '/property-management',
  },
]

export default function ServiceLines() {
  return (
    <section className="bg-white py-20 lg:py-24 border-t border-black/5">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
          What we do
        </p>
        <h2 className="font-serif text-3xl lg:text-4xl text-househaven-navy mt-2 max-w-3xl leading-tight">
          Four ways to work with House Haven, depending on what you actually need.
        </h2>

        <div className="mt-12 grid md:grid-cols-2 gap-5 lg:gap-6">
          {LINES.map((line) => (
            <Link
              key={line.href}
              href={line.href}
              className="group flex flex-col rounded-xl bg-white border border-black/10 hover:border-black/30 hover:shadow-xl transition p-6 lg:p-8"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
                {line.eyebrow}
              </p>
              <p className="font-serif text-2xl lg:text-3xl text-househaven-navy mt-2 leading-tight">
                {line.title}
              </p>
              <p className="mt-4 text-sm text-househaven-text leading-relaxed">{line.body}</p>
              <div className="mt-auto pt-6 flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.18em] text-househaven-text-muted">
                  {line.meta}
                </span>
                <span className="font-semibold text-househaven-navy group-hover:translate-x-1 transition text-sm">
                  {line.cta} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
