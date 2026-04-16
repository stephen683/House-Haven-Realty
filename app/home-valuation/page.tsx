import type { Metadata } from 'next'
import Image from 'next/image'
import ValuationForm from '@/components/forms/ValuationForm'

export const metadata: Metadata = {
  title: "What's My Home Worth? Free Nashville Home Valuation",
  description:
    "Get a free, no-obligation Comparative Market Analysis of your Nashville or Middle Tennessee home. Real numbers from House Haven Realty — not just an automated Zestimate.",
}

export default function HomeValuationPage() {
  return (
    <main className="bg-white">
      <section className="relative bg-househaven-navy text-white overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=70"
          alt=""
          fill
          priority
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-househaven-navy/50 via-househaven-navy/75 to-househaven-navy" />
        <div className="relative max-w-4xl mx-auto px-4 lg:px-6 py-24 lg:py-32 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            Home Valuation
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mt-3 leading-[1.05]">
            What&rsquo;s your Nashville
            <br />
            home actually worth?
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-white/70">
            Tell us about your property and we&rsquo;ll send you a free Comparative Market
            Analysis (CMA) prepared by a licensed REALTOR® — based on the actual homes
            that just sold in your neighborhood.
          </p>

          <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-white/80">
            <li>✓ 219+ closed sales</li>
            <li>✓ Licensed since 2016</li>
            <li>✓ No obligation, no spam</li>
          </ul>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 lg:px-6 py-16 lg:py-20">
        <div className="rounded-xl border border-black/5 bg-white p-6 lg:p-10 shadow-sm">
          <h2 className="font-serif text-3xl text-househaven-navy">
            Request your free CMA
          </h2>
          <p className="text-sm text-househaven-text-muted mt-2 mb-8">
            We read every request personally. Expect a reply within one business day.
          </p>
          <ValuationForm />
        </div>

        <div className="mt-10 rounded-lg border border-househaven-accent/30 bg-househaven-surface p-6 text-sm text-househaven-text-muted leading-relaxed">
          <p>
            <strong className="text-househaven-navy">A note on automated estimates.</strong>{' '}
            Online value tools (Zestimate, Redfin, etc.) are based on public records and
            broad averages. They are not appraisals and should not be used as such. For an
            accurate assessment of your home&rsquo;s market value, our team will prepare a
            free, no-obligation Comparative Market Analysis based on real, recent sales in
            your specific neighborhood.
          </p>
        </div>
      </section>
    </main>
  )
}
