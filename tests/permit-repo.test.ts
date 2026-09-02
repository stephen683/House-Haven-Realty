import { describe, it, expect } from 'vitest'
import { rowToPermit, trimForMap, MAP_DESCRIPTION_CHARS } from '@/lib/permit-repo'

// The cache must produce the exact shape the live ArcGIS path produces, or the
// map, the header stats and the search silently describe different corpora.

const ROW = {
  permit_number: '2026047796', permit_type: 'Building Residential - New',
  subtype: 'Single Family Residence', date_issued: '2026-09-01T05:00:00+00:00',
  address: '784 SUMMIT OAKS CT', city: 'NASHVILLE', zip: '37221',
  description: 'To construct a 4BR, 3.5BA single family residence',
  construction_cost: 636254, contractor: 'ART BUILDING INC', status: 'issued',
  parcel: '128150D08200CO', subdivision: 'LOT 82 STILL SPRINGS RIDGE PH1',
  lat: 36.08395689, lng: -86.92717614, council_district: 35, census_tract: 47037018400,
  sqft: 3459, bedrooms: 4, bathrooms: 3.5, property_type: 'single_family', unit_count: 1,
}

describe('rowToPermit', () => {
  it('maps every column the map and detail panel read', () => {
    const p = rowToPermit(ROW)
    expect(p.permitNumber).toBe('2026047796')
    expect(p.propertyType).toBe('single_family')
    expect(p.bathrooms).toBe(3.5)
    expect(p.lat).toBeCloseTo(36.0839, 3)
    expect(p.unitCount).toBe(1)
    expect(p.daysAgo).toBeGreaterThanOrEqual(0)
  })

  it('preserves multi-unit counts', () => {
    expect(rowToPermit({ ...ROW, unit_count: 16 }).unitCount).toBe(16)
  })

  it('never emits an unknown property type string', () => {
    expect(rowToPermit({ ...ROW, property_type: 'castle' }).propertyType).toBe('unknown')
  })

  it('tolerates a null date without throwing', () => {
    const p = rowToPermit({ ...ROW, date_issued: null })
    expect(p.dateIssued).toBeNull()
    expect(p.daysAgo).toBe(999)
  })
})

describe('trimForMap', () => {
  it('leaves short descriptions alone', () => {
    expect(trimForMap('To construct a 4BR 3.5BA home')).toBe('To construct a 4BR 3.5BA home')
  })

  it('cuts long boilerplate at a word boundary and marks it', () => {
    const long = ('To construct a 2295 sq ft single family house with 3 bedrooms. ' +
      'Not to build over or obstruct easements. ').repeat(20)
    const out = trimForMap(long)
    expect(out.length).toBeLessThanOrEqual(MAP_DESCRIPTION_CHARS + 1)
    expect(out.endsWith('…')).toBe(true)
    expect(out).not.toMatch(/\s…$/)
  })

  it('collapses whitespace and tolerates null', () => {
    expect(trimForMap('a   b\n\nc')).toBe('a b c')
    expect(trimForMap(null)).toBe('')
  })
})
