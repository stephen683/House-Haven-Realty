// Server component: rental data per neighborhood ZIP via RentCast.
// Cached via Next.js ISR on the community page (revalidate 7 days)
// to stay inside RentCast's Foundation tier (1,000 calls/month).

import Link from 'next/link'
import { getNeighborhoodRentals } from '@/lib/rentcast'

interface NeighborhoodRentalProps {
  communityName: string
  zips: string[]
}

function fmtRent(n: number | null): string {
  if (!n) return '—'
  return `$${Math.round(n).toLocaleString()}`
}

export default async function NeighborhoodRental({
  communityName,
  zips,
}: NeighborhoodRentalProps) {
  const primary = zips[0]
  if (!primary) return null
  const data = await getNeighborhoodRentals(primary)

  const isMock = data.source === 'mock'

  return (
    <section className="bg-househaven-surface py-14 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 lg:px-6">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
              Rental market · {primary}
              {zips.length > 1 ? ` (+${zips.length - 1} more)` : ''}
            </p>
            <h2 className="font-serif text-2xl lg:text-3xl text-househaven-navy mt-2">
              {data.medianRent
                ? `Median rent in ${communityName}: ${fmtRent(data.medianRent)}/mo.`
                : `Rental data for ${communityName} is sparse this month.`}
            </h2>
            {data.listingCount > 0 && (
              <p className="mt-2 text-xs text-househaven-text-muted">
                {data.listingCount} active rental{data.listingCount === 1 ? '' : 's'} sampled.
                Considering renting yours instead of selling? The Sell-or-Rent Brief runs the
                math on your specific property.
              </p>
            )}
          </div>
          <Link
            href="/advisory/sell-or-rent"
            className="text-sm font-semibold text-househaven-navy hover:underline shrink-0"
          >
            Run the math →
          </Link>
        </div>

        {data.listings.length > 0 && (
          <div className="mt-8 grid md:grid-cols-2 gap-3">
            {data.listings.map((l, i) => (
              <div
                key={i}
                className="rounded-lg border border-black/10 bg-white p-4 flex items-start justify-between gap-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-medium text-househaven-navy truncate">{l.address}</p>
                  <p className="text-xs text-househaven-text-muted mt-1">
                    {l.bedrooms ? `${l.bedrooms} bd` : ''}
                    {l.bathrooms ? ` · ${l.bathrooms} ba` : ''}
                    {l.squareFootage ? ` · ${l.squareFootage.toLocaleString()} sqft` : ''}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-serif text-base text-househaven-navy">{fmtRent(l.rent)}/mo</p>
                  {l.daysOnMarket != null && (
                    <p className="text-[11px] text-househaven-text-muted">
                      {l.daysOnMarket} days listed
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {isMock && (
          <p className="mt-6 text-xs text-amber-700 bg-amber-50 rounded px-3 py-2 inline-block">
            Showing sample rental data — RentCast key not configured.
          </p>
        )}
      </div>
    </section>
  )
}
