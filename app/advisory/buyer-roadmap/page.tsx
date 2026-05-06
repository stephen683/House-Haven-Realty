import type { Metadata } from 'next'
import Link from 'next/link'
import AdvisoryHero from '@/components/advisory/Hero'
import HonestFraming from '@/components/advisory/HonestFraming'
import PricingBlock from '@/components/advisory/PricingBlock'
import AdvisoryDisclosure from '@/components/advisory/Disclosure'
import { ADVISORY_PRICE_USD, ADVISORY_BRIEF_TURNAROUND_LABEL } from '@/lib/advisory-config'

export const metadata: Metadata = {
  title: 'Buyer Roadmap — a personalized timeline before you start touring homes',
  description: `Six to eighteen months out from buying in Nashville? $${ADVISORY_PRICE_USD} flat for a one-hour consult and a written Decision Brief in ${ADVISORY_BRIEF_TURNAROUND_LABEL}. The questions to ask now, and the agent conversations that can wait.`,
  alternates: { canonical: '/advisory/buyer-roadmap' },
  openGraph: {
    title: 'Buyer Roadmap — Nashville | HHR Advisory',
    description: 'One hour, one written Brief, $200 flat. The plan before the agent.',
    url: 'https://househavenrealty.com/advisory/buyer-roadmap',
    type: 'website',
  },
}

const BRIEF_CONTENTS = [
  {
    title: 'Where you actually are vs. where you think you are.',
    body: 'A read on your purchase readiness today, not where the lender said you would be in six months.',
  },
  {
    title: 'Lender conversations to start now.',
    body: 'Which calls move the timeline forward, and which can wait until you are 90 days out. We will name two or three Nashville lenders we trust to take a no-pressure pre-conversation.',
  },
  {
    title: 'A neighborhood narrowing framework.',
    body: 'Not a list of recommended neighborhoods. A way of testing your own short list against your real constraints — commute, price, school zone, walkability, build year — until two or three rise to the top.',
  },
  {
    title: 'A month-by-month timeline.',
    body: 'What you do in month 1, month 3, month 6, month 9, month 12. Where most far-out buyers waste cycles, and where one move now saves three later.',
  },
  {
    title: 'Red flags vs. green flags.',
    body: 'How to read inventory in your target ZIPs without checking Zillow every morning. The signals that mean act, the ones that mean wait.',
  },
  {
    title: 'How to engage a buyer\'s agent when you are ready.',
    body: 'What the new buyer-representation rules mean for the fee conversation, what to ask in agent interviews, and how to know when you are talking to someone who actually knows your target neighborhoods.',
  },
]

export default function AdvisoryBuyerRoadmapPage() {
  return (
    <main>
      <AdvisoryHero
        eyebrow="Buyer Roadmap · For buyers 6–18 months out"
        headline="Six to eighteen months out from buying in Nashville? Get a personalized timeline and the questions to ask now."
        lede="Buyer-agent fees changed in 2024. Pre-approval logic changed two years ago. Inventory in the neighborhoods you are looking at moves week to week. One hour now beats six months of fragmented research."
      />

      <HonestFraming
        eyebrow="Why the rules changed in 2024"
        headline="After the NAR settlement, free buyer consultations have a new conflict you should know about."
        body="Buyers' agents are now negotiating their fees directly with buyers in many cases — not just as part of the seller's commission. That means a free buyer consultation has a built-in incentive to convert you into a signed Buyer's Representation Agreement quickly, before competing agents do. There is nothing dishonest about that — it is how the new rules work. The Advisory is the conflict-free version: pay for one hour of clarity, then go hire whichever agent you want, including no one yet."
        source="Source: NAR settlement on broker compensation, effective August 17, 2024."
      />

      <section className="bg-househaven-surface py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
            Inside your Buyer Roadmap Decision Brief
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
            Why far-out buyers benefit from one paid hour
          </p>
          <p className="font-serif text-2xl lg:text-3xl text-househaven-navy mt-2 leading-snug">
            One hour of structured planning at month six saves you from three lost months at
            month nine.
          </p>
          <p className="mt-6 text-base lg:text-lg text-househaven-text leading-relaxed">
            Most buyers six to eighteen months out are doing the same thing: a Zillow scroll on
            Sunday night, a YouTube video about closing costs, a half-hearted conversation with
            a lender they found on Reddit. The pieces do not connect. By month nine they have
            spent more hours on real estate than this Brief takes to read, and they still cannot
            answer &ldquo;am I actually ready?&rdquo; with confidence. We will spend one hour answering
            exactly that.
          </p>
        </div>
      </section>

      <section className="bg-househaven-surface py-16">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <Link
            href="/advisory/samples/buyer-roadmap"
            className="block rounded-xl border border-black/10 bg-white p-6 lg:p-8 hover:shadow-lg transition group"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">Sample</p>
            <p className="font-serif text-2xl text-househaven-navy mt-2">
              See a sample Buyer Roadmap Decision Brief.
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
              href="/advisory/book?track=buyer-roadmap"
              className="inline-flex items-center px-8 py-4 rounded-lg bg-black text-white font-semibold hover:bg-househaven-navy-light transition text-base"
            >
              Book the Buyer Roadmap →
            </Link>
            <p className="mt-4 text-xs text-househaven-text-muted">
              Booking opens shortly. Add yourself to the list and we will email when it is live.
            </p>
          </div>

          <div className="mt-12">
            <AdvisoryDisclosure />
          </div>
        </div>
      </section>
    </main>
  )
}
