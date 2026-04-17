// MLS Grid (Realtracs feed) client. RESO Web API v2.
// Server-side only. Returns empty results when MLS_GRID_API_KEY is unset —
// every consumer should treat absence-of-listings as a real state, not a
// placeholder for sample data.

export interface Listing {
  mlsId: string
  status: string
  propertyType: string
  listPrice: number
  address: {
    street: string
    city: string
    state: string
    zip: string
  }
  bedrooms: number | null
  bathrooms: number | null
  squareFeet: number | null
  lotSizeSqft: number | null
  yearBuilt: number | null
  listDate: string | null
  modificationTimestamp: string | null
  primaryPhotoUrl: string | null
  photos: string[]
  publicRemarks: string
  listAgentFullName: string | null
  listOfficeName: string | null
}

export interface ListingSearch {
  city?: string
  zip?: string
  minPrice?: number
  maxPrice?: number
  beds?: number
  propertyType?: string
  limit?: number
  offset?: number
}

export type FeedSource = 'mlsgrid' | 'unavailable'

const MLS_GRID_BASE = 'https://api.mlsgrid.com/v2'

interface MLSGridProperty {
  ListingKey?: string
  StandardStatus?: string
  PropertyType?: string
  ListPrice?: number
  StreetNumber?: string
  StreetName?: string
  StreetSuffix?: string
  City?: string
  StateOrProvince?: string
  PostalCode?: string
  BedroomsTotal?: number
  BathroomsTotalDecimal?: number
  LivingArea?: number
  LotSizeSquareFeet?: number
  YearBuilt?: number
  ListingContractDate?: string
  ModificationTimestamp?: string
  ListAgentFullName?: string
  ListOfficeName?: string
  PublicRemarks?: string
  Media?: Array<{ MediaURL?: string; Order?: number }>
}

function mapMLSGridListing(p: MLSGridProperty): Listing {
  const street = [p.StreetNumber, p.StreetName, p.StreetSuffix].filter(Boolean).join(' ').trim()
  const photos = (p.Media ?? [])
    .sort((a, b) => (a.Order ?? 0) - (b.Order ?? 0))
    .map((m) => m.MediaURL)
    .filter((u): u is string => Boolean(u))
  return {
    mlsId: p.ListingKey ?? '',
    status: p.StandardStatus ?? 'Active',
    propertyType: p.PropertyType ?? '',
    listPrice: p.ListPrice ?? 0,
    address: {
      street,
      city: p.City ?? '',
      state: p.StateOrProvince ?? 'TN',
      zip: p.PostalCode ?? '',
    },
    bedrooms: p.BedroomsTotal ?? null,
    bathrooms: p.BathroomsTotalDecimal ?? null,
    squareFeet: p.LivingArea ?? null,
    lotSizeSqft: p.LotSizeSquareFeet ?? null,
    yearBuilt: p.YearBuilt ?? null,
    listDate: p.ListingContractDate ?? null,
    modificationTimestamp: p.ModificationTimestamp ?? null,
    primaryPhotoUrl: photos[0] ?? null,
    photos,
    publicRemarks: p.PublicRemarks ?? '',
    listAgentFullName: p.ListAgentFullName ?? null,
    listOfficeName: p.ListOfficeName ?? null,
  }
}

export async function searchListings(search: ListingSearch = {}): Promise<{ listings: Listing[]; source: FeedSource }> {
  const apiKey = process.env.MLS_GRID_API_KEY
  if (!apiKey) return { listings: [], source: 'unavailable' }

  const filters: string[] = ["StandardStatus eq 'Active'"]
  if (search.city) filters.push(`City eq '${search.city.replace(/'/g, "''")}'`)
  if (search.zip) filters.push(`PostalCode eq '${search.zip}'`)
  if (search.minPrice) filters.push(`ListPrice ge ${search.minPrice}`)
  if (search.maxPrice) filters.push(`ListPrice le ${search.maxPrice}`)
  if (search.beds) filters.push(`BedroomsTotal ge ${search.beds}`)
  if (search.propertyType) filters.push(`PropertyType eq '${search.propertyType}'`)

  const params = new URLSearchParams({
    $filter: filters.join(' and '),
    $top: String(search.limit ?? 24),
    $skip: String(search.offset ?? 0),
    $orderby: 'ModificationTimestamp desc',
    $expand: 'Media',
  })

  try {
    const res = await fetch(`${MLS_GRID_BASE}/Property?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      next: { revalidate: 900 },
    })
    if (!res.ok) {
      console.error('[mlsgrid] non-OK', res.status)
      return { listings: [], source: 'unavailable' }
    }
    const data = await res.json() as { value?: MLSGridProperty[] }
    return { listings: (data.value ?? []).map(mapMLSGridListing), source: 'mlsgrid' }
  } catch (err) {
    console.error('[mlsgrid] fetch failed', err)
    return { listings: [], source: 'unavailable' }
  }
}

export async function getListing(mlsId: string): Promise<{ listing: Listing | null; source: FeedSource }> {
  const apiKey = process.env.MLS_GRID_API_KEY
  if (!apiKey) return { listing: null, source: 'unavailable' }
  try {
    const url = `${MLS_GRID_BASE}/Property('${mlsId}')?$expand=Media`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
      next: { revalidate: 900 },
    })
    if (!res.ok) {
      console.error('[mlsgrid] listing fetch non-OK', res.status)
      return { listing: null, source: 'unavailable' }
    }
    const data = await res.json() as MLSGridProperty
    return { listing: mapMLSGridListing(data), source: 'mlsgrid' }
  } catch (err) {
    console.error('[mlsgrid] listing fetch failed', err)
    return { listing: null, source: 'unavailable' }
  }
}
