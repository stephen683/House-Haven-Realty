import type { Listing } from '@/lib/mlsgrid'
import ListingCard from './ListingCard'

export default function ListingGrid({
  listings,
  priorityCount = 3,
}: {
  listings: Listing[]
  priorityCount?: number
}) {
  if (!listings.length) {
    return (
      <div className="rounded-xl border border-dashed border-black/10 bg-househaven-surface p-10 text-center">
        <p className="font-serif text-xl text-househaven-navy">No listings match your filters.</p>
        <p className="text-sm text-househaven-text-muted mt-2">
          Try widening price or location, or contact us for a custom search.
        </p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((l, i) => (
        <ListingCard key={l.mlsId} listing={l} priority={i < priorityCount} />
      ))}
    </div>
  )
}
