import { describe, it, expect } from 'vitest'
import {
  parseSearchCriteria,
  sanitizeFreeText,
  streetOnly,
  computeCoverage,
  toPublicResult,
  toAgentResult,
  toCsv,
  PUBLIC_SELECT,
  AGENT_SELECT,
  MAX_PAGE_SIZE,
  type PermitRow,
} from '@/lib/permit-search'
import { slugifyBuilder, isRealBuilder, normalizeBuilderName } from '@/lib/builder-slug'

const sp = (s: string) => new URLSearchParams(s)

const ROW: PermitRow = {
  permit_number: '2026046406',
  address: '565 A VERITAS ST',
  zip: '37211',
  property_type: 'townhome',
  construction_cost: 329322,
  sqft: 1939,
  bedrooms: 3,
  bathrooms: 2.5,
  date_issued: '2026-09-01T05:00:00.000Z',
  contractor: 'CDM Construction',
  contractor_key: 'CDM CONSTRUCTION',
  status: 'issued',
  parcel: '133050L00100CO',
  subdivision: 'UNIT 1 HOMES AT 563 AND 565 VERITAS STREET',
  lat: 36.09818455,
  lng: -86.74704602,
}

describe('parseSearchCriteria', () => {
  it('defaults to newest-first, page 1', () => {
    const c = parseSearchCriteria(sp(''))
    expect(c.sort).toBe('date_issued')
    expect(c.direction).toBe('desc')
    expect(c.page).toBe(1)
  })

  it('rejects a sort field that is not allowlisted', () => {
    expect(parseSearchCriteria(sp('sort=contractor')).sort).toBe('date_issued')
    expect(parseSearchCriteria(sp('sort=address;drop')).sort).toBe('date_issued')
  })

  it('clamps pageSize to the maximum', () => {
    expect(parseSearchCriteria(sp('pageSize=99999')).pageSize).toBe(MAX_PAGE_SIZE)
    expect(parseSearchCriteria(sp('pageSize=0')).pageSize).toBe(1)
  })

  it('drops malformed zips and unknown property types', () => {
    const c = parseSearchCriteria(sp('zip=37209,BAD,37216&propertyType=townhome,dragon'))
    expect(c.zips).toEqual(['37209', '37216'])
    expect(c.propertyTypes).toEqual(['townhome'])
  })

  it('rejects non-ISO dates rather than guessing', () => {
    expect(parseSearchCriteria(sp('dateFrom=09/01/2026')).dateFrom).toBeNull()
    expect(parseSearchCriteria(sp('dateFrom=2026-09-01')).dateFrom).toBe('2026-09-01')
  })

  it('normalizes contractor to the upper/trim grouping key', () => {
    expect(parseSearchCriteria(sp('contractor=  cdm construction ')).contractorKey).toBe(
      'CDM CONSTRUCTION',
    )
  })
})

describe('sanitizeFreeText', () => {
  it('strips characters that would break out of a PostgREST or= clause', () => {
    expect(sanitizeFreeText('a,b(c)d%e*f\\g')).toBe('a b c d e f g')
  })

  it('caps length', () => {
    expect(sanitizeFreeText('x'.repeat(500)).length).toBe(120)
  })
})

describe('streetOnly — public redaction', () => {
  it('drops the house number', () => {
    expect(streetOnly('3600 WOODMONT BLVD')).toBe('WOODMONT BLVD')
  })

  it('drops a unit letter after the house number', () => {
    expect(streetOnly('565 A VERITAS ST')).toBe('VERITAS ST')
  })

  it('handles hyphenated house numbers', () => {
    expect(streetOnly('1600-1602 MCGAVOCK ST')).toBe('MCGAVOCK ST')
  })

  it('is safe on null and empty input', () => {
    expect(streetOnly(null)).toBe('')
    expect(streetOnly('')).toBe('')
  })
})

describe('surface separation', () => {
  it('public result carries no house number, parcel, or coordinates', () => {
    const pub = toPublicResult(ROW, slugifyBuilder, isRealBuilder)
    const serialized = JSON.stringify(pub)

    expect(pub.street).toBe('VERITAS ST')
    expect(serialized).not.toContain('565')
    expect(serialized).not.toContain('133050L00100CO')
    expect(serialized).not.toContain('36.098')
    expect('address' in pub).toBe(false)
    expect('parcel' in pub).toBe(false)
    expect('lat' in pub).toBe(false)
  })

  it('agent result carries the full address, parcel, and coordinates', () => {
    const agent = toAgentResult(ROW, slugifyBuilder, isRealBuilder)
    expect(agent.address).toBe('565 A VERITAS ST')
    expect(agent.parcel).toBe('133050L00100CO')
    expect(agent.lat).toBeCloseTo(36.098, 2)
  })

  it('the public column list never names address, parcel, or coordinates as output', () => {
    // address is selected (it is the input to redaction) but parcel/lat/lng are
    // not even read for a public caller.
    expect(PUBLIC_SELECT).not.toContain('parcel')
    expect(PUBLIC_SELECT).not.toContain('lat')
    expect(PUBLIC_SELECT).not.toContain('lng')
    expect(AGENT_SELECT).toContain('parcel')
    expect(AGENT_SELECT).toContain('lat')
  })
})

describe('builder grouping', () => {
  it('collapses casing variants to one key', () => {
    expect(normalizeBuilderName('CDM Construction')).toBe('CDM CONSTRUCTION')
    expect(normalizeBuilderName('  cdm construction  ')).toBe('CDM CONSTRUCTION')
  })

  it('slug matches the form used by /pipeline/builders', () => {
    expect(slugifyBuilder('NVR, INC. T/A RYAN HOMES')).toBe('nvr-inc-ta-ryan-homes')
    expect(slugifyBuilder('LEGACY SOUTH BUILDERS LLC')).toBe('legacy-south-builders-llc')
  })

  it('does not link Metro’s catch-all bucket as a builder', () => {
    const row = { ...ROW, contractor_key: 'SELF CONTRACTOR RESIDENTIAL (SEE APPLICANT INFORMATION)' }
    expect(toPublicResult(row, slugifyBuilder, isRealBuilder).builderSlug).toBeNull()
  })

  it('does not link an empty contractor', () => {
    const row = { ...ROW, contractor: '', contractor_key: '' }
    expect(toPublicResult(row, slugifyBuilder, isRealBuilder).builderSlug).toBeNull()
  })
})

describe('computeCoverage — never claim a window the data lacks', () => {
  it('reports the real span, not the 180 days the sync asks for', () => {
    const c = computeCoverage('2026-05-29T05:00:00.000Z', '2026-09-01T05:00:00.000Z')
    expect(c.days).toBe(95)
    expect(c.label).toContain('95 days')
    expect(c.label).not.toContain('180')
  })

  it('says so when there is no data rather than implying coverage', () => {
    const c = computeCoverage(null, null)
    expect(c.days).toBeNull()
    expect(c.label).toMatch(/unknown/i)
  })
})

describe('toCsv', () => {
  it('escapes commas and quotes in the subdivision field', () => {
    const rows = [toAgentResult({ ...ROW, subdivision: 'LOT 1, "A" BLOCK' }, slugifyBuilder, isRealBuilder)]
    const csv = toCsv(rows)
    expect(csv.split('\n')[0]).toContain('permit_number')
    expect(csv).toContain('"LOT 1, ""A"" BLOCK"')
    expect(csv.split('\n')).toHaveLength(2)
  })
})
