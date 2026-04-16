import type { Metadata } from 'next'
import Link from 'next/link'
import IDXDisclaimer from '@/components/compliance/IDXDisclaimer'

interface ListingDetailProps {
  params: { id: string }
}

export const metadata: Metadata = {
  title: 'Listing details',
  description:
    'Property details, photos, and listing attribution from Realtracs MLS via House Haven Realty.',
}

export default function ListingDetailPage({ params }: ListingDetailProps) {
  return (
    <main className="bg-white">
      <section className="max-w-5xl mx-auto px-4 lg:px-6 py-16 lg:py-24">
        <nav aria-label="Breadcrumb" className="text-xs text-househaven-text-muted mb-6">
          <Link href="/homes-for-sale" className="hover:text-househaven-navy">
            ← All homes for sale
          </Link>
        </nav>
        <h1 className="font-serif text-4xl lg:text-5xl text-househaven-navy">
          Listing {params.id}
        </h1>
        <p className="mt-4 text-lg text-househaven-text-muted max-w-2xl">
          Individual listing detail pages launch with our Phase 3 IDX integration from
          Realtracs MLS. Until then, contact us directly for full details on any address.
        </p>

        <div className="mt-10 rounded-3xl border border-dashed border-black/10 bg-househaven-surface p-10 text-center">
          <p className="font-serif text-2xl text-househaven-navy">
            Want details on this property?
          </p>
          <p className="text-househaven-text-muted mt-3 max-w-xl mx-auto">
            We can pull the full MLS sheet, recent comps, and schedule a private showing.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center mt-6 px-6 py-3 rounded-full bg-househaven-navy text-white font-semibold hover:bg-househaven-navy-light transition"
          >
            Contact an agent
          </Link>
        </div>

        <p className="mt-10 text-xs text-househaven-text-muted">
          Listings displayed on this site are offered by House Haven Realty and other
          Realtracs MLS members. Each listing page will display the listing agent and
          listing broker as required by NAR IDX policy.
        </p>

        <div className="mt-6">
          <IDXDisclaimer />
        </div>
      </section>
    </main>
  )
}
