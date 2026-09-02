// Search criteria parsing, redaction, and coverage math for the permit search
// API. Kept free of Supabase and Next so it can be unit-tested directly — the
// route is a thin shell over these functions.

export const SORT_FIELDS = ['date_issued', 'construction_cost'] as const
export type SortField = (typeof SORT_FIELDS)[number]

export const PROPERTY_TYPES = [
  'single_family',
  'townhome',
  'condo',
  'duplex',
  'multi_family',
  'accessory',
  'commercial',
  'unknown',
] as const
export type PropertyType = (typeof PROPERTY_TYPES)[number]

export const MAX_PAGE_SIZE = 100
export const DEFAULT_PAGE_SIZE = 25

export interface PermitSearchCriteria {
  q: string | null
  zips: string[]
  propertyTypes: PropertyType[]
  costMin: number | null
  costMax: number | null
  sqftMin: number | null
  sqftMax: number | null
  bedroomsMin: number | null
  bathroomsMin: number | null
  dateFrom: string | null
  dateTo: string | null
  contractorKey: string | null
  sort: SortField
  direction: 'asc' | 'desc'
  page: number
  pageSize: number
}

function intOrNull(raw: string | null, opts: { min?: number; max?: number } = {}): number | null {
  if (raw === null || raw.trim() === '') return null
  const n = Number(raw)
  if (!Number.isFinite(n)) return null
  const clamped = Math.min(Math.max(n, opts.min ?? -Infinity), opts.max ?? Infinity)
  return Math.trunc(clamped)
}

/** Like intOrNull but keeps halves — 2.5 baths is real data. */
function numOrNull(raw: string | null, opts: { min?: number; max?: number } = {}): number | null {
  if (raw === null || raw.trim() === '') return null
  const n = Number(raw)
  if (!Number.isFinite(n)) return null
  return Math.min(Math.max(n, opts.min ?? -Infinity), opts.max ?? Infinity)
}

/** ISO date (YYYY-MM-DD) or null. Rejects anything else rather than guessing. */
function isoDateOrNull(raw: string | null): string | null {
  if (!raw) return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw.trim())) return null
  const d = new Date(`${raw.trim()}T00:00:00Z`)
  return Number.isNaN(d.getTime()) ? null : raw.trim()
}

