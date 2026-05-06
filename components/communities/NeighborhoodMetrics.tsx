// Active sale data per neighborhood. Reads from public.listings_cache once
// MLS Grid feed is live (Phase 3 launch blocker awaiting MLS Grid API key).
// Until then, renders an honest placeholder rather than fake numbers.

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

interface NeighborhoodMetricsProps {
  communityName: string
  zips: string[]
}

interface ListingRow {
  list_price: number | null
  square_feet: number | null
  modification_timestamp: string | null
}

function median(values: number[]): number | null {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

function fmtPrice(n: number | null): string {
  if (!n) return '—'
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  return `$${Math.round(n).toLocaleString()}`
}

export default async function NeighborhoodMetrics({
  communityName,
  zips,
}: NeighborhoodMetricsProps) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('listings_cache')
    .select('list_price, square_feet, modification_timestamp')
    .in('zip', zips)
    .eq('status', 'Active')
    .limit(500)

  const listings: ListingRow[] = error ? [] : (data ?? []) as ListingRow[]

  if (listings.length === 0) {
    return (
      <section className="bg-white py-12 lg:py-14 border-t border-black/5">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
            Sale market · {zips.join(', ')}
          </p>
          <h2 className="font-serif text-2xl lg:text-3xl text-househaven-navy mt-2">
            Live sale data for {communityName} arrives with MLS Grid.
          </h2>
          <p className="mt-4 text-sm text-househaven-text-muted leading-relaxed max-w-2xl">
            We are activating the Realtracs IDX feed via MLS Grid. Median sale price, days on
            market, price per square foot, and active inventory will populate this section
            automatically once the API key lands. Until then, the{' '}
            <Link href="/value" className="underline hover:text-househaven-navy">
              Home Value tool
            </Link>{' '}
            gives an honest per-property estimate.
          </p>
        </div>
      </section>
    )
  }

  const prices = listings
    .map((l) => l.list_price)
    .filter((p): p is number => typeof p === 'number' && p > 0)
  const ppsfValues = listings
    .filter(
      (l): l is { list_price: number; square_feet: number; modification_timestamp: string | null } =>
        typeof l.list_price === 'number' &&
        l.list_price > 0 &&
        typeof l.square_feet === 'number' &&
        l.square_feet > 0,
    )
    .map((l) => l.list_price / l.square_feet)
  const medianPrice = median(prices)
  const medianPpsf = median(ppsfValues)

  return (
    <section className="bg-white py-14 lg:py-16 border-t border-black/5">
      <div className="max-w-5xl mx-auto px-4 lg:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
          Sale market · {zips.join(', ')}
        </p>
        <h2 className="font-serif text-2xl lg:text-3xl text-househaven-navy mt-2">
          {listings.length} active sale {listings.length === 1 ? 'listing' : 'listings'} in{' '}
          {communityName}.
        </h2>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          <Cell value={fmtPrice(medianPrice)} label="Median list price" />
          {medianPpsf && (
            <Cell value={`$${Math.round(medianPpsf)}`} label="Median price / sqft" />
          )}
          <Cell value={String(listings.length)} label="Active listings" />
        </div>
      </div>
    </section>
  )
}

function Cell({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-5">
      <p className="font-serif text-3xl text-househaven-navy">{value}</p>
      <p className="text-xs uppercase tracking-wider text-househaven-text-muted mt-1">
        {label}
      </p>
    </div>
  )
}
