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
  // For multi-unit buildings, how many permit rows collapse to this marker.
  // 1 for a standalone SFR/townhome; 190 for a condo conversion where each
  // unit has its own permit row but shares the building.
  unitCount: number
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
  // Trust the subtype first — it's a coded value from Metro, more reliable than
  // regex on the free-text Purpose field.
  const sub = (subtypeDesc || '').toLowerCase()
  if (sub.includes('condominium')) return 'condo'
  if (sub.includes('townhome') || sub.includes('townhouse')) return 'townhome'
  if (sub.includes('duplex')) return 'duplex'
  if (sub.startsWith('multifamily')) return 'multi_family'
  if (sub.includes('single family')) return 'single_family'
  if (sub.startsWith('accessory') || sub.includes('adu') || sub.includes('pool')) return 'accessory'

  const combined = `${typeDesc} ${purpose}`.toLowerCase()
  if (/townho(?:me|use)|row house/.test(combined)) return 'townhome'
  if (/condo|condominium|hpr|horizontal property/.test(combined)) return 'condo'
  if (/duplex|two.?family|two.?unit/.test(combined)) return 'duplex'
  if (/multi.?family|apartment|tri-?plex|four-?plex|\d+.?unit/.test(combined)) return 'multi_family'
  if (/accessory|adu|pool|garage|deck|fence|addition/.test(combined)) return 'accessory'
  if (/single.?family|sfr|single family residence/.test(combined)) return 'single_family'
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
    unitCount: 1,
  }
}

