import type { Metadata } from 'next'
import Link from 'next/link'
import IDXDisclaimer from '@/components/compliance/IDXDisclaimer'

export const metadata: Metadata = {
  title: 'Homes for Sale in Nashville & Middle Tennessee',
  description:
    'Search active listings across Nashville and Middle Tennessee. Filter by price, beds, baths, community, and more. Presented by House Haven Realty.',
}

const propertyTypes = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Land']

export default function HomesForSalePage() {
  return (
    <main className="bg-white">
      <section className="bg-househaven-surface py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            Property search
          </p>
          <h1 className="font-serif text-5xl text-househaven-navy mt-3">
            Homes for sale.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-househaven-text-muted">
            Live MLS listings across Nashville, Middle Tennessee, and every community in
            our 40-mile radius.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <form className="grid md:grid-cols-5 gap-4 p-6 rounded-3xl border border-black/5 bg-white shadow-sm">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-househaven-text-muted mb-1">
              Location
            </label>
            <input
              type="text"
              placeholder="City, ZIP, neighborhood"
              className="w-full rounded-lg border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-househaven-navy"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-househaven-text-muted mb-1">
              Min price
            </label>
            <input
              type="number"
              placeholder="$"
              className="w-full rounded-lg border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-househaven-navy"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-househaven-text-muted mb-1">
              Max price
            </label>
            <input
              type="number"
              placeholder="$"
              className="w-full rounded-lg border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-househaven-navy"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-househaven-text-muted mb-1">
              Beds
            </label>
            <select className="w-full rounded-lg border border-black/10 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-househaven-navy">
              <option>Any</option>
              <option>1+</option>
              <option>2+</option>
              <option>3+</option>
              <option>4+</option>
              <option>5+</option>
            </select>
          </div>
          <div className="md:col-span-5 flex flex-wrap gap-2">
            {propertyTypes.map((t) => (
              <button
                key={t}
                type="button"
                className="px-3 py-1.5 rounded-full border border-black/10 text-xs font-medium text-househaven-text-muted hover:bg-househaven-surface"
              >
                {t}
              </button>
            ))}
          </div>
          <div className="md:col-span-5">
            <button
              type="button"
              disabled
              className="inline-flex items-center px-6 py-3 rounded-full bg-househaven-navy text-white font-semibold disabled:opacity-60"
            >
              Search — launching with IDX
            </button>
          </div>
        </form>

        <div className="mt-12 rounded-3xl border border-dashed border-black/10 bg-househaven-surface p-10 text-center">
          <h2 className="font-serif text-3xl text-househaven-navy">
            Live MLS search launches with Phase 3.
          </h2>
          <p className="text-househaven-text-muted mt-3 max-w-xl mx-auto">
            While we finalize our IDX feed from Realtracs MLS, reach out and one of our
            agents will build you a custom search and deliver listings to your inbox the
            same day.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center mt-6 px-6 py-3 rounded-full bg-househaven-navy text-white font-semibold hover:bg-househaven-navy-light transition"
          >
            Request a custom search
          </Link>
        </div>

        <div className="mt-10">
          <IDXDisclaimer />
        </div>
      </section>
    </main>
  )
}
