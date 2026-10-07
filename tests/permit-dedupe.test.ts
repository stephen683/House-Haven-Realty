import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { dedupeByPermitNumber } from '@/lib/permits'
import type { NormalizedPermit } from '@/lib/permits'

// The daily sync died on 2026-10-02 with
//   "ON CONFLICT DO UPDATE command cannot affect row a second time"
// and stayed dead for six days. ArcGIS returned one permit number across
// several buildings; dedupeByBuilding keeps those as separate rows, and
// permit_number is the upsert's conflict key. Every page kept serving 200
// while the map quietly stopped updating.

function permit(over: Partial<NormalizedPermit> = {}): NormalizedPermit {
  return {
    permitNumber: 'P-1', type: 'Building Residential - New', subtype: '',
    dateIssued: '2026-10-01', dateEntered: null, address: '100 MAIN ST',
    city: 'Nashville', zip: '37209', description: 'New single family',
    constructionCost: 300000, contractor: 'ACME', status: 'issued',
    parcel: '', subdivision: '', lat: 36.1, lng: -86.8,
    councilDistrict: null, censusTract: null, sqft: 2000, bedrooms: 3,
    bathrooms: 2, propertyType: 'single_family', daysAgo: 1, unitCount: 1,
    ...over,
  }
}

describe('dedupeByPermitNumber', () => {
  it('collapses rows sharing a permit number so the upsert key is unique', () => {
    const out = dedupeByPermitNumber([
      permit({ address: '100 MAIN ST' }),
      permit({ address: '102 MAIN ST' }),
      permit({ address: '104 MAIN ST' }),
    ])
    expect(out).toHaveLength(1)
    expect(new Set(out.map((p) => p.permitNumber)).size).toBe(1)
  })

  it('guarantees a unique conflict key for any input — the invariant the DB needs', () => {
    const messy = [
      permit({ permitNumber: 'A' }), permit({ permitNumber: 'A' }),
      permit({ permitNumber: 'B' }), permit({ permitNumber: 'C' }),
      permit({ permitNumber: 'C' }), permit({ permitNumber: 'C' }),
    ]
    const keys = dedupeByPermitNumber(messy).map((p) => p.permitNumber)
    expect(keys).toHaveLength(new Set(keys).size)
  })

  it('leaves distinct permit numbers untouched', () => {
    const out = dedupeByPermitNumber([permit({ permitNumber: 'A' }), permit({ permitNumber: 'B' })])
    expect(out).toHaveLength(2)
  })

  it('adds up unit counts, because the rows are distinct buildings', () => {
    const out = dedupeByPermitNumber([
      permit({ unitCount: 2 }), permit({ unitCount: 3 }),
    ])
    expect(out[0].unitCount).toBe(5)
  })

  it('takes the max construction cost, never the sum', () => {
    // A permit's cost is usually repeated in full on every row; summing it
    // would inflate the saturation scores that read this corpus.
    const out = dedupeByPermitNumber([
      permit({ constructionCost: 400000 }), permit({ constructionCost: 400000 }),
    ])
    expect(out[0].constructionCost).toBe(400000)
  })

  it('keeps the most complete record as the representative', () => {
    const sparse = permit({ address: '', lat: null, lng: null, description: '', sqft: null })
    const full = permit({ address: '200 OAK ST', sqft: 2400 })
    expect(dedupeByPermitNumber([sparse, full])[0].address).toBe('200 OAK ST')
    expect(dedupeByPermitNumber([full, sparse])[0].address).toBe('200 OAK ST')
  })

  it('drops rows with no permit number rather than colliding them on empty string', () => {
    expect(dedupeByPermitNumber([permit({ permitNumber: '' })])).toHaveLength(0)
  })

  it('handles an empty feed', () => {
    expect(dedupeByPermitNumber([])).toEqual([])
  })
})

describe('the sync route cannot regress', () => {
  const src = fs.readFileSync(path.join(process.cwd(), 'app/api/cron/sync-permits/route.ts'), 'utf8')

  it('dedupes before building the upsert payload', () => {
    expect(src).toContain('dedupeByPermitNumber(permits)')
    expect(src.indexOf('dedupeByPermitNumber(permits)')).toBeLessThan(src.indexOf('.upsert('))
  })

  it('upserts the deduped array, not the raw fetch', () => {
    expect(src).toContain('unique.map((p) => ({')
    expect(src).not.toMatch(/const rows = permits\.map/)
  })
})
