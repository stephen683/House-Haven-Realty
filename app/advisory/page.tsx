import type { Metadata } from 'next'
import Link from 'next/link'
import AdvisoryHero from '@/components/advisory/Hero'
import HowItWorks from '@/components/advisory/HowItWorks'
import WhatsInTheBrief from '@/components/advisory/WhatsInTheBrief'
import WhyThisExists from '@/components/advisory/WhyThisExists'
import FAQ, { type FAQItem } from '@/components/advisory/FAQ'
import PricingBlock from '@/components/advisory/PricingBlock'
import AdvisoryDisclosure from '@/components/advisory/Disclosure'
import CommissionDisclosure from '@/components/compliance/CommissionDisclosure'
import {
  ADVISORY_PRICE_USD,
  ADVISORY_DURATION_LABEL,
  ADVISORY_BRIEF_TURNAROUND_LABEL,
} from '@/lib/advisory-config'

// Phase 7 placeholder — Phase 8 rewrites this page for cold-traffic conversion
// (TikTok / Reels / Shorts) with hero variants, money-back guarantee, sample
// Brief preview, and a free 15-min discovery-call CTA. For now it ships the
// universal HHR Advisory framing (no tracks) so the route stays functional.

export const metadata: Metadata = {
  title: 'HHR Advisory — pay for the advice, not the transaction',
  description: `One hour with a Nashville broker. Written Decision Brief in 48 hours. $${ADVISORY_PRICE_USD} flat, pre-paid. No commission attached.`,
  alternates: { canonical: '/advisory' },
  openGraph: {
    title: 'HHR Advisory — a Nashville brokerage you can hire by the hour',
    description: `One hour. Written Brief in 48 hours. $${ADVISORY_PRICE_USD} flat, pre-paid.`,
    url: 'https://househavenrealty.com/advisory',
    type: 'website',
  },
}

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Why pay when other agents offer free consultations?',
    a: 'Free advice is paid for somewhere — usually by a commission that depends on you transacting. Our $200 fee covers the hour and the Brief, period. You decide what to do next without anyone in your ear who is paid to push you toward a closing.',
  },
  {
    q: 'Does the Advisory fee count toward future commission if I list with you?',
    a: 'No. The economic separation is the point. The fee is for advice; it never converts into a credit, discount, or deposit on a future transaction. If you decide to list with House Haven later, you pay full standard commission, and your $200 stays $200 — paid for what it bought.',
  },
  {
    q: 'Can you review my contract or explain a clause?',
    a: 'We can talk through what we see in real estate contracts day to day, but we are not attorneys. Specific contract language, liability, and legal interpretation are a Tennessee real estate attorney\'s job. We will tell you when a question is past our line and where to go next.',
  },
  {
    q: 'What if I am out of state?',
    a: 'As long as the property or your move is in Tennessee, the Advisory works the same way. We meet on Google Meet — Central Time. Your Brief arrives in your inbox within 48 hours of the consult.',
  },
  {
    q: 'What is your refund policy?',
    a: 'If we cancel, you get a full refund or a reschedule, your call. If you cancel more than 24 hours before the consult, full refund. Inside 24 hours, no refund — that hour was reserved and we did the prep work. If something exceptional comes up, email Stephen.',
  },
  {
    q: 'Can I bring a spouse or business partner?',
    a: 'Yes. Decision Briefs are most useful when everyone in the decision is in the room. Add their name and email to the intake so the calendar invite includes them.',
  },
  {
    q: 'How is this different from a free agent consultation?',
    a: 'A free consultation is a sales meeting that ends in a contract or a goodbye. The Advisory is paid work. It produces a written deliverable. It exists whether or not you ever transact. The economics shape the conversation.',
  },
  {
    q: 'Are you a financial advisor or attorney?',
    a: 'No. Stephen is a licensed Tennessee real estate broker. The Advisory is real estate consulting — pricing, neighborhoods, contracts in plain language, the timing of decisions, the trade-offs between buying, selling, and renting. For tax, legal, or investment-advice questions, we will hand you to the right professional.',
  },
  {
    q: 'Why is the price flat?',
    a: 'Because the value of one hour of clear thinking does not depend on the price of the house. A flat fee means no incentive to talk you into a more expensive transaction.',
  },
]

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'HHR Advisory — Decision Brief',
  serviceType: 'Real estate consulting',
  provider: {
    '@type': 'RealEstateAgent',
    name: 'House Haven Realty',
    url: 'https://househavenrealty.com',
    telephone: '+1-615-624-4766',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '5016 Centennial Blvd Suite 200',
      addressLocality: 'Nashville',
      addressRegion: 'TN',
      postalCode: '37209',
      addressCountry: 'US',
    },
  },
  areaServed: { '@type': 'State', name: 'Tennessee' },
  offers: {
    '@type': 'Offer',
    price: String(ADVISORY_PRICE_USD),
    priceCurrency: 'USD',
    description: `${ADVISORY_DURATION_LABEL} consult plus written Decision Brief delivered in ${ADVISORY_BRIEF_TURNAROUND_LABEL}`,
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

export default function AdvisoryPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <AdvisoryHero
        eyebrow="HHR Advisory · Pay for the advice, not the transaction"
        headline="One hour with a Nashville broker. Written Decision Brief in 48 hours."
        lede={`$${ADVISORY_PRICE_USD} flat, pre-paid. No commission attached. The advice is not paid by your transaction — so the conversation is honest in a way a free consultation cannot be.`}
      />

      <HowItWorks />

      <WhatsInTheBrief />

      <WhyThisExists />

      <FAQ items={FAQ_ITEMS} />

      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <PricingBlock />

          <div className="mt-10 text-center">
            <Link
              href="/advisory/book"
              className="inline-flex items-center px-8 py-4 rounded-lg bg-black text-white font-semibold hover:bg-househaven-navy-light transition text-base"
            >
              Book a Decision Brief →
            </Link>
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
