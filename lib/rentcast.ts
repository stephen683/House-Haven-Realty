// RentCast AVM client. Server-side only — never import from a Client Component.
//
// Returns source: 'unavailable' when there is no key, or when RentCast errors.
// It previously synthesised a number from the characters of the address
// (425000 + charCodeSum % 350000) and served it under the headline "What is
// your Nashville home worth?". Sellers cannot tell a fabricated valuation from
// a real one, and a wrong number on a $700K house is not a rounding error —
// it anchors what someone thinks their home is worth. Absence of an estimate
// is a real state and the UI says so, the same way lib/mlsgrid.ts reports an
// unavailable feed rather than inventing listings.

export interface RentCastComp {
  address: string
  price: number | null
  daysOnMarket: number | null
  bedrooms: number | null
  bathrooms: number | null
  squareFootage: number | null
  yearBuilt: number | null
  distance: number | null
  soldDate: string | null
}

export interface RentCastValuation {
  mid: number | null
  low: number | null
  high: number | null
  comps: RentCastComp[]
  confidenceNote: string
  source: 'rentcast' | 'unavailable'
}

function maskAddress(full: string): string {
  if (!full) return ''
  const parts = full.split(',').map((p) => p.trim())
  if (!parts[0]) return full
  const street = parts[0]
  const num = street.match(/^(\d+)\s+/)
  const blockNumber = num ? `${Math.floor(Number(num[1]) / 100) * 100} block of` : ''
  const streetName = street.replace(/^\d+\s+/, '')
  return [`${blockNumber} ${streetName}`.trim(), ...parts.slice(1)].filter(Boolean).join(', ')
}

const UNAVAILABLE: RentCastValuation = {
  mid: null,
  low: null,
  high: null,
  comps: [],
  confidenceNote: '',
  source: 'unavailable',
}

/** Whether an instant estimate can be produced at all. Server-side only. */
export function isValuationConfigured(): boolean {
  return Boolean(process.env.RENTCAST_API_KEY)
}

export async function getValuation(address: string): Promise<RentCastValuation> {
  const apiKey = process.env.RENTCAST_API_KEY
  if (!apiKey) return UNAVAILABLE

  try {
    const url = new URL('https://api.rentcast.io/v1/avm/value')
    url.searchParams.set('address', address)
    const res = await fetch(url.toString(), {
      headers: {
        'X-Api-Key': apiKey,
        Accept: 'application/json',
      },
    })
    if (!res.ok) {
      console.error('[rentcast] non-OK response', res.status, await res.text().catch(() => ''))
      return UNAVAILABLE
    }
    const data = await res.json() as {
      price?: number
      priceRangeLow?: number
      priceRangeHigh?: number
      comparables?: Array<{
        formattedAddress?: string
        price?: number
        daysOnMarket?: number
        bedrooms?: number
        bathrooms?: number
        squareFootage?: number
        yearBuilt?: number
        distance?: number
        removedDate?: string
        listedDate?: string
      }>
    }
    const comps: RentCastComp[] = (data.comparables ?? []).slice(0, 5).map((c) => ({
      address: maskAddress(c.formattedAddress ?? ''),
      price: c.price ?? null,
      daysOnMarket: c.daysOnMarket ?? null,
      bedrooms: c.bedrooms ?? null,
      bathrooms: c.bathrooms ?? null,
      squareFootage: c.squareFootage ?? null,
      yearBuilt: c.yearBuilt ?? null,
      distance: c.distance ?? null,
      soldDate: c.removedDate ?? c.listedDate ?? null,
    }))
    return {
      mid: data.price ?? null,
      low: data.priceRangeLow ?? null,
      high: data.priceRangeHigh ?? null,
      comps,
      confidenceNote: comps.length
        ? `Based on ${comps.length} comparable sales within roughly 0.5 miles in the past 6 months.`
        : 'Limited comparable sales available in the immediate area.',
      source: 'rentcast',
    }
  } catch (err) {
    console.error('[rentcast] fetch failed', err)
    return UNAVAILABLE
  }
}

export function normalizeAddress(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.,]/g, '')
}
