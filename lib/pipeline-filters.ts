// One filter model, two consumers: the MapLibre expression that filters the map
// and the query string that drives /api/pipeline/search. If they drift, the map
// shows a different set than the results list.

import type { FilterSpecification } from 'maplibre-gl'

export const PROPERTY_TYPE_OPTIONS = [
  { value: 'single_family', label: 'Single family' },
  { value: 'townhome', label: 'Townhome' },
  { value: 'condo', label: 'Condo' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'multi_family', label: 'Multi-family' },
  { value: 'accessory', label: 'ADU / accessory' },
] as const
export type PropertyTypeValue = (typeof PROPERTY_TYPE_OPTIONS)[number]['value']

export interface FilterState {
  dateRange: 'all' | '7' | '30' | '90' | '180'
  costMin: string
  costMax: string
  sqftMin: string
  sqftMax: string
  /** Multi-select. Empty means all. */
  zips: string[]
  /** Multi-select. Empty means all. */
  propertyTypes: string[]
  /** Minimum bedrooms, '' for any. */
  beds: string
  /** Minimum bathrooms, '' for any. Halves allowed ('2.5'). */
  baths: string
  q: string
  contractorKey: string
}

export const EMPTY_FILTERS: FilterState = {
  dateRange: 'all',
  costMin: '',
  costMax: '',
  sqftMin: '',
  sqftMax: '',
  zips: [],
  propertyTypes: [],
  beds: '',
  baths: '',
  q: '',
  contractorKey: '',
}

const num = (s: string) => {
  if (s.trim() === '') return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

export function filterStateToExpression(f: FilterState): FilterSpecification | null {
  const c: unknown[] = []

  if (f.dateRange !== 'all') c.push(['<=', ['get', 'daysAgo'], Number(f.dateRange)])

  const costMin = num(f.costMin)
  const costMax = num(f.costMax)
  if (costMin !== null) c.push(['>=', ['coalesce', ['get', 'constructionCost'], -1], costMin])
  if (costMax !== null) c.push(['<=', ['coalesce', ['get', 'constructionCost'], costMax + 1], costMax])

  const sqftMin = num(f.sqftMin)
  const sqftMax = num(f.sqftMax)
  if (sqftMin !== null) c.push(['>=', ['coalesce', ['get', 'sqft'], -1], sqftMin])
  if (sqftMax !== null) c.push(['<=', ['coalesce', ['get', 'sqft'], sqftMax + 1], sqftMax])

  if (f.zips.length) c.push(['in', ['get', 'zip'], ['literal', f.zips]])
  if (f.propertyTypes.length) c.push(['in', ['get', 'propertyType'], ['literal', f.propertyTypes]])

  // Nulls must fail a >= test, exactly as SQL `bedrooms >= n` excludes NULL.
  const beds = num(f.beds)
  if (beds !== null) c.push(['>=', ['coalesce', ['get', 'bedrooms'], -1], beds])
  const baths = num(f.baths)
  if (baths !== null) c.push(['>=', ['coalesce', ['get', 'bathrooms'], -1], baths])

  if (f.contractorKey) {
    c.push(['==', ['upcase', ['coalesce', ['get', 'contractor'], '']], f.contractorKey])
  }

  // Mirrors SQL `address ilike %q% OR contractor ilike %q% OR zip ilike %q%`.
  // `in` with a string haystack is a substring test in the MapLibre spec.
  const q = f.q.trim().toLowerCase()
  if (q) {
    c.push([
      'any',
      ['in', q, ['downcase', ['coalesce', ['get', 'address'], '']]],
      ['in', q, ['downcase', ['coalesce', ['get', 'contractor'], '']]],
      ['in', q, ['downcase', ['coalesce', ['get', 'zip'], '']]],
    ])
  }

  if (c.length === 0) return null
  return ['all', ...c] as unknown as FilterSpecification
}

export function filterStateToSearchParams(
  f: FilterState,
  opts: {
    page?: number
    pageSize?: number
    sort?: 'date_issued' | 'construction_cost'
    direction?: 'asc' | 'desc'
    format?: 'csv'
  } = {},
): URLSearchParams {
  const sp = new URLSearchParams()

  if (f.q.trim()) sp.set('q', f.q.trim())
  if (f.zips.length) sp.set('zip', f.zips.join(','))
  if (f.propertyTypes.length) sp.set('propertyType', f.propertyTypes.join(','))
  if (f.costMin.trim()) sp.set('costMin', f.costMin.trim())
  if (f.costMax.trim()) sp.set('costMax', f.costMax.trim())
  if (f.sqftMin.trim()) sp.set('sqftMin', f.sqftMin.trim())
  if (f.sqftMax.trim()) sp.set('sqftMax', f.sqftMax.trim())
  if (f.beds) sp.set('bedroomsMin', f.beds)
  if (f.baths) sp.set('bathroomsMin', f.baths)
  if (f.contractorKey) sp.set('contractor', f.contractorKey)

  // The map thinks in "days ago"; the API thinks in absolute dates.
  if (f.dateRange !== 'all') {
    const from = new Date(Date.now() - Number(f.dateRange) * 86_400_000)
    sp.set('dateFrom', from.toISOString().slice(0, 10))
  }

  if (opts.page && opts.page > 1) sp.set('page', String(opts.page))
  if (opts.pageSize) sp.set('pageSize', String(opts.pageSize))
  if (opts.sort) sp.set('sort', opts.sort)
  if (opts.direction) sp.set('direction', opts.direction)
  if (opts.format) sp.set('format', opts.format)

  return sp
}

export function activeFilterCount(f: FilterState): number {
  return [
    f.dateRange !== 'all',
    f.costMin !== '' || f.costMax !== '',
    f.sqftMin !== '' || f.sqftMax !== '',
    f.zips.length > 0,
    f.propertyTypes.length > 0,
    f.beds !== '',
    f.baths !== '',
    f.q.trim() !== '',
    f.contractorKey !== '',
  ].filter(Boolean).length
}

/** A bare 5-digit query is a ZIP, and should filter as one. */
export const isZipQuery = (s: string) => /^\d{5}$/.test(s.trim())

export function toggleInList(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}
