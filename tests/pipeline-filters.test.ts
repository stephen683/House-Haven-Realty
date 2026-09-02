import { describe, it, expect } from 'vitest'
import {
  EMPTY_FILTERS,
  filterStateToExpression,
  filterStateToSearchParams,
  activeFilterCount,
  type FilterState,
} from '@/lib/pipeline-filters'

// The map expression and the API query are derived from one FilterState. If
// they drift, the map shows a different set than the results list.

const f = (over: Partial<FilterState> = {}): FilterState => ({ ...EMPTY_FILTERS, ...over })

describe('filterStateToExpression', () => {
  it('is null when nothing is set, so the map shows everything', () => {
    expect(filterStateToExpression(EMPTY_FILTERS)).toBeNull()
  })

  it('builds an all-conditions expression', () => {
    const e = filterStateToExpression(f({ zips: ['37216'], beds: '3' })) as unknown[]
    expect(e[0]).toBe('all')
    expect(e).toHaveLength(3)
  })

  it('ignores blank numeric fields rather than emitting NaN', () => {
    const e = JSON.stringify(filterStateToExpression(f({ costMin: '', sqftMax: '  ' })))
    expect(e).toBe('null')
  })

  it('matches free text against address and contractor, case-insensitively', () => {
    const e = JSON.stringify(filterStateToExpression(f({ q: 'VeRiTaS' })))
    expect(e).toContain('veritas')
    expect(e).toContain('downcase')
    expect(e).toContain('address')
    expect(e).toContain('contractor')
  })

  it('matches contractor on the upper-cased grouping key', () => {
    const e = JSON.stringify(filterStateToExpression(f({ contractorKey: 'CDM CONSTRUCTION' })))
    expect(e).toContain('upcase')
    expect(e).toContain('CDM CONSTRUCTION')
  })
})

describe('filterStateToSearchParams', () => {
  it('omits empty fields', () => {
    expect(filterStateToSearchParams(EMPTY_FILTERS).toString()).toBe('')
  })

  it('maps every filter to its API parameter', () => {
    const sp = filterStateToSearchParams(
      f({ q: 'veritas', zips: ['37216', '37206'], beds: '3', baths: '2.5',
          propertyTypes: ['townhome', 'condo'],
          costMin: '100000', costMax: '900000', sqftMin: '1000', sqftMax: '3000',
          contractorKey: 'CDM CONSTRUCTION' }),
    )
    expect(sp.get('q')).toBe('veritas')
    expect(sp.get('zip')).toBe('37216,37206')
    expect(sp.get('bedroomsMin')).toBe('3')
    expect(sp.get('bathroomsMin')).toBe('2.5')
    expect(sp.get('propertyType')).toBe('townhome,condo')
    expect(sp.get('costMin')).toBe('100000')
    expect(sp.get('costMax')).toBe('900000')
    expect(sp.get('sqftMin')).toBe('1000')
    expect(sp.get('sqftMax')).toBe('3000')
    expect(sp.get('contractor')).toBe('CDM CONSTRUCTION')
  })

  it('converts the map’s days-ago window into an absolute dateFrom', () => {
    const sp = filterStateToSearchParams(f({ dateRange: '30' }))
    const from = new Date(`${sp.get('dateFrom')}T00:00:00Z`).getTime()
    const expected = Date.now() - 30 * 86_400_000
    expect(Math.abs(from - expected)).toBeLessThan(2 * 86_400_000)
  })

  it('carries pagination, sort, and csv format through', () => {
    const sp = filterStateToSearchParams(EMPTY_FILTERS, {
      page: 3, sort: 'construction_cost', direction: 'asc', format: 'csv',
    })
    expect(sp.get('page')).toBe('3')
    expect(sp.get('sort')).toBe('construction_cost')
    expect(sp.get('direction')).toBe('asc')
    expect(sp.get('format')).toBe('csv')
  })

  it('every filter that narrows the map also narrows the query', () => {
    const state = f({ zips: ['37216'], beds: '3', baths: '2', propertyTypes: ['townhome'],
                      costMin: '1', sqftMin: '1', q: 'x', contractorKey: 'Y' })
    expect(filterStateToExpression(state)).not.toBeNull()
    expect(filterStateToSearchParams(state).toString().length).toBeGreaterThan(0)
    expect(activeFilterCount(state)).toBe(8)
  })

  it('multi-select zips and types use `in` with a literal list on the map', () => {
    const e = JSON.stringify(filterStateToExpression(f({ zips: ['37216', '37206'], propertyTypes: ['condo'] })))
    expect(e).toContain('"literal",["37216","37206"]')
    expect(e).toContain('"literal",["condo"]')
  })

  it('a null bedroom count fails a beds filter on the map, exactly like SQL', () => {
    // coalesce(null, -1) >= 3 is false — a permit with no recorded beds must
    // disappear from the map when a beds filter is set, matching the API.
    const e = JSON.stringify(filterStateToExpression(f({ beds: '3' })))
    expect(e).toContain('"coalesce",["get","bedrooms"],-1')
  })
})
