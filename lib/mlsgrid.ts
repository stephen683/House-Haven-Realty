// MLS Grid (Realtracs feed) client. RESO Web API v2.
// Server-side only. When MLS_GRID_API_KEY is unset, returns a small set of mock
// listings so the search UI ships before the IDX feed is approved by Realtracs.

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

const MLS_GRID_BASE = 'https://api.mlsgrid.com/v2'

const MOCK_LISTINGS: Listing[] = [
  {
    mlsId: 'PREVIEW-1001',
    status: 'Active',
    propertyType: 'Single Family',
    listPrice: 749000,
    address: { street: '512 Sample Ave', city: 'Nashville', state: 'TN', zip: '37206' },
    bedrooms: 4, bathrooms: 3, squareFeet: 2450, lotSizeSqft: 6534, yearBuilt: 2018,
    listDate: '2026-04-02', modificationTimestamp: new Date().toISOString(),
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=70',
    photos: [], publicRemarks: 'Sample listing — IDX feed connects on launch.',
    listAgentFullName: 'House Haven Realty', listOfficeName: 'House Haven Realty',
  },
  {
    mlsId: 'PREVIEW-1002',
    status: 'Active',
    propertyType: 'Single Family',
    listPrice: 1150000,
    address: { street: '88 Sample Ln', city: 'Franklin', state: 'TN', zip: '37067' },
    bedrooms: 5, bathrooms: 4, squareFeet: 3600, lotSizeSqft: 12000, yearBuilt: 2020,
    listDate: '2026-04-08', modificationTimestamp: new Date().toISOString(),
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=70',
    photos: [], publicRemarks: 'Sample listing — IDX feed connects on launch.',
    listAgentFullName: 'Listing Agent Name', listOfficeName: 'Listing Brokerage Name',
  },
  {
    mlsId: 'PREVIEW-1003',
    status: 'Active',
    propertyType: 'Condo',
    listPrice: 879000,
    address: { street: '210 Sample Sq', city: 'Nashville', state: 'TN', zip: '37208' },
    bedrooms: 3, bathrooms: 2, squareFeet: 1980, lotSizeSqft: null, yearBuilt: 2022,
    listDate: '2026-04-10', modificationTimestamp: new Date().toISOString(),
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=70',
    photos: [], publicRemarks: 'Sample listing — IDX feed connects on launch.',
    listAgentFullName: 'Listing Agent Name', listOfficeName: 'Listing Brokerage Name',
  },
  {
    mlsId: 'PREVIEW-1004',
    status: 'Active',
    propertyType: 'Single Family',
    listPrice: 625000,
    address: { street: '4400 Sample Pass', city: 'Thompsons Station', state: 'TN', zip: '37179' },
    bedrooms: 4, bathrooms: 3, squareFeet: 2780, lotSizeSqft: 8712, yearBuilt: 2017,
    listDate: '2026-03-29', modificationTimestamp: new Date().toISOString(),
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1605276373954-0c4a0dac5b12?auto=format&fit=crop&w=1200&q=70',
    photos: [], publicRemarks: 'Sample listing — IDX feed connects on launch.',
    listAgentFullName: 'Listing Agent Name', listOfficeName: 'Listing Brokerage Name',
  },
  {
    mlsId: 'PREVIEW-1005',
    status: 'Active',
    propertyType: 'Single Family',
    listPrice: 515000,
    address: { street: '7102 Sample Rd', city: 'Joelton', state: 'TN', zip: '37080' },
    bedrooms: 3, bathrooms: 2, squareFeet: 1840, lotSizeSqft: 21780, yearBuilt: 2014,
    listDate: '2026-04-11', modificationTimestamp: new Date().toISOString(),
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=1200&q=70',
    photos: [], publicRemarks: 'Sample listing — IDX feed connects on launch.',
    listAgentFullName: 'Listing Agent Name', listOfficeName: 'Listing Brokerage Name',
  },
  {
    mlsId: 'PREVIEW-1006',
    status: 'Active',
    propertyType: 'Single Family',
    listPrice: 1495000,
    address: { street: '15 Sample Ct', city: 'Brentwood', state: 'TN', zip: '37027' },
    bedrooms: 5, bathrooms: 4, squareFeet: 4100, lotSizeSqft: 32670, yearBuilt: 2015,
    listDate: '2026-04-04', modificationTimestamp: new Date().toISOString(),
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=70',
    photos: [], publicRemarks: 'Sample listing — IDX feed connects on launch.',
    listAgentFullName: 'Listing Agent Name', listOfficeName: 'Listing Brokerage Name',
  },
  {
    mlsId: 'PREVIEW-1007',
    status: 'Active',
    propertyType: 'Townhouse',
    listPrice: 565000,
    address: { street: '904 Sample Walk', city: 'Nashville', state: 'TN', zip: '37209' },
    bedrooms: 3, bathrooms: 2.5, squareFeet: 1720, lotSizeSqft: 1306, yearBuilt: 2021,
    listDate: '2026-04-12', modificationTimestamp: new Date().toISOString(),
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=70',
    photos: [], publicRemarks: 'Sample listing — IDX feed connects on launch.',
    listAgentFullName: 'Listing Agent Name', listOfficeName: 'Listing Brokerage Name',
  },
  {
    mlsId: 'PREVIEW-1008',
    status: 'Active',
    propertyType: 'Single Family',
    listPrice: 689000,
    address: { street: '233 Sample Pl', city: 'Mt Juliet', state: 'TN', zip: '37122' },
    bedrooms: 4, bathrooms: 3, squareFeet: 2640, lotSizeSqft: 9583, yearBuilt: 2019,
    listDate: '2026-04-09', modificationTimestamp: new Date().toISOString(),
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=70',
    photos: [], publicRemarks: 'Sample listing — IDX feed connects on launch.',
    listAgentFullName: 'Listing Agent Name', listOfficeName: 'Listing Brokerage Name',
  },
]

