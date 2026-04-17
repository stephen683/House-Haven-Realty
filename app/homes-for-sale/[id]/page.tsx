import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import IDXDisclaimer from '@/components/compliance/IDXDisclaimer'
import { getListing } from '@/lib/mlsgrid'

interface ListingDetailProps {
  params: { id: string }
}

export const revalidate = 900

function fmtPrice(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  return `$${Math.round(n).toLocaleString()}`
}

export async function generateMetadata({ params }: ListingDetailProps): Promise<Metadata> {
  const { listing } = await getListing(params.id)
  if (!listing) {
    return { title: 'Listing not found', alternates: { canonical: `/homes-for-sale/${params.id}` } }
  }
  const title = `${fmtPrice(listing.listPrice)} · ${listing.address.street}, ${listing.address.city} TN`
  return {
    title: `${title} | House Haven Realty`,
    description: `${listing.bedrooms ?? '—'} bed, ${listing.bathrooms ?? '—'} bath${listing.squareFeet ? `, ${listing.squareFeet.toLocaleString()} sqft` : ''} in ${listing.address.city}. ${listing.publicRemarks.slice(0, 140)}`,
    alternates: { canonical: `/homes-for-sale/${params.id}` },
  }
}

export default async function ListingDetailPage({ params }: ListingDetailProps) {
  const { listing } = await getListing(params.id)

  if (!listing) notFound()

  const listingSchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    url: `https://househavenrealty.com/homes-for-sale/${listing.mlsId}`,
    name: `${listing.address.street}, ${listing.address.city}`,
    description: listing.publicRemarks,
    offers: {
      '@type': 'Offer',
      price: listing.listPrice,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.address.street,
      addressLocality: listing.address.city,
      addressRegion: listing.address.state,
      postalCode: listing.address.zip,
      addressCountry: 'US',
    },
    numberOfRooms: listing.bedrooms ?? undefined,
    numberOfBathroomsTotal: listing.bathrooms ?? undefined,
    floorSize: listing.squareFeet
      ? { '@type': 'QuantitativeValue', value: listing.squareFeet, unitCode: 'FTK' }
      : undefined,
    image: listing.photos.length ? listing.photos.slice(0, 10) : undefined,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://househavenrealty.com' },
      { '@type': 'ListItem', position: 2, name: 'Homes for Sale', item: 'https://househavenrealty.com/homes-for-sale' },
      { '@type': 'ListItem', position: 3, name: `${listing.address.street}, ${listing.address.city}` },
    ],
  }

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([listingSchema, breadcrumbSchema]) }}
      />

      <section className="max-w-6xl mx-auto px-4 lg:px-6 py-10 lg:py-12">
        <nav aria-label="Breadcrumb" className="text-xs text-househaven-text-muted mb-6">
          <Link href="/homes-for-sale" className="hover:text-househaven-navy">
            ← All homes for sale
          </Link>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-[16/10] bg-househaven-surface rounded-xl overflow-hidden">
              {listing.primaryPhotoUrl ? (
                <Image
                  src={listing.primaryPhotoUrl}
                  alt={`${listing.address.street}, ${listing.address.city}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover"
                  priority
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-househaven-text-muted">
                  Photo coming soon
                </div>
              )}
            </div>

            {listing.photos.length > 1 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {listing.photos.slice(1, 9).map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-househaven-surface">
                    <Image
                      src={url}
                      alt={`Photo ${i + 2}`}
                      fill
                      sizes="200px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            )}

            <div>
              <h1 className="font-serif text-4xl text-househaven-navy">
                {fmtPrice(listing.listPrice)}
              </h1>
              <p className="text-lg text-househaven-text mt-1">
                {listing.address.street}, {listing.address.city}, {listing.address.state} {listing.address.zip}
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-househaven-text-muted">
                {listing.bedrooms !== null && <span><strong className="text-househaven-navy">{listing.bedrooms}</strong> beds</span>}
                {listing.bathrooms !== null && <span><strong className="text-househaven-navy">{listing.bathrooms}</strong> baths</span>}
                {listing.squareFeet && <span><strong className="text-househaven-navy">{listing.squareFeet.toLocaleString()}</strong> sqft</span>}
                {listing.lotSizeSqft && <span><strong className="text-househaven-navy">{listing.lotSizeSqft.toLocaleString()}</strong> sqft lot</span>}
                {listing.yearBuilt && <span>Built <strong className="text-househaven-navy">{listing.yearBuilt}</strong></span>}
                {listing.propertyType && <span className="capitalize">{listing.propertyType}</span>}
              </div>
            </div>

            {listing.publicRemarks && (
              <div className="prose prose-sm max-w-none">
                <h2 className="font-serif text-2xl text-househaven-navy">About this home</h2>
                <p className="text-househaven-text leading-relaxed whitespace-pre-line">
                  {listing.publicRemarks}
                </p>
              </div>
            )}

            <div className="rounded-lg border border-black/10 px-4 py-3 text-xs text-househaven-text-muted">
              <p>
                Listing courtesy of{' '}
                <strong className="text-househaven-navy">{listing.listAgentFullName ?? '—'}</strong>
                {listing.listOfficeName && (
                  <>
                    {' '}at{' '}
                    <strong className="text-househaven-navy">{listing.listOfficeName}</strong>
                  </>
                )}
                . MLS #{listing.mlsId}.
                {listing.modificationTimestamp && (
                  <>
                    {' '}Updated{' '}
                    <span suppressHydrationWarning>
                      {new Date(listing.modificationTimestamp).toLocaleDateString()}
                    </span>.
                  </>
                )}
              </p>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl bg-black text-white p-6">
              <p className="font-serif text-2xl">Want to see this home?</p>
              <p className="text-sm text-white/70 mt-2">
                We can pull the full MLS sheet, recent comps, and schedule a private showing.
              </p>
              <Link
                href={`/contact?subject=Showing+request:+${encodeURIComponent(listing.address.street)}`}
                className="block w-full text-center mt-4 px-4 py-3 rounded-lg bg-white text-black font-semibold hover:bg-househaven-accent transition"
              >
                Schedule a showing
              </Link>
              <a
                data-event="phone_click"
                href="tel:+16156244766"
                className="block w-full text-center mt-2 px-4 py-3 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/10 transition"
              >
                (615) 624-4766
              </a>
            </div>

            <div className="rounded-lg bg-househaven-surface px-4 py-3 text-sm text-househaven-text-muted">
              <p className="font-semibold text-househaven-navy">
                Broker commissions are not set by law and are fully negotiable.
              </p>
            </div>
          </aside>
        </div>

        <div className="mt-10">
          <IDXDisclaimer />
        </div>
      </section>
    </main>
  )
}