// Strip trailing unit markers so "1600 MCGAVOCK ST 606" and "1600 MCGAVOCK ST 612"
// collapse to the same building key.
function buildingKey(p: NormalizedPermit): string {
  const stripped = p.address
    .trim()
    .toUpperCase()
    .replace(/\s+(UNIT|APT|SUITE|STE|#)\s*\S+$/i, '')
    .replace(/\s+[A-Z]?-?\d{1,4}([A-Z]?)?$/i, '')
    .trim()
  return `${stripped}||${p.contractor}`
}

function dedupeByBuilding(permits: NormalizedPermit[]): NormalizedPermit[] {
  const groups = new Map<string, NormalizedPermit[]>()
  for (const p of permits) {
    const key = buildingKey(p)
    const arr = groups.get(key) ?? []
    arr.push(p)
    groups.set(key, arr)
  }
  const result: NormalizedPermit[] = []
  Array.from(groups.values()).forEach((arr: NormalizedPermit[]) => {
    if (arr.length === 1) {
      result.push(arr[0])
      return
    }
    arr.sort((a: NormalizedPermit, b: NormalizedPermit) =>
      (b.dateIssued ?? '').localeCompare(a.dateIssued ?? ''),
    )
    const rep = arr[0]
    const totalCost = arr.reduce(
      (sum: number, p: NormalizedPermit) => sum + (p.constructionCost ?? 0),
      0,
    )
    result.push({
      ...rep,
      constructionCost: totalCost || rep.constructionCost,
      unitCount: arr.length,
    })
  })
  return result
}

// ─── Residential filter ─────────────────────────────────

// Accessory structures aren't homes a buyer can move into; filter them off the
// map. Pools, sheds, carports, garages, detached decks — hide at the subtype
// level so the pipeline shows only dwelling permits.
const ACCESSORY_SUBTYPE_PATTERNS = [
  /^accessory structure/i,
  /pools? -/i,
]

function isHomeBuildingPermit(attrs: ArcGISPermitAttributes): boolean {
  const type = attrs.Permit_Type_Description || ''
  const subtype = attrs.Permit_Subtype_Description || ''

  if (ACCESSORY_SUBTYPE_PATTERNS.some((p) => p.test(subtype))) return false

  // Ground-up residential — the default case (SFR, townhome, duplex,
  // multifamily-condo in the new-construction feed).
  if (type === 'Building Residential - New') return true
  if (type === 'Building Residential - Addition') return true

  // Commercial-rehab with a condo/multifamily subtype — these are the big
  // condo-conversion projects (1600 McGavock, 730 Main, 3509 Charlotte).
  // A buyer who wants new-construction condo inventory needs to see them.
  if (type === 'Building Commercial - Rehab' || type === 'Building Commercial - New') {
    if (/condominium|multifamily/i.test(subtype)) return true
  }

  return false
}

// ─── Fetch from ArcGIS ──────────────────────────────────

// ArcGIS rejects raw epoch-millis in WHERE clauses on this service; use a SQL
// TIMESTAMP literal instead.
function toArcGISTimestamp(date: Date): string {
  return `TIMESTAMP '${date.toISOString().slice(0, 19).replace('T', ' ')}'`
}

function buildHomeWhereClause(since: Date): string {
  // Includes ground-up residential (SFR, townhome, duplex, multifamily-new)
  // AND condo conversions filed as Commercial-Rehab/New. Excludes accessory
  // structures (pools, sheds, garages, carports, decks) at the subtype level
  // so the map shows dwellings only.
  return [
    `Date_Issued > ${toArcGISTimestamp(since)}`,
    `AND (`,
    `  (Permit_Type_Description IN ('Building Residential - New','Building Residential - Addition'))`,
    `  OR (Permit_Type_Description IN ('Building Commercial - Rehab','Building Commercial - New')`,
    `      AND (Permit_Subtype_Description LIKE '%Condominium%' OR Permit_Subtype_Description LIKE 'Multifamily%'))`,
    `)`,
    `AND Permit_Subtype_Description NOT LIKE 'Accessory Structure%'`,
    `AND Permit_Subtype_Description NOT LIKE 'Pools %'`,
  ].join(' ')
}

export async function fetchRecentPermits(options: {
  days?: number
  limit?: number
} = {}): Promise<NormalizedPermit[]> {
  const { days = 180, limit = 1000 } = options
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const params = new URLSearchParams({
    where: buildHomeWhereClause(since),
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

    const normalized = data.features
      .map((f: { attributes: ArcGISPermitAttributes }) => f.attributes)
      .filter(isHomeBuildingPermit)
      .map(normalize)
    return dedupeByBuilding(normalized)
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

  const params = new URLSearchParams({
    where: `Date_Issued > ${toArcGISTimestamp(since)}`,
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

// ─── Metro ePermits REST API (inspection tasks) ─────────

import type { EPermitsCase, EPermitsCaseTask } from './permit-stages'

const EPERMITS_BASE = 'https://epermits.nashville.gov/api/permit/1.0'
const EPERMITS_UA = 'HouseHaven-Realty/1.0 (+stephen@househavenrealty.com)'
const EPERMITS_TIMEOUT_MS = 5000

async function epermitsFetch<T>(path: string): Promise<T | null> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), EPERMITS_TIMEOUT_MS)
  try {
    const res = await fetch(`${EPERMITS_BASE}/${path}`, {
      headers: { Accept: 'application/json', 'User-Agent': EPERMITS_UA },
      signal: ctrl.signal,
      cache: 'no-store',
    })
    if (!res.ok) {
      console.error('[epermits] non-ok', res.status, path)
      return null
    }
    return (await res.json()) as T
  } catch (err) {
    console.error('[epermits] fetch failed', path, err)
    return null
  } finally {
    clearTimeout(timer)
  }
}

export async function fetchCaseByPermitNumber(
  permitNumber: string,
): Promise<EPermitsCase | null> {
  const filter = encodeURIComponent(`caseNumber eq '${permitNumber.replace(/'/g, "''")}'`)
  const data = await epermitsFetch<{ value: EPermitsCase[] }>(
    `Case?$filter=${filter}&$top=1`,
  )
  return data?.value?.[0] ?? null
}

// Single-permit ArcGIS lookup by permit number. Used when building_permits cache
// lacks a row (daily sync hasn't run yet) and we still need the APN for parcel lookup.
export async function fetchPermitByNumber(permitNumber: string): Promise<NormalizedPermit | null> {
  const escaped = permitNumber.replace(/'/g, "''")
  const params = new URLSearchParams({
    where: `Permit__ = '${escaped}'`,
    outFields: '*',
    f: 'json',
  })
  try {
    const res = await fetch(`${ARCGIS_PERMITS_URL}?${params}`, {
      next: { revalidate: 60 * 60 * 24 }, // parcel-per-permit rarely changes
    })
    if (!res.ok) return null
    const data = await res.json()
    const attrs = (data as { features?: { attributes: ArcGISPermitAttributes }[] }).features?.[0]
      ?.attributes
    if (!attrs) return null
    return normalize(attrs)
  } catch {
    return null
  }
}

// ─── Metro Nashville parcels (lot size, zoning) ────────

const ARCGIS_PARCELS_URL =
  'https://services2.arcgis.com/HdTo6HJqh92wn4D8/arcgis/rest/services/Parcels_view/FeatureServer/0/query'

export interface ParcelInfo {
  apn: string
  acres: number | null
  zoning: string | null
  landUse: string | null
  address: string | null
}

interface ParcelAttrs {
  STANPAR: string
  Acres: number | null
  Zoning: string | null
  LUDesc: string | null
  PropAddr: string | null
}

export async function fetchParcelByAPN(apn: string): Promise<ParcelInfo | null> {
  if (!apn) return null
  const escaped = apn.replace(/'/g, "''")
  const params = new URLSearchParams({
    where: `STANPAR = '${escaped}'`,
    outFields: 'STANPAR,Acres,Zoning,LUDesc,PropAddr',
    returnGeometry: 'false',
    f: 'json',
  })
  try {
    const res = await fetch(`${ARCGIS_PARCELS_URL}?${params}`, {
      next: { revalidate: 60 * 60 * 24 * 7 }, // parcels rarely change — 7-day cache
    })
    if (!res.ok) return null
    const data = (await res.json()) as { features?: { attributes: ParcelAttrs }[] }
    const row = data.features?.[0]?.attributes
    if (!row) return null
    return {
      apn: row.STANPAR,
      acres: typeof row.Acres === 'number' && row.Acres > 0 ? row.Acres : null,
      zoning: row.Zoning || null,
      landUse: row.LUDesc || null,
      address: row.PropAddr || null,
    }
  } catch (err) {
    console.error('[parcels] fetch failed', apn, err)
    return null
  }
}

export async function fetchCaseTasks(caseId: number): Promise<EPermitsCaseTask[]> {
  const data = await epermitsFetch<{ value: EPermitsCaseTask[] }>(
    `CaseTask?$filter=caseID eq ${caseId}&$orderby=scheduledDate asc`,
  )
  return data?.value ?? []
}
