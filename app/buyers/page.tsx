import type { Metadata } from 'next'
import Link from 'next/link'
import MortgageCalculator from '@/components/buyers/MortgageCalculator'

export const metadata: Metadata = {
  title: 'Buying a Home in Nashville — The House Haven Process',
  description:
    'The House Haven Realty buyer process, from pre-approval to closing. First-time homebuyer programs, Tennessee buyer representation, and what to expect in the current Nashville market.',
}

const steps = [
  {
    title: 'Get pre-approved',
    body:
      'Before we hit the streets, we connect you with a trusted local lender. A pre-approval tells you exactly what you can afford and makes your offer competitive in a market that still rewards prepared buyers.',
  },
  {
    title: 'Build your home search',
    body:
      "We listen first — lifestyle, commute, schools, must-haves vs. nice-to-haves — then set up a custom MLS search and tour plan. No spam, no bots, no 'just checking in' texts.",
  },
  {
    title: 'Tour homes with an advocate',
    body:
      'Before touring, Tennessee law now requires a written Buyer Representation Agreement. We walk you through it in plain English — what services we provide, how we are compensated, and how you benefit from having a pro on your side at zero upfront cost.',
  },
  {
    title: 'Make a smart offer',
    body:
      'We pull comps, check market context, and put together an offer strategy that wins — without overpaying. Every offer comes with a clear explanation of the tradeoffs.',
  },
  {
    title: 'Go under contract',
    body:
      'Once the offer is accepted, we coordinate earnest money, inspection scheduling, lender updates, and the binding agreement — all before anyone is stressed.',
  },
  {
    title: 'Inspections and due diligence',
    body:
      'We bring in licensed inspectors, review reports line by line, and negotiate repairs or credits where they matter. We never let you buy something we would not buy for our own family.',
  },
  {
    title: 'Appraisal and final walk',
    body:
      'We monitor the appraisal with the lender, handle any gaps, and walk the property the day before close so nothing surprises you at the table.',
  },
  {
    title: 'Closing day',
    body:
      'Keys, champagne, and the start of something new. Then we stay in touch long after — because our clients keep calling us for contractors, market updates, and life advice.',
  },
]

export default function BuyersPage() {
  return (
    <main className="bg-white">
      <section className="bg-househaven-surface py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            For buyers
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl text-househaven-navy mt-3">
            Buying in Nashville,
            <br />
            without the overwhelm.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-househaven-text-muted">
            Eight steps. One advocate. No pressure. Here&rsquo;s exactly what working with
            House Haven Realty looks like from day one through closing day.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 lg:px-6 py-20 lg:py-24">
        <ol className="space-y-10">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-6">
              <div className="shrink-0 h-14 w-14 rounded-full bg-househaven-navy text-white flex items-center justify-center font-serif text-xl">
                {i + 1}
              </div>
              <div>
                <h2 className="font-serif text-2xl text-househaven-navy">{s.title}</h2>
                <p className="text-househaven-text mt-2 leading-relaxed">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16 rounded-2xl border border-househaven-accent/30 bg-househaven-surface p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            Important for 2025/2026 buyers
          </p>
          <p className="font-serif text-xl text-househaven-navy mt-2">
            Buyer Representation Agreements are now standard.
          </p>
          <p className="text-househaven-text mt-3 leading-relaxed">
            Before touring homes, Tennessee law requires a written Buyer Representation
            Agreement. This agreement outlines how your agent will be compensated and the
            services they will provide. Contact us to discuss how we can help you — with
            no obligation.
          </p>
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center px-7 py-4 rounded-full bg-househaven-navy text-white font-semibold hover:bg-househaven-navy-light transition"
          >
            Start a conversation
          </Link>
        </div>
      </section>

      <section
        id="mortgage-calculator"
        className="bg-househaven-surface py-20 lg:py-24 scroll-mt-24"
      >
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <MortgageCalculator />
        </div>
      </section>
    </main>
  )
}
