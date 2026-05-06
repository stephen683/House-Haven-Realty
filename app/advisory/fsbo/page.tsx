import type { Metadata } from 'next'
import Link from 'next/link'
import AdvisoryHero from '@/components/advisory/Hero'
import HonestFraming from '@/components/advisory/HonestFraming'
import PricingBlock from '@/components/advisory/PricingBlock'
import AdvisoryDisclosure from '@/components/advisory/Disclosure'
import CommissionDisclosure from '@/components/compliance/CommissionDisclosure'
import { ADVISORY_PRICE_USD, ADVISORY_BRIEF_TURNAROUND_LABEL } from '@/lib/advisory-config'

export const metadata: Metadata = {
  title: 'FSBO Sanity-Check — one hour with a broker who is not trying to take your listing',
  description: `Selling FSBO in Nashville? $${ADVISORY_PRICE_USD} flat for a one-hour consult and a written Decision Brief in ${ADVISORY_BRIEF_TURNAROUND_LABEL}. We do not pitch you on listing with us — that is the point.`,
  alternates: { canonical: '/advisory/fsbo' },
  openGraph: {
    title: 'FSBO Sanity-Check — Nashville | HHR Advisory',
    description: 'One hour, one written Brief, $200 flat. We will not pitch you on listing with us.',
    url: 'https://househavenrealty.com/advisory/fsbo',
    type: 'website',
  },
}

const BRIEF_CONTENTS = [
  {
    title: 'A pricing read.',
    body: 'Comp methodology applied to your specific home, not a Zestimate. Where the comps say you should be, and how much room there is to push.',
  },
  {
    title: 'The Tennessee disclosure checklist.',
    body: 'Which state and county forms you must serve and where most FSBO sellers leave themselves exposed. Plain English, not legalese.',
  },
  {
    title: 'Contract clauses to protect against.',
    body: 'The three or four lines that show up in offers most often — and what to push back on without being adversarial.',
  },
  {
    title: 'A marketing reality check.',
    body: 'Where MLS exposure actually matters, where flat-fee MLS gets you most of the way, and where you can stop spending money.',
  },
  {
    title: 'A negotiation framework.',
    body: 'How to evaluate offers when you are also the one running the showings and answering the phone.',
  },
  {
    title: 'The exit ramp.',
    body: 'When to give up FSBO and list with a discount-fee broker — and we will recommend one. Not us.',
  },
]

export default function AdvisoryFSBOPage() {
  return (
    <main>
      <AdvisoryHero
        eyebrow="FSBO Sanity-Check · For sellers going alone"
        headline="Selling your home yourself in Nashville? Get one honest hour with a broker who is not trying to take your listing."
        lede="One hour, one written Decision Brief in 48 hours, $200 flat. We tell you what we would tell a friend, then leave you alone to make the call."
      />

      <HonestFraming
        eyebrow="The FSBO reality"
        headline="It is harder than the YouTube videos make it look — and most agent advice you will get is shaped by who pays them."
        body="Nationally, only about seven percent of homes sell FSBO, and most of those involve a buyer the seller already knew. Among FSBOs sold to a stranger, the median sale price runs lower than agent-listed comparables, and a meaningful share of FSBO sellers eventually hire an agent before closing. Free agent advice in this situation is shaped by the same agent wanting your listing. We get paid for an hour. We have no listing pitch."
        source="Source: NAR Profile of Home Buyers and Sellers, multi-year data."
      />

      <section className="bg-househaven-surface py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
            Inside your FSBO Decision Brief
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl text-househaven-navy mt-2">
            Six things you walk away with.
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
            Why we will not try to take your listing
          </p>
          <p className="font-serif text-2xl lg:text-3xl text-househaven-navy mt-2 leading-snug">
            We get paid for our advice. Not for your transaction. So we have no reason to push
            you into one.
          </p>
          <p className="mt-6 text-base lg:text-lg text-househaven-text leading-relaxed">
            Most agents who offer a free FSBO consultation are running a soft listing pitch. The
            economics are honest about that — they only get paid if you sign a listing agreement.
            We chose a different model on purpose. The $200 you pay covers the hour and the
            written Brief. If you ask us at the end whether we would list it for you, we will
            point you to a few brokerages to talk to. We do not bring it up otherwise.
          </p>
        </div>
      </section>

      <section className="bg-househaven-surface py-16">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <Link
            href="/advisory/samples/fsbo"
            className="block rounded-xl border border-black/10 bg-white p-6 lg:p-8 hover:shadow-lg transition group"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">Sample</p>
            <p className="font-serif text-2xl text-househaven-navy mt-2">
              See a sample FSBO Decision Brief.
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
              href="/advisory/book?track=fsbo"
              className="inline-flex items-center px-8 py-4 rounded-lg bg-black text-white font-semibold hover:bg-househaven-navy-light transition text-base"
            >
              Book the FSBO Sanity-Check →
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
