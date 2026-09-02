// One filter model, two consumers: the MapLibre expression that filters the map
// and the query string that drives /api/pipeline/search. Extracted from
// MapFilters so the list and the map can never drift out of sync.

import type { FilterSpecification } from 'maplibre-gl'

export interface FilterState {
  dateRange: 'all' | '7' | '30' | '90'
  costMin: string
  costMax: string
  zip: string
  beds: string
  propertyType: string
  q: string
  sqftMin: string
  sqftMax: string
  contractorKey: string
}

export const EMPTY_FILTERS: FilterState = {
  dateRange: 'all',
  costMin: '',
  costMax: '',
  zip: '',
  beds: '',
  propertyType: '',
  q: '',
  sqftMin: '',
  sqftMax: '',
  contractorKey: '',
}

const num = (s: string) => (s.trim() === '' ? null : Number(s))

export function filterStateToExpression(f: FilterState): FilterSpecification | null {
  const conditions: FilterSpecification[] = []

  if (f.dateRange !== 'all') {
    conditions.push(['<=', ['get', 'daysAgo'], Number(f.dateRange)] as FilterSpecification)
  }
  const costMin = num(f.costMin)
  const costMax = num(f.costMax)
  if (costMin !== null && Number.isFinite(costMin)) {
    conditions.push(['>=', ['get', 'constructionCost'], costMin] as FilterSpecification)
  }
  if (costMax !== null && Number.isFinite(costMax)) {
    conditions.push(['<=', ['get', 'constructionCost'], costMax] as FilterSpecification)
  }
  const sqftMin = num(f.sqftMin)
  const sqftMax = num(f.sqftMax)
  if (sqftMin !== null && Number.isFinite(sqftMin)) {
    conditions.push(['>=', ['get', 'sqft'], sqftMin] as FilterSpecification)
  }
  if (sqftMax !== null && Number.isFinite(sqftMax)) {
    conditions.push(['<=', ['get', 'sqft'], sqftMax] as FilterSpecification)
  }
  if (f.zip) conditions.push(['==', ['get', 'zip'], f.zip] as FilterSpecification)
  if (f.beds) {
    conditions.push(['>=', ['get', 'bedrooms'], Number(f.beds)] as FilterSpecification)
  }
  if (f.propertyType) {
    conditions.push(['==', ['get', 'propertyType'], f.propertyType] as FilterSpecification)
  }
  if (f.contractorKey) {
    conditions.push([
      '==',
      ['upcase', ['coalesce', ['get', 'contractor'], '']],
      f.contractorKey,
    ] as unknown as FilterSpecification)
  }

  // Mirrors the SQL `address ilike %q% OR contractor ilike %q%` so the map shows
  // the same set as the results list. `in` with a string haystack is a
  // substring test in the MapLibre expression spec.
  const q = f.q.trim().toLowerCase()
  if (q) {
    conditions.push([
      'any',
      ['in', q, ['downcase', ['coalesce', ['get', 'address'], '']]],
      ['in', q, ['downcase', ['coalesce', ['get', 'contractor'], '']]],
    ] as unknown as FilterSpecification)
  }

  if (conditions.length === 0) return null
  return ['all', ...conditions] as FilterSpecification
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
  if (f.zip) sp.set('zip', f.zip)
  if (f.propertyType) sp.set('propertyType', f.propertyType)
  if (f.costMin.trim()) sp.set('costMin', f.costMin.trim())
  if (f.costMax.trim()) sp.set('costMax', f.costMax.trim())
  if (f.sqftMin.trim()) sp.set('sqftMin', f.sqftMin.trim())
  if (f.sqftMax.trim()) sp.set('sqftMax', f.sqftMax.trim())
  if (f.beds) sp.set('bedroomsMin', f.beds)
  if (f.contractorKey) sp.set('contractor', f.contractorKey)

  // The map thinks in "days ago"; the API thinks in absolute dates. Convert
  // here so the two surfaces describe the same window.
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
    f.costMin !== '',
    f.costMax !== '',
    f.sqftMin !== '',
    f.sqftMax !== '',
    f.zip !== '',
    f.beds !== '',
    f.propertyType !== '',
    f.q.trim() !== '',
    f.contractorKey !== '',
  ].filter(Boolean).length
}
