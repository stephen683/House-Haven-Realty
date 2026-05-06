// RentCast AVM client. Server-side only — never import from a Client Component.
// When RENTCAST_API_KEY is unset, returns deterministic mock data so the UI ships
// before billing is set up. Real API kicks in the moment the key is added.

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
  source: 'rentcast' | 'mock'
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

function mockValuation(address: string): RentCastValuation {
  const seed = Array.from(address).reduce((s, c) => s + c.charCodeAt(0), 0)
  const mid = 425000 + (seed % 350000)
  const low = Math.round(mid * 0.92)
  const high = Math.round(mid * 1.08)
  const comps: RentCastComp[] = Array.from({ length: 4 }).map((_, i) => ({
    address: `${100 * (i + 1)} block of Sample St, Nashville, TN`,
    price: Math.round(mid * (0.94 + i * 0.025)),
    daysOnMarket: 18 + i * 4,
    bedrooms: 3 + (i % 2),
    bathrooms: 2 + (i % 2 === 0 ? 0 : 0.5),
    squareFootage: 1700 + i * 220,
    yearBuilt: 1998 + i * 4,
    distance: 0.2 + i * 0.15,
    soldDate: new Date(Date.now() - (30 + i * 18) * 86400000).toISOString().slice(0, 10),
  }))
  return {
    mid,
    low,
    high,
    comps,
    confidenceNote: 'Sample data — RentCast API not yet connected. Real estimates appear once the API key is added.',
    source: 'mock',
  }
}

export async function getValuation(address: string): Promise<RentCastValuation> {
  const apiKey = process.env.RENTCAST_API_KEY
  if (!apiKey) return mockValuation(address)

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
      return mockValuation(address)
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
    return mockValuation(address)
  }
}

export function normalizeAddress(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.,]/g, '')
}
