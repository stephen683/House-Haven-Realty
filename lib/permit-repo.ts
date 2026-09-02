// Server-only reads of the building_permits cache as NormalizedPermit — the
// same shape the live ArcGIS path produces, so the map, the stats header and
// the search all describe one corpus instead of three.
//
// Uses the service role: the browser client can also read this table under the
// public RLS policy, but these callers run in route handlers and server
// components and must not depend on request cookies.

import { createClient } from '@supabase/supabase-js'
import type { NormalizedPermit } from './permits'

const COLUMNS =
  'permit_number, permit_type, subtype, date_issued, address, city, zip, description, ' +
  'construction_cost, contractor, status, parcel, subdivision, lat, lng, ' +
  'council_district, census_tract, sqft, bedrooms, bathrooms, property_type, unit_count'

interface Row {
  permit_number: string
  permit_type: string | null
  subtype: string | null
  date_issued: string | null
  address: string | null
  city: string | null
  zip: string | null
  description: string | null
  construction_cost: number | null
  contractor: string | null
  status: string | null
  parcel: string | null
  subdivision: string | null
  lat: number | null
  lng: number | null
  council_district: number | null
  census_tract: number | null
  sqft: number | null
  bedrooms: number | null
  bathrooms: number | null
  property_type: string | null
  unit_count: number | null
}

const PROPERTY_TYPES = new Set<NormalizedPermit['propertyType']>([
  'single_family', 'townhome', 'condo', 'duplex', 'multi_family', 'accessory', 'commercial', 'unknown',
])

function daysAgo(iso: string | null): number {
  if (!iso) return 999
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
}

export function rowToPermit(r: Row): NormalizedPermit {
  const pt = (r.property_type ?? 'unknown') as NormalizedPermit['propertyType']
  return {
    permitNumber: r.permit_number,
    type: r.permit_type ?? 'Unknown',
    subtype: r.subtype ?? '',
    dateIssued: r.date_issued,
    dateEntered: null,
    address: r.address ?? '',
    city: r.city ?? 'Nashville',
    zip: r.zip ?? '',
    description: r.description ?? '',
    constructionCost: r.construction_cost === null ? null : Number(r.construction_cost),
    contractor: r.contractor ?? '',
    status: r.status ?? 'issued',
    parcel: r.parcel ?? '',
    subdivision: r.subdivision ?? '',
    lat: r.lat,
    lng: r.lng,
    councilDistrict: r.council_district,
    censusTract: r.census_tract === null ? null : Number(r.census_tract),
    sqft: r.sqft,
    bedrooms: r.bedrooms,
    bathrooms: r.bathrooms === null ? null : Number(r.bathrooms),
    propertyType: PROPERTY_TYPES.has(pt) ? pt : 'unknown',
    daysAgo: daysAgo(r.date_issued),
    unitCount: Math.max(1, r.unit_count ?? 1),
  }
}

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

/**
 * Every cached permit, newest first. Returns [] (and logs) when the cache is
 * unreachable or empty so callers can fall back to the live feed.
 */
export async function loadCachedPermits(options: { limit?: number } = {}): Promise<NormalizedPermit[]> {
  const supabase = client()
  if (!supabase) return []
  const limit = options.limit ?? 10_000

  const { data, error } = await supabase
    .from('building_permits')
    .select(COLUMNS)
    .order('date_issued', { ascending: false, nullsFirst: false })
    .limit(limit)

  if (error) {
    console.error('[permit-repo] read failed:', error.message)
    return []
  }
  return ((data ?? []) as unknown as Row[]).map(rowToPermit)
}

/**
 * Map pins carry a trimmed description. The full corpus is ~3.3 MB raw and
 * 2.1 MB of that is Metro boilerplate after the first sentence or two
 * ("not to build over easements…"). The essence — what is being built, how
 * big — is in the first couple hundred characters.
 */
export const MAP_DESCRIPTION_CHARS = 240

export function trimForMap(text: string | null | undefined, max = MAP_DESCRIPTION_CHARS): string {
  const t = (text ?? '').replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…'
}
