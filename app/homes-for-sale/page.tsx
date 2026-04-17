import type { Metadata } from 'next'
import Link from 'next/link'
import IDXDisclaimer from '@/components/compliance/IDXDisclaimer'
import SearchFilters from '@/components/listings/SearchFilters'
import ListingGrid from '@/components/listings/ListingGrid'
import { searchListings, type ListingSearch } from '@/lib/mlsgrid'
import { communities } from '@/data/communities'

export const metadata: Metadata = {
  title: 'Homes for Sale in Nashville & Middle Tennessee | House Haven Realty',
  description:
    'Search live Realtracs MLS listings across Nashville and Middle Tennessee. Filter by price, beds, ZIP, and property type. Presented by House Haven Realty.',
  alternates: { canonical: '/homes-for-sale' },
}

export const revalidate = 900

interface HomesForSalePageProps {
  searchParams: {
    city?: string
    zip?: string
    minPrice?: string
    maxPrice?: string
    beds?: string
    propertyType?: string
  }
}

export default async function HomesForSalePage({ searchParams }: HomesForSalePageProps) {
  const search: ListingSearch = {
    city: searchParams.city,
    zip: searchParams.zip,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    beds: searchParams.beds ? Number(searchParams.beds) : undefined,
    propertyType: searchParams.propertyType,
    limit: 24,
  }

  const { listings, source } = await searchListings(search)
  const featuredCommunities = communities.filter((c) => c.tier === 1).slice(0, 8)

  return (
    <main className="bg-white">
      <section className="bg-black text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">
            Realtracs MLS
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mt-3">
            Homes for sale.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            Live MLS listings across Nashville and Middle Tennessee. Filter, save searches,
            and connect with our team for showings.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-10 lg:py-12">
        <SearchFilters />

        {source === 'mock' && (
          <p className="mt-6 text-xs text-amber-700 bg-amber-50 rounded px-3 py-2">
            Showing sample listings. Live Realtracs data activates the moment our MLS Grid
            credentials are added.
          </p>
        )}

        <div className="mt-8">
          <ListingGrid listings={listings} />
        </div>

        <div className="mt-10">
          <IDXDisclaimer />
        </div>
      </section>

      <section className="bg-househaven-surface py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
              Browse by area
            </p>
            <h2 className="font-serif text-3xl text-househaven-navy mt-2">
              Explore our communities
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {featuredCommunities.map((c) => (
              <Link
                key={c.slug}
                href={`/communities/${c.slug}`}
                className="block rounded-xl bg-white border border-black/5 p-4 hover:shadow-lg hover:border-househaven-navy/10 transition text-center"
              >
                <p className="font-serif text-lg text-househaven-navy">{c.name}</p>
                <p className="text-xs text-househaven-text-muted mt-1">{c.county} County</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/communities"
              className="text-sm font-semibold text-househaven-navy hover:text-househaven-accent"
            >
              View all {communities.length} communities →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
