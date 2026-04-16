// Nashville Open Data — Building Permits Issued
// Socrata/SODA API · https://data.nashville.gov/resource/96ap-mfmf.json

const NASHVILLE_PERMITS_URL =
  process.env.NASHVILLE_PERMITS_API ||
  'https://data.nashville.gov/resource/96ap-mfmf.json'

export interface NashvillePermit {
  permit_number: string
  permit_type_description?: string
  date_issued?: string
  address?: string
  city?: string
  zip?: string
  description?: string
  const_cost?: string
  contact?: string
  status?: string
  mapped_location?: {
    latitude: string
    longitude: string
  }
}

export interface NormalizedPermit {
  permitNumber: string
  type: string
  dateIssued: string | null
  address: string
  city: string
  zip: string
  description: string
  constructionCost: number | null
  contractor: string
  status: string
  lat: number | null
  lng: number | null
}

const RESIDENTIAL_KEYWORDS = [
  'NEW RESIDENTIAL',
  'NEW CONSTRUCTION',
  'BUILDING - NEW',
  'BUILDING RESIDENTIAL - NEW',
  'BLDG ADDITION RESIDENTIAL',
  'BUILDING USE & OCCUPANCY',
]

function isResidentialNew(type?: string) {
  if (!type) return false
  const upper = type.toUpperCase()
  return RESIDENTIAL_KEYWORDS.some((k) => upper.includes(k))
}

function normalize(p: NashvillePermit): NormalizedPermit {
  const lat = p.mapped_location?.latitude ? parseFloat(p.mapped_location.latitude) : null
  const lng = p.mapped_location?.longitude ? parseFloat(p.mapped_location.longitude) : null
  return {
    permitNumber: p.permit_number,
    type: p.permit_type_description || 'Unknown',
    dateIssued: p.date_issued || null,
    address: p.address || '',
    city: p.city || '',
    zip: p.zip || '',
    description: p.description || '',
    constructionCost: p.const_cost ? parseFloat(p.const_cost) : null,
    contractor: p.contact || '',
    status: p.status || '',
    lat: Number.isFinite(lat ?? NaN) ? lat : null,
    lng: Number.isFinite(lng ?? NaN) ? lng : null,
  }
}

/**
 * Fetch recent residential construction permits from Nashville's open data portal.
 * Days defaults to 90. Returns up to `limit` records normalized for our UI.
 */
export async function fetchRecentPermits(options: {
  days?: number
  limit?: number
} = {}): Promise<NormalizedPermit[]> {
  const { days = 90, limit = 200 } = options
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const sinceIso = since.toISOString().split('.')[0] // Socrata accepts YYYY-MM-DDTHH:MM:SS

  const params = new URLSearchParams({
    $limit: String(limit),
    $order: 'date_issued DESC',
    $where: `date_issued > '${sinceIso}'`,
  })

  const token = process.env.NASHVILLE_DATA_APP_TOKEN
  const headers: Record<string, string> = {}
  if (token) headers['X-App-Token'] = token

  try {
    const res = await fetch(`${NASHVILLE_PERMITS_URL}?${params}`, {
      headers,
      next: { revalidate: 60 * 60 * 6 }, // 6 hours
    })
    if (!res.ok) {
      console.error('[permits] Nashville API error', res.status)
      return []
    }
    const data = (await res.json()) as NashvillePermit[]
    return data
      .filter((p) => isResidentialNew(p.permit_type_description))
      .map(normalize)
  } catch (err) {
    console.error('[permits] fetch failed', err)
    return []
  }
}
