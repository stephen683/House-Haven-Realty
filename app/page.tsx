import NewsletterSignup from '@/components/forms/NewsletterSignup'
import TestimonialCarousel from '@/components/sections/TestimonialCarousel'
import ThreePathsHero from '@/components/homepage/ThreePathsHero'
import ThreePathsCards from '@/components/homepage/ThreePathsCards'
import WhatWePublish from '@/components/homepage/WhatWePublish'
import FromStephen from '@/components/homepage/FromStephen'

export const revalidate = 900

// Phase 7 placeholder — homepage rebuild is Phase 10. ThreeTracks /
// WhatYouWalkAwayWith were removed when ADVISORY_TRACKS was stripped; the
// remaining sections still render and the page stays usable in the meantime.

export default function HomePage() {
  return (
    <main>
      <ThreePathsHero />
      <ThreePathsCards />
      <WhatWePublish />
      <FromStephen />

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
