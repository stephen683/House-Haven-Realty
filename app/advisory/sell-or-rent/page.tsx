import type { Metadata } from 'next'
import Link from 'next/link'
import AdvisoryHero from '@/components/advisory/Hero'
import HonestFraming from '@/components/advisory/HonestFraming'
import PricingBlock from '@/components/advisory/PricingBlock'
import AdvisoryDisclosure from '@/components/advisory/Disclosure'
import CommissionDisclosure from '@/components/compliance/CommissionDisclosure'
import { ADVISORY_PRICE_USD, ADVISORY_BRIEF_TURNAROUND_LABEL } from '@/lib/advisory-config'

export const metadata: Metadata = {
  title: 'Sell-or-Rent — the math, honestly, on keeping vs selling your Nashville home',
  description: `Considering keeping your Nashville home as a rental instead of selling? $${ADVISORY_PRICE_USD} flat for a one-hour consult and a written Decision Brief in ${ADVISORY_BRIEF_TURNAROUND_LABEL}. Cash flow, taxes, ROI — and a verdict.`,
  alternates: { canonical: '/advisory/sell-or-rent' },
  openGraph: {
    title: 'Sell-or-Rent — Nashville | HHR Advisory',
    description: 'One hour, one written Brief, $200 flat. The math no commissioned agent has an incentive to run honestly.',
    url: 'https://househavenrealty.com/advisory/sell-or-rent',
    type: 'website',
  },
}

const BRIEF_CONTENTS = [
  {
    title: 'Cash-flow math on your specific property.',
    body: 'Using current rental data we pre-pull from your address before the consult. Realistic gross rent, vacancy, maintenance, insurance, taxes, and what is actually left at the end of the month.',
  },
  {
    title: 'Tax considerations.',
    body: 'Plain-English read on the tax framing — depreciation, capital gains exclusion windows, 1031 implications. Flagged with explicit "this is your CPA\'s call" boundaries where they belong.',
  },
  {
    title: 'Property management reality.',
    body: 'What it actually costs in the Nashville market — placement fees, monthly percentages, repair markups — and which properties are good candidates for self-management vs. hiring out.',
  },
  {
    title: 'Three-year vs. ten-year ROI comparison.',
    body: 'Selling now and redeploying the equity vs. holding and renting. Two scenarios, side by side, with the assumptions exposed so you can argue with them.',
  },
  {
    title: 'The verdict.',
    body: 'Sell, rent, or wait. Stated clearly with the reasoning. You disagree, you ignore us — your call. But you get a verdict, not a "well, it depends."',
  },
]

export default function AdvisorySellOrRentPage() {
  return (
    <main>
      <AdvisoryHero
        eyebrow="Sell-or-Rent · For homeowners weighing the math"
        headline="Considering keeping your Nashville home as a rental instead of selling it? Get the math, honestly."
        lede="Most agents will not answer this question well — the answer does not pay them either way. We do it as paid work, $200 flat, written Brief in 48 hours."
      />

      <HonestFraming
        eyebrow="The conflict no one names"
        headline="Most agents won't answer 'should I rent it instead?' honestly because the answer does not pay them either way."
        body="If you sell, the listing agent earns commission. If you rent it out, the listing agent earns nothing. Property managers earn a recurring fee, but they do not have an incentive to run the sale-vs-rent math objectively either — they earn either way as long as you do not sell. The Advisory has no incentive in either direction. We run the numbers and we tell you what they say."
      />

      <section className="bg-househaven-surface py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
            Inside your Sell-or-Rent Decision Brief
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl text-househaven-navy mt-2">
            Five things you walk away with.
          </h2>

          <ol className="mt-10 space-y-6">
            {BRIEF_CONTENTS.map((item, i) => (
              <li key={item.title} className="flex gap-5">
                <span className="shrink-0 h-9 w-9 rounded-lg bg-black text-white flex items-center justify-center font-serif text-sm">
                  {i + 1}
                </span>
                <div>
                  <p className="font-serif text-xl text-househaven-navy">{item.title}</p>
                  <p className="mt-1.5 text-sm text-househaven-text-muted leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
            The Nations Drive playbook
          </p>
          <p className="font-serif text-2xl lg:text-3xl text-househaven-navy mt-2 leading-snug">
            Stephen has personally converted Nashville primary residences into rentals — case
            studies he can walk you through during the consult.
          </p>
          <p className="mt-6 text-base lg:text-lg text-househaven-text leading-relaxed">
            The Nations Drive playbook is the working name for a set of decisions Stephen has
            made and helped clients make: when the math actually works, when it does not, and
            what the Nashville-specific variables look like. The case study material lives
            inside the consult and the Brief — not on this page — because the details that
            matter are situation-specific.
          </p>
        </div>
      </section>

      <section className="bg-househaven-surface py-16">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <Link
            href="/advisory/samples/sell-or-rent"
            className="block rounded-xl border border-black/10 bg-white p-6 lg:p-8 hover:shadow-lg transition group"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">Sample</p>
            <p className="font-serif text-2xl text-househaven-navy mt-2">
              See a sample Sell-or-Rent Decision Brief.
            </p>
            <p className="mt-2 text-sm text-househaven-text-muted">
              Anonymized excerpt. Same structure, your situation.
            </p>
            <span className="inline-flex mt-4 text-sm font-semibold text-househaven-navy group-hover:translate-x-1 transition">
              Read the sample →
            </span>
          </Link>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <PricingBlock />

          <div className="mt-10 text-center">
            <Link
              href="/advisory/book?track=sell-or-rent"
              className="inline-flex items-center px-8 py-4 rounded-lg bg-black text-white font-semibold hover:bg-househaven-navy-light transition text-base"
            >
              Book the Sell-or-Rent →
            </Link>
            <p className="mt-4 text-xs text-househaven-text-muted">
              Booking opens shortly. Add yourself to the list and we will email when it is live.
            </p>
          </div>

          <div className="mt-12">
            <CommissionDisclosure variant="card" />
          </div>

          <div className="mt-6">
            <AdvisoryDisclosure />
          </div>
        </div>
      </section>
    </main>
  )
}
