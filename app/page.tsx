import NewsletterSignup from '@/components/forms/NewsletterSignup'
import TestimonialCarousel from '@/components/sections/TestimonialCarousel'
import BrokerageHero from '@/components/homepage/BrokerageHero'
import StephenStory from '@/components/homepage/StephenStory'
import ServiceLines from '@/components/homepage/ServiceLines'
import WhatWeBuilt from '@/components/homepage/WhatWeBuilt'
import RecentTransactions from '@/components/homepage/RecentTransactions'

export const revalidate = 900

// Phase 10 brokerage-first rebuild. Sections per
// reports/2026-05-08-homepage-hero-candidates.md:
// hero / Stephen's story / four service lines (buyer rep, seller rep,
// Advisory, Door Collectors) / what we built for Nashville (4 tools) /
// recent transactions (placeholder) / testimonials / newsletter.

export default function HomePage() {
  return (
    <main>
      <BrokerageHero />
      <StephenStory />
      <ServiceLines />
      <WhatWeBuilt />
      <RecentTransactions />

      <section className="bg-househaven-surface py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
              Clients, in their words
            </p>
            <h2 className="font-serif text-4xl text-househaven-navy mt-2">
              Why people stay with House Haven.
            </h2>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      <section className="bg-black text-white py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">
            Nashville market updates
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl text-white mt-2">
            Get monthly updates on the Nashville market.
          </h2>
          <p className="text-white/70 mt-2 text-sm">No spam. Easy to unsubscribe.</p>
          <div className="mt-8 max-w-xl mx-auto">
            <NewsletterSignup variant="dark" />
          </div>
        </div>
      </section>
    </main>
  )
}