function csv(raw: string | null): string[] {
  if (!raw) return []
  return Array.from(
    new Set(
      raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  )
}

/**
 * PostgREST's `or=` filter is comma/paren delimited, so those characters in
 * user input would break out of the intended clause. Strip them along with the
 * LIKE wildcards rather than trying to escape them.
 */
export function sanitizeFreeText(raw: string): string {
  return raw.replace(/[,()%*\\]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120)
}

export function parseSearchCriteria(sp: URLSearchParams): PermitSearchCriteria {
  const rawQ = sp.get('q')
  const q = rawQ ? sanitizeFreeText(rawQ) || null : null

  const sortRaw = sp.get('sort')
  const sort: SortField = (SORT_FIELDS as readonly string[]).includes(sortRaw ?? '')
    ? (sortRaw as SortField)
    : 'date_issued'

  const dirRaw = sp.get('direction')
  const direction: 'asc' | 'desc' = dirRaw === 'asc' ? 'asc' : 'desc'

  const contractorRaw = sp.get('contractor')

  return {
    q,
    zips: csv(sp.get('zip')).filter((z) => /^\d{5}$/.test(z)),
    propertyTypes: csv(sp.get('propertyType')).filter((t): t is PropertyType =>
      (PROPERTY_TYPES as readonly string[]).includes(t),
    ),
    costMin: intOrNull(sp.get('costMin'), { min: 0 }),
    costMax: intOrNull(sp.get('costMax'), { min: 0 }),
    sqftMin: intOrNull(sp.get('sqftMin'), { min: 0 }),
    sqftMax: intOrNull(sp.get('sqftMax'), { min: 0 }),
    bedroomsMin: intOrNull(sp.get('bedroomsMin'), { min: 0, max: 20 }),
    bathroomsMin: numOrNull(sp.get('bathroomsMin'), { min: 0, max: 20 }),
    dateFrom: isoDateOrNull(sp.get('dateFrom')),
    dateTo: isoDateOrNull(sp.get('dateTo')),
    contractorKey: contractorRaw?.trim() ? contractorRaw.toUpperCase().trim() : null,
    sort,
    direction,
    page: intOrNull(sp.get('page'), { min: 1 }) ?? 1,
    pageSize: intOrNull(sp.get('pageSize'), { min: 1, max: MAX_PAGE_SIZE }) ?? DEFAULT_PAGE_SIZE,
  }
}

// ─── Redaction ──────────────────────────────────────────

/**
 * Public results show the street, never the house number. Every row in
 * building_permits starts with a house number, so dropping the leading numeric
 * token (plus any unit letter like "565 A VERITAS ST") is reliable.
 */
export function streetOnly(address: string | null): string {
  if (!address) return ''
  return address
    .trim()
    .replace(/^\d+\s*(?:[-/]\s*\d+)?\s*/, '')
    .replace(/^[A-Za-z]\s+(?=[A-Za-z])/, '')
    .trim()
}

export interface PermitRow {
  permit_number: string
  address: string | null
  zip: string | null
  property_type: string | null
  construction_cost: number | null
  sqft: number | null
  bedrooms: number | null
  bathrooms: number | null
  date_issued: string | null
  contractor: string | null
  contractor_key: string | null
  status: string | null
  parcel: string | null
  subdivision: string | null
  lat: number | null
  lng: number | null
}

export interface PublicPermitResult {
  permitNumber: string
  street: string
  zip: string | null
  propertyType: string | null
  constructionCost: number | null
  sqft: number | null
  bedrooms: number | null
  bathrooms: number | null
  dateIssued: string | null
  builder: string | null
  builderSlug: string | null
  status: string | null
}

export interface AgentPermitResult extends PublicPermitResult {
  address: string | null
  parcel: string | null
  subdivision: string | null
  lat: number | null
  lng: number | null
}

/** Columns the public surface is allowed to read. No address, no parcel. */
export const PUBLIC_SELECT =
  'permit_number, address, zip, property_type, construction_cost, sqft, bedrooms, bathrooms, date_issued, contractor, contractor_key, status'

export const AGENT_SELECT = `${PUBLIC_SELECT}, parcel, subdivision, lat, lng`

export function toPublicResult(
  row: PermitRow,
  slugify: (name: string) => string,
  isRealBuilder: (name: string | null) => boolean,
): PublicPermitResult {
  const key = row.contractor_key ?? (row.contractor ? row.contractor.toUpperCase().trim() : null)
  return {
    permitNumber: row.permit_number,
    street: streetOnly(row.address),
    zip: row.zip,
    propertyType: row.property_type,
    constructionCost: row.construction_cost,
    sqft: row.sqft,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    dateIssued: row.date_issued,
    builder: key,
    builderSlug: key && isRealBuilder(key) ? slugify(key) : null,
    status: row.status,
  }
}

export function toAgentResult(
  row: PermitRow,
  slugify: (name: string) => string,
  isRealBuilder: (name: string | null) => boolean,
): AgentPermitResult {
  return {
    ...toPublicResult(row, slugify, isRealBuilder),
    address: row.address,
    parcel: row.parcel,
    subdivision: row.subdivision,
    lat: row.lat,
    lng: row.lng,
  }
}

// ─── Coverage ───────────────────────────────────────────

export interface RecordedRates {
  total: number
  bedrooms: number
  bathrooms: number
  sqft: number
}

export interface Coverage {
  from: string | null
  to: string | null
  days: number | null
  label: string
  /**
   * Beds, baths and sqft are parsed from Metro's free-text permit purpose and
   * are absent on most rehab/condo permits. Surfaced so the UI can say so
   * instead of letting a beds filter silently look like "no condos exist".
   */
  recorded: RecordedRates | null
}

/**
 * Never state a window the data doesn't have. ArcGIS truncates at the row cap
 * before the 180-day request window ever binds, so coverage is computed from
 * the actual min/max of date_issued and never hardcoded.
 */
export function computeCoverage(
  min: string | null,
  max: string | null,
  recorded: RecordedRates | null = null,
): Coverage {
  if (!min || !max) {
    return { from: null, to: null, days: null, label: 'Coverage unknown — no permits loaded', recorded }
  }
  const from = new Date(min)
  const to = new Date(max)
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return { from: null, to: null, days: null, label: 'Coverage unknown', recorded }
  }
  const days = Math.max(1, Math.round((to.getTime() - from.getTime()) / 86_400_000))
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
  return {
    from: min,
    to: max,
    days,
    label: `${days} days of permits — ${fmt(from)} to ${fmt(to)}`,
    recorded,
  }
}

/** CSV escaping for the agent export. */
export function toCsv(rows: AgentPermitResult[]): string {
  const headers = [
    'permit_number', 'address', 'zip', 'property_type', 'construction_cost',
    'sqft', 'bedrooms', 'bathrooms', 'date_issued', 'builder', 'parcel',
    'subdivision', 'lat', 'lng', 'status',
  ]
  const esc = (v: unknown) => {
    if (v === null || v === undefined) return ''
    const s = String(v)
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = [headers.join(',')]
  for (const r of rows) {
    lines.push([
      r.permitNumber, r.address, r.zip, r.propertyType, r.constructionCost,
      r.sqft, r.bedrooms, r.bathrooms, r.dateIssued, r.builder, r.parcel,
      r.subdivision, r.lat, r.lng, r.status,
    ].map(esc).join(','))
  }
  return lines.join('\n')
}
