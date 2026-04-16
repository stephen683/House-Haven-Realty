// Nashville Building Permits — ArcGIS Feature Service
// Source: Metro Nashville Codes Department via Nashville Open Data Portal
// Endpoint: services2.arcgis.com/HdTo6HJqh92wn4D8/arcgis/rest/services/Building_Permits_Issued_2/FeatureServer/0

const ARCGIS_PERMITS_URL =
  'https://services2.arcgis.com/HdTo6HJqh92wn4D8/arcgis/rest/services/Building_Permits_Issued_2/FeatureServer/0/query'

export interface ArcGISPermitAttributes {
  Permit__: string
  Permit_Type_Description: string
  Permit_Subtype_Description: string
  Parcel: string
  Date_Entered: number | null
  Date_Issued: number | null
  Const_Cost: number | null
  Address: string
  City: string
  State: string
  ZIP: string
  Subdivision_Lot: string
  Contact: string
  Per_Ty: string
  Per_SubTy: string
  Purpose: string
  Council_Dist: number | null
  Census_Tract: number | null
  Lon: number | null
  Lat: number | null
  ObjectId: number
}

export interface NormalizedPermit {
  permitNumber: string
  type: string
  subtype: string
  dateIssued: string | null
  dateEntered: string | null
  address: string
  city: string
  zip: string
  description: string
  constructionCost: number | null
  contractor: string
  status: string
  parcel: string
  subdivision: string
  lat: number | null
  lng: number | null
  councilDistrict: number | null
  censusTract: number | null
  // Parsed from Purpose field
  sqft: number | null
  bedrooms: number | null
  bathrooms: number | null
  propertyType: 'single_family' | 'townhome' | 'condo' | 'duplex' | 'multi_family' | 'accessory' | 'commercial' | 'unknown'
  // Computed
  daysAgo: number
}

// ─── Purpose field parser ───────────────────────────────

function parseSqft(purpose: string): number | null {
  // Match patterns like "2542 sq.ft.", "1,922SF", "2542 sqft", "2542 sq ft"
  const patterns = [
    /(\d[\d,]*)\s*(?:sq\.?\s*ft|sqft|sf)\b/i,
    /construct\s+(?:a\s+)?(\d[\d,]*)\s*(?:sq|sf)/i,
    /(\d[\d,]*)\s*(?:square\s+feet|square\s+foot)/i,
  ]
  for (const p of patterns) {
    const m = purpose.match(p)
    if (m) {
      const val = parseInt(m[1].replace(/,/g, ''), 10)
      if (val > 100 && val < 50000) return val
    }
  }
  return null
}

function parseBedrooms(purpose: string): number | null {
  const m = purpose.match(/(\d+)\s*(?:bed(?:room)?s?|br|bd)\b/i)
  if (m) {
    const val = parseInt(m[1], 10)
    if (val >= 1 && val <= 20) return val
  }
  return null
}

function parseBathrooms(purpose: string): number | null {
  // Match "2 1/2 bath" → 2.5, "3 bath" → 3, "2.5 bath" → 2.5
  const mFraction = purpose.match(/(\d+)\s+(\d)\/(\d)\s*bath/i)
  if (mFraction) {
    return parseInt(mFraction[1], 10) + parseInt(mFraction[2], 10) / parseInt(mFraction[3], 10)
  }
  const m = purpose.match(/(\d+(?:\.\d)?)\s*(?:bath(?:room)?s?|ba)\b/i)
  if (m) {
    const val = parseFloat(m[1])
    if (val >= 1 && val <= 20) return val
  }
  return null
}

function parsePropertyType(
  typeDesc: string,
  subtypeDesc: string,
  purpose: string,
): NormalizedPermit['propertyType'] {
  const combined = `${typeDesc} ${subtypeDesc} ${purpose}`.toLowerCase()
  if (/single.?family|sfr|single family residence/.test(combined)) return 'single_family'
  if (/townho(?:me|use)|row house|attached/.test(combined)) return 'townhome'
  if (/condo|condominium|hpr|horizontal property/.test(combined)) return 'condo'
  if (/duplex|two.?family|two.?unit/.test(combined)) return 'duplex'
  if (/multi.?family|apartment|tri-?plex|four-?plex|\d+.?unit/.test(combined)) return 'multi_family'
  if (/accessory|adu|pool|garage|deck|fence|addition/.test(combined)) return 'accessory'
  if (/commercial|restaurant|retail|office|warehouse/.test(combined)) return 'commercial'
  if (/residential/.test(combined)) return 'single_family'
  return 'unknown'
}