function applyMockFilters(search: ListingSearch): Listing[] {
  let results = MOCK_LISTINGS
  if (search.city) {
    const c = search.city.toLowerCase()
    results = results.filter((l) => l.address.city.toLowerCase().includes(c))
  }
  if (search.zip) {
    results = results.filter((l) => l.address.zip === search.zip)
  }
  if (search.minPrice) results = results.filter((l) => l.listPrice >= search.minPrice!)
  if (search.maxPrice) results = results.filter((l) => l.listPrice <= search.maxPrice!)
  if (search.beds) results = results.filter((l) => (l.bedrooms ?? 0) >= search.beds!)
  if (search.propertyType) {
    results = results.filter((l) => l.propertyType.toLowerCase() === search.propertyType!.toLowerCase())
  }
  return results.slice(search.offset ?? 0, (search.offset ?? 0) + (search.limit ?? 24))
}

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

export async function searchListings(search: ListingSearch = {}): Promise<{ listings: Listing[]; source: 'mlsgrid' | 'mock' }> {
  const apiKey = process.env.MLS_GRID_API_KEY
  if (!apiKey) {
    return { listings: applyMockFilters(search), source: 'mock' }
  }

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
      return { listings: applyMockFilters(search), source: 'mock' }
    }
    const data = await res.json() as { value?: MLSGridProperty[] }
    return { listings: (data.value ?? []).map(mapMLSGridListing), source: 'mlsgrid' }
  } catch (err) {
    console.error('[mlsgrid] fetch failed', err)
    return { listings: applyMockFilters(search), source: 'mock' }
  }
}

export async function getListing(mlsId: string): Promise<{ listing: Listing | null; source: 'mlsgrid' | 'mock' }> {
  const apiKey = process.env.MLS_GRID_API_KEY
  if (!apiKey) {
    const mock = MOCK_LISTINGS.find((l) => l.mlsId === mlsId)
    return { listing: mock ?? null, source: 'mock' }
  }
  try {
    const url = `${MLS_GRID_BASE}/Property('${mlsId}')?$expand=Media`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
      next: { revalidate: 900 },
    })
    if (!res.ok) {
      console.error('[mlsgrid] listing fetch non-OK', res.status)
      return { listing: null, source: 'mlsgrid' }
    }
    const data = await res.json() as MLSGridProperty
    return { listing: mapMLSGridListing(data), source: 'mlsgrid' }
  } catch (err) {
    console.error('[mlsgrid] listing fetch failed', err)
    return { listing: null, source: 'mlsgrid' }
  }
}
