import NewsletterSignup from '@/components/forms/NewsletterSignup'
import TestimonialCarousel from '@/components/sections/TestimonialCarousel'
import ThreePathsHero from '@/components/homepage/ThreePathsHero'
import ThreePathsCards from '@/components/homepage/ThreePathsCards'
import WhatYouWalkAwayWith from '@/components/homepage/WhatYouWalkAwayWith'
import WhatWePublish from '@/components/homepage/WhatWePublish'
import FromStephen from '@/components/homepage/FromStephen'
import ThreeTracks from '@/components/advisory/ThreeTracks'

export const revalidate = 900

export default function HomePage() {
  return (
    <main>
      {/* Section 1 — Hero (typography-only; Stephen-Nashville photo slots in via data file when shot lands) */}
      <ThreePathsHero />

      {/* Section 2 — Three peer cards */}
      <ThreePathsCards />

      {/* Section 3 — Decision Brief explainer with sample snippets */}
      <WhatYouWalkAwayWith />

      {/* Section 4 — Three Advisory tracks */}
      <ThreeTracks heading="Three tracks. Pick the one that matches where you are." />

      {/* Section 5 — Editorial preview ("what we publish" — Phase 4 will rename to /learn) */}
      <WhatWePublish />

      {/* Section 6 — From Stephen, text-only broker note */}
      <FromStephen />

      {/* Section 7 — Testimonials (kept from v2 homepage) */}
      <section className="bg-white py-20 lg:py-28">
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

      {/* Section 8 — Newsletter (kept from v2 homepage; Nashville market updates) */}
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