// ─── Normalization ──────────────────────────────────────

function epochToIso(epoch: number | null): string | null {
  if (!epoch) return null
  return new Date(epoch).toISOString()
}

function normalize(attrs: ArcGISPermitAttributes): NormalizedPermit {
  const purpose = attrs.Purpose || ''
  const dateIssued = epochToIso(attrs.Date_Issued)

  return {
    permitNumber: String(attrs.Permit__ || ''),
    type: attrs.Permit_Type_Description || 'Unknown',
    subtype: attrs.Permit_Subtype_Description || '',
    dateIssued,
    dateEntered: epochToIso(attrs.Date_Entered),
    address: attrs.Address || '',
    city: attrs.City || 'Nashville',
    zip: attrs.ZIP || '',
    description: purpose,
    constructionCost: attrs.Const_Cost || null,
    contractor: attrs.Contact || '',
    status: 'issued',
    parcel: attrs.Parcel || '',
    subdivision: attrs.Subdivision_Lot || '',
    lat: attrs.Lat && Number.isFinite(attrs.Lat) ? attrs.Lat : null,
    lng: attrs.Lon && Number.isFinite(attrs.Lon) ? attrs.Lon : null,
    councilDistrict: attrs.Council_Dist || null,
    censusTract: attrs.Census_Tract || null,
    sqft: parseSqft(purpose),
    bedrooms: parseBedrooms(purpose),
    bathrooms: parseBathrooms(purpose),
    propertyType: parsePropertyType(
      attrs.Permit_Type_Description || '',
      attrs.Permit_Subtype_Description || '',
      purpose,
    ),
    daysAgo: dateIssued
      ? Math.floor((Date.now() - new Date(dateIssued).getTime()) / (1000 * 60 * 60 * 24))
      : 999,
  }
}

// ─── Residential filter ─────────────────────────────────

const RESIDENTIAL_TYPES = [
  'Building Residential - New',
  'Building Residential - Addition',
]

function isResidentialNew(attrs: ArcGISPermitAttributes): boolean {
  const type = attrs.Permit_Type_Description || ''
  return RESIDENTIAL_TYPES.some((t) => type.includes(t))
}

// ─── Fetch from ArcGIS ──────────────────────────────────

export async function fetchRecentPermits(options: {
  days?: number
  limit?: number
} = {}): Promise<NormalizedPermit[]> {
  const { days = 180, limit = 500 } = options
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const sinceEpoch = since.getTime()

  const params = new URLSearchParams({
    where: `Date_Issued > ${sinceEpoch} AND Permit_Type_Description LIKE '%Residential%New%'`,
    outFields: '*',
    resultRecordCount: String(limit),
    orderByFields: 'Date_Issued DESC',
    f: 'json',
  })

  try {
    const res = await fetch(`${ARCGIS_PERMITS_URL}?${params}`, {
      next: { revalidate: 60 * 60 * 6 }, // 6 hours
    })

    if (!res.ok) {
      console.error('[permits] ArcGIS API error', res.status)
      return []
    }

    const data = await res.json()

    if (!data.features || !Array.isArray(data.features)) {
      console.error('[permits] ArcGIS returned no features')
      return []
    }

    return data.features
      .map((f: { attributes: ArcGISPermitAttributes }) => f.attributes)
      .filter(isResidentialNew)
      .map(normalize)
  } catch (err) {
    console.error('[permits] ArcGIS fetch failed', err)
    return []
  }
}

// ─── Fetch ALL permits (for saturation score) ───────────

export async function fetchAllPermits(options: {
  days?: number
  limit?: number
} = {}): Promise<NormalizedPermit[]> {
  const { days = 365, limit = 2000 } = options
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const sinceEpoch = since.getTime()

  const params = new URLSearchParams({
    where: `Date_Issued > ${sinceEpoch}`,
    outFields: '*',
    resultRecordCount: String(limit),
    orderByFields: 'Date_Issued DESC',
    f: 'json',
  })

  try {
    const res = await fetch(`${ARCGIS_PERMITS_URL}?${params}`, {
      next: { revalidate: 60 * 60 * 6 },
    })
    if (!res.ok) return []
    const data = await res.json()
    if (!data.features) return []
    return data.features
      .map((f: { attributes: ArcGISPermitAttributes }) => normalize(f.attributes))
  } catch {
    return []
  }
}
