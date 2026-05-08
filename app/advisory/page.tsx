import type { Metadata } from 'next'
import AdvisoryHero from '@/components/advisory/Hero'
import WhoThisIsFor from '@/components/advisory/WhoThisIsFor'
import WhatsInTheBrief from '@/components/advisory/WhatsInTheBrief'
import WhyThisIsSafe from '@/components/advisory/WhyThisIsSafe'
import HowItWorks from '@/components/advisory/HowItWorks'
import RecentExamples from '@/components/advisory/RecentExamples'
import PricingBlock from '@/components/advisory/PricingBlock'
import FAQ, { type FAQItem } from '@/components/advisory/FAQ'
import FinalCTA from '@/components/advisory/FinalCTA'
import AdvisoryDisclosure from '@/components/advisory/Disclosure'
import CommissionDisclosure from '@/components/compliance/CommissionDisclosure'
import {
  ADVISORY_PRICE_USD,
  ADVISORY_DURATION_LABEL,
  ADVISORY_BRIEF_TURNAROUND_LABEL,
} from '@/lib/advisory-config'

// Phase 8 cold-traffic conversion target. Hero copy is Candidate A
// from reports/2026-05-08-advisory-hero-candidates.md — swap by editing
// the AdvisoryHero props below if Stephen picks B or C.

export const metadata: Metadata = {
  title: 'HHR Advisory — pay for the advice, not the transaction',
  description: `One hour with a Nashville broker. Written Decision Brief in 48 hours. $${ADVISORY_PRICE_USD} flat, pre-paid. No commission attached.`,
  alternates: { canonical: '/advisory' },
  openGraph: {
    title: 'HHR Advisory — a Nashville brokerage you can hire by the hour',
    description: `One hour. Written Decision Brief in 48 hours. $${ADVISORY_PRICE_USD} flat, pre-paid.`,
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
    q: 'What is your refund policy?',
    a: "Two policies, both honored. First, a value guarantee: if you don't believe you got $200 of value out of the consult, request a refund within 7 days. No questions asked, no hoops, and the Decision Brief is yours to keep regardless. Second, a cancellation policy: cancel more than 24 hours before the consult and you get a full refund automatically. Inside 24 hours, no refund — that hour was reserved and we did the prep work. If something exceptional comes up, email Stephen.",
  },
  {
    q: 'How is this different from a free agent consultation?',
    a: 'A free consultation is a sales meeting that ends in a contract or a goodbye. The Advisory is paid work. It produces a written deliverable. It exists whether or not you ever transact. The economics shape the conversation.',
  },
  {
    q: 'Will you push me to list with House Haven during the consult?',
    a: "No. The structural separation is the entire point. If you ask whether to list with us, we'll tell you what we honestly think and recommend other brokerages to talk to so you can compare. If you do not ask, we do not bring it up.",
  },
  {
    q: 'Is the Brief actually written by Stephen, or AI-generated?',
    a: 'Stephen writes every Decision Brief himself. He is a licensed Tennessee real estate broker with 500+ closings. The Brief reflects what he heard you say in the hour and what he thinks the right call is. AI is not in the loop on the deliverable.',
  },
  {
    q: 'Can you review my contract or explain a clause?',
    a: 'We can talk through what we see in real estate contracts day to day, but we are not attorneys. Specific contract language, liability, and legal interpretation are a Tennessee real estate attorney\'s job. We will tell you when a question is past our line and where to go next.',
  },
  {
    q: 'Are you a financial advisor or attorney?',
    a: 'No. Stephen is a licensed Tennessee real estate broker. The Advisory is real estate consulting — pricing, neighborhoods, contracts in plain language, the timing of decisions, the trade-offs between buying, selling, and renting. For tax, legal, or investment-advice questions, we will hand you to the right professional.',
  },
  {
    q: 'What happens to my information after the consult?',
    a: "Nothing. We don't add you to a CRM, a drip campaign, or a follow-up sequence. We keep the booking record (legal/tax requirement) and the Brief in your client file. We don't email you again unless you reach out first.",
  },
  {
    q: 'What if I am out of state?',
    a: 'As long as the property or your move is in Tennessee, the Advisory works the same way. We meet on Google Meet — Central Time. Your Brief arrives in your inbox within 48 hours of the consult.',
  },
  {
    q: 'Can I bring a spouse or business partner?',
    a: 'Yes. Decision Briefs are most useful when everyone in the decision is in the room. Add their name and email to the intake so the calendar invite includes them.',
  },
  {
    q: 'How quickly can I book?',
    a: 'Slots are Tuesday and Thursday in Central Time. We require 48 hours of lead time so we can pre-pull market data and read your intake closely before the hour starts. The next available slot is usually within 5–10 days.',
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
        headline="Pay for the advice, not the transaction."
        lede={`One hour with a Nashville broker. Written Decision Brief in 48 hours. $${ADVISORY_PRICE_USD} flat, pre-paid. The advice is honest in a way a free consultation cannot be.`}
      />

      <WhoThisIsFor />

      <WhatsInTheBrief />

      <WhyThisIsSafe />

      <HowItWorks />

      <RecentExamples />

      <section className="bg-white py-20 lg:py-24 border-t border-black/5">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
            Pricing
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl text-househaven-navy mt-2 max-w-2xl leading-tight">
            Flat. Pre-paid. No surprises.
          </h2>
          <div className="mt-8">
            <PricingBlock />
          </div>
          <div className="mt-10">
            <CommissionDisclosure variant="card" />
          </div>
          <div className="mt-6">
            <AdvisoryDisclosure />
          </div>
        </div>
      </section>

      <FAQ items={FAQ_ITEMS} />

      <FinalCTA />
    </main>
  )
}
