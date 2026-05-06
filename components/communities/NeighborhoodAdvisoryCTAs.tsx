// Two Advisory CTA cards keyed off seller-focused tracks: FSBO and
// Sell-or-Rent. Used on every community page below the data sections per
// the brief's section 7 + 8 layout. Buyer-Roadmap is not surfaced here
// because the buyer-side intent on a community page is normally the IDX
// "Search homes" CTA — Buyer-Roadmap surfaces on listing-detail and on
// /learn buying articles instead.

import Link from 'next/link'

interface NeighborhoodAdvisoryCTAsProps {
  communityName: string
}

export default function NeighborhoodAdvisoryCTAs({
  communityName,
}: NeighborhoodAdvisoryCTAsProps) {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-4 lg:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
          Considering a move from {communityName}?
        </p>
        <h2 className="font-serif text-2xl lg:text-3xl text-househaven-navy mt-2 max-w-3xl">
          Two Decision Brief tracks for sellers in this area.
        </h2>

        <div className="mt-8 grid md:grid-cols-2 gap-5">
          <Link
            href="/advisory/fsbo"
            className="group block rounded-xl bg-black text-white p-6 lg:p-7 hover:shadow-2xl transition"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">
              Track · FSBO Sanity-Check
            </p>
            <p className="font-serif text-xl lg:text-2xl text-white mt-2 leading-snug">
              Thinking about FSBO in {communityName}?
            </p>
            <p className="mt-3 text-sm text-white/70 leading-relaxed">
              One honest hour with a broker who is not trying to take your listing. $200 flat,
              written Brief in 48 hours.
            </p>
            <span className="inline-flex mt-5 text-sm font-semibold text-white group-hover:translate-x-1 transition">
              See the FSBO track →
            </span>
          </Link>

          <Link
            href="/advisory/sell-or-rent"
            className="group block rounded-xl bg-black text-white p-6 lg:p-7 hover:shadow-2xl transition"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">
              Track · Sell-or-Rent
            </p>
            <p className="font-serif text-xl lg:text-2xl text-white mt-2 leading-snug">
              Considering renting your {communityName} home instead?
            </p>
            <p className="mt-3 text-sm text-white/70 leading-relaxed">
              Cash-flow math on your specific property. Most agents will not run this honestly
              because the answer does not pay them either way. $200, written Brief in 48 hours.
            </p>
            <span className="inline-flex mt-5 text-sm font-semibold text-white group-hover:translate-x-1 transition">
              See the Sell-or-Rent track →
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
