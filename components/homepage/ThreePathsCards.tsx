import Link from 'next/link'
import {
  ADVISORY_PRICE_USD,
  ADVISORY_BRIEF_TURNAROUND_LABEL,
} from '@/lib/advisory-config'

// Three peer cards: equal architectural weight, Advisory visually featured via
// the existing bg-black weighted-card pattern (same pattern Pipeline uses on
// the v2 homepage — this is the brand-internal "accent" treatment, not a new
// color). Per brief: DIY tools / Hire by hour / Hire as agent.

export default function ThreePathsCards() {
  return (
    <section className="bg-househaven-surface py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
          Three paths
        </p>
        <h2 className="font-serif text-3xl lg:text-4xl text-househaven-navy mt-2 max-w-3xl leading-tight">
          Same brokerage. Three ways to work with us. You pick.
        </h2>

        <div className="mt-12 grid lg:grid-cols-3 gap-5">
          {/* Path 1: DIY tools */}
          <Link
            href="/homes-for-sale"
            className="group flex flex-col rounded-xl bg-white border border-black/10 hover:border-black/30 hover:shadow-xl transition p-6 lg:p-8"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
              Path one
            </p>
            <p className="font-serif text-2xl lg:text-3xl text-househaven-navy mt-2 leading-tight">
              Use the tools.
            </p>
            <p className="mt-4 text-sm text-househaven-text leading-relaxed">
              Free, no email required. Find Homes (Realtracs IDX), Nashville Pipeline (live
              permit data), Home Value (real AVM), 57 community pages.
            </p>
            <div className="mt-auto pt-6 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.18em] text-househaven-text-muted">
                Free
              </span>
              <span className="font-semibold text-househaven-navy group-hover:translate-x-1 transition">
                Open the tools →
              </span>
            </div>
          </Link>

          {/* Path 2: Advisory — visually featured via black weighted-card pattern */}
          <Link
            href="/advisory"
            className="group flex flex-col rounded-xl bg-black text-white border border-black hover:shadow-2xl transition p-6 lg:p-8"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">
              Path two · NEW
            </p>
            <p className="font-serif text-2xl lg:text-3xl text-white mt-2 leading-tight">
              Hire us by the hour.
            </p>
            <p className="mt-4 text-sm text-white/80 leading-relaxed">
              ${ADVISORY_PRICE_USD} flat, pre-paid. One hour with a Nashville broker. Written
              Decision Brief in {ADVISORY_BRIEF_TURNAROUND_LABEL}. Three tracks: FSBO, Buyer
              Roadmap, Sell-or-Rent. The fee is for the advice, not for a transaction.
            </p>
            <div className="mt-auto pt-6 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.18em] text-white/60">
                ${ADVISORY_PRICE_USD} · {ADVISORY_BRIEF_TURNAROUND_LABEL}
              </span>
              <span className="font-semibold text-white group-hover:translate-x-1 transition">
                See a sample Brief →
              </span>
            </div>
          </Link>

          {/* Path 3: Brokerage representation */}
          <Link
            href="/team"
            className="group flex flex-col rounded-xl bg-white border border-black/10 hover:border-black/30 hover:shadow-xl transition p-6 lg:p-8"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
              Path three
            </p>
            <p className="font-serif text-2xl lg:text-3xl text-househaven-navy mt-2 leading-tight">
              Hire us as your agent.
            </p>
            <p className="mt-4 text-sm text-househaven-text leading-relaxed">
              Standard commission, paid at closing. 500+ closed transactions and $250M+ in
              volume since 2016. Same broker, same office, full representation.
            </p>
            <div className="mt-auto pt-6 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.18em] text-househaven-text-muted">
                Standard commission
              </span>
              <span className="font-semibold text-househaven-navy group-hover:translate-x-1 transition">
                Meet the team →
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
