import Image from 'next/image'
import Link from 'next/link'
import type { Listing } from '@/lib/mlsgrid'

interface ListingCardProps {
  listing: Listing
  priority?: boolean
}

function fmtPrice(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  return `$${Math.round(n).toLocaleString()}`
}

export default function ListingCard({ listing, priority = false }: ListingCardProps) {
  const isHouseHaven = listing.listOfficeName?.toLowerCase().includes('house haven') ?? false
  return (
    <Link
      href={`/homes-for-sale/${listing.mlsId}`}
      className="group block rounded-xl overflow-hidden bg-white border border-black/5 hover:shadow-xl hover:border-black/10 transition"
    >
      <div className="relative aspect-[4/3] bg-househaven-surface">
        {listing.primaryPhotoUrl ? (
          <Image
            src={listing.primaryPhotoUrl}
            alt={`${listing.address.street}, ${listing.address.city}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
            className="object-cover group-hover:scale-105 transition duration-500"
            priority={priority}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-househaven-text-muted">
            Photo coming soon
          </div>
        )}
        {isHouseHaven && (
          <span className="absolute top-3 left-3 px-2 py-1 rounded bg-black text-white text-[10px] uppercase tracking-widest">
            House Haven Listing
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="font-serif text-2xl text-househaven-navy">{fmtPrice(listing.listPrice)}</p>
        <p className="text-sm text-househaven-text mt-1 truncate">
          {listing.address.city}, {listing.address.state} {listing.address.zip}
        </p>
        <div className="flex gap-3 mt-2 text-xs text-househaven-text-muted">
          {listing.bedrooms !== null && <span>{listing.bedrooms} bd</span>}
          {listing.bathrooms !== null && <span>{listing.bathrooms} ba</span>}
          {listing.squareFeet && <span>{listing.squareFeet.toLocaleString()} sqft</span>}
        </div>
        <p className="text-[10px] text-househaven-text-muted mt-3 truncate">
          Listing courtesy of {listing.listOfficeName ?? '—'}
        </p>
      </div>
    </Link>
  )
}
