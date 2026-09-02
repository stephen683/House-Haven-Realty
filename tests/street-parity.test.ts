import { describe, it, expect } from 'vitest'
import { streetOnly } from '@/lib/permit-search'
import { slugifyBuilder, normalizeBuilderName } from '@/lib/builder-slug'
import pairs from './fixtures/street-parity.json'

// The public view building_permits_public redacts addresses in SQL. The
// search API and typeahead redact in TypeScript. Both must produce the same
// street for the same address or the two public surfaces would disagree.
// `street` here is what the SQL expression produced for 200 real addresses
// sampled from production.

describe('SQL view redaction == streetOnly()', () => {
  it('agrees on all 200 sampled real addresses', () => {
    const mismatches = pairs
      .map((p) => ({ ...p, ts: streetOnly(p.address) }))
      .filter((p) => p.ts !== p.street)
    expect(mismatches).toEqual([])
  })

  it('removes the house number from every address (numbered streets like 12TH AVE may remain)', () => {
    for (const p of pairs) {
      const houseNumber = p.address.split(' ')[0]
      expect(houseNumber).toMatch(/^\d+$/)
      expect(p.street.startsWith(`${houseNumber} `)).toBe(false)
      expect(p.street).not.toBe(p.address)
      expect(streetOnly(p.address).startsWith(`${houseNumber} `)).toBe(false)
    }
  })
})

describe('BuilderCard links use the same slug as /pipeline/builders', () => {
  it('collapses punctuation the way the builders pages do', () => {
    // The old BuilderCard slugify produced nvr-inc-t-a-ryan-homes, which 404s.
    expect(slugifyBuilder(normalizeBuilderName('NVR, Inc. T/A Ryan Homes'))).toBe('nvr-inc-ta-ryan-homes')
    expect(slugifyBuilder(normalizeBuilderName('J CORE PROPERTIES LLC DBA PHILLIPS BUILDERS LLC')))
      .toBe('j-core-properties-llc-dba-phillips-builders-llc')
  })
})
