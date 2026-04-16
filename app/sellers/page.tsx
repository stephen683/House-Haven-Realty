import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Selling Your Home in Nashville — House Haven Realty',
  description:
    'Sell your Nashville home with House Haven Realty. Free CMA, professional marketing, and a proven process built on 500+ closed sales.',
  alternates: { canonical: '/sellers' },
}

const sellSteps = [
  'Know your number. We prepare a real Comparative Market Analysis based on actual recent sales in your specific neighborhood.',
  'Prep your home. We walk your house with you and build a punch list of small fixes, staging wins, and zero-cost improvements.',
  'List with House Haven. Professional photography, drone, 3D tour, custom copy, and a marketing plan tailored to your price point.',
  'Go live everywhere. MLS, IDX-syndicated sites, social, and our own database of active local buyers.',
  'Showings & open houses. We control access, collect feedback, and report back — every single showing.',
  'Review offers. We pull apart every offer and explain it in plain English, not just the price.',
  'Negotiate & contract. Inspection, appraisal, repairs, and financing contingencies — we fight for your interests.',
  'Closing. Keys handed off, proceeds wired, and a client relationship that lasts past the transaction.',
]

const stagingChecklist = [
  'Depersonalize — photos, kids art, fridge clutter',
  'Declutter every countertop and closet',
  'Deep clean (especially grout, baseboards, windows)',
  'Neutralize paint in bold rooms',
  'Maximize natural light — clean windows, open curtains',
  'Fresh mulch and trimmed shrubs at the front door',
  'Small repairs: caulk, touch-up paint, door hinges',
  'Pet areas spotless before every showing',
]

export default function SellersPage() {
  return (
    <main className="bg-white">
      <section className="relative bg-househaven-navy text-white overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2400&q=70"
          alt=""
          fill
          priority
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-househaven-navy/50 via-househaven-navy/75 to-househaven-navy" />
        <div className="relative max-w-5xl mx-auto px-4 lg:px-6 py-24 lg:py-32 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            For sellers
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mt-3">
            Selling done with care,
            <br />
            priced with receipts.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-white/70">
            500+ closed transactions and $250M+ in volume. Here&rsquo;s how we get your
            home sold — with marketing, negotiation, and follow-through that feels like
            family, not a factory.
          </p>
          <Link
            href="/home-valuation"
            className="inline-flex items-center mt-8 px-7 py-4 rounded-lg bg-white text-househaven-navy font-semibold hover:bg-househaven-accent transition"
          >
            Get my free home value
          </Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 lg:px-6 py-20 lg:py-24">
        <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
          Our selling process
        </p>
        <h2 className="font-serif text-4xl text-househaven-navy mt-2">
          Eight steps, zero surprises.
        </h2>

        <ol className="mt-10 space-y-6">
          {sellSteps.map((s, i) => (
            <li key={s} className="flex gap-5">
              <div className="shrink-0 h-10 w-10 rounded-lg bg-househaven-navy text-white flex items-center justify-center font-serif text-base">
                {i + 1}
              </div>
              <p className="text-househaven-text leading-relaxed">{s}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-househaven-surface py-20">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            Staging checklist
          </p>
          <h2 className="font-serif text-4xl text-househaven-navy mt-2">
            Free staging checklist
          </h2>
          <p className="text-househaven-text-muted mt-2 max-w-xl">
            The small things add up. Here&rsquo;s the same list we walk through with every
            House Haven seller.
          </p>

          <ul className="mt-8 grid sm:grid-cols-2 gap-3 text-househaven-text">
            {stagingChecklist.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl bg-white border border-black/5 px-4 py-3"
              >
                <span className="text-househaven-accent">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 text-center">
            <Link
              href="/home-valuation"
              className="inline-flex items-center px-7 py-4 rounded-lg bg-househaven-navy text-white font-semibold hover:bg-househaven-navy-light transition"
            >
              Get my free CMA
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
