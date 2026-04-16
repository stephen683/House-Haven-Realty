import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import MortgageCalculator from '@/components/buyers/MortgageCalculator'
import MovingChecklist from '@/components/buyers/MovingChecklist'

export const metadata: Metadata = {
  title: 'Buying a Home in Nashville — The House Haven Process',
  description:
    'The House Haven Realty buyer process, from pre-approval to closing. First-time homebuyer programs, Tennessee buyer representation, and what to expect in the current Nashville market.',
  alternates: { canonical: '/buyers' },
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

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do I need a real estate agent to buy a home in Nashville?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'While not legally required, having a buyer\'s agent costs you nothing extra (the seller typically covers agent compensation) and provides professional representation during negotiations, inspections, and closing. Tennessee now requires a written Buyer Representation Agreement before touring homes.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much do I need for a down payment in Nashville?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Down payments in Nashville range from 0% (VA and USDA loans) to 3% (conventional) to 3.5% (FHA). The average Nashville home price means you should plan for $10,000-$25,000 minimum for most programs, plus closing costs of 2-4% of the purchase price.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are closing costs for buyers in Tennessee?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Buyer closing costs in Tennessee typically run 2-4% of the purchase price. This includes title insurance, attorney fees, recording fees, and prepaid items like homeowner\'s insurance and property taxes. Tennessee does charge a transfer tax of $0.37 per $100 of purchase price.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to buy a house in Nashville?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'From pre-approval to closing, the typical Nashville home purchase takes 30-60 days. The pre-approval process takes 1-3 days, home search varies, and once under contract, closing typically occurs within 30-45 days depending on financing type.',
      },
    },
  ],
}

export default function BuyersPage() {
  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="relative bg-househaven-navy text-white overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1440&q=70"
          alt=""
          fill
          priority
          className="object-cover opacity-25"
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-househaven-navy/50 via-househaven-navy/75 to-househaven-navy" />
        <div className="relative max-w-5xl mx-auto px-4 lg:px-6 py-24 lg:py-32 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            For buyers
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mt-3">
            Buying in Nashville,
            <br />
            without the overwhelm.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-white/70">
            Eight steps. One advocate. No pressure. Here&rsquo;s exactly what working with
            House Haven Realty looks like from day one through closing day.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 lg:px-6 py-20 lg:py-24">
        <ol className="space-y-10">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-6">
              <div className="shrink-0 h-14 w-14 rounded-lg bg-househaven-navy text-white flex items-center justify-center font-serif text-xl">
                {i + 1}
              </div>
              <div>
                <h2 className="font-serif text-2xl text-househaven-navy">{s.title}</h2>
                <p className="text-househaven-text mt-2 leading-relaxed">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16 rounded-lg border border-househaven-accent/30 bg-househaven-surface p-6">
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
            className="inline-flex items-center px-7 py-4 rounded-lg bg-househaven-navy text-white font-semibold hover:bg-househaven-navy-light transition"
          >
            Start a conversation
          </Link>
        </div>
      </section>

      {/* Moving checklist */}
      <section className="max-w-4xl mx-auto px-4 lg:px-6 py-16 lg:py-20">
        <MovingChecklist />
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
